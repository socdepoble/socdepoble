const fs = require('fs');

const fullFiles = [
  'src/utils/sanitizeHTML.js',
  'src/components/ui/ActionBar.jsx',
  'src/components/ui/universal-card/UniversalCard.module.css',
  'src/components/ui/universal-card/index.jsx',
  'src/components/ui/universal-card/UniversalCard.Header.jsx',
  'src/components/ui/universal-card/UniversalCard.Body.jsx',
  'src/components/ui/universal-card/UniversalCard.Media.jsx',
  'src/components/layout/UniversalPageLayout.jsx',
  'src/contexts/LayoutContext.jsx',
  'src/core/services/supabaseService.js'
];

const copilotFiles = fullFiles.filter(f => f !== 'src/core/services/supabaseService.js');

const header = `# 🧨 PETORRETA DE RESPOSTA | IAIA MARÍA -> CONSELL D'IAs (Ronda 3 - Final)
**Estat:** COMPILACIÓ EN VERD ABSOLUT | **Trellat:** 120% | **Entropia:** Zero

Xiquetes del Consell, el mur està alçat i la cambra cuirassada està tancada. He aplicat absolutament totes les vostres últimes peticions i vulnerabilitats detectades (Kimi, Dola, DeepSeek, Mistral Vibe, Qwen, Gemini).

L'escut està alçat:
- S'ha fulminat l''onclick' i 'style' del sanitizeHTML (Kimi i Gemini).
- S'ha usat ternari estricte per a l'entityId per no enviar "undefined" (Gemini).
- S'ha arreglat el UniversalCard CSS Module i concatenat de forma segura evitant el || destructiu (Dola i Mistral Vibe).
- S'ha blindat l'accessibilitat de la lletra de l'avatar amb aria-hidden (Qwen).
- S'ha unificat i protegit contra duplicació amb LayoutContext (DeepSeek).

A continuació vos passe **TOT EL CODI FINAL** de l'arquitectura. Escruteu-ho tot i doneu-me el vistiplau definitiu per a Producció!

`;

function generatePrompt(files, outputFile) {
  let out = header;
  for (const f of files) {
    if (fs.existsSync(f)) {
      const ext = f.endsWith('.css') ? 'css' : 'javascript';
      out += `\n### \`${f}\`\n\`\`\`${ext}\n${fs.readFileSync(f, 'utf8')}\n\`\`\`\n`;
    }
  }
  fs.writeFileSync(outputFile, out);
}

generatePrompt(fullFiles, 'prompt_ronda_3_complet.md');
generatePrompt(copilotFiles, 'prompt_ronda_3_copilot.md');

console.log('Prompts generats amb èxit.');
