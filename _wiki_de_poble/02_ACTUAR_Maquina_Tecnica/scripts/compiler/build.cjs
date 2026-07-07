#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const SCRIPTS = [
  { name: 'Index', file: '01_build_index.cjs' },
  { name: 'Ontologia', file: '02_build_ontology.cjs' }
];

function runScript(script, wikiRoot) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`▶  Executant: ${script.name}`);
    console.log(`${'═'.repeat(60)}\n`);
    
    const proc = spawn('node', [
      path.join(__dirname, script.file),
      `--wiki=${wikiRoot}`
    ], { stdio: 'inherit' });
    
    proc.on('close', (code) => {
      // Allow warnings (code 1) but reject critical errors (code 2)
      if (code === 2) reject(new Error(`${script.name} va fallar amb errors crítics`));
      else resolve({ script: script.name, code });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const wikiRoot = wikiArg ? wikiArg.split('=')[1] : path.resolve(__dirname, '../../');
  
  const startTime = Date.now();
  console.log(`🏗️  BUILD COMPLETA — Wiki: ${wikiRoot}`);
  console.log(`⏱️  Inici: ${new Date().toISOString()}`);
  
  try {
    const results = [];
    for (const script of SCRIPTS) {
      const result = await runScript(script, wikiRoot);
      results.push(result);
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ BUILD COMPLETADA en ${duration}s`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`📦 Artefactes generats a: ${path.join(wikiRoot, '_build')}`);
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

main();
