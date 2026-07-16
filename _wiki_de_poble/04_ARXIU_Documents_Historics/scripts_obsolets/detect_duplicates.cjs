#!/usr/bin/env node
/**
 * Script per a detectar contingut duplicat a la Wiki.
 * Execució: node detect_duplicates.js [--fix]
 * --fix: Intenta fusionar automàticament (experimental).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuració
const WIKI_DIR = path.resolve(__dirname, '..');
const MIN_SIMILARITY = 0.8; // 80% de similitud = duplicat

// Funció per a calcular hash de contingut
function hashContent(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Funció per a comparar contingut (simplificada)
function compareContent(content1, content2) {
  const set1 = new Set(content1.toLowerCase().split(/\\s+/));
  const set2 = new Set(content2.toLowerCase().split(/\\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

// Funció per a trobar duplicats
function findDuplicates() {
  const files = [];
  const duplicates = [];

  // Recollir tots els fitxers .md
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    });
  };
  walk(WIKI_DIR);

  // Comparar tots els fitxers
  for (let i = 0; i < files.length; i++) {
    const content1 = fs.readFileSync(files[i], 'utf-8');
    for (let j = i + 1; j < files.length; j++) {
      const content2 = fs.readFileSync(files[j], 'utf-8');
      const similarity = compareContent(content1, content2);
      if (similarity >= MIN_SIMILARITY) {
        duplicates.push({
          file1: files[i],
          file2: files[j],
          similarity: (similarity * 100).toFixed(2) + '%'
        });
      }
    }
  }
  return duplicates;
}

// Funció per a fusionar fitxers (experimental)
function mergeFiles(file1, file2) {
  const content1 = fs.readFileSync(file1, 'utf-8');
  const content2 = fs.readFileSync(file2, 'utf-8');

  // Simple fusion: Unir continguts amb separador
  const mergedContent = `${content1}\\n\\n---\\n\\n## 🔄 Contingut Fusionat de: ${file2}\\n${content2}`;

  // Escriure al primer fitxer
  fs.writeFileSync(file1, mergedContent);
  console.log(`✅ Fusionats: ${file1} + ${file2}`);

  // Esborrar el segon fitxer (opcional)
  // fs.unlinkSync(file2);
  // console.log(`   ✅ Esborrat: ${file2}`);
}

// Funció principal
function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix');

  console.log('🔍 Buscant contingut duplicat a la Wiki...');
  const duplicates = findDuplicates();

  if (duplicates.length === 0) {
    console.log("✅ No s'han trobat duplicats.");
    return;
  }

  console.log(`\n⚠️  S'han trobat ${duplicates.length} possibles duplicats:`);
  duplicates.forEach((dup, index) => {
    console.log(`\n${index + 1}. ${dup.file1} <-> ${dup.file2} (${dup.similarity} similitud)`);
  });

  if (fix) {
    console.log('\n🔧 Fusionant automàticament...');
    duplicates.forEach(dup => {
      mergeFiles(dup.file1, dup.file2);
    });
    console.log('✅ Fusió completada. Revisa manualment els resultats.');
  } else {
    console.log('\n💡 Executa amb `--fix` per a fusionar automàticament (experimental).');
  }
}

main();
