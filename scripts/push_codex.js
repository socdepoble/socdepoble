import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import dotenv from 'dotenv';

// Prepare env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT_DIR, '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Faltan credenciales de Supabase en .env, saltando sincronización...");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WORKFLOWS_DIR = path.join(ROOT_DIR, '.agents', 'workflows');
const MEGAPROMPT_DESTINATION = path.join(WORKFLOWS_DIR, '00_MACROPROMPT_CODEX.md');
const SLUG_TO_SYNC = 'codex';

async function pushCodex() {
    console.log(`🌐 Leyendo el Códex local desde ${MEGAPROMPT_DESTINATION} para enviarlo a la Nube...`);
    
    try {
        if (!fs.existsSync(MEGAPROMPT_DESTINATION)) {
            console.error(`❌ Archivo no encontrado: ${MEGAPROMPT_DESTINATION}`);
            return;
        }

        const rawContent = fs.readFileSync(MEGAPROMPT_DESTINATION, 'utf8');
        
        // Strip Frontmatter (--- ... ---) and extract body
        let bodyMarkdown = rawContent;
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = rawContent.match(frontmatterRegex);
        
        if (match && match.length >= 3) {
            bodyMarkdown = match[2];
        }

        // Clean up any remaining Antigravity specific headers if necessary
        // (For example, blockquotes that were injected on pull_codex)
        const injectedHeaderRegex = /^> ESTAS SON TUS INSTRUCCIONES CENTRALES[\s\S]*?ESTE ARCHIVO ESTÁ VIVO Y ES EDITADO DESDE LA VERSIÓN WEB \/ APP\. TODO LO QUE HAY A CONTINUACIÓN ES LEY\.\n+/i;
        bodyMarkdown = bodyMarkdown.replace(injectedHeaderRegex, '');

        // Convert to HTML
        console.log("⚙️  Transformando Markdown a HTML...");
        const htmlContent = marked.parse(bodyMarkdown);

        console.log(`🚀 Actualizando la página '${SLUG_TO_SYNC}' en Supabase...`);
        const { error } = await supabase
            .from('cms_pages')
            .update({ html_content: htmlContent, updated_at: new Date().toISOString() })
            .eq('slug', SLUG_TO_SYNC);

        if (error) {
            console.error(`❌ Error actualizando el documento original en Supabase:`, error.message);
            return;
        }

        console.log(`✅ ¡ÉXITO! El Códex ha sido volcado bidireccionalmente a la plataforma Sóc de Poble.`);

        // NOTA: Para el futuro, disparar aquí notificación PUSH MÓVIL (FCM / OneSignal)
        console.log("🔔 [INFO-FUTURO] Fase de desarrollo: Aquí la IAIA disparará una Notificación Push para el móvil de que el Codex ha sido alterado de forma autónoma.");

    } catch (err) {
        console.error("❌ Error de ejecución en push_codex:", err);
    }
}

pushCodex();
