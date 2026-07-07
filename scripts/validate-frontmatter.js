const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '../_wiki_de_poble');
let errors = 0;

function validateDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'public', 'assets'].includes(file)) {
        validateDir(fullPath);
      }
    } else if (fullPath.endsWith('.md')) {
      validateFile(fullPath);
    }
  }
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('---')) {
    // Si no té frontmatter, ho ignorem per ara, 
    // però podem endurir la regla en el futur.
    return; 
  }
  
  const endOfFrontmatter = content.indexOf('---', 3);
  if (endOfFrontmatter === -1) {
    console.error(`❌ Error en Frontmatter: Tancament '---' no trobat a ${filePath}`);
    errors++;
  }
}

console.log('🔍 Iniciant validació de frontmatter (Pedra Seca)...');
validateDir(KNOWLEDGE_DIR);

if (errors > 0) {
  console.error(`💥 Validació fallida: ${errors} errors trobats.`);
  process.exit(1);
} else {
  console.log('✅ Frontmatter vàlid. Llest per a compilar.');
}
