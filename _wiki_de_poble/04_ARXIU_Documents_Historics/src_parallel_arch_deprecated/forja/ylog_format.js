// ylog_format.js — Format únic del registre .ylog: [u32 longitud][u32 crc32][update yjs]...
// Compartit entre el fil principal (replay) i el worker (escriptura): una sola font de veritat.
// El CRC és imprescindible amb sync access handles: allí sí que pot haver-hi escriptures a mitges.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xEDB88320 ^ (c >>> 1)) >>> 0 : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

const HEAD = 8; // 4 bytes longitud + 4 bytes crc32

/** Empaqueta una llista d'updates en un únic buffer contigu (1 postMessage, 1 write). */
export function frameAll(updates) {
  const total = updates.reduce((n, u) => n + HEAD + u.byteLength, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  let off = 0;
  for (const u of updates) {
    view.setUint32(off, u.byteLength, true);
    view.setUint32(off + 4, crc32(u), true);
    out.set(u, off + HEAD);
    off += HEAD + u.byteLength;
  }
  return out;
}

/** Llig frames fins al primer trencat (longitud impossible o CRC que no quadra). */
export function readFrames(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const updates = [];
  let off = 0;
  while (off + HEAD <= bytes.byteLength) {
    const len = view.getUint32(off, true);
    const crc = view.getUint32(off + 4, true);
    if (!len || off + HEAD + len > bytes.byteLength) break;
    const body = bytes.slice(off + HEAD, off + HEAD + len);
    if (crc32(body) !== crc) break; // cua trencada: es talla ací i el provider repara
    updates.push(body);
    off += HEAD + len;
  }
  return { updates, validBytes: off };
}
