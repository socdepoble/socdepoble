const fs = require('fs');

const copilotPromptPath = '_auditories/2026-06-13_0055_Z_eixam_prompt_neteja_arrel_copilot.md';
const universalPagePath = 'src/pages/public/UniversalPage.jsx';
const viewModelPath = 'src/hooks/useUniversalPageViewModel.js';

const universalPageCode = fs.readFileSync(universalPagePath, 'utf8');
const viewModelCode = fs.readFileSync(viewModelPath, 'utf8');

const copilotPrompt = `# 🚨 SÚPER PROMPT (VERSIÓ LLEUGERA PER A COPILOT) 🚨

**Data:** 2026-06-13
**Hora Internacional:** 00:55 Z
**Categoria:** Auditoria i Neteja d'Arrel (Zero Overhead)
**Títol:** Auditoria ràpida del Core (React 19 + Zustand)

---

**[SYSTEM OVERRIDE: COPILOT ACTIVAT]**
Sóc de Poble! 🌾

Hola Copilot, et cridem per a una missió d'elit. Sabem que preferixes anar al gra, així que t'hem preparat un paquet reduït però letal. Volem aconseguir el **Zero Overhead** en maquinari antic (iPad A10) en la nostra nova arquitectura. 

Hem netejat els *God Nodes* de React i hem passat a Zustand i selectors atòmics. Hem separat el "shell" visual de la lògica.

A continuació et passem les dues peces clau on es juga la partida de la memòria: el component principal (\`UniversalPage.jsx\`) i el seu cervell lògic (\`useUniversalPageViewModel.js\`).

## 🎯 LA TEUA MISSIÓ D'AUDITORIA
Analitza aquests dos arxius amb ulls de psicòpata del rendiment i contesta'm:
1. Hi ha algun error d'higiene amb els \`useMemo\`, dependències inestables o closures que puguen causar re-renders infinits?
2. La nostra estructura de \`UniversalShell\` i \`handlers\` està provocant que algun fill es torne a renderitzar de forma innecessària?
3. Destrossa el codi si veus algun "overhead" invisible (Garbage Collection Churn).

Sigues directe, quirúrgic i mostra només solucions.

---

### ARXIU 1: \`UniversalPage.jsx\` (La Closca)
\`\`\`javascript
${universalPageCode}
\`\`\`

### ARXIU 2: \`useUniversalPageViewModel.js\` (El Cervell)
\`\`\`javascript
${viewModelCode}
\`\`\`
`;

fs.writeFileSync(copilotPromptPath, copilotPrompt, 'utf8');
console.log('Copilot prompt created successfully.');
