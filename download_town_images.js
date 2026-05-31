import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adjlvwtxhpclgmnsvwpm.supabase.co';
const supabaseAnonKey = 'sb_publishable_ffKxgLg8RTGZunh0es1o6Q_sfIWknZ9';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TOWN_DISAMBIGUATIONS = {
    "Agost": "Agost (l'Alacantí)"
};

const isShieldOrMap = (url) => {
  if (!url) return true;
  const lurl = url.toLowerCase();
  return lurl.includes('.svg') || lurl.includes('escut') || lurl.includes('escudo') || 
         lurl.includes('mapa') || lurl.includes('map') || lurl.includes('bandera') || 
         lurl.includes('flag') || lurl.includes('locator') || lurl.includes('location') ||
         lurl.includes('situaci') || lurl.includes('localitzaci') || lurl.includes('localizaci') ||
         lurl.includes('grafic') || lurl.includes('gràfic') || lurl.includes('gráfic') ||
         lurl.includes('grafica') || lurl.includes('gráfica') || lurl.includes('graph') ||
         lurl.includes('chart') || lurl.includes('diagram') || lurl.includes('climogram') ||
         lurl.includes('demografia') || lurl.includes('poblacio') || lurl.includes('population') ||
         lurl.includes('plano') || lurl.includes('plan');
};

const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');

async function downloadImage(url, filepath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function getTownImages(townName, lang = 'ca') {
    const queryName = TOWN_DISAMBIGUATIONS[townName] || townName;
    try {
        let endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(queryName)}`;
        let response = await fetch(endpoint).catch(() => null);
        
        if ((!response || !response.ok) && lang === 'ca') {
            endpoint = `https://es.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`;
            response = await fetch(endpoint).catch(() => null);
        }

        if (!response || !response.ok) return [];

        const data = await response.json();
        const items = data.items || [];

        return items
            .filter(item => item.type === 'image')
            .map(item => {
                let url = item.srcset?.[0]?.src || item.title;
                if (url && url.startsWith('//')) url = 'https:' + url;
                return { url };
            })
            .filter(img => {
                if (!img.url || !img.url.includes('upload.wikimedia.org')) return false;
                const lurl = img.url.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return !isShieldOrMap(lurl);
            });
    } catch (error) {
        return [];
    }
}

async function getTownSummary(townName, lang = 'ca') {
    const queryName = TOWN_DISAMBIGUATIONS[townName] || townName;
    try {
        let endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(queryName)}`;
        let response = await fetch(endpoint).catch(() => null);

        if ((!response || response.status === 404) && lang === 'ca') {
            endpoint = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`;
            response = await fetch(endpoint).catch(() => null);
        }

        if (!response || !response.ok) return null;
        const data = await response.json();
        return {
            extract: data.extract,
            thumbnail: data.thumbnail?.source,
            original_image: data.originalimage?.source,
        };
    } catch (error) {
        return null;
    }
}

async function processTowns() {
    console.log("Fetching towns from Supabase...");
    const { data: towns, error } = await supabase.from('towns').select('id, name');
    if (error) {
        console.error("Error fetching towns", error);
        return;
    }

    const dict = {};

    for (const town of towns) {
        const cleanName = town.name.replace("La Torre de les Maçanes", "La Torre");
        const slug = sluggify(cleanName);
        const dir = path.join(process.cwd(), 'public', 'assets', 'uploads', 'poble', slug);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const coverPath = path.join(dir, 'cover.jpg');
        
        console.log(`Processing ${town.name} (${slug})...`);
        
        if (!fs.existsSync(coverPath)) {
            const summary = await getTownSummary(town.name);
            let bestImage = summary?.original_image || summary?.thumbnail;
            
            if (isShieldOrMap(bestImage) || !bestImage) {
                const gallery = await getTownImages(town.name);
                if (gallery.length > 0) bestImage = gallery[0].url;
            }

            if (bestImage) {
                console.log(`Downloading ${bestImage} for ${town.name}...`);
                try {
                    await downloadImage(bestImage, coverPath);
                } catch (e) {
                    console.log(`Failed to download for ${town.name}:`, e.message);
                }
            } else {
                console.log(`No valid image found for ${town.name}`);
            }
        } else {
            console.log(`Image already exists for ${town.name}`);
        }
        
        // Let's also save the summary so we don't have to fetch it
        const summaryCachePath = path.join(dir, 'summary.txt');
        if (!fs.existsSync(summaryCachePath)) {
            const summary = await getTownSummary(town.name);
            if (summary && summary.extract) {
                fs.writeFileSync(summaryCachePath, summary.extract);
            }
        }
    }
    console.log("Done!");
}

processTowns();
