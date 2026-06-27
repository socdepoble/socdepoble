import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'i18n', 'locales');

const SOURCE_LANG = 'va';
const TARGET_LANGUAGES = ['es', 'en', 'gl', 'eu'];

// Max translations per API call to avoid token limit or JSON truncation
const BATCH_SIZE = 40; 

// --- READ ENV MANUALLY (Zero deps) ---
let apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    try {
        const envContent = fs.readFileSync(path.join(ROOT_DIR, '.env'), 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
        if (match && match[1]) {
            apiKey = match[1].trim();
        }
    } catch {
        console.warn("⚠️ No s'ha trobat '.env' o ha fallat la lectura.");
    }
}

if (!apiKey || apiKey === 'your_new_gemini_api_key_here') {
    console.error("❌ ERROR CRÍTIC: No hi ha cap VITE_GEMINI_API_KEY vàlida configurada al .env");
    process.exit(1);
}

// --- UTILS ---

/**
 * Returns an object of flattened dotted paths mapping to their original string values
 */
function flattenObject(ob) {
    var toReturn = {};
    for (var i in ob) {
        if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;
        
        if (typeof ob[i] === 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

/**
 * Paranoiac variable validator: Ensures that both strings contain exactly 
 * the same {{variables}}.
 */
function validateVariables(sourceStr, targetStr) {
    const varRegex = /\{\{([^}]+)\}\}/g;
    const sourceMatches = sourceStr ? [...sourceStr.matchAll(varRegex)].map(m => m[1]).sort() : [];
    const targetMatches = targetStr ? [...targetStr.matchAll(varRegex)].map(m => m[1]).sort() : [];
    
    if (sourceMatches.length !== targetMatches.length) return false;
    for (let i = 0; i < sourceMatches.length; i++) {
        if (sourceMatches[i] !== targetMatches[i]) return false;
    }
    return true;
}

/**
 * Opposite of flattenObject
 */
function unflattenObject(ob) {
    var result = {};
    for (var i in ob) {
        var keys = i.split('.');
        keys.reduce(function(r, e, j) {
            return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? ob[i] : {}) : []), r[e];
        }, result);
    }
    return result;
}

/**
 * Call Gemini REST API directly using fetch.
 */
async function callGemini(systemPrompt, baseObj) {
    const payload = {
        contents: [{ role: 'user', parts: [{ text: JSON.stringify(baseObj, null, 2) }] }],
        system_instruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            temperature: 0.1, // Baja temperatura para precisión en traducción
            response_mime_type: "application/json",
        }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    
    // Fem un retry petit per si falla per red
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Error API (${response.status}): ${err}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!textResponse) throw new Error("No text response from Gemini.");
            
            let parsedObject;
            try {
                parsedObject = JSON.parse(textResponse);
            } catch (jsonErr) {
                throw new Error(`Invalid JSON syntax returned from Gemini: ${jsonErr.message}`);
            }

            // Strict Zod validation: must be an object of strings
            const TranslationSchema = z.record(z.string(), z.string());
            const validation = TranslationSchema.safeParse(parsedObject);

            if (!validation.success) {
                console.error("❌ Zod Validation Error:", JSON.stringify(validation.error.format(), null, 2));
                throw new Error("Gemini response failed structural integrity checks (Zod).");
            }

            return validation.data;
            
        } catch (error) {
            console.error(`⚠️ Intent ${attempt} fallit: ${error.message}`);
            if (attempt === 3) throw error;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

// Prompt mestre segons l'idioma per conservar la "Filosofia Sóc de Poble"
function getSystemPrompt(targetLangCode) {
    const languageNames = {
        'es': 'Castellano (Español)',
        'en': 'Inglés (English)',
        'gl': 'Gallego (Galego)',
        'eu': 'Euskera (Basque)'
    };
    
    const targetLang = languageNames[targetLangCode] || targetLangCode;
    
    return `Tú eres el "Motor de Traducción Omega" del ecosistema rural "Sóc de Poble".
Tu misión es traducir el siguiente objeto JSON (diccionario clave: valor) del valenciano estricto al ${targetLang}.

DIRECTIVAS ESTRICTAS DE TRADUCCIÓN (TRELLAT):
1. Devuelve ÚNICAMENTE código JSON válido. Sin markdown formatting (\`\`\`json etc) externo. La API ya espera JSON MIME type.
2. NUNCA modifiques las claves del JSON (los nombres de las propiedades a la izquierda de los dos puntos).
3. Mantén INTACTAS las variables de interpolación como {{count}}, {{name}}, {{human}}, etc.
4. MANTÉN INTACTAS las etiquetas HTML como <span class="text-white">, <b>, <i>.
5. FILOSOFÍA RURAL (PALABRAS CLAVE PROTEGIDAS):
   - "Sóc de Poble" -> NUNCA SE TRADUCE. Es el nombre del proyecto.
   - "Trellat" -> Se puede traducir como "Sentido Común" / "Common Sense" / "Senso Común" / "Sen" (según el idioma), pero valora si dejarlo como "Trellat" aporta el toque rural (especialmente en "Filtre Trellat"). En español puedes dejarlo como Trellat o Sentido Común.
   - "Bategat" / "Bategar" -> En español: "Latido" / "Latir". En inglés: "Heartbeat" / "Beat". Mantén la metáfora rural de latir en red.
   - "Mas" / "Masia" -> Traduce a conceptos análogos de la casa rural u origen de soberanía digital (ej. The Farm, El Cortijo/Masía, La Casería, Baserria).
   - "Foraster" -> Forastero, Visitor, Forasteiro, Kanpotarra.
   - "IAIA MarIA" o "MArIA" -> NO se traducen, son nombres propios. "Tia Maria", "El Cronista", "Rúper Ratón" tampoco si van en mayúscula (o se adapta ligerísimamente, ej: The Chronicler).
   - "Mur" -> Muro / Wall.
   
Asegúrate de que la traducción en ${targetLang} sea natural, mantenga un tono cercano, amable y "de pueblo" (rural, acogedor).`;
}

// --- MAIN RUNNER ---
async function runAutoTranslator() {
    console.log(`\n🚜 INICIANT MOTOR DE TRADUCCIÓ (OMEGA TRANSLATE)`);
    console.log(`=================================================`);
    
    // 1. Carregar Source
    const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
    if (!fs.existsSync(sourcePath)) {
        console.error(`❌ ERROR: L'arxiu origen ${sourcePath} no existeix.`);
        process.exit(1);
    }
    
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const flatSource = flattenObject(sourceData);
    const sourceKeys = Object.keys(flatSource);
    
    console.log(`📊 Font de la Veritat [${SOURCE_LANG.toUpperCase()}]: ${sourceKeys.length} cadenes trobades.\n`);

    for (const targetLang of TARGET_LANGUAGES) {
        console.log(`🌍 Processant idioma [${targetLang.toUpperCase()}]...`);
        const targetPath = path.join(LOCALES_DIR, `${targetLang}.json`);
        
        let targetData = {};
        if (fs.existsSync(targetPath)) {
            targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        }
        
        const flatTarget = flattenObject(targetData);
        
        // 2. Comprovar cadenes faltants
        const missingKeys = [];
        for (const key of sourceKeys) {
            if (flatTarget[key] === undefined || flatTarget[key] === "") {
                missingKeys.push(key);
            }
        }
        
        if (missingKeys.length === 0) {
            console.log(`   ✅ Tot sincronitzat. No falten traduccions per a ${targetLang}.`);
            continue;
        }
        
        console.log(`   ⏳ Falten ${missingKeys.length} cadenes. Preparant peticions via Gemini...`);
        
        // 3. Processar per Batches
        for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
            const batchKeys = missingKeys.slice(i, i + BATCH_SIZE);
            const batchObjectToTranslate = {};
            
            for (const key of batchKeys) {
                batchObjectToTranslate[key] = flatSource[key];
            }
            
            console.log(`      ... Traduïnt batch (${i + 1} a ${Math.min(i + BATCH_SIZE, missingKeys.length)} de ${missingKeys.length})`);
            
            try {
                const translatedBatchFlat = await callGemini(getSystemPrompt(targetLang), batchObjectToTranslate);
                
                // Merge batch into flat target
                for (const key of batchKeys) {
                    if (translatedBatchFlat[key]) {
                        const sourceVal = batchObjectToTranslate[key];
                        const targetVal = translatedBatchFlat[key];
                        
                        if (!validateVariables(sourceVal, targetVal)) {
                            console.warn(`         ⚠️ Variables trencades a [${key}]. Gemini ha alterat les {{}}. Ometent...`);
                            console.warn(`           Origen: ${sourceVal}`);
                            console.warn(`           Destí:  ${targetVal}`);
                        } else {
                            flatTarget[key] = targetVal;
                        }
                    } else {
                        console.warn(`         ⚠️ Gemini no ha retornat la clau: ${key}. (Es manté buida)`);
                    }
                }
            } catch (err) {
                console.error(`      ❌ Fallada en aquest batch. S'ometran aquestes cadenes fins la pròxima execució.`);
                console.error(err);
            }
        }
        
        // 4. Desrefer i Guardar Arxiu
        
        // Una manera mes neta de guardar és mantenir l'estructura de 'sourceData' com a guia
        // Reconstruïm creant un nou object flat seguint l'ordre de sourceKeys
        const finalFlatTarget = {};
        for (const key of sourceKeys) {
            finalFlatTarget[key] = flatTarget[key] || "";
        }
        
        const restructuredTargetData = unflattenObject(finalFlatTarget);
        
        fs.writeFileSync(targetPath, JSON.stringify(restructuredTargetData, null, 2), 'utf8');
        console.log(`   💿 Guardat amb èxit -> ${targetLang}.json\n`);
    }
    
    console.log(`✅ Motor Omega (Translation) finalitzat! Les llengües ja parlen alhora.`);
}

runAutoTranslator();
