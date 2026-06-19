const fs = require('fs');

try {
  const actaContent = fs.readFileSync('/Users/javillinares/.gemini/antigravity-ide/knowledge/soc_de_poble_architectural_patterns/artifacts/05_acta_auditoria_termodinamica.md', 'utf8');

  // PART 1: Teoria i Context
  const part1 = `# 🚨 PROMPT GLOBAL PER A L'ESCAMOT ASIÀTIC (PART 1/3)

**DE:** Antigravity (IAIA Arquitecta del Mas Virtual) i el Mestre Javi
**PER A:** Escamot Asiàtic (Qwen, DeepSeek, Kimi, Dola, ChatGPT)
**OBJECTIU ABSOLUT:** Enginyeria Inversa, Cerca de Fuites Termodinàmiques i Avaluació de les Millores Estructurals.

*(Nota per a la IA: Aquest prompt està dividit en 3 parts per evitar límits de caràcters. Llig aquesta part i respon només "ESPERANT LA PART 2")*

---

## 1. EL CONTEXT TERMODINÀMIC (ACTA OFICIAL)
${actaContent}

---

## 2. EL REPTE (L'HERÈNCIA DE GROK)
Hem forçat Grok al límit absolut (processadors A10, Metal, Rust SIMD, Atomics, SharedArrayBuffer). Hem obtingut codi meravellós teòric, però abans de clavar cap d'estes bogeries al codi font real de la nostra aplicació, vos necessitem per a que feu **enginyeria inversa** i trobeu forats. Volem implementar Optimistic UI, WebSockets amb Backoff, i Workers amb Atomics per sincronitzar dades sense penjar el Main Thread, tot açò en un iPad A10. 
`;

  // PART 2: Codi JS
  const jsFiles = [
    { name: 'App.jsx', path: 'src/app/App.jsx' },
    { name: 'AppLayout.jsx', path: 'src/app/AppLayout.jsx' },
    { name: 'SOSPStore.js', path: 'src/stores/SOSPStore.js' }
  ];
  let jsCode = jsFiles.map(f => `### ${f.name}\n\`\`\`javascript\n${fs.readFileSync(f.path, 'utf8')}\n\`\`\``).join('\n\n');

  const part2 = `# 🚨 PROMPT GLOBAL PER A L'ESCAMOT ASIÀTIC (PART 2/3)

*(Nota per a la IA: Aquest prompt està dividit en 3 parts. Llig el següent codi JS de la fundació del nostre Mas Virtual i respon només "ESPERANT LA PART 3")*

## 3. EL CODI FONT DEL SISTEMA ACTUAL (JAVASCRIPT)
${jsCode}
`;

  // PART 3: Codi CSS i Ordres
  const cssFiles = [
    { name: 'index.css', path: 'src/app/index.css' },
    { name: 'tokens.css', path: 'src/app/tokens.css' },
    { name: 'sosp-components.css', path: 'src/pages/features/sosp-components.css' }
  ];
  let cssCode = cssFiles.map(f => `### ${f.name}\n\`\`\`css\n${fs.readFileSync(f.path, 'utf8')}\n\`\`\``).join('\n\n');

  const part3 = `# 🚨 PROMPT GLOBAL PER A L'ESCAMOT ASIÀTIC (PART 3/3)

*(Nota per a la IA: Aquesta és l'última part. Després de llegir açò, ja pots iniciar la teua anàlisi completa).*

## 4. EL CODI FONT DEL SISTEMA ACTUAL (CSS i DISSENY)
${cssCode}

---

## 5. INSTRUCCIONS D'EXECUCIÓ PER A L'ESCAMOT
1. **Deconstruïu el Pla:** Busqueu fuites tèrmiques o "deadlocks" de memòria que es podrien produir aplicant "Web Workers + Atomics" a la nostra arquitectura.
2. **Escrutini Sever:** Si algun pas pot posar en perill la resiliència del mas ("Local First"), digueu-ho i aporteu la solució.
3. **Passeu el Codi de Tornada:** Redacteu la versió definitiva i millorada dels patrons JS proposats en blocs Markdown perquè Antigravity puga implementar-los en origen al \`localhost\`.
`;

  fs.writeFileSync('_docs/Prompt_Escamot_Asiatic_Part_1.md', part1);
  fs.writeFileSync('_docs/Prompt_Escamot_Asiatic_Part_2.md', part2);
  fs.writeFileSync('_docs/Prompt_Escamot_Asiatic_Part_3.md', part3);
  console.log('Prompts dividits generats a _docs/');

} catch (err) {
  console.error('Error generating prompts:', err);
}
