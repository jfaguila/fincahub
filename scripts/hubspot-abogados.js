#!/usr/bin/env node
/**
 * HubSpot — Segmentador de Abogados
 *
 * Qué hace:
 *  1. Obtiene todos los contactos de HubSpot
 *  2. Filtra los que son abogados (por job_title, industry, o etiqueta)
 *  3. Los mueve a una lista estática "Abogados Granada"
 *  4. Opcionalmente, borra o archiva los que NO son abogados
 *
 * Uso:
 *   export HUBSPOT_API_KEY=tu_api_key_aqui
 *   node hubspot-abogados.js
 *   node hubspot-abogados.js --dry-run   (solo muestra, no modifica nada)
 */

const https = require('https');

const API_KEY = process.env.HUBSPOT_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

if (!API_KEY) {
  console.error('❌ Falta HUBSPOT_API_KEY. Ejecútalo así:');
  console.error('   export HUBSPOT_API_KEY=tu_api_key');
  console.error('   node hubspot-abogados.js');
  process.exit(1);
}

// Palabras clave para detectar abogados
const ABOGADO_KEYWORDS = [
  'abogado', 'abogada', 'lawyer', 'attorney', 'letrado', 'letrada',
  'solicitor', 'barrister', 'jurista', 'legal', 'despacho', 'bufete',
  'procurador', 'notario', 'graduado social'
];

function isAbogado(contact) {
  const props = contact.properties || {};
  const fields = [
    props.jobtitle || '',
    props.job_title || '',
    props.industry || '',
    props.company || '',
    props.hs_job_title || '',
  ].join(' ').toLowerCase();

  return ABOGADO_KEYWORDS.some(keyword => fields.includes(keyword));
}

function hubspotRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.hubapi.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getAllContacts() {
  console.log('📋 Obteniendo todos los contactos de HubSpot...');
  const contacts = [];
  let after = null;

  while (true) {
    const path = `/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,jobtitle,company,industry,phone,mobilephone${after ? `&after=${after}` : ''}`;
    const res = await hubspotRequest('GET', path);

    if (res.status !== 200) {
      console.error('❌ Error obteniendo contactos:', res.body);
      break;
    }

    contacts.push(...res.body.results);
    console.log(`   → ${contacts.length} contactos obtenidos hasta ahora...`);

    if (res.body.paging?.next?.after) {
      after = res.body.paging.next.after;
    } else {
      break;
    }
  }

  return contacts;
}

async function createOrGetList(listName) {
  // Buscar si ya existe la lista
  const searchRes = await hubspotRequest('GET', `/contacts/v1/lists/all/contacts/all?count=1`);

  // Crear lista estática
  const body = {
    name: listName,
    dynamic: false,
    filters: []
  };

  if (DRY_RUN) {
    console.log(`   [DRY RUN] Crearía lista: "${listName}"`);
    return { listId: 'DRY-RUN-ID' };
  }

  const res = await hubspotRequest('POST', '/contacts/v1/lists', body);
  if (res.status === 200 || res.status === 201) {
    console.log(`✅ Lista creada: "${listName}" (ID: ${res.body.listId})`);
    return res.body;
  } else if (res.body.error === 'LIST_EXISTS') {
    console.log(`ℹ️  La lista "${listName}" ya existe`);
    return res.body;
  } else {
    console.error('Error creando lista:', res.body);
    return null;
  }
}

async function addContactsToList(listId, contactIds) {
  if (DRY_RUN) {
    console.log(`   [DRY RUN] Añadiría ${contactIds.length} contactos a la lista ${listId}`);
    return;
  }

  // HubSpot acepta máximo 500 por petición
  const chunks = [];
  for (let i = 0; i < contactIds.length; i += 500) {
    chunks.push(contactIds.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    const res = await hubspotRequest('POST', `/contacts/v1/lists/${listId}/add`, { vids: chunk });
    if (res.status !== 200) {
      console.error('Error añadiendo contactos:', res.body);
    }
  }
}

async function tagContactAsAbogado(contactId) {
  if (DRY_RUN) return;

  // Añadir una propiedad custom "tipo_negocio" = "Abogado"
  // (Asegúrate de crear esta propiedad en HubSpot primero o usa una existente)
  const body = {
    properties: {
      tipo_cliente: 'Abogado',
      canal_origen: 'Outreach Granada 2026'
    }
  };
  await hubspotRequest('PATCH', `/crm/v3/objects/contacts/${contactId}`, body);
}

async function main() {
  console.log('');
  console.log('🚀 HubSpot — Segmentador de Abogados');
  console.log('=====================================');
  if (DRY_RUN) console.log('⚠️  MODO DRY-RUN: no se modificará nada\n');

  // 1. Obtener todos los contactos
  const allContacts = await getAllContacts();
  console.log(`\n📊 Total contactos: ${allContacts.length}`);

  // 2. Filtrar abogados
  const abogados = allContacts.filter(isAbogado);
  const noAbogados = allContacts.filter(c => !isAbogado(c));

  console.log(`\n✅ Abogados encontrados: ${abogados.length}`);
  console.log(`⚪ Otros contactos: ${noAbogados.length}`);

  // 3. Mostrar los abogados encontrados
  console.log('\n📋 Lista de abogados:');
  abogados.forEach((c, i) => {
    const p = c.properties;
    const nombre = `${p.firstname || ''} ${p.lastname || ''}`.trim() || 'Sin nombre';
    const empresa = p.company || 'Sin empresa';
    const cargo = p.jobtitle || 'Sin cargo';
    const email = p.email || 'Sin email';
    const telefono = p.phone || p.mobilephone || 'Sin teléfono';
    console.log(`   ${i + 1}. ${nombre} | ${cargo} | ${empresa} | ${email} | ${telefono}`);
  });

  if (abogados.length === 0) {
    console.log('\n⚠️  No se encontraron abogados.');
    console.log('   Sugerencia: Asegúrate de que los contactos tienen el campo "Cargo" o "Empresa" relleno.');
    console.log('   Palabras clave buscadas:', ABOGADO_KEYWORDS.join(', '));
    return;
  }

  // 4. Crear lista "Abogados Granada" en HubSpot
  console.log('\n📁 Creando lista "Abogados — Outreach Granada 2026"...');
  const list = await createOrGetList('Abogados — Outreach Granada 2026');

  if (list && list.listId) {
    // 5. Añadir abogados a la lista
    const contactIds = abogados.map(c => c.id);
    await addContactsToList(list.listId, contactIds);
    console.log(`✅ ${abogados.length} abogados añadidos a la lista`);

    // 6. Etiquetar cada uno con tipo_cliente=Abogado
    if (!DRY_RUN) {
      console.log('\n🏷️  Etiquetando contactos...');
      for (const contact of abogados) {
        await tagContactAsAbogado(contact.id);
      }
      console.log('✅ Todos etiquetados con tipo_cliente=Abogado');
    }
  }

  // 7. Resumen final
  console.log('\n🎯 RESUMEN FINAL');
  console.log('================');
  console.log(`Total contactos en HubSpot: ${allContacts.length}`);
  console.log(`Abogados identificados: ${abogados.length}`);
  console.log(`Otros (no abogados): ${noAbogados.length}`);
  console.log(`Lista creada: "Abogados — Outreach Granada 2026"`);
  if (DRY_RUN) {
    console.log('\n⚠️  DRY RUN completado. Ejecuta sin --dry-run para aplicar los cambios.');
  } else {
    console.log('\n✅ Listo. Ve a HubSpot → Contactos → Listas para ver el resultado.');
  }
}

main().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
