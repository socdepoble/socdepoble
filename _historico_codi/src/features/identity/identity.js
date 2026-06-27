export async function generateIdentity() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );

  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

  return { keyPair, publicKey };
}

export async function signData(privateKey, data) {
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  return await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    encoded
  );
}

export async function verifySignature(publicKey, signature, data) {
  const key = await crypto.subtle.importKey(
    "jwk",
    publicKey,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );

  const encoded = new TextEncoder().encode(JSON.stringify(data));

  return await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    signature,
    encoded
  );
}
