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

async function processTowns() {
    const { data: towns } = await supabase.from('towns').select('id, name');
    const summaries = {};
    
    for (const town of towns) {
        const cleanName = town.name.replace("La Torre de les Maçanes", "La Torre");
        const slug = sluggify(cleanName);
        
        try {
            let res = await fetch(`https://ca.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(town.name)}`, fetchOptions);
            if (res.status === 404) res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(town.name)}`, fetchOptions);
            
            if (res.ok) {
                const data = await res.json();
                if (data.extract) {
                    summaries[slug] = data.extract;
                    console.log(`Fetched summary for ${town.name}`);
                }
            }
        } catch (e) {
            console.log(`Error for ${town.name}:`, e.message);
        }
    }
    
    fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'wikipedia_summaries.json'), JSON.stringify(summaries, null, 2));
    console.log("Done!");
}

processTowns();
