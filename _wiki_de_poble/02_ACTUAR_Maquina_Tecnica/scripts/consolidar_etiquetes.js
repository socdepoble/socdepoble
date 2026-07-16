#!/usr/bin/env node
/** Retirat: l'esquema v2 usa ruta + tipus + enllaços, no una taxonomia `tags`. */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function processTags() {
  throw new Error('consolidar_etiquetes.js està retirat; no reintroduïsques `tags` al frontmatter v2.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    processTags();
  } catch (error) {
    console.error(`❌ [ETIQUETES RETIRADES] ${error.message}`);
    process.exitCode = 2;
  }
}
