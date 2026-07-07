#!/usr/bin/env node
// update_glossari.cjs
// Escaneja tots els .md de _wiki_de_poble/ i actualitza GLOSSARI.md amb els termes definits.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const GLOSSARI_PATH = path.join(WIKI_ROOT, '01_SABER_Cultura_Coneixement', 'GLOSSARI.md');

function findDefinitions(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'scripts' && entry.name !== '_build') {
      findDefinitions(fullPath, results);
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Buscar definicions: ## Nom o **Nom**: definició
      const headerMatches = content.matchAll(/^#{2,3}\s+(.+)$/gm);
      const boldMatches = content.matchAll(/\*\*(.+?)\*\*:\s*(.+?)(?=\n|$)/g);
      
      for (const m of headerMatches) {
        results.push({ term: m[1].trim(), file: path.relative(WIKI_ROOT, fullPath) });
      }
      for (const m of boldMatches) {
        results.push({ term: m[1].trim(), def: m[2].trim(), file: path.relative(WIKI_ROOT, fullPath) });
      }
    }
  }
  return results;
}

function generateGlossari(defs) {
  const byLetter = {};
  defs.forEach(d => {
    const letter = d.term[0].toUpperCase();
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(d);
  });
  
  let md = `---\nname: glossari\nversion: V1\nauthority: IAIA MarIA\ntipus: index\n---\n`;
  md += `# 📖 GLOSSARI DEL MAS — Índex de Veritats Canòniques\n\n`;
  md += `> *Aquest document és un índex. Per a la definició completa, segueix l'enllaç.*\n\n`;
  
  Object.keys(byLetter).sort().forEach(letter => {
    md += `## ${letter}\n`;
    byLetter[letter].forEach(d => {
      const link = d.file.replace(/\\/g, '/').replace(/\.md$/, '');
      md += `- **${d.term}** → [[${link}|${link}]]\n`;
    });
    md += `\n`;
  });
  
  md += `---\n*Generat automàticament per update_glossari.cjs | ${new Date().toISOString()}*\n`;
  return md;
}

const defs = findDefinitions(WIKI_ROOT);
fs.writeFileSync(GLOSSARI_PATH, generateGlossari(defs), 'utf8');
console.log(`✅ GLOSSARI.md actualitzat amb ${defs.length} termes.`);
