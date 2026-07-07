// pwa_rural_audit.js
// Script Node.js Vanilla per a auditoria rural PWA (Sóc de Poble)
// Lighthouse amb throttling 2G + CPU, axe-core AAA, HTML + JSON reports
// safeExecute per robustesa

const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer-core');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const AUDIT_DIR = path.join(process.cwd(), '_auditories');
const REPORT_BASE = `rural-audit-${new Date().toISOString().replace(/[:.]/g, '-')}`;
const JSON_REPORT = `${REPORT_BASE}.json`;
const HTML_REPORT = `${REPORT_BASE}.html`;

const https = require('https');

async function pingHealthchecks(status = '') {
  const HEALTHCHECKS_URL = process.env.HEALTHCHECKS_URL;
  if (!HEALTHCHECKS_URL) return;

  return new Promise((resolve) => {
    const url = status === 'fail' 
      ? `${HEALTHCHECKS_URL}/fail` 
      : HEALTHCHECKS_URL;

    const req = https.request(url, { method: 'POST' }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    });

    req.on('error', (e) => {
      console.warn('⚠️ Healthchecks ping fallit (offline o error xarxa):', e.message);
      resolve(false);
    });

    req.setTimeout(3000, () => {
      req.destroy();
      console.warn('⚠️ Healthchecks timeout (offline acceptable)');
      resolve(false);
    });

    req.end();
  });
}

async function ensureAuditDir() {
  if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
    console.log(`📁 Directori creat: ${AUDIT_DIR}`);
  }
}

async function safeExecute(fn, name) {
  try {
    console.log(`🔄 Executant: ${name}`);
    return await fn();
  } catch (error) {
    console.error(`💥 Error en ${name}:`, error.message);
    if (error.message.includes('memory') || error.message.includes('ENOMEM')) {
      console.error('⚠️ Possible problema de memòria. Prova tancar altres processos o augmentar RAM.');
    }
    if (error.code === 'ECONNREFUSED' || error.message.includes('net::ERR') || error.message.includes('Failed to launch')) {
      console.error('🌐 Error de xarxa/servidor local. Assegura que el servidor està corrent (ex: npx serve . -l 8080).');
    }
    if (error.message.includes('timeout')) {
      console.error('⏱️ Timeout. Prova augmentar waitUntil o reduir throttling.');
    }
    throw error;
  }
}

async function runLighthouse(url) {
  return safeExecute(async () => {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
    });

    const flags = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 300,
        throughputKbps: 50,
        requestLatencyMs: 300,
        downloadThroughputKbps: 50,
        uploadThroughputKbps: 25,
        cpuSlowdownMultiplier: 8
      },
      screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleFactor: 2 }
    };

    const runnerResult = await lighthouse(url, flags, {
      extends: 'lighthouse:default',
      settings: { onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'] }
    });

    await chrome.kill();
    return runnerResult;
  }, 'Lighthouse Audit');
}

async function runAxeAudit(url) {
  return safeExecute(async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 640 });

    await page.goto(url, { waitUntil: 'networkidle2' });

    const axe = new AxePuppeteer(page);
    const results = await axe
      .withRules([
        'color-contrast-enhanced', 'color-contrast',
        'target-size',
        'focus-order', 'skip-link', 'landmark-one-main',
        'aria-required-attr', 'button-name', 'image-alt',
        'label', 'link-name', 'meta-viewport', 'html-has-lang'
      ])
      .analyze();

    await browser.close();
    return results;
  }, 'axe-core Audit');
}

function generateHtmlReport(auditReport, jsonPath) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <title>Auditoria Rural PWA - ${auditReport.timestamp}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: #f8f9fa; line-height: 1.5; }
    h1, h2 { color: #2c3e50; }
    .summary { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .good { color: #27ae60; font-weight: bold; } .bad { color: #e74c3c; font-weight: bold; }
    pre { background: #f4f4f4; padding: 15px; overflow-x: auto; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>📊 Auditoria Rural PWA (Sóc de Poble)</h1>
  <div class="summary">
    <h2>Resum</h2>
    <p><strong>URL:</strong> ${auditReport.url}</p>
    <p><strong>Data:</strong> ${auditReport.timestamp}</p>
    <p class="${auditReport.summary.accessibility >= 0.9 ? 'good' : 'bad'}"><strong>Accessibilitat Lighthouse:</strong> ${(auditReport.summary.accessibility * 100).toFixed(1)}%</p>
    <p><strong>Violacions axe-core:</strong> ${auditReport.axe.violations.length}</p>
  </div>
  <h2>Recomanacions Pedra Seca</h2>
  <p>${auditReport.summary.recommendations}</p>
  <p><a href="${path.basename(jsonPath)}" download>📥 Descarregar JSON complet</a></p>
</body>
</html>`;
  fs.writeFileSync(path.join(AUDIT_DIR, HTML_REPORT), htmlContent);
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('❌ Usa: node pwa_rural_audit.js <URL>');
    console.error('Exemple: node pwa_rural_audit.js http://localhost:8080');
    process.exit(1);
  }

  try {
    await ensureAuditDir();

    const lhResult = await runLighthouse(url);
    const axeResult = await runAxeAudit(url);

    const auditReport = {
      timestamp: new Date().toISOString(),
      url,
      lighthouse: lhResult.lhr,
      axe: {
        violations: axeResult.violations,
        passes: axeResult.passes.length,
        incomplete: axeResult.incomplete
      },
      summary: {
        performance: lhResult.lhr.categories.performance.score,
        accessibility: lhResult.lhr.categories.accessibility.score,
        axeViolations: axeResult.violations.length,
        axeContrastIssues: axeResult.violations.filter(v => v.id.includes('color-contrast')).length,
        recommendations: "Prioritzar contrast AAA (7:1), touch targets ≥48px, navegació per teclat i alt texts en valencià per usuaris rurals amb dispositius antics."
      }
    };

    const jsonPath = path.join(AUDIT_DIR, JSON_REPORT);
    fs.writeFileSync(jsonPath, JSON.stringify(auditReport, null, 2));

    generateHtmlReport(auditReport, jsonPath);

    console.log(`✅ Auditoria rural completada!`);
    console.log(`📄 JSON: _auditories/${JSON_REPORT}`);
    console.log(`📄 HTML: _auditories/${HTML_REPORT}`);
    console.log(`📊 Accessibilitat: ${(lhResult.lhr.categories.accessibility.score * 100).toFixed(1)}%`);

    if (lhResult.lhr.categories.accessibility.score < 0.90) {
      console.warn('⚠️ Accessibilitat per sota del 90%. Revisa les violacions abans de merge.');
    }

    // Ping èxit resilient
    await pingHealthchecks();
  } catch (error) {
    console.error('💥 Error fatal en l\'auditoria:', error.message);
    
    // Ping error resilient
    await pingHealthchecks('fail');
    
    process.exit(1);
  }
}

main();
