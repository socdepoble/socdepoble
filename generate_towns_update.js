import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getWikiInfo(townName) {
    let qId = null;
    let desc = null;
    
    // Attempt CA
    let summaryRes = await fetch(`https://ca.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`).catch(()=>null);
    if (!summaryRes || !summaryRes.ok) {
        // Attempt ES
        summaryRes = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`).catch(()=>null);
    }
    
    if (summaryRes && summaryRes.ok) {
        const summary = await summaryRes.json();
        qId = summary.wikibase_item;
        desc = summary.extract;
    }

    let pop = null;
    let logo = null;
    let image = null;

    if (qId) {
        // Fetch Wikidata for population (P1082), flag (P41), shield (P94), image (P18)
        const wdRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qId}&props=claims&format=json`).catch(()=>null);
        if (wdRes && wdRes.ok) {
            const wd = await wdRes.json();
            const claims = wd.entities[qId]?.claims || {};
            
            if (claims.P1082) { // Population
                const amount = claims.P1082[0].mainsnak.datavalue.value.amount;
                pop = parseInt(amount.replace('+', ''));
            }
            
            // Try Shield P94
            if (claims.P94) {
                const fileName = claims.P94[0].mainsnak.datavalue.value;
                logo = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
            } else if (claims.P41) { // flag
                const fileName = claims.P41[0].mainsnak.datavalue.value;
                logo = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
            }

            if (claims.P18) { // Image
                const fileName = claims.P18[0].mainsnak.datavalue.value;
                image = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=800`;
            }
        }
    }
    
    return { pop, logo, image, desc };
}

async function run() {
    console.log("Fetching towns...");
    const { data: towns, error } = await supabase
        .from('towns')
        .select('uuid, name, logo_url, image_url, population');
        
    if (error) {
        console.error("Error fetching towns:", error);
        return;
    }

    console.log(`Found ${towns.length} towns. Auditing...`);

    const toUpdate = [];

    // Filter towns that need update
    const needsUpdate = towns.filter(t => 
        !t.population || t.population === 0 ||
        !t.logo_url || t.logo_url === 'Asset=default_logo.png' ||
        !t.image_url || t.image_url.includes('generic_street') || t.image_url.includes('general_street')
    );

    console.log(`Needs update: ${needsUpdate.length} towns.`);
    
    let sql = `-- OMEGA-30: PURGA Y ACTUALIZACIÓN LEYENDAS (POBLACIÓN, ESCUDOS, IMÁGENES)\n`;
    sql += `DO $$ \nBEGIN\n`;

    let processed = 0;
    for (const t of needsUpdate) {
        processed++;
        console.log(`[${processed}/${needsUpdate.length}] Fetching wiki for ${t.name}...`);
        const info = await getWikiInfo(t.name);
        
        // Build updates array dynamically
        let updates = [];

        // 1. Population: Si está a 0 o NULL, cogemos la de Wikidata. Si no existe en Wikidata, lo ponemos NULL explícito (como pidió el user en vez de 0). 
        // Si ya tenía > 0, lo respetamos (a menos que prefiramos sobrescribir, pero para ser seguros respetamos > 0, aunque user dijo "datos a ceros.."). 
        // Vamos a sobrescribir siempre si info.pop está presente, porque Wikidata es más preciso.
        if (info.pop) {
            updates.push(`population = ${info.pop}`);
        } else if (t.population === 0) {
            updates.push(`population = NULL`);
        }

        // 2. Logo: Si es nulo o 'Asset=default_logo.png', miramos si Info lo tiene.
        // Si info lo tiene, lo metemos. Si no lo tiene y antes era default_logo, lo ponemos explícito a NULL.
        if (info.logo) {
            updates.push(`logo_url = '${info.logo.replace(/'/g, "''")}'`);
        } else if (t.logo_url === 'Asset=default_logo.png') {
            updates.push(`logo_url = NULL`);
        }

        // 3. Image: Lo mismo.
        if (info.image) {
            updates.push(`image_url = '${info.image.replace(/'/g, "''")}'`);
        } else if (t.image_url === '/assets/general_street.png' || t.image_url === 'Asset=generic_street.png') {
            updates.push(`image_url = NULL`);
        }

        if (updates.length > 0) {
            sql += `  UPDATE public.towns SET ${updates.join(', ')} WHERE uuid = '${t.uuid}';\n`;
        }
        
        // Delay to respect rate limit
        await new Promise(r => setTimeout(r, 100));
    }
    
    sql += `END $$;\n\n`;
    
    // Write SQL
    fs.writeFileSync('supa_omega30_towns_audit.sql', sql);
    console.log("SQL script written to supa_omega30_towns_audit.sql");
}

run();
