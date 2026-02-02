import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mdToPdf } from 'md-to-pdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function generateReport(lang = 'ca') {
    console.log(`🚀 Generant Informe Tècnic de Sóc de Poble [${lang.toUpperCase()}]...`);

    const isSpanish = lang === 'es';
    const templateName = isSpanish ? 'TECHNICAL_REPORT_MASTER_ES.md' : 'TECHNICAL_REPORT_MASTER.md';
    const suffix = isSpanish ? '_ES' : '';

    // 1. Llegir metadades del projecte
    const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    const version = packageJson.version;
    const date = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    // 2. Llegir el task.md per a l'estat del desenvolupament (simulat o real)
    // Buscarem l'últim task.md a l'arca de l'IAIA
    const brainDir = '/Users/javillinares/.gemini/antigravity/brain/45fa1e66-aa17-4297-923f-aeaf8920c72a';
    const taskMdPath = path.join(brainDir, 'task.md');
    let devStatus = "Desenvolupament actiu en la versió BATEGA.";
    if (fs.existsSync(taskMdPath)) {
        const taskMd = fs.readFileSync(taskMdPath, 'utf8');
        const completedTasks = (taskMd.match(/\[x\]/g) || []).length;
        const totalTasks = (taskMd.match(/\[[ x/ ]\]/g) || []).length;
        devStatus = `Fase actual: BATEGA. Progrés global: ${completedTasks}/${totalTasks} tasques completades.`;
    }

    // 3. Resum d'Arquitectura (Pilar Master)
    const archSummary = isSpanish
        ? "Arquitectura Local-First con Rhizome DB (SQLite + CRDTs). El sistema prioriza la ejecución offline y la soberanía de datos mediante la Village Cell. Implementación del **Protocolo Atum** para la autosanación bicefala: Nivel Táctico (Ruta de Rescate UI) y Nivel Estructural (Vgroups y Random Walk Shuffling para resiliencia ante fallos bizantinos)."
        : "Arquitectura Local-First amb Rhizome DB (SQLite + CRDTs). El sistema prioritza l'execució offline i la sobirania de dades mitjançant la Village Cell. Implementació del **Protocol Atum** per a l'autosanació bicefala: Nivell Tàctic (Ruta de Rescat UI) i Nivell Estructural (Vgroups i Random Walk Shuffling per a resiliència davant fallades bizantines).";

    // 4. Roadmap (Extret de les directives del Master)
    const roadmap = "- **v1.6.0**: Desplegament de la Federació de Nodes.\n- **v1.7.0**: Mercat Rural amb Pagaments Sobirans.\n- **v2.0.0**: Xarxa de Confiança (Web of Trust) totalment descentralitzada.";

    // 5. Mètriques simulades (en el futur podrien venir de Supabase o Local DB)
    const metrics = {
        townCount: 12,
        nodeCount: 3,
        aiSimbiosi: 42
    };

    // 6. Llegir template i reemplaçar
    let template = fs.readFileSync(path.join(rootDir, templateName), 'utf8');

    const replacements = {
        '{{VERSION}}': version,
        '{{PHASE}}': 'STABLE',
        '{{DATE}}': date,
        '{{ARCHITECTURE_SUMMARY}}': archSummary,
        '{{DEVELOPMENT_STATUS}}': isSpanish ? devStatus.replace('Fase actual', 'Fase actual').replace('tasques completades', 'tareas completadas') : devStatus,
        '{{TOWN_COUNT}}': metrics.townCount,
        '{{NODE_COUNT}}': metrics.nodeCount,
        '{{AI_SIMBIOSI}}': metrics.aiSimbiosi,
        '{{ROADMAP}}': isSpanish
            ? "- **v1.6.0**: Despliegue de la Federación de Nodos.\n- **v1.7.0**: Mercado Rural con Pagos Soberanos.\n- **v2.0.0**: Red de Confianza (Web of Trust) totalmente descentralizada."
            : roadmap
    };

    Object.entries(replacements).forEach(([key, value]) => {
        template = template.replaceAll(key, value);
    });

    // 7. Guardar informe final (Markdown) - Ara a la carpeta public per a accés del frontend
    const outputPath = path.join(rootDir, 'public', `TECHNICAL_REPORT_VIVO${suffix}.md`);
    fs.writeFileSync(outputPath, template);
    console.log(`✅ Informe MD [${lang}] generat amb èxit a: ${outputPath}`);

    // 8. Generar PDF
    try {
        console.log(`📄 Generant versió PDF [${lang}]...`);
        const pdf = await mdToPdf({ content: template }, {
            launch_options: {
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
                headless: true
            },
            pdf_options: {
                format: 'A4',
                margin: '20mm',
                printBackground: true
            }
        });

        const pdfOutput = path.join(rootDir, 'public', `TECHNICAL_REPORT_VIVO${suffix}.pdf`);
        fs.writeFileSync(pdfOutput, pdf.content);
        console.log(`✅ Informe PDF [${lang}] generat amb èxit a: ${pdfOutput}`);
    } catch (pdfError) {
        console.error(`❌ Error generant el PDF [${lang}]:`, pdfError);
    }
}

async function main() {
    await generateReport('ca');
    await generateReport('es');
}

main().catch(console.error);
