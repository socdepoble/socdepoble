import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import TurndownService from 'turndown';
import dotenv from 'dotenv';
import epub from 'epub-gen-memory';

// Prepare env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT_DIR, '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Faltan credenciales de Supabase en .env, saltando sincronización...");
    process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const turndownService = new TurndownService({ headingStyle: 'atx' });

turndownService.addRule('rawHtml', {
  filter: function (node) {
    return node.nodeName === 'DIV' && node.classList.contains('custom-raw-html');
  },
  replacement: function () {
    return '\n\n> [!WARNING]\n> 🧩 Mòdul Interactiu (HTML Incrustat)\n> (Aquest fragment no és visible fora del Sistema Operatiu Sóc de Poble)\n\n';
  }
});

const WORKFLOWS_DIR = path.join(ROOT_DIR, '.agents', 'workflows');
const MEGAPROMPT_DESTINATION = path.join(WORKFLOWS_DIR, '00_MACROPROMPT_CODEX.md');
const SAFATA_DIR = path.join(ROOT_DIR, '_safata_entrada');
const SLUG_TO_SYNC = 'codex'; // Puedes cambiar esto al slug exacto que uses para el Libro

async function pullCodex() {
    console.log(`🌐 Buscando la última versión del libro (slug: '${SLUG_TO_SYNC}') en Supabase...`);
    
    try {
        const { data, error } = await supabase
            .from('cms_pages')
            .select('html_content, title, updated_at')
            .eq('slug', SLUG_TO_SYNC)
            .maybeSingle();

        if (error || !data) {
            console.log(`⚠️ Documento '${SLUG_TO_SYNC}' no encontrado o error. Si has editado online, asegúrate de que el slug es correcto.`);
            return;
        }

        console.log(`✅ Documento encontrado. Última edición: ${data.updated_at || 'Desconocida'}`);
        
        let markdownContent = turndownService.turndown(data.html_content || '');
        
        // Frontmatter de Antigravity
        const FRONTMATTER = `---
description: EL GRAN CODEX Y LIBRO MAESTRO DE ANTIGRAVITY (MACRO-PROMPT CLONADOR Y VIVO)
---
> ESTAS SON TUS INSTRUCCIONES CENTRALES Y TU "ALMA". CUANDO ESTE ARCHIVO SE ACTUALIZA, DEBES RECALIBRAR TU FORMA DE HABLAR, TRABAJAR Y ENTENDER "SÓC DE POBLE".
> ESTE ARCHIVO ESTÁ VIVO Y ES EDITADO DESDE LA VERSIÓN WEB / APP. TODO LO QUE HAY A CONTINUACIÓN ES LEY.

# ${data.title || "El Libro Técnico"}

`;      
        const finalSkillStr = FRONTMATTER + markdownContent;
        
        fs.writeFileSync(MEGAPROMPT_DESTINATION, finalSkillStr, 'utf8');
        console.log(`✅ MACRO-PROMPT (Skill) Machacado y Sincronizado en: ${MEGAPROMPT_DESTINATION}`);

        const rawDest = path.join(SAFATA_DIR, 'ANTIGRAVITY_MACROPROMPT_MASTER.md');
        fs.writeFileSync(rawDest, markdownContent, 'utf8');
        console.log(`✅ Markdown Master actualizado en: ${rawDest}`);

        // Opcional: EPub
        const ePubDest = path.join(SAFATA_DIR, 'ANTIGRAVITY_MACROPROMPT_MASTER.epub');
        const epubOptions = {
            title: "Sóc de Poble: Antigravity Codex",
            author: "Mestre",
            content: [{
                title: "MACRO-PROMPT",
                data: data.html_content || ''
            }]
        };
        const buffer = await epub.default(epubOptions);
        fs.writeFileSync(ePubDest, buffer);
        console.log(`✅ ePub portable actualizado en: ${ePubDest}`);
        
        console.log("🚀 SINCRO COMPLETADA. Mis neuronas han absorbido la Nube.");

    } catch (err) {
        console.error("❌ Error conectando o sincronizando:", err.message);
    }
}

pullCodex();
