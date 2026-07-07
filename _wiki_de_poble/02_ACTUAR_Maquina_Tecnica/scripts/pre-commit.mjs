#!/usr/bin/env node
/**
 * pre-commit.mjs — Orquestrador (Zero Overhead, Husky-ready)
 *
 * Ordre: integritat d'arrel -> auditoria estructural -> contradiction engine.
 * TRANSACCIONAL: wiki_integritat és l'única fase que ESCRIU (mou orfes).
 * Les altres dues només LLIGEN i informen. Si qualsevol fase falla, s'atura
 * immediatament (fail-fast) i el commit es bloqueja amb exit 1 — no es fa
 * cap escriptura parcial addicional després d'un fallada.
 *
 * Ús a .husky/pre-commit:
 *   node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/pre-commit.mjs || exit 1
 */
import { auditRootHygiene } from './wiki_integritat.mjs';
import { runAudit } from './audit_estructura.mjs';
import { findDuplicates } from './contradiction_engine.mjs';

const step = (n, msg) => console.log(`\n[${n}/3] ${msg}`);

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  step(1, `Integritat d'arrel (Root Hygiene)... ${DRY_RUN ? '[DRY-RUN]' : ''}`);
  await auditRootHygiene(undefined, undefined, { dryRun: DRY_RUN });

  step(2, 'Auditoria estructural (5 Pilars, nomenclatura, aïllament cognitiu)...');
  const { errors: structErrors, avisos } = await runAudit();
  if (avisos.length > 0) {
    console.warn('⚠️  Avisos (no bloquegen):');
    avisos.forEach(a => console.warn(a));
  }
  if (structErrors.length > 0) {
    console.error('\n🚨 SDP-LOCK: auditoria estructural fallada 🚨');
    structErrors.forEach(e => console.error(e));
    process.exit(1);
  }
  console.log('✅ Estructura OK.');

  step(3, 'Contradiction Engine (Veritat en Dos Miralls + Marca de Jurisdicció)...');
  const duplicats = (await findDuplicates()).filter(d => !d.marcaJurisdiccioDiferent);
  if (duplicats.length > 0) {
    console.error(`\n🚨 SDP-LOCK: ${duplicats.length} contradicció(ns) semàntica(ques) sense Marca de Jurisdicció 🚨`);
    duplicats.forEach(d => console.error(`[${(d.s * 100).toFixed(1)}%] ${d.a} ↔ ${d.b}`));
    console.error('\nExecuta: node contradiction_engine.mjs --force   per generar l\'Acta de proposta.');
    process.exit(1);
  }
  console.log('✅ Cap contradicció real.');

  step(4, 'Auditoria Semàntica (Trellat)...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/semantic_auditor.mjs', { stdio: 'inherit' });
  } catch (err) {
    console.warn("⚠️  L'auditoria semàntica ha reportat avisos (mode consultiu).");
  }

  console.log('\n✅ TALLAFOCS SUPERAT. Trellat intacte.');
  process.exit(0);
}

main().catch(err => {
  console.error('🚨 ERROR INESPERAT A L\'ORQUESTRADOR 🚨');
  console.error(err);
  process.exit(1);
});
