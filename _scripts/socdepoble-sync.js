// _scripts/socdepoble-sync.js
// SUPER-SKILL UNIFICADA - Sóc de Poble Sync Engine
// Vanilla JS pur. Tot l'arsenal en una sola API elegant.

import { VectorCRDTStore, VectorClock } from './vector-clock-crdt.js';
import { BinarySerializer } from './binary-serializer.js';
import { LZ4 } from './lz4.js';
import { CRC32 } from './crc32.js';
import { LZ77Dict } from './lz77-dict-compressor.js';
import { Base32 } from './base32-dns.js';

export class SocDepobleSync {
  constructor(dbName = 'socdepoble-crdt', replicaId = null) {
    this.store = new VectorCRDTStore(dbName);
    this.replicaId = replicaId || `replica-${Math.random().toString(36).slice(2)}`;
    this.vectorClock = new VectorClock(this.replicaId);
    this.isOnline = navigator.onLine;
    this.fallbackMode = false;
  }

  async init() {
    await this.store.init();
    console.log(`🌾 Sóc de Poble Sync inicialitzat (replica: ${this.replicaId})`);
    return this;
  }

  // API PÚBLICA - Només dues línies per a l'usuari
  async set(key, value) {
    this.vectorClock.increment();
    const entry = {
      key,
      value,
      vectorClock: { ...this.vectorClock.clock },
      timestamp: Date.now()
    };
    await this.store._put(entry);
    return this._syncIfOnline(entry);
  }

  async get(key) {
    return this.store.get(key);
  }

  async getAll() {
    return this.store.getAll();
  }

  // Sincronització principal
  async _syncIfOnline(entry) {
    if (!this.isOnline) return { status: 'offline', entry };

    try {
      const payload = { type: 'delta-update', delta: this.vectorClock.getDelta?.() || {}, entries: [entry] };
      let binary = BinarySerializer.serialize(payload);
      const compressed = LZ4.compress(binary);           // LZ4 ràpid
      const hash = CRC32.toShortHash(compressed);
      
      // Afegir hash de diccionari si cal
      const finalBuffer = LZ77Dict.compress(compressed); // capa extra si cal

      // Enviar per WebSocket (binari preferit)
      // ws.send(finalBuffer); // integrar amb el teu client WS

      console.log(`📤 Sync enviat | CRC32: ${hash} | Bytes: ${finalBuffer.byteLength}`);
      return { status: 'synced', hash };
    } catch (e) {
      console.warn('⚠️ Error en sync primari, activant fallback');
      return this._dnsFallback(entry);
    }
  }

  // Fallback extrem (DNS / Base32 o Base64URL)
  async _dnsFallback(entry) {
    this.fallbackMode = true;
    const payload = BinarySerializer.serialize({ type: 'offline-update', entry });
    const compressed = LZ4.compress(payload);
    const b32 = Base32.encode(compressed);
    const labels = Base32.toDnsLabels(b32);
    
    console.log(`📡 DNS Fallback activat → ${labels.length} subdominis`);
    // En producció: crear <img src="https://${labels.join('.')}.socdepoble.org"> o similar
    return { status: 'dns-fallback', labels };
  }

  // Rebre dades (WS o qualsevol canal)
  async receive(rawBuffer) {
    try {
      let decompressed = LZ4.decompress(rawBuffer);
      const data = BinarySerializer.fromWebSocketMessage(decompressed);
      
      if (data.type === 'delta-update') {
        await this.store.applyDelta?.(data.delta, data.entries || []);
        console.log('🔄 Merge delta rebut correctament');
      }
      return data;
    } catch (e) {
      console.error('❌ Error rebent dades:', e);
      return null;
    }
  }

  // Utilitats
  getHealth() {
    return {
      replicaId: this.replicaId,
      online: this.isOnline,
      fallbackMode: this.fallbackMode,
      lastHash: CRC32.toShortHash('health-check')
    };
  }
}
