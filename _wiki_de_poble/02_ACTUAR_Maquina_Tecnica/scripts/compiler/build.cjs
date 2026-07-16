#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const { pathToFileURL } = require('url');

const SCRIPTS = [
  { name: 'Index', file: '01_build_index.cjs' },
  { name: 'Ontologia', file: '02_build_ontology.cjs' }
];

function runScript(script, wikiRoot, receipt, claimToken) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`▶  Executant: ${script.name}`);
    console.log(`${'═'.repeat(60)}\n`);
    
    const proc = spawn('node', [
      path.join(__dirname, script.file),
      `--wiki=${wikiRoot}`,
      `--receipt=${receipt}`
    ], {
      stdio: 'inherit',
      env: { ...process.env, SDP_REFLEX_CLAIM: claimToken },
    });
    
    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(`${script.name} ha fallat amb codi ${code}`));
      else resolve({ script: script.name, code });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const receiptArg = args.find(a => a.startsWith('--receipt='));
  if (!receiptArg) throw new Error('El compilador exigix --receipt=<lease Reflex> per a l’operació compiler-build.');
  const receipt = path.resolve(receiptArg.slice('--receipt='.length));
  const wikiRoot = path.resolve(wikiArg ? wikiArg.slice('--wiki='.length) : path.resolve(__dirname, '../../..'));
  const buildDir = path.join(wikiRoot, '_build');
  const reflexUrl = pathToFileURL(path.resolve(__dirname, '../reflex_petorreta.mjs')).href;
  const { claimReceiptForMutation, completeMutationClaim } = await import(reflexUrl);
  const { claimToken } = await claimReceiptForMutation({
    receiptPath: receipt,
    operation: 'compiler-build',
    targets: [buildDir],
    checkDirty: true,
  });
  
  const startTime = Date.now();
  console.log(`🏗️  BUILD COMPLETA — Wiki: ${wikiRoot}`);
  console.log(`⏱️  Inici: ${new Date().toISOString()}`);
  
  try {
    const results = [];
    for (const script of SCRIPTS) {
      const result = await runScript(script, wikiRoot, receipt, claimToken);
      results.push(result);
    }
    await completeMutationClaim({ receiptPath: receipt, operation: 'compiler-build' }, claimToken);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ BUILD COMPLETADA en ${duration}s`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`📦 Artefactes generats a: ${buildDir}`);
    console.log(`   • documents.json`);
    console.log(`   • manifest.json`);
    console.log(`   • ontology.json`);
    console.log(`   • knowledge.json  ← BINARI FINAL`);
    
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ BUILD FALLIDA: ${err.message}`);
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(`❌ BUILD BLOQUEJADA: ${err.message}`);
  process.exitCode = 2;
});
