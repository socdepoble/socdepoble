#!/usr/bin/env node
/**
 * Compatibilitat fail-closed. La taxonomia per `tags` ha sigut retirada del
 * frontmatter v2; este nom antic delega en l’únic auditor canònic.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditWiki, DEFAULT_WIKI_DIR } from './autoneteja_wiki.mjs';

export async function validateTaxonomia(root = DEFAULT_WIKI_DIR) {
  const report = await auditWiki(path.resolve(root));
  return {
    ok: report.operational.ok,
    deprecated: true,
    message: '`tags` ja no és taxonomia canònica; validació delegada a schema.json v2.',
    operational: report.operational,
    planSha256: report.plan.planDigest,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const root = args.find((arg) => !arg.startsWith('--')) || DEFAULT_WIKI_DIR;
  const result = await validateTaxonomia(root);
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`⚠️  ${result.message}`);
    console.log(`Nucli operatiu: ${result.operational.health}; pla ${result.planSha256}`);
  }
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`❌ [SCHEMA V2] ${error.message}`);
    process.exitCode = 2;
  });
}
