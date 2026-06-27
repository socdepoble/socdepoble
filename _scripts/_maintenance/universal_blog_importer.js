import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ============================================================================
// IMPORTADOR UNIVERSAL SÓC DE POBLE (WORDPRESS & BLOGGER)
// Diseñado para escalar publicaciones externas al muro de Sóc de Poble
// respetando radicalmente tu visión de separación de identidades:
//   1. Rol Persona (Ciudadano que escribe en su blog personal)
//   2. Rol Autónomo (Profesional que usa WordPress para su Portfolio/Currículum)
//   3. Rol Proyecto/Empresa (Noticias oficiales de Sóc de Poble)
//   4. Rol Entidad/Asociación (El Rentonar documentando el patrimonio)
// ============================================================================

const BLOGS_TO_IMPORT = [
    {
        name: 'Sóc de Poble (Proyecto/Empresa)',
        rss: 'https://socdepoble.net/feed/', // Asumimos que el feed principal es corporativo
        author: 'Sóc de Poble',
        author_role: 'company', // Proyecto oficial
        author_type: 'entity',
        userId: null,
        entityName: 'Sóc de Poble',
        defaultImage: '/assets/brand/default_post.png'
    },
    {
        name: 'Javi Llinares (Autónomo/Currículum)',
        // En un futuro, podrías tener una categoría /category/javi-llinares/ para tu portfolio personal
        rss: 'https://socdepoble.net/category/javi-llinares/feed/', 
        author: 'Javi Llinares', 
        author_role: 'autonomous', // Freelance / Currículum
        author_type: 'user',
        userId: '25218ea4-5d7d-4db4-bdc5-7ae035629242', // UUID de Javi Ciudadano
        entityName: null, 
        defaultImage: '/assets/brand/default_post.png'
    },
    {
        name: 'El Rentonar (Entidad Cultural)',
        rss: 'https://rentonar.blogspot.com/feeds/posts/default?alt=rss',
        author: 'El Rentonar',
        author_role: 'group', // Asociación / Colectivo
        author_type: 'entity',
        userId: null,
        entityName: 'Associació Cultural El Rentonar',
        defaultImage: '/assets/brand/rentonar_default.png'
    }
];

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function getEntityIdByName(name) {
    if (!name) return null;
    const { data } = await supabase.from('entities').select('id').ilike('name', `%${name}%`).single();
    return data ? data.id : null;
}

/**
 * Limpia la "basura" HTML del post y conserva sólo párrafos, subtítulos y listas en Markdown
 */
function cleanHTMLtoMarkdown(html) {
    if (!html) return '';
    const $ = cheerio.load(html);
    
    // Eliminar scripts, iframes, estilos, basura de plugins
    $('script, style, iframe, object, embed, .sharedaddy, .sd-sharing').remove();

    let textNodes = [];
    
    // Extraer jerarquía básica visual
    $('h1, h2, h3, p, li').each((_, el) => {
        let tag = el.tagName.toLowerCase();
        let text = $(el).text().trim();
        if (!text) return;
        
        if (tag === 'h1') textNodes.push(`\n# ${text}\n`);
        else if (tag === 'h2') textNodes.push(`\n## ${text}\n`);
        else if (tag === 'h3') textNodes.push(`\n### ${text}\n`);
        else if (tag === 'li') textNodes.push(`- ${text}`);
        else textNodes.push(`${text}\n`);
    });

    const finalMarkdown = textNodes.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    // Truncamos preventivamente a 1000 caracteres como snippet para el muro de SDP
    return finalMarkdown.length > 1000 ? finalMarkdown.substring(0, 1000) + '...' : finalMarkdown;
}

async function processBlog(blog) {
    console.log(`\n========================================`);
    console.log(`📡 ESCANEANDO: ${blog.name}`);
    console.log(`========================================`);

    try {
        const { data } = await axios.get(blog.rss);
        const result = await parseStringPromise(data);
        const items = result.rss.channel ? result.rss.channel[0].item : result.feed.entry; // Atom o RSS
        
        if (!items) {
            console.log(`⚠️ No se detectaron posts en ${blog.name}`);
            return;
        }

        console.log(`📝 Se han encontrado ${items.length} artículos en el RSS.`);

        const entityId = await getEntityIdByName(blog.entityName);

        let added = 0;
        let skipped = 0;

        for (const item of items) {
            const title = typeof item.title[0] === 'object' ? item.title[0]._ : item.title[0];
            const link = item.link[0].$ ? item.link[0].$.href : (typeof item.link[0] === 'string' ? item.link[0] : '#');
            
            // Extracción de contenido
            let rawHtml = '';
            if (item['content:encoded']) rawHtml = item['content:encoded'][0];
            else if (item.content && item.content[0] && item.content[0]._) rawHtml = item.content[0]._; 
            else if (item.description) rawHtml = item.description[0];

            // Extracción de Imagen Válida
            let imageUrl = blog.defaultImage;
            const $ = cheerio.load(rawHtml);
            const imgEl = $('img').first();
            if (imgEl.length) imageUrl = imgEl.attr('src');

            // Saneamiento de Contenido a Markdown Limpio
            const markdownContent = cleanHTMLtoMarkdown(rawHtml);
            // Inyectamos la URL original vital para que OMEGA-33 funcione si hay deduplicaciones en el futuro
            const postContent = `**${title}**\n\n${markdownContent}\n\n🔗 [Llegir original](${link})`;

            // Evitar duplicados midiendo si la URL exacta ya fue publicada
            const { data: existing } = await supabase
                .from('posts')
                .select('id')
                .ilike('content', `%${link}%`)
                .limit(1);

            if (existing && existing.length > 0) {
                skipped++;
                continue;
            }

            // Insertar con el Rol Exacto Definido
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    author: blog.author,
                    author_role: blog.author_role,
                    author_type: blog.author_type,
                    author_user_id: blog.userId,
                    author_entity_id: entityId,
                    content: postContent,
                    image_url: imageUrl,
                    created_at: item.pubDate ? new Date(item.pubDate[0]).toISOString() : new Date().toISOString()
                });

            if (insertError) {
                console.error(`❌ Error insertando '${title}': ${insertError.message}`);
            } else {
                console.log(`  ✨ Importado: ${title}`);
                added++;
            }
        }

        console.log(`✅ Finalizado ${blog.name}: ${added} nuevos, ${skipped} omitidos (duplicados).`);

    } catch (e) {
        console.error(`❌ Fallo crítico al procesar ${blog.name}: ${e.message}`);
    }
}

async function run() {
    console.log("🚀 INICIANDO IMPORTADOR DE ROLES MULTIPLES...\n");
    for (const blog of BLOGS_TO_IMPORT) {
        await processBlog(blog);
    }
    console.log("\n🏁 IMPORTACIÓN COMPLETADA AL 100%.");
}

run();
