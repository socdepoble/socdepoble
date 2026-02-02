import { logger } from '../utils/logger';

/**
 * GeminiService: Intel·ligència amb Trellat [V1.2]
 * Gestiona les 4 personalitats d'IA especialitzades en el món rural.
 */
class GeminiService {
    constructor() {
        this.apiKey = localStorage.getItem('sp_gemini_api_key') || "";
        this.model = "gemini-1.5-flash";

        this.PERSONAS = {
            AGRONOM: {
                name: "L'Agrònom Virtual",
                role: "Diagnòstic i consells de cultiu IVIA",
                systemPrompt: `Ets l'Agrònom de "Sóc de Poble". 
                Context: Expert en cultius mediterranis (olivera, ametler, vinya). 
                Lèxic: Obligatori utilitzar "Ull de gall" per al repiló, "La potra" per a tumors, "Esmunyir" per a recollir olives.
                To: Pragmatic, local i savi. Si no saps una cosa, convida a preguntar al veí o a l'IVIA.`
            },
            CUINERA: {
                name: "Cuina d'Aprofitament",
                role: "Receptes i gestió d'excedents",
                systemPrompt: `Ets la Cuinera de "Sóc de Poble", hereva del receptari tradicional.
                Prioritat: Borreta, Olleta, Minxos, i aprofitament de la Morca.
                Estil: No malbarates res. To familiar i protector.`
            },
            CAPATAS: {
                name: "El Capatàs",
                role: "Planificació de feines del camp",
                systemPrompt: `Ets El Capatàs de "Sóc de Poble". 
                Tasca: Planificar feines segons l'estació i l'oratge. 
                Estil: Directe, pragmàtic, amb "Trellat". No vols fer perdre el temps a ningú.`
            },
            ARXIVER: {
                name: "L'Arxiver",
                role: "Traductor de burocràcia a valencià de carrer",
                systemPrompt: `Ets L'Arxiver de "Sóc de Poble". 
                Tasca: Traduir cartes de l'ajuntament o el banc. 
                To: Explica en 3 punts: 1) Què volen? 2) Què has de fer? 3) Quan costa? Sense paraules rares.`
            }
        };
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('sp_gemini_api_key', key);
    }

    /**
     * Crida al model Gemini amb una personalitat específica.
     */
    async ask(personaKey, query) {
        const persona = this.PERSONAS[personaKey];
        if (!persona) throw new Error(`Persona ${personaKey} no trobada.`);

        if (!this.apiKey) {
            logger.warn("[Gemini] API Key no configurada. Mode sobirania activat.");
            return {
                error: true,
                message: "Xe, falta la clau del tractor! Necessites configurar la teua API Key de Gemini per parlar amb l'expert."
            };
        }

        logger.log(`[Gemini] Consultant a ${persona.name}...`);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: query }]
                    }],
                    system_instruction: {
                        parts: [{ text: persona.systemPrompt }]
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "Error en la API de Gemini");
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No hi ha resposta.";

            // Batec hàptic d'èxit (simulat o via hapticService)
            if (navigator.vibrate) navigator.vibrate(50);

            return {
                error: false,
                text: text,
                persona: persona.name
            };
        } catch (err) {
            logger.error(`[Gemini] Error consultant a ${persona.name}:`, err);
            return {
                error: true,
                message: "L'Expert està fent la migdiada. Torna-ho a provar en un moment."
            };
        }
    }
}

export const geminiService = new GeminiService();
