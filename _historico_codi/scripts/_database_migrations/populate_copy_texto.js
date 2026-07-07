/**
 * scripts/populate_copy_texto.js
 * Omple el camp copy_texto de tots els pobles amb l'URL de la seua pàgina
 * a la Viquipèdia catalana per atribució de llicències (Trellat).
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// Usem la SERVICE_ROLE clau si està disponible, sinó l'anon (però pot donar error de RLS)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY; 

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ ERROR: Falten variables d\'entorn a .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchWikipediaUrl(townName) {
    try {
        const headers = { 'User-Agent': 'SocDePoble/1.0 (https://socdepoble.cat; info@socdepoble.cat)' };
        const queryUrl = `https://ca.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(townName)}&limit=1&format=json&origin=*`;
        const res = await fetch(queryUrl, { headers });
        const data = await res.json();
        
        if (data[3] && data[3].length > 0) {
            return data[3][0];
        }

        console.warn(`⚠️  No s'ha trobat opensearch en CA per ${townName}`);
        
        // Try ES as fallback
        const queryUrlES = `https://es.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(townName)}&limit=1&format=json&origin=*`;
        const resES = await fetch(queryUrlES, { headers });
        const dataES = await resES.json();
        
        if (dataES[3] && dataES[3].length > 0) {
            return dataES[3][0];
        }

        return null;
    } catch (error) {
        console.error(`❌ Error consultant Wikipedia per a ${townName}:`, error.message);
        return null;
    }
}

async function populateCopyTexto() {
    console.log('🚀 Iniciant població de copy_texto des de Wikipedia...\n');
    
    const { data: towns, error } = await supabase
        .from('towns')
        .select('id, uuid, name, copy_texto')
        .order('id');
    
    if (error) {
        console.error('❌ Error obtenint municipis:', error.message);
        process.exit(1);
    }
    
    console.log(`📊 Trobats ${towns.length} municipis a la base de dades\n`);
    
    let success = 0, failed = 0, noData = 0, skipped = 0;
    
    let sqlContent = `-- Actualització automàtica de copy_texto des de Wikipedia\n-- Generat: ${new Date().toISOString()}\n\n`;
    
    for (const town of towns) {
        if (town.copy_texto && town.copy_texto !== 'EMPTY' && town.copy_texto.startsWith('http')) {
            console.log(`⏭️  ${town.name} ja té copy_texto: ${town.copy_texto}`);
            skipped++;
            continue;
        }

        console.log(`🔍 Processant: ${town.name}...`);
        
        const wikiUrl = await fetchWikipediaUrl(town.name);
        if (!wikiUrl) {
            console.log(`   ⚠️  No s'han trobat dades a Wikipedia per ${town.name}`);
            noData++;
            continue;
        }
        
        // Afegir al fitxer SQL
        const sqlStatement = `UPDATE towns SET copy_texto = '${wikiUrl.replace(/'/g, "''")}' WHERE id = ${town.id};\n`;
        sqlContent += sqlStatement;
        console.log(`   🎉 Generat SQL: ${sqlStatement.trim()}`);
        success++;
        
        // Evitem saturar l'API de Wikipedia
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    fs.writeFileSync(path.join(__dirname, 'update_copy_texto.sql'), sqlContent);
    console.log(`\n💾 Fitxer SQL generat: ${path.join(__dirname, 'update_copy_texto.sql')}`);
    
    console.log('\n=========================================');
    console.log('📈 INFORME FINAL DE POBLACIÓ (copy_texto)');
    console.log('=========================================');
    console.log(`✅ Èxits: ${success} | ⏭️ Omesos: ${skipped} | ❌ Fallits: ${failed} | ⚠️ Sense dades: ${noData}`);
}

populateCopyTexto().catch(err => {
    console.error('❌ Error fatal:', err);
    process.exit(1);
});
