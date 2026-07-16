#!/usr/bin/env node
/**
 * pre-commit.mjs — Orquestrador (Zero Overhead, Husky-ready)
 *
 * Ordre: integritat d'arrel -> auditor canònic -> semàntica consultiva.
 * Un hook de commit és SEMPRE de sol lectura. Cap fase mou ni crea fitxers.
 *
 * Ús a .husky/pre-commit:
 *   node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/pre-commit.mjs || exit 1
 */
import { auditRootHygiene } from './wiki_integritat.mjs';
import { auditWiki } from './autoneteja_wiki.mjs';
import { runSemanticAudit } from './semantic_auditor.mjs';
import { verifyWikiBaselineLock } from './reflex_petorreta.mjs';
import path from 'node:path';

const step = (n, msg) => console.log(`\n[${n}/4] ${msg}`);

function wikiFromCli(argv) {
  const wikiArgs = argv.filter((arg) => arg.startsWith('--wiki='));
  const unknown = argv.filter((arg) => arg !== '--dry-run' && !arg.startsWith('--wiki='));
  if (unknown.length) throw new Error(`Arguments desconeguts: ${unknown.join(', ')}`);
  if (wikiArgs.length > 1 || !wikiArgs[0]?.slice(7).trim()) {
    if (wikiArgs.length) throw new Error('--wiki exigix una única ruta no buida.');
    return undefined;
  }
  return path.resolve(wikiArgs[0].slice(7));
}

async function main() {
  const wikiDir = wikiFromCli(process.argv.slice(2));
  step(1, 'Integritat d\'arrel (sol lectura)...');
  const orphanDir = wikiDir
    ? path.join(wikiDir, '04_ARXIU_Documents_Historics', 'bancal_actiu')
    : undefined;
  const rootOrphans = await auditRootHygiene(wikiDir, orphanDir, { dryRun: true });
  if (rootOrphans > 0) {
    throw new Error(`SDP-LOCK: ${rootOrphans} Markdown solt(s) a l’arrel del vault.`);
  }

  step(2, 'Baseline estable i contracte de la Vista Gràfica...');
  const baseline = await verifyWikiBaselineLock(wikiDir);
  if (!baseline.ok) {
    throw new Error(`SDP-LOCK: baseline divergent: ${baseline.findings.join('; ')}`);
  }
  console.log(`✅ Baseline segellada (${baseline.baseline.documents} documents; ${baseline.baseline.treeSha256}).`);

  step(3, 'Auditoria canònica de Wiki (YAML, graf operatiu i integritat)...');
  const audit = await auditWiki(wikiDir);
  const traversalUnsafe = audit.safety.skippedSymlinks.length > 0;
  const isOperational = (item) => /^0[0-3]_/.test(typeof item === 'string' ? item : item.file);
  const parserFailures = audit.frontmatter.malformed.filter(isOperational).length
    + audit.frontmatter.yamlErrors.filter(isOperational).length;
  const controlFailures = audit.content.controlChars.filter(isOperational).length;
  if (!audit.operational.ok || parserFailures + controlFailures > 0 || traversalUnsafe) {
    console.error('\n🚨 SDP-LOCK: auditoria canònica fallada 🚨');
    console.error(`Nucli: ${audit.operational.health}; drift FM: ${audit.operational.frontmatterDrift}; `
      + `buits: ${audit.operational.semanticEmpty.length}; fantasmes: ${audit.operational.graph.unresolvedOccurrences}; `
      + `ambigus: ${audit.operational.graph.ambiguousOccurrences}; symlinks: ${audit.safety.skippedSymlinks.length}.`);
    console.error(`Pla diagnòstic SHA-256: ${audit.plan.planDigest}`);
    process.exit(1);
  }
  console.log(`✅ Integritat dura del nucli superada (${audit.operational.documents} documents).`);
  if (!audit.operational.ok) {
    console.warn(`⚠️  Cutover YAML pendent: ${audit.operational.frontmatterDrift} nota(es) encara no conformes amb v2.`);
  }

  step(4, 'Auditoria Semàntica (Trellat, consultiva)...');
  const semantic = await runSemanticAudit(wikiDir);
  const semanticCount = semantic.folderAlerts.length + semantic.filenameAlerts.length
    + semantic.descriptionAlerts.length;
  if (semanticCount) console.warn(`⚠️  Auditoria semàntica: ${semanticCount} avís(os) consultius.`);
  else console.log('✅ Cap avís semàntic.');

  console.log('\n✅ TALLAFOCS SUPERAT. Trellat intacte.');
  process.exit(0);
}

main().catch(err => {
  console.error('🚨 ERROR INESPERAT A L\'ORQUESTRADOR 🚨');
  console.error(err);
  process.exit(1);
});
