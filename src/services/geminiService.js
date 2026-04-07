import { logger } from "../utils/logger";
import { supabase } from "../supabaseClient";
import { AGENTS_MAP } from "../config/agentsMap";
import DOMPurify from 'dompurify';

/**
 * GeminiService: Intel·ligència amb Trellat [V1.2]
 * Gestiona les 4 personalitats d'IA especialitzades en el món rural.
 */
class GeminiService {
  constructor() {
    // La clau API ara s'injecta i gestiona de forma segura des del backend (Supabase Edge Function).
    // Això oculta la clau completament de l'usuari final (Fix O2 - Arquitectura Segura).
    this.model = "gemini-1.5-pro"; // MAX POWER (AI Ultra Plan)

    this.PERSONAS = AGENTS_MAP;
  }

  // --- MESTRE UTILS ---
  
  /**
   * Translates a URL slug or predictable ID into a persona object.
   * e.g., 'vicent-ferris' -> PERSONAS.AGRONOM
   */
  getPersonaBySlug(slug) {
    if (!slug) return null;
    
    // Normalize slug
    const normalizedId = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Manual overrides for known ID structures
    if (normalizedId.includes('iaia') && !normalizedId.includes('ull') && !normalizedId.includes('archon')) return this.PERSONAS.IAIA;
    if (normalizedId.includes('vicent') || normalizedId.includes('ferris')) return this.PERSONAS.AGRONOM;
    if (normalizedId.includes('pepica') || normalizedId.includes('cuinera')) return this.PERSONAS.CUINERA;
    if (normalizedId.includes('andreu') || normalizedId.includes('capatas')) return this.PERSONAS.CAPATAS;
    if (normalizedId.includes('joan') || normalizedId.includes('batiste')) return this.PERSONAS.ARXIVER;
    if (normalizedId.includes('rato') || normalizedId.includes('super')) return this.PERSONAS.RATO;
    if (normalizedId.includes('sultan')) return this.PERSONAS.SULTAN;
    if (normalizedId.includes('mixa')) return this.PERSONAS.MIXA;
    if (normalizedId.includes('gall')) return this.PERSONAS.GALL;
    if (normalizedId.includes('banana') || normalizedId.includes('nano')) return this.PERSONAS.NANOBANANA;
    if (normalizedId.includes('flash')) return this.PERSONAS.FLASH;
    if (normalizedId.includes('viatjant')) return this.PERSONAS.VIATJANT;
    if (normalizedId.includes('beatriz') || normalizedId.includes('ortega')) return this.PERSONAS.BEATRIZ;
    if (normalizedId.includes('carla') || normalizedId.includes('soriano')) return this.PERSONAS.CARLA;
    if (normalizedId.includes('elena') || normalizedId.includes('popova')) return this.PERSONAS.ELENA;
    if (normalizedId.includes('rebost')) return this.PERSONAS.REBOST;
    if (normalizedId.includes('trellat')) return this.PERSONAS.TRELLAT;
    
    // If not found, search by name or role string includes
    for (const key in this.PERSONAS) {
      const p = this.PERSONAS[key];
      const nameMatch = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (nameMatch.includes(normalizedId) || normalizedId.includes(nameMatch)) {
         return p;
      }
    }
    
    return null;
  }

  // setApiKey fue eliminada completamente por requerimientos de seguridad (No se guardan claves en el cliente)

  getMockResponse(personaKey, query, imageData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) return { error: true, message: "Persona no trobada per a la simulació." };

    if (imageData) {
       return {
         error: false,
         text: `(Simulació Visual) Ai fill meu, que bonica la foto! Però tinc activat el Mode Simulació O2 i no veig res, només siluetes bategades!`,
         persona: persona.name,
         avatarName: persona.avatarName,
         type: persona.type,
         is_mock: true,
       };
    }

    const q = query.toLowerCase();
    const isGenesis = q.includes("genesis") || q.includes("directives") || q.includes("directiva");

    const mockResponses = {
      AGRONOM: isGenesis ? "Xe! El GÈNESI és la llei del camp digital. Tot ha de tindre utilitat social." : "La terra vol trellat. Esmunyeix la blanqueta i cuida la llimera!",
      CUINERA: isGenesis ? "El GÈNESI diu que no es malbarata res, ni un píxel! Utilitat a la cassola." : "Ací no es tira res! Amb eixes sobres et faig un arròs al forn de categoría.",
      CAPATAS: isGenesis ? "Directiva GENESIS: Utilitat Social o purga nuclear. Fila recte." : "Neteja el tros i no perdes el temps. La faena és la faena.",
      ARXIVER: isGenesis ? "El codi GENESIS és la constitució rural. Res de bategats buits." : "Mestre, la burocràcia és densa. Em faran falta tres segells póliza abans de processar el document.",
      RATO: "Cric-cric... He rastrejat el territori en Mode Simulació. Vitaminat!",
      SULTAN: "Buf! Bua! Mode Seguretat Actiu. Protegint la masia de peticions duplicades.",
      MIXA: "Mèu... Vaig saltant de node en node pel Rhizome simulat.",
      GALL: "Quiquiriquí! Alerta de bategat fosc: Estàs funcionant en Mode Local!",
      NANOBANANA: "Açò necessita el Ritu de l'Abundància en Mode Simulació!",
      FLASH: "Ordre rebuda. Executant petició ràpida en local... Fet.",
      VIATJANT: "Porte novetats de fora! Però sense internet real, poc et puc comptar.",
      REBOST: "Tinc el perol al foc però m'han tallat la llenya (API Offline)!",
      TRELLAT: "Veredicte en mode simulat: Et falta un poquet d'imaginació.",
    };

    return {
      error: false,
      text: mockResponses[personaKey] || "Santuari de la Saviesa Rural (Mode Simulat: Sense Connexió Real).",
      persona: persona.name,
      avatarName: persona.avatarName,
      type: persona.type,
      is_mock: true,
    };
  }

  /**
   * Crida al model Gemini amb una personalitat específica i suport per a imatges/àudio.
   */
  async ask(personaKey, query, imageData = null, audioData = null, signal = null, onProgress = null, options = {}) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) throw new Error(`Persona ${personaKey} no trobada.`);

    // [MASTER RESILIENCY] Avaluació de caiguda offline o mode dev
    const isSimulation = localStorage.getItem("isPlaygroundMode") === "true" || localStorage.getItem("sb-simulation-mode") === "true";

    if (isSimulation) {
      // logger.debug(`[Gemini] Mode Simulació activat per a ${persona.name}. Retornant *mock*.`);
      await new Promise((r) => setTimeout(r, 1000));
      return this.getMockResponse(personaKey, query, imageData);
    }

    // logger.debug(`[Gemini] Consultant a ${persona.name}...`);

    try {
      // Si enviem àudio, la query textual podria ser buida o servir de context
      const textQuery = query.trim() || (audioData ? "Atent a l'àudio adjunt." : "Hola.");
      const parts = [{ text: textQuery }];

      if (imageData) {
        parts.push({
          inline_data: {
            mime_type: imageData.mimeType,
            data: imageData.data,
          },
        });
      }

      // [INTEGRACIÓ WALKIE-TALKIE] Audio direct a Gemini API
      if (audioData) {
        parts.push({
          inline_data: {
            mime_type: audioData.mimeType || 'audio/webm',
            data: audioData.data,
          },
        });
      }

      const geminiPayload = {
        contents: [{ role: 'user', parts: parts }],
        system_instruction: { parts: [{ text: persona.systemPrompt + "\n\nDIRECTIVA MASTER OBLIGATÒRIA: Retalla la xerrameca. Si l'usuari et diu simplement 'Bon dia' o fa un comentari molt curt, respon de forma igualment breu, amb una sola frase natural. La longitud de la teua resposta ha de ser estrictament proporcional a la longitud i complexitat de l'usuari. Actua de forma conversacional i directa." }] }
      };

      if (options.tools) {
        geminiPayload.tools = options.tools;
      }

      // Funcio auxiliar d'errors no-reintentables
      class NonRetryableError extends Error {
        constructor(message) { super(message); this.name = "NonRetryableError"; }
      }

      // [RESILIÈNCIA AL MAS] Validem pes client-side per protegir d'esgotar dades innecessàriament
      const payloadString = JSON.stringify(geminiPayload);
      if (payloadString.length > 5 * 1024 * 1024) {
        throw new NonRetryableError("L'arxiu multimèdia és massa pesat i col·lapsarà la xarxa (limitat a ~4.5MB).");
      }

      // [RESISTÈNCIA DE XARXA] Reintents exponencials per a fallades mòbils rurals
      const executeWithRetry = async (task, maxRetries = 2) => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            if (signal?.aborted) throw new NonRetryableError("AbortError: Peticio cancel·lada");
            return await task();
          } catch (err) {
            if (err.name === "NonRetryableError" || err.name === "AbortError" || signal?.aborted) throw err;
            if (attempt === maxRetries) throw err;
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            // logger.warn(`[Resiliència] Connectivitat perduda. Reintentant en ${delay.toFixed(0)}ms...`);
            await new Promise(r => {
                const timer = setTimeout(r, delay);
                if (signal) {
                    signal.addEventListener("abort", () => {
                        clearTimeout(timer);
                        r();
                    }, { once: true });
                }
            });
          }
        }
      };

      let rawText = "No hi ha resposta.";

      // [PONT LLUM DIRECTA] Si tenim clau API local, prioritzem el funcionament autònom
      const localApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const shouldUseLocalKey = localApiKey && localApiKey !== 'your_new_gemini_api_key_here';

      rawText = await executeWithRetry(async () => {
        if (shouldUseLocalKey) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${localApiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payloadString,
                signal
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                if (response.status === 400 || response.status === 413 || response.status === 429) {
                  throw new NonRetryableError(errData.error?.message || `Error d'API irreversible: ${response.status}`);
                }
                throw new Error("Error en crida directa Gemini"); // Reintentable
            }
            
            const data = await response.json();
            const part = data.candidates?.[0]?.content?.parts?.[0];
            if (part?.functionCall) {
              return { text: null, functionCall: part.functionCall };
            }
            return part?.text || "No hi ha resposta.";
        } else {
            // [V11.0 STREAMING O2 FIX] Bypassing Supabase functions.invoke per llegir el stream directament
            const edgeFnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`;
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

            const response = await fetch(edgeFnUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    model: this.model,
                    geminiPayload: geminiPayload,
                    personaKey: personaKey
                }),
                signal
            });

            if (!response.ok) {
                // Gestionar errors HTTP retornats per la funció
                const errData = await response.json().catch(() => ({}));
                if (response.status === 400 || response.status === 413 || response.status === 429) {
                    throw new NonRetryableError(errData.error?.message || `Error Edge Function: ${response.status}`);
                }
                throw new Error(`Fallada de xarxa amb el Proxy (${response.status}): ` + response.statusText);
            }

            // [LLEGIR CORRENT (STREAM) SSE]
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let accumulatedText = "";
            let partialChunk = "";
            let accumulatedFunctionCall = null;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                partialChunk += decoder.decode(value, { stream: true });
                const lines = partialChunk.split('\n');
                
                // Guardem l'última línia per si està tallada completament (típic de streams TCP)
                partialChunk = lines.pop() || "";

                for (const line of lines) {
                    if (line.trim() === "") continue;
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6).trim();
                        if (dataStr === "[DONE]") continue;

                        try {
                            const parsed = JSON.parse(dataStr);
                            const part = parsed?.candidates?.[0]?.content?.parts?.[0];
                            
                            if (part?.functionCall) {
                                // Per simplificar el functionCalling a través de Stream: agafem l'últim complet que arriba.
                                accumulatedFunctionCall = part.functionCall;
                            }
                            
                            const textChunk = part?.text;
                            if (textChunk) {
                                accumulatedText += textChunk;
                                if (onProgress) onProgress(accumulatedText);
                            }
                        } catch {
                            // Petits errors de parsing (sovinteja amb comes de JSONs tallats) 
                        }
                    }
                }
            }

            if (accumulatedFunctionCall) {
               return { text: null, functionCall: accumulatedFunctionCall };
            }

            if (!accumulatedText) throw new NonRetryableError("L'IAIA s'ha tallat en la meitat del bategat i no ha emès resposta.");
            return accumulatedText;
        }
      });
      
      const cleanResponse = DOMPurify.sanitize(rawText, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'blockquote', 'code'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ADD_TAGS: ['cite'],
        ADD_ATTR: ['data-did', 'data-anchor'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover']
      });

      // Batec hàptic d'èxit (simulat o via hapticService)
      if (navigator.vibrate) navigator.vibrate(50);

      return {
        error: false,
        text: cleanResponse,
        persona: persona.name,
        avatarName: persona.avatarName,
        type: persona.type,
      };
    } catch {
      // Fallback final per a l'Arxiver per evitar frustració de l'usuari
      if (personaKey === "ARXIVER") {
        return {
          error: false,
          text: "Mestre, la burocràcia digital m'ha bloquejat la ploma. Però no patisques: pel que veig, aquesta ajuda és clau per al projecte. Revisa els requisits oficials mentre jo netejo el tinter!",
          persona: persona.name,
          avatarName: persona.avatarName,
          type: persona.type,
          is_mock: true,
        };
      }

      // Logging refinat i silenciós (sense embrutar consola amb traçats vermells agressius)
      logger.debug(`[Gemini] Interrupció o error consultant a ${persona.name}. Cau a fallback.`);

      return {
        error: true,
        message:
          "L'Expert està fent la migdiada (Error de Connexió). Torna-ho a provar en un moment.",
      };
    }
  }



  /**
   * Genera un resum del dia (Newsletter) basat en les publicacions del mur.
   */
  async generateNewsletterSummary(posts) {
    if (!posts || posts.length === 0)
      return "El mur està més tranquil que una migdiada d'agost. No hi ha novetats per resumir.";

    const postsContent = posts
      .map(
        (p, i) =>
          `${i + 1}. [${p.author_name || p.author || "Foraster"}]: ${
            p.content || p.excerpt || ""
          }`,
      )
      .join("\n");

    const query = `Aquestes són les publicacions d'avui al mur de Sóc de Poble:\n\n${postsContent}\n\nFes-me un resum tipus "Cronista del Poble" per als veïns que tenen pressa.`;

    return this.ask("ARXIVER", query);
  }

  /**
   * Genera una recepta o consell per a un producte del mercat.
   */
  async getMarketRecipe(itemTitle, itemDescription = "") {
    const query = `Dona'm un consell breu i graciós en valencià sobre aquest producte del mercat: "${itemTitle}". Descripció: ${itemDescription}. Si és menjar, una recepta ràpida. Si és roba o un altre objecte, com combinar-ho o donar-li un segon ús.`;
    return this.ask("CUINERA", query);
  }
}

export const geminiService = new GeminiService();
