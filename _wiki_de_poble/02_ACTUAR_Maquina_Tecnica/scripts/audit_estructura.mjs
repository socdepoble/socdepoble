#!/usr/bin/env node
/**
 * AUDITORIA ESTRUCTURAL (CAPA DURA) — V2, post-forense 260705
 * "La IA s'oblida, el codi no."
 *
 * Canvis respecte a la versió anterior (motivats per l'auditoria):
 * 1. Regex únic importat de lib/termodinamic.mjs (abans hi havia dos regex
 *    contradictoris i els fitxers ben nomenats fallaven l'auditoria).
 * 2. La llei de nom NOMÉS s'aplica a fitxers .md de contingut, mai al codi
 *    font de scripts/ (això és el que feia que wiki-integrity.cjs es
 *    mossegara la pota ell mateix).
 * 3. PILARS_VIGENTS ara es fa SERVIR de veres per a validar l'arrel
 *    (abans PERMITTED_DIRS es declarava i mai es consultava: 0 usos).
 * 4. checkOrphanSkillFolders ja no falla en silenci si el directori no
 *    existeix: ho reporta com AVÍS explícit en compte de no dir res.
 * 5. checkCognitiveIsolation ja no barreja taxonomia vella i nova.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isValidContentFile,
  hasValidCharset,
  EXEMPT_BASENAMES
} from './lib/termodinamic.mjs';
import { buildWikiIndex } from './lib/wiki_walker.mjs';
import { needsThermodynamicDate } from './semantic_auditor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = path.resolve(__dirname, '../../');

// ÚNICA taxonomia vigent (confirmada pel Mestre, 260705). Qualsevol altra
// carpeta a l'arrel s'ha de moure al bancal d'orfes o destruir-se.
export const PILARS_VIGENTS = [
  '00_SER_Brain_Identitat',
  '01_SABER_Cultura_Coneixement',
  '02_ACTUAR_Maquina_Tecnica',
  '03_GOVERNAR_Normativa_Regles',
  '04_ARXIU_Documents_Historics',
  '05_Escriptori_L_Era_del_Mas'
];

const ALLOWED_ROOT_FILES = new Set(['README.md', '00_index.md', '.gitignore', 'package.json', 'package-lock.json', '.DS_Store']);
const ALLOWED_ROOT_DIRS = new Set(['.git', '.husky', 'node_modules', '.obsidian', 'src']);

function checkRootPillars(rootLevelEntries) {
  const errors = [];
  for (const entry of rootLevelEntries) {
    if (entry.isDirectory) {
      if (!PILARS_VIGENTS.includes(entry.name) && !ALLOWED_ROOT_DIRS.has(entry.name)) {
        errors.push(`[ERROR-PILAR] Carpeta il·legal a l'arrel: '${entry.name}'. Mou-la al bancal d'orfes (04_ARXIU_Documents_Historics/bancal_actiu) o destrueix-la. Pilars vigents: ${PILARS_VIGENTS.join(', ')}.`);
      }
    } else if (!ALLOWED_ROOT_FILES.has(entry.name)) {
      errors.push(`[ERROR-ARREL] Fitxer solt a l'arrel: '${entry.name}'. Cap fitxer de contingut ha de viure fora dels 5 Pilars.`);
    }
  }
  return errors;
}

function checkThermoContentNames(mdDocs) {
  const errors = [];
  for (const doc of mdDocs) {
    if (EXEMPT_BASENAMES.has(doc.name)) continue;
    // Els .md dins de qualsevol carpeta 'scripts' (README tècnics, etc.) no són contingut editorial.
    if (doc.relPath.split(path.sep).includes('scripts')) continue;

    if (!hasValidCharset(doc.name)) {
      errors.push(`[ERROR-TERMO] ${doc.relPath} conté caràcters fora del whitelist (només A-Za-z0-9_.).`);
      continue;
    }
    
    const { necessitaData } = needsThermodynamicDate(doc);
    if (necessitaData && !isValidContentFile(doc.name)) {
      errors.push(`[ERROR-TERMO] ${doc.relPath} no compleix la forma YYMMDD_HHMM_CATEGORIA_Titol.md`);
    }
  }
  return errors;
}

function checkOrphanSkillFolders(allEntries) {
  const errors = [];
  const skillsDir = allEntries.find(e =>
    e.type === 'dir' &&
    e.name === 'skills' &&
    e.relPath.startsWith('02_ACTUAR_Maquina_Tecnica')
  );

  if (!skillsDir) {
    // Abans això callava (fs.existsSync -> false -> return []). Ara ho diem clar:
    errors.push(`[AVÍS-DIÒGENES] No s'ha trobat cap carpeta 'skills' dins de 02_ACTUAR_Maquina_Tecnica. Si les SKILLS ja no viuen ahí, actualitza este checker; si haurien d'existir, açò és un forat de cobertura, no un èxit silenciós.`);
    return errors;
  }

  const subfolders = allEntries.filter(e => e.type === 'dir' && path.dirname(e.relPath) === skillsDir.relPath);
  const files = allEntries.filter(e => e.type === 'file');
  for (const folder of subfolders) {
    const hasReadme = files.some(f => path.dirname(f.relPath) === folder.relPath && f.name === 'SKILL.md');
    if (!hasReadme) {
      errors.push(`[ERROR-DIÒGENES] '${folder.relPath}' no conté SKILL.md. Si no serveix, esborra-la.`);
    }
  }
  return errors;
}

function checkCognitiveIsolation(mdDocs) {
  const errors = [];
  // NOMÉS els 5 pilars vigents. Abans hi havia una barreja de
  // '00_SER_Brain_Identitat' (nou) amb '01_identitat_iaia' (vell, mort).
  const CORE_DIRS = PILARS_VIGENTS;

  for (const doc of mdDocs) {
    const topDir = doc.relPath.split(path.sep)[0];
    if (!CORE_DIRS.includes(topDir)) continue;

    if (doc.content.trim().length === 0) {
      errors.push(`[ERROR-COGNITIU] Fitxer buit (0 bytes): ${doc.relPath}`);
      continue;
    }
    const links = (doc.content.match(/\[\[(.*?)\]\]/g) || []).length;
    if (links <= 1) {
      errors.push(`[AVÍS-COGNITIU] Aïllament detectat a '${doc.relPath}'. Només ${links} enllaç(os). Revisa si està desconnectat de la xarxa.`);
    }
  }
  return errors;
}

/**
 * ERROR i AVÍS ara tenen efecte diferent (abans no: tot bloquejava per igual,
 * malgrat que el codi ja distingia els prefixos). ERROR = SDP-LOCK. AVÍS = visible
 * al log però no bloqueja el commit.
 */
export async function runAudit(wikiDir = WIKI_DIR) {
  const { allEntries, mdDocs, rootLevelEntries } = await buildWikiIndex(wikiDir);
  const findings = [
    ...checkRootPillars(rootLevelEntries),
    ...checkThermoContentNames(mdDocs),
    ...checkOrphanSkillFolders(allEntries),
    ...checkCognitiveIsolation(mdDocs)
  ];
  return {
    errors: findings.filter(f => f.startsWith('[ERROR')),
    avisos: findings.filter(f => f.startsWith('[AVÍS'))
  };
}

// Execució directa (Husky/CI)
if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, avisos } = await runAudit();
  if (avisos.length > 0) {
    console.warn('⚠️  Avisos (no bloquegen el commit):');
    avisos.forEach(a => console.warn(a));
  }
  if (errors.length > 0) {
    console.error('\n🚨 AUDITORIA ESTRUCTURAL FALLADA (SDP-LOCK PREVENTIU) 🚨\n');
    errors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('\n✅ AUDITORIA ESTRUCTURAL SUPERADA. 5 Pilars i Trellat intactes.');
    process.exit(0);
  }
}
