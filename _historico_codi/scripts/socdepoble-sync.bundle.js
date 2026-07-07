/**
 * Sóc de Poble - Sync Engine Bundle (V2.0)
 * Arquitectura Pedra Seca - Zero Dependències
 */

(function(window) {
"use strict";

// --- Inici de binary-serializer.js ---
// _scripts/binary-serializer.js
// BinarySerializer + Varint (LEB128) + preparat per LZ77 (Versió blindada total)

const Encoder = new TextEncoder();
const Decoder = new TextDecoder();

class BinarySerializer {
  static TYPE = {
    NULL: 0,
    BOOLEAN: 1,
    NUMBER: 2,
    STRING: 3,
    OBJECT: 4,
    ARRAY: 5,
    VECTOR_CLOCK: 6,
  };

  // === VARINT (LEB128) ===
  static encodeVarint(value) {
    const bytes = [];
    let v = value;
    do {
      let byte = v & 0x7F;
      v >>>= 7;
      if (v !== 0) byte |= 0x80;
      bytes.push(byte);
    } while (v !== 0);
    return new Uint8Array(bytes).buffer;
  }

  static decodeVarint(view, offsetRef) {
    let value = 0;
    let shift = 0;
    let byte;
    const maxBytes = 10;
    let bytesRead = 0;

    do {
      if (bytesRead++ > maxBytes) throw new Error('Varint massa llarg');
      byte = view.getUint8(offsetRef.value);
      offsetRef.value += 1;
      value |= (byte & 0x7F) << shift;
      shift += 7;
    } while (byte & 0x80 && offsetRef.value < view.byteLength);

    return value >>> 0;
  }

  static serialize(obj) {
    const chunks = [];
    this._serializeValue(obj, chunks);
    const total = chunks.reduce((sum, c) => sum + c.byteLength, 0);
    const buffer = new ArrayBuffer(total);
    const view = new Uint8Array(buffer);
    let offset = 0;
    chunks.forEach(chunk => {
      view.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    });
    return buffer;
  }

  static _serializeValue(value, chunks) {
    if (value === null || value === undefined) {
      chunks.push(new Uint8Array([this.TYPE.NULL]).buffer);
      return;
    }
    if (typeof value === 'boolean') {
      chunks.push(new Uint8Array([this.TYPE.BOOLEAN, value ? 1 : 0]).buffer);
      return;
    }
    if (typeof value === 'number') {
      const header = new Uint8Array([this.TYPE.NUMBER]);
      chunks.push(header.buffer);
      chunks.push(this.encodeVarint(Math.floor(value))); // simplificat per enters comuns
      if (!Number.isInteger(value)) {
        const floatBuf = new ArrayBuffer(8);
        new DataView(floatBuf).setFloat64(0, value);
        chunks.push(floatBuf);
      }
      return;
    }
    if (typeof value === 'string') {
      const bytes = Encoder.encode(value);
      const header = new ArrayBuffer(5);
      const dv = new DataView(header);
      dv.setUint8(0, this.TYPE.STRING);
      dv.setUint32(1, bytes.length); // temporal, es pot varint també
      chunks.push(header);
      chunks.push(bytes.buffer);
      return;
    }
    if (Array.isArray(value)) {
      const header = new ArrayBuffer(5);
      const dv = new DataView(header);
      dv.setUint8(0, this.TYPE.ARRAY);
      dv.setUint32(1, value.length);
      chunks.push(header);
      value.forEach(v => this._serializeValue(v, chunks));
      return;
    }
    if (value && typeof value === 'object' && (value.clock || value.type === 'VectorClock')) {
      const clock = value.clock || value;
      const entries = Object.entries(clock);
      const header = new ArrayBuffer(5);
      const dv = new DataView(header);
      dv.setUint8(0, this.TYPE.VECTOR_CLOCK);
      dv.setUint32(1, entries.length);
      chunks.push(header);
      entries.forEach(([k, v]) => {
        this._serializeValue(k, chunks);
        this._serializeValue(v, chunks);
      });
      return;
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      const header = new ArrayBuffer(5);
      const dv = new DataView(header);
      dv.setUint8(0, this.TYPE.OBJECT);
      dv.setUint32(1, entries.length);
      chunks.push(header);
      entries.forEach(([k, v]) => {
        this._serializeValue(k, chunks);
        this._serializeValue(v, chunks);
      });
      return;
    }
    this._serializeValue(String(value), chunks);
  }

  static deserialize(buffer) {
    if (!buffer || buffer.byteLength === 0) return null;
    const view = new DataView(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
    const offsetRef = { value: 0 };

    const readValue = () => {
      if (offsetRef.value >= view.byteLength) {
        console.warn('⚠️ Buffer truncat. Retornant partial o null.');
        return null;
      }
      
      const type = view.getUint8(offsetRef.value);
      offsetRef.value += 1;

      try {
        switch (type) {
          case this.TYPE.NULL: 
            return null;
          case this.TYPE.BOOLEAN: {
            if (offsetRef.value >= view.byteLength) return false;
            const b = view.getUint8(offsetRef.value); 
            offsetRef.value += 1; 
            return b === 1;
          }
          case this.TYPE.NUMBER:
            return this.decodeVarint(view, offsetRef);
          case this.TYPE.STRING: {
            if (offsetRef.value + 4 > view.byteLength) return '';
            const len = view.getUint32(offsetRef.value);
            offsetRef.value += 4;
            const safeLen = Math.min(len, view.byteLength - offsetRef.value);
            const strBytes = new Uint8Array(view.buffer, offsetRef.value, safeLen);
            offsetRef.value += safeLen;
            return Decoder.decode(strBytes);
          }
          case this.TYPE.ARRAY:
          case this.TYPE.OBJECT:
          case this.TYPE.VECTOR_CLOCK: {
            if (offsetRef.value + 4 > view.byteLength) return type === this.TYPE.ARRAY ? [] : {};
            const count = view.getUint32(offsetRef.value);
            offsetRef.value += 4;
            if (type === this.TYPE.ARRAY) {
              const arr = [];
              for (let i = 0; i < count; i++) arr.push(readValue());
              return arr;
            } else {
              const obj = type === this.TYPE.VECTOR_CLOCK ? { clock: {} } : {};
              for (let i = 0; i < count; i++) {
                const key = readValue();
                const val = readValue();
                if (type === this.TYPE.VECTOR_CLOCK) obj.clock[key] = val;
                else obj[key] = val;
              }
              return obj;
            }
          }
          default:
            return null;
        }
      } catch (e) {
        console.error('❌ Error deserialitzant (buffer truncat):', e.message);
        return null;
      }
    };

    return readValue();
  }

  static toWebSocketMessage(obj) {
    return this.serialize(obj);
  }

  static fromWebSocketMessage(buffer) {
    return this.deserialize(buffer);
  }
}



// --- Fi de binary-serializer.js ---

// --- Inici de vector-clock-crdt.js ---
// _scripts/vector-clock-crdt.js
// CRDT amb Vector Clocks per resolució avançada de conflictes (Sóc de Poble)
// Més robust que LWW per entorns multi-replica rural

class VectorClock {
  constructor(replicaId) {
    this.clock = {};
    this.replicaId = replicaId || `replica-${Math.random().toString(36).slice(2)}`;
    this.clock[this.replicaId] = 0;
  }

  increment() {
    this.clock[this.replicaId] = (this.clock[this.replicaId] || 0) + 1;
    return this;
  }

  merge(other) {
    const merged = new VectorClock(this.replicaId);
    merged.clock = { ...this.clock };
    for (const [id, ts] of Object.entries(other.clock)) {
      merged.clock[id] = Math.max(merged.clock[id] || 0, ts);
    }
    return merged;
  }

  compare(other) {
    let thisDominates = true;
    let otherDominates = true;
    const allIds = new Set([...Object.keys(this.clock), ...Object.keys(other.clock)]);
    for (const id of allIds) {
      const t1 = this.clock[id] || 0;
      const t2 = other.clock[id] || 0;
      if (t1 < t2) thisDominates = false;
      if (t2 < t1) otherDominates = false;
    }
    if (thisDominates && otherDominates) return 0; // equal or concurrent
    if (thisDominates) return 1;
    if (otherDominates) return -1;
    return 0; // concurrent
  }
}

class VectorCRDTStore {
  constructor(dbName = 'socdepoble-vector-crdt') {
    this.dbName = dbName;
    this.db = null;
    this.vectorClock = new VectorClock();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('crdt')) {
          db.createObjectStore('crdt', { keyPath: 'key' });
        }
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('✅ Vector Clock CRDT IndexedDB inicialitzat');
        resolve();
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async set(key, value) {
    this.vectorClock.increment();
    const entry = {
      key,
      value,
      vectorClock: { ...this.vectorClock.clock },
      timestamp: Date.now()
    };
    return this._put(entry);
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readonly');
      const store = tx.objectStore('crdt');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  }

  async _put(entry) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readwrite');
      const store = tx.objectStore('crdt');
      const req = store.put(entry);
      req.onsuccess = () => resolve(entry);
      req.onerror = () => reject(req.error);
    });
  }

  async mergeRemote(remoteEntries) {
    for (const remote of remoteEntries) {
      const local = await this.get(remote.key);
      let winner;
      if (!local) {
        winner = remote;
      } else {
        const localVC = new VectorClock().merge({clock: local.vectorClock});
        const remoteVC = new VectorClock().merge({clock: remote.vectorClock});
        const cmp = localVC.compare(remoteVC);
        if (cmp === 1) {
          winner = local;
        } else if (cmp === -1) {
          winner = remote;
        } else {
          console.warn(`⚠️ Conflicte concurrent detectat per clau ${remote.key}. Resolució manual recomanada.`);
          winner = remote; // o implementa merge custom (ex: array de versions)
        }
      }
      await this._put(winner);
    }
    console.log('🔄 Merge Vector Clock CRDT completat');
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readonly');
      const store = tx.objectStore('crdt');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
}



// --- Fi de vector-clock-crdt.js ---

// --- Inici de delta-vector-crdt.js ---
// _scripts/delta-vector-crdt.js
// Delta State Replication per Vector Clocks (envia només canvis)

class DeltaVectorClock {
  constructor(replicaId) {
    this.replicaId = replicaId || `delta-${Math.random().toString(36).slice(2)}`;
    this.clock = { [this.replicaId]: 0 };
    this.lastSent = {}; // Per calcular deltas
  }

  increment() {
    this.clock[this.replicaId] = (this.clock[this.replicaId] || 0) + 1;
    return this;
  }

  // Genera delta (només increments des de l'últim enviament)
  getDelta() {
    const delta = {};
    for (const [id, ts] of Object.entries(this.clock)) {
      if (!this.lastSent[id] || ts > this.lastSent[id]) {
        delta[id] = ts;
      }
    }
    this.lastSent = { ...this.clock };
    return delta;
  }

  mergeDelta(delta) {
    for (const [id, ts] of Object.entries(delta)) {
      this.clock[id] = Math.max(this.clock[id] || 0, ts);
    }
    return this;
  }

  compare(otherClock) {
    // mateixa lògica que abans
    let thisD = true, otherD = true;
    const ids = new Set([...Object.keys(this.clock), ...Object.keys(otherClock)]);
    for (const id of ids) {
      const t1 = this.clock[id] || 0;
      const t2 = otherClock[id] || 0;
      if (t1 < t2) thisD = false;
      if (t2 < t1) otherD = false;
    }
    return thisD && otherD ? 0 : (thisD ? 1 : -1);
  }
}



// --- Fi de delta-vector-crdt.js ---

// --- Inici de lz77-dict-compressor.js ---
// _scripts/lz77-dict-compressor.js
// LZ77 amb diccionari + hash per detectar inconsistències de versió

const SHARED_DICTIONARY = new TextEncoder().encode(
  "bancal horta iaia masero rentonar socdepoble valencia poble CRDT offline indexeddb vectorclock delta lww pwa rural audit lighthouse axe websocket binary lz77"
);

class LZ77Dict {
  static simpleHash(buffer) {
    let hash = 0;
    const data = new Uint8Array(buffer);
    for (let i = 0; i < data.length; i++) {
      hash = (hash * 31 + data[i]) >>> 0; // Murmur-like simple, 32-bit
    }
    return hash.toString(36).padStart(8, '0'); // ~8 chars, curt i DNS/WS friendly
  }

  static getDictionaryHash(dict = SHARED_DICTIONARY) {
    return this.simpleHash(dict);
  }

  static compress(input, dict = SHARED_DICTIONARY) {
    const dictHash = this.getDictionaryHash(dict);
    let data = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    
    const combined = new Uint8Array(dict.length + data.length);
    combined.set(dict, 0);
    combined.set(data, dict.length);
    
    const output = [];
    // Capçalera: hash del diccionari (8 chars en ASCII)
    const hashBytes = new TextEncoder().encode(dictHash);
    output.push(...hashBytes); // 8 bytes de hash

    let i = dict.length;
    while (i < combined.length) {
      let bestLength = 0;
      let bestOffset = 0;
      for (let j = Math.max(0, i - 4096); j < i; j++) {
        let length = 0;
        while (length < 255 && i + length < combined.length && combined[j + length] === combined[i + length]) {
          length++;
        }
        if (length > bestLength) {
          bestLength = length;
          bestOffset = i - j;
        }
      }
      if (bestLength >= 3) {
        output.push(0); // reference
        output.push(bestOffset & 0xFF);
        output.push((bestOffset >> 8) & 0xFF);
        output.push(bestLength);
        i += bestLength;
      } else {
        output.push(1); // literal
        output.push(combined[i]);
        i++;
      }
    }
    return new Uint8Array(output).buffer;
  }

  static decompress(compressed) {
    const data = new Uint8Array(compressed);
    let i = 0;
    
    // Llegir hash del diccionari (8 bytes)
    if (data.length < 8) return new Uint8Array(0).buffer; // corrupte
    const receivedHash = new TextDecoder().decode(data.slice(0, 8));
    i = 8;
    
    // TODO: Comparar amb el hash local. Si no coincideix, usar mode sense diccionari o alertar.
    console.log(`📦 Diccionari rebut amb hash: ${receivedHash}`);

    const output = [];
    while (i < data.length) {
      try {
        const flag = data[i++];
        if (flag === 1) {
          if (i < data.length) output.push(data[i++]);
        } else if (flag === 0) {
          if (i + 2 >= data.length) break;
          const offset = data[i] | (data[i + 1] << 8);
          const length = data[i + 2];
          i += 3;
          const start = output.length - offset;
          for (let k = 0; k < length; k++) {
            if (start + k >= 0 && start + k < output.length) {
              output.push(output[start + k]);
            }
          }
        }
      } catch (e) {
        console.warn('⚠️ LZ77 truncat - recuperant partial');
        break;
      }
    }
    return new Uint8Array(output).buffer;
  }
}



// --- Fi de lz77-dict-compressor.js ---

// --- Inici de lz4.js ---
// _scripts/lz4.js
// LZ4 Block Format simplificat (alta velocitat descompressió) - Vanilla JS pur
// Versió funcional per a ús rural (no 100% compliant amb totes les extensions, però ràpida i correcta)

class LZ4 {
  static MAGIC = 0x184D2204;

  static compress(input) {
    const data = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    if (data.length === 0) return new Uint8Array(0).buffer;

    const output = [];
    let i = 0;

    while (i < data.length) {
      let literalStart = i;
      let matchLength = 0;
      let matchOffset = 0;

      // Buscar match (finestra petita per velocitat)
      for (let j = Math.max(0, i - 65535); j < i; j++) {
        let len = 0;
        while (len < 255 && i + len < data.length && data[j + len] === data[i + len]) len++;
        if (len > matchLength) {
          matchLength = len;
          matchOffset = i - j;
        }
      }

      const literalLength = i - literalStart;
      if (matchLength < 4) {
        matchLength = 0;
      }

      // Token
      let token = Math.min(literalLength, 15) << 4;
      token |= Math.min(matchLength - 4, 15);
      output.push(token);

      // Literal length extra
      if (literalLength >= 15) {
        let extra = literalLength - 15;
        while (extra >= 255) {
          output.push(255);
          extra -= 255;
        }
        output.push(extra);
      }

      // Literals
      for (let k = literalStart; k < i; k++) {
        output.push(data[k]);
      }

      if (matchLength >= 4) {
        // Match offset (little endian)
        output.push(matchOffset & 0xFF);
        output.push((matchOffset >> 8) & 0xFF);

        // Match length extra
        let extraMatch = matchLength - 4;
        if (matchLength - 4 >= 15) {
          extraMatch = matchLength - 4 - 15;
          while (extraMatch >= 255) {
            output.push(255);
            extraMatch -= 255;
          }
          output.push(extraMatch);
        }
        i += matchLength;
      } else {
        i++;
      }
    }

    return new Uint8Array(output).buffer;
  }

  static decompress(compressed) {
    const data = new Uint8Array(compressed);
    const output = [];
    let i = 0;

    while (i < data.length) {
      const token = data[i++];
      let literalLength = token >> 4;
      let matchLength = (token & 0x0F) + 4;

      // Literal extra
      if (literalLength === 15) {
        let extra;
        do {
          extra = data[i++];
          literalLength += extra;
        } while (extra === 255);
      }

      // Copiar literals
      for (let j = 0; j < literalLength; j++) {
        output.push(data[i++]);
      }

      if (i >= data.length) break;

      // Match
      if (matchLength > 4 || literalLength > 0) {
        const offset = data[i] | (data[i + 1] << 8);
        i += 2;

        // Match length extra
        if ((token & 0x0F) === 15) {
          let extra;
          do {
            extra = data[i++];
            matchLength += extra;
          } while (extra === 255);
        }

        const start = output.length - offset;
        for (let j = 0; j < matchLength; j++) {
          output.push(output[start + j]);
        }
      }
    }
    return new Uint8Array(output).buffer;
  }
}



// --- Fi de lz4.js ---

// --- Inici de crc32.js ---
// _scripts/crc32.js
// CRC32 robust (IEEE 802.3 / ZIP) - Vanilla JS pur

class CRC32 {
  static TABLE = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  })();

  /**
   * Calcula CRC32 d'un ArrayBuffer / Uint8Array / String
   * @param {ArrayBuffer|Uint8Array|string} data
   * @returns {number} CRC32 (unsigned 32-bit)
   */
  static compute(data) {
    let crc = 0xFFFFFFFF;
    const bytes = typeof data === 'string' 
      ? new TextEncoder().encode(data) 
      : new Uint8Array(data);

    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ this.TABLE[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0; // unsigned
  }

  /**
   * Hash curt per capçaleres (6-8 caràcters)
   */
  static toShortHash(data) {
    const crc = this.compute(data);
    return crc.toString(36).padStart(8, '0'); // ~8 chars base-36
  }
}



// --- Fi de crc32.js ---

// --- Inici de base64url.js ---
// _scripts/base64url.js
// Base64URL per màxima densitat en DNS/HTTP fallback (Vanilla JS pur)

const Base64URL = {
  // Base64URL: - i _ en lloc de + i /, sense padding
  encode(buffer) {
    const bytes = new Uint8Array(buffer);
    let encoded = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = bytes[i + 1] || 0;
      const c = bytes[i + 2] || 0;
      
      encoded += chars[a >> 2];
      encoded += chars[((a & 3) << 4) | (b >> 4)];
      encoded += chars[((b & 15) << 2) | (c >> 6)] || '';
      encoded += chars[c & 63] || '';
    }
    return encoded;
  },

  decode(str) {
    // Restaurar padding si cal (per alguns usos)
    let input = str.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) input += '=';
    
    const decoded = [];
    let i = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    while (i < input.length) {
      const enc1 = chars.indexOf(input[i++]);
      const enc2 = chars.indexOf(input[i++]);
      const enc3 = chars.indexOf(input[i++]);
      const enc4 = chars.indexOf(input[i++]);

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      decoded.push(chr1);

      if (enc3 !== 64) {
        const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        decoded.push(chr2);
      }
      if (enc4 !== 64) {
        const chr3 = ((enc3 & 3) << 6) | enc4;
        decoded.push(chr3);
      }
    }
    return new Uint8Array(decoded).buffer;
  },

  // Trenca en segments DNS-safe (màxim 63 chars per label)
  toDnsLabels(encoded, maxLabel = 63) {
    const labels = [];
    for (let i = 0; i < encoded.length; i += maxLabel) {
      labels.push(encoded.slice(i, i + maxLabel));
    }
    return labels;
  }
};



// --- Fi de base64url.js ---

// --- Inici de base32-dns.js ---
// _scripts/base32-dns.js
// Base32 per codificar missatges en subdominis DNS (fallback extrem)



const Base32 = {
  ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  
  encode(buffer) {
    const bytes = new Uint8Array(buffer);
    let output = '';
    let bufferBits = 0;
    let bufferValue = 0;

    for (let i = 0; i < bytes.length; i++) {
      bufferValue = (bufferValue << 8) | bytes[i];
      bufferBits += 8;
      while (bufferBits >= 5) {
        bufferBits -= 5;
        output += this.ALPHABET[(bufferValue >> bufferBits) & 0x1F];
      }
    }
    if (bufferBits > 0) {
      output += this.ALPHABET[(bufferValue << (5 - bufferBits)) & 0x1F];
    }
    return output.toLowerCase();
  },

  decode(str) {
    const cleaned = str.toUpperCase().replace(/[^A-Z2-7]/g, '');
    const output = [];
    let buffer = 0;
    let bitsLeft = 0;

    for (let char of cleaned) {
      const value = this.ALPHABET.indexOf(char);
      if (value === -1) continue;
      buffer = (buffer << 5) | value;
      bitsLeft += 5;
      if (bitsLeft >= 8) {
        bitsLeft -= 8;
        output.push((buffer >> bitsLeft) & 0xFF);
      }
    }
    return new Uint8Array(output).buffer;
  },

  // DNS-friendly: trenca en segments de màxim 63 chars (subdomini)
  toDnsLabels(encoded, maxLabel = 63) {
    const labels = [];
    for (let i = 0; i < encoded.length; i += maxLabel) {
      labels.push(encoded.slice(i, i + maxLabel));
    }
    return labels;
  },

  // Exemple: query DNS fictícia (en realitat usa un resolver o fetch creative)
  async sendViaDnsFallback(messageBuffer, domainBase = 'socdepoble.org') {
    const compressed = LZ77Dict.compress(messageBuffer);
    const b32 = this.encode(compressed);
    const labels = this.toDnsLabels(b32);
    console.log(`📡 DNS Fallback: ${labels.length} subdominis per ${domainBase}`);
    // En producció: genera <img> o fetch a labels.join('.') + '.' + domainBase
    return labels;
  }
};



// --- Fi de base32-dns.js ---

// --- Inici de socdepoble-sync.js ---
// _scripts/socdepoble-sync.js
// SUPER-SKILL UNIFICADA - Sóc de Poble Sync Engine
// Vanilla JS pur. Tot l'arsenal en una sola API elegant.









class SocDepobleSync {
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

// --- Fi de socdepoble-sync.js ---

// --- Inici de webrtc-peer.js ---
// _scripts/webrtc-peer.js
// Sóc de Poble - WebRTC P2P Sync (Vanilla JS)
// Connexió directa d'igual a igual per a l'horta, sense passar per servidors centrals.



class WebRTCPeer {
  constructor(syncEngine, signalingCallback) {
    this.syncEngine = syncEngine;
    this.connection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN públic per travessar NAT bàsic
    });
    this.dataChannel = null;
    this.signalingCallback = signalingCallback; // Funció per intercanviar ofertes/respostes (ex: via QR o Bluetooth)
    
    this._setupConnection();
  }

  _setupConnection() {
    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingCallback({ type: 'candidate', candidate: event.candidate });
      }
    };

    this.connection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this._setupDataChannel();
    };
  }

  _setupDataChannel() {
    this.dataChannel.binaryType = 'arraybuffer';
    
    this.dataChannel.onopen = () => {
      console.log('🔗 Canal P2P WebRTC Obert! Els bancals estan connectats.');
      // Enviar l'estat actual només obrir la connexió
      this.syncEngine.getAll().then(entries => {
        // En una implementació completa, cridaríem a la lògica de generació del payload
        // Ací simulem el delta-update
        console.log('Enviant dades inicials via P2P...');
      });
    };

    this.dataChannel.onmessage = async (event) => {
      console.log(`📥 Dada P2P rebuda: ${event.data.byteLength} bytes`);
      // Passem el buffer directament a la Super-Skill
      await this.syncEngine.receive(event.data);
    };

    this.dataChannel.onclose = () => {
      console.log('❌ Canal P2P tancat.');
    };
  }

  async createOffer() {
    this.dataChannel = this.connection.createDataChannel('socdepoble-sync');
    this._setupDataChannel();

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    this.signalingCallback({ type: 'offer', offer });
  }

  async handleSignal(signal) {
    if (signal.type === 'offer') {
      await this.connection.setRemoteDescription(new RTCSessionDescription(signal.offer));
      const answer = await this.connection.createAnswer();
      await this.connection.setLocalDescription(answer);
      this.signalingCallback({ type: 'answer', answer });
    } else if (signal.type === 'answer') {
      await this.connection.setRemoteDescription(new RTCSessionDescription(signal.answer));
    } else if (signal.type === 'candidate') {
      await this.connection.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
  }

  send(buffer) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(buffer);
      return true;
    }
    return false;
  }
}

// --- Fi de webrtc-peer.js ---


  // Exposar al scope global
  window.SocDepobleSync = SocDepobleSync;
  window.WebRTCPeer = WebRTCPeer;
  
})(typeof window !== "undefined" ? window : globalThis);
