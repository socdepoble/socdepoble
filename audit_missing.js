import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const { data: towns, error } = await supabase
        .from('towns')
        .select(`uuid, name, logo_url, image_url, population`)
        .order('name', { ascending: true });

    if (error) throw error;
    
    const missing = towns.filter(t => !t.logo_url || !t.image_url || !t.population);
    
    console.log(`Pueblos totales: ${towns.length}`);
    console.log(`Pueblos con algún NULO o FALTANTE: ${missing.length}`);
    
    missing.forEach(t => {
        let issues = [];
        if (!t.logo_url) issues.push("LOGO NULO");
        if (!t.image_url) issues.push("IMAGEN NULA");
        if (!t.population) issues.push("POBLACIÓN NULA");
        console.log(`- ${t.name}: ${issues.join(', ')}`);
    });
}
run();
