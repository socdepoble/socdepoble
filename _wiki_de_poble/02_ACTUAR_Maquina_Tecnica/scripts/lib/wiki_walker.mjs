/**
 * wiki_walker.mjs
 * Recorre l'arbre de la Wiki UNA sola vegada i entrega un índex en memòria
 * a tots els auditors (audit_estructura, contradiction_engine, wiki_integritat).
 * Abans, cada script feia el seu propi fs.readdirSync recursiu -> 3x I/O
 * sobre el mateix arbre en cada commit. Açò és directament la Llei 4
 * (Trellat / Zero Overhead) aplicada al propi tooling, no només al producte.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { EXEMPT_DIR_SEGMENTS } from './termodinamic.mjs';
import { parseFrontmatter as parseSharedFrontmatter } from './frontmatter.mjs';

/**
 * @param {string} rootDir
 * @returns {Promise<{allEntries: Array, mdDocs: Array, rootLevelEntries: Array}>}
 */
export async function buildWikiIndex(rootDir) {
  const root = await fs.realpath(rootDir);
  const allEntries = [];
  const mdDocs = [];

  const rootItems = await fs.readdir(root, { withFileTypes: true });
  for (const item of rootItems) {
    if (item.isSymbolicLink()) throw new Error(`Symlink no admés a la Wiki: ${item.name}`);
  }
  const rootLevelEntries = rootItems.map(d => ({ name: d.name, isDirectory: d.isDirectory() }));

  async function walk(dir) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const it of items) {
      if (EXEMPT_DIR_SEGMENTS.has(it.name)) continue;
      const fullPath = path.join(dir, it.name);
      const relPath = path.relative(root, fullPath);
      if (it.isSymbolicLink()) throw new Error(`Symlink no admés a la Wiki: ${relPath}`);

      if (it.isDirectory()) {
        allEntries.push({ type: 'dir', fullPath, relPath, name: it.name });
        await walk(fullPath);
      } else {
        allEntries.push({ type: 'file', fullPath, relPath, name: it.name });
        if (it.name.endsWith('.md')) {
          const content = await fs.readFile(fullPath, 'utf8');
          mdDocs.push({ fullPath, relPath, name: it.name, content });
        }
      }
    }
  }

  await walk(rootDir);
  return { allEntries, mdDocs, rootLevelEntries };
}

/**
 * Parseja el frontmatter YAML de manera mínima (sense dependència externa,
 * Pedra Seca / zero-npm), suficient per a camps pla clau: valor.
 */
export function parseFrontmatter(content) {
  return parseSharedFrontmatter(content).data;
}
