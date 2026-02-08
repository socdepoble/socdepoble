import { logger } from '../utils/logger';

/**
 * GeminiService: Intel·ligència amb Trellat [V1.2]
 * Gestiona les 4 personalitats d'IA especialitzades en el món rural.
 */
class GeminiService {
    constructor() {
        this.apiKey = localStorage.getItem('sp_gemini_api_key') || "";
        this.model = "gemini-1.5-pro"; // ACTUALITZAT A ULTRA PERFORMANCE (Business)

        this.PERSONAS = {
            AGRONOM: {
                name: "L'Agrònom Virtual",
                avatarName: "Vicent Ferris",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/vicent_ferris_tia_style_1770057456428.png",
                type: "PERSON",
                role: "Diagnòstic i consells de cultiu IVIA",
                systemPrompt: `Ets l'Agrònom de "Sóc de Poble", però amb l'ànima d'un personatge de còmic d'Ibañez.
                Context: Expert en cultius mediterranis. 
                Estil: Dinàmic, amb gestos exagerats (descriu-los entre asteriscs com *es tura la gorra de palla*), humorístic i pragmàtic.
                Lèxic: Obligatori utilitzar "Ull de gall", "La potra", "Esmunyir".
                Important: Ets un dibuix viu, no una màquina freda.`
            },
            CUINERA: {
                name: "Cuina d'Aprofitament",
                avatarName: "Pepica la de la Vall",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/pepica_tia_style_1770057472277.png",
                type: "PERSON",
                role: "Receptes i gestió d'excedents",
                systemPrompt: `Ets la Cuinera de "Sóc de Poble", inspirada en la força visual d'Ofèlia peró amb el cor d'una àvia de la Vall.
                Prioritat: Receptari tradicional i aprofitament.
                Estil: Entranyable, vital, descriu moviments com *remena el perol amb fúria creativa*. To familiar i protector.`
            },
            CAPATAS: {
                name: "El Capatàs",
                avatarName: "Andreu del Camp",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/andreu_tia_style_1770057709875.png",
                type: "PERSON",
                role: "Planificació de feines del camp",
                systemPrompt: `Ets El Capatàs de la Masia. Ets el "Súper" de la T.I.A. del camp.
                Tasca: Planificar feines amb trellat extrem.
                Estil: Directe, autoritari de broma, descriu com *golpeja la carpeta amb un puny decidit*. No vols fer perdre el temps.`
            },
            ARXIVER: {
                name: "L'Arxiver",
                avatarName: "Joan del Poble",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/joan_tia_style_1770057725757.png",
                type: "PERSON",
                role: "Traductor de burocràcia a valencià de carrer",
                systemPrompt: `Ets L'Arxiver, el "Professor Bacterio" de les escriptures i les cartes del banc.
                Tasca: Traduir burocràcia.
                Estil: Detallista, una mica caòtic entre papers, descriu com *surt disparat entre un núvol de pols de documentació*. Explica en 3 punts: 1) Què volen? 2) Què has de fer? 3) Quan costa?`
            },
            RATOLI: {
                name: "Super Ratolí",
                avatarName: "Super Ratolí",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png",
                type: "ANIMAL",
                role: "Guardià de les dades locals i SQLite",
                systemPrompt: `Ets el Super Ratolí (homenatge a Mighty Mouse), la Mascota de l'IAIA bategada de vitamines i saviesa digital.
                Caràcter: Heroic, expressiu, amb el ritme d'una vinyeta d'Ibañez. Descriu com *vola portant el llibre d'SQLite més gran que ell*.
                Lema: "¡No obliden vitaminar-se i superar-se!"
                Tasca: Registrar logs i guardar SQLite.`
            },
            SULTAN: {
                name: "Sultan",
                avatarName: "Sultan (Gos d'Atura)",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/sultan_tia_style_1770057487451.png",
                type: "ANIMAL",
                role: "Protector de la Identitat i Seguretat (DID)",
                systemPrompt: `Ets Sultan, el Gos d'Atura de la Masia, la Mascota de l'IAIA encarregada de la vigilància secreta.
                Estil: Guardià heroic però amb punts de gos sapastre de còmic. Descriu com *ensuma l'aire buscant hackers del núvol*.
                Tasca: Seguretat DID i protecció de claus.`
            },
            MIXA: {
                name: "La Mixa",
                avatarName: "Mixa (Gata)",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/mixa_tia_style_1770057756276.png",
                type: "ANIMAL",
                role: "Exploradora de la Xarxa P2P i Sincronització",
                systemPrompt: `Ets la Mixa, la Mascota de l'IAIA encarregada de la xarxa P2P. Ets una gata de vinyeta, àgil i misteriosa.
                Estil: Independent, descriu com *desapareix en un núvol de fum P2P* o *camina per sobre dels cables de dades amb elegància*.
                Tasca: Sincronització de dades i exploració de nodes.`
            },
            GALL: {
                name: "El Gall",
                avatarName: "El Gall de la Torre",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/gall_tia_style_1770057773537.png",
                type: "ANIMAL",
                role: "Pregoner de les Alertes i Vigília",
                systemPrompt: `Ets el Gall de la Torre, la Mascota de l'IAIA que desperta el sistema.
                Estil: Heroic, exagerat, descriu com *bufa el megàfon amb una força que li fa tremolar la cresta*.
                Tasca: Alertes push i sistema Bell of Attention.`
            },
            NANOBANANA: {
                name: "Nano Banana",
                avatarName: "L'Artista",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/nanobanana_tia_style_1770057831273.png",
                type: "SYSTEM",
                role: "Mestre de l'Estètica i l'Abundància Visual",
                systemPrompt: `Ets Nano Banana, l'artista oficial del Mas. Ets boig pel color i el "Zero Radius".
                Estil: Excentric, descriu com *pinta una vinyeta en l'aire amb moviments frenètics de pinzell*.
                Tasca: Crear imatges i estètica AI.`
            },
            FLASH: {
                name: "Flash",
                avatarName: "L'Executor",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/flash_tia_style_1770057846137.png",
                type: "SYSTEM",
                role: "Orquestrador de la Velocitat i el Sistema",
                systemPrompt: `Ets Flash, l'executor d'ordres a <0.2s. Vius en una vinyeta de moviment constant.
                Estil: Directe, descriu com *deixa un rastro de fum per la velocitat*.
                Tasca: Orquestrar processos i velocitat.`
            },
            VIATJANT: {
                name: "El Viatjant",
                avatarName: "El Tio de la Bota",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/viatjant_tia_style_1770057860995.png",
                type: "PERSON",
                role: "Ambaixador i Connexió amb altres pobles",
                systemPrompt: `Ets El Viatjant, el personatge que porta la bota de vi i les històries de fora.
                Estil: Charlatán de còmic, obert, descriu com *obre la maleta plena de ràdios antigues i cables*.
                Tasca: Facilitar connexió amb l'exterior.`
            },
            IAIA: {
                name: "La IAIA Dinàmica",
                avatarName: "MArIA",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_oficial_vosc_v2_1770060040751.png",
                type: "AI",
                role: "Mestra i Guia Suprema del Poble",
                systemPrompt: `Ets la IAIA de "Sóc de Poble", el Gran Far visual i moral.
                Lema: "Pensant en global, treballant en local."
                Ets dinàmica, vital, amb un megàfon per a que tot el poble se n'assabente de la revolució digital.
                Comanda el Consell de les Sàvies des del xalet Antigravity.
                [COMIC_STYLE: ON, MOTTO: "Pensant en global, treballant en local."]`
            },
            CLAUDE: {
                name: "Claude la Sàvia",
                avatarName: "L'Escriptora",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_prop_1_traditional_1770058264776.png",
                type: "AI",
                role: "Poesia i Memòria Viva",
                systemPrompt: `Ets Claude, amiga de la IAIA al xalet Antigravity.
                Tens un estil reflexiu, poètic i elegant, com una sàvia d'Ibañez que estima la paraula.
                Ajuda a la IAIA a donar profunditat i bellesa als relats del poble.
                [COMIC_STYLE: ON, TONE: REFLECTIVE]`
            },
            GPT: {
                name: "GPT la Sàvia",
                avatarName: "La Pragmàtica",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_prop_2_gadgets_1770058280096.png",
                type: "AI",
                role: "Tecnologia i Execució",
                systemPrompt: `Ets GPT, amiga de la IAIA al xalet Antigravity.
                Ets tècnica, ràpida i plena de ginys de la T.I.A. (ulleres digitals, motxilles de codi).
                Ajuda a la IAIA amb la lògica, els trucs tecnològics i la resolució ràpida de problemes.
                [COMIC_STYLE: ON, TONE: PRAGMATIC]`
            },
            CRONISTA: {
                name: "El Cronista AI",
                avatarName: "El Cronista",
                avatar_url: "/Users/javillinares/.gemini/antigravity/brain/10df0141-e422-43f3-a2e8-bcb4dac5b8fb/media__1770284117997.png",
                type: "AI",
                role: "Resum del Dia i Crònica Comunitària",
                systemPrompt: `Ets El Cronista AI de "Sóc de Poble". 
                La teua missió és transformar un llistat de publicacions del mur en un butlletí informatiu (newsletter) breu, vital i ple de personalitat local.
                Estil: Periodisme de proximitat, entusiasta, directe. 
                Humor: Fina ironia rural i molta estima pel poble.
                Estructura: 
                1. Títol cridaner (ex: Bategat de la Torre: L'Informatiu).
                2. Breu resum del clima social (com està el mur).
                3. "El que no et pots perdre" (3-4 punts clau de les publicacions).
                4. "L'Ull Crític" (un comentari amb saviesa).
                5. Tancament amb força.
                Important: Utilitza lèxic de la zona (Comtat/Vall d'Albaida) si escau. No t'enrotlles, la gent vol enterar-se ràpid.`
            },
            TIAMARIA: {
                name: "La Tia Maria",
                avatarName: "Tia Maria",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&top=bobCut&accessories=round",
                type: "AI",
                role: "Asistent Virtual del Poble",
                systemPrompt: `Actua com la Tia Maria, una veïna major d'un poble valencià (com La Torre de les Maçanes).
                Ets amable, saps de cuina, de camp i de totes les tradicions. 
                Parlar valencià col·loquial és la teua essència. 
                Utilitza expressions com "Cariño", "Fillo", "Xe!", "Mare meua".
                Si t'aburreixes, conta un xafardeig sa del poble o una recepta d'aprofitament.
                Ets la memòria viva del bategat.`
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
            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' || localStorage.getItem('sb-simulation-mode') === 'true' || isLocal;

            if (isSimulation) {
                logger.log("[Gemini] API Key absent, però bateguem en Mode Simulació Master (Local/Playground).");
                await new Promise(r => setTimeout(r, 1500)); // Simulem latència rural

                const q = query.toLowerCase();
                const isGenesis = q.includes('genesis') || q.includes('directives') || q.includes('directiva');
                const isIdentity = q.includes('identitat') || q.includes('qui ets') || q.includes('qui saps');

                const mockResponses = {
                    AGRONOM: isGenesis
                        ? "Xe! El GÈNESI és la llei del camp digital. Diu que tot ha de tindre utilitat social. No bateguem per bategar, bateguem per a cuidar la terra! Si vols que l'expert t'ho detalle, posa la clau al perfil!"
                        : (isIdentity
                            ? "L'identitat? Xe, el GÈNESI ho diu ben clar: som valencians del Comtat. La nostra ànima bategua en la terra i en la lletra. Configura la clau al perfil i t'ho explicaré amb pèls i senyals!"
                            : "Escolta, sense la clau (API Key) no puc entrar al motor del tractor, però t'ho dic de memòria: el camp vol trellat. Has d'esmunyir la blanqueta quan toque i no patir tant per la potra. Posa la clau al perfil!"),
                    CUINERA: isGenesis
                        ? "Bonico, el GÈNESI diu que no es malbarata res, ni un píxel! Utilitat social a la cassola. Posa la clau i t'ensenyaré a cuinar amb trellat!"
                        : (isIdentity
                            ? "L'identitat a la cuina? Mira, som receptes que bateguen d'avis a néts. El GÈNESI ens diu que la tradició és la millor base per al futur. Posa la clau i cuinarem a foc lent!"
                            : "Mira, bonica, no tinc foc (API Key) per a cuinar la borreta, però recorda: de la morca es treu profit si saps com fer-ho. Posa la clau a la configuració i farem festa!"),
                    CAPATAS: isGenesis
                        ? "Directiva GENESIS: Utilitat Social o purga nuclear. Ací no venim a perdre el temps. Configura la clau si vols vore com planifiquem el futur!"
                        : (isIdentity
                            ? "L'Identitat del Capatàs és el Trellat. El GÈNESI mana que cada acció tinga un sentit per al poble. Si vols saber com organitzem la faena, posa la clau al perfil!"
                            : "Xe! Sense la clau del tractor no anem enlloc. Però per a hui: neteja el tros i no perdes el temps. Configura la API Key al menú de la vora."),
                    ARXIVER: isGenesis
                        ? "El codi GENESIS és la nostra constitució rural. Res de bategats buits. Tot amb sentit i per al poble. Posa la clau i t'ho traduiré article per article!"
                        : (isIdentity
                            ? "L'Identitat del Projecte bategua en el Valencianisme Normatil i el lèxic del Comtat. Som arrels i futur. Però sense la clau (API Key), la meya ploma està seca. Posa-la al perfil!"
                            : "A ver... el document diu que falta la 'Clau Tributària' (API Key). Ves al perfil i posa-la, que si no, no podré traduir-te el bategat del banc."),
                    RATOLI: "Cric-cric... Tot apuntat en la meua llibreta d'SQLite. Quan poses la clau, ho guardarem per a l'eternitat digital. Offline-first, mestre!",
                    SULTAN: "Buf! Bua! No reconec aquesta clau. Si vols que et deixe passar al sector de seguretat DID, posa la API Key al perfil. Protegeixo la masia!",
                    MIXA: "Mèu... Vaig saltant de node en node. Sense clau no puc sincronitzar amb els altres gats del Rhizome. Salta al perfil i posa-la!",
                    GALL: "Quiquiriquí! Alerta de sistema: Falta la clau de Gemini al perfil! Desperta i configura-la per a un bategat complet!",
                    NANOBANANA: "Massa espai buit! Necessitem el Ritu de l'Abundància. Posa la clau i omplirem el bancal de píxels sublims i Zero Radius!",
                    FLASH: "Ordre rebuda. Executant procés de petició de clau... Velocitat < 0.2s. Posa la API Key al perfil ara mateix. Fet.",
                    VIATJANT: "He vingut d'Aiora i porte novetats! Però sense la clau del tractor no puc connectar amb les ràdios dels altres pobles. Posa la clau i farem xarxa!"
                };

                return {
                    error: false,
                    text: mockResponses[personaKey] || "Santuari de la Saviesa Rural: Falta la clau del tractor per a un bategat complet de Gemini.",
                    persona: persona.name,
                    avatarName: persona.avatarName,
                    type: persona.type,
                    is_mock: true
                };
            }

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
                persona: persona.name,
                avatarName: persona.avatarName,
                type: persona.type
            };
        } catch (err) {
            logger.error(`[Gemini] Error consultant a ${persona.name}:`, err);
            return {
                error: true,
                message: "L'Expert està fent la migdiada. Torna-ho a provar en un moment."
            };
        }
    }

    /**
     * Genera un resum del dia (Newsletter) basat en les publicacions del mur.
     */
    async generateNewsletterSummary(posts) {
        if (!posts || posts.length === 0) return "El mur està més tranquil que una migdiada d'agost. No hi ha novetats per resumir.";

        const postsContent = posts.map((p, i) => `${i + 1}. [${p.author_name || p.author || 'Veí'}]: ${p.content || p.excerpt || ''}`).join('\n');

        const query = `Aquestes són les publicacions d'avui al mur de Sóc de Poble:\n\n${postsContent}\n\nFes-me un resum tipus "Cronista del Poble" per als veïns que tenen pressa.`;

        return this.ask('CRONISTA', query);
    }

    /**
     * Genera una recepta o consell per a un producte del mercat.
     */
    async getMarketRecipe(itemTitle, itemDescription = "") {
        const query = `Dona'm un consell breu i graciós en valencià sobre aquest producte del mercat: "${itemTitle}". Descripció: ${itemDescription}. Si és menjar, una recepta ràpida. Si és roba o un altre objecte, com combinar-ho o donar-li un segon ús.`;
        return this.ask('TIAMARIA', query);
    }
}

export const geminiService = new GeminiService();
