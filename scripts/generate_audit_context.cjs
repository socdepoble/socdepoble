const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const outPath = path.join(__dirname, '..', 'auditorias', 'contexto_maestro_codex.txt');

const filesToInclude = [
  'App.jsx',
  'entry.jsx',
  'context/AuthContext.jsx',
  'context/DesignContext.jsx',
  'context/ThemeContext.jsx',
  'rhizome/crdt/eg-walker.js',
  'rhizome/db-core.js',
  'platforms/web/db-worker.js', // Or similar workers if they exist
  'services/secureStorage.js',
  'services/paymentService.js',
  'services/supabaseService.js',
  'services/syncService.js',
  'services/iaiaService.js'
];

let compiledContent = '# Sóc de Poble: Arquitectura Mestra (Context per a Auditoria Codex)\n\n';

for (const relPath of filesToInclude) {
  const fullPath = path.join(srcDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    compiledContent += `\n// ==========================================\n`;
    compiledContent += `// FILE: src/${relPath}\n`;
    compiledContent += `// ==========================================\n\n`;
    compiledContent += content + '\n';
  } else {
    compiledContent += `\n// [MISSING FILE]: src/${relPath}\n`;
  }
}

fs.writeFileSync(outPath, compiledContent);
console.log(`Contexto maestro generado en: ${outPath} (${(compiledContent.length / 1024).toFixed(2)} KB)`);
