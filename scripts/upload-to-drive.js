#!/usr/bin/env node
/**
 * Sube todos los archivos de la carpeta Marketing a Google Drive
 *
 * PASO 1 — Instalar dependencias (solo la primera vez):
 *   npm install googleapis
 *
 * PASO 2 — Crear el archivo tami.json en esta misma carpeta (scripts/):
 *   {
 *     "client_id":     "...",
 *     "client_secret": "...",
 *     "refresh_token": "..."
 *   }
 *   (Este archivo está en .gitignore — nunca se sube al repo)
 *
 * PASO 3 — Ejecutar:
 *   node upload-to-drive.js                          → sube la carpeta Marketing (un nivel arriba)
 *   node upload-to-drive.js "C:\ruta\a\tus\archivos" → sube cualquier carpeta
 */

const fs   = require('fs');
const path = require('path');

// ─── Dependencias ─────────────────────────────────────────────────────────────

let google;
try {
  google = require('googleapis').google;
} catch {
  console.error('\n❌ Falta "googleapis". Ejecuta primero:');
  console.error('   npm install googleapis\n');
  process.exit(1);
}

// ─── Configuración ────────────────────────────────────────────────────────────

const MARKETING_ROOT  = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
const TAMI_CREDS_PATH = path.join(__dirname, 'tami.json');
const DRIVE_FOLDER    = 'asistencia.io — Marketing 2026';

// Extensiones a subir
const ALLOWED_EXT = ['.ics', '.md', '.js', '.csv', '.txt', '.pdf', '.png', '.jpg'];

// Archivos/carpetas a ignorar
const IGNORE = ['upload-to-drive.js', 'node_modules', '.git'];

// ─── Recoger archivos recursivamente ─────────────────────────────────────────

function collectFiles(dir, baseDir = dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE.some(i => entry.name === i || entry.name.startsWith('.'))) continue;

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

// ─── OAuth2 con refresh_token (sin navegador) ─────────────────────────────────

function authorize() {
  if (!fs.existsSync(TAMI_CREDS_PATH)) {
    console.error('\n❌ No encuentro scripts/tami.json');
    console.error('   Crea ese archivo con el client_id, client_secret y refresh_token de Tami.\n');
    process.exit(1);
  }

  const tami   = JSON.parse(fs.readFileSync(TAMI_CREDS_PATH, 'utf8'));
  const client = new google.auth.OAuth2(tami.client_id, tami.client_secret, 'http://localhost');
  client.setCredentials({ refresh_token: tami.refresh_token });
  console.log('✅ Credenciales Tami cargadas desde tami.json');
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
  console.log(`\n📁 Carpeta origen: ${MARKETING_ROOT}`);

  const files = collectFiles(MARKETING_ROOT);
  console.log(`\n📂 Archivos encontrados: ${files.length}`);
  files.forEach(f => console.log(`   • ${f.relPath}`));

  if (files.length === 0) {
    console.log('\n⚠️  No hay archivos que subir en:', MARKETING_ROOT);
    console.log('   Pasa la ruta como argumento:');
    console.log('   node upload-to-drive.js "C:\\ruta\\a\\tus\\archivos"\n');
    return;
  }

  const auth  = authorize();
  const drive = google.drive({ version: 'v3', auth });

  console.log(`\n📁 Creando carpeta "${DRIVE_FOLDER}" en Google Drive...`);
  const root = await createFolder(drive, DRIVE_FOLDER);
  console.log(`   ID: ${root.id}`);

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

  console.log('\n📤 Subiendo archivos...');
  let ok = 0, fail = 0;

  for (const file of files) {
    const relDir   = path.dirname(file.relPath);
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
