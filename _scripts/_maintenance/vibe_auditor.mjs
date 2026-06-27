import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("==================================================");
console.log("🛠️ SÓC DE POBLE - VIBE AUDITOR (Fase Tècnica)");
console.log("==================================================\n");

const auditDir = path.join(process.cwd(), '.agents', 'auditories');
if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = path.join(auditDir, `vibe_report_${timestamp}.md`);
let reportContent = `# 🛡️ Informe de la Masia (Vibe Auditor)\nData: ${new Date().toLocaleString()}\n\n`;

try {
    console.log("🔍 1. Executant l'Esporgador Suprem (Knip)...");
    // Executem Knip de forma passiva per trobar dead-code i dependències no usades
    const knipOutput = execSync('npx knip', { encoding: 'utf-8', stdio: 'pipe' }).toString();
    console.log("✅ Knip ha finalitzat l'anàlisi.");
    reportContent += `## ✂️ Resultats de Knip (Codi Mort i Orfes)\n\`\`\`text\n${knipOutput}\n\`\`\`\n\n`;
} catch (error) {
    console.warn("⚠️ Knip ha detectat llenya morta!");
    reportContent += `## ✂️ Resultats de Knip (Codi Mort i Orfes)\n\`\`\`text\n${error.stdout ? error.stdout.toString() : error.message}\n\`\`\`\n\n`;
}

try {
    console.log("\n🧭 2. Executant el Guarda de la Séquia (Dependency Cruiser)...");
    // Executem Dependency Cruiser contra les regles establides
    const depOutput = execSync('npx depcruise src --config .dependency-cruiser.js', { encoding: 'utf-8', stdio: 'pipe' }).toString();
    console.log("✅ Dependency Cruiser ha validat les fronteres.");
    reportContent += `## 🛡️ Resultats de Dependency Cruiser (Fronteres Arquitectòniques)\n\`\`\`text\n${depOutput || "Cap violació detectada. Arquitectura perfecta."}\n\`\`\`\n\n`;
} catch (error) {
    console.warn("❌ Dependency Cruiser ha detectat una violació de les regles arquitectòniques!");
    reportContent += `## 🛡️ Resultats de Dependency Cruiser (Fronteres Arquitectòniques)\n\`\`\`text\n${error.stdout ? error.stdout.toString() : error.message}\n\`\`\`\n\n`;
}

fs.writeFileSync(reportPath, reportContent, 'utf8');

console.log("\n==================================================");
console.log(`✅ Auditoria Tècnica completada amb èxit!`);
console.log(`📄 L'informe detallat s'ha guardat a: ${reportPath}`);
console.log("==================================================");
