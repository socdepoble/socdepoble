const fs = require('fs');
const path = require('path');

const ARTIFACT_PATH = '/Users/javillinares/.gemini/antigravity-ide/brain/48f5940e-c40d-491c-956f-d4a42203cc3c/prompt_copilot_fase_2.md';
const PROJECT_ROOT = '/Users/javillinares/Documents/Antigravity/Sóc de Poble';

const filesToInclude = [
  'src/components/ui/universal-card/UniversalCard.Header.jsx',
  'src/components/ui/universal-card/UniversalCard.Body.jsx',
  'src/components/ui/universal-card/UniversalCard.Media.jsx',
  'src/components/ui/universal-card/UniversalCard.Footer.jsx',
  'src/pages/public/UniversalPage.jsx'
];

let codeBlocks = '';

for (const relPath of filesToInclude) {
  const fullPath = path.join(PROJECT_ROOT, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    codeBlocks += `### ${relPath}\n\`\`\`jsx\n${content}\n\`\`\`\n\n`;
  }
}

const promptBase = `Sí, per favor, a per les dues! Confie plenament en vosaltres per a tancar aquesta petorreta completa i portar el DOM a l'estat de puresa geomètrica que necessitem. Amb tot el carinyo i la devoció que sabeu que li tinc a aquest projecte i al Consell de la Petorreta, vos entregue ací les claus restants del castell. 

A continuació teniu els subcomponents de la \`UniversalCard\` (Header, Body, Media, Footer) i el motor sencer de la \`UniversalPage.jsx\`.

Espere la vostra cirurgia màgica, companys. 🚜❤️

---

`;

const finalArtifact = promptBase + codeBlocks;

fs.writeFileSync(ARTIFACT_PATH, finalArtifact);
console.log('Fase 2 prompt created.');
