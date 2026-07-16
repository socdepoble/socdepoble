#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = path.resolve(__dirname, '../../');

export async function purgeEmptyNodes(wikiDir = WIKI_DIR) {
  void wikiDir;
  throw new Error('Script desactivat: esborrar buits directament no és segur. Usa autoneteja_wiki.mjs --quarantine-empty amb pla, Reflex i manifest reversible.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  purgeEmptyNodes().catch(err => {
    console.error("❌ Error purgant nodes:", err);
    process.exit(1);
  });
}
