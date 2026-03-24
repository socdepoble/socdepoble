/**
 * SCRIPT DE SANEJAMENT DE BASE DE DADES - SÓC DE POBLE
 * 
 * PROPÒSIT: Esborrar els perfils "fantasmes" de Sóc de Poble, El Rentonar i Damià
 * que s'han creat a PRODUCCIÓ de manera incorrecta, i deixar només els nous
 * amb els seus usernames nets (@socdepoble, @rentonar, @damianllorens).
 *
 * COM EXECUTAR (OPCIÓ 1 - NODEJS):
 * 1. Has de posar SUPABASE_SERVICE_ROLE_KEY al fitxer .env (o exportar-la ací env).
 * 2. Executar: node scripts/neteja_fantasmes_supabase.mjs
 *
 * COM EXECUTAR (OPCIÓ 2 - SQL DASHBOARD SUPABASE):
 * És millor anar al SQL Editor de Supabase i fer colar el fitxer neteja.sql adjunt.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === process.env.VITE_SUPABASE_ANON_KEY) {
    console.warn("⚠️ ALERTA: Estàs usant la ANON KEY (o no hi ha clau). Supabase no et deixarà esborrar perfils aliens via API per RLS. Et recomane usar l'SQL adjunt al Dashboard.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function purgeGhosts() {
    console.log("🏺 Iniciant Purgat Fantasmes de la Matriu...");

    // 1. Eliminar Pàgines Errònies de "El Rentonar" i "Sóc de Poble"
    const { data: ghosts, error: fetchErr } = await supabase
        .from('profiles')
        .select('id, full_name, username, role')
        .or('full_name.ilike.%Rentonar Empresa%,full_name.ilike.%Rentonar Grup%,username.ilike.%node_sdp_oficial%');

    if (fetchErr) {
        console.error("❌ Error llegint fantasmes:", fetchErr);
        return;
    }

    if (!ghosts || ghosts.length === 0) {
        console.log("✅ Cap fantasma detectat. La base de dades ja està neta.");
    } else {
        console.log(`💀 S'han detectat ${ghosts.length} fantasmes. Procedint a l'eliminació...`);
        for (const ghost of ghosts) {
            console.log(`   - Esborrant: ${ghost.full_name} (${ghost.username || 'Sense handle'})`);
            const { error: delErr } = await supabase.from('profiles').delete().eq('id', ghost.id);
            if (delErr) {
                console.error(`     ❌ Error esborrant ${ghost.id}:`, delErr);
            } else {
                console.log(`     ✅ Purgat.`);
            }
        }
    }
    
    // 2. Comprovar i netejar Damián
    const { data: damians } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .ilike('full_name', '%Dami%Llorens%');
        
    if (damians) {
        for (const d of damians) {
            if (d.username !== 'damianllorens') {
                console.log(`   - Esborrant Damià fantasma antic: ${d.username}`);
                await supabase.from('profiles').delete().eq('id', d.id);
            }
        }
    }

    console.log("🚀 Neteja finalitzada. Els nodes purs de Sistema ('@socdepoble', '@rentonar') estan protegits al codi ara.");
}

purgeGhosts();
