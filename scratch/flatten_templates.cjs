const fs = require('fs');
const path = require('path');

const ARTIFACT_PATH = '/Users/javillinares/.gemini/antigravity-ide/brain/48f5940e-c40d-491c-956f-d4a42203cc3c/flat_templates_audit.md';
const PROJECT_ROOT = '/Users/javillinares/Documents/Antigravity/Sóc de Poble';

const FILES_TO_FLATTEN = [
  'src/components/ui/UniversalCard.jsx',
  'src/pages/public/UniversalPage.jsx',
  'src/pages/public/components/UniversalPageContent.jsx',
  'src/components/universal/UniversalShell.jsx'
];

let markdown = `# Mapa Pla de les Plantilles Universals (Auditoria Trellat)\n\n`;
markdown += `Aquest document conté el codi complet de les plantilles base per auditar els fantasmes i la connexió Card <-> Pàgina.\n\n`;

for (const relPath of FILES_TO_FLATTEN) {
  const fullPath = path.join(PROJECT_ROOT, relPath);
  markdown += `## ${path.basename(relPath)}\n`;
  markdown += `\`Path: ${relPath}\`\n\n`;
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    markdown += `\`\`\`jsx\n${content}\n\`\`\`\n\n`;
  } else {
    markdown += `> ⚠️ **Error**: Fitxer no trobat.\n\n`;
  }
}

fs.writeFileSync(ARTIFACT_PATH, markdown, 'utf8');
console.log('Artifact generat correctament.');
