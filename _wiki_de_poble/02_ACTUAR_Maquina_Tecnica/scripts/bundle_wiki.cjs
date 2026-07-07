#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const ROOT = process.argv.includes('--root') ? process.argv[process.argv.indexOf('--root') + 1] : '.';
const OUT = path.join(ROOT, '04_ARXIU_Documents_Historics', '260705_0630_BUNDLE_Wiki_Completa.md');

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
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.') && e.name !== 'actes_arxivades') {
        return trobarMarkdown(fullPath);
      }
      if (e.name.endsWith('.md')) return [fullPath];
      return [];
    })
  );
  return resultats.flat();
}

(async () => {
  const fitxers = await trobarMarkdown(ROOT);
  let bundleContent = '# 📦 BUNDLE COMPLET DE LA WIKI SÓC DE POBLE\n\n';
  bundleContent += '> Aquest document conté el bolcat complet de tots els fitxers canònics de la Wiki (excloent actes arxivades antigues per no rebentar el context).\n\n';
  bundleContent += '---\n\n';

  for (const fitxer of fitxers) {
    if (fitxer === OUT || fitxer.includes('BUNDLE')) continue;
    const contingut = await fs.readFile(fitxer, 'utf8');
    const relPath = path.relative(ROOT, fitxer);
    bundleContent += `## 📄 FITXER: ${relPath}\n\`\`\`markdown\n${contingut}\n\`\`\`\n\n---\n\n`;
  }

  await fs.writeFile(OUT, bundleContent);
  console.log(`✅ Bundle generat a: ${OUT}`);
})();
