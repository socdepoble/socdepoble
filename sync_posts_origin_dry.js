/* eslint-disable */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function syncOriginsDryRun() {
    console.log("Iniciando Motor de Sincronización en modo DRY-RUN (Muestra de 10 posts)...\n");

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, content')
        .ilike('content', '%[Llegir original]%')
        .limit(10); // LIMITAMOS para probar que el parser extrae lo correcto rápido

    if (error) {
        console.error("Error obteniendo posts:", error);
        return;
    }

    for (let post of posts) {
        // Extraer la URL original
        const match = post.content.match(/\[Llegir original\]\((https?:\/\/[^\)]+)\)/);
        if (!match) continue;

        const url = match[1];
        console.log(`\n▶ Procesando ID ${post.id} -> ${url}`);

        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
            });

            if (!response.ok) {
                console.log(`  ❌ Fallo HTTP: ${response.status}`);
                continue;
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            let pubDate = null;
            let author = null;
            let tags = [];
            let categories = [];

            if (url.includes('socdepoble.net')) {
                // Parseo WordPress
                pubDate = $('meta[property="article:published_time"]').attr('content') || $('time.entry-date').attr('datetime');
                author = $('meta[name="author"]').attr('content') || $('.author-name').text().trim() || $('a[rel="author"]').text().trim();
                
                // Extracción de tags (suele haber múltiples metas article:tag)
                $('meta[property="article:tag"]').each((i, el) => {
                    tags.push($(el).attr('content'));
                });
                
            } else if (url.includes('rentonar.blogspot')) {
                // Parseo Blogger
                pubDate = $('meta[itemprop="datePublished"]').attr('content') || $('abbr.published').attr('title');
                author = $('.post-author.vcard .fn').text().trim() || $('meta[itemprop="author"]').attr('content');
                
                // Categorías de Blogger (suelen estar en un bloque particular)
                $('.post-labels a').each((i, el) => {
                    categories.push($(el).text().trim());
                });
            }

            console.log(`  📅 Fecha real: ${pubDate || 'NO ENCONTRADA'}`);
            console.log(`  ✍️  Autor real: ${author || 'NO ENCONTRADO'}`);
            console.log(`  🏷️  Tags WP: ${tags.length > 0 ? tags.join(', ') : 'Ninguno'}`);
            console.log(`  🗂️  Categorías Blogger: ${categories.length > 0 ? categories.join(', ') : 'Ninguna'}`);

        } catch (err) {
            console.log(`  ❌ Fallo de Parseo/Fetch: ${err.message}`);
        }
    }
}
syncOriginsDryRun();
