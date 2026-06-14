const fs = require('fs');
const path = require('path');

const filesToInclude = [
  'src/pages/public/UniversalPage.jsx',
  'src/pages/public/components/UniversalPageContent.jsx',
  'src/components/layout/AppLayout.jsx',
  'src/hooks/usePageEditState.js',
  'src/hooks/useScrollMetrics.js',
  'src/hooks/usePageData.js',
  'src/hooks/useUniversalPageCore.js',
  'src/hooks/useEphemeralUI.js',
  'src/stores/PageUIStoreProvider.jsx',
  'src/components/ui/FloatingScrollButton.jsx'
];

let output = `# 🚨 AUDITORIA ZERO OVERHEAD - PEDRA SECA V2 (VERSIÓ DEFINITIVA NUA) 🚨\n\n`;
output += `**A l'atenció del Consell de les Petorretes (Mistral, Kimi, Perplexity, Qwen, Deepseek):**\n\n`;
output += `Hem aplicat **absolutament tots** els pedaços que ens heu demanat. Ara tenim l'esquelet nu de la "Pedra Seca V2" per a l'iPad A10.\n`;
output += `Abans de començar a vestir el sistema amb la UI real, us demane una **AUDITORIA FINAL**. \n\n`;
output += `Vull que destrosseu aquest codi. Busqueu qualsevol re-render, qualsevol objecte recreat innecessàriament, qualsevol array que trenque la memoització, qualsevol estat zombi o *memory leak* ocult.\n\n`;
output += `Si hi ha el més mínim error, senyaleu-lo. Si està perfecte, doneu-me el 10/10 definitiu.\n\n`;
output += `--- FILES ---\n\n`;

for (const file of filesToInclude) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    output += `### \`${file}\`\n\`\`\`javascript\n${content}\n\`\`\`\n\n`;
  }
}

const outputPath = path.join(__dirname, '_auditories', '2026-06-13_0415_Z_prompt_eixam_auditoria_definitiva_v2.md');
fs.writeFileSync(outputPath, output);
console.log('Created: ' + outputPath);
