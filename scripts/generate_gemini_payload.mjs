import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const OUTPUT_FILE = './auditories/PAYLOAD_GEMINI_MASIVO.md';

// Ignorar carpetas pesadas o no relevantes para la lógica estructural
const IGNORE_DIRS = ['assets', 'sw', 'styles', 'dist', 'node_modules'];
// Ignorar CSS y media, queremos centrarnos en el State Machine y la Concurrencia
const IGNORE_EXTS = ['.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico'];

let payload = `# 💣 CÓDIGO CORE - PAYLOAD ESTRUCTURAL MASIVO (SÓC DE POBLE)\n\n`;
payload += `*Aquí tienes el código completo de la matriz React (Contextos, Providers, Hooks, Rutas y vistas principales) para la auditoría macro-estructural.*\n\n`;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        scanDir(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (!IGNORE_EXTS.includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lang = ext.replace('.', '') === 'jsx' ? 'jsx' : 'js';
        payload += `--- \n### 📁 Archivo: \`${fullPath}\`\n\`\`\`${lang}\n${content}\n\`\`\`\n\n`;
      }
    }
  }
}

try {
  console.log("🛠️ Escaneando todo el código fuente de ./src...");
  scanDir(SRC_DIR);
  fs.writeFileSync(OUTPUT_FILE, payload);
  console.log(`✅ Payload de contexto masivo generado con éxito en: ${OUTPUT_FILE}`);
} catch (error) {
  console.error("❌ Error generando el payload:", error);
}
