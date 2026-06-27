// Fichero: src/domain/crypto/ZeroKnowledgeCRDT.ts
import { openDB } from 'idb';

export class ZeroKnowledgeCRDT {
  
  // 1. GÉNESIS DE IDENTIDAD (Se ejecuta 1 vez en la vida del dispositivo)
  public static async getOrForgeIdentity(): Promise<CryptoKeyPair> {
    const db = await openDB('sdp_vault', 1, {
      upgrade(db) { db.createObjectStore('crypto_enclave'); }
    });

    let keyPair = await db.get('crypto_enclave', 'ecdsa_identity');
    if (!keyPair) {
      console.log('🛡️ Forjando Identidad Criptográfica ECDSA P-256 en silicio...');
      keyPair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' },
        false, // 🔥 MAGIA NEGRA: El silicio protege la clave. Imposible leerla en JS plano.
        ['sign', 'verify']
      );
      await db.put('crypto_enclave', keyPair, 'ecdsa_identity');
    }
    return keyPair;
  }

  // Canonización estricta: Evita que el desorden del JSON rompa el Hash
  private static canonicalize(payload: Record<string, any>): string {
    const sorted = Object.keys(payload).sort().reduce((acc, key) => {
      if (key !== '_sig' && key !== '_pub') acc[key] = payload[key];
      return acc;
    }, {} as Record<string, any>);
    return JSON.stringify(sorted);
  }

  // 2. LA FIRMA DEL BANDO (Cuando el autor escribe)
  public static async signMutation(payload: any): Promise<any> {
    const { privateKey, publicKey } = await this.getOrForgeIdentity();
    const dataBuffer = new TextEncoder().encode(this.canonicalize(payload));
    
    const signatureBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      privateKey,
      dataBuffer
    );
    
    // Adjuntamos la firma y la clave pública exportada para verificación offline
    const jwk = await crypto.subtle.exportKey('jwk', publicKey);
    return {
      ...payload,
      _sig: btoa(String.fromCharCode(...new Uint8Array(signatureBuffer))),
      _pub: jwk
    };
  }

  // 3. EL TRIBUNAL DE LA PLAZA (Verificación Hostil del Vecino vía WebRTC)
  public static async verifyPeerMutation(payload: any): Promise<boolean> {
    try {
      if (!payload._sig || !payload._pub) return false;

      const publicKey = await crypto.subtle.importKey(
        'jwk', payload._pub, 
        { name: 'ECDSA', namedCurve: 'P-256' }, 
        true, ['verify']
      );

      const sigBytes = Uint8Array.from(atob(payload._sig), c => c.charCodeAt(0));
      const dataBuffer = new TextEncoder().encode(this.canonicalize(payload));

      return await crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        publicKey, sigBytes, dataBuffer
      );
    } catch { return false; } // Ante la mínima duda, desconfianza absoluta.
  }
}
