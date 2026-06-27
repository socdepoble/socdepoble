// _scripts/base64.js
// Funcions Base64 per ArrayBuffer (Vanilla JS pur)

const Base64 = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  
  encode(buffer) {
    const bytes = new Uint8Array(buffer);
    let encoded = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = bytes[i + 1] || 0;
      const c = bytes[i + 2] || 0;
      encoded += this.chars[a >> 2];
      encoded += this.chars[((a & 3) << 4) | (b >> 4)];
      encoded += this.chars[((b & 15) << 2) | (c >> 6)] || '=';
      encoded += this.chars[c & 63] || '=';
    }
    return encoded;
  },

  decode(str) {
    const decoded = [];
    let i = 0;
    while (i < str.length) {
      const enc1 = this.chars.indexOf(str[i++]);
      const enc2 = this.chars.indexOf(str[i++]);
      const enc3 = this.chars.indexOf(str[i++]);
      const enc4 = this.chars.indexOf(str[i++]);

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
  }
};

export { Base64 };
