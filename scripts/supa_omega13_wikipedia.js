import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🏺 OMEGA-13: INYECCIÓN DE IDENTIDAD VISUAL WIKIPEDIA
 * Separa de forma estricta los Escudos Institucionales (Ayuntamientos)
 * de las Fotos Paisajísticas (Avatares de "Gent de...").
 */

// Validar que tenemos la clave de servicio para saltarnos RLS en el script
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan las variables de entorno de Supabase en el archivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const normalizeWikipediaUrl = (url) => {
    if (!url) return null;
    let normalized = url.replace('http:', 'https:').trim();
    if (normalized.includes('wikimedia.org') || normalized.includes('wikipedia.org')) {
        return normalized;
    }
    return `https://${normalized}`;
};

const DANGEROUS_WORDS = ['map', 'mapa', 'loc', 'situación', 'situació', 'location', 'bandera', 'flag', 'escut', 'escudo', 'coat'];

const isRealPhoto = (title) => {
    const t = title.toLowerCase();
    return !DANGEROUS_WORDS.some(word => t.includes(word));
};

const isShield = (title) => {
    const t = title.toLowerCase();
    return t.includes('escut') || t.includes('escudo') || t.includes('coat_of_arms');
};

async function fetchWikipediaVisuals(townName) {
    try {
        console.log(`🔎 Consultando Wikipedia para: ${townName}`);
        
        // 1. Obtener la FOTO PRINCIPAL del Summary (Background Header)
        const summaryRes = await fetch(`https://ca.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`);
        let photo1 = null;
        if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            if (summaryData.thumbnail && summaryData.thumbnail.source) {
                photo1 = normalizeWikipediaUrl(summaryData.thumbnail.source);
            }
        }

        // 2. Obtener el ESCUDO y una FOTO SECUNDARIA de la Media List
        const mediaRes = await fetch(`https://ca.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`);
        let shield = null;
        let photo2 = null;
        
        if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            const items = mediaData.items || [];
            
            // Buscar Escudo
            const shieldItem = items.find(item => isShield(item.title));
            if (shieldItem && shieldItem.srcset && shieldItem.srcset.length > 0) {
                const bestShield = shieldItem.srcset[shieldItem.srcset.length - 1].src;
                shield = normalizeWikipediaUrl(bestShield);
            }

            // Buscar Foto 2 (Avatares ciudadanías)
            const photoItems = items.filter(item => isRealPhoto(item.title) && item.title.match(/.*\.(jpg|jpeg|png)$/i));
            if (photoItems.length > 0) {
                // Pillamos la segunda foto si existe, si no la primera.
                const p2Item = photoItems[1] || photoItems[0];
                if (p2Item && p2Item.srcset && p2Item.srcset.length > 0) {
                    const bestP2 = p2Item.srcset[p2Item.srcset.length - 1].src;
                    photo2 = normalizeWikipediaUrl(bestP2);
                }
            }
        }

        return {
            photo1: photo1 || photo2, // Fallback mutuo
            photo2: photo2 || photo1,
            shield: shield
        };

    } catch (e) {
        console.error(`⚠️ Error al obtener Wikipedia para ${townName}:`, e.message);
        return { photo1: null, photo2: null, shield: null };
    }
}

async function runOmega13() {
    console.log("🚀 Iniciando Protocolo OMEGA-13 (Extracción de Identidades Visuales)...");

    const { data: towns, error } = await supabase.from('towns').select('id, name, logo_url, image_url');
    if (error) {
        console.error("❌ Error al obtener los pueblos:", error);
        return;
    }

    console.log(`🌍 Se han encontrado ${towns.length} pueblos. Evaluando deficiencias...`);

    let updatedCount = 0;

    for (const town of towns) {
        // Condiciones para actualizar: Si no tiene escudo real, o no tiene foto
        const needsShield = !town.logo_url || town.logo_url.includes('default_logo');
        const needsPhoto = !town.image_url || town.image_url.includes('default_image');

        if (needsShield || needsPhoto) {
            const visuals = await fetchWikipediaVisuals(town.name);
            
            let updatePayload = {};
            if (needsShield && visuals.shield) updatePayload.logo_url = visuals.shield;
            if (needsPhoto && visuals.photo1) updatePayload.image_url = visuals.photo1;

            if (Object.keys(updatePayload).length > 0) {
                const { error: updateError } = await supabase.from('towns').update(updatePayload).eq('id', town.id);
                if (updateError) {
                    console.error(`❌ Falló la actualización de la tabla TOWNS para ${town.name}:`, updateError.message);
                } else {
                    console.log(`✅ ${town.name}: Escudo (${visuals.shield ? 'Sí' : 'No'}), FotoFondo (${visuals.photo1 ? 'Sí' : 'No'})`);
                }
            }

            // Opcional: Actualizar o prever la Foto 2 para el perfil genérico "Gent de..."
            if (visuals.photo2) {
                console.log(`   └─ Foto 2 (Avatar 'Gent de...'): ${visuals.photo2}`);
                // Si tienes los perfiles de "Gent de..." creados en la DB, descomenta esto para actualizarlos:
                /*
                await supabase.from('profiles')
                    .update({ avatar_url: visuals.photo2 })
                    .eq('town_uuid', town.id)
                    .ilike('username', 'Gent de%');
                */
            }

            updatedCount++;
        }
    }

    console.log(`\n🎉 Protocolo OMEGA-13 finalizado. ${updatedCount} pueblos enriquecidos arquitectónicamente.`);
    process.exit(0);
}

runOmega13();
