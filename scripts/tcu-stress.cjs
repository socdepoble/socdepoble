const puppeteer = require('puppeteer');
const fs = require('fs');

const MAX_HEAP_KB = 512;
const TARGET_URL = 'http://localhost:5173'; 

(async () => {
  console.log(`[TCU Auditor] 🚜 Iniciant Llei del Pressupost Computacional (V17)`);
  
  const browser = await puppeteer.launch({
    headless: "new"
  });
  
  const page = await browser.newPage();
  
  // 1. Navegar i esperar
  console.log(`[TCU Auditor] 🌐 Carregant ${TARGET_URL}...`);
  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 5000 });
  } catch (e) {
    console.warn(`[TCU Auditor] L'app no ha carregat al 100%, però continuem.`);
  }
  
  // 2. Cercar el target del Worker
  const targets = await browser.targets();
  const workerTarget = targets.find(t => t.type() === 'worker' && t.url().includes('tcu.worker.js'));
  
  if (!workerTarget) {
    console.error('❌ [TCU Auditor] ERROR: tcu.worker.js no detectat. Assegura\'t que la PWA està corrent a :5173.');
    await browser.close();
    process.exit(1);
  }
  
  console.log(`[TCU Auditor] ⚙️ Worker detectat. Connectant via CDP...`);
  const workerSession = await workerTarget.createCDPSession();
  
  // 3. Simular estrès físic (Scroll + Keyboard Thrashing)
  console.log(`[TCU Auditor] 🔥 Simulant estrès físic extrem (Rage Taps / Thrashing)...`);
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel({ deltaY: Math.random() > 0.5 ? 800 : -800 });
    await page.keyboard.press('Backspace');
    await new Promise(r => setTimeout(r, 100)); 
  }
  
  // 4. Extreure HeapSnapshot
  console.log(`[TCU Auditor] 📸 Capturant HeapSnapshot de memòria...`);
  const chunks = [];
  workerSession.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
    chunks.push(chunk);
  });
  
  await workerSession.send('HeapProfiler.takeHeapSnapshot', { reportProgress: false });
  
  const snapshotData = chunks.join('');
  const snapshotJson = JSON.parse(snapshotData);
  
  // Càlcul heurístic pur del Worker: sumem el pes dels strings i els nodes JS
  const totalStringsSize = snapshotJson.strings.join('').length;
  const nodesCount = snapshotJson.nodes.length;
  const approxSizeKb = (totalStringsSize + (nodesCount * 4)) / 1024;
  
  console.log(`\n========================================`);
  console.log(`[TCU Auditor] 📊 Resultat de l'Auditoria`);
  console.log(`========================================`);
  console.log(`- Mida aproximada de Memòria (Heap): ${approxSizeKb.toFixed(2)} KB`);
  console.log(`- Pressupost Màxim (Llei Immutable): ${MAX_HEAP_KB} KB`);
  
  if (approxSizeKb > MAX_HEAP_KB) {
    console.error(`\n❌ [VEREDICTE] SUSPÈS. Has trencat la Llei del Pressupost.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✅ [VEREDICTE] 10/10 IMMUTABLE. El Worker és perfecte (Zero-Overhead).`);
  }
  
  await browser.close();
})();
