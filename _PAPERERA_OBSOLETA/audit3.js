import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Conectando y extrayendo 43 pueblos...");
    const { data: towns, error } = await supabase
        .from('towns')
        .select(`uuid, name, logo_url, image_url, population`)
        .order('name', { ascending: true });

    if (error) {
        console.error("Error", error);
        return;
    }

    let found = false;
    towns.forEach(t => {
        if (!t.logo_url || t.logo_url.includes('default') || 
            !t.image_url || t.image_url.includes('general_street') || t.image_url.includes('generic_street') ||
            !t.population || t.population === 0) {
            console.log(`FALTA DATO EN: ${t.name} -> logo: ${t.logo_url} | image: ${t.image_url} | pop: ${t.population}`);
            found = true;
        }
    });

    if (!found) {
        console.log("✅ AUDITORIA SUPERADA. 0 NULOS.");
    }
}
run();
