import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adjlvwtxhpclgmnsvwpm.supabase.co';
const supabaseAnonKey = 'sb_publishable_ffKxgLg8RTGZunh0es1o6Q_sfIWknZ9';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const fetchOptions = {
    headers: {
        'User-Agent': 'SocDePobleBot/1.0 (javillinares@gmail.com)'
    }
};

async function downloadImage(url, filepath) {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function processTowns() {
    const { data: towns } = await supabase.from('towns').select('id, name');
    for (const town of towns) {
        const cleanName = town.name.replace("La Torre de les Maçanes", "La Torre");
        const slug = sluggify(cleanName);
        const dir = path.join(process.cwd(), 'public', 'assets', 'uploads', 'poble', slug);
        
        const coverPath = path.join(dir, 'cover.jpg');
        
        if (!fs.existsSync(coverPath)) {
            try {
                let res = await fetch(`https://ca.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(town.name)}`, fetchOptions);
                if (res.status === 404) res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(town.name)}`, fetchOptions);
                
                if (res.ok) {
                    const data = await res.json();
                    let bestImage = data.originalimage?.source || data.thumbnail?.source;
                    if (bestImage && !bestImage.toLowerCase().includes('.svg')) {
                        console.log(`Downloading ${bestImage} for ${town.name}...`);
                        await downloadImage(bestImage, coverPath);
                    }
                }
            } catch (e) {
                console.log(`Error for ${town.name}:`, e.message);
            }
        }
    }
    console.log("Done!");
}

processTowns();
