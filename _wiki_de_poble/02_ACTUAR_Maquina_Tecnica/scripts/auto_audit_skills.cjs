// _wiki_de_poble/scripts/auto_audit_skills.cjs
const fs = require('fs/promises');
const path = require('path');
const url = require('url');

const WIKI_DIR = path.join(__dirname, '..');
const SKILLS_DIR = path.join(WIKI_DIR, '05_skills_ia');
const INDEX_FILE = path.join(SKILLS_DIR, 'index_trellat.md');
const TERMODINAMIC_REGEX = /^\d{6}_\d{4}_[A-Z]+_[a-z0-9_]+(\.[a-z0-9]+)?$/i;
const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET'];

// Funció per trobar carpetes buides
async function findEmptyDirs(dir) {
  const emptyDirs = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      const subEntries = await fs.readdir(fullPath).catch(() => []);
      if (subEntries.length === 0) {
        emptyDirs.push(fullPath);
      } else {
        emptyDirs.push(...(await findEmptyDirs(fullPath)));
      }
    }
  }
  return emptyDirs;
}

// Funció per reconstruir l'índex
async function rebuildIndex() {
  let indexContent = [
    '# Índex Trellat de Skills (Generat Automàticament)',
    `> *Generat el: ${new Date().toISOString().slice(0, 10)}*`,
    '',
    '## 📂 Estructura de Carpetes',
    ''
  ];

  const dirs = (await fs.readdir(SKILLS_DIR, { withFileTypes: true }))
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const dir of dirs) {
    const dirPath = path.join(SKILLS_DIR, dir.name);
    const files = (await fs.readdir(dirPath))
      .filter(file => file.endsWith('.md'))
      .sort();

    if (files.length > 0) {
      indexContent.push(`### ${dir.name}`);
      indexContent.push('');
      for (const file of files) {
        const filePath = path.join(dir.name, file);
        const displayName = file.replace('.md', '').replace(/_/g, ' ');
        const isValid = TERMODINAMIC_REGEX.test(file);
        const status = isValid ? '✅' : '❌';
        indexContent.push(`- ${status} [${displayName}](${filePath})`);
      }
      indexContent.push('');
    }
  }

  // Fitxers a l'arrel
  const rootFiles = (await fs.readdir(SKILLS_DIR))
    .filter(file => file.endsWith('.md') && !file.startsWith('index_'))
    .sort();

  if (rootFiles.length > 0) {
    indexContent.push('### 📄 Fitxers a l\'Arrel (Reubicar!)');
    indexContent.push('');
    for (const file of rootFiles) {
      const isValid = TERMODINAMIC_REGEX.test(file);
      const status = isValid ? '✅' : '❌';
      indexContent.push(`- ${status} [${file.replace('.md', '')}](${file})`);
    }
  }

  await fs.writeFile(INDEX_FILE, indexContent.join('\n'));
  console.log(`✅ Índex reconstruït: ${INDEX_FILE}`);
}

// Funció principal
async function main() {
  const args = process.argv.slice(2);
  const clean = args.includes('--clean');
  const rebuildIndexFlag = args.includes('--rebuild-index');

  if (clean) {
    const emptyDirs = await findEmptyDirs(WIKI_DIR);
    if (emptyDirs.length > 0) {
      console.log(`⚠️  S'han trobat ${emptyDirs.length} carpetes buides:`);
      emptyDirs.forEach(dir => console.log(`   - ${dir}`));
      console.log('💡 Executa amb `--clean --force` per esborrar-les.');
      if (args.includes('--force')) {
        for (const dir of emptyDirs) {
          await fs.rmdir(dir);
          console.log(`   ✅ Esborrada: ${dir}`);
        }
      }
    } else {
      console.log('✅ No hi ha carpetes buides.');
    }
  }

  if (rebuildIndexFlag) {
    await rebuildIndex();
  }
}

main().catch(console.error);
