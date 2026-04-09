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

// Remover links a imagenes vacías (base64 lazyload scripts)
turndownService.addRule('remove-base64', {
    filter: function (node) {
        return node.nodeName === 'IMG' && node.getAttribute('src') && node.getAttribute('src').startsWith('data:image');
    },
    replacement: function () { return ''; }
});

async function testSingleClone() {
    console.log("🔬 MODO LABORATORIO: Clonación Extrema 🔬");

    // Pillamos exacto el post 10008 que sabemos que tiene H2 ocultos
    const url = 'https://socdepoble.net/2023/02/28/la-coordinadora-presenta-allegacions-contra-la-macroplanta-solar-de-benifallim/';

    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        const html = await response.text();
        const $ = cheerio.load(html);

        let title = $('h1.entry-title').text().trim();
        let mainContentHtml = $('.entry-content').html();
        const $content = cheerio.load(mainContentHtml);

        // Limpiar basura WP
        $content('script, style, .sharedaddy, .sd-sharing, .wpcnt').remove();

        // Arreglar lazy-load images de WordPress
        $content('img').each((_, img) => {
            const dataSrc = $(img).attr('data-src');
            if (dataSrc) $(img).attr('src', dataSrc);
        });

        // Buscar Subtítulo: Primer H2 o un P fuerte
        let subtitle = '';
        const firstH2 = $content('h2').first();
        if (firstH2.length > 0) {
            subtitle = firstH2.text().trim();
            firstH2.remove(); 
        }

        const cleanMarkdown = turndownService.turndown($content.html());

        console.log(`\n📝 TÍTULO: ${title}`);
        console.log(`💬 SUBTÍTULO: ${subtitle ? subtitle : '[¡ALERTA IA! Requiere inventar subtítulo]'}`);
        console.log(`\n📄 MARKDOWN PERFECCIONADO:\n`);
        console.log(cleanMarkdown.substring(0, 800));

    } catch (e) {
        console.error("Fallo:", e.message);
    }
}
testSingleClone();
