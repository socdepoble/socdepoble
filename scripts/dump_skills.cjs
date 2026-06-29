const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '_wiki_de_poble', '05_skills_ia');
const masterSkills = [
  'arquitectura_pedra_seca',
  'crdt_optimitzacio',
  'self_repair',
  'consola_termodinamica',
  'contradiction_engine',
  'backup_recovery',
  'futur_adaptacio',
  'cingulat_anterior',
  'executiu_central',
  'cerebel_procedimental'
];

let dump = '';

for (const skill of masterSkills) {
  const filePath = path.join(dir, skill, 'SKILL.md');
  if (fs.existsSync(filePath)) {
    dump += `\n=======================================================\n`;
    dump += `FILE: ${skill}/SKILL.md\n`;
    dump += `=======================================================\n`;
    dump += fs.readFileSync(filePath, 'utf8') + '\n';
  }
}

fs.writeFileSync('scripts/master_skills_dump.txt', dump, 'utf8');
console.log('Dump completed.');
