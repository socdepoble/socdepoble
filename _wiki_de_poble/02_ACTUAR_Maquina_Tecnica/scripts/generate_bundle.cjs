#!/usr/bin/env node
// generate_bundle.cjs
// Concatena tota la Wiki en un únic fitxer de text pla per donar context a l'eixam.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const BUNDLE_DIR = path.join(WIKI_ROOT, '03_REGISTRE_Actes_Efimers');
const IGNORE_DIRS = ['.git', 'node_modules', 'scripts', '_build', '99_assets'];

function getAllMarkdownFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('BUNDLE')) {
      files.push(fullPath);
    }
  }
  return files;
}

function generateBundle() {
  const files = getAllMarkdownFiles(WIKI_ROOT);
  let bundleContent = `# BUNDLE COMPLET DE LA WIKI SÓC DE POBLE\nGenerat: ${new Date().toISOString()}\n\n`;
  bundleContent += `Aquest fitxer conté el contingut complet i actualitzat de tota la base de coneixement. Useu-lo per tindre context absolut i no inventar res.\n\n`;
  bundleContent += `========================================================================\n\n`;

  for (const file of files) {
    const relPath = path.relative(WIKI_ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    
    bundleContent += `\n\n------------------------------------------------------------------------\n`;
    bundleContent += `📂 FITXER: ${relPath}\n`;
    bundleContent += `------------------------------------------------------------------------\n\n`;
    bundleContent += content;
  }

  const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(2, 10) + '_' + new Date().toISOString().slice(11,16).replace(':', '');
  const bundleFile = path.join(BUNDLE_DIR, `${timestamp}_BUNDLE_Wiki_Completa.md`);
  
  fs.writeFileSync(bundleFile, bundleContent, 'utf8');
  console.log(`✅ Bundle generat correctament a: ${bundleFile}`);
}

generateBundle();
