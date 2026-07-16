#!/usr/bin/env node
/**
 * Façana de compatibilitat per a l'antiga auditoria estructural.
 *
 * La font dura única és autoneteja_wiki.mjs. Mantindre un segon parser, una
 * segona taxonomia i una segona definició d'orfe va causar falsos positius.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditWiki, DEFAULT_WIKI_DIR } from './autoneteja_wiki.mjs';
import { runSemanticAudit, PILARS_OPERATIUS, ZONES_CICLE } from './semantic_auditor.mjs';

export const PILARS_VIGENTS = [...PILARS_OPERATIUS, ...ZONES_CICLE];

export async function runAudit(wikiDir = DEFAULT_WIKI_DIR) {
  const audit = await auditWiki(wikiDir);
  const errors = [];
  if (audit.frontmatter.malformed.length || audit.frontmatter.yamlErrors.length) {
    errors.push(`[ERROR-YAML] ${audit.frontmatter.malformed.length + audit.frontmatter.yamlErrors.length} capçalera(es) invàlida(es).`);
  }
  if (audit.content.controlChars.length) {
    errors.push(`[ERROR-BYTES] ${audit.content.controlChars.length} fitxer(s) amb caràcters de control.`);
  }
  if (audit.operational.semanticEmpty.length) {
    errors.push(`[ERROR-BUIT] ${audit.operational.semanticEmpty.length} nota(es) operativa(es) buida(es).`);
  }
  if (audit.operational.graph.unresolvedOccurrences || audit.operational.graph.ambiguousOccurrences) {
    errors.push(`[ERROR-GRAF] ${audit.operational.graph.unresolvedOccurrences} enllaç(os) irresolt(s) i ${audit.operational.graph.ambiguousOccurrences} ambigu(s).`);
  }
  if (audit.safety.skippedSymlinks.length) {
    errors.push(`[ERROR-SYMLINK] ${audit.safety.skippedSymlinks.length} symlink(s) no auditable(s).`);
  }

  const semantic = await runSemanticAudit(wikiDir);
  const avisos = [
    ...semantic.folderAlerts,
    ...semantic.filenameAlerts,
    ...semantic.descriptionAlerts,
  ].map((item) => `[AVÍS-${item.tipus}] ${item.carpeta || item.fitxer}: ${item.missatge}`);
  if (audit.operational.frontmatterDrift) {
    avisos.push(`[AVÍS-SCHEMA] ${audit.operational.frontmatterDrift} nota(es) fora de l'esquema v2.`);
  }
  return { errors, avisos, audit };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { errors, avisos, audit } = await runAudit();
  for (const avís of avisos) console.warn(avís);
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
  } else {
    console.log(`✅ Estructura saludable: 4 pilars + 2 zones, ${audit.operational.documents} notes operatives.`);
  }
}
