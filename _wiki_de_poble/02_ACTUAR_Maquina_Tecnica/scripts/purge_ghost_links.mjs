#!/usr/bin/env node
/**
 * Nom de compatibilitat per a l'antic purgador.
 *
 * Esborrar el markup d'un enllaç irresolt perd informació. El motor canònic
 * només l'audita; una decisió editorial humana l'ha de reparar o retirar.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditWiki, DEFAULT_WIKI_DIR } from './autoneteja_wiki.mjs';

export async function purgeGhostLinks(wikiDir = DEFAULT_WIKI_DIR, options = {}) {
  if (options.procedeix || options.inclouVendor) {
    throw new Error('Purga automàtica retirada: usa autoneteja_wiki.mjs per auditar i corregix els enllaços amb revisió editorial.');
  }
  const audit = await auditWiki(wikiDir);
  const result = {
    mode: 'AUDITORIA-SOL-LECTURA',
    unresolved: audit.operational.graph.unresolved,
    ambiguous: audit.operational.graph.ambiguous,
    planSha256: audit.plan.planDigest,
  };
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else console.log(`Graf operatiu: ${result.unresolved.length} fantasmes i ${result.ambiguous.length} ambigus. Zero escriptures.`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  purgeGhostLinks(DEFAULT_WIKI_DIR, {
    procedeix: process.argv.includes('--procedeix'),
    inclouVendor: process.argv.includes('--inclou-vendor'),
    json: process.argv.includes('--json'),
  }).catch((error) => {
    console.error(`❌ [GOS PASTOR] ${error.message}`);
    process.exitCode = 2;
  });
}
