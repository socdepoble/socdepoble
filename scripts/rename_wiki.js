import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WIKI_DIR = path.resolve(process.cwd(), '_wiki_de_poble');

const renames = [
  { old: '01_identitat_iaia/00_iaia_maria_presentacio.md', new: '01_identitat_iaia/IAIA MarIA.md', oldBase: '00_iaia_maria_presentacio', newBase: 'IAIA MarIA' },
  { old: '01_identitat_iaia/perfil_psiquiatric.md', new: '01_identitat_iaia/Perfil Psiquiàtric.md', oldBase: 'perfil_psiquiatric', newBase: 'Perfil Psiquiàtric' },
  { old: '01_identitat_iaia/psiquiatria_maquina.md', new: '01_identitat_iaia/Psiquiatria de la Màquina.md', oldBase: 'psiquiatria_maquina', newBase: 'Psiquiatria de la Màquina' },
  { old: "01_identitat_iaia/registre_automillora.md", new: "01_identitat_iaia/Registre d'Automillora.md", oldBase: "registre_automillora", newBase: "Registre d'Automillora" },
  
  { old: '02_filosofia_sosp/10_manaments.md', new: '02_filosofia_sosp/Els 10 Manaments.md', oldBase: '10_manaments', newBase: 'Els 10 Manaments' },
  { old: '02_filosofia_sosp/filosofia_rituals.md', new: '02_filosofia_sosp/Trellat i Filosofia.md', oldBase: 'filosofia_rituals', newBase: 'Trellat i Filosofia' },
  { old: '02_filosofia_sosp/regla_capcalera.md', new: '02_filosofia_sosp/Regla de Capçalera.md', oldBase: 'regla_capcalera', newBase: 'Regla de Capçalera' },
  
  { old: '03_arquitectura_disseny/sistema_disseny.md', new: '03_arquitectura_disseny/Pedra Seca.md', oldBase: 'sistema_disseny', newBase: 'Pedra Seca' },
  { old: '03_arquitectura_disseny/arquitectura_act.md', new: '03_arquitectura_disseny/Sistema ACT.md', oldBase: 'arquitectura_act', newBase: 'Sistema ACT' },
  { old: '03_arquitectura_disseny/01_arquitectura_v19.md', new: '03_arquitectura_disseny/Arquitectura V19.md', oldBase: '01_arquitectura_v19', newBase: 'Arquitectura V19' },
  
  { old: '04_actes_marmota/acta_marmota.md', new: '04_actes_marmota/Acta de la Marmota.md', oldBase: 'acta_marmota', newBase: 'Acta de la Marmota' },
  
  { old: '05_skills_colmena/ment_colmena_atrc.md', new: '05_skills_colmena/Ment Colmena.md', oldBase: 'ment_colmena_atrc', newBase: 'Ment Colmena' }
];

const customLinkReplacements = [
  { regex: /\[\[Les 11 Petorretes\]\]/g, replacement: '[[Les Petorretes]]' },
  { regex: /\[\[Les 11 Petorretas\]\]/g, replacement: '[[Les Petorretes]]' },
  { regex: /\[\[Consell de la Petorreta\]\]/g, replacement: '[[Les Petorretes|Consell de la Petorreta]]' }
];

async function processWiki() {
  // 1. Rename files
  for (const rename of renames) {
    const oldPath = path.join(WIKI_DIR, rename.old);
    const newPath = path.join(WIKI_DIR, rename.new);
    try {
      await fs.rename(oldPath, newPath);
      console.log(`✅ Renamed: ${rename.oldBase} -> ${rename.newBase}`);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        console.error(`❌ Failed to rename ${oldPath}:`, e);
      } else {
        console.log(`⚠️ Skip (not found): ${rename.oldPath || rename.oldBase}`);
      }
    }
  }

  // 2. Update links in all files
  async function updateLinksInDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.obsidian') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await updateLinksInDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        let content = await fs.readFile(fullPath, 'utf8');
        let modified = false;

        // Apply standard renames
        for (const rename of renames) {
          // match [[oldBase]] or [[oldBase|Alias]]
          const regex = new RegExp(`\\[\\[${rename.oldBase}(?:\\|([^\\]]+))?\\]\\]`, 'g');
          const newContent = content.replace(regex, (match, p1) => {
            if (!p1 || p1 === rename.newBase) return `[[${rename.newBase}]]`;
            return `[[${rename.newBase}|${p1}]]`;
          });
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }

        // Apply custom replacements
        for (const custom of customLinkReplacements) {
          const newContent = content.replace(custom.regex, custom.replacement);
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }

        if (modified) {
          await fs.writeFile(fullPath, content, 'utf8');
          console.log(`🔗 Updated links in: ${path.relative(WIKI_DIR, fullPath)}`);
        }
      }
    }
  }

  await updateLinksInDir(WIKI_DIR);
}

processWiki().then(() => console.log('🚀 Procés finalitzat amb èxit!')).catch(console.error);
