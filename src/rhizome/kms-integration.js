// src/rhizome/kms-integration.js

// kmsFetchFn example: fetch wrapped package from local KMS
export async function kmsFetchFnFactory({
  baseUrl = 'http://localhost:8443',
  token
}) {
  return async function fetchWrapped(label) {
    const res = await fetch(`${baseUrl}/key/${encodeURIComponent(label)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('KMS fetch failed ' + res.status);
    const json = await res.json();
    // expected { meta: { salt: [...], ts }, wrapped: [...] }
    return json;
  };
}

// usage example at bootstrap
// const kmsFetch = kmsFetchFnFactory({ baseUrl: 'http://localhost:8443', token: 'dev-token' });
// const key = await getCryptoKeyForRuntime('master-key', { passphrase: process.env.CLIENT_PASSPHRASE, kmsFetchFn: kmsFetch });
// then pass key to modules that need it (e.g., worker postMessage or initRhizomeRecovery)