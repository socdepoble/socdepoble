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

export { BinarySerializer };
