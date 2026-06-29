const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '_wiki_de_poble');

// Fix plantilla_skill_iso
const plantPath = path.join(dir, '90_arxiu_historic', '00_plantilles.md');
if (fs.existsSync(plantPath)) {
  fs.writeFileSync(plantPath, fs.readFileSync(plantPath, 'utf8') + '- [[09_recursos_ia/plantilla_skill_iso]]\n');
}

// Fix 260627_2348_acta_marmota & 260628_1330_ACTA_GENERAL_Volum_1_Fundacio
const sessPath = path.join(dir, '90_arxiu_historic', '00_historial_sessions.md');
if (fs.existsSync(sessPath)) {
  fs.writeFileSync(sessPath, fs.readFileSync(sessPath, 'utf8') + '- [[90_arxiu_historic/260627_2348_acta_marmota]]\n- [[10_actes/260628_1330_ACTA_GENERAL_Volum_1_Fundacio]]\n');
}

console.log('Orfes finals fixats.');
