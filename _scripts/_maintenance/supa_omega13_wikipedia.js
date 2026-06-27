import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🏺 OMEGA-13: INYECCIÓN DE IDENTIDAD VISUAL WIKIPEDIA (VERSIÓ RELAXADA)
 * Obté un mínim de dues fotos per a cada poble.
 * Aplica una cerca estricta primer, i si no troba res, relaxa els filtres
 * per agarrar qualsevol imatge (encara que siga roïna) com a esquer ('bait') 
 * perquè els usuaris reals es registren i la milloren.
 */

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

// Filtres per a la primera passada (Estricta)
const STRICT_DANGEROUS = ['map', 'mapa', 'loc', 'situación', 'situació', 'location', 'bandera', 'flag', 'escut', 'escudo', 'coat', 'logo', 'emblem', 'símbol', 'cuchara', 'llibre', 'libro', 'book', 'plano', 'document', 'signature', 'firma'];

// Filtres per a la segona passada (Relaxada) - Només evitem logotips i escuts claríssims
const RELAXED_DANGEROUS = ['bandera', 'flag', 'escut', 'escudo', 'coat', 'logo', 'símbol'];

const isPhotoPassable = (urlOrTitle, strict = true) => {
    if (!urlOrTitle) return false;
    const t = urlOrTitle.toLowerCase();
    const words = strict ? STRICT_DANGEROUS : RELAXED_DANGEROUS;
    return !words.some(word => t.includes(word));
};

const isShield = (title) => {
    if (!title) return false;
    const t = title.toLowerCase();
    return t.includes('escut') || t.includes('escudo') || t.includes('coat_of_arms');
};

async function fetchWikipediaVisuals(townName) {
    try {
        console.log(`🔎 Consultando Wikipedia para: ${townName}`);
        
        let photosStrict = [];
        let photosRelaxed = [];
        let shield = null;

        const langs = ['ca', 'es'];
        
        for (const lang of langs) {
            const mediaRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`);
            if (mediaRes.ok) {
                const mediaData = await mediaRes.json();
                const items = mediaData.items || [];
                
                if (!shield) {
                    const shieldItem = items.find(item => isShield(item.title));
                    if (shieldItem && shieldItem.srcset && shieldItem.srcset.length > 0) {
                        shield = normalizeWikipediaUrl(shieldItem.srcset[shieldItem.srcset.length - 1].src);
                    }
                }

                // Filtrar imatges per a les dues passades (només jpg/png, no volem svg per a fotos de poble)
                const imageItems = items.filter(item => item.title && item.title.match(/.*\.(jpg|jpeg|png)$/i) && !isShield(item.title));
                
                for (const pItem of imageItems) {
                    if (pItem.srcset && pItem.srcset.length > 0) {
                        const url = normalizeWikipediaUrl(pItem.srcset[pItem.srcset.length - 1].src);
                        
                        if (isPhotoPassable(pItem.title, true) && !photosStrict.includes(url)) {
                            photosStrict.push(url);
                        }
                        if (isPhotoPassable(pItem.title, false) && !photosRelaxed.includes(url)) {
                            photosRelaxed.push(url);
                        }
                    }
                }
            }
            if (photosStrict.length >= 2 && shield) break;
        }

        // Triem el millor set de fotos: preferim l'estricte, però si no, ens conformem amb el relaxat
        let finalPhotos = photosStrict.length > 0 ? photosStrict : photosRelaxed;

        return {
            photo1: finalPhotos.length > 0 ? finalPhotos[0] : null, 
            photo2: finalPhotos.length > 1 ? finalPhotos[1] : (finalPhotos.length > 0 ? finalPhotos[0] : null),
            shield: shield
        };

    } catch (e) {
        console.error(`⚠️ Error al obtener Wikipedia para ${townName}:`, e.message);
        return { photo1: null, photo2: null, shield: null };
    }
}

async function runOmega13() {
    console.log("🚀 Iniciando Protocolo OMEGA-13 (Extracción Visual Forzada + Esquer de Qualitat)...");

    const { data: towns, error } = await supabase.from('towns').select('id, name');
    if (error) {
        console.error("❌ Error al obtener los pueblos:", error);
        return;
    }

    console.log(`🌍 Se han encontrado ${towns.length} pueblos. Forçant actualització global de fotos...`);

    let updatedCount = 0;

    for (const town of towns) {
        console.log(`\n[Processant] ${town.name}...`);
        
        const visuals = await fetchWikipediaVisuals(town.name);
        
        // 1. Actualitzem la taula `towns`
        let updatePayload = {};
        if (visuals.shield) updatePayload.escudo_url = visuals.shield;
        if (visuals.photo1) updatePayload.image_url = visuals.photo1;

        if (Object.keys(updatePayload).length > 0) {
            await supabase.from('towns').update(updatePayload).eq('id', town.id);
        }

        // 2. Actualitzem el perfil institucional 'Gent de...' amb les dues fotos
        if (visuals.photo1) {
            console.log(`   └─ Sincronitzant perfil 'Gent de...' -> Avatar: Sí | Hero: ${visuals.photo2 ? 'Sí' : 'No'}`);
            const { error: profErr } = await supabase.from('profiles')
                .update({ 
                    avatar_url: visuals.photo1,
                    cover_url: visuals.photo2 || visuals.photo1
                })
                .eq('town_uuid', town.id)
                .ilike('username', 'Gent de%');
            
            if (profErr) {
                console.error(`   └─ Error al actualitzar perfil ${profErr.message}`);
            } else {
                updatedCount++;
            }
        } else {
            console.log(`   └─ ⚠️ No s'han trobat ni fotos roïnes per a aquest poble.`);
        }
    }

    console.log(`\n🎉 Protocolo OMEGA-13 finalizado. ${updatedCount} perfils institucionals de pobles actualitzats.`);
    process.exit(0);
}

runOmega13();
