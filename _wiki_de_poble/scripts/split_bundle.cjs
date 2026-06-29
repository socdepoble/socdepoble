const fs = require('fs');
const path = require('path');

const produccioDir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/80_produccio/generats_hui';
const inputFile = path.join(produccioDir, '260629_0245_master_wiki_bundle_FINAL.md');
const part1File = path.join(produccioDir, '260629_0245_master_wiki_bundle_FINAL_PART_1.md');
const part2File = path.join(produccioDir, '260629_0245_master_wiki_bundle_FINAL_PART_2.md');

const content = fs.readFileSync(inputFile, 'utf8');

// Split by the custom file separator block.
// The separator is usually:
// ================================================================================
// 📄 FITXER: ...
const separator = "================================================================================";
const chunks = content.split(separator);

// chunks[0] is the bundle header
let part1Content = chunks[0];
let part2Content = `# 📦 BUNDLE WIKI COMPLETA - SÓC DE POBLE (PART 2 DE 2)
**Data de generació:** 260629_0245
**Estat:** Post-Auditoria (Ronda 8 - Esporga Física Aplicada)
Aquesta és la segona part del Bundle per evitar truncaments en models de context reduït com ChatGPT.

---

`;

// Calculate total byte size of the remaining chunks
let totalSize = 0;
for (let i = 1; i < chunks.length; i++) {
  totalSize += Buffer.byteLength(chunks[i], 'utf8');
}

let currentSize = 0;
let isPart2 = false;

for (let i = 1; i < chunks.length; i++) {
  const chunkStr = separator + chunks[i];
  
  if (!isPart2) {
    part1Content += chunkStr;
    currentSize += Buffer.byteLength(chunkStr, 'utf8');
    if (currentSize >= totalSize / 2) {
      isPart2 = true;
    }
  } else {
    part2Content += chunkStr;
  }
}

// Write the files
fs.writeFileSync(part1File, part1Content, 'utf8');
fs.writeFileSync(part2File, part2Content, 'utf8');

console.log(`Split completat:`);
console.log(`PART 1: ${(Buffer.byteLength(part1Content, 'utf8') / 1024).toFixed(2)} KB`);
console.log(`PART 2: ${(Buffer.byteLength(part2Content, 'utf8') / 1024).toFixed(2)} KB`);
