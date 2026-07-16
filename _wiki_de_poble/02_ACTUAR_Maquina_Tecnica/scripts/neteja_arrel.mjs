#!/usr/bin/env node
/** TOMBSTONE P0: classificava l'arrel amb heurístiques i movia fitxers sense pla. */
export async function netejaArrel() {
  throw new Error('SDP-LOCK: neteja_arrel retirada; usa l’Autoneteja v2 o una migració explícita amb Reflex i rollback.');
}
if (import.meta.url === `file://${process.argv[1]}`) {
  netejaArrel().catch((error) => { console.error(error.message); process.exitCode = 2; });
}
