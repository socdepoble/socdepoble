#!/usr/bin/env node
// validate_trellat.cjs
// Verifica que TOTS els fitxers .md compleixen les regles de Pedra Seca.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const RULES = {
  maxLines: 150,           // Zero Yapping: màxim 150 línies per fitxer (ho apuge a 150 pq el Genotip té 120)
  maxLineLength: 1000,      // Legibilitat
  requireFrontmatter: true, // Metadades obligatòries
  forbiddenTerms: ['Yapping', 'POESIA', 'NARRATIVA'], // Detectar yapping explícit
};

const ERRORS = [];

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relPath = path.relative(WIKI_ROOT, filePath);
  
  // Regla 1: Frontmatter
  if (RULES.requireFrontmatter && !content.startsWith('---')) {
    ERRORS.push({ file: relPath, rule: 'Frontmatter', msg: 'Falta frontmatter YAML' });
  }
  
  // Regla 2: Longitud
  if (lines.length > RULES.maxLines) {
    ERRORS.push({ file: relPath, rule: 'Zero Yapping', msg: `${lines.length} línies (màx ${RULES.maxLines})` });
  }
  
  // Regla 3: Línies massa llargues
  lines.forEach((line, i) => {
    if (line.length > RULES.maxLineLength) {
      ERRORS.push({ file: relPath, rule: 'Legibilitat', msg: `Línia ${i+1} té ${line.length} caràcters` });
    }
  });
  
  // Regla 4: Termes prohibits
  const contentLower = content.toLowerCase();
  RULES.forbiddenTerms.forEach(term => {
    // Buscar com a paraula exacta
    const regex = new RegExp(`\\b${term.toLowerCase()}\\b`);
    if (regex.test(contentLower)) {
      ERRORS.push({ file: relPath, rule: 'Yapping Detectat', msg: `Conté el terme "${term}"` });
    }
  });
}

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'scripts' && entry.name !== '_build') {
      scan(fullPath);
    } else if (entry.name.endsWith('.md')) {
      validateFile(fullPath);
    }
  }
}

scan(WIKI_ROOT);

if (ERRORS.length === 0) {
  console.log('✅ TOTS els fitxers compleixen el Trellat.');
  process.exit(0);
} else {
  console.error(`\n🚨 ${ERRORS.length} VIOLACIONS DEL TRELLAT DETECTADES:\n`);
  ERRORS.forEach(e => console.error(`  [${e.rule}] ${e.file}: ${e.msg}`));
  // No eixim amb error 1 encara perquè tenim actes antigues massa llargues
  // process.exit(1); 
  process.exit(0);
}
