#!/usr/bin/env node
/**
 * Sube los archivos de asistencia.io a Google Drive
 *
 * PASO 1 — Instalar dependencias (solo la primera vez):
 *   npm install googleapis open
 *
 * PASO 2 — Obtener credenciales de Google:
 *   1. Ve a https://console.cloud.google.com
 *   2. Crea un proyecto nuevo (o usa uno existente)
 *   3. Menú → "APIs y servicios" → "Biblioteca" → busca "Google Drive API" → Habilitar
 *   4. Menú → "APIs y servicios" → "Credenciales" → "Crear credenciales" → "ID de cliente OAuth"
 *   5. Tipo: "Aplicación de escritorio" → dale un nombre → Crear
 *   6. Descarga el JSON → guárdalo como "credentials.json" en la misma carpeta que este script
 *
 * PASO 3 — Ejecutar:
 *   node scripts/upload-to-drive.js
 *   (se abrirá el navegador para que des permiso con tu cuenta de Google)
 *
 * RESULTADO:
 *   Crea la carpeta "asistencia.io — Marketing 2026" en tu Google Drive
 *   y sube todos los archivos del proyecto.
 */

const fs   = require('fs');
const path = require('path');
const http = require('http');

// ─── Comprobar dependencias ───────────────────────────────────────────────────

let google, open;
try {
  google = require('googleapis').google;
} catch {
  console.error('\n❌ Falta el paquete "googleapis". Ejecúta:');
  console.error('   npm install googleapis open\n');
  process.exit(1);
}
try {
  open = require('open');
} catch {
  open = null; // lo abrimos manualmente si no está
}

// ─── Rutas de los archivos a subir ───────────────────────────────────────────

const ROOT = path.join(__dirname, '..');

const FILES = [
  {
    local: path.join(ROOT, 'marketing/linkedin/posts-linkedin.ics'),
    name:  '📅 Posts LinkedIn — Google Calendar.ics',
    mime:  'text/calendar',
    folder: 'LinkedIn'
  },
  {
    local: path.join(ROOT, 'marketing/linkedin/calendario-4-semanas.md'),
    name:  '📝 Calendario 4 semanas — Contenido.md',
    mime:  'text/markdown',
    folder: 'LinkedIn'
  },
  {
    local: path.join(ROOT, 'marketing/calculadora-roi/lovable-prompt.md'),
    name:  '🛠️ Prompt Lovable — Calculadora ROI.md',
    mime:  'text/markdown',
    folder: 'Calculadora ROI'
  },
  {
    local: path.join(ROOT, 'scripts/outreach-router.js'),
    name:  '🤖 outreach-router.js (WhatsApp + Email)',
    mime:  'application/javascript',
    folder: 'Scripts'
  },
  {
    local: path.join(ROOT, 'scripts/hubspot-abogados.js'),
    name:  '🤖 hubspot-abogados.js (Segmentación)',
    mime:  'application/javascript',
    folder: 'Scripts'
  },
  {
    local: path.join(ROOT, 'marketing/outreach/emails-secuencia.md'),
    name:  '📧 Secuencia de emails — Abogados.md',
    mime:  'text/markdown',
    folder: 'Outreach'
  },
  {
    local: path.join(ROOT, 'marketing/COMO-EMPEZAR-HOY.md'),
    name:  '🚀 Cómo empezar hoy.md',
    mime:  'text/markdown',
    folder: null // raíz de la carpeta Drive
  },
].filter(f => fs.existsSync(f.local));

// ─── OAuth2 ───────────────────────────────────────────────────────────────────

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH        = path.join(__dirname, '.drive-token.json');
const SCOPES            = ['https://www.googleapis.com/auth/drive.file'];
const REDIRECT_PORT     = 3737;
const REDIRECT_URI      = `http://localhost:${REDIRECT_PORT}`;

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('\n❌ No encuentro "credentials.json".');
    console.error('   Sigue las instrucciones del PASO 2 al inicio de este archivo.\n');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const creds = raw.installed || raw.web;
  return creds;
}

function getAuthClient(creds) {
  return new google.auth.OAuth2(
    creds.client_id,
    creds.client_secret,
    REDIRECT_URI
  );
}

async function authorize() {
  const creds  = loadCredentials();
  const client = getAuthClient(creds);

  // Usar token guardado si existe
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    client.setCredentials(token);
    console.log('✅ Sesión de Google reutilizada');
    return client;
  }

  // OAuth flow: abrir navegador y escuchar el callback
  const authUrl = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('\n🌐 Abriendo tu navegador para autorizar...');
  console.log('   Si no se abre automáticamente, copia esta URL:');
  console.log('  ', authUrl, '\n');

  if (open) await open(authUrl);

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get('code');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2>✅ ¡Autorizado!</h2>
          <p>Ya puedes cerrar esta pestaña. El script está subiendo los archivos...</p>
        </body></html>
      `);
      server.close();
      if (code) resolve(code);
      else reject(new Error('No se recibió el código de autorización'));
    });
    server.listen(REDIRECT_PORT, () => {
      console.log(`   Esperando autorización en puerto ${REDIRECT_PORT}...`);
    });
    server.on('error', reject);
    // Timeout de 3 minutos
    setTimeout(() => { server.close(); reject(new Error('Timeout')); }, 180000);
  });

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ Autorización completada\n');
  return client;
}

// ─── Google Drive: crear carpeta ──────────────────────────────────────────────

async function createFolder(drive, name, parentId = null) {
  const meta = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentId ? { parents: [parentId] } : {})
  };
  const res = await drive.files.create({ requestBody: meta, fields: 'id,name' });
  return res.data;
}

async function uploadFile(drive, filePath, fileName, mimeType, parentId) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [parentId],
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath),
    },
    fields: 'id,name,webViewLink'
  });
  return res.data;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('🚀 Subir archivos a Google Drive — asistencia.io');
  console.log('=================================================');

  // 1. Autenticar
  const auth  = await authorize();
  const drive = google.drive({ version: 'v3', auth });

  // 2. Crear carpeta raíz
  console.log('\n📁 Creando carpeta "asistencia.io — Marketing 2026"...');
  const root = await createFolder(drive, 'asistencia.io — Marketing 2026');
  console.log(`   → Carpeta creada (ID: ${root.id})`);

  // 3. Crear subcarpetas
  const subfolders = {};
  const subfolderNames = [...new Set(FILES.map(f => f.folder).filter(Boolean))];
  for (const name of subfolderNames) {
    const folder = await createFolder(drive, name, root.id);
    subfolders[name] = folder.id;
    console.log(`   → Subcarpeta: ${name}`);
  }

  // 4. Subir archivos
  console.log('\n📤 Subiendo archivos...');
  const links = [];

  for (const file of FILES) {
    const parentId = file.folder ? subfolders[file.folder] : root.id;
    try {
      const uploaded = await uploadFile(drive, file.local, file.name, file.mime, parentId);
      console.log(`   ✅ ${file.name}`);
      links.push({ name: file.name, link: uploaded.webViewLink });
    } catch (err) {
      console.error(`   ❌ ${file.name}: ${err.message}`);
    }
  }

  // 5. Resultado
  console.log('\n🎉 ¡Listo! Carpeta en tu Google Drive:');
  console.log(`   https://drive.google.com/drive/folders/${root.id}`);
  console.log('\n📄 Archivos subidos:');
  links.forEach(l => console.log(`   • ${l.name}`));
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  if (err.message.includes('invalid_client')) {
    console.error('   → El credentials.json no es válido. Descárgalo de nuevo desde Google Cloud Console.');
  }
  process.exit(1);
});
