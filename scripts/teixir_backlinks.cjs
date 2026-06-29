const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, '..', '_wiki_de_poble');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.md')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync(dir);
let historicalActs = [];
let archActs = [];
let templates = [];
let auditories = [];

for (const f of files) {
  const relativePath = path.relative(dir, f);
  if (relativePath.includes('ACTA_MARMOTA') || relativePath.includes('ACTA_SESSIO')) {
    historicalActs.push(relativePath);
  } else if (relativePath.includes('arquitectura/') && relativePath.includes('90_arxiu_historic')) {
    archActs.push(relativePath);
  } else if (relativePath.includes('plantilles/')) {
    templates.push(relativePath);
  } else if (relativePath.includes('auditories/')) {
    auditories.push(relativePath);
  }
}

// 1. Create 00_historial_sessions.md in 90_arxiu_historic
let sessionIndex = `---\nname: historial-sessions\ndescription: Índex mestre de totes les actes i diaris de sessions històriques.\ncreated_at: 260628_1700\nupdated_at: 260628_1700\n---\n# 📚 Historial de Sessions i Actes Marmota\n\nAquest índex recull la història viva del Mas, les decisions preses i els sentiments de les IA durant les nits de treball. Connecta tot l'arxiu històric a l'[[00_index|Índex Principal]].\n\n## Actes i Diaris\n`;

for (const act of historicalActs.sort().reverse()) {
  const name = path.basename(act, '.md');
  sessionIndex += `- [[${name}]]\n`;
}

fs.writeFileSync(path.join(dir, '90_arxiu_historic', '00_historial_sessions.md'), sessionIndex);

// 2. Inject backlink in all those files so they point to 00_historial_sessions or 00_index
const injectBacklink = (filePath, backlinkStr) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('Veure també') && !content.includes(backlinkStr)) {
      fs.writeFileSync(filePath, content + `\n\n---\n## 🔗 Veure també\n- ${backlinkStr}\n`);
    }
  } catch (e) { }
};

for (const act of historicalActs) {
  injectBacklink(path.join(dir, act), '[[90_arxiu_historic/00_historial_sessions|Historial de Sessions]]');
}

for (const act of archActs) {
  injectBacklink(path.join(dir, act), '[[04_arquitectura_disseny/arquitectura|Arquitectura Principal]]');
}

for (const tmpl of templates) {
  injectBacklink(path.join(dir, tmpl), '[[00_index|Índex Principal]]');
}

for (const aud of auditories) {
  injectBacklink(path.join(dir, aud), '[[06_capabilities/auditoria|Auditoria]]');
}

// 3. Update 00_index.md
const indexFile = path.join(dir, '00_index.md');
let indexContent = fs.readFileSync(indexFile, 'utf8');
if (!indexContent.includes('00_historial_sessions')) {
  indexContent += `\n## 📚 Arxiu Històric i Plantilles\n- [[90_arxiu_historic/00_historial_sessions|Historial de Sessions (Actes i Diaris)]]\n- Les Plantilles i Actes d'Auditoria estan enllaçades directament als seus respectius dominis per evitar contaminació visual.\n`;
  fs.writeFileSync(indexFile, indexContent);
}

console.log('Teixit neuronal completat.');
