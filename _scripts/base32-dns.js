// _scripts/base32-dns.js
// Base32 per codificar missatges en subdominis DNS (fallback extrem)

import { LZ77Dict } from './lz77-dict-compressor.js';

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

export { Base32 };
