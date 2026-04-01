/* eslint-disable no-unused-vars */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Aplicando parche remoto a Torrente, Cullera y Benialfaquí...");

    const p1 = await supabase.from('towns').update({
        name: 'Benialfaquí',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Planes_%28la_Marina_Alta%29_-_Benialfaqu%C3%AD.jpg',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Planes_%28la_Marina_Alta%29_-_Benialfaqu%C3%AD.jpg',
        population: 30
    }).eq('name', 'Beialfaquí');

    const p2 = await supabase.from('towns').update({
        population: 23753,
        logo_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Escut_de_Cullera.svg',
        image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cullera_desde_el_castillo.jpg?width=800'
    }).eq('uuid', '92960a37-443f-430b-9f92-a9962c3088fa'); // Cullera's UUID

    const p3 = await supabase.from('towns').update({
        population: 87158,
        logo_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Escut_de_Torrent.svg',
        image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Torre_del_castell_de_Torrent.JPG?width=800'
    }).eq('uuid', '41b63236-cd86-45cd-80ee-71c28b36890c'); // Torrent's UUID

    console.log("🔥 INYECCIÓN COMPLETADA. VERIFICANDO AHORA MISMO LA BD...");

    const { data: towns, error } = await supabase
        .from('towns')
        .select(`uuid, name, logo_url, image_url, population`);

    if (error) {
        console.error(error);
        return;
    }

    const missing = towns.filter(t => !t.logo_url || t.logo_url.includes('default') || 
            !t.image_url || t.image_url.includes('general_street') || t.image_url.includes('generic_street') ||
            !t.population || t.population === 0);

    if (missing.length === 0) {
        console.log("✅ AUDITORIA SUPERADA. 100% DATOS VÁLIDOS, 0 NULOS.");
    } else {
        console.log("Quedan problemas:");
        console.table(missing);
    }
}
run();
