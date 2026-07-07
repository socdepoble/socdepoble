// _wiki_de_poble/scripts/escriptori_to_wiki.js
const fs = require('fs');
const path = require('path');

const ESCRIPTORI_DIR = path.join(__dirname, '..', 'escriptori');
const WIKI_DIR = path.join(__dirname, '..');
const TERMODINAMIC_REGEX = /^\d{6}_\d{4}_[A-Z]+_[a-z0-9_]+(\.[a-z0-9]+)?$/i;
const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET'];

// Funció per generar nom termodinàmic
function generateTermodinamicName(originalName, content) {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 16).replace(/[-:]/g, '').replace('T', '_');
  const ext = path.extname(originalName).toLowerCase();

  let category = 'DOC';
  let title = path.basename(originalName, ext).replace(/\s+/g, '_').toLowerCase();

  if (content.includes('ACTA:')) category = 'ACTA';
  if (content.includes('SKILL:')) category = 'SKILL';
  if (content.includes('REPORT:')) category = 'REPORT';

  if (!CATEGORIES.includes(category)) category = 'DOC';

  return `${datePart}_${category}_${title}${ext}`;
}

// Funció per determinar la carpeta destí
function getDestinationDir(filename) {
  if (filename.includes('ACTA')) return path.join(WIKI_DIR, '90_actes');
  if (filename.includes('SKILL')) return path.join(WIKI_DIR, '05_skills_ia');
  if (filename.includes('DOC')) return path.join(WIKI_DIR, '01_SABER_Cultura_Coneixement');
  return path.join(WIKI_DIR, '00_SER_Brain_Identitat'); // Per defecte
}

// Processar l'escriptori
async function processEscriptori() {
  if (!fs.existsSync(ESCRIPTORI_DIR)) {
    console.log('⚠️  Carpeta `escriptori/` no existeix.');
    return;
  }

  const files = fs.readdirSync(ESCRIPTORI_DIR);
  if (files.length === 0) {
    console.log('✅ Escriptori buit.');
    return;
  }

  console.log(`🔍 Processant ${files.length} fitxers a l'escriptori...`);

  for (const file of files) {
    const oldPath = path.join(ESCRIPTORI_DIR, file);
    const content = fs.readFileSync(oldPath, 'utf-8');
    const newName = generateTermodinamicName(file, content);
    const destDir = getDestinationDir(newName);
    const newPath = path.join(destDir, newName);

    // Crear la carpeta si no existeix
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Moure el fitxer
    fs.renameSync(oldPath, newPath);
    console.log(`   ✅ Mogut: ${file} → ${newName} (a ${destDir})`);
  }

  // Reconstruir índexs
  console.log('🔄 Reconstruint índexs...');
  const { execSync } = require('child_process');
  execSync('node scripts/auto_audit_skills.cjs --rebuild-index', { cwd: WIKI_DIR, stdio: 'inherit' });

  // Netejar l'escriptori
  fs.rmdirSync(ESCRIPTORI_DIR, { recursive: true });
  fs.mkdirSync(ESCRIPTORI_DIR);
  console.log('✅ Escriptori netejat i destil·lat.');
}

// Executar
processEscriptori().catch(console.error);
