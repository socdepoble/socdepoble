import fs from 'fs';
import path from 'path';

const filesToAppend = [
  'src/pages/public/UniversalPage.jsx',
  'src/pages/public/components/UniversalPageContent.jsx',
  'src/components/layout/AppLayout.jsx',
  'src/stores/PageUIStoreProvider.jsx',
  'src/stores/PageEditStoreProvider.jsx',
  'src/hooks/useScrollMetrics.js',
  'src/hooks/useEphemeralUI.js',
  'src/hooks/usePageData.js',
  'src/hooks/useUniversalPageCore.js',
  'src/components/layout/islands/DrawerIsland.jsx',
  'src/components/layout/islands/AccessibilityIsland.jsx'
];

const targetPrompt = '_auditories/2026-06-13_0435_Z_prompt_eixam_maduresa_i_futur.md';

let appendContent = '\n\n---\n\n## CODI FONT COMPLET PER AUDITAR\n\nA continuació teniu l\'arquitectura base completa (codi net i refactoritzat). Si us plau, analitzeu totes les connexions per trobar qualsevol falla oculta.\n\n';

for (const filePath of filesToAppend) {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      appendContent += `### \`${filePath}\`\n\`\`\`javascript\n${content}\n\`\`\`\n\n`;
    }
  } catch (err) {
    console.error('Error reading file:', filePath);
  }
}

fs.appendFileSync(path.resolve(targetPrompt), appendContent);
console.log('Codis afegits correctament al prompt!');
