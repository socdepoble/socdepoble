#!/usr/bin/env node
/**
 * orphan_linker.mjs
 * El "Gos Pastor d'Enllaços" (Impuls Nerviós).
 * Automàticament cerca fitxers Markdown dins dels Pilars Vigents
 * que pateixen d'aïllament cognitiu (1 enllaç o menys) i els
 * connecta a l'arrel de l'Índex per tal de curar "l'esquizofrènia algorísmica".
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWikiIndex } from './lib/wiki_walker.mjs';
import { PILARS_VIGENTS } from './audit_estructura.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = path.resolve(__dirname, '../../');

export async function linkOrphans(wikiDir = WIKI_DIR) {
  const { mdDocs } = await buildWikiIndex(wikiDir);
  let linkedCount = 0;

  for (const doc of mdDocs) {
    const topDir = doc.relPath.split(path.sep)[0];
    if (!PILARS_VIGENTS.includes(topDir)) continue;

    if (doc.content.trim().length === 0) continue;

    const links = (doc.content.match(/\[\[(.*?)\]\]/g) || []).length;
    if (links <= 1) {
      // Connectar el node orfe
      const linkBlock = `\n\n---\n**Connexions del Node:**\n- [[00_INDEX]]\n`;
      const newContent = doc.content + linkBlock;
      await fs.writeFile(doc.fullPath, newContent, 'utf8');
      console.log(`🔗 [GOS PASTOR] S'ha enllaçat el node orfe: ${doc.relPath}`);
      linkedCount++;
    }
  }

  if (linkedCount === 0) {
    console.log("✅ [GOS PASTOR] Xarxa neuronal intacta. Cap node orfe trobat.");
  } else {
    console.log(`✅ [GOS PASTOR] Operació completada. ${linkedCount} nodes han sigut integrats a l'Índex.`);
  }
  return linkedCount;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  linkOrphans().catch(err => {
    console.error("❌ [GOS PASTOR] Error crític curant nodes:", err);
    process.exit(1);
  });
}
