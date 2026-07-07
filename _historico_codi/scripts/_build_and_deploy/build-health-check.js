#!/usr/bin/env node
// build-health-check.js

import fs from 'fs-extra';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const REQUIRED_FILES = [
  'index.html',
  'service-worker.js'
];

// 1. Verificar fitxers obligatoris
const distExists = fs.existsSync(DIST_DIR);
if (!distExists) {
  console.error('❌ La carpeta dist/ no existeix. Compilació fallida?');
  process.exit(1);
}

let allOk = true;

for (const pattern of REQUIRED_FILES) {
  const files = fs.readdirSync(DIST_DIR).filter(f => f.match(new RegExp(pattern.replace('*', '.*'))));
  if (files.length === 0) {
    console.error(`❌ Manca fitxer: ${pattern}`);
    allOk = false;
  }
}

// 2. Comprovar que index.html conté el JS generat
const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
if (!indexHtml.includes('src="/assets/index-')) {
  console.warn('⚠️ index.html no fa referència als assets minificats.');
}

// 3. Comprovar que el precache manifest llista fitxers existents (només si existeix)
const precacheFiles = fs.readdirSync(DIST_DIR).filter(f => f.startsWith('workbox-') && f.endsWith('.js'));
if (precacheFiles.length > 0) {
  console.log('✅ Fitxers de Workbox detectats.');
}

if (!allOk) {
  console.error('🔴 La compilació presenta errors. Revisa els missatges anteriors.');
  process.exit(1);
} else {
  console.log('🟢 Verificació de build correcta. El sistema està sa.');
}
