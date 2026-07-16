// core/snapshot_engine.mjs — Protocol Lázaro: fotografia comprimida i rotativa del bundle .md.
// Adapter Node per defecte (fs); s'hi pot injectar un adapter OPFS al navegador sense tocar
// la lògica de compressió/rotació/verificació. Tot async: mai bloqueja el fil principal.
import { readFile, writeFile, rename, unlink, readdir, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import { claimReceiptForMutation, completeMutationClaim } from '../reflex_petorreta.mjs';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const HAS_ZSTD = typeof zlib.zstdCompress === 'function';
const zstdCompress = HAS_ZSTD ? promisify(zlib.zstdCompress) : null;
const zstdDecompress = HAS_ZSTD ? promisify(zlib.zstdDecompress) : null;

export const nodeAdapter = {
  async walk(dir, acc = []) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) await this.walk(full, acc);
      else if (e.name.endsWith('.md')) acc.push(full);
    }
    return acc;
  },
  readText: (p) => readFile(p, 'utf8'),
  readBinary: (p) => readFile(p),
  writeFile: (p, data) => writeFile(p, data),
  rename: (a, b) => rename(a, b),
  unlink: (p) => unlink(p).catch(() => {}),
  readdir: (d) => readdir(d).catch(() => []),
  mkdir: (d) => mkdir(d, { recursive: true }),
};

// Zstd preferit si el runtime el suporta (verificat: Node 22.x del Mestre el té).
// Gzip és el fallback garantit — mai depenem d'una funció que puga no existir.
async function compress(buf) {
  if (HAS_ZSTD) return { codec: 'zstd', data: await zstdCompress(buf) };
  return { codec: 'gzip', data: await gzip(buf) };
}

async function decompress(codec, buf) {
  if (codec === 'zstd') {
    if (!zstdDecompress) throw new Error('Aquest Node no suporta Zstd; cal el mateix runtime que va crear el snapshot.');
    return zstdDecompress(buf);
  }
  return gunzip(buf);
}

const snapshotName = (ts) => `snapshot_${ts.replace(/[:.]/g, '-')}.sdp`;

export async function createSnapshot(options = {}, adapter = nodeAdapter) {
  const root = options.root || '.';
  const outDir = options.out || join(root, '.snapshots');
  let claim = null;
  if (adapter === nodeAdapter) {
    claim = await claimReceiptForMutation({
      receiptPath: options.receipt,
      operation: 'snapshot-create',
      targets: [outDir],
      checkDirty: true,
    });
  }
  await adapter.mkdir(outDir);

  const files = await adapter.walk(root);
  const payload = { generatedAt: new Date().toISOString(), root, fileCount: files.length, files: [] };
  for (const f of files) payload.files.push({ path: relative(root, f), content: await adapter.readText(f) });

  const raw = Buffer.from(JSON.stringify(payload), 'utf8');
  const { codec, data } = await compress(raw);

  const finalPath = join(outDir, snapshotName(payload.generatedAt));
  const tmpPath = `${finalPath}.tmp`;
  const header = Buffer.from(JSON.stringify({ codec, rawBytes: raw.length }) + '\n', 'utf8');
  await adapter.writeFile(tmpPath, Buffer.concat([header, data]));
  await adapter.rename(tmpPath, finalPath); // atòmic: mateix volum, mateixa carpeta

  const verified = await verifySnapshot(finalPath, adapter, files.length);
  const removed = await rotate(outDir, options.keep ?? 3, adapter);
  if (claim && verified.ok) {
    await completeMutationClaim({ receiptPath: options.receipt, operation: 'snapshot-create' }, claim.claimToken);
  }

  return {
    ok: verified.ok,
    summary: `Snapshot ${verified.ok ? 'OK' : 'CORROMPUT'}: ${files.length} fitxers, ${data.length}B (${codec}). Rotació: ${removed} esborrats.`,
    data: { path: finalPath, codec, compressedBytes: data.length, rawBytes: raw.length, fileCount: files.length, verified, rotatedOut: removed },
  };
}

/** Llig i descomprimeix un snapshot real (round-trip) per certificar que és recuperable. */
export async function verifySnapshot(path, adapter = nodeAdapter, expectedCount = null) {
  try {
    const raw = await adapter.readBinary(path);
    const nl = raw.indexOf(10);
    const header = JSON.parse(raw.subarray(0, nl).toString('utf8'));
    const payload = JSON.parse((await decompress(header.codec, raw.subarray(nl + 1))).toString('utf8'));
    const countOk = expectedCount === null || payload.fileCount === expectedCount;
    return { ok: countOk && payload.files.length === payload.fileCount, fileCount: payload.fileCount };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function rotate(dir, keep, adapter) {
  const entries = (await adapter.readdir(dir)).filter((f) => f.startsWith('snapshot_') && f.endsWith('.sdp')).sort();
  const excess = entries.slice(0, Math.max(0, entries.length - keep));
  for (const f of excess) await adapter.unlink(join(dir, f));
  return excess.length;
}

export async function latestSnapshot(dir, adapter = nodeAdapter) {
  const entries = (await adapter.readdir(dir)).filter((f) => f.startsWith('snapshot_') && f.endsWith('.sdp')).sort();
  return entries.length ? join(dir, entries[entries.length - 1]) : null;
}

export async function run(options) {
  return createSnapshot(options);
}
