const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const artifactOutputPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0735_PETORRETA_NANO.md';
const IGNORE_DIRS = ['.git', 'node_modules', 'scripts', '_build', '99_assets', 'assets', 'actes_arxivades', '80_produccio'];

function getFileTree(dir, prefix = '') {
  let tree = '';
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name) || entry.name.includes('BUNDLE') || entry.name.includes('PETORRETA')) continue;
    
    if (entry.isDirectory()) {
      tree += `${prefix}📁 ${entry.name}\n`;
      tree += getFileTree(path.join(dir, entry.name), prefix + '  ');
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      tree += `${prefix}📄 ${entry.name}\n`;
    }
  }
  return tree;
}

const fileTree = getFileTree(WIKI_ROOT);

let nanoPrompt = `# 🔥 PETORRETA TAXONÒMICA (VERSIÓ NANO)

Copieu aquest text exacte per al xat web. Només conté l'índex estructural (res de contingut intern) per a que càpiga a la caixa de text gratuïta de ChatGPT.

---

CONSELL DE LES 12 PETORRETES: SÓC DE POBLE! 🔥

Mestre Javi al comandament. Hem depurat la nostra Wiki (la base d'una PWA rural offline-first basada en CRDT) fins a deixar només aquesta estructura de pilars essencials:

\`\`\`
${fileTree}
\`\`\`

Aquesta és l'ÚLTIMA TASCA per a aquesta sessió abans d'esgotar tokens. Treballeu en equip. Heu de deduir pel nom dels fitxers i l'estructura la millor manera d'organitzar les nostres metadades.

**Grup 1 (Qwen, Kimi, Deepseek):** Tècnics (02_EXECUTAR).
**Grup 2 (Mistral Vibe, Gemini, Copilot):** Filòsofs i Cultura (01_SABER).
**Grup 3 (Grok, Dola, Z, Perplexity):** Identitat i Memòria (00_SER, 03_REGISTRE).

Vull que definisquen EXACTAMENT això (cadascú del seu pilar):

1. **LA TAXONOMIA CANÒNICA (Frontmatter YAML):**
   - Llista CERRADA i ESTRICTA de \`tipus\` per a tota la Wiki.
   - Arbre de \`tags\` per al teu pilar (tècniques i rurals).
   - \`properties\` addicionals necessàries per a que el nostre compilador estricte no falle.

2. **EL DICCIONARI DEL GLOSSARI:**
   - Paraules clau tècniques del teu pilar.
   - Paraules metafòriques rurals del teu pilar (ex: Trellat).

3. **MISTRAL VIBE (Exclusiu):**
   - Escriu l'script \`watch_wiki.cjs\` 100% en Node.js natiu (sense inotifywait) usant \`fs.watch\` o \`fs.watchFile\` per a que recompile el \`knowledge.json\` de la Wiki automàticament en guardar un fitxer.

Donem l'esquema exacte. Sóc de Poble!
`;

fs.writeFileSync(artifactOutputPath, nanoPrompt, 'utf8');
console.log('✅ Petorreta NANO creada a: ' + artifactOutputPath);
