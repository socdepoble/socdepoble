import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanEmptyFiles(dir) {
  let count = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.obsidian') continue;
    
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await cleanEmptyFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.trim() === '') {
        await fs.unlink(fullPath);
        console.log(`🧹 Esborrat fantasma: ${path.relative(process.cwd(), fullPath)}`);
        count++;
      }
    }
  }
  return count;
}

const targetDir = path.resolve(process.cwd(), '_wiki_de_poble');
console.log(`🌿 Iniciant esporgadora de fantasmes a: ${targetDir}`);

cleanEmptyFiles(targetDir).then((count) => {
  if (count === 0) {
    console.log("✅ Cap arxiu fantasma trobat. El bancal està net.");
  } else {
    console.log(`✅ Neteja completada. S'han esborrat ${count} arxius buits.`);
  }
}).catch(err => {
  console.error("❌ Error passant l'escombra:", err);
});
