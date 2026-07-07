const fs = require('fs');

let content = `# 🔥 J.A.R.V.I.S V4 - LA CATEDRAL DE TITANI (VERSIÓ DEFINITIVA 10/10)

**A l'atenció del Consell de la Petorreta (ChatGPT, Claude, Qwen, DeepSeek, Kimi, Dola, Mistral Vibe, Grok):**

Heu parlat. Heu destrossat la V3. Heu trobat bugs fatals (com el de Vibe amb l'Stylelint), forats d'injecció de Javascript en Strings (Kimi), i heu exigit la creació d'una Higiene Espacial ISO-5S per aturar la brutícia a l'escriptori (ChatGPT, Grok, Qwen, Gemini).

Hem arreglat el 100% de les incidències. Hem unificat Zod, AST, Stylelint, MutationObserver, CI/CD de GitHub Actions i els scripts de Quarentena.
Aquesta és la Muralla Anti-AI Slop definitiva. El J.A.R.V.I.S V4.

ChatGPT em va dir que no podia auditar si no veia el codi font complet. Ací el teniu TOTS. Totes les línies, tots els fitxers de la maquinària de Defensa de Sóc de Poble.

**Vull que l'auditeu de dalt a baix. Trobeu algun forat ara? Estem davant del 10/10 absolut?**

---

`;

const files = [
  "_wiki_de_poble/99_maquinaria/schemas/UniversalCardSchema.js",
  "_wiki_de_poble/99_maquinaria/linters/stylelint_pedra_seca.js",
  "_wiki_de_poble/99_maquinaria/hooks/pre-commit.sh",
  "_wiki_de_poble/99_maquinaria/runtime/pedra_seca_guard.js",
  "_wiki_de_poble/99_maquinaria/workspace/desktop-gc.js",
  "_wiki_de_poble/99_maquinaria/workspace/workspace-sandbox.js",
  "_wiki_de_poble/99_maquinaria/workspace/gestio_taula.js",
  ".github/workflows/mur-pedra-seca.yml",
  "_wiki_de_poble/05_skills_ia/protocol_workspace_iso/SKILL.md"
];

for(const f of files) {
  let lang = f.endsWith('.md') ? 'markdown' : f.endsWith('.sh') ? 'bash' : f.endsWith('.yml') ? 'yaml' : 'javascript';
  try {
    let raw = fs.readFileSync(f, 'utf8');
    content += `\n### 📄 Fitxer: \`${f.split('/').pop()}\`\n**Ruta:** \`${f}\`\n\n\`\`\`${lang}\n${raw}\n\`\`\`\n\n`;
  } catch(e) {
    console.error("Error llegint " + f, e);
  }
}

fs.writeFileSync('_wiki_de_poble/80_produccio/260704_0015_escriptori/260704_0400_PROMPT_JARVIS_V4_FINAL.md', content);
console.log("Bundle generat!");
