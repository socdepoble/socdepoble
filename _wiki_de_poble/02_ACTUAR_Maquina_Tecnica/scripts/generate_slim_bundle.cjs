const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0705_PROMPT_Petorreta_Taxonomica_i_Glossari.md';
const artifactOutputPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0730_PETORRETA_SLIM.md';

const IGNORE_DIRS = ['.git', 'node_modules', 'scripts', '_build', '99_assets', 'assets', 'actes_arxivades', '80_produccio'];

function getAllMarkdownFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('BUNDLE') && !entry.name.includes('PETORRETA')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllMarkdownFiles(WIKI_ROOT);
let bundleContent = `# BUNDLE DE LA WIKI SÓC DE POBLE (VERSIÓ EXTREMA SLIM)\nGenerat: ${new Date().toISOString()}\n\n`;
bundleContent += `Aquest fitxer conté el nucli de la base de coneixement. S'han exclòs les actes, i TOTS ELS FITXERS S'HAN TRUNCAT A LES PRIMERES 35 LÍNIES per reduir tokens (només per extreure frontmatter i vocabulari).\n\n`;
bundleContent += `========================================================================\n\n`;

for (const file of files) {
  const relPath = path.relative(WIKI_ROOT, file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const slimContent = lines.slice(0, 35).join('\n');
  
  bundleContent += `\n\n------------------------------------------------------------------------\n`;
  bundleContent += `📂 FITXER: ${relPath}\n`;
  bundleContent += `------------------------------------------------------------------------\n\n`;
  bundleContent += slimContent;
  if (lines.length > 35) {
    bundleContent += `\n\n[... CONTINGUT TRUNCAT PER ESTALVIAR TOKENS ...]`;
  }
}

const promptContent = fs.readFileSync(promptPath, 'utf8');
const combinedContent = promptContent + '\n\n' + bundleContent;

// No cal ArtifactMetadata, però ho escrivim
fs.writeFileSync(artifactOutputPath, combinedContent, 'utf8');
console.log('✅ Petorreta Slim Extrema creada a: ' + artifactOutputPath);
