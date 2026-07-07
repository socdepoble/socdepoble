#!/usr/bin/env node
/**
 * AUDIT_INTEGRITAT_ESTRUCTURAL.JS
 * "L'Inquisidor de la Veritat" — linter semàntic consolidat.
 *
 * SUBSTITUEIX verificador_recomptes.cjs (esborreu l'antic, no el mantingueu
 * en paral·lel — el mateix "script sprawl" que hem criticat als documents
 * Markdown no el podem permetre als scripts).
 *
 * Detecta 4 classes de fallada que 5 rondes d'auditoria humana han trobat
 * repetidament a mà:
 *   1. Enllaços [[wikilink]] que no resolen a cap fitxer real.
 *   2. Desaparició total de la Clàusula del Llinatge de tot el graf.
 *   3. Bugs de Recompte ("4 Pilars" quan n'hi ha 5).
 *   4. Capítols botats (## 1, ## 2, ## 4 — falta el ## 3).
 *
 * Codi d'eixida: 0 si tot net, 1 si hi ha alguna troballa CRÍTICA
 * (apte per a git pre-commit / CI).
 *
 * Ús: node audit_integritat_estructural.js [--root _wiki_de_poble]
 */

const fs = require('fs').promises;
const path = require('path');

const ROOT = process.argv.includes('--root')
  ? process.argv[process.argv.indexOf('--root') + 1]
  : '.';

const LLINATGE_CANARIS = ['rentonar.blogspot.com', 'socdepoble.net'];
const SUBSTANTIUS_COMPTABLES = [
  'Lleis?', 'Manaments?', 'Reflexos?', 'Pilars?', 'Categories?',
  'Petorretes?', 'Membres?', 'Estrats?', 'Mètriques?', 'Passos?', 'Fases?', 'Causes?',
];

let critics = 0;

async function trobarMarkdown(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const resultats = await Promise.all(
    entries.map(async (e) => {
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')) {
        return trobarMarkdown(fullPath);
      }
      if (e.name.endsWith('.md')) return [fullPath];
      return [];
    })
  );
  return resultats.flat();
}

// ---------------------------------------------------------------
// 1. ENLLAÇOS TRENCATS
// ---------------------------------------------------------------
async function comprovarEnllaços(fitxers, indexNoms) {
  const patro = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  const problemes = [];

  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    let m;
    while ((m = patro.exec(contingut)) !== null) {
      const objectiu = m[1].split('/').pop().trim().toLowerCase();
      if (!indexNoms.has(objectiu)) {
        problemes.push({ fitxer, enllaç: m[0], objectiu });
      }
    }
  }
  return problemes;
}

// ---------------------------------------------------------------
// 2. LLINATGE PERDUT (Clàusula del Llinatge — Governança Nivell 3)
// ---------------------------------------------------------------
async function comprovarLlinatge(fitxers) {
  let trobat = { 'rentonar.blogspot.com': false, 'socdepoble.net': false };
  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    for (const canari of LLINATGE_CANARIS) {
      if (contingut.includes(canari)) trobat[canari] = true;
    }
  }
  const absents = LLINATGE_CANARIS.filter((c) => !trobat[c]);
  return absents; // buit si tot present enlloc del graf
}

// ---------------------------------------------------------------
// 3. BUGS DE RECOMPTE
// ---------------------------------------------------------------
function comptarElementsSeguents(contingut, posicio) {
  const tros = contingut.slice(posicio, posicio + 3000);
  const finsProxCapcalera = tros.search(/\n#{1,2}\s/);
  const zona = finsProxCapcalera > 50 ? tros.slice(0, finsProxCapcalera) : tros;

  const itemsNumerats = (zona.match(/^\s{0,3}\d+\.\s/gm) || []).length;
  const capcaleresNumerades = (zona.match(/^#{1,3}\s*\d+\.\s/gm) || []).length;
  const filesTaula = Math.max(0, (zona.match(/^\|.+\|$/gm) || []).length - 2);
  const rosterMatch = zona.match(/\*\*([A-ZÀ-Ú][a-zà-ú]+(?:,\s*[A-ZÀ-Ú][a-zà-ú]+)+(?:\s+i\s+[A-ZÀ-Ú][a-zà-ú]+)?)\*\*/);
  const rosterCount = rosterMatch ? rosterMatch[1].split(/,|\si\s/).filter(Boolean).length : 0;

  return Math.max(itemsNumerats, capcaleresNumerades, filesTaula, rosterCount);
}

async function comprovarRecomptes(fitxers) {
  const regex = new RegExp(`\\b(\\d+)\\s+(${SUBSTANTIUS_COMPTABLES.join('|')})\\b`, 'gi');
  const problemes = [];
  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    let m;
    const re = new RegExp(regex);
    while ((m = re.exec(contingut)) !== null) {
      const declarat = parseInt(m[1], 10);
      const comptat = comptarElementsSeguents(contingut, m.index);
      if (comptat > 0 && comptat !== declarat) {
        problemes.push({ fitxer, frase: m[0], declarat, comptat });
      }
    }
  }
  return problemes;
}

// ---------------------------------------------------------------
// 4. CAPÍTOLS BOTATS (seqüència ## N. amb forat)
// ---------------------------------------------------------------
async function comprovarCapitolsBotats(fitxers) {
  const problemes = [];
  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    const numeros = [...contingut.matchAll(/^##\s+(\d+)\.\s/gm)].map((m) => parseInt(m[1], 10));
    if (numeros.length < 2) continue;

    for (let i = 1; i < numeros.length; i++) {
      if (numeros[i] - numeros[i - 1] > 1) {
        problemes.push({
          fitxer,
          forat: `falta(en) el/els capítol(s) ${numeros[i - 1] + 1}..${numeros[i] - 1}`,
          context: `entre ## ${numeros[i - 1]} i ## ${numeros[i]}`,
        });
      }
    }
  }
  return problemes;
}

// ---------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------
(async () => {
  const fitxers = await trobarMarkdown(ROOT);
  const indexNoms = new Set(fitxers.map((f) => path.basename(f, '.md').toLowerCase()));

  console.log(`\n🔍 Auditant ${fitxers.length} fitxers Markdown sota ${ROOT}/...\n`);

  const enllaçosTrencats = await comprovarEnllaços(fitxers, indexNoms);
  if (enllaçosTrencats.length) {
    critics++;
    console.log(`🔗 ${enllaçosTrencats.length} ENLLAÇ(OS) TRENCAT(S):`);
    enllaçosTrencats.forEach((p) => console.log(`   ${p.fitxer} → ${p.enllaç} (objectiu "${p.objectiu}" no existeix)`));
    console.log('');
  }

  const llinatgeAbsent = await comprovarLlinatge(fitxers);
  if (llinatgeAbsent.length) {
    critics++;
    console.log(`📜 CLÀUSULA DEL LLINATGE INCOMPLETA — absent de TOT el graf:`);
    llinatgeAbsent.forEach((c) => console.log(`   ✗ "${c}" no apareix en cap fitxer`));
    console.log('   → Viola Governança Nivell 3 (Clàusula del Llinatge).\n');
  }

  const recomptesMalament = await comprovarRecomptes(fitxers);
  if (recomptesMalament.length) {
    critics++;
    console.log(`🔢 ${recomptesMalament.length} BUG(S) DE RECOMPTE:`);
    recomptesMalament.forEach((p) => console.log(`   ${p.fitxer}: "${p.frase}" → compta ${p.comptat}`));
    console.log('');
  }

  const capitolsBotats = await comprovarCapitolsBotats(fitxers);
  if (capitolsBotats.length) {
    critics++;
    console.log(`📖 ${capitolsBotats.length} CAPÍTOL(S) BOTAT(S):`);
    capitolsBotats.forEach((p) => console.log(`   ${p.fitxer}: ${p.forat} (${p.context})`));
    console.log('');
  }

  if (critics === 0) {
    console.log('✅ Integritat estructural i semàntica: sense troballes.\n');
    process.exit(0);
  } else {
    console.log(`❌ ${critics} categoria(es) de fallada detectada(es). Revisió humana requerida.\n`);
    process.exit(1);
  }
})();
