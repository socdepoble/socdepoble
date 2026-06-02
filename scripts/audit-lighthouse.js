import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs/promises';
import path from 'path';

const REPORT_DIR = './audits/reports';
const TARGET_URL = 'https://socdepoble.org';

async function ensureReportDir() {
  try {
    await fs.mkdir(REPORT_DIR, { recursive: true });
  } catch (e) {
    console.warn('[AUDIT] No s\'ha pogut crear el directori de reports. Usant temporal.');
  }
}

async function safeChromeLaunch() {
  try {
    return await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });
  } catch (error) {
    console.error('[ERROR] No s\'ha pogut llançar Chrome:', error.message);
    throw new Error('CHROME_LAUNCH_FAILED');
  }
}

async function runLighthouseAudit() {
  let chrome = null;

  try {
    await ensureReportDir();

    console.log(`[PETORRETA] Iniciant auditoria Lighthouse de ${TARGET_URL}...`);

    chrome = await safeChromeLaunch();

    const options = {
      logLevel: 'error',           // Només errors reals
      output: ['html', 'json'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      port: chrome.port,
      emulatedFormFactor: 'mobile',
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 150,
        downlinkKbps: 1000,
        cpuSlowdownMultiplier: 4,   // Simula iPad A10
      },
    };

    const runnerResult = await lighthouse(TARGET_URL, options);

    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('LIGHTHOUSE_NO_RESULT');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlPath = path.join(REPORT_DIR, `audit-${timestamp}.html`);
    const jsonPath = path.join(REPORT_DIR, `audit-${timestamp}.json`);

    // Guardar reports
    await fs.writeFile(htmlPath, runnerResult.report);
    await fs.writeFile(jsonPath, JSON.stringify(runnerResult.lhr, null, 2));

    // Resultats crítics
    const scores = {
      performance: runnerResult.lhr.categories.performance.score * 100,
      accessibility: runnerResult.lhr.categories.accessibility.score * 100,
      bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
      pwa: runnerResult.lhr.categories.pwa.score * 100,
    };

    console.log('\n✅ AUDITORIA COMPLETADA');
    console.table(scores);

    // Alertes si no arriba a 10/10
    if (scores.performance < 98) {
      console.warn(`⚠️  PERFORMANCE: ${scores.performance.toFixed(1)} → Cal millorar`);
    }
    if (scores.accessibility < 100) {
      console.warn(`⚠️  ACCESSIBILITAT: ${scores.accessibility.toFixed(1)}`);
    }

    return { success: true, scores, htmlPath };

  } catch (error) {
    console.error('[PETORRETA ERROR] Auditoria fallida:', error.message);

    if (error.message === 'CHROME_LAUNCH_FAILED') {
      console.error('→ Verifiqueu que Chrome estiga instal·lat i accessible.');
    } else if (error.message === 'LIGHTHOUSE_NO_RESULT') {
      console.error('→ Lighthouse no ha retornat resultats vàlids.');
    }

    return { success: false, error: error.message };
  } finally {
    // Netegem sempre Chrome
    if (chrome) {
      try {
        await chrome.kill();
        console.log('[CLEANUP] Chrome tancat correctament.');
      } catch (cleanupError) {
        console.warn('[CLEANUP] Error tancant Chrome:', cleanupError.message);
      }
    }
  }
}

// Execució principal amb gestió de bucles
async function main() {
  try {
    const result = await runLighthouseAudit();

    if (result.success) {
      console.log('\n🎯 El Mas Digital manté camí cap al 10/10 absolut.');
    } else {
      console.log('\n🔄 Torna a executar després de revisar els errors.');
    }
  } catch (fatalError) {
    console.error('[FATAL] Error no controlat en l\'auditoria:', fatalError);
    process.exit(1);
  }
}

main();
