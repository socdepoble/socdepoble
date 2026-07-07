const fs = require('fs').promises;
const path = require('path');

const ROOT = process.argv.includes('--root') ? process.argv[process.argv.indexOf('--root') + 1] : '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
function getTrellatTimestamp() {
  const d = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const yy = d.getFullYear().toString().slice(-2);
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yy}${mm}${dd}_${hh}${min}`;
}
const OUT = path.join(ROOT, '04_ARXIU_Documents_Historics', `${getTrellatTimestamp()}_BUNDLE_Wiki_Completa.md`);

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
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.') && e.name !== '04_ARXIU_Documents_Historics') {
        return trobarMarkdown(fullPath);
      }
      if (
        e.name.endsWith('.md') ||
        e.name.endsWith('.js') ||
        e.name.endsWith('.mjs') ||
        e.name.endsWith('.cjs') ||
        e.name.endsWith('.json') ||
        e.name.endsWith('.html') ||
        e.name.endsWith('.css')
      ) return [fullPath];
      return [];
    })
  );
  return resultats.flat();
}

(async () => {
  const fitxers = await trobarMarkdown(ROOT);
  let bundleContent = '# 📦 BUNDLE COMPLET DE LA WIKI SÓC DE POBLE (ESTRUCTURAL)\n\n';
  bundleContent += '> Aquest document conté el bolcat complet de tots els fitxers canònics de la Wiki per a auditoria estructural.\n\n';
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
