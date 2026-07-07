#!/usr/bin/env node
// generate_pilars.cjs
// Genera l'índex de cada pilar (SER, SABER, EXECUTAR, REGISTRE) automàticament.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const PILARS = {
  '00_SER_Brain_Identitat': 'SER',
  '01_SABER_Cultura_Coneixement': 'SABER',
  '02_EXECUTAR_Maquina_Tecnica': 'EXECUTAR',
  '03_REGISTRE_Actes_Efimers': 'REGISTRE',
};

function generateIndex(pilarDir, pilarName) {
  const entries = fs.readdirSync(pilarDir, { withFileTypes: true });
  let md = `---\nname: index-${pilarName.toLowerCase()}\nversion: V1\nauthority: IAIA MarIA\ntipus: index\n---\n`;
  md += `# 📂 Índex del Pilar ${pilarName}\n\n`;
  
  for (const entry of entries) {
    if (!entry.name.endsWith('.md') || entry.name.startsWith('00_index')) continue;
    const name = entry.name.replace('.md', '');
    const display = name.replace(/_/g, ' ').replace(/^\d+_/, '');
    md += `- [[${entry.name}|${display}]]\n`;
  }
  
  md += `\n---\n*Generat per generate_pilars.cjs | ${new Date().toISOString()}*\n`;
  return md;
}

Object.entries(PILARS).forEach(([dir, name]) => {
  const fullDir = path.join(WIKI_ROOT, dir);
  if (!fs.existsSync(fullDir)) {
    console.error(`⚠️  Pilar ${name} no existeix: ${dir}`);
    return;
  }
  
  const indexPath = path.join(fullDir, '00_index.md');
  const content = generateIndex(fullDir, name);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`✅ Índex generat: ${dir}/00_index.md`);
});
