const fs = require('fs');

const promptPath = '_auditories/2026-06-13_0055_Z_eixam_prompt_neteja_arrel.md';
const shellPath = 'src/components/universal/UniversalShell.jsx';
const viewModelPath = 'src/hooks/useUniversalPageViewModel.js';
const statePath = 'src/hooks/useUniversalPageState.js';

let promptContent = fs.readFileSync(promptPath, 'utf8');

const shellCode = fs.readFileSync(shellPath, 'utf8');
const viewModelCode = fs.readFileSync(viewModelPath, 'utf8');
const stateCode = fs.readFileSync(statePath, 'utf8');

const appendedContent = `

### ARXIU 3: \`UniversalShell.jsx\` (La Closca i Providers)
\`\`\`javascript
${shellCode}
\`\`\`

### ARXIU 4: \`useUniversalPageViewModel.js\` (El Cervell de Rendiment)
\`\`\`javascript
${viewModelCode}
\`\`\`

### ARXIU 5: \`useUniversalPageState.js\` (L'Estat Local)
\`\`\`javascript
${stateCode}
\`\`\`
`;

promptContent += appendedContent;

fs.writeFileSync(promptPath, promptContent, 'utf8');
console.log('Appended 3 more files to the prompt successfully.');
