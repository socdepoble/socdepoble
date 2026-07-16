#!/usr/bin/env node
/**
 * Inventari de Sollutia, només lectura.
 *
 * La versió antiga apuntava al projecte vell, esborrava el destí abans de
 * validar la font i no tenia rollback. La sincronització queda bloquejada fins
 * que use pla + Reflex + backup transaccional.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(SCRIPT_DIR, '../../..');
const SOURCE_DIR = process.env.SDP_SOLLUTIA_PLUGINS || path.join(process.env.HOME || '', '.gemini/config/plugins');
const DEST_DIR = path.join(PROJECT_DIR, '_wiki_de_poble/00_SER_Brain_Identitat/Sollutia');

async function findSkills(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'ca'))) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink no admés a la font Sollutia: ${fullPath}`);
    if (entry.isDirectory()) results.push(...await findSkills(fullPath));
    else if (entry.isFile() && entry.name === 'SKILL.md') results.push(fullPath);
  }
  return results;
}

export async function planSync() {
  const source = await fs.realpath(SOURCE_DIR);
  const destination = await fs.realpath(DEST_DIR);
  const skills = await findSkills(source);
  return {
    mode: 'DRY-RUN',
    source,
    destination,
    skills: skills.map((file) => ({ source: file, destination: `${path.basename(path.dirname(file)).replace(/-/g, '_')}.md` })),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.includes('--apply') || process.argv.includes('--procedeix')) {
    console.error('❌ Sync destructiu desactivat: falta pla + Reflex + backup + rollback.');
    process.exitCode = 2;
  } else {
    planSync().then((plan) => console.log(JSON.stringify(plan, null, 2))).catch((error) => {
      console.error(`❌ [SOLLUTIA] ${error.message}`);
      process.exitCode = 1;
    });
  }
}
