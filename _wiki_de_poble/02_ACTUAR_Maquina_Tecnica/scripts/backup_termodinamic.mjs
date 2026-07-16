#!/usr/bin/env node
/** TOMBSTONE P1: copiava tota l'arrel dins del vault i eliminava rotacions. */
export async function backupTermodinamic() {
  throw new Error('SDP-LOCK: backup_termodinamic retirat; usa Git i els manifests verificats de `.wiki-safety/`.');
}
if (import.meta.url === `file://${process.argv[1]}`) {
  backupTermodinamic().catch((error) => { console.error(error.message); process.exitCode = 2; });
}
