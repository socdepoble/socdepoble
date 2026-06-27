import fs from 'fs/promises';
import path from 'path';

const WIKI_DIR = path.resolve(process.cwd(), '_wiki_de_poble');

async function fixLinks(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.obsidian') continue;
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await fixLinks(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      let content = await fs.readFile(fullPath, 'utf8');
      let modified = false;

      // Replace [[Trellat]] with [[el_trellat|Trellat]]
      const newContent1 = content.replace(/\[\[Trellat\]\]/g, '[[el_trellat|Trellat]]');
      if (newContent1 !== content) {
        content = newContent1;
        modified = true;
      }

      // Remove links to Acta de la Marmota
      const newContent2 = content.replace(/\[\[11_acta_marmota\|([^\]]+)\]\]/g, '$1');
      if (newContent2 !== content) {
        content = newContent2;
        modified = true;
      }
      
      const newContent3 = content.replace(/\[\[Acta de la Marmota\]\]/g, 'Acta de la Marmota');
      if (newContent3 !== content) {
        content = newContent3;
        modified = true;
      }

      if (modified) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`🔗 Fixed links in: ${path.relative(WIKI_DIR, fullPath)}`);
      }
    }
  }
}

fixLinks(WIKI_DIR).then(() => console.log('Done')).catch(console.error);
