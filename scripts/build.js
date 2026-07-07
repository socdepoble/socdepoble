const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '../_wiki_de_poble');
const OUTPUT_DIR = path.join(__dirname, '../public/soc_de_poble/search');
const CHUNK_SIZE = 500; // Màxim de documents per shard

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const documents = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'public', 'assets'].includes(file)) {
        scanDir(fullPath);
      }
    } else if (fullPath.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const relativePath = path.relative(KNOWLEDGE_DIR, fullPath);
      
      // Extraure títol del markdown (# Títol o el nom del fitxer)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
      
      documents.push({
        id: relativePath,
        title,
        content: content.replace(/^---[\s\S]*?---/, '').trim().substring(0, 800), // Fragment per a cerca
        path: relativePath
      });
    }
  }
}

console.log('🚜 Extraient coneixement de la DB local...');
scanDir(KNOWLEDGE_DIR);

const manifest = {
  version: Date.now().toString(),
  shards: []
};

// Crear chunks (shards) per a no ofegar l'A10 amb JSONs gegants
for (let i = 0; i < documents.length; i += CHUNK_SIZE) {
  const chunk = documents.slice(i, i + CHUNK_SIZE);
  const shardName = `search-${String(i / CHUNK_SIZE).padStart(2, '0')}.json`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, shardName), JSON.stringify(chunk));
  manifest.shards.push(shardName);
}

// Escriure el manifest per a la descàrrega indexada
fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`✅ Build completat: Generats ${manifest.shards.length} shards per a ${documents.length} documents.`);
