#!/usr/bin/env node
/**
 * trasplantar_classes.js — Pedra Seca Automàtica
 * 
 * Agafa les classes dels divs eliminats en l'últim commit i les
 * injerta al fill directe que ha quedat.
 * 
 * Ús:
 *   node trasplantar_classes.js [--dry-run]
 * 
 * Requereix Git i Node 18+. Executar des de l'arrel del repo.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const GIT_DIFF_CMD = 'git diff HEAD~1 --diff-filter=M -- "*.jsx" "*.tsx"';

// ------------------------------------------------------------------
// 1. Obtindre la llista de fitxers modificats (només JSX/TSX)
// ------------------------------------------------------------------
function getModifiedJsxFiles() {
  try {
    const output = execSync('git diff --name-only HEAD~1 -- "*.jsx" "*.tsx"', { encoding: 'utf8' });
    return output
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);
  } catch (err) {
    console.error('Error executant git diff --name-only:', err.message);
    return [];
  }
}

// ------------------------------------------------------------------
// 2. Parsejar el diff complet i extreure les classes perdudes per fitxer
//    Retorna un Map: fitxer -> array de { removedClass, approxLineNew }
// ------------------------------------------------------------------
function parseDiffForRemovedDivs() {
  const diffOutput = execSync(GIT_DIFF_CMD, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const files = new Map(); // fitxer -> array de troballes

  // Dividim per fitxer (el diff comença amb "diff --git ...")
  const fileChunks = diffOutput.split(/(?=^diff --git )/m);

  for (const chunk of fileChunks) {
    const headerMatch = chunk.match(/^diff --git a\/(.*?) b\/(.*?)$/m);
    if (!headerMatch) continue;
    const filePath = headerMatch[2]; // path actual al repo
    // Ens quedem només amb els fitxers JSX
    if (!/\.(jsx|tsx)$/.test(filePath)) continue;

    const hunks = chunk.split(/(?=^@@ )/m).filter(part => part.startsWith('@@'));
    const findings = [];

    for (const hunk of hunks) {
      const hunkHeader = hunk.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/m);
      if (!hunkHeader) continue;
      const oldStart = parseInt(hunkHeader[1], 10);
      const newStart = parseInt(hunkHeader[3], 10);
      const lines = hunk.split('\n');

      let oldLineNum = oldStart;
      let newLineNum = newStart;
      let removedDivClass = null;
      let removedDivLineNew = null; // línia de la versió nova on anava el div (aproximadament)

      for (const line of lines) {
        if (line.startsWith('@@')) continue; // repetit per split, però per si un cas
        if (line.startsWith('-')) {
          // Línia eliminada
          const trimmed = line.substring(1).trim();
          // Busquem un <div className="..."> o <div ... className="...">
          const divMatch = trimmed.match(/<div\b[^>]*\bclassName="([^"]*)"[^>]*>/);
          if (divMatch) {
            removedDivClass = divMatch[1];
            // Guardem la línia nova on hauria estat (si no s'hagués eliminat)
            // Aproximació: la línia següent del context en la part nova serà el fill
            // Però ho resolem mirant la següent línia no eliminada
            removedDivLineNew = newLineNum; 
          }
          oldLineNum++;
        } else if (line.startsWith('+')) {
          // Línia afegida, pot ser el fill sense classe
          newLineNum++;
        } else {
          // Línia de context (sense canvi)
          if (removedDivClass !== null) {
            // Tenim una classe de div eliminat just abans d'aquesta línia de context
            // Aquesta línia de context és el nostre candidat a fill
            // Guardem la ubicació actual (newLineNum) per injectar la classe després
            findings.push({
              removedClass: removedDivClass,
              lineToInject: newLineNum, // línia on esperem trobar el tag fill
              contextLine: line.trim()   // per debug
            });
            removedDivClass = null;
          }
          oldLineNum++;
          newLineNum++;
        }
      }
      // Si el div eliminat estava al final de l'hunk sense context posterior, obviem
    }

    if (findings.length > 0) {
      files.set(filePath, findings);
    }
  }

  return files;
}

// ------------------------------------------------------------------
// 3. Per a cada fitxer, aplicar les injeccions de classe
// ------------------------------------------------------------------
function applyTransplants(filePath, changes, dryRun) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const lines = originalContent.split('\n');
  
  // Ordenem les injeccions per línia descendent per no desplaçar índexs
  const sorted = [...changes].sort((a, b) => b.lineToInject - a.lineToInject);
  let modified = [...lines];
  let applied = 0;

  for (const change of sorted) {
    const idx = change.lineToInject - 1; // l'array és 0-indexat, els números de línia comencen en 1
    if (idx < 0 || idx >= modified.length) continue;

    const originalLine = modified[idx];
    // Intentem identificar un tag d'obertura JSX (qualsevol element)
    const tagMatch = originalLine.match(/^\s*(<[A-Za-z][\w]*)\b/);
    if (!tagMatch) continue; // no és un tag, potser és text o tancament

    const tagStart = tagMatch[0];
    // Busquem si ja té className
    if (originalLine.includes('className=')) {
      // Afegir les classes perdudes fusionant amb les existents
      const classRegex = /className="([^"]*)"/;
      const match = originalLine.match(classRegex);
      if (match) {
        const existingClasses = match[1];
        const merged = mergeClasses(existingClasses, change.removedClass);
        modified[idx] = originalLine.replace(classRegex, `className="${merged}"`);
        applied++;
      }
    } else {
      // Inserir className just després del tag (abans d'altres atributs o del tancament '>')
      // Posició on inserir: després del nom del tag, abans del primer espai o '>'
      const insertPos = originalLine.indexOf(tagStart) + tagStart.length;
      const before = originalLine.substring(0, insertPos);
      const after = originalLine.substring(insertPos);
      // Afegim espai i className
      modified[idx] = `${before} className="${change.removedClass}"${after}`;
      applied++;
    }
  }

  if (applied > 0) {
    const newContent = modified.join('\n');
    if (dryRun) {
      console.log(`\n[DRY RUN] Canvis proposats per a ${filePath}:`);
      console.log('---');
      const diff = require('diff');
      const patch = diff.createPatch(filePath, originalContent, newContent);
      console.log(patch);
    } else {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ ${applied} classe(s) trasplantada(es) a ${filePath}`);
    }
  }
}

// ------------------------------------------------------------------
// 4. Funció auxiliar per fusionar classes (evitar duplicats)
// ------------------------------------------------------------------
function mergeClasses(existing, newOnes) {
  const existingSet = new Set(existing.split(/\s+/).filter(Boolean));
  const newSet = newOnes.split(/\s+/).filter(Boolean);
  for (const cls of newSet) {
    existingSet.add(cls);
  }
  return Array.from(existingSet).join(' ');
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------
(async () => {
  console.log('🔍 Buscant fitxers modificats al darrer commit...');
  const files = getModifiedJsxFiles();
  if (files.length === 0) {
    console.log('ℹ️ No hi ha fitxers JSX/TSX modificats.');
    return;
  }
  console.log(`📄 Fitxers a analitzar: ${files.length}`);

  console.log('📋 Parsejant diff per trobar classes perdudes...');
  const transplantData = parseDiffForRemovedDivs();

  if (transplantData.size === 0) {
    console.log('✨ Cap div amb className eliminat trobat. La façana no necessita trasplantament automàtic.');
    return;
  }

  console.log(`💉 Es trasplantaran classes en ${transplantData.size} fitxers.`);
  if (DRY_RUN) console.log('🧪 MODE DRY-RUN: es mostraran els canvis sense modificar fitxers.');

  for (const [filePath, changes] of transplantData.entries()) {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ El fitxer ${filePath} no existeix al HEAD actual. Es salta.`);
      continue;
    }
    applyTransplants(filePath, changes, DRY_RUN);
  }

  if (!DRY_RUN) {
    console.log('\n🚜 Trasplantament completat. Revisa els canvis amb "git diff" i fes commit si tot està bé.');
  } else {
    console.log('\n🔎 Revisa els diffs anteriors. Per aplicar, executa sense --dry-run.');
  }
})();
