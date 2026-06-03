// tools/compare-heap-delta.js
// Comparador Forense de Delta entre Heap Snapshots

const fs = require('fs');
const path = require('path');
// Farem servir un enfocament bàsic per comparar mides de fitxers si no disposem d'un parser complet de heapsnapshot en Node.
// L'anàlisi profunda es sol fer amb eines com 'heapsnapshot-parser' o a Chrome DevTools.

function analyzeNodeHeapDump(snapshotAPath, snapshotBPath) {
  console.log("🔍 Analitzant Delta entre Snapshots...");
  
  if (!fs.existsSync(snapshotAPath) || !fs.existsSync(snapshotBPath)) {
    console.error("❌ No s'han trobat els fitxers de snapshot per comparar.");
    return;
  }

  const statA = fs.statSync(snapshotAPath);
  const statB = fs.statSync(snapshotBPath);

  const sizeAMB = statA.size / 1024 / 1024;
  const sizeBMB = statB.size / 1024 / 1024;
  const deltaMB = sizeBMB - sizeAMB;

  console.log(\`📊 Mida Snapshot A (Inici): \${sizeAMB.toFixed(2)} MB\`);
  console.log(\`📊 Mida Snapshot B (Final): \${sizeBMB.toFixed(2)} MB\`);
  
  console.log(\`📉 Delta Total de Memòria (creixement): \${deltaMB.toFixed(2)} MB\`);

  if (deltaMB > 5) {
    console.warn("⚠️ ALERTA TÀCTICA: Creixement significatiu de memòria detectat (>5MB). Possible fuga de closures o components no desmuntats.");
    console.log("👉 Recomanació: Obre aquests fitxers al panell 'Memory' de Chrome DevTools i utilitza la vista 'Comparison' ordenant per 'Delta' o 'Retained Size'.");
  } else {
    console.log("✅ L'increment de memòria és acceptable. Salut òptima.");
  }
}

if (require.main === module) {
  const reportsDir = path.join(process.cwd(), 'reports/memory-forense');
  const snapA = path.join(reportsDir, 'snapshot-a-inici.heapsnapshot');
  const snapB = path.join(reportsDir, 'snapshot-b-final.heapsnapshot');
  analyzeNodeHeapDump(snapA, snapB);
}

module.exports = { analyzeNodeHeapDump };
