// import { encrypt, decrypt, deriveSharedKey } from './cryptoEngine'; // Keep existing

// NUEVO: Motores criptográficos para DAG y Gobernanza (Soberanía Digital)
export async function generateIdentityKeys() {
  // Generamos un par de claves para firma electrónica (ECDSA)
  return await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );
}

export async function signData(privateKey, dataObj) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(dataObj));
  const signatureBuffer = await crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    privateKey,
    data
  );
  // Convertimos a base64 para poder transmitir por la red
  return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}

export async function verifySignature(publicKey, signatureBase64, dataObj) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(dataObj));
    const sigArray = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    
    return await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      sigArray,
      data
    );
   
  } catch (e) {
    return false;
  }
}

export async function exportPublicKey(key) {
  const exported = await crypto.subtle.exportKey("jwk", key);
  return exported;
}

export async function importPublicKey(jwk) {
  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  );
}
