#!/usr/bin/env node
/**
 * semantic_auditor.mjs
 * CAPA COGNITIVA SUPERIOR — autònoma, de sol lectura, NO modifica audit_estructura.mjs.
 *
 * Objectiu: deduir per heurística (zero tokens d'IA, pur JS determinista)
 *   (A) quines CARPETES semblen fora de lloc o duplicades respecte als 5 Pilars.
 *   (B) quins FITXERS .md realment necessiten el prefix termodinàmic YYMMDD_HHMM
 *       i quins no (perquè ja porten la seua pròpia temporalitat per altres vies).
 *
 * Este mòdul és consultiu (imprimeix alertes), NO bloqueja cap commit.
 * Si vols que bloquege, s'integra a pre-commit.mjs explícitament — de moment
 * és una eina de consulta manual, tal com has demanat ("cervell que llig").
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWikiIndex, parseFrontmatter } from './lib/wiki_walker.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

export const PILARS_VIGENTS = [
  '00_SER_Brain_Identitat',
  '01_SABER_Cultura_Coneixement',
  '02_ACTUAR_Maquina_Tecnica',
  '03_GOVERNAR_Normativa_Regles',
  '04_ARXIU_Documents_Historics',
  '05_Escriptori_L_Era_del_Mas'
];

/* ============================================================
   (A) ANOMALIES DE CARPETA — heurístiques barates, cap token d'IA
   ============================================================ */

// Diccionari xicotet: paraules que semànticament pertanyen a un Pilar concret.
// No és NLP, és un lookup de paraules clau — barat i determinista.
const PILLAR_VOCABULARY = {
  '04_ARXIU_Documents_Historics': ['produccio', 'production', 'build', 'output', 'sortida', 'log', 'logs', 'bancal', 'backup', 'arxiu', 'historic', 'dist'],
  '02_ACTUAR_Maquina_Tecnica': ['scripts', 'script', 'skill', 'skills', 'codi', 'source', 'src', 'build', 'dist', '_build'],
  '01_SABER_Cultura_Coneixement': ['cultura', 'glossari', 'narrativa', 'coneixement', 'historia'],
  '00_SER_Brain_Identitat': ['identitat', 'bios', 'brain'],
  '03_GOVERNAR_Normativa_Regles': ['normativa', 'govern', 'regles', 'lleis', 'manaments']
};

// Carpetes de software que MAI haurien de viure fora de 02_ACTUAR_Maquina_Tecnica
const SOFTWARE_ARTIFACT_DIR = /^_?(build|dist|out(put)?|node_modules|coverage)$/i;

// Prefix numèric de 2 dígits pre-Big-Bang (qualsevol que no siga 00-04)
const LEGACY_NUMERIC_PREFIX = /^(\d{2})_/;

function scoreFolderAgainstPillars(folderName) {
  const lower = folderName.toLowerCase();
  const matches = [];
  for (const [pillar, words] of Object.entries(PILLAR_VOCABULARY)) {
    const hit = words.find(w => lower.includes(w));
    if (hit) matches.push({ pillar, hit });
  }
  return matches;
}

export function auditFolderSemantics(allEntries) {
  const alerts = [];
  const dirs = allEntries.filter(e => e.type === 'dir');

  for (const dir of dirs) {
    const topSegment = dir.relPath.split(path.sep)[0];
    const isRootLevel = dir.relPath === dir.name; // sense separador = arrel directa

    // 1. Prefix numèric heretat (pre 5-Pilars) que no és cap dels 00-04
    const prefixMatch = dir.name.match(LEGACY_NUMERIC_PREFIX);
    if (isRootLevel && prefixMatch && !PILARS_VIGENTS.some(p => p.startsWith(prefixMatch[1] + '_'))) {
      alerts.push({
        tipus: 'PREFIX-OBSOLET',
        carpeta: dir.relPath,
        missatge: `Prefix numèric '${prefixMatch[1]}_' no correspon a cap dels 5 Pilars vigents (00-04). Sembla taxonomia pre-Big-Bang. Revisa si cal fusionar o destruir.`
      });
      continue;
    }

    // 2. Carpeta d'artefacte de software fora de 02_ACTUAR_Maquina_Tecnica
    if (SOFTWARE_ARTIFACT_DIR.test(dir.name) && topSegment !== '02_ACTUAR_Maquina_Tecnica') {
      alerts.push({
        tipus: 'ARTEFACTE-FORA-DE-LLOC',
        carpeta: dir.relPath,
        missatge: `'${dir.name}' sembla un artefacte de software (build/dist/output) però viu fora de 02_ACTUAR_Maquina_Tecnica. Mou-la dins o afig-la a .gitignore si és generada.`
      });
      continue;
    }

    // 3. Solapament semàntic amb un Pilar existent, estant fora d'ell
    if (isRootLevel && !PILARS_VIGENTS.includes(dir.name)) {
      const matches = scoreFolderAgainstPillars(dir.name);
      if (matches.length > 0) {
        const pillars = [...new Set(matches.map(m => m.pillar))];
        alerts.push({
          tipus: 'POSSIBLE-DUPLICAT-SEMANTIC',
          carpeta: dir.relPath,
          missatge: `El nom '${dir.name}' comparteix vocabulari amb ${pillars.join(', ')}. Revisa si és una còpia obsoleta d'un Pilar existent (paraula(es) clau: ${matches.map(m => m.hit).join(', ')}).`
        });
      }
    }
  }
  return alerts;
}

/* ============================================================
   (B) NECESSITA DATA TERMODINÀMICA? — heurística de decisió
   ============================================================ */

// Categories que representen un EVENT puntual (acta, informe, flux de treball,
// petorreta). Un event té sentit ancorar-lo a un instant -> SÍ necessita data.
const EPISODIC_CATEGORIES = new Set(['ACTA', 'REPORT', 'WORKFLOW', 'PROMPT']);

// Categories que representen un DOCUMENT VIU (skill, nucli, dashboard, plantilla).
// Per defecte NO necessiten data al nom, tret que cap altre senyal ho desmentisca.
const LIVING_CATEGORIES = new Set(['SKILL', 'CORE', 'DOC', 'ASSET', 'PLANTILLA']);

const XXYY_VERSION_REGEX = /^\d{2}\.\d{2}$/;
const DATE_COLUMN_HEADER = /\|\s*(data|date|created_at|timestamp|actualitzat|hores)\s*\|/i;
const DATAVIEW_BLOCK = /```dataview/i;

/**
 * Retorna { necessitaData: boolean, motiu: string } per a un document .md.
 */
export function needsThermodynamicDate(doc) {
  const fm = parseFrontmatter(doc.content);
  const categoria = (fm.categoria || fm.tipus || '').toUpperCase();

  // Senyal 1: és un dashboard viu generat (Dataview) -> mai necessita data.
  if (DATAVIEW_BLOCK.test(doc.content)) {
    return { necessitaData: false, motiu: 'Conté bloc ```dataview: és un dashboard viu, no un event puntual.' };
  }

  // Senyal 2: el propi contingut ja porta una taula amb columna de data/hora
  // (auto-log, com el Registre d'Automillora) -> la data al nom és redundant.
  if (DATE_COLUMN_HEADER.test(doc.content)) {
    return { necessitaData: false, motiu: 'El contingut ja té una taula amb columna de data/hora (auto-log). Data al nom és doble comptabilitat.' };
  }

  // Senyal 3: versionat XX.YY al frontmatter -> document viu versionat, no episòdic.
  if (fm.version && XXYY_VERSION_REGEX.test(fm.version)) {
    return { necessitaData: false, motiu: `Frontmatter ja porta versió viva '${fm.version}' (XX.YY). No és un event puntual.` };
  }

  // Senyal 4: categoria explícitament episòdica -> SÍ.
  if (EPISODIC_CATEGORIES.has(categoria)) {
    return { necessitaData: true, motiu: `Categoria '${categoria}' és episòdica (event puntual).` };
  }

  // Senyal 5: categoria explícitament viva -> NO per defecte.
  if (LIVING_CATEGORIES.has(categoria)) {
    return { necessitaData: false, motiu: `Categoria '${categoria}' és un document viu per defecte.` };
  }

  // Sense senyals clars: per prudència (Llei 5, Plasticitat i Intuïció),
  // manté la data per defecte fins que hi haja evidència del contrari.
  return { necessitaData: true, motiu: 'Sense senyals clars — es manté la convenció per defecte (prudència > brillantesa).' };
}

export function auditFilenameNecessity(mdDocs) {
  const alerts = [];
  for (const doc of mdDocs) {
    if (doc.relPath.split(path.sep).includes('scripts')) continue;
    const { necessitaData, motiu } = needsThermodynamicDate(doc);
    const teDataAlNom = /^\d{6}_\d{4}_/.test(doc.name);

    if (necessitaData && !teDataAlNom) {
      alerts.push({ tipus: 'FALTA-DATA', fitxer: doc.relPath, missatge: `Hauria de portar prefix termodinàmic i no en té. ${motiu}` });
    } else if (!necessitaData && teDataAlNom) {
      alerts.push({ tipus: 'DATA-INNECESSARIA', fitxer: doc.relPath, missatge: `Porta prefix termodinàmic però sembla innecessari. ${motiu}` });
    }
  }
  return alerts;
}

/* ============================================================
   ORQUESTRACIÓ DE LA CAPA SEMÀNTICA
   ============================================================ */

export async function runSemanticAudit(wikiDir = ROOT) {
  const { allEntries, mdDocs } = await buildWikiIndex(wikiDir);
  return {
    folderAlerts: auditFolderSemantics(allEntries),
    filenameAlerts: auditFilenameNecessity(mdDocs)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { folderAlerts, filenameAlerts } = await runSemanticAudit();

  console.log(`\n🧠 AUDITORIA SEMÀNTICA (consultiva — no bloqueja cap commit)\n`);

  if (folderAlerts.length) {
    console.log(`📁 Carpetes (${folderAlerts.length}):`);
    folderAlerts.forEach(a => console.log(`  [${a.tipus}] ${a.carpeta} — ${a.missatge}`));
  } else {
    console.log('📁 Cap anomalia de carpeta detectada.');
  }

  console.log();
  if (filenameAlerts.length) {
    console.log(`📄 Fitxers (${filenameAlerts.length}):`);
    filenameAlerts.forEach(a => console.log(`  [${a.tipus}] ${a.fitxer} — ${a.missatge}`));
  } else {
    console.log('📄 Cap fitxer amb necessitat de data en dubte.');
  }
  process.exit(0);
}
