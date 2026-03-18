#!/usr/bin/env node
/**
 * Outreach Router — asistencia.io
 *
 * Lee los contactos de HubSpot y los clasifica por canal:
 *   → Tiene móvil  → WhatsApp via Waha
 *   → Solo email   → Email via Brevo
 *   → Ambos        → WhatsApp (prioritario) + email como fallback
 *   → Ninguno      → Lista "sin canal" para completar manualmente
 *
 * Uso:
 *   export HUBSPOT_ACCESS_TOKEN=xxx
 *   node outreach-router.js              # clasifica y exporta CSVs
 *   node outreach-router.js --send       # envía (necesita Waha + Brevo listos)
 *   node outreach-router.js --dry-run    # solo muestra, no envía ni modifica
 *
 * Outputs:
 *   outreach-whatsapp.csv   → para Waha
 *   outreach-email.csv      → para Brevo
 *   outreach-sin-canal.csv  → contactos incompletos
 */

const https = require('https');
const fs = require('fs');

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY;
const WAHA_URL      = process.env.WAHA_URL || 'http://localhost:3000';
const WAHA_SESSION  = process.env.WAHA_SESSION || 'default';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const DRY_RUN = process.argv.includes('--dry-run');
const SEND    = process.argv.includes('--send');

if (!HUBSPOT_TOKEN) {
  console.error('❌ Falta HUBSPOT_ACCESS_TOKEN');
  console.error('   export HUBSPOT_ACCESS_TOKEN=tu_token');
  process.exit(1);
}

// ─── Plantillas de mensajes ───────────────────────────────────────────────────

const WHATSAPP_TEMPLATE = (nombre) => `Hola ${nombre || 'buenas'} 👋

Soy Jorge, de asistencia.io.

Vi que lleváis un despacho y quería preguntarte algo rápido: ¿sabéis cuántas consultas os entran fuera de horario y se pierden?

Tenemos un asistente de IA que las atiende automáticamente — el sistema se paga solo en las primeras horas.

Si te parece, en 15 min te lo muestro en directo. ¿Esta semana te viene bien?`;

const EMAIL_SUBJECT = `¿Cuánto está perdiendo tu despacho fuera de horario?`;

const EMAIL_BODY = (nombre) => `<p>Hola ${nombre || ''},</p>

<p>Soy Jorge Fernández, CEO de <a href="https://asistencia.io">asistencia.io</a>.</p>

<p>Te escribo porque trabajamos con despachos de abogados en Granada ayudándoles a no perder consultas fuera de horario.</p>

<p><strong>El problema que resolvemos:</strong> cada semana, la mayoría de despachos pierden entre 15 y 25 consultas telefónicas fuera de su horario de atención. A 300-500€ por cliente, eso son miles de euros al mes.</p>

<p>Nuestro asistente de IA atiende esas consultas 24/7, cualifica al cliente y agenda la cita directamente en tu calendario.</p>

<p><strong>¿Te interesa ver los números concretos para tu despacho?</strong> En 15 minutos te lo muestro en directo, sin compromiso.</p>

<p><a href="https://cal.com/asistencia-io">→ Reserva aquí una demo de 15 min</a></p>

<p>Un saludo,<br>
Jorge Fernández Águila<br>
CEO · asistencia.io</p>`;

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function httpRequest(url, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : require('http');
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };
    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── HubSpot: obtener contactos ───────────────────────────────────────────────

async function getAllContacts() {
  console.log('📋 Obteniendo contactos de HubSpot...');
  const contacts = [];
  let after = null;

  while (true) {
    const qs = `limit=100&properties=firstname,lastname,email,phone,mobilephone,jobtitle,company${after ? `&after=${after}` : ''}`;
    const res = await request({
      hostname: 'api.hubapi.com',
      path: `/crm/v3/objects/contacts?${qs}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${HUBSPOT_TOKEN}` }
    });

    if (res.status !== 200) {
      console.error('❌ Error HubSpot:', res.body?.message || res.body);
      break;
    }

    contacts.push(...res.body.results);
    if (res.body.paging?.next?.after) {
      after = res.body.paging.next.after;
    } else break;
  }

  console.log(`   → ${contacts.length} contactos totales`);
  return contacts;
}

// ─── Clasificar por canal ─────────────────────────────────────────────────────

function normalizePhone(raw) {
  if (!raw) return null;
  // Eliminar espacios, guiones, paréntesis
  let p = raw.replace(/[\s\-().]/g, '');
  // Añadir prefijo España si no tiene internacional
  if (p.startsWith('6') || p.startsWith('7')) p = '34' + p;
  if (p.startsWith('+')) p = p.slice(1);
  // Validar: móvil español = 346XXXXXXXX o 347XXXXXXXX (11 dígitos con 34)
  return /^346\d{8}$|^347\d{8}$/.test(p) ? p : null;
}

function classify(contacts) {
  const whatsapp = [];
  const email    = [];
  const sinCanal = [];

  for (const c of contacts) {
    const p = c.properties;
    const nombre   = `${p.firstname || ''} ${p.lastname || ''}`.trim();
    const movil    = normalizePhone(p.mobilephone) || normalizePhone(p.phone);
    const correo   = p.email?.trim() || null;
    const empresa  = p.company || '';
    const cargo    = p.jobtitle || '';

    const base = { id: c.id, nombre, empresa, cargo, movil, correo };

    if (movil) {
      whatsapp.push({ ...base, canal: 'whatsapp', fallback_email: correo });
    } else if (correo) {
      email.push({ ...base, canal: 'email' });
    } else {
      sinCanal.push({ ...base, canal: 'sin_canal' });
    }
  }

  return { whatsapp, email, sinCanal };
}

// ─── Exportar CSVs ────────────────────────────────────────────────────────────

function toCSV(rows, fields) {
  const header = fields.join(',');
  const lines = rows.map(r =>
    fields.map(f => `"${(r[f] || '').toString().replace(/"/g, '""')}"`).join(',')
  );
  return [header, ...lines].join('\n');
}

function exportCSVs(classified) {
  const { whatsapp, email, sinCanal } = classified;

  const waCSV = toCSV(whatsapp, ['nombre', 'empresa', 'cargo', 'movil', 'fallback_email']);
  const emCSV = toCSV(email,    ['nombre', 'empresa', 'cargo', 'correo']);
  const scCSV = toCSV(sinCanal, ['id', 'nombre', 'empresa', 'cargo']);

  fs.writeFileSync('outreach-whatsapp.csv', waCSV);
  fs.writeFileSync('outreach-email.csv',    emCSV);
  fs.writeFileSync('outreach-sin-canal.csv', scCSV);

  console.log(`\n📁 CSVs exportados:`);
  console.log(`   outreach-whatsapp.csv  → ${whatsapp.length} contactos (canal WhatsApp)`);
  console.log(`   outreach-email.csv     → ${email.length} contactos (canal Email)`);
  console.log(`   outreach-sin-canal.csv → ${sinCanal.length} contactos (sin datos de contacto)`);
}

// ─── Envío WhatsApp via Waha ──────────────────────────────────────────────────

async function sendWhatsApp(contact) {
  const text = WHATSAPP_TEMPLATE(contact.nombre.split(' ')[0]);
  const chatId = `${contact.movil}@c.us`;

  if (DRY_RUN) {
    console.log(`   [DRY-RUN] WhatsApp → ${contact.nombre} (${contact.movil}): "${text.slice(0, 60)}..."`);
    return true;
  }

  try {
    const res = await httpRequest(
      `${WAHA_URL}/api/sendText`,
      'POST',
      { chatId, text, session: WAHA_SESSION },
      {}
    );
    return res.status === 200 || res.status === 201;
  } catch (e) {
    console.error(`   ❌ Waha error (${contact.nombre}):`, e.message);
    return false;
  }
}

// ─── Envío Email via Brevo ────────────────────────────────────────────────────

async function sendEmail(contact) {
  if (!BREVO_API_KEY) {
    console.error('   ❌ Falta BREVO_API_KEY para enviar emails');
    return false;
  }

  const primerNombre = contact.nombre.split(' ')[0] || 'Estimado/a';

  if (DRY_RUN) {
    console.log(`   [DRY-RUN] Email → ${contact.nombre} <${contact.correo}>`);
    return true;
  }

  try {
    const res = await request({
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    }, {
      sender: { name: 'Jorge Fernández — asistencia.io', email: 'jorge@asistencia.io' },
      to: [{ email: contact.correo, name: contact.nombre }],
      subject: EMAIL_SUBJECT,
      htmlContent: EMAIL_BODY(primerNombre)
    });
    return res.status === 201;
  } catch (e) {
    console.error(`   ❌ Brevo error (${contact.nombre}):`, e.message);
    return false;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('🚀 Outreach Router — asistencia.io');
  console.log('====================================');
  if (DRY_RUN) console.log('⚠️  DRY-RUN: no se enviará ni modificará nada\n');

  // 1. Obtener contactos
  const contacts = await getAllContacts();

  // 2. Clasificar
  const classified = classify(contacts);
  const { whatsapp, email, sinCanal } = classified;

  console.log('\n📊 Clasificación por canal:');
  console.log(`   📱 WhatsApp (tienen móvil): ${whatsapp.length}`);
  console.log(`   📧 Email (solo correo):      ${email.length}`);
  console.log(`   ❓ Sin canal:                ${sinCanal.length}`);

  // 3. Exportar CSVs siempre
  exportCSVs(classified);

  // 4. Enviar si se pide
  if (SEND || DRY_RUN) {
    console.log('\n📤 Enviando mensajes...\n');

    // WhatsApp
    let waOk = 0, waFail = 0;
    for (const c of whatsapp) {
      const ok = await sendWhatsApp(c);
      ok ? waOk++ : waFail++;
      // Pausa entre mensajes para no ser spam
      if (!DRY_RUN) await new Promise(r => setTimeout(r, 3000));
    }

    // Email
    let emOk = 0, emFail = 0;
    for (const c of email) {
      const ok = await sendEmail(c);
      ok ? emOk++ : emFail++;
      if (!DRY_RUN) await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n✅ RESULTADO ENVÍO:');
    console.log(`   WhatsApp: ${waOk} enviados, ${waFail} fallidos`);
    console.log(`   Email:    ${emOk} enviados, ${emFail} fallidos`);
  } else {
    console.log('\nℹ️  Añade --send para enviar los mensajes.');
    console.log('   Añade --dry-run para simular sin enviar.');
  }

  console.log('\n✅ Listo.');
}

main().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
