#!/usr/bin/env node
/**
 * Sube todos los archivos de la carpeta Marketing a Google Drive
 *
 * PASO 1 — Instalar dependencias (solo la primera vez):
 *   Abre PowerShell en la carpeta scripts y ejecuta:
 *   npm install googleapis open
 *
 * PASO 2 — Credenciales Google (5 min, solo una vez):
 *   1. Ve a https://console.cloud.google.com
 *   2. Crea proyecto → ponle cualquier nombre
 *   3. APIs y servicios → Biblioteca → "Google Drive API" → Habilitar
 *   4. APIs y servicios → Credenciales → Crear credenciales → ID de cliente OAuth 2.0
 *   5. Tipo: Aplicación de escritorio → Crear
 *   6. Descarga el JSON → guárdalo como credentials.json en esta misma carpeta (scripts)
 *
 * PASO 3 — Ejecutar desde la carpeta scripts:
 *   node upload-to-drive.js
 */

const fs   = require('fs');
const path = require('path');
const http = require('http');

// ─── Dependencias ─────────────────────────────────────────────────────────────

let google, open;
try {
  google = require('googleapis').google;
} catch {
  console.error('\n❌ Falta "googleapis". Ejecuta primero:');
  console.error('   npm install googleapis open\n');
  process.exit(1);
}
try { open = require('open'); } catch { open = null; }

// ─── Configuración ────────────────────────────────────────────────────────────

// La carpeta Marketing está un nivel arriba de scripts
const MARKETING_ROOT   = path.join(__dirname, '..');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH       = path.join(__dirname, '.drive-token.json');
const DRIVE_FOLDER     = 'asistencia.io — Marketing 2026';

const SCOPES        = ['https://www.googleapis.com/auth/drive.file'];
const REDIRECT_PORT = 3737;
const REDIRECT_URI  = `http://localhost:${REDIRECT_PORT}`;

// Extensiones a subir
const ALLOWED_EXT = ['.ics', '.md', '.js', '.csv', '.txt', '.pdf', '.png', '.jpg'];

// Archivos a ignorar
const IGNORE = ['upload-to-drive.js', '.drive-token.json', 'node_modules', '.git'];

// ─── Recoger archivos recursivamente ─────────────────────────────────────────

function collectFiles(dir, baseDir = dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE.some(i => entry.name.startsWith(i) || entry.name === i)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath  = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir));
    } else if (ALLOWED_EXT.includes(path.extname(entry.name).toLowerCase())) {
      results.push({ fullPath, relPath, name: entry.name });
    }
  }

  return results;
}

function mimeFor(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.ics': 'text/calendar',
    '.md':  'text/markdown',
    '.js':  'application/javascript',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };
  return map[ext] || 'application/octet-stream';
}

// ─── OAuth2 ───────────────────────────────────────────────────────────────────

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('\n❌ No encuentro credentials.json en la carpeta scripts.');
    console.error('   Sigue el PASO 2 de las instrucciones de arriba.\n');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  return raw.installed || raw.web;
}

async function authorize() {
  const creds  = loadCredentials();
  const client = new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);

  if (fs.existsSync(TOKEN_PATH)) {
    client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
    console.log('✅ Sesión de Google reutilizada');
    return client;
  }

  const authUrl = client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('\n🌐 Abriendo navegador para autorizar...');
  console.log('   Si no se abre solo, copia esta URL en el navegador:');
  console.log('\n  ', authUrl, '\n');
  if (open) await open(authUrl);

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<html><body style="font-family:sans-serif;text-align:center;padding:80px">
        <h2>✅ ¡Autorizado!</h2>
        <p>Cierra esta pestaña. El script está subiendo tus archivos...</p>
      </body></html>`);
      server.close();
      code ? resolve(code) : reject(new Error('Sin código'));
    });
    server.listen(REDIRECT_PORT);
    setTimeout(() => { server.close(); reject(new Error('Timeout (3 min)')); }, 180000);
  });

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ Autorización completada\n');
  return client;
}

// ─── Drive helpers ────────────────────────────────────────────────────────────

async function createFolder(drive, name, parentId = null) {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId ? { parents: [parentId] } : {})
    },
    fields: 'id,name'
  });
  return res.data;
}

async function uploadFile(drive, fullPath, name, parentId) {
  const res = await drive.files.create({
    requestBody: { name, parents: [parentId] },
    media: { mimeType: mimeFor(name), body: fs.createReadStream(fullPath) },
    fields: 'id,name,webViewLink'
  });
  return res.data;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('🚀 Subir Marketing a Google Drive — asistencia.io');
  console.log('==================================================');

  // Recoger archivos
  const files = collectFiles(MARKETING_ROOT);
  console.log(`\n📂 Archivos encontrados: ${files.length}`);
  files.forEach(f => console.log(`   • ${f.relPath}`));

  if (files.length === 0) {
    console.log('\n⚠️  No hay archivos que subir en:', MARKETING_ROOT);
    console.log('   Asegúrate de que los archivos están en la carpeta Marketing (un nivel arriba de scripts).');
    return;
  }

  // Autenticar
  const auth  = await authorize();
  const drive = google.drive({ version: 'v3', auth });

  // Crear carpeta raíz en Drive
  console.log(`\n📁 Creando carpeta "${DRIVE_FOLDER}" en Google Drive...`);
  const root = await createFolder(drive, DRIVE_FOLDER);
  console.log(`   ID: ${root.id}`);

  // Crear subcarpetas según la estructura de directorios
  const folderCache = { '': root.id };

  async function getOrCreateFolder(relDir) {
    if (folderCache[relDir]) return folderCache[relDir];
    const parts = relDir.split(path.sep);
    let current = '';
    for (const part of parts) {
      const next = current ? `${current}${path.sep}${part}` : part;
      if (!folderCache[next]) {
        const f = await createFolder(drive, part, folderCache[current] || root.id);
        folderCache[next] = f.id;
        console.log(`   → Subcarpeta: ${next}`);
      }
      current = next;
    }
    return folderCache[current];
  }

  // Subir archivos
  console.log('\n📤 Subiendo archivos...');
  let ok = 0, fail = 0;

  for (const file of files) {
    const relDir  = path.dirname(file.relPath);
    const parentId = relDir === '.' ? root.id : await getOrCreateFolder(relDir);
    try {
      await uploadFile(drive, file.fullPath, file.name, parentId);
      console.log(`   ✅ ${file.relPath}`);
      ok++;
    } catch (err) {
      console.error(`   ❌ ${file.relPath}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n🎉 ¡Listo! ${ok} archivos subidos${fail ? `, ${fail} fallidos` : ''}.`);
  console.log(`\n🔗 Tu carpeta en Google Drive:`);
  console.log(`   https://drive.google.com/drive/folders/${root.id}\n`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
