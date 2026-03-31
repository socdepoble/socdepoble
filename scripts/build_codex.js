import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import epub from 'epub-gen-memory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const WORKFLOWS_DIR = path.join(ROOT_DIR, '.agents', 'workflows');
const SAFATA_DIR = path.join(ROOT_DIR, '_safata_entrada');

const MEGAPROMPT_DESTINATION = path.join(WORKFLOWS_DIR, '00_MACROPROMPT_CODEX.md');
const EPUB_DESTINATION = path.join(SAFATA_DIR, 'ANTIGRAVITY_MACROPROMPT_MASTER.epub');
const TXT_DESTINATION = path.join(SAFATA_DIR, 'ANTIGRAVITY_MACROPROMPT_MASTER.md');

// El orden maestro de los ficheros del libro
// Cualquier fichero que empiece por libro_ y no esté aquí, se pondrá al final por orden alfabético.
const MASTER_ORDER = [
  'libro_manifiesto_fundacional.md',
  'libro_blueprint_replicacion.md',
  'libro_taules_llei_qwen.md',
  'libro_capitulo_ingenieria_pura.md',
  'libro_fase_10_enciclopedia_deepseek.md',
  'libro_fase_11_deepseek.md',
  'libro_fase_11_nucleo_duro.md',
  'libro_fase_12_chaos_engineering.md',
  'libro_fase_12_claude.md',
  'libro_fase_12_gemini.md',
  'libro_fase_12_qwen.md',
  'libro_fase_13_deepseek.md',
  'libro_fase_13_gemini.md',
  'libro_fase_13_perplexity.md',
  'libro_fase_13_qwen.md'
];

async function buildCodex() {
  console.log('📖 Iniciando Motor Genético de Antigravity...');

  // 1. Asegurar directorios
  if (!fs.existsSync(SAFATA_DIR)) {
    fs.mkdirSync(SAFATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    fs.mkdirSync(WORKFLOWS_DIR, { recursive: true });
  }

  // 2. Recolectar archivos libro_*.md
  const allFiles = fs.readdirSync(ROOT_DIR).filter(f => f.startsWith('libro_') && f.endsWith('.md'));
  
  // Ordenar según MASTER_ORDER, lo que no esté, va después alfabéticamente
  allFiles.sort((a, b) => {
    const idxA = MASTER_ORDER.indexOf(a);
    const idxB = MASTER_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  console.log(`📚 Encontrados ${allFiles.length} capítulos del Codex.`);

  let rawMarkdown = '';
  const epubChapters = [];

  // Recorrer y ensamblar
  for (const filename of allFiles) {
    const content = fs.readFileSync(path.join(ROOT_DIR, filename), 'utf-8');
    
    // Título para el EPUB (intenta extraer el primer H1 o H2)
    let title = filename.replace('.md', '').toUpperCase();
    const match = content.match(/^#+\s+(.*)/m);
    if (match) {
      title = match[1].trim();
    }

    rawMarkdown += `\n\n<!-- ========================================== -->\n`;
    rawMarkdown += `<!-- CAPÍTULO: ${filename} -->\n`;
    rawMarkdown += `<!-- ========================================== -->\n\n`;
    rawMarkdown += content;

    // Convertir a HTML para el Epub
    const htmlContent = marked.parse(content);
    epubChapters.push({
      title: title,
      content: htmlContent,
      author: "Antigravity & El Mestre"
    });
  }

  // 3. Escribir el Macro-Prompt como un Skill oficial (.agents/workflows)
  const yamlFrontmatter = `---
description: EL GRAN CODEX Y LIBRO MAESTRO DE ANTIGRAVITY (MACRO-PROMPT CLONADOR)
---
# 🧠 EL MOTOR GENÉTICO DE ANTIGRAVITY
*Atención Agente: Este documento representa la mente, la historia y la configuración absoluta del sistema "Sóc de Poble". Este es el Macro-Prompt.*

`;
  
  const finalWorkflowContent = yamlFrontmatter + rawMarkdown;
  fs.writeFileSync(MEGAPROMPT_DESTINATION, finalWorkflowContent, 'utf-8');
  console.log(`✅ Macro-Prompt inyectado en tus Skills: ${MEGAPROMPT_DESTINATION}`);

  // 4. Escribir la copia limpia en la Bandeja de Entrada
  fs.writeFileSync(TXT_DESTINATION, finalWorkflowContent, 'utf-8');
  console.log(`✅ Markdown Master guardado en: ${TXT_DESTINATION}`);

  // 5. Generar EPUB
  console.log('⚙️ Generando ePUB portable...');
  try {
    const options = {
      title: "Sóc de Poble: El Códex de Antigravity",
      author: "El Mestre i la IAIA",
      publisher: "Sóc de Poble",
      description: "El ePub que se convierte en una Red Social. Macro-prompt y documentación genética del proyecto.",
      tocTitle: "Índice de Contenidos",
    };

    const buffer = await epub.default(options, epubChapters);
    fs.writeFileSync(EPUB_DESTINATION, buffer);
    console.log(`🎉 ¡ÉXITO! ePub portable generado en: ${EPUB_DESTINATION}`);
  } catch (err) {
    console.error('❌ Error generando el ePUB:', err);
  }
}

buildCodex();
