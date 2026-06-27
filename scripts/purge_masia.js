import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WIKI_DIR = path.resolve(process.cwd(), '_wiki_de_poble');

async function replaceInDir(currentDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.obsidian') continue;
    const fullPath = path.join(currentDir, entry.name);
    
    if (entry.isDirectory()) {
      await replaceInDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      let content = await fs.readFile(fullPath, 'utf8');
      let originalContent = content;
      
      // Regles gramaticals de reemplaçament per al "Mas" en compte de "Masia"
      
      // 1. Contraccions (de la -> del)
      content = content.replace(/\bde la Masia\b/g, "del Mas");
      content = content.replace(/\bde la masia\b/g, "del mas");
      content = content.replace(/\bDe la Masia\b/g, "Del Mas");
      content = content.replace(/\ba la Masia\b/g, "al Mas");
      content = content.replace(/\ba la masia\b/g, "al mas");
      content = content.replace(/\bA la Masia\b/g, "Al Mas");

      // 2. Articles (la -> el)
      content = content.replace(/\bLa Masia\b/g, "El Mas");
      content = content.replace(/\bLa masia\b/g, "El mas");
      content = content.replace(/\bla Masia\b/g, "el Mas");
      content = content.replace(/\bla masia\b/g, "el mas");
      
      // 3. Indefinits (una -> un)
      content = content.replace(/\buna masia\b/g, "un mas");
      content = content.replace(/\bUna masia\b/g, "Un mas");
      content = content.replace(/\buna Masia\b/g, "un Mas");
      content = content.replace(/\bUna Masia\b/g, "Un Mas");

      // 4. Aïllats
      content = content.replace(/\bMasia\b/g, "Mas");
      content = content.replace(/\bmasia\b/g, "mas");
      
      if (content !== originalContent) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`✅ Purgat a: ${path.relative(WIKI_DIR, fullPath)}`);
      }
    }
  }
}

console.log('Iniciant la purga de "Masia"...');
replaceInDir(WIKI_DIR)
  .then(() => console.log('🚀 Purga completada amb èxit!'))
  .catch(console.error);
