#!/usr/bin/env node
/**
 * cura_robotomia.mjs — Cirurgia de la Robotomia (reversió Inter→Roboto)
 * Destí: 02_ACTUAR_Maquina_Tecnica/scripts/cura_robotomia.mjs
 *
 * DIAGNÒSTIC FORENSE: en algun moment es va executar una purga cega de la
 * paraula "Inter" (probablement per imposar la tipografia Roboto d'acord amb
 * identitat_visual.md) que va lobotomitzar tota paraula que contenia eixe
 * fragment. Resultat, en documents CANÒNICS:
 *   - 02_GENOTIP, Llei 1:      "Mínima Robotovenció"   (era: Intervenció)
 *   - 00_GLOSSARI_CANONIC:     "Estats d'Robotofície"  (era: Interfície)
 *   - 01_IDENTITAT:            "Protocols d'Robotoacció" (era: Interacció)
 *   - el_trellat/SKILL.md:     "### Robotoacció"
 *   - seo_trellat:             "Robotonet"             (era: Internet)
 *   - enginyeria_inversa_mit:  "L'Art d'Robotorogar"   (era: Interrogar)
 *   - ESTANDARD_Pedra_Seca §2: "Robotoacció i estat"
 *   - DOC_Seguretat:           "Robotofície = clon de WhatsApp"
 *
 * Este script fa EXACTAMENT el contrari d'una purga cega: diccionari tancat,
 * paraula per paraula, amb dry-run per defecte i informe. Cap regex genèric.
 *
 * ÚS:
 *   node cura_robotomia.mjs               # dry-run: llista ferides
 *   node cura_robotomia.mjs --procedeix   # BLOQUEJAT: cirurgia històrica tancada
 *   node cura_robotomia.mjs --json
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = path.resolve(__dirname, '../../');

const PROCEDEIX = process.argv.includes('--procedeix');
const JSON_OUT = process.argv.includes('--json');
const TEXT_EXTENSIONS = new Set([
  '.md', '.json', '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.css',
  '.html', '.yaml', '.yml', '.sh', '.txt',
]);
const ALLOWED_ROBOTO_TOKENS = new Set(['roboto', 'robotomia']);
const ROBOTOMIA_CANDIDATE = /\broboto[\p{L}\p{N}_]*\b/giu;

/** Diccionari tancat de ferides conegudes. Res més es toca. */
const DICCIONARI = [
  ['Robotovenció', 'Intervenció'],
  ['Robotovencions', 'Intervencions'],
  ['robotovenció', 'intervenció'],
  ['Robotofícies', 'Interfícies'],
  ['Robotofície', 'Interfície'],
  ['robotofícies', 'interfícies'],
  ['robotofície', 'interfície'],
  ['Robotoaccions', 'Interaccions'],
  ['Robotoacció', 'Interacció'],
  ['robotoaccions', 'interaccions'],
  ['robotoacció', 'interacció'],
  ['Robotorogatori', 'Interrogatori'],
  ['Robotorogar', 'Interrogar'],
  ['robotorogar', 'interrogar'],
  ['Robotonet', 'Internet'],
  ['robotonet', 'internet'],
];

export async function cura(wikiDir = WIKI_DIR) {
  if (PROCEDEIX) {
    throw new Error('--procedeix retirat: la Robotomia ja està curada i qualsevol nova substitució necessita pla+Reflex+rollback.');
  }
  const root = await fs.realpath(wikiDir);
  const self = await fs.realpath(fileURLToPath(import.meta.url));
  const files = [];
  async function walk(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(full);
    }
  }
  await walk(root);
  const resum = { ok: true, mode: 'DIAGNÒSTIC', fitxers: 0, substitucions: 0, detall: [] };

  for (const fullPath of files) {
    if (await fs.realpath(fullPath) === self) continue;
    const content = await fs.readFile(fullPath, 'utf8');
    const findings = [];
    for (const match of content.matchAll(ROBOTOMIA_CANDIDATE)) {
      if (ALLOWED_ROBOTO_TOKENS.has(match[0].toLocaleLowerCase('ca'))) continue;
      findings.push({
        token: match[0],
        line: content.slice(0, match.index).split(/\r?\n/).length,
      });
    }
    if (!findings.length) continue;
    resum.fitxers++;
    resum.substitucions += findings.length;
    resum.detall.push({
      fitxer: path.relative(root, fullPath).split(path.sep).join('/'),
      tocs: findings.length,
      ferides: findings,
    });
  }
  resum.ok = resum.substitucions === 0;
  return resum;
}

const isMain = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  cura()
    .then(r => {
      if (JSON_OUT) console.log(JSON.stringify(r, null, 2));
      else {
        console.log(`\n🩺 [ROBOTOMIA] ${r.mode}: ${r.substitucions} ferides en ${r.fitxers} fitxers.`);
        for (const d of r.detall) console.log(`   - ${d.fitxer}: ${d.ferides.map((f) => `${f.token}@${f.line}`).join(', ')}`);
        if (r.fitxers > 0) console.log('\n   → Diagnòstic únicament: crea un pla nou; no reutilitzes la cirurgia històrica.');
      }
      if (!r.ok) process.exitCode = 1;
    })
    .catch(err => { console.error('❌ [ROBOTOMIA] Error:', err); process.exit(1); });
}
