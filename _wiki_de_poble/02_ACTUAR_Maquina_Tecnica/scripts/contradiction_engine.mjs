#!/usr/bin/env node
/**
 * contradiction_engine.mjs
 * Motor autònom per a detectar duplicitats semàntiques a la Wiki de Poble.
 * Usa similitud de Jaccard sobre shingles (n-grames de paraules).
 *
 * Canvis respecte a la versió anterior:
 * 1. Extensió .mjs explícita (l'original ja usava sintaxi ESM però amb
 *    extensió .js, ambigu en un projecte amb germans .cjs).
 * 2. Marca de Jurisdicció (Registre d'Automillora 260705_0600): dos
 *    documents semànticament pareguts NO són una contradicció si cadascun
 *    porta un `jurisdiccio:` diferent al frontmatter (principi/cultura/
 *    requisit/implementacio). Abans, l'engine no distingia açò i hauria
 *    proposat fusionar continguts que existeixen legítimament a 4 capes.
 * 3. DRY_RUN ara fa alguna cosa: abans es declarava i mai es llegia
 *    (--force no tenia cap efecte real, era un altre interruptor fantasma
 *    igual que PERMITTED_DIRS). Ara, --force escriu una ACTA de proposta
 *    de fusió a 04_ARXIU_Documents_Historics/bancal_actiu en compte de només
 *    imprimir per consola.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { buildWikiIndex, parseFrontmatter } from './lib/wiki_walker.mjs';
import { getTimestamp } from './lib/termodinamic.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const UMBRAL_DUPLICAT = 0.62;
const FORCE = process.argv.includes('--force');

const log = (msg) => console.log(`[CONTRADICTION] ${msg}`);

function shingles(text, n = 4) {
  const tokens = text.toLowerCase().normalize('NFD').replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i <= tokens.length - n; i++) s.add(tokens.slice(i, i + n).join(' '));
  return s;
}

function jaccard(a, b) {
  const A = shingles(a), B = shingles(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  A.forEach(x => { if (B.has(x)) inter++; });
  return inter / (A.size + B.size - inter);
}

function stripFrontmatterAndComments(text) {
  return text.replace(/^---[\s\S]*?---/m, '').replace(/<!--[\s\S]*?-->/g, '').trim();
}

export async function findDuplicates(wikiDir = ROOT) {
  const { mdDocs } = await buildWikiIndex(wikiDir);
  const docs = mdDocs
    .filter(d => !d.relPath.split(path.sep).includes('scripts'))
    .map(d => ({
      ruta: d.relPath,
      fm: parseFrontmatter(d.content),
      text: stripFrontmatterAndComments(d.content)
    }))
    .filter(d => d.text.length > 200);

  const duplicats = [];
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const sim = jaccard(docs[i].text, docs[j].text);
      if (sim < UMBRAL_DUPLICAT) continue;

      const jurA = docs[i].fm.jurisdiccio;
      const jurB = docs[j].fm.jurisdiccio;
      const marcaJurisdiccioDiferent = jurA && jurB && jurA !== jurB;

      duplicats.push({
        s: sim,
        a: docs[i].ruta,
        b: docs[j].ruta,
        marcaJurisdiccioDiferent,
        jurA, jurB
      });
    }
  }
  return duplicats;
}

async function escriureActaProposta(duplicatsReals) {
  const dest = path.join(ROOT, '04_ARXIU_Documents_Historics', 'bancal_actiu');
  await fs.mkdir(dest, { recursive: true });
  const ts = getTimestamp();
  const filename = `${ts}_ACTA_Proposta_Fusio_Contradiccions.md`;
  const lines = [
    `---`,
    `tipus: acta`,
    `created_at: '${ts}'`,
    `authority: 'contradiction_engine.mjs'`,
    `---`,
    `# Proposta de fusió — contradiccions detectades`,
    ``,
    ...duplicatsReals.map(d =>
      `- **${(d.s * 100).toFixed(1)}%** — [[${d.a}]] ↔ [[${d.b}]] → escull document canònic i converteix l'altre en pont (wikilink).`
    )
  ];
  await fs.writeFile(path.join(dest, filename), lines.join('\n') + '\n', 'utf8');
  return path.join(dest, filename);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  log(`Iniciant Contradiction Engine a: ${ROOT} (mode: ${FORCE ? 'ESCRIPTURA' : 'DRY-RUN'})`);
  const duplicats = await findDuplicates();

  const marcats = duplicats.filter(d => d.marcaJurisdiccioDiferent);
  const reals = duplicats.filter(d => !d.marcaJurisdiccioDiferent);

  if (marcats.length) {
    log(`ℹ️ ${marcats.length} coincidència(es) amb Marca de Jurisdicció diferent — NO són contradicció, són capes legítimes:`);
    marcats.forEach(d => log(`  [${(d.s * 100).toFixed(1)}%] ${d.a} (${d.jurA}) ↔ ${d.b} (${d.jurB})`));
  }

  if (reals.length === 0) {
    log('✅ Cap contradicció real (Veritat en Dos Miralls preservada).');
    process.exit(0);
  }

  log(`⚠️ ${reals.length} contradicció(ns) semàntica(ques) real(s):`);
  reals.sort((a, b) => b.s - a.s).forEach(d => {
    log(`[${(d.s * 100).toFixed(1)}%] ${d.a}  ↔  ${d.b}`);
  });

  if (FORCE) {
    const actaPath = await escriureActaProposta(reals);
    log(`📝 Acta de proposta escrita: ${path.relative(ROOT, actaPath)}`);
  } else {
    log('DRY-RUN: cap fitxer escrit. Repeteix amb --force per generar l\'Acta de proposta al bancal actiu.');
  }
  process.exit(1);
}
