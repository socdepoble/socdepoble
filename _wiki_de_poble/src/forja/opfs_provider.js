// opfs_provider.js — Persistència Y.js sobre OPFS via Worker (append-only + compactació).
// API pública idèntica a la versió anterior: open/flush/compact/clear/destroy i events
// ready/flush/compact/repair/clear/error. Canvis de fons:
//   1. Zero createWritable (no existeix en iPadOS <= 17): tot passa pel worker amb sync handle.
//   2. Una única cadena d'I/O (this.io): appends, compactació i truncats mai s'entrellacen
//      ni es poden esperar mútuament -> el deadlock flush<->compact és impossible per construcció.
//   3. L'eco es talla per transaction origin (origin === this), no amb flags manuals.
//   4. Un error puntual no mata la persistència: la cua conserva la tanda i la cadena sobreviu.
import * as Y from 'yjs';
import { frameAll, readFrames } from './ylog_format.js';

const DEFAULTS = {
  fileName: 'soc-de-poble.ylog',
  flushMs: 700,
  compactBytes: 8 * 1024 * 1024,
  maxQueued: 64
};

// Guard de cànon (crdt_optimitzacio.md): Safari no té requestIdleCallback.
const idle = cb => ('requestIdleCallback' in globalThis)
  ? requestIdleCallback(cb, { timeout: 1500 })
  : setTimeout(cb, 32);
const cancelIdle = id => ('cancelIdleCallback' in globalThis) ? cancelIdleCallback(id) : clearTimeout(id);

export class OpfsYProvider extends EventTarget {
  constructor(doc, options = {}) {
    super();
    this.doc = doc;
    this.options = { ...DEFAULTS, ...options };
    this.worker = null;
    this.pending = new Map(); // id -> { resolve, reject }
    this.nextId = 1;
    this.bytes = 0;
    this.queue = [];
    this.flushTimer = 0;
    this.idleId = 0;
    this.compactIdleId = 0;
    this.io = Promise.resolve();
    this.destroyed = false;

    this.onUpdate = (update, origin) => {
      if (this.destroyed || origin === this) return; // el replay du origin=this: no es re-escriu
      this.queue.push(update);
      if (this.queue.length >= this.options.maxQueued) this.flush().catch(() => {});
      else this.scheduleFlush();
    };
    this.doc.on('update', this.onUpdate);
  }

  call(msg, transfer) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ ...msg, id }, transfer || []);
    });
  }

  async open() {
    if (!navigator.storage?.getDirectory) throw new Error('OPFS no disponible en aquest navegador');
    if (navigator.storage.persist) await navigator.storage.persist().catch(() => false);

    this.worker = new Worker(new URL('./opfs_worker.js', import.meta.url), { type: 'module' });
    this.worker.onmessage = e => {
      const m = e.data;
      const p = this.pending.get(m.id);
      if (!p) return;
      this.pending.delete(m.id);
      if (m.t === 'err') p.reject(new Error(m.error));
      else p.resolve(m);
    };

    let ready;
    try {
      ready = await this.call({ t: 'open', file: this.options.fileName });
    } catch (err) {
      this.emit('error', { error: `No puc obrir el registre (una altra pestanya el té obert?): ${err.message}` });
      throw err;
    }

    this.bytes = ready.bytes;
    if (ready.bytes) {
      const { updates, validBytes } = readFrames(ready.buf);
      // mergeUpdates: UNA transacció i una passada, no N applyUpdate en bucle al fil principal.
      if (updates.length) Y.applyUpdate(this.doc, Y.mergeUpdates(updates), this);
      if (validBytes < ready.bytes) {
        const r = await this.call({ t: 'truncate', to: validBytes });
        this.bytes = r.size;
        this.emit('repair', { from: ready.bytes, to: validBytes });
      }
    }

    this.emit('ready', { bytes: this.bytes });
    return this;
  }

  scheduleFlush() {
    if (this.flushTimer || this.idleId) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = 0;
      this.idleId = idle(() => {
        this.idleId = 0;
        this.flush().catch(() => {});
      });
    }, this.options.flushMs);
  }

  flush() {
    if (this.destroyed || !this.worker) return Promise.resolve();
    // S'encadena sempre: si hi ha un flush en vol, aquest corre DESPRÉS amb la cua d'eixe moment.
    // Mai retorna una promesa "d'un altre" que puga generar esperes circulars ni updates orfes.
    this.io = this.io.then(async () => {
      if (!this.queue.length) return;
      const batch = this.queue.splice(0, this.queue.length);
      const payload = frameAll(batch);
      try {
        const r = await this.call({ t: 'append', buf: payload.buffer }, [payload.buffer]);
        this.bytes = r.size;
        this.emit('flush', { updates: batch.length, bytes: payload.byteLength });
      } catch (err) {
        this.queue.unshift(...batch); // res es perd: la tanda torna a la cua
        this.emit('error', { error: err.message });
        throw err;
      }
      if (this.bytes >= this.options.compactBytes) this.scheduleCompact();
    });
    const p = this.io;
    this.io = this.io.catch(() => {}); // un error puntual no trenca la cadena per a sempre
    return p;
  }

  scheduleCompact() {
    if (this.compactIdleId || this.destroyed) return;
    this.compactIdleId = idle(() => {
      this.compactIdleId = 0;
      this.compact().catch(() => {});
    });
  }

  compact() {
    if (this.destroyed || !this.worker) return Promise.resolve();
    this.io = this.io.then(async () => {
      // encodeStateAsUpdate ja conté qualsevol update pendent (venen del mateix doc):
      // compactar substitueix registre + cua per un únic frame. Cap flush intern necessari.
      const snapshot = Y.encodeStateAsUpdate(this.doc);
      this.queue.length = 0;
      const payload = frameAll([snapshot]);
      const r = await this.call({ t: 'rewrite', buf: payload.buffer }, [payload.buffer]);
      this.bytes = r.size;
      this.emit('compact', { bytes: this.bytes });
    });
    const p = this.io;
    this.io = this.io.catch(() => {});
    return p;
  }

  clear() {
    if (this.destroyed || !this.worker) return Promise.resolve();
    this.io = this.io.then(async () => {
      this.queue.length = 0;
      const r = await this.call({ t: 'truncate', to: 0 });
      this.bytes = r.size;
      this.emit('clear', {});
    });
    const p = this.io;
    this.io = this.io.catch(() => {});
    return p;
  }

  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  async destroy() {
    if (this.destroyed) return;
    this.doc.off('update', this.onUpdate);
    if (this.flushTimer) clearTimeout(this.flushTimer);
    if (this.idleId) cancelIdle(this.idleId);
    if (this.compactIdleId) cancelIdle(this.compactIdleId);
    await this.flush().catch(() => {});
    this.destroyed = true;
    if (this.worker) {
      await this.call({ t: 'close' }).catch(() => {});
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export function createOpfsProvider(doc, options) {
  return new OpfsYProvider(doc, options);
}
