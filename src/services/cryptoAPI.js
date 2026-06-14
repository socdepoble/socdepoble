// src/services/cryptoAPI.js
// ==================================================
// 🔐 SERVEI DE XIFRATGE — Integració Rhizome
// Autor: Kimi
// ==================================================
export const cryptoAPI = {
  // 🔑 Derivar clau des de contrasenya o frau (BIP-39 valencià)
  async derivarClau(secret, sal = 'socdepoble') {
    const encoder = new TextEncoder();
    const clauBase = await crypto.subtle.importKey('raw', encoder.encode(secret), {
      name: 'PBKDF2'
    }, false, ['deriveKey']);
    return crypto.subtle.deriveKey({
      name: 'PBKDF2',
      salt: encoder.encode(sal),
      iterations: 600000,
      hash: 'SHA-256'
    }, clauBase, {
      name: 'AES-GCM',
      length: 256
    }, false, ['encrypt', 'decrypt']);
  },
  // 📤 Xifrar: Només dades binàries (després de compressió)
  async xifrar(dades, clau) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV únic per cada dada
    const xifrat = await crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: iv
    }, clau, dades);
    // Retornem IV + Dades (necessari per a desxifrar)
    const resultat = new Uint8Array(iv.length + xifrat.byteLength);
    resultat.set(iv, 0);
    resultat.set(new Uint8Array(xifrat), iv.length);
    return resultat;
  },
  // 📥 Desxifrar: Comprova integritat automàtica per AES-GCM
  async desxifrar(dadesXifrades, clau) {
    try {
      const iv = dadesXifrades.slice(0, 12);
      const contingut = dadesXifrades.slice(12);
      return await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: iv
      }, clau, contingut);
    } catch (e) {
      console.error("🔒 Dada corrupta o clau incorrecta");
      return null;
    }
  }
};

// Integrem globalment com Kimi va dir
if (typeof window !== 'undefined') {
  window.cryptoAPI = cryptoAPI;
}