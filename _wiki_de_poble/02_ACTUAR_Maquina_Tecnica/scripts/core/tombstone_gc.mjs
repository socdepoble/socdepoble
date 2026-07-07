import { createReadStream, createWriteStream } from 'node:fs';
import { readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createGzip, createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

const MB = 1024 * 1024;
const DEFAULTS = {
  thresholdBytes: 15 * MB,
  tombstonePercentMax: 70,
  maxJsonBytes: 4 * MB
};

function stripTombstones(node, acc) {
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      if (item && typeof item === 'object' && item.__deleted === true) {
        acc.removed++;
        acc.removedBytes += Buffer.byteLength(JSON.stringify(item));
        continue;
      }
      out.push(stripTombstones(item, acc));
    }
    return out;
  }

  if (node && typeof node === 'object') {
    if (node.__deleted === true) {
      acc.removed++;
      acc.removedBytes += Buffer.byteLength(JSON.stringify(node));
      return undefined;
    }

    const out = {};
    for (const [k, v] of Object.entries(node)) {
      const next = stripTombstones(v, acc);
      if (next !== undefined) out[k] = next;
    }
    return out;
  }

  return node;
}

async function sha256File(path, gunzip = false) {
  const h = createHash('sha256');
  const sink = new Transform({
    transform(chunk, enc, cb) {
      h.update(chunk);
      cb(null, chunk);
    }
  });

  const streams = gunzip
    ? [createReadStream(path), createGunzip(), sink]
    : [createReadStream(path), sink];

  await pipeline(...streams);
  return h.digest('hex');
}

async function backupGzip(path) {
  const backupPath = `${path}.pre-gc-${Date.now()}.gz`;
  const beforeHash = await sha256File(path, false);
  await pipeline(createReadStream(path), createGzip({ level: 6 }), createWriteStream(backupPath));
  const afterHash = await sha256File(backupPath, true);

  if (beforeHash !== afterHash) {
    await unlink(backupPath).catch(() => {});
    throw new Error('backup gzip no verificat per hash');
  }

  return backupPath;
}

async function compactNdjson(file, options) {
  const st = await stat(file);
  const tmp = `${file}.compact-${Date.now()}.tmp`;
  const out = createWriteStream(tmp, { encoding: 'utf8' });
  const rl = createInterface({
    input: createReadStream(file, { encoding: 'utf8', highWaterMark: 64 * 1024 }),
    crlfDelay: Infinity
  });

  const acc = { removed: 0, removedBytes: 0 };
  let kept = 0;
  let broken = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj && typeof obj === 'object' && obj.__deleted === true) {
        acc.removed++;
        acc.removedBytes += Buffer.byteLength(line);
        continue;
      }

      const clean = stripTombstones(obj, acc);
      if (clean !== undefined) {
        if (!out.write(`${JSON.stringify(clean)}\n`)) {
          await new Promise(resolve => out.once('drain', resolve));
        }
        kept++;
      }
    } catch {
      broken++;
      if (!out.write(`${line}\n`)) await new Promise(resolve => out.once('drain', resolve));
    }
  }

  await new Promise((resolve, reject) => {
    out.end(resolve);
    out.on('error', reject);
  });

  const after = (await stat(tmp)).size;
  const ratio = st.size ? (acc.removedBytes / st.size) * 100 : 0;
  const needsCompact = st.size >= options.thresholdBytes || ratio >= options.tombstonePercentMax;

  if (!needsCompact || acc.removed === 0) {
    await unlink(tmp).catch(() => {});
    return {
      ok: true,
      compacted: false,
      beforeBytes: st.size,
      afterBytes: st.size,
      tombstonesRemoved: acc.removed,
      ratioPercent: Number(ratio.toFixed(1)),
      brokenLines: broken
    };
  }

  let backupPath = null;
  if (options.write) {
    backupPath = await backupGzip(file);
    await rename(tmp, file);
  } else {
    await unlink(tmp).catch(() => {});
  }

  return {
    ok: true,
    compacted: true,
    written: Boolean(options.write),
    beforeBytes: st.size,
    afterBytes: after,
    savedBytes: st.size - after,
    savedPercent: Number((100 - (after / st.size) * 100).toFixed(1)),
    tombstonesRemoved: acc.removed,
    ratioPercent: Number(ratio.toFixed(1)),
    brokenLines: broken,
    backupPath
  };
}

async function compactJsonSmall(file, options) {
  const st = await stat(file);
  if (st.size > options.maxJsonBytes) {
    return {
      ok: false,
      compacted: false,
      error: `JSON massa gran per compactar en memoria (${st.size}B). Exporta NDJSON o usa compactYDocByProjection().`
    };
  }

  const raw = await readFile(file, 'utf8');
  const state = JSON.parse(raw);
  const acc = { removed: 0, removedBytes: 0 };
  const clean = stripTombstones(state, acc);
  const next = JSON.stringify(clean, null, 2);
  const after = Buffer.byteLength(next);
  const ratio = raw.length ? (acc.removedBytes / Buffer.byteLength(raw)) * 100 : 0;
  const needsCompact = st.size >= options.thresholdBytes || ratio >= options.tombstonePercentMax;

  if (!needsCompact || acc.removed === 0) {
    return { ok: true, compacted: false, beforeBytes: st.size, afterBytes: st.size, tombstonesRemoved: acc.removed };
  }

  let backupPath = null;
  if (options.write) {
    backupPath = await backupGzip(file);
    await writeFile(`${file}.tmp`, next, 'utf8');
    await rename(`${file}.tmp`, file);
  }

  return {
    ok: true,
    compacted: true,
    written: Boolean(options.write),
    beforeBytes: st.size,
    afterBytes: after,
    savedBytes: st.size - after,
    savedPercent: Number((100 - (after / st.size) * 100).toFixed(1)),
    tombstonesRemoved: acc.removed,
    backupPath
  };
}

export function compactYDocByProjection(Y, oldDoc, project, { measureBefore = false } = {}) {
  if (!Y || !oldDoc || typeof project !== 'function') {
    throw new Error('compactYDocByProjection requereix Y, oldDoc i project(freshDoc, oldDoc)');
  }

  const beforeBytes = measureBefore ? Y.encodeStateAsUpdate(oldDoc).byteLength : null;
  const fresh = new Y.Doc({ gc: true });
  project(fresh, oldDoc);

  const afterUpdate = Y.encodeStateAsUpdate(fresh);
  return {
    ok: true,
    doc: fresh,
    beforeBytes,
    afterBytes: afterUpdate.byteLength,
    savedBytes: beforeBytes === null ? null : beforeBytes - afterUpdate.byteLength
  };
}

export async function run(options = {}) {
  const file = options.file || options.statePath;
  if (!file) return { ok: false, summary: '[ERROR] Cal --file=<estat.json|estat.ndjson>.', data: {} };

  const cfg = { ...DEFAULTS, ...options };
  const isNdjson = options.ndjson || file.endsWith('.ndjson') || file.endsWith('.jsonl');
  const data = isNdjson
    ? await compactNdjson(file, cfg)
    : await compactJsonSmall(file, cfg);

  return {
    ok: data.ok,
    summary: data.ok
      ? `GC ${data.compacted ? (data.written ? 'APLICAT' : 'simulat') : 'no necessari'}: ${data.tombstonesRemoved || 0} tombstones.`
      : `[FATAL] ${data.error}`,
    data
  };
}
