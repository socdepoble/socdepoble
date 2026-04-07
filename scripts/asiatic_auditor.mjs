import fs from 'fs';
import path from 'path';

// Utilidad para extraer el patrón repetitivo de las auditorías asiáticas
// y generar un prompt completo con el contexto necesario, "Fricción Cero".

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("🛠️ Sóc de Poble - Asiatic Auditor");
    console.error("Uso: npm run asiatic-audit \"Descripción del bug\" [ruta/al/archivo1] [ruta/al/archivo2]");
    process.exit(1);
}

const bugDescription = args[0];
const files = args.slice(1);

const auditDir = path.join(process.cwd(), '.agents', 'auditories');
if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = path.join(auditDir, `asiatic_audit_${timestamp}.md`);

let content = `# 🛡️ MISIÓN PARA LA MENTE COLMENA (Escuadrón Asiático)

**Contexto:**
Sóc de Poble (Arquitectura Local-First, PWA, CRDTs, iPad A10).
El humano o Antigravity ha detectado el siguiente patrón de error o necesidad de auditoría:

> **${bugDescription}**

---
## 🛑 CÓDIGO A AUDITAR

`;

if (files.length === 0) {
    content += `*(No se han proporcionado archivos específicos. Analizad la arquitectura en base a la descripción anterior).* \n\n`;
}

for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        content += `### Archivo: \`${file}\`\n\`\`\`javascript\n`;
        content += fs.readFileSync(fullPath, 'utf8');
        content += `\n\`\`\`\n\n`;
    } else {
        console.warn(`⚠️ Archivo no encontrado: ${file}`);
    }
}

content += `---
## 🎯 INSTRUCCIONES PARA LA MENTE COLMENA (The Rules)
1. Analiza el código adjunto en profundidad.
2. Identifica exactamente dónde está el cuello de botella, condición de carrera, fuga de memoria o error estructural.
3. Propón **una solución elegante y de extrema austeridad** que respete las directivas del libro maestro (sin dependencias extra, optimizado para procesadores antiguos y 2GB de RAM).
4. Devuelve los bloques de código corregidos COMPLETOS de tal manera que el humano pueda copiarlos y pegarlos con fricción cero, sin explicaciones redundantes.
`;

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`\n✅ ¡Sublimación lograda! Prompt para la auditoría asiática generado en: ${outputFile}`);
console.log(`Pega el contenido de este archivo en la consola de Qwen/DeepSeek/Kimi para iniciar la trinchera.\n`);
