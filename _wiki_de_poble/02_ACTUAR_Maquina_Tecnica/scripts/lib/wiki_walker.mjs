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

/**
 * @param {string} rootDir
 * @returns {Promise<{allEntries: Array, mdDocs: Array, rootLevelEntries: Array}>}
 */
export async function buildWikiIndex(rootDir) {
  const allEntries = [];
  const mdDocs = [];

  const rootLevelEntries = (await fs.readdir(rootDir, { withFileTypes: true }))
    .map(d => ({ name: d.name, isDirectory: d.isDirectory() }));

  async function walk(dir) {
    let items;
    try {
      items = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const it of items) {
      if (EXEMPT_DIR_SEGMENTS.has(it.name)) continue;
      const fullPath = path.join(dir, it.name);
      const relPath = path.relative(rootDir, fullPath);

      if (it.isDirectory()) {
        allEntries.push({ type: 'dir', fullPath, relPath, name: it.name });
        await walk(fullPath);
      } else {
        allEntries.push({ type: 'file', fullPath, relPath, name: it.name });
        if (it.name.endsWith('.md')) {
          let content = '';
          try {
            content = await fs.readFile(fullPath, 'utf8');
          } catch {
            content = '';
          }
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
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) {
      fm[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return fm;
}
