export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );
}

export async function signData(
  key: CryptoKey,
  data: ArrayBuffer
): Promise<ArrayBuffer> {
  return await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    key,
    data
  );
}

export async function verifyData(
  key: CryptoKey,
  data: ArrayBuffer,
  signature: ArrayBuffer
): Promise<boolean> {
  return await window.crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    key,
    signature,
    data
  );
}
