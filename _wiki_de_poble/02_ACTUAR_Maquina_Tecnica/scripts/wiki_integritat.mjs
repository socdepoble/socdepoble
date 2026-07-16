#!/usr/bin/env node
/**
 * wiki_integritat.mjs  (abans: wiki-integrity.cjs)
 * ROOT HYGIENE: detecta i reubica fitxers .md solts a l'arrel de la Wiki.
 *
 * Canvis:
 * 1. Renombrat sense guió. L'original ('wiki-integrity.cjs') violava el
 *    seu propi regex de nom (^[a-z0-9_.]+$ no admet '-'): el Gos Pastor
 *    es mossegava la pota ell mateix.
 * 2. .mjs pur (abans .cjs amb require, ara import — coherent amb la resta
 *    del bundle si el projecte és "type": "module").
 * 3. ORPHAN_DIR apunta al pilar 04_ARXIU_Documents_Historics (Big Bang de
 *    4 pilars operatius + 2 zones). Abans col·lidia numèricament amb 04_arquitectura_disseny,
 *    que ja no existeix amb eixe nom.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getTimestamp } from './lib/termodinamic.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const ORPHAN_DIR = path.join(ROOT, '04_ARXIU_Documents_Historics', 'bancal_actiu');
const ALLOWED_ROOT_FILES = new Set(['README.md', '00_index.md', '.gitignore', '.DS_Store']);

export async function auditRootHygiene(rootDir = ROOT, orphanDir = ORPHAN_DIR, { dryRun = true } = {}) {
  if (!dryRun) {
    throw new Error('SDP-LOCK: la reubicació directa està retirada; usa una migració amb pla, Reflex i rollback.');
  }
  const elements = await fs.readdir(rootDir, { withFileTypes: true });
  let orphansMoved = 0;

  for (const el of elements) {
    if (el.isFile() && el.name.endsWith('.md') && !ALLOWED_ROOT_FILES.has(el.name)) {
      const fullPath = path.join(rootDir, el.name);
      const timestamp = getTimestamp();
      const newName = `${timestamp}_ACTA_Orfe_${el.name.replace(/\.md$/, '').replace(/[^A-Za-z0-9_]/g, '_')}.md`;
      const newPath = path.join(orphanDir, newName);

      console.log(`[DRY-RUN] Es mouria: ${el.name}  ->  ${path.relative(rootDir, newPath)}`);
      orphansMoved++;
    }
  }

  if (orphansMoved === 0) {
    console.log("[OK] Root Hygiene: Cap fitxer solt detectat a l'arrel.");
  }
  return orphansMoved;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.includes('--write')) {
    console.error('SDP-LOCK: --write retirat; auditoria de només lectura.');
    process.exitCode = 2;
  } else {
    await auditRootHygiene(ROOT, ORPHAN_DIR, { dryRun: true });
  }
}
