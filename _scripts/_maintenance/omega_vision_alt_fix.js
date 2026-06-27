import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no configurado en .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
});

// Configuración de Gemini (L'Ull del Mestre)
const GOOGLE_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes('your_new_gemini_api_key_here')) {
    console.error('❌ Error: VITE_GEMINI_API_KEY no configurado con un valor válido en .env');
    process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

/**
 * Función que descarga la imagen y le pide a Gemini que la describa en Valencià.
 */
async function generateAltText(imageUrl) {
    try {
        // Validación básica de URL
        if (!imageUrl || (!imageUrl.startsWith('http') && !imageUrl.startsWith('/storage'))) {
            return null;
        }

        // Si es una URL relativa de Supabase, la convertimos a absoluta
        let finalUrl = imageUrl;
        if (imageUrl.startsWith('/storage/v1/object/public/')) {
            finalUrl = `${supabaseUrl}${imageUrl}`;
        }

        console.log(`[L'Ull del Mestre] 👀 Observant: ${finalUrl}`);

        const response = await fetch(finalUrl);
        if (!response.ok) {
            console.warn(`⚠️ Error al descarregar imatge: ${response.status} ${response.statusText}`);
            return "Imatge d'arxiu (No accessible)";
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get('content-type') || 'image/jpeg';

        // LLamada a Gemini
        const systemInstruction = `
        Ets 'L'Ull del Mestre', un analista de 'Sóc de Poble'.
        La teua missió és mirar eixa imatge i descriure-la d'una manera clara i accessible (atribut ALT per a invidents).
        Regles:
        1. Sigues curt i descriptiu (màxim 15-20 paraules).
        2. Escriu SEMPRE en un Valencià neutre, natural i correcte (Normativa AVL).
        3. No comences dient "Açò és una imatge de...". Ves directe al subjecte. (Ex: "Una paella gran cuinant-se a foc lent pler a l'aire lliure.")
        4. Si veus text dins de la imatge que siga important, unix-lo a la descripció.
        `;

        const result = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { inlineData: { data: buffer.toString("base64"), mimeType: mimeType } },
                        { text: systemInstruction }
                    ]
                }
            ]
        });

        const textResponse = result.text().trim();
        // Netejem possibles cometes o punts finals rars
        return textResponse.replace(/^['"]|['"]$/g, '').trim();

    } catch (e) {
        console.error(`❌ Error d'IA processant ${imageUrl}:`, e.message);
        return null;
    }
}

async function runHealer() {
    console.log("=====================================================");
    console.log("🌟 INICIANT OMEGA VISION ALT HEALER (L'Ull del Mestre)");
    console.log("=====================================================\n");

    try {
        // Buscar posts que tengan imagen PERO su image_alt sea nulo o vacío
        console.log("🔍 Buscant posts sense atribut ALT (image_alt NULL o '')...");
        const { data: posts, error } = await supabase
            .from('posts')
            .select('id, image_url, image_alt')
            .not('image_url', 'is', null)
            .neq('image_url', '')
            .or('image_alt.is.null,image_alt.eq.""'); // Vacío o Nulo

        if (error) throw error;

        if (!posts || posts.length === 0) {
            console.log("✅ Tots els posts tenen el seu ALT. Fantasmes eradicats. Res a fer!");
            return;
        }

        console.log(`🎯 S'han trobat ${posts.length} imatges orfes d'Accessibilitat (A11y).\n`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            console.log(`⏳ [${i + 1}/${posts.length}] Processant Post ID: ${post.id}`);
            
            const altText = await generateAltText(post.image_url);
            
            if (altText && altText !== "Imatge d'arxiu (No accessible)") {
                console.log(`   ✨ Nou ALT generat: "${altText}"`);
                
                // Actualizamos DB
                const { error: updateError } = await supabase
                    .from('posts')
                    .update({ image_alt: altText })
                    .eq('id', post.id);

                if (updateError) {
                    console.error(`   ❌ Error actualitzant post en Supabase:`, updateError.message);
                    failCount++;
                } else {
                    console.log(`   ✅ Guardat a la Base de Dades.`);
                    successCount++;
                }
            } else {
                 // Si no puede leerla por permisos o porque falla, le ponemos un default para tapar el hueco definitivamente
                 console.log(`   ⚠️ No s'ha pogut extraure la màgia. Escrivint patró per defecte.`);
                 await supabase.from('posts').update({ image_alt: "Imatge sense descripció textual" }).eq('id', post.id);
                 failCount++;
            }
            
            // Pausa de cortesía para no reventar Rate Limits (1 segundo)
            await new Promise(r => setTimeout(r, 1000));
            console.log("-----------------------------------------------------");
        }

        console.log("\n=====================================================");
        console.log(`🏁 RESUM DE L'OPERACIÓ:`);
        console.log(`   ✨ Curats amb Intel·ligència Artificial: ${successCount}`);
        console.log(`   ⚠️ Assignats amb text per defecte (Errors): ${failCount}`);
        console.log("=====================================================");

    } catch (e) {
        console.error("FATAL ERROR:", e);
    }
}

runHealer();
