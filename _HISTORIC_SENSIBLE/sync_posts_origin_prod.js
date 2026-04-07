/* eslint-disable */
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced'
});

turndownService.addRule('iframe', {
    filter: 'iframe',
    replacement: function (content, node) {
        const src = node.getAttribute('src');
        if (src && src.includes('youtube.com')) return `\n📺 [Ver Vídeo en YouTube](${src})\n`;
        return '';
    }
});

turndownService.addRule('remove-base64', {
    filter: function (node) {
        return node.nodeName === 'IMG' && node.getAttribute('src') && node.getAttribute('src').startsWith('data:image');
    },
    replacement: function () { return ''; }
});

async function syncOriginsProd() {
    console.log("🔥 Arrancando SYNCRONIZADOR DE ORIGEN EN PRODUCCIÓN 🔥\n");

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, content, image_url')
        .ilike('content', '%[Llegir original]%');

    if (error) {
        console.error("Error obteniendo posts:", error);
        return;
    }

    console.log(`📡 Abordando ${posts.length} transmisiones orgánicas...\n`);

    let affectedRows = 0;
    let fallbackSubtitles = 0;

    for (let post of posts) {
        const match = post.content.match(/\[Llegir original\]\((https?:\/\/[^\)]+)\)/);
        if (!match) continue;

        const url = match[1];

        try {
            await new Promise(r => setTimeout(r, 500)); // Delay cortés para no tumbar PHP

            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                redirect: 'follow'
            });

            if (!response.ok) {
                console.log(`  ❌ Fallo HTTP: ${response.status} en la ID ${post.id}`);
                continue;
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            let pubDate = null;
            let authorName = null;
            let authorRole = 'official';
            let authorType = 'entity';
            let authorUserId = null;
            let tags = [];
            let categories = [];
            let imageAlt = null;
            let title = '';
            let subtitle = '';
            let mainContentHtml = '';

            if (url.includes('socdepoble.net')) {
                // WordPress
                pubDate = $('meta[property="article:published_time"]').attr('content') || $('time.entry-date').attr('datetime');
                authorName = $('meta[name="author"]').attr('content') || $('.author-name').text().trim() || $('a[rel="author"]').text().trim();
                
                $('meta[property="article:tag"]').each((i, el) => { tags.push($(el).attr('content')); });
                $('a[rel="tag"]').each((i, el) => {
                    const txt = $(el).text().trim();
                    if (txt && !tags.includes(txt)) tags.push(txt);
                });

                imageAlt = $('meta[property="og:image:alt"]').attr('content') || $('.wp-post-image').attr('alt') || '';
                
                if (authorName && authorName.includes('Projecte')) {
                    authorName = 'Sóc de Poble';
                    authorRole = 'company';
                    authorType = 'entity';
                } else if (authorName && authorName.includes('Llínàrés')) {
                     authorName = 'Javi Llinares';
                     authorRole = 'freelance';
                     authorType = 'user';
                     authorUserId = '25218ea4-5d7d-4db4-bdc5-7ae035629242';
                }

                title = $('h1.entry-title').text().trim() || $('title').text().replace('- Soc de Poble', '').trim();
                mainContentHtml = $('.entry-content').html();

            } else if (url.includes('rentonar.blogspot')) {
                // Blogger
                pubDate = $('meta[itemprop="datePublished"]').attr('content') || $('abbr.published').attr('title');
                authorName = 'El Rentonar';
                authorRole = 'community';
                authorType = 'entity';
                
                $('.post-labels a').each((i, el) => { categories.push($(el).text().trim()); });

                title = $('h3.post-title').text().trim();
                mainContentHtml = $('.post-body').html();
            }

            if (!mainContentHtml) {
                console.log(`  ⚠️ Omitiendo ID ${post.id}: No se halló el contenedor matriz.`);
                continue;
            }

            const $content = cheerio.load(mainContentHtml);
            $content('script, style, .sharedaddy, .sd-sharing, .wpcnt').remove();
            $content('img').each((_, img) => {
                const dataSrc = $(img).attr('data-src');
                if (dataSrc) $(img).attr('src', dataSrc);
            });

            // Lógica de Subtítulos Heurística
            const firstH2 = $content('h2').first();
            if (firstH2.length > 0) {
                subtitle = firstH2.text().trim();
                firstH2.remove(); 
            } else {
                const firstP = $content('p').first();
                if (firstP.find('strong').length > 0 && firstP.text().length < 150) {
                    subtitle = firstP.text().trim();
                    firstP.remove();
                } else {
                    subtitle = '**[Subtítulo pendiente de IA]**';
                    fallbackSubtitles++;
                }
            }

            const cleanMarkdown = turndownService.turndown($content.html());

            // Ensamblaje Perfecto Sóc de Poble
            const finalPobleMarkdown = `# ${title}\n\n**${subtitle}**\n\n${cleanMarkdown}\n\n🔗 [Llegir original](${url})`;

            let updatePayload = {
                content: finalPobleMarkdown
            };
            if (pubDate) updatePayload.created_at = pubDate;
            if (authorName) updatePayload.author = authorName;
            if (authorName) updatePayload.author_role = authorRole;
            if (authorName) updatePayload.author_type = authorType;
            if (authorUserId) updatePayload.author_user_id = authorUserId;
            
            updatePayload.tags = tags;
            updatePayload.categories = categories;
            if (imageAlt && imageAlt.trim().length > 2) updatePayload.image_alt = imageAlt.trim();

            const { error: updErr } = await supabase.from('posts').update(updatePayload).eq('id', post.id);
            
            if (updErr) {
                console.log(`  🧨 Fallo SQL Update en ID ${post.id}`, updErr.message);
            } else {
                affectedRows++;
                process.stdout.write(`✅ ID ${post.id} `);
            }

        } catch (err) {
            console.log(`  ❌ Fallo Crítico URL en ID ${post.id}: ${err.message}`);
        }
    }

    console.log(`\n\n🎉 INYECCIÓN OMEGA COMPLETADA: ${affectedRows} noticias reconstruidas íntegramente.`);
    console.log(`⚠️ Alertas de UX: ${fallbackSubtitles} artículos necesitan que la IA les genere el subtítulo.`);
}
syncOriginsProd();
