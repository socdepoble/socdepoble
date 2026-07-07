import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const mediaRegistryPath = path.resolve(process.cwd(), 'public/assets/media_registry.json');
let fileMap = [];

if (fs.existsSync(mediaRegistryPath)) {
    const registry = JSON.parse(fs.readFileSync(mediaRegistryPath, 'utf8'));
    fileMap = registry.media || [];
} else {
    console.error("No es troba media_registry.json");
    process.exit(1);
}

const fuzzyFindBestUrl = (originalUrl) => {
    if (!originalUrl) return null;
    const originalName = path.basename(originalUrl);
    
    const exact = fileMap.find(f => f.filename === originalName);
    if (exact) return exact.path;

    const stripped = originalName.replace(/_[0-9a-f]+(\.[a-z]+)$/i, '$1').replace(/_[0-9]+(\.[a-z]+)$/i, '$1');
    const fuzzy = fileMap.find(f => f.filename === stripped);
    if (fuzzy) return fuzzy.path;

    if (originalName.includes('andreu')) return fileMap.find(f => f.filename.includes('andreu'))?.path;
    if (originalName.includes('beatriz')) return fileMap.find(f => f.filename.includes('beatriz'))?.path;
    if (originalName.includes('pepica')) return fileMap.find(f => f.filename.includes('pepica'))?.path;
    if (originalName.includes('nano')) return fileMap.find(f => f.filename.includes('nano') && f.path.includes('posts'))?.path;

    return null;
};

async function syncTable(tableName, columnToUpdate, idColumn = 'id') {
    const { data, error } = await supabase.from(tableName).select(`${idColumn}, ${columnToUpdate}`);
    if (error) {
        if (error.code !== '42P01') console.error(`Error llegint ${tableName}:`, error.message);
        return;
    }
    
    let updated = 0;
    for (const row of data) {
        if (row[columnToUpdate]) {
            let newVal = null;
            if (typeof row[columnToUpdate] === 'string') {
                const better = fuzzyFindBestUrl(row[columnToUpdate]);
                if (better && better !== row[columnToUpdate]) {
                    newVal = better;
                }
            } else if (Array.isArray(row[columnToUpdate])) {
                let changed = false;
                const newArr = row[columnToUpdate].map(url => {
                    const better = fuzzyFindBestUrl(url);
                    if (better && better !== url) {
                        changed = true;
                        return better;
                    }
                    return url;
                });
                if (changed) newVal = newArr;
            }
            
            if (newVal) {
                const payload = {};
                payload[columnToUpdate] = newVal;
                await supabase.from(tableName).update(payload).eq(idColumn, row[idColumn]);
                updated++;
                console.log(`[${tableName}] Actualitzat registre ${row[idColumn]} -> ${newVal}`);
            }
        }
    }
    console.log(`[${tableName}] Sincronitzats ${updated} registres per a columna '${columnToUpdate}'.`);
}

async function run() {
    console.log("🛠️  Iniciant sincronització de rutes d'imatges amb Supabase...");
    
    await syncTable('posts', 'image_url');
    // await syncTable('posts', 'media_urls'); // Not exists
    
    await syncTable('profiles', 'avatar_url');
    await syncTable('profiles', 'cover_url');
    await syncTable('profiles', 'header_image_url');

    await syncTable('entities', 'avatar_url');
    await syncTable('entities', 'cover_url');
    await syncTable('entities', 'logo_url');

    await syncTable('market_reviews', 'image_url');
    
    // Si tens productes (potser media_assets o items)
    await syncTable('media_assets', 'url');
    await syncTable('items', 'image_url');

    console.log("✅ Totes les rutes han estat verificades i sincronitzades.");
}

run();
