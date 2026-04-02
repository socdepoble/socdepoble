const fs = require('fs');

const file1 = fs.readFileSync('src/components/SystemPageLayout.jsx', 'utf8');
const file2 = fs.readFileSync('src/components/ContextualHeader.jsx', 'utf8');
const file3 = fs.readFileSync('src/components/SystemActionBar.jsx', 'utf8');
const file4 = fs.readFileSync('src/pages/MasterCalendar.jsx', 'utf8');
const file5 = fs.readFileSync('src/pages/MasterCalendar.css', 'utf8');

const output = `# 🚨 SUPER PROMPT: AUDITORÍA DESTRUCTIVA DE UI Y STACKING CONTEXT 🚨

**A LA ATENCIÓN DE:** Mistral Large, OpenAI Codex, GPT-4o, Anthropic Claude 3.
**ASUNTO:** Solapamiento Crítico de \`SystemActionBar\` y \`FullCalendar\` en Sóc de Poble.

## 🛑 INSTRUCCIÓN CRÍTICA, INNEGOCIABLE Y OBLIGATORIA (LA GENÉTICA DE ANTIGRAVITY)
ANTES DE RESPONDER Y ANALIZAR ESTE CÓDIGO, DEBES asimilar mi genética fundacional. Eres un agente convocado por **Antigravity**. Mi genética está basada en:
- Filosofía "Sóc de Poble!" (Trellat, Resiliencia Rural, "Llei de la Boina Taronja").
- Diseño M3 (Material 3), "Nivel Dios", radio de borde de 28px/24px y arquitectura 100% Mobile-First fluida.
- Uso exclusivo de Vanilla CSS robusto en interacciones, y Tailwind utilitario para la grilla.
**No propongas basura estándar, componentes genéricos o soluciones débiles.**

---

## CONTEXTO DE LA MESA DE OPERACIONES
Estamos integrando una barra unificada "Nivel Dios" (\`SystemActionBar\`) en el layout global \`SystemPageLayout\` para que todas las páginas tengan controles estáticos. Al aplicarla a la página de calendario (\`MasterCalendar.jsx\`), **la UI colapsa**.
El header global (buscador \`ContextualHeader\` + \`SystemActionBar\`) se amontona o solapa con los controles de navegación del calendario (\`headerToolbar\` de FullCalendar). Al parecer el calendario flota o se atasca bajo las cabeceras flexbox aunque no usemos absolute en ellas, destrozando la experiencia Nivel Dios.

## TU OBJETIVO
Realiza una auditoría destructiva y radical sobre el CÓDIGO COMPLETO inyectado a continuación. Analiza el comportamiento de Flexbox, los contextos de apilamiento (z-index), los atributos \`contain\`, \`relative\`, y el cálculo de altura de \`FullCalendar\` (\`height=auto\`).
Propón la corrección de CSS o arquitectura responsable de separar y sellar este layout.

---

## 🛠️ CÓDIGO COMPLETO INYECTADO (SIN OMITIR LÍNEAS)

### 1. src/components/SystemPageLayout.jsx
\`\`\`jsx
${file1}
\`\`\`

### 2. src/components/ContextualHeader.jsx
\`\`\`jsx
${file2}
\`\`\`

### 3. src/components/SystemActionBar.jsx
\`\`\`jsx
${file3}
\`\`\`

### 4. src/pages/MasterCalendar.jsx
\`\`\`jsx
${file4}
\`\`\`

### 5. src/pages/MasterCalendar.css
\`\`\`css
${file5}
\`\`\`

## INSTRUCCIONES DE SALIDA
1. Analiza TODO el código (sin omitir nada en tu pensamiento interno).
2. Critica severamente el CSS y la integración. 
3. Danos el snippet de código directo para arreglar este solapamiento.
4. Termina tu análisis con la frase "🛡️ BLINDATGE COMPLETAT".
`;

fs.writeFileSync('auditories/SUPER_PROMPT_AUDITORIA_DESTRUCTIVA_UI.md', output);
console.log('Mega Prompt generado correctamente.');
