import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configuració
const METRICS_DIR = path.join(__dirname, '../06_metriques');
const DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// 2. Funcions per a calcular cada mètrica
function calculateIT(CT, CE, CA, CR) {
  return (0.4 * CT + 0.3 * CE + 0.2 * CA + 0.1 * CR).toFixed(2);
}

function calculateCT(decisionsCoherents, decisionsTotals) {
  return ((decisionsCoherents / decisionsTotals) * 100).toFixed(2);
}

function calculateCE(tokensUtiles, tokensTotals) {
  return ((tokensUtiles / tokensTotals) * 100).toFixed(2);
}

function calculateCA(componentsAccessibles, componentsTotals) {
  return ((componentsAccessibles / componentsTotals) * 100).toFixed(2);
}

function calculateCR(sincronitzacionsOk, sincronitzacionsTotals) {
  return ((sincronitzacionsOk / sincronitzacionsTotals) * 100).toFixed(2);
}

function calculateUDR(canvisDestructius, canvisTotals) {
  return ((canvisDestructius / canvisTotals) * 100).toFixed(2);
}

function calculateCTS(tombstones, esdevenimentsTotals) {
  return ((tombstones / esdevenimentsTotals) * 1000).toFixed(2);
}

function calculateFPS() {
  // Simulació: En un entorn real, s'usaria requestAnimationFrame
  return Math.floor(Math.random() * 20) + 40; // 40-60 FPS
}

function calculateET(tokens) {
  const freq = {};
  tokens.forEach(token => {
    freq[token] = (freq[token] || 0) + 1;
  });
  let entropy = 0;
  for (const key in freq) {
    const p = freq[key] / tokens.length;
    entropy -= p * Math.log2(p);
  }
  return entropy.toFixed(2);
}

function calculateIFM(sessionsEsgotades, sessionsTotals) {
  return ((sessionsEsgotades / sessionsTotals) * 100).toFixed(2);
}

function calculateMR() {
  // Simulació: En Node.js, s'usaria performance.memory
  return (Math.random() * 500 + 1000).toFixed(2); // 1000-1500 MB
}

function calculateIS(paquetsSincronitzats, paquetsTotals) {
  return ((paquetsSincronitzats / paquetsTotals) * 100).toFixed(2);
}

function calculateITR(wikiLinksValids, wikiLinksTotals) {
  return ((wikiLinksValids / wikiLinksTotals) * 100).toFixed(2);
}

// 3. Funció principal per a registrar les mètriques
function logSessionMetrics() {
  // Dades de simulació (en un entorn real, s'extreurien del sistema)
  const metrics = {
    CT: calculateCT(18, 20),       // 90%
    CE: calculateCE(8500, 10000),   // 85%
    CA: calculateCA(48, 50),       // 96%
    CR: calculateCR(995, 1000),     // 99.5%
    UDR: calculateUDR(2, 100),      // 2%
    CTS: calculateCTS(8, 1000),     // 8
    FPS: calculateFPS(),           // 55
    ET: calculateET(['--sp-orange-100', '--sp-blue-100', '--sp-radius-main']), // ~1.5
    IFM: calculateIFM(1, 20),      // 5%
    MR: calculateMR(),             // 1200 MB
    IS: calculateIS(990, 1000),     // 99%
    ITR: calculateITR(198, 200)    // 99%
  };

  // Calculem l'IT
  metrics.IT = calculateIT(metrics.CT, metrics.CE, metrics.CA, metrics.CR);

  // Creem el directori de mètriques si no existeix
  if (!fs.existsSync(METRICS_DIR)) {
    fs.mkdirSync(METRICS_DIR, { recursive: true });
  }

  // Guardem cada mètrica en un arxiu individual
  for (const [key, value] of Object.entries(metrics)) {
    const filePath = path.join(METRICS_DIR, `${key}_${DATE}.md`);
    const content = `---
date: ${DATE}
value: ${value}
unit: ${key === 'CTS' ? 'tombstones/1000' : key === 'ET' ? 'bits' : key === 'MR' ? 'MB' : '%'}
---

# ${key}

**Valor:** ${value} ${key === 'CTS' ? 'tombstones/1000 esdeveniments' : key === 'ET' ? 'bits' : key === 'MR' ? 'MB' : '%'}
**Data:** ${DATE}
**Estat:** ${value >= 90 ? '✅ Òptim' : value >= 70 ? '⚠️ Acceptable' : '❌ Crític'}
`;
    fs.writeFileSync(filePath, content);
  }

  // Generem un arxiu resum de la sessió
  const summaryPath = path.join(METRICS_DIR, `RESUM_${DATE}.md`);
  let summaryContent = `# Resum de Mètriques - ${DATE}\n\n`;
  summaryContent += `| Mètrica | Valor | Unitats | Estat |\n`;
  summaryContent += `|---------|-------|---------|-------|\n`;
  for (const [key, value] of Object.entries(metrics)) {
    const unit = key === 'CTS' ? 'tombstones/1000' : key === 'ET' ? 'bits' : key === 'MR' ? 'MB' : '%';
    const status = value >= 90 ? '✅' : value >= 70 ? '⚠️' : '❌';
    summaryContent += `| ${key} | ${value} | ${unit} | ${status} |\n`;
  }
  fs.writeFileSync(summaryPath, summaryContent);

  console.log(`✅ Mètriques registrades a ${METRICS_DIR}`);
}

// 4. Executem el logger
logSessionMetrics();
