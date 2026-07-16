#!/usr/bin/env node
import * as Y from 'yjs';
import { compactYDocByProjection } from '../core/tombstone_gc.mjs';

const MB = 1024 * 1024;
const LIMIT_RSS_MB = Number(process.env.SDP_MAX_RSS_MB || 160);
const GC_RSS_MB = Number(process.env.SDP_GC_RSS_MB || 125);
const UPDATE_LIMIT_BYTES = Number(process.env.SDP_GC_UPDATE_BYTES || 15 * MB);
const TX = Number(process.env.SDP_TX || 10_000);
const LIVE_LIMIT = Number(process.env.SDP_LIVE_LIMIT || 8192);
const PAYLOAD = 'x'.repeat(Number(process.env.SDP_PAYLOAD_BYTES || 2048));

function rssMb() {
  return process.memoryUsage().rss / MB;
}

function forceGc() {
  if (global.gc) global.gc();
}

function fail(reason, data = {}) {
  console.error(JSON.stringify({ ok: false, reason, ...data }, null, 2));
  process.exit(1);
}

function projectText(fresh, oldDoc) {
  const oldText = oldDoc.getText('nota').toString();
  if (oldText) fresh.getText('nota').insert(0, oldText);
}

let doc = new Y.Doc({ gc: true });
let note = doc.getText('nota');
let gcRuns = 0;
let maxRss = rssMb();
let maxUpdateBytes = 0;

async function compact(reason) {
  const beforeRss = rssMb();
  if (beforeRss >= LIMIT_RSS_MB) fail('gc_too_late_before_compact', { beforeRss, reason });

  const oldDoc = doc;
  const res = compactYDocByProjection(Y, oldDoc, projectText, { measureBefore: false });
  doc = res.doc;
  note = doc.getText('nota');
  oldDoc.destroy();
  forceGc();

  gcRuns++;
  const afterRss = rssMb();
  if (afterRss >= LIMIT_RSS_MB) fail('rss_over_limit_after_compact', { afterRss, reason });

  return { beforeRss, afterRss, afterBytes: res.afterBytes };
}

for (let i = 0; i < TX; i++) {
  doc.transact(() => {
    note.insert(note.length, `${i}:${PAYLOAD}\n`);
    if (note.length > LIVE_LIMIT) note.delete(0, note.length - LIVE_LIMIT);
  }, 'stress');

  if (i % 100 === 0) {
    forceGc();
    const rss = rssMb();
    maxRss = Math.max(maxRss, rss);
    if (rss >= LIMIT_RSS_MB) fail('rss_limit_reached_before_gc', { i, rss });

    if (rss >= GC_RSS_MB) await compact('rss_guard');
  }

  if (i % 500 === 0 && i > 0) {
    const updateBytes = Y.encodeStateAsUpdate(doc).byteLength;
    maxUpdateBytes = Math.max(maxUpdateBytes, updateBytes);
    if (updateBytes >= UPDATE_LIMIT_BYTES) await compact('update_guard');
  }
}

const finalUpdateBytes = Y.encodeStateAsUpdate(doc).byteLength;
maxUpdateBytes = Math.max(maxUpdateBytes, finalUpdateBytes);
if (finalUpdateBytes >= UPDATE_LIMIT_BYTES) await compact('final_update_guard');

forceGc();
const finalRss = rssMb();
if (finalRss >= LIMIT_RSS_MB) fail('final_rss_over_limit', { finalRss });

console.log(JSON.stringify({
  ok: true,
  tx: TX,
  gcRuns,
  finalRssMb: Number(finalRss.toFixed(1)),
  maxRssMb: Number(maxRss.toFixed(1)),
  maxUpdateBytes,
  liveChars: note.length,
  limitRssMb: LIMIT_RSS_MB
}, null, 2));

doc.destroy();
