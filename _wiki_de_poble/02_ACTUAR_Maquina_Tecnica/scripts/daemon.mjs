#!/usr/bin/env node
// daemon.mjs — CANVIS DE FONS (la resta és idèntica a la teua versió):
//   1. Els imports originals no existien: tombstone_gc.mjs exporta `run` (no runTombstoneGC)
//      i trellat_metrics.mjs exporta `run` (no calculateTrellat). En ESM això és un error
//      d'instanciació de mòdul: el daemon NO HAVIA ARRANCAT MAI. Ara s'importa `run as ...`.
//   2. La crida al GC passava { statePath, snapshot } però run() espera { file, write } i
//      ignorava el callback snapshot: la Regla de Ferro (Snapshot -> Compactació) no es
//      complia. Ara el snapshot es fa EXPLÍCITAMENT abans del GC i s'aborta si falla.
//   3. Si el Trellat activa SDP-LOCK, es registra com a event propi (abans es perdia
//      dins d'un `done` amb ok:false).
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { createSnapshot } from './core/snapshot_engine.mjs';
import { run as runTombstoneGC } from './core/tombstone_gc.mjs';
import { run as calculateTrellat } from './core/trellat_metrics.mjs';
import { run as runSelfRepair } from './core/self_repair.mjs';

const execAsync = promisify(exec);

const MB = 1024 * 1024;

const CFG = {
  root: resolve(process.env.SDP_ROOT || process.cwd()),
  state: process.env.SDP_STATE || '',
  maxRssMb: Number(process.env.SDP_MAX_RSS_MB || 160),
  snapshotMs: Number(process.env.SDP_SNAPSHOT_MS || 60 * 60 * 1000),
  gcMs: Number(process.env.SDP_GC_MS || 6 * 60 * 60 * 1000),
  selfRepairMs: Number(process.env.SDP_SELF_REPAIR_MS || 12 * 60 * 60 * 1000),
  selfRepairWrite: process.env.SDP_SELF_REPAIR_WRITE === '1',
  checkMs: Number(process.env.SDP_CHECK_MS || 15 * 60 * 1000),
  idleMs: Number(process.env.SDP_IDLE_MS || 2500),
  logDir: process.env.SDP_LOG_DIR || '',
  auditMs: Number(process.env.SDP_AUDIT_MS || 24 * 60 * 60 * 1000), // Diari
  dsStoreSweepMs: Number(process.env.SDP_DSSTORE_SWEEP_MS || 12 * 60 * 60 * 1000) // 2x al dia
};

let stopping = false;
let busy = false;
let lastSnapshot = 0;
let lastGc = 0;
let lastSelfRepair = 0;
let lastCheck = 0;
let lastAudit = 0;
let lastDsStoreSweep = 0;

function now() {
  return Date.now();
}

function rssMb() {
  return process.memoryUsage().rss / MB;
}

function heapMb() {
  return process.memoryUsage().heapUsed / MB;
}

function healthy() {
  return rssMb() < CFG.maxRssMb;
}

function jitter(ms) {
  return Math.round(ms * (0.85 + Math.random() * 0.3));
}

async function log(event, data = {}) {
  const dir = CFG.logDir || join(CFG.root, '04_ARXIU_Documents_Historics', '01_logs_termodinamics');
  await mkdir(dir, { recursive: true });
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    event,
    rss_mb: Number(rssMb().toFixed(1)),
    heap_mb: Number(heapMb().toFixed(1)),
    ...data
  }) + '\n';
  await writeFile(join(dir, 'daemon.ndjson'), line, { flag: 'a' });
}

async function runSafe(name, fn) {
  if (busy || stopping) return;
  if (!healthy()) {
    await log('skip_memory', { task: name, max_rss_mb: CFG.maxRssMb });
    return;
  }

  busy = true;
  try {
    await sleep(CFG.idleMs);
    if (!healthy()) {
      await log('skip_after_idle', { task: name });
      return;
    }
    const started = now();
    const res = await fn();
    await log('done', { task: name, ms: now() - started, ok: res?.ok !== false });
  } catch (err) {
    await log('error', { task: name, error: err.message });
  } finally {
    busy = false;
    if (global.gc && !healthy()) global.gc();
  }
}

async function tick() {
  const t = now();

  if (t - lastSnapshot >= CFG.snapshotMs) {
    lastSnapshot = t;
    await runSafe('snapshot', () => createSnapshot({ root: CFG.root }));
  }

  if (CFG.state && existsSync(CFG.state) && t - lastGc >= CFG.gcMs) {
    lastGc = t;
    await runSafe('gc', async () => {
      // Regla de Ferro (tombstone_gc.mjs, capçalera): Snapshot -> Compactació -> Informe.
      const snap = await createSnapshot({ root: CFG.root });
      if (!snap.ok) {
        await log('gc_abort', { reason: 'snapshot previ no verificat' });
        return { ok: false };
      }
      return runTombstoneGC({ file: CFG.state, write: true });
    });
  }

  if (CFG.selfRepairMs > 0 && t - lastSelfRepair >= CFG.selfRepairMs) {
    lastSelfRepair = t;
    await runSafe('self_repair', () => runSelfRepair({ root: CFG.root, write: CFG.selfRepairWrite }));
  }

  if (t - lastCheck >= CFG.checkMs) {
    lastCheck = t;
    await runSafe('trellat', async () => {
      const res = await calculateTrellat({ root: CFG.root });
      if (res.data?.gate?.locked) {
        await log('sdp_lock', { it: res.data.it, threshold: res.data.gate.threshold });
      }
      return res;
    });
  }

  if (t - lastAudit >= CFG.auditMs) {
    lastAudit = t;
    await runSafe('audit_integritat', async () => {
      const scriptPath = join(CFG.root, '02_ACTUAR_Maquina_Tecnica', 'scripts', 'audit_integritat_estructural.cjs');
      const { stdout } = await execAsync(`node "${scriptPath}" --root "${CFG.root}"`).catch(e => e);
      return { ok: true, report_preview: stdout ? stdout.slice(-100).trim() : 'failed' };
    });
  }

  if (t - lastDsStoreSweep >= CFG.dsStoreSweepMs) {
    lastDsStoreSweep = t;
    await runSafe('dsstore_sweep', async () => {
      await execAsync(`find "${CFG.root}" -name ".DS_Store" -type f -delete`).catch(() => {});
      return { ok: true };
    });
  }
}

async function main() {
  await log('start', { root: CFG.root, max_rss_mb: CFG.maxRssMb });
  if (CFG.selfRepairWrite) {
    await log('dangerous_mode', {
      task: 'self_repair',
      message: 'Self-repair en mode escriptura. Requereix snapshot recent i revisio posterior.'
    });
  }
  while (!stopping) {
    await tick();
    await sleep(jitter(30_000));
  }
  await log('stop');
}

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { stopping = true; });
}

main().catch(async err => {
  await log('fatal', { error: err.message }).catch(() => {});
  process.exit(70);
});
