export async function deriveSharedKey(privateKey, publicKey) {
  return await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(sharedKey, data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sharedKey,
    encoded
  );

  return { cipher, iv };
}

export async function decrypt(sharedKey, cipher, iv) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    sharedKey,
    cipher
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}
