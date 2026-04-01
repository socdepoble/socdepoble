/* eslint-disable no-unused-vars */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const { data: towns, error } = await supabase
        .from('towns')
        .select(`uuid, name, logo_url, image_url, population`)
        .order('name', { ascending: true });

    towns.forEach(t => {
        if (!t.logo_url || t.logo_url.includes('default') || 
            !t.image_url || t.image_url.includes('general_street') || t.image_url.includes('generic_street') ||
            !t.population || t.name === 'Benialfaquí' || t.name === 'Torrent' || t.name === 'Cullera') {
            console.log(t.name);
            console.log(' - logo:', t.logo_url);
            console.log(' - image:', t.image_url);
            console.log(' - pop:', t.population);
        }
    });
}
run();
