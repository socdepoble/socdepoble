const { execSync } = require('child_process');
const { resolve } = require('path');

const SDP_PATH = resolve(__dirname, 'sdp.mjs');
const ROOT_PATH = resolve(__dirname, '../..');

function runSdpCommand(cmd) {
  console.log(`\n--- Executant sdp ${cmd} ---`);
  try {
    execSync(`node "${SDP_PATH}" ${cmd}`, { cwd: ROOT_PATH, stdio: 'inherit' });
    console.log(`[OK] sdp ${cmd}`);
  } catch (error) {
    console.error(`[ERROR] sdp ${cmd} ha fallat! El tallafocs atura l'execució.`);
    process.exit(1);
  }
}

console.log("🔥 INICIANT TALLAFOCS DE PEDRA SECA 🔥\n");

// Cadena d'execució recomanada
runSdpCommand('audit');
runSdpCommand('lint');
runSdpCommand('a11y-seo');
runSdpCommand('design');
runSdpCommand('check');

console.log("\n✅ TOTES LES PROVES SUPERADES. El sistema respira lliure.");
process.exit(0);
