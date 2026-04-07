import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Extrayendo pueblos con comarca faltante o genérica...");
    const { data: towns, error } = await supabase
        .from('towns')
        .select(`uuid, name, comarca`)
        .order('name', { ascending: true });

    if (error) {
        console.error("Error", error);
        return;
    }

    const missing = towns.filter(t => !t.comarca || t.comarca.toLowerCase().includes('sense') || t.comarca.toLowerCase().includes('pioner'));
    
    console.log("Pueblos con comarca faltante:");
    console.table(missing);
}
run();
