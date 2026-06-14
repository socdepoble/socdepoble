const fs = require('fs');

const promptPath = '_auditories/2026-06-13_0055_Z_prompt_comunitari_desacoblament.md';
const universalPagePath = 'src/pages/public/UniversalPage.jsx';
const universalCardPath = 'src/components/ui/Card/UniversalCard.jsx';
const appLayoutPath = 'src/components/layout/AppLayout.jsx';

let universalPageContent = '';
let universalCardContent = '';
let appLayoutContent = '';

try { universalPageContent = fs.readFileSync(universalPagePath, 'utf8'); } catch(e) {}
try { universalCardContent = fs.readFileSync(universalCardPath, 'utf8'); } catch(e) {}
try { appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8'); } catch(e) {}

const promptContent = `# 🚨 EL GRAN REPTE DEL CONSELL: EL DESACOBLAMENT UNIVERSAL 🚨
**Data:** 2026-06-13 | **Estat:** Tàctic | **Objectiu:** Zero Overhead Estructural

Salutacions, Eixam. Heu destrossat la brutícia superficial amb una precisió quirúrgica. Els \`useMemo\` tòxics, el \`requestAnimationFrame\` fugaç i les referències fantasma de l'objecte \`actions\` ja estan a la llista d'execució.

**PERÒ CHATGPT I PERPLEXITY HAN DETECTAT L'AUTÈNTIC MONSTRE:**

\`UniversalPage\` pateix d'un acoblament mortal. El seu hook \`useUniversalPageState\` és un _reducer_ enorme que controla des de \`isEditing\` fins a \`showScrollTop\` i \`isFullscreen\`. Qualsevol canvi en aquest estat UI volàtil provoca un re-renderitzat ABSOLUT del component \`UniversalPage\` i, per extensió, de tota la pàgina.

A més, volem estendre aquesta auditoria de dependències a l'ecosistema \`UniversalCard\`, que segurament arrossega els mateixos problemes d'acoblament i ineficiència.

**LA MISSIÓ:**
Analitzeu aquests 3 arxius clau i doneu-nos una estratègia per:
1. **Desacoblar l'estat volàtil** de \`UniversalPage\` (On l'hem de moure? Zustand local? Contextos separats?).
2. **Mapa de dependències** entre \`UniversalPage\` i \`AppLayout\` per eliminar l'estat global innecessari.
3. **Auditoria de \`UniversalCard\`** per assegurar que els seus subcomponents (Header, Body, Media, Footer) no disparen renders en cascada quan canvien dades irrellevants per a ells.

---

### ARXIU 1: UniversalPage.jsx
\`\`\`javascript
${universalPageContent}
\`\`\`

---

### ARXIU 2: UniversalCard.jsx (Capa de presentació)
\`\`\`javascript
${universalCardContent}
\`\`\`

---

### ARXIU 3: AppLayout.jsx (Capa arrel)
\`\`\`javascript
${appLayoutContent}
\`\`\`

**Eixam, traieu les eines pesades. Com re-arquitecturitzem açò sense trencar la Pedra Seca?**
`;

fs.writeFileSync(promptPath, promptContent);
console.log('Prompt creat a: ' + promptPath);
