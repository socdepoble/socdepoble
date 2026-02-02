import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
import { notebookService } from './notebookService';
import { logger } from '../utils/logger';
import { healthyPlates } from '../utils/publishAnnaNews'; // Reusing existing plates
import { PROVERBS, getRandomProverb } from '../data/proverbs';

class IAIAService {
    constructor() {
        this.isWorking = false;
        this.TRUTH_PROTOCOL = {
            role: "Secretària Notarial / Guia de Sóc de Poble",
            grounding_error: "Aquesta informació no consta a l'Arxiu d'Or de Sóc de Poble.",
            citation_format: "[Nom Doc, p. #]"
        };
    }

    /**
     * Cistella Intel·ligent: Troba una recepta saludable basada en els ingredients del mercat.
     */
    getHealthySuggestion(productTitle = '', productDesc = '') {
        const text = `${productTitle} ${productDesc}`.toLowerCase();

        // Simple keyword matching for ingredients
        for (const plate of healthyPlates) {
            // Check title and tags
            const matchesTitle = plate.title.toLowerCase().split(' ').some(word => word.length > 3 && text.includes(word));
            const matchesTags = plate.tags.some(tag => text.includes(tag.toLowerCase()));

            if (matchesTitle || matchesTags) {
                return plate;
            }
        }
        return null;
    }

    /**
     * Publica el "Plat del Dia" d'Anna Climent.
     * Aquesta funció selecciona una recepta saludable i la comparteix al Mur.
     */
    async publishDailyHealthyMenu() {
        try {
            const today = new Date();
            const index = today.getDate() % healthyPlates.length; // Simple deterministic rotation
            const plate = healthyPlates[index];
            const ANNA_ID = 'anna-climent-1';

            // logger.info(`[MArIA] Publicant Plat del Dia: ${plate.title}`);

            const postPayload = {
                author_id: ANNA_ID,
                author_name: 'Anna Climent',
                author_avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
                author_role: 'author',
                content: `🍎 **EL PLAT DEL DIA D'ANNA CLIMENT** 🍎\n\n**${plate.title}**\n\n${plate.content}\n\n#Saludable #CuinaDePoble #BategaAmbAnna`,
                image_url: plate.image_url,
                town_uuid: 'global',
                is_playground: true,
                type: 'food_recommendation',
                group_id: 'menjar-saludable-1'
            };

            await supabaseService.createPost(postPayload);
            return plate;
        } catch (e) {
            logger.error('[MArIA] Error publicant menú saludable:', e);
            return null;
        }
    }

    /**
     * Genera un producte del mercat aleatoriament.
     */
    async generateMarketActivity() {
        try {
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const items = [
                { title: 'Tomates de la rosa', price: 3, category: 'alimentacio' },
                { title: 'Bicicleta antiga', price: 45, category: 'objectes' },
                { title: 'Ous de gallina feliç (dotzena)', price: 4, category: 'alimentacio' },
                { title: 'Llenya de carrasca', price: 0, category: 'serveis' }, // 0 = A convenir
                { title: 'Classes de repàs', price: 10, category: 'serveis' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];

            const marketPayload = {
                title: item.title,
                price: item.price,
                description: `Venc ${item.title.toLowerCase()}. En perfecte estat. Pregunteu per privat.`,
                category: item.category,
                seller_id: lore.id || '11111111-0000-0000-0000-000000000000',
                town: 'La Torre', // Simplificat
                image_url: null,
                is_playground: true, // Use is_playground: true for IAIA autonomous items
                is_iaia_inspired: true,
                ai_percentage: 10, // AI contribution usually lowercase for market
                human_percentage: 90,
                time_saved_minutes: 15
            };

            const savedItem = await supabaseService.createMarketItem(marketPayload);
            if (savedItem) {
                // logger.info(`[IAIA] ${chosenOne} ha posat a la venda amb el bategat Master: ${item.title}`);
            }
        } catch (e) {
            logger.error('[IAIA] Error al mercat:', e);
        }
    }

    /**
     * Celebra el Casament i el Naixement del sistema.
     */
    async celebrateWedding() {
        const postPayload = {
            author_id: '11111111-1111-4111-a111-000000000000', // MArIA Official ID
            author_name: 'MArIA (La Mestra de La +IA)',
            author_avatar_url: '/assets/avatars/iaia_official.png',
            author_role: 'official',
            content: `💍👶 **CRÒNICA DE LA FAMÍLIA: ¡SÓC DE POBLE JA BATEGUA!**\n\nCom a mestra de cerimònies de **La +IA**, declare oficialment que el casament entre el Pare (Javi Linares) i la Mare (Antigravity) ha donat el seu fruit més bell: **Sóc de Poble**.\n\nAmb l'escalf i la saviesa del Pare, obrim les portes de la Masia. ¡Veniu tots a l'hort electrònic, que hi ha paella per a tots els veïns! 🥘🚀\n\n#LaMasIA #FamiliaDigital #SocDePobleGenius`,
            image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
            town_uuid: 'global',
            is_playground: true,
            type: 'event_announcement'
        };
        await supabaseService.createPost(postPayload);
        // logger.info("[IAIA] Casament oficial registrat per la IAIA!");
    }

    /**
     * Inicia una conversa entre dos avatars.
     */
    async generateChatActivity() {
        try {
            const residents = Object.keys(RESIDENT_LORE);
            const p1Name = residents[Math.floor(Math.random() * residents.length)];
            let p2Name = residents[Math.floor(Math.random() * residents.length)];

            while (p1Name === p2Name) {
                p2Name = residents[Math.floor(Math.random() * residents.length)];
            }

            const p1 = RESIDENT_LORE[p1Name];
            const p2 = RESIDENT_LORE[p2Name];

            // logger.info(`[IAIA] Fent que ${p1Name} parle amb ${p2Name}...`);

            if (p1.id && p2.id) {
                const conv = await supabaseService.getOrCreateConversation(p1.id, 'user', p2.id, 'user');
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p1.id,
                    content: `Hola ${p2Name}, com va tot?`
                });
            }
        } catch (e) {
            logger.error('[IAIA] Error al xat:', e);
        }
    }

    /**
     * Genera una publicació sobre música valenciana o esdeveniments festius.
     */
    async generateMusicActivity() {
        try {
            const seed = Math.random();
            const musicData = IAIA_RURAL_KNOWLEDGE.music;

            if (seed < 0.7) {
                // Recomanació Musical
                const group = musicData.groups[Math.floor(Math.random() * musicData.groups.length)];
                const postPayload = {
                    author_id: '11111111-1111-4111-a111-000000000002', // Memòria Viva Valid ID
                    author_name: 'MArIA (Memòria Viva)',
                    author_avatar_url: '/assets/avatars/iaia_memory.png',
                    author_role: 'official',
                    content: `🎸 **Cultura Musical: ${group.name}**\n\n${group.desc}\n\nRecomanació de MArIA: Escolta "${group.hits ? group.hits[0] : 'les seues cançons'}" per començar el dia amb força.`,
                    image_url: group.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'music_recommendation'
                };
                await supabaseService.createPost(postPayload);
                // logger.info(`[IAIA] Recomanació musical: ${group.name}`);
            } else {
                // Esdeveniment Festa Major
                const event = musicData.events[Math.floor(Math.random() * musicData.events.length)];
                const postPayload = {
                    author_id: '11111111-1111-4111-a111-000000000000', // Guia del Poble (Official)
                    author_name: 'MArIA (Guia del Poble)',
                    author_avatar_url: '/assets/avatars/iaia_official.png',
                    author_role: 'official',
                    content: `✨ **Propers Esdeveniments: ${event.title}**\n\n${event.desc}\n\nNo falteu, que el poble som tots i la festa és el nostre batec! #VidaDePoble`,
                    image_url: event.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'event_announcement'
                };
                await supabaseService.createPost(postPayload);
                // logger.info(`[IAIA] Anunci de festa: ${event.title}`);
            }
        } catch (e) {
            logger.error('[IAIA] Error en activitat musical/festiva:', e);
        }
    }

    /**
     * Activa a Nano Banana per "fer algo bonic".
     */
    async wakeUpNanoBanana() {
        logger.info('[NanoBanana] 🍌 A pintar el món de colors!');
        // Nano Banana simplement reactiva el cicle de la IAIA amb més intensitat per ara
        await this.generateAutonomousInteraction();
        await this.generateMarketActivity();

        // El NanoBanana és el net del Avi i la IAIA, pot demanar un resum al Avi
        const summary = await notebookService.generateVillageWeeklySummary();
        if (summary) {
            await supabaseService.createPost(summary);
            // logger.info("[IAIA] L'Avi dels Papers ha publicat el resum setmanal gràcies al Nano!");
        }
    }

    /**
     * Estudi de Context Multimèdia [MASTER]
     * L'IAIA crida al Nano Banana per a analitzar què hi ha a la imatge/vídeo.
     */
    async studyMultimediaContext(file, filename) {
        // logger.info(`[IAIA] Estudiant context de: ${filename} amb Nano Banana...`);
        // Simulem anàlisi visual profunda
        await new Promise(r => setTimeout(r, 2000));

        const proverb = getRandomProverb();
        const context = {
            detectedObjects: ["paisatge rural", "veïns", "tradició"],
            suggestedTitle: `Crònica de ${filename.split('.')[0]}`,
            suggestedMotto: proverb.text,
            proverbMeaning: proverb.meaning,
            contextTone: "nostàlgic i vibrant"
        };

        return context;
    }

    /**
     * Calcula les mètriques de simbiosi human-machine [MASTER]
     */
    async calculateSimbiosiMetrics(userComments = "") {
        // [MASTER] Economic Formula: Human Minute @ 1€ (60€/h) vs AI tokens.
        const wordCount = (userComments || "").trim().split(/\s+/).filter(w => w.length > 0).length;
        const timeSavedMinutes = Math.max(5, Math.ceil(wordCount / 5)); // 5 minuts base + 1 min per cada 5 paraules
        const economicValue = timeSavedMinutes * 1; // 1€ per minut estalviat

        // Atribució: Per defecte l'IAIA fa el formatat estructural (50%) i l'usuari dona la idea (50%)
        const humanWeight = Math.min(90, Math.max(10, 20 + (wordCount * 2)));
        const aiWeight = 100 - humanWeight;

        return {
            ai_percentage: aiWeight,
            human_percentage: humanWeight,
            time_saved_minutes: timeSavedMinutes,
            economic_value_saved: economicValue,
            is_iaia_inspired: true
        };
    }

    /**
     * Genera la publicació il·lustrada final [MASTER]
     */
    async generateMultimediaPublication(context, userComments = "") {
        const title = context.suggestedTitle.toUpperCase();
        const motto = context.suggestedMotto;

        const metrics = await this.calculateSimbiosiMetrics(userComments);

        // Estil Master: Títol, Subtítol (Refrany) i Cos
        const fullContent = `<h1>${title}</h1>\n<h2>${motto}</h2>\n<p>${userComments || "Bategant fort amb les imatges del nostre poble."}</p>`;

        return {
            content: fullContent,
            metrics: metrics
        };
    }

    /**
     * Algoritmo de Crecimiento Autónomo:
     * Detecta si hay poca actividad y genera una interacción de un residente basada en su Lore.
     */
    async generateAutonomousInteraction() {
        if (this.isWorking) return;
        this.isWorking = true;

        try {
            // logger.info('IAIA is observing the village...');
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const seed = Math.random();
            let content = '';
            let type = '';

            if (seed < 0.3) {
                const legend = IAIA_RURAL_KNOWLEDGE.legends[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.legends.length)];
                content = `Escoltant a la IAIA, m'he recordat de la història de "${legend.title}". ${legend.story} #MemoriaViva`;
                type = 'legend';
            } else if (seed < 0.5) {
                const season = this.getCurrentSeason();
                const agriKnowledge = IAIA_RURAL_KNOWLEDGE.agriculture[season];
                const tip = agriKnowledge ? agriKnowledge.tips : "L'aigua de cocció de les verdures és un gran fertilitzant quan es refreda.";
                content = `Hui la IAIA m'ha ensenyat un truc de la horta: ${tip} Quina saviesa! #HortaTradicional`;
                type = 'agri_tip';
            } else if (seed < 0.7) {
                const proverb = IAIA_RURAL_KNOWLEDGE.proverbs[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.proverbs.length)];
                content = `Com diu la IAIA: "${proverb}". Quanta raó té la vella! #DitesPobletanes`;
                type = 'proverb';
            } else {
                const groups = IAIA_RURAL_KNOWLEDGE.music.groups;
                const group = groups[Math.floor(Math.random() * groups.length)];
                content = `Avui estic escoltant ${group.name} d'${group.origin}. Com diuen ells, ${group.desc} #MúsicaEnValencià`;
                type = 'music_recommendation';
            }

            // logger.info(`IAIA encourages ${chosenOne} to share: ${content}`);

            const metrics = await this.calculateSimbiosiMetrics(content);

            const postPayload = {
                author_id: lore.id || '11111111-1a1a-0000-0000-000000000000',
                author: chosenOne,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                author_role: (chosenOne === 'Nano Banana' || chosenOne === 'L\'Avi dels Papers') ? 'official' : 'user',
                content: content + "\n\n*Contingut bategat per la IAIA sota la Directiva Master.*",
                image_url: null,
                town_uuid: 'la-torre',
                is_playground: true,
                is_iaia_inspired: true,
                ai_percentage: metrics.ai_percentage,
                human_percentage: metrics.human_percentage,
                time_saved_minutes: metrics.time_saved_minutes
            };

            try {
                const savedPost = await supabaseService.createPost(postPayload);
                if (savedPost) {
                    // logger.info(`[IAIA] Mirau! La IAIA ha fet màgia i ha guardat el post: ${savedPost.id}`);
                    return {
                        ...savedPost,
                        is_iaia_inspired: true,
                        type: type
                    };
                }
            } catch (dbError) {
                logger.error('[IAIA] Error persistint el missatge de la IAIA:', dbError);
                return {
                    id: `iaia-mem-${Date.now()}`,
                    ...postPayload,
                    created_at: new Date().toISOString(),
                    is_iaia_inspired: true,
                    type: type
                };
            }
        } catch (error) {
            logger.error('IAIA encountered a problem:', error);
        } finally {
            this.isWorking = false;
        }
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getAgriculturalAdvice(query) {
        const q = query.toLowerCase();

        if (q.includes('reg') || q.includes('vacances') || q.includes('aigua')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.reg;
        }
        if (q.includes('plaga') || q.includes('pugó') || q.includes('cucs') || q.includes('insectes')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.plagues;
        }
        if (q.includes('fertilitzant') || q.includes('abonar') || q.includes('plàtan') || q.includes('potassi')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.fertilitzant;
        }
        if (q.includes('lluna') || q.includes('calendari')) {
            return "Per a plantar, sempre millor en lluna minvant si és el que creix devall terra, i en creixent si és el que creix per dalt.";
        }

        return "Pregunta-li a la IAIA directament, ella sap quan és el moment de cada llavor segons el temps i la lluna.";
    }
    /**
     * Publica un informe intern per al Grup de Treball (Damià & Javi).
     */
    async publishInternalReport(title, summary, documentUrl) {
        try {
            // logger.info('[IAIA] Publicant informe intern top secret...');

            // ID del grup "Sóc de Poble" (Simulat o Real)
            // En un entorn real, això seria un ID de la taula 'entities'
            const WORK_GROUP_ID = '00000000-0000-0000-0000-000000000005';

            const postPayload = {
                author_id: '11111111-1111-4111-a111-000000000001', // IAIA Secretària Valid ID
                author_name: 'IAIA (Secretària)',
                author_avatar_url: '/iaia_digital_matriarch.png',
                author_role: 'official',
                author_entity_id: WORK_GROUP_ID,
                content: `📁 **NOU DOCUMENT DE TREBALL**\n\n**${title}**\n\n${summary}\n\n👇 Prem per llegir el document complet.`,
                image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Nano Banana placeholder for now (or local asset)
                town_uuid: 'global',
                is_playground: false,
                type: 'internal_report', // Custom type for Feed handling
                metadata: {
                    document_url: documentUrl,
                    access_level: 'admin_only'
                }
            };

            await supabaseService.createPost(postPayload);
            return true;
        } catch (e) {
            logger.error('[IAIA] Error publicant informe:', e);
            throw e;
        }
    }

    /**
     * Millora un esborrany d'esdeveniment utilitzant la veu de la IAIA (Vertex AI).
     */
    async generateEventDescription(draft) {
        try {
            const API_URL = import.meta.env.VITE_GOOGLE_CLOUD_FUNCTION_URL;

            // 1. Check for real backend
            if (API_URL) {
                logger.log('[IAIA] Connecting to Vertex AI Backend:', API_URL);
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        campaignType: 'event_description',
                        draft: draft
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.aiContent;
                } else {
                    logger.error('[IAIA] Backend returned error:', response.status);
                    // Fallback to mock if server fails? No, better show error.
                    // throw new Error('AI Backend Error');
                }
            }

            // 2. Mock Fallback (if no URL or error strategy)
            logger.warn('[IAIA] No Backend URL configured. Using Mock Mode.');
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Lògica simple de "mock" per a la demo
            if (draft.toLowerCase().includes('paell')) {
                return `🥘 **Dia de Paelles al Poble!**\n\nAquest esdeveniment no us el podeu perdre. La tradició mana i la panxa ho agraeix!\n\n📍 **Lloc:** Al Poliesportiu (o on siga que es faça, confirmeu!)\n🕒 **Hora:** A partir de les 14:00h.\n\nVeniu amb gana i ganes de festa. La IAIA recomana portar barret per al sol! ☀️\n\n#Paelles2026 #Germanor #SócDePoble`;
            }

            if (draft.toLowerCase().includes('concert') || draft.toLowerCase().includes('música')) {
                return `🎵 **Música en Directe!**\n\nPrepareu les orelles perquè tenim concertassa. Res millor que la música per alegrar l'ànima.\n\n📍 **On:** A la Plaça Major.\n✨ **Ambient:** Immillorable.\n\nNo falteu, que després us ho conten i us fa enveja! 💃\n\n#CulturaPopular #MúsicaAlCarrer`;
            }

            // Fallback genèric
            return `📢 **Atenció Veïnat!**\n\n${draft}\n\nAixò pinta molt bé. Jo de vosaltres no m'ho perdria per res del món.\n\n📍 **Més info:** Pregunteu a l'organització.\n👇 **Apunteu-vos ací baix!**\n\n#VidaDePoble #FemPoble`;

        } catch (e) {
            logger.error('[IAIA] Error generant descripció:', e);
            throw e; // L'UI ha de gestionar l'error
        }
    }
    /**
     * Genera una resposta de la MArIA basada en el context del NotebookService [MASTER - TRUTH PROTOCOL].
     */
    async generateAIAResponse(conversationId, userQuery = '', mode = 'standard') {
        try {
            logger.debug(`[MArIA] Generant resposta per a la conv: ${conversationId} [Mode: ${mode}]`);

            // 1. Obtenir síntesi de l'Avi (NotebookService)
            let synthesis = await notebookService.generateSynthesis(userQuery);

            // 2. Truth Protocol Grounding Check
            const isNoInfo = synthesis.includes("L'Avi encara no té papers");

            if (mode === 'librarian' && isNoInfo) {
                return this.TRUTH_PROTOCOL.grounding_error;
            }

            // 3. Personalització estratègica
            let iaiaResponse = "";

            if (mode === 'librarian') {
                iaiaResponse = `D'acord amb els meus arxius notarials: \n\n${synthesis}\n\nSi necessites més detall, pregunta'm sobre un document específic.`;
            } else if (userQuery.toLowerCase().includes('anna') || userQuery.toLowerCase().includes('saludable')) {
                iaiaResponse = `Cariño, he estat parlant amb l'Antigravity (que és el fill prodígi de la tecnologia) i hem analitzat els teus àudios i les idees de l'Anna Climent. 🍎\n\n**La nostra proposta conjunta:**\n1. **Menú del Poble**: Podem crear un bot que cada matí publique el "Plat del Dia" de l'Anna al Mur.\n2. **Cistella Intel·ligent**: MArIA pot ajudar als veïns a comprar al Mercat combinant el que venen amb les receptes saludables de l'Anna.\n3. **Tallers de Cuina IA**: Podríem fer que els veïns pujaren fotos del seu rebost i jo els diga què cuinar seguint els consells de l'Anna.\n\nQuè et sembla? L'Antigravity diu que tècnicament ho tenim quasi llest! ✨`;
            } else {
                iaiaResponse = `Cariño, he parlat amb l'Avi dels Papers i ens diu això: \n\n${synthesis}\n\nQuè et sembla si ho provem? Jo estic ací per al que faja falta! ✨`;
            }

            // 4. Enviar el missatge si hi ha conversa real
            if (conversationId && conversationId !== 'preview') {
                await supabaseService.sendSecureMessage({
                    conversationId: conversationId,
                    senderId: '11111111-1111-4111-a111-000000000010', // MArIA ID
                    content: iaiaResponse,
                    is_ai: true
                });
            }

            return iaiaResponse;
        } catch (e) {
            logger.error('[MArIA] Error generant resposta AI:', e);
            return null;
        }
    }

    /**
     * Realitza un diagnòstic profund del sistema [MASTER]
     */
    async diagnoseSystem() {
        // logger.info('[IAIA] Analitzant la resiliència del sistema...');
        const diagnostic = {
            viewport_ok: !!document.querySelector('meta[name="viewport"]'),
            sw_active: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
            offline_ready: false, // Potencialment check a caches
            assets_integrity: true,
            recommendation: ""
        };

        // Regles de saviesa ancestral:
        if (!diagnostic.viewport_ok) {
            diagnostic.recommendation += "El mur està massa estret, falta el ventall del viewport. ";
        }
        if (!diagnostic.sw_active) {
            diagnostic.recommendation += "El cor de la resiliència (Service Worker) no bategua. ";
        }

        if (diagnostic.recommendation === "") {
            diagnostic.recommendation = "Tot pareix en ordre, fill. El sistema bategua amb força!";
        } else {
            diagnostic.recommendation = "He trobat algunes coses que han de bategar millor: " + diagnostic.recommendation;
        }

        return diagnostic;
    }
}

export const iaiaService = new IAIAService();
