#!/usr/bin/env node
// _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/cerrojo_absoluto.js
// Aquest script s'ha d'executar COM A PRIMER PAS de TOTA sessió.
// Ha de ser invocat automàticament, no manualment.

const fs = require('fs');
const path = require('path');
const { isValid, TERMODINAMIC_REGEX } = require('./termodinamic.cjs');

const WIKI_ROOT = path.resolve(__dirname, '..', '..');
const FORBIDDEN_ROOT_FILES = /\.md$/;
const ALLOWED_ROOT_FILES = ['README.md', '00_index.md', '.gitignore'];

// 1. DETECTAR FITXERS ORFES A L'ARREL
function detectarOrfes() {
  const entries = fs.readdirSync(WIKI_ROOT, { withFileTypes: true });
  const orfes = [];
  
  for (const entry of entries) {
    if (entry.isFile() && FORBIDDEN_ROOT_FILES.test(entry.name) && !ALLOWED_ROOT_FILES.includes(entry.name)) {
      orfes.push(entry.name);
    }
  }
  
  if (orfes.length > 0) {
    console.error(`\n🚨 ALERTA: Fitxers orfes detectats a l'arrel:`);
    orfes.forEach(f => console.error(`   - ${f}`));
    console.error(`\n⚠️  ACCIÓ: L'script 'wiki-integrity.js' o 'reubica_orfes.js' se n'encarregarà. Bloquejant.\n`);
    return false;
  }
  return true;
}

// 2. VALIDAR NOMS EXISTENTS (Excepte README, AGENTS, index)
function validarNoms() {
  let errors = 0;
  
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
        scan(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const base = path.basename(entry.name);
        if (!base.startsWith('00_') && !base.startsWith('README') && base !== 'SKILL.md' && base !== 'SKILL') {
          if (!isValid(base)) {
            console.error(`❌ NOM INVÀLID DETECTAT: ${path.relative(WIKI_ROOT, fullPath)}`);
            errors++;
          }
        }
      }
    }
  }
  
  scan(WIKI_ROOT);
  return errors === 0;
}

// 3. EXECUCIÓ
console.log('🔒 Cerrojo Absoluto activat...');
const okOrfes = detectarOrfes();
const okNoms = validarNoms();

if (!okOrfes || !okNoms) {
  console.error('\n⛔ ESCRIPTURA BLOQUEJADA. El Cerrojo detecta entropia. Utilitza els scripts de neteja o corregeix manualment abans de continuar la sessió.');
  process.exit(1);
}

console.log('✅ Cerrojo passat. Puresa al 100%. Sessió permesa.\n');
