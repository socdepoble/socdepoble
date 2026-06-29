const fs = require('fs');
const path = require('path');

// Format Trellat: YYMMDD_HHMM
const now = new Date();
const yy = String(now.getFullYear()).slice(2);
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const min = String(now.getMinutes()).padStart(2, '0');
const timestamp = `${yy}${mm}${dd}_${hh}${min}`;

const wikiRoot = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const outputDir = path.join(wikiRoot, '80_produccio/260629_1630_escriptori');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const outputFile = path.join(outputDir, `${timestamp}_master_wiki_bundle_V26.md`);

let bundleContent = `# 📦 BUNDLE WIKI COMPLETA - SÓC DE POBLE (Versió V25 Autopoiesi)
**Data de generació:** ${timestamp}
**Estat:** Post-Amputació i Autopoiesi (Ronda 10)
**Propòsit:** Aquest document fusiona només el NUCLI CANÒNIC de la Wiki de "Sóc de Poble" (Directoris 00 fins 11) en un únic fitxer per alimentar el context de les IAs en Xats Nous. Tota menció a "La Masía", "React" i "PouchDB" ha sigut eradicada.

---

`;

function walkDir(dir) {
  let filesToProcess = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === '.DS_Store' || f === 'assets' || f === '80_produccio' || f === '90_arxiu_historic') continue;
    
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      filesToProcess = filesToProcess.concat(walkDir(fullPath));
    } else if (f.endsWith('.md')) {
      if (!f.includes('master_wiki_bundle')) {
        filesToProcess.push(fullPath);
      }
    }
  }
  return filesToProcess;
}

const allMdFiles = walkDir(wikiRoot);
allMdFiles.sort();

for (const file of allMdFiles) {
  const relativePath = path.relative(wikiRoot, file);
  bundleContent += `\n\n================================================================================\n`;
  bundleContent += `📄 FITXER: ${relativePath}\n`;
  bundleContent += `================================================================================\n\n`;
  bundleContent += fs.readFileSync(file, 'utf8');
}

fs.writeFileSync(outputFile, bundleContent, 'utf8');
console.log(`Bundle generat correctament a: ${outputFile}`);
console.log(`Grandària: ${(Buffer.byteLength(bundleContent, 'utf8') / 1024).toFixed(2)} KB`);
