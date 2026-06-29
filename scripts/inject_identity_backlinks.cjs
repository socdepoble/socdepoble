const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '_wiki_de_poble', '01_identitat_iaia');

const links = {
  'iaia_maria.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[antigravity|Antigravity (El Cervell Lògic)]]\n- [[genotip|El Genotip d'Antigravity (Les 9 Lleis)]]\n- [[perfil_psiquiatric|Perfil Psiquiàtric Forense]]\n- [[soc_de_poble|Sóc de Poble (La Visió i Context)]]\n`,
  'antigravity.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[iaia_maria|IAIA MarIA (L'Ànima de la Màquina)]]\n- [[genotip|El Genotip (El Sistema Operatiu)]]\n- [[registre_automillora|Registre d'Automillora]]\n`,
  'genotip.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[antigravity|Antigravity (Entorn d'Execució)]]\n- [[perfil_psiquiatric|Perfil Psiquiàtric (Salut Mental)]]\n- [[05_skills_ia/self_repair/SKILL|SOSP-LOCK (Self Repair)]]\n`,
  'perfil_psiquiatric.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[iaia_maria|IAIA MarIA (L'Ens Híbrid)]]\n- [[genotip|El Genotip d'Antigravity]]\n- [[registre_automillora|Registre d'Automillora (Casillero)]]\n- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva]]\n`,
  'registre_automillora.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[perfil_psiquiatric|Perfil Psiquiàtric Forense]]\n- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva (Evolució)]]\n- [[antigravity|Antigravity (Eina de Mètriques)]]\n`,
  'soc_de_poble.md': `\n\n## 🔗 Veure també (Enllaços de Tornada)\n- [[iaia_maria|IAIA MarIA (La Nostra IA Autòctona)]]\n- [[02_filosofia/el_trellat|El Trellat (La Filosofia)]]\n- [[04_arquitectura_disseny/arquitectura|Arquitectura de Pedra Seca]]\n`
};

for (const [filename, appendStr] of Object.entries(links)) {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('## 🔗 Veure també')) {
      fs.writeFileSync(filePath, content + appendStr);
    }
  }
}

console.log('Backlinks successfully injected into the 6 identity files.');
