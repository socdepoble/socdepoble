const fs = require('fs');

const promptPath = '_auditories/2026-06-13_0055_Z_eixam_prompt_neteja_arrel.md';
const appLayoutPath = 'src/components/layout/AppLayout.jsx';
const universalPagePath = 'src/pages/public/UniversalPage.jsx';

let promptContent = fs.readFileSync(promptPath, 'utf8');

// Replace the last line or just append
const toReplace = '*(Mestre: Afegeix ací baix els codis arrel recents: UniversalPage.jsx i AppLayout.jsx)*';
const appLayoutCode = fs.readFileSync(appLayoutPath, 'utf8');
const universalPageCode = fs.readFileSync(universalPagePath, 'utf8');

const appendedContent = `
---

### ARXIU 1: \`AppLayout.jsx\`
\`\`\`javascript
${appLayoutCode}
\`\`\`

### ARXIU 2: \`UniversalPage.jsx\`
\`\`\`javascript
${universalPageCode}
\`\`\`
`;

if (promptContent.includes(toReplace)) {
  promptContent = promptContent.replace(toReplace, appendedContent);
} else {
  promptContent += appendedContent;
}

fs.writeFileSync(promptPath, promptContent, 'utf8');
console.log('Appended the code to the prompt file successfully.');
