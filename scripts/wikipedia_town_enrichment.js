/**
 * scripts/wikipedia_town_enrichment.js
 * SÓC DE POBLE - ENRIQUIMENT AUTOMÀTIC DE DADES MUNICIPALS
 * (Basat en l'Auditoria Qwen V10.33)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// Usem la SERVICE_ROLE clau o la ANON (però necessitarem permisos RLS si usem anon)
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY; 

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ ERROR: Falten variables d\'entorn a .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TARGET_TOWNS = [
    'La Torre de les Maçanes',
    'Cocentaina',
    'Muro d\'Alcoi',
    'Penàguila',
    'Relleu',
    'Benifallim',
    'Tibi',
    'Xixona',
    'Agost',
    'Sella',
    'Orxeta',
    'Alcoleja'
];

async function fetchWikipediaData(townName) {
    try {
        const searchQuery = encodeURIComponent(townName);
        const summaryRes = await fetch(`https://ca.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`);
        
        if (!summaryRes.ok) {
            console.warn(`⚠️  No s'ha trobat ${townName} a Wikipedia CA`);
            const summaryResES = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`);
            if (!summaryResES.ok) return null;
            return await summaryResES.json();
        }
        
        return await summaryRes.json();
    } catch (error) {
        console.error(`❌ Error consultant Wikipedia per a ${townName}:`, error.message);
        return null;
    }
}

async function fetchTownShield(townName) {
    try {
        const queries = [
            `Escut de ${townName}.svg`,
            `Escut de ${townName}.png`,
            `Coat of arms of ${townName}.svg`
        ];
        
        for (const query of queries) {
            const encodedQuery = encodeURIComponent(query);
            const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedQuery}&prop=imageinfo&iiprop=url&format=json&origin=*`);
            
            const data = await res.json();
            const pages = data.query?.pages;
            
            if (pages) {
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1') {
                    const url = pages[pageId].imageinfo?.[0]?.url;
                    if (url) return url;
                }
            }
        }
        return null;
    } catch (error) {
        console.error(`❌ Error obtenint escut per a ${townName}:`, error.message);
        return null;
    }
}

function normalizeWikimediaUrl(url) {
    if (!url) return url;
    let normalized = decodeURIComponent(url.trim());
    if (normalized.startsWith('//')) normalized = 'https:' + normalized;
    if (normalized.includes('wikimedia.org')) {
        if (normalized.includes('/thumb/')) {
            return normalized.replace(/\/\d+px-/g, '/500px-');
        }
        const filenameMatch = normalized.match(/File:(.+)$/);
        if (filenameMatch) {
            const filename = filenameMatch[1].split('?')[0];
            return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(filename)}&w=500`;
        }
    }
    return normalized;
}

async function updateTown(townId, updates) {
    const { error } = await supabase
        .from('towns')
        .update(updates)
        .eq('uuid', townId);
    if (error) {
        console.error(`❌ Error actualitzant town ${townId}:`, error.message);
        return false;
    }
    return true;
}

async function enrichTowns() {
    console.log('🚀 Iniciant enriquiment de municipis amb Wikipedia...\n');
    
    const { data: towns, error } = await supabase
        .from('towns')
        .select('uuid, id, name, logo_url, image_url');
    
    if (error) {
        console.error('❌ Error obtenint municipis:', error.message);
        process.exit(1);
    }
    
    console.log(`📊 Trobats ${towns.length} municipis a la base de dades\n`);
    
    const townsToEnrich = towns.filter(t => !t.logo_url || !t.image_url || TARGET_TOWNS.some(target => t.name.includes(target)));
    console.log(`🎯 Municipis a enriquir: ${townsToEnrich.length}\n`);
    
    let success = 0, failed = 0, noData = 0;
    
    for (const town of townsToEnrich) {
        console.log(`🔍 Processant: ${town.name}...`);
        
        const wikiData = await fetchWikipediaData(town.name);
        if (!wikiData) {
            console.log(`   ⚠️  No s'han trobat dades a Wikipedia`);
            noData++;
            continue;
        }
        
        const shieldUrl = await fetchTownShield(town.name);
        const updates = {};
        
        if (shieldUrl) {
            updates.logo_url = normalizeWikimediaUrl(shieldUrl);
            console.log(`   ✅ Escut trobat: ${updates.logo_url}`);
        }
        
        if (wikiData.thumbnail?.source) {
            updates.image_url = normalizeWikimediaUrl(wikiData.thumbnail.source);
            console.log(`   ✅ Imatge trobada: ${updates.image_url}`);
        }
        
        if (Object.keys(updates).length > 0) {
            const isSuccess = await updateTown(town.uuid || town.id, updates);
            if (isSuccess) {
                console.log(`   🎉 Actualitzat amb èxit\n`);
                success++;
            } else {
                console.log(`   ❌ Error actualitzant\n`);
                failed++;
            }
        } else {
            console.log(`   ⏭️  Sense noves dades\n`);
            noData++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n=========================================');
    console.log('📈 INFORME FINAL D\'ENRIQUIMENT');
    console.log('=========================================');
    console.log(`✅ Èxits: ${success} | ❌ Fallits: ${failed} | ⚠️ Sense dades: ${noData}`);
}

enrichTowns().catch(err => {
    console.error('❌ Error fatal:', err);
    process.exit(1);
});
