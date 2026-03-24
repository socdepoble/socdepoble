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
   * Crida al model Gemini amb una personalitat específica i suport per a imatges.
   */
  async ask(personaKey, query, imageData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) throw new Error(`Persona ${personaKey} no trobada.`);

    // [MASTER RESILIENCY] Avaluació de caiguda offline o mode dev
    const isSimulation = localStorage.getItem("isPlaygroundMode") === "true" || localStorage.getItem("sb-simulation-mode") === "true";

    if (isSimulation) {
      logger.log(`[Gemini] Mode Simulació activat per a ${persona.name}. Retornant *mock*.`);
      await new Promise((r) => setTimeout(r, 1000));
      return this.getMockResponse(personaKey, query, imageData);
    }

    logger.log(`[Gemini] Consultant a ${persona.name} via Proxy...`);

    try {
      const parts = [{ text: query }];

      if (imageData) {
        parts.push({
          inline_data: {
            mime_type: imageData.mimeType,
            data: imageData.data,
          },
        });
      }

      // [CRITICAL O2 FIX] Cridem a la Edge Function "gemini-proxy" de Supabase de manera 100% segura.
      // La capçalera amb la key local s'ha eliminat per evitar exposicions XSS.
      const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: {
          model: this.model,
          geminiPayload: {
            contents: [{ role: 'user', parts: parts }],
            system_instruction: { parts: [{ text: persona.systemPrompt + "\n\nDIRECTIVA MASTER OBLIGATÒRIA: Retalla la xerrameca. Si l'usuari et diu simplement 'Bon dia' o fa un comentari molt curt, respon de forma igualment breu, amb una sola frase natural. La longitud de la teua resposta ha de ser estrictament proporcional a la longitud i complexitat de l'usuari. Actua de forma conversacional i directa." }] }
          }
        }
      });

      if (error) {
        logger.error("[Gemini] Fallida del servidor proxy:", error);
        return this.getMockResponse(personaKey, query, imageData);
      }

      if (data.error) {
         throw new Error(data.error.message || "Error a l'API de Gemini arrel proxy.");
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No hi ha resposta.";
      
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
    } catch (err) {
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

      logger.error(`[Gemini] Error consultant a ${persona.name}:`, err);

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
