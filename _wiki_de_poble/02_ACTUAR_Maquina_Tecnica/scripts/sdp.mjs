#!/usr/bin/env node
// scripts/sdp.mjs — Punt d'entrada únic del CLI `sdp`, pla (no dins bin/). Vanilla Node ESM,
// zero deps. Taula de rutes explícita: el nom de la comanda que veu l'usuari no sempre coincideix
// amb el nom del fitxer del motor (ex: `build` -> snapshot_engine.mjs), així que no s'endevina
// per convenció -- es declara ací, en un únic lloc auditable.
// Ús: sdp <comanda> [--root=.] [--json] [--write] [--file=ruta] [--query="text"] [--top=5]
import { parseArgs } from 'node:util';

const CORE_DIR = new URL('./core/', import.meta.url);

const COMMAND_MAP = {
  audit: 'audit.mjs',
  lint: 'lint.mjs',
  translate: 'translate.mjs',
  build: 'snapshot_engine.mjs', // Protocol Lázaro: fotografia comprimida i rotativa
  check: 'trellat_metrics.mjs', // Índex de Trellat + porta SDP-LOCK
  gc: 'tombstone_gc.mjs', // esporgadora de làpides CRDT
  repair: 'self_repair.mjs', // Autosanació: frontmatter + títols termodinàmics febles
  'self-repair': 'self_repair.mjs',
  search: 'edge_rag.mjs', // cercador semàntic local TF-IDF
  'a11y-seo': 'a11y_seo.mjs',
  design: 'design_guard.mjs'
};

const t0 = performance.now();

function parseArgv(argv) {
  return parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      json: { type: 'boolean', default: false },
      write: { type: 'boolean', default: false },
      root: { type: 'string', default: '.' },
      file: { type: 'string', default: '' },
      mode: { type: 'string', default: 'complet' },
      query: { type: 'string', default: '' },
      top: { type: 'string', default: '' },
      keep: { type: 'string', default: '' },
    },
  });
}

function printUsage() {
  console.log('sdp — CLI de manteniment de Sóc de Poble\n');
  console.log('Ús: sdp <comanda> [opcions]\n');
  console.log('Comandes disponibles:');
  for (const c of Object.keys(COMMAND_MAP).sort()) console.log(`  - ${c}`);
  console.log('\nOpcions comunes: --root=<path> --json --write --file=<path> --mode=<nom> --query="..." --top=<n>');
}

async function main() {
  let values, positionals;
  try {
    ({ values, positionals } = parseArgv(process.argv.slice(2)));
  } catch (err) {
    console.error(`[ERROR] Arguments invàlids: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const cmd = positionals[0];

  if (!cmd) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const fileName = COMMAND_MAP[cmd];
  if (!fileName) {
    if (values.json) {
      console.log(JSON.stringify({ ok: false, command: cmd, error: 'comanda-desconeguda', available: Object.keys(COMMAND_MAP) }, null, 2));
    } else {
      console.error(`[ERROR] Comanda desconeguda: "${cmd}".`);
      printUsage();
    }
    process.exitCode = 1;
    return;
  }

  let mod;
  try {
    mod = await import(new URL(fileName, CORE_DIR));
  } catch (err) {
    console.error(`[FATAL] No s'ha pogut carregar la comanda "${cmd}" (${fileName}): ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (typeof mod.run !== 'function') {
    console.error(`[FATAL] "${fileName}" no exporta un run(options) vàlid.`);
    process.exitCode = 1;
    return;
  }

  const { runCommand } = await import(new URL('runner.mjs', CORE_DIR));
  
  let result = await runCommand(cmd, values, async (safeValues) => {
    return mod.run(safeValues, positionals.slice(1));
  });

  const elapsedMs = Math.round(performance.now() - t0);

  if (values.json) {
    console.log(JSON.stringify({ command: cmd, elapsedMs, ...result }, null, 2));
  } else {
    console.log(result.summary ?? '(sense resum)');
    if (elapsedMs > 2000) console.error(`[AVÍS] sdp ${cmd} ha trigat ${elapsedMs}ms (> 2s, revisar Trellat).`);
  }

  process.exitCode = result.ok ? 0 : 1;
}

main();
