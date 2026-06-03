// tools/full-memory-audit.js
// Script Unificat Mestre d'Auditoria Forense - Versió Pulida

const fs = require('fs');
const path = require('path');
const { runMemoryForenseTest } = require('./memory-forense-playwright');
const { analyzeNodeHeapDump } = require('./compare-heap-delta');

async function runFullMemoryAudit() {
  console.log("🛡️ Iniciant Auditoria Forense Unificada - Psiquiatria de Màquina");

  // Crear directori de reports si no existeix
  const reportsDir = path.join(process.cwd(), 'reports/memory-forense');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  try {
    // 1. Execució Playwright + CDP
    await runMemoryForenseTest();

    // 2. Anàlisi del Delta
    const snapA = path.join(reportsDir, 'snapshot-a-inici.heapsnapshot');
    const snapB = path.join(reportsDir, 'snapshot-b-final.heapsnapshot');
    analyzeNodeHeapDump(snapA, snapB);

    console.log("✅ Auditoria Forense completada.");

  } catch (err) {
    console.error("❌ Error crític durant l'auditoria forense unificada:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  runFullMemoryAudit();
}

module.exports = { runFullMemoryAudit };
