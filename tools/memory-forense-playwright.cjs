// tools/memory-forense-playwright.js
// Anàlisi Forense Automàtica amb Playwright + CDP - Psiquiatria de Màquina

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(process.cwd(), 'reports/memory-forense');

async function runMemoryForenseTest() {
  console.log("🔬 Iniciant Anàlisi Forense amb Playwright + CDP...");

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--enable-precise-memory-info', '--no-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Habilitar CDP
  const client = await page.context().newCDPSession(page);
  await client.send('HeapProfiler.enable');

  try {
    console.log("🌐 Navegant al Dashboard...");
    // Ajustar l'URL segons l'entorn de CI o de local
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Prendre Snapshot A (Inici)
    console.log("📸 Capturant Snapshot A (Inici)...");
    const snapshotA = path.join(reportsDir, 'snapshot-a-inici.heapsnapshot');
    await saveHeapSnapshot(client, snapshotA);

    // Simular interacció intensa per intentar provocar una fuga
    console.log("⚙️ Simulant interaccions intenses (stress test)...");
    for (let i = 0; i < 50; i++) {
      // Simulem clics o recàrregues de components (ajustar els selectors)
      // await page.click('#algun-boto');
      // await page.waitForTimeout(100);
    }
    
    // Deixem que la memòria s'estabilitzi i cridem al GC (Garbage Collector)
    await client.send('HeapProfiler.collectGarbage');
    await page.waitForTimeout(2000);

    // Prendre Snapshot B (Després de l'ús)
    console.log("📸 Capturant Snapshot B (Final)...");
    const snapshotB = path.join(reportsDir, 'snapshot-b-final.heapsnapshot');
    await saveHeapSnapshot(client, snapshotB);

    console.log("✅ Anàlisi Playwright completada correctament.");

  } catch (error) {
    console.error("❌ Error durant l'anàlisi de Playwright:", error);
  } finally {
    await browser.close();
  }
}

async function saveHeapSnapshot(client, filename) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filename);
    client.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
      stream.write(chunk);
    });
    client.on('HeapProfiler.reportHeapSnapshotProgress', ({ finished }) => {
      if (finished) {
        stream.end();
        resolve();
      }
    });
    client.send('HeapProfiler.takeHeapSnapshot', { reportProgress: true }).catch(reject);
  });
}

if (require.main === module) {
  runMemoryForenseTest();
}

module.exports = { runMemoryForenseTest };
