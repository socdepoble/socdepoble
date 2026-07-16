// _wiki_de_poble/scripts/enforce_termodinamic.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WIKI_DIR = path.join(__dirname, '..');
const TERMODINAMIC_REGEX = /^\d{6}_\d{4}_[A-Z]+_[a-z0-9_]+(\.[a-z0-9]+)?$/i;
const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET'];

// Funció per validar el nom
function isValidTermodinamicName(filename) {
  return TERMODINAMIC_REGEX.test(filename);
}

// Funció per generar un nom vàlid
function generateTermodinamicName(originalName, content = '') {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 16).replace(/[-:]/g, '').replace('T', '_');
  const ext = path.extname(originalName).toLowerCase();

  // Extreure categoria i títol del contingut o del nom original
  let category = 'DOC'; // Per defecte
  let title = path.basename(originalName, ext).replace(/\s+/g, '_').toLowerCase();

  // Intentar detectar categoria des del contingut (ex: si conté "SKILL:")
  if (content.includes('SKILL:')) category = 'SKILL';
  if (content.includes('ACTA:')) category = 'ACTA';
  if (content.includes('REPORT:')) category = 'REPORT';

  // Si la categoria no és vàlida, usar DOC
  if (!CATEGORIES.includes(category)) category = 'DOC';

  return `${datePart}_${category}_${title}${ext}`;
}

// Escanejar i corregir
function enforceDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let fixedFiles = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Ignore node_modules, .git, .obsidian, .agents, etc
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      fixedFiles += enforceDirectory(fullPath);
    } else if (entry.isFile() && !isValidTermodinamicName(entry.name)) {
      // Ignore some special files
      if (['AGENTS.md', 'README.md', 'package.json', 'escriptura-protegida.js'].includes(entry.name) || entry.name.endsWith('.js') || entry.name.endsWith('.cjs') || entry.name.endsWith('.sh')) {
        continue; // Only enforce on wiki documents
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      const newName = generateTermodinamicName(entry.name, content);
      const newPath = path.join(dir, newName);

      console.log(`⚠️  Fitxer no termodinàmic: ${fullPath}`);
      console.log(`   → Proposta: ${newName}`);

      // Bloquejar l'accés fins que es renombri
      fs.chmodSync(fullPath, 0o000); // Treure permisos de lectura/escriptura
      console.log(`   ❌ Accés bloquejat. Executa: mv "${fullPath}" "${newPath}"`);

      fixedFiles++;
    }
  }
  return fixedFiles;
}

// Executar
console.log('🔍 Escanejant fitxers no termodinàmics...');
const fixed = enforceDirectory(WIKI_DIR);
if (fixed === 0) {
  console.log('✅ Tots els fitxers compleixen el format termodinàmic.');
} else {
  console.log(`⚠️  S'han trobat ${fixed} fitxers no termodinàmics. Executa les comandes de renombratge.`);
}
