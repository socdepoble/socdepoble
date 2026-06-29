const fs = require('fs');
const path = require('path');
const data = require('./graph_analysis.json');

const dir = path.join(__dirname, '..', '_wiki_de_poble');

let archIndex = '\n\n## 📚 Arxiu Històric (Actes d\'Arquitectura)\n\nAquestes actes foren els primers esborranys fundacionals:\n';
let templatesIndex = '---\nname: plantilles-historic\ndescription: Índex de les plantilles històriques.\ncreated_at: 260628_1710\nupdated_at: 260628_1710\n---\n# 📚 Plantilles Històriques\n\nAquestes plantilles s\'empraven a les primeres versions i s\'han guardat com a arxiu:\n';
let auditIndex = '\n\n## 📚 Auditories Històriques\n\nAquestes auditories asíncrones estan arxivades per a la memòria del Mas:\n';

for (const orphan of data.orphans) {
  if (orphan.includes('Arquitectura_')) {
    archIndex += `- [[${orphan}]]\n`;
  } else if (orphan.includes('Plantilla_')) {
    templatesIndex += `- [[${orphan}]]\n`;
  } else if (orphan.includes('auditoria_')) {
    auditIndex += `- [[${orphan}]]\n`;
  }
}

// Write Templates Index
fs.writeFileSync(path.join(dir, '90_arxiu_historic', '00_plantilles.md'), templatesIndex);

// Append Archs to arquitectura.md
const archPath = path.join(dir, '04_arquitectura_disseny', 'arquitectura.md');
if (fs.existsSync(archPath)) {
  fs.writeFileSync(archPath, fs.readFileSync(archPath, 'utf8') + archIndex);
}

// Append Audits to auditoria.md (but we don't have it, maybe it is a mistake? Let's check capabilities/auditoria.md doesn't exist. I'll just append them to 00_index)
let indexAppends = '';
const idxPath = path.join(dir, '00_index.md');
if (fs.existsSync(idxPath)) {
  let idxContent = fs.readFileSync(idxPath, 'utf8');
  if (!idxContent.includes('00_plantilles')) {
    idxContent += `- [[90_arxiu_historic/00_plantilles|Índex de Plantilles Històriques]]\n`;
  }
  if (!idxContent.includes('INSTRUCCIONS_SAFATA')) {
    idxContent += `- [[cultura_local/INSTRUCCIONS_SAFATA|Instruccions de la Safata de Lectura]]\n`;
  }
  
  if (auditIndex.length > 100) {
     idxContent += auditIndex;
  }
  fs.writeFileSync(idxPath, idxContent);
}

// Fix the 4 isolated files (link them from 00_historial_sessions.md)
const sessPath = path.join(dir, '90_arxiu_historic', '00_historial_sessions.md');
if (fs.existsSync(sessPath)) {
  let sessContent = fs.readFileSync(sessPath, 'utf8');
  for (const isolate of data.isolates) {
    if (isolate !== 'INSTRUCCIONS_SAFATA') {
      sessContent += `- [[${isolate}]]\n`;
    }
  }
  fs.writeFileSync(sessPath, sessContent);
}

console.log('Orfes i aïllats integrats.');
