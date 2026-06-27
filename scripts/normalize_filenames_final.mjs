import fs from 'fs/promises';
import path from 'path';

const WIKI_DIR = path.resolve(process.cwd(), '_wiki_de_poble');

const renameMap = {
  "IAIA MarIA": "iaia_maria",
  "Antigravity": "antigravity",
  "01_Psiquiatria_Forense_Integral": "psiquiatria_forense_integral",
  "Registre d'Automillora": "registre_automillora",
  "POLITICA_LEGACY": "politica_legacy",
  "Governanca_i_Manaments": "governanca_i_manaments",
  "POLITICA_PRIMACIA_CANONICA": "politica_primacia_canonica",
  "Índex de Salut": "index_de_salut",
  "Ment_Colmena_Integral": "ment_colmena_integral",
  "Sistema ACT": "sistema_act",
  "Pedra Seca": "pedra_seca",
  "Arquitectura V19": "arquitectura_v19",
  "AUDITORIA": "auditoria",
  "PERFORMANCE": "performance",
  "RESILIENCIA": "resiliencia",
  "FULL_DE_RUTA": "full_de_ruta",
  "Regla de Capçalera": "regla_de_capcalera",
  "Diccionari Trellat": "diccionari_trellat",
  "El_Trellat": "el_trellat"
};

async function processWiki() {
  async function updateLinksInFile(filePath) {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;

    for (const [oldBase, newBase] of Object.entries(renameMap)) {
      // Escape oldBase for regex (handle spaces, apostrophes)
      const escapedOldBase = oldBase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Match [[oldBase]] or [[oldBase|Alias]]
      const regex = new RegExp(`\\[\\[${escapedOldBase}(?:\\|([^\\]]+))?\\]\\]`, 'g');
      const newContent = content.replace(regex, (match, p1) => {
        if (!p1 || p1 === newBase) {
          // If no alias, use the old name as alias so it still looks good to humans!
          return `[[${newBase}|${oldBase}]]`;
        }
        return `[[${newBase}|${p1}]]`;
      });

      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`🔗 Updated links in: ${path.relative(WIKI_DIR, filePath)}`);
    }
  }

  async function walkDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.obsidian') continue;
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        await updateLinksInFile(fullPath);
        
        // Check if file itself needs renaming
        const currentBase = path.basename(entry.name, '.md');
        if (renameMap[currentBase]) {
          const newPath = path.join(dir, `${renameMap[currentBase]}.md`);
          await fs.rename(fullPath, newPath);
          console.log(`✅ Renamed: ${currentBase} -> ${renameMap[currentBase]}`);
        }
      }
    }
  }

  await walkDir(WIKI_DIR);
}

processWiki().then(() => console.log('🚀 Normalized all filenames and links!')).catch(console.error);
