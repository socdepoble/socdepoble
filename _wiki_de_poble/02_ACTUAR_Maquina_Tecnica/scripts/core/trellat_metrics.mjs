// core/trellat_metrics.mjs — Índex de Trellat (IT): mesura de salut global del projecte.
// IT = 0.5*Coherència + 0.25*Eficiència + 0.25*Resiliència (pesos a rules.json).
// Sense component d'Accessibilitat (CA) del disseny original: exigeix DOM/axe-core en viu,
// no mesurable en un escaneig estàtic de fitxers — s'omet explícitament, no s'inventa un número.
// IT < itLock (70) -> SDP-LOCK: checkGate() ho senyala perquè qui invoque aquest mòdul s'ature.
import { readFile, stat } from 'node:fs/promises';
import { run as runAudit } from './audit.mjs';
import { nodeAdapter, latestSnapshot, verifySnapshot } from './snapshot_engine.mjs';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

/** Coherència (CT): 100 menys penalització ponderada per severitat. Fitada [0,100] per construcció
 * (Math.min/max), no per convenció: un crític pesa 3x un avís; el pitjor cas raonable és un
 * crític per fitxer, i és el que fixa el denominador. */
function coherencia({ critical, warning, filesScanned }) {
  if (filesScanned === 0) return 100; // corpus buit: no hi ha res a contradir
  const weight = critical * 3 + warning * 1;
  const maxWeight = filesScanned * 3;
  return Math.min(100, Math.max(0, 100 * (1 - weight / maxWeight)));
}

/** Eficiència (CE): bytes/fitxer mitjans contra el pressupost ideal (`idealBytesPerFile`).
 * Fitada [0,100]: un corpus més lleuger que l'ideal puntua 100 (no es premia per damunt), un
 * corpus més pesat degrada linealment. */
function eficiencia(totalBytes, fileCount, idealBytesPerFile) {
  if (fileCount === 0) return 100;
  const avgBytes = totalBytes / fileCount;
  if (avgBytes <= 0) return 100;
  return Math.min(100, Math.max(0, (idealBytesPerFile / avgBytes) * 100));
}

/** Resiliència (CR): integració real amb snapshot_engine (no un número arbitrari). Existeix un
 * snapshot verificable i alineat amb el corpus actual? 0 = sense xarxa de seguretat, 60 = hi ha
 * xarxa però desactualitzada, 100 = recuperació garantida ara mateix. */
async function resiliencia(root, fileCount) {
  const path = await latestSnapshot(`${root}/.snapshots`);
  if (!path) return { score: 0, detail: 'Cap snapshot trobat: sense xarxa de seguretat.' };
  const verified = await verifySnapshot(path, undefined, null);
  if (!verified.ok) return { score: 0, detail: `Snapshot corromput o il·legible: ${verified.error || 'verificació fallida'}.` };
  if (verified.fileCount === fileCount) return { score: 100, detail: `Snapshot verificat i alineat (${verified.fileCount} fitxers).` };
  return { score: 60, detail: `Snapshot verificat però desalineat (${verified.fileCount} vs ${fileCount} actuals).` };
}

async function walkStats(root) {
  const files = await nodeAdapter.walk(root); // reutilitza el mateix recorregut que snapshot_engine
  let totalBytes = 0;
  for (const f of files) totalBytes += (await stat(f)).size;
  return { totalBytes, fileCount: files.length };
}

/** Porta de seguretat SDP-LOCK. Pura funció de (it, rules) -> veredicte: fàcil de testejar sense
 * fer I/O ni dependre de l'estat del disc. */
export function checkGate(it, rules) {
  const locked = it < rules.thresholds.itLock;
  return {
    locked,
    it,
    threshold: rules.thresholds.itLock,
    reason: locked ? `IT ${it.toFixed(1)} < llindar ${rules.thresholds.itLock}: SDP-LOCK.` : null,
  };
}

export async function run(options) {
  const root = options.root || '.';
  const rules = await loadRules();
  const w = rules.trellatMetricsWeights;

  const [auditResult, stats] = await Promise.all([runAudit({ root, mode: 'trellat-metrics' }), walkStats(root)]);
  const ct = coherencia(auditResult.data.summary);
  const ce = eficiencia(stats.totalBytes, stats.fileCount, rules.thresholds.idealBytesPerFile);
  const cr = await resiliencia(root, stats.fileCount);

  const it = w.coherencia * ct + w.eficiencia * ce + w.resiliencia * cr.score;
  const gate = checkGate(it, rules);

  return {
    ok: !gate.locked,
    summary: gate.locked
      ? `🔒 SDP-LOCK: IT=${it.toFixed(1)} per davall de ${rules.thresholds.itLock}. Execució aturada.`
      : `IT=${it.toFixed(1)} (CT=${ct.toFixed(1)} CE=${ce.toFixed(1)} CR=${cr.score.toFixed(1)}).`,
    data: {
      it: Number(it.toFixed(1)),
      components: { coherencia: Number(ct.toFixed(1)), eficiencia: Number(ce.toFixed(1)), resiliencia: Number(cr.score.toFixed(1)) },
      weights: w,
      resilienciaDetail: cr.detail,
      fileCount: stats.fileCount,
      totalBytes: stats.totalBytes,
      gate,
    },
  };
}
