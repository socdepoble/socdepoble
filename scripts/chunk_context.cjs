const fs = require('fs');
const path = require('path');

const contextFile = path.join(__dirname, '..', 'auditorias', 'contexto_maestro_codex.txt');
const content = fs.readFileSync(contextFile, 'utf8');

// 1. Guardar-ho com .js per si l'eina només accepta codi
const jsOutPath = path.join(__dirname, '..', 'auditorias', 'contexto_maestro_codex_dummy.js');
fs.writeFileSync(jsOutPath, `/* \n${content}\n */`);

// 2. Trossejar-ho en 3 o 4 parts copiables a mà (max 75.000 caràcters per tros = ~75KB)
const CHUNK_SIZE = 75000;
let partIndex = 1;
for (let i = 0; i < content.length; i += CHUNK_SIZE) {
  const chunkText = content.substring(i, i + CHUNK_SIZE);
  const chunkPath = path.join(__dirname, '..', 'auditorias', `contexto_tros_${partIndex}.txt`);
  fs.writeFileSync(chunkPath, chunkText);
  partIndex++;
}

console.log(`Especejament completat. Parts creades: ${partIndex - 1}`);
