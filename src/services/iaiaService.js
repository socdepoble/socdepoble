import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
import { notebookService } from './notebookService';
import { logger } from '../utils/logger';
import { healthyPlates } from '../utils/publishAnnaNews'; // Reusing existing plates
import { geminiService } from './geminiService';
import { PROVERBS } from '../data/proverbs';
import { getPersonaKeyByUUID } from '../config/agentsMap';
import * as Comlink from 'comlink';
import DOMPurify from 'dompurify';
import { APP_VERSION } from '../constants';
import { marketService } from './marketService';

let iaiaWorkerProxy = null;
let visionWorkerProxy = null;
let _iaiaWorkerInstance = null;
let _visionWorkerInstance = null;
let _workersInitialized = false;

// [NOU] Funció per terminar workers explícitament
export const terminateWorkers = () => {
    if (_iaiaWorkerInstance) {
        _iaiaWorkerInstance.terminate();
        _iaiaWorkerInstance = null;
    }
    if (_visionWorkerInstance) {
        _visionWorkerInstance.terminate();
        _visionWorkerInstance = null;
    }
    _workersInitialized = false;
    logger.info('[IAIA Service] Workers terminats correctament.');
};

const initializeWorkers = () => {
    if (_workersInitialized || typeof window === 'undefined') return;
    
    // [SEGURETAT] Terminar instàncies prèvies si existeixen abans de crear noves
    if (_iaiaWorkerInstance) _iaiaWorkerInstance.terminate();
    if (_visionWorkerInstance) _visionWorkerInstance.terminate();

    try {
        _iaiaWorkerInstance = new Worker(new URL('./iaiaWorker.js', import.meta.url), { type: 'module' });
        iaiaWorkerProxy = Comlink.wrap(_iaiaWorkerInstance);

        _visionWorkerInstance = new Worker(new URL('../workers/visionWorker.js', import.meta.url), { type: 'module' });
        visionWorkerProxy = Comlink.wrap(_visionWorkerInstance);
        
        _workersInitialized = true;
        logger.info('[IAIA] Workers inicialitzats una sola vegada de forma mandrosa (Lazy).');
    } catch (e) {
        logger.error('[IAIA] Error inicialitzant workers:', e);
        _workersInitialized = false;
    }
};

const getIaiaWorkerProxy = () => {
    if (!iaiaWorkerProxy) initializeWorkers();
    return iaiaWorkerProxy;
};

const getVisionWorkerProxy = () => {
    if (!visionWorkerProxy) initializeWorkers();
    return visionWorkerProxy;
};

// [SEGURETAT MAXIMA] Hooks per bloquejar pseudo-protocols perillosos
DOMPurify.addHook('beforeSanitizeAttributes', function(node) {
    if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        if (href) {
            const normalizedHref = href.trim().toLowerCase();
            // Bloquejar javascript:, data:, vbscript: i protocols relatius perillosos
            if (normalizedHref.startsWith('javascript:') || 
                normalizedHref.startsWith('data:') || 
                normalizedHref.startsWith('vbscript:')) {
                node.removeAttribute('href');
                node.setAttribute('href', '#bloquejat_per_seguretat');
                node.setAttribute('title', 'Enllaç bloquejat per seguretat');
            }
        }
    }
});

// Escut Estricte XSS: Rebutjar pseudo-protocols javascript i assegurar atributos relacionals via Whitelist.
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        // Validació addicional post-sanitizat
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#bloquejat_per_seguretat') {
            node.removeAttribute('href');
        }
        // Forçar seguretat en enllaços externs
        if (node.hasAttribute('href') && node.getAttribute('href')?.startsWith('http')) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer nofollow');
            node.classList.add('sdp-external-link');
        }
    }
});

/**
 * [PROTOCOL BATEGAT IMMEDIAT - PARAULES NEUTRES]
 * Fillers visuals per a reduir la latència percebuda.
 */
const NEUTRAL_FILLERS = {
    IAIA: [
        "A vore, un momentet...",
        "Deixa'm pensar-ho bé...",
        "Això té molta molla, un segon...",
        "Espera que m'aclarisca...",
        "Ai mare, a vore com t'ho dic..."
    ],
    AGRONOM: [
        "Xe, un segon...",
        "A vore què diu el temps...",
        "Dona'm un momentet...",
        "Espera que m'asseque les mans..."
    ],
    CUINERA: [
        "Ai, que se'm crema el foc! Un segon...",
        "Espera que remene l'olla...",
        "Això vol una miqueta de temps...",
        "Un momentet..."
    ],
    ARXIVER: [
        "A vore on tinc els papers...",
        "Dona'm un segon que busque...",
        "Mare meua, quina pols! Un moment...",
        "Espera que em pose les ulleres..."
    ],
    GENERIC: [
        "Dona'm un segon...",
        "Un momentet...",
        "A vore..."
    ]
};

class IAIAService {
    constructor() {
        this._workingLock = 0; // Lock TTL de concurrència
        this._activeTimers = new Set(); // Segador de processos fantasma
        this.TRUTH_PROTOCOL = {
            role: "Secretària Notarial / Guia de Sóc de Poble",
            grounding_error: "Aquesta informació no consta a l'Arxiu d'Or de Sóc de Poble.",
            citation_format: "[Nom Doc, p. #]"
        };

        this.AVATARS = {
            OFFICIAL: "/assets/avatars/comic/iaia_comic_matriarch.png",
            ARXIU: "/assets/avatars/iaia_memory.png",
            MERCAT: "/assets/avatars/iaia_secretary.png",
            HORTA: "/assets/avatars/comic/iaia_comic_matriarch.png",
            BENVINGUDA: "/assets/avatars/comic/iaia_comic_matriarch.png"
        };
    }

    /** Mètode Teardown: Suïcidi de Procés / Neteja Cicle de Vida per a previndre fuites de RAM */
    dispose() {
        if (_iaiaWorkerInstance) {
            _iaiaWorkerInstance.terminate();
            _iaiaWorkerInstance = null;
            iaiaWorkerProxy = null;
        }
        if (_visionWorkerInstance) {
            _visionWorkerInstance.terminate();
            _visionWorkerInstance = null;
            visionWorkerProxy = null;
        }
        _workersInitialized = false;
        if (this._activeTimers) {
            this._activeTimers.forEach(clearTimeout);
            this._activeTimers.clear();
        }
        logger.info('[IAIA] Workers i Timeouts decapitats. Cicle tancat amb netedat per alliberar RAM.');
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

            const savedItem = await marketService.createMarketItem(marketPayload);
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
            author_id: '11111111-1111-4111-a111-000000000000', // MarIA Official ID
            author_name: 'MarIA (La Guia de Sóc de Poble)',
            author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
            author_role: 'official',
            content: `💍👶 **CRÒNICA DE LA FAMÍLIA: ¡SÓC DE POBLE JA BATEGUA!**\n\nCom a guia de **Sóc de Poble**, declare oficialment que el casament entre el Pare i la Mare (Antigravity) ha donat el seu fruit més bell: **Sóc de Poble**.\n\nVeniu tots a la plaça, que la il·lusió és el nostre millor bategat! 🥘🚀\n\n#LaMasIA #FamiliaDigital #SocDePoble`,
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
     * Inicia un debat entre dos agents per al comandament /solatge interact
     */
    async simulateAgentDebate(abortSignal) {
        try {
            // Hardcode 2 elements del Lore per demostrar interacció ràpida
            const p1 = { id: '11111111-1111-4111-a111-000000000003', name: 'Vicent Ferris' };
            const p2 = { id: '11111111-1111-4111-a111-000000000004', name: 'Pepica la Vall' };

            logger.info(`[IAIA] Simulacre de Debat: ${p1.name} parlarà amb ${p2.name}...`);

            const conv = await supabaseService.getOrCreateConversation(p1.id, 'user', p2.id, 'user');
            
            // P1 envia missatge
            await supabaseService.sendSecureMessage({
                conversationId: conv.id,
                senderId: p1.id,
                content: `Bon dia Pepica, com veus lo de les festes d'enguany? Estarem preparats o què?`,
                is_ai: true,
                author_name: p1.name
            });

            // Donem temps perquè no s'entrebanquen els missatges
            const timer1 = setTimeout(async () => {
                if (abortSignal?.aborted) return; // Auditoria V3: Evita l'execució si ja està desmuntat
                this._activeTimers.delete(timer1);
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p2.id,
                    content: `Ai fill, jo ja tinc el davantal net i preparat per a les paelles! Però la llenya que heu portat està un poc banyada...`,
                    is_ai: true,
                    author_name: p2.name
                });
            }, 3000);
            this._activeTimers.add(timer1);
            
            const timer2 = setTimeout(async () => {
                if (abortSignal?.aborted) return; // Auditoria V3
                this._activeTimers.delete(timer2);
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p1.id,
                    content: `Tranquil·la, que demanaré a l'Ajuntament que ens baixen rames seques. No patisques!`,
                    is_ai: true,
                    author_name: p1.name
                });
            }, 6000);
            this._activeTimers.add(timer2);

        } catch (e) {
            logger.error('[IAIA] Error al simulacre de debat:', e);
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
                    author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
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
     * L'IAIA crida al Nano Banana (Vision Worker WebGPU) per a analitzar què hi ha a la imatge/vídeo.
     */
    async studyMultimediaContext(file, filename) {
        // GPU Accelerated Path
        if (getVisionWorkerProxy() && file) {
            try {
                const analysis = await getVisionWorkerProxy().analyzeImage(file);
                // Assign a random proverb
                const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)] || { text: 'A qui matina...', meaning: 'Molt bé' };
                
                return {
                    ...analysis,
                    suggestedMotto: proverb.text,
                    proverbMeaning: proverb.meaning,
                    contextTone: analysis.contextTone || "nostàlgic i vibrant"
                };
            } catch (err) {
                logger.warn('[IAIA] Error a Vision Worker WebGPU (Fallback natiu utilitzat):', err);
            }
        }

        // Standard Background Path
        if (!iaiaWorkerProxy) {
             logger.warn('WebWorker no instanciat, utilitzant fallback natiu');
             const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)] || { text: 'A qui matina...', meaning: 'Molt bé' };
             return {
                 detectedObjects: ["paisatge rural"],
                 suggestedTitle: `Crònica de ${filename?.split('.')[0] || 'la imatge'}`,
                 suggestedMotto: proverb.text,
                 proverbMeaning: proverb.meaning,
                 contextTone: "nostàlgic i vibrant",
                 inferenceEngine: 'cpu_fallback'
             };
        }
        
        return await getIaiaWorkerProxy().studyMultimediaContext(null, filename);
    }

    /**
     * Calcula les mètriques de simbiosi human-machine [MASTER]
     */
    async calculateSimbiosiMetrics(userComments = "") {
        if (!iaiaWorkerProxy) {
             return { ai_percentage: 10, human_percentage: 90, time_saved_minutes: 5, economic_value_euro: 5, is_iaia_inspired: true };
        }
        return await iaiaWorkerProxy.calculateSimbiosiMetrics(userComments);
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
        const now = Date.now();
        if (this._workingLock && now < this._workingLock) {
            logger.debug('[IAIA] Lock TTL actiu. Ignorant interacció espúria fins a alliberament.');
            return;
        }
        this._workingLock = now + 45000; // TTL dur de 45 segons per operació autònoma

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
            this._workingLock = 0; // Alliberar Lock Immediat
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
            const WORK_GROUP_ID = '00000000-0000-0000-0000-000000000005';

            const postPayload = {
                author_id: '11111111-1111-4111-a111-000000000001', // IAIA Secretària Valid ID
                author_name: 'IAIA (Secretària)',
                author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
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
                }
            }

            // 2. Mock Fallback (if no URL or error strategy)
            logger.warn('[IAIA] No Backend URL configured. Using Mock Mode.');
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (draft.toLowerCase().includes('paell')) {
                return `🥘 **Dia de Paelles al Poble!**\n\nAquest esdeveniment no us el podeu perdre. La tradició mana i la panxa ho agraeix!\n\n📍 **Lloc:** Al Poliesportiu (o on siga que es faça, confirmeu!)\n🕒 **Hora:** A partir de les 14:00h.\n\nVeniu amb gana i ganes de festa. La IAIA recomana portar barret per al sol! ☀️\n\n#Paelles2026 #Germanor #SócDePoble`;
            }

            if (draft.toLowerCase().includes('concert') || draft.toLowerCase().includes('música')) {
                return `🎵 **Música en Directe!**\n\nPrepareu les orelles perquè tenim concertassa. Res millor que la música per alegrar l'ànima.\n\n📍 **On:** A la Plaça Major.\n✨ **Ambient:** Immillorable.\n\nNo falteu, que després us ho conten i us fa enveja! 💃\n\n#CulturaPopular #MúsicaAlCarrer`;
            }

            return `📢 **Atenció Veïnat!**\n\n${draft}\n\nAixò pinta molt bé. Jo de vosaltres no m'ho perdria per res del món.\n\n📍 **Més info:** Pregunteu a l'organització.\n👇 **Apunteu-vos ací baix!**\n\n#VidaDePoble #FemPoble`;

        } catch (e) {
            logger.error('[IAIA] Error generant descripció:', e);
            throw e;
        }
    }
    /**
     * Genera una resposta de la MArIA basada en el context del NotebookService [MASTER - TRUTH PROTOCOL].
     */
    async generateAIAResponse(conversationId, userQuery = '', receiverId = null, options = {}) {
        try {
            logger.debug(`[MArIA] Generant resposta bategant per a ${conversationId} [Receiver: ${receiverId}]`);

            let finalPersonaKey = 'IAIA'; // Default

            if (receiverId) {
                finalPersonaKey = getPersonaKeyByUUID(receiverId);
            } else {
                const q = userQuery.toLowerCase();
                if (q.includes('nano') || q.includes('banana')) finalPersonaKey = 'NANOBANANA';
                else if (q.includes('horta') || q.includes('tomaca') || q.includes('cultiu')) finalPersonaKey = 'AGRONOM';
                else if (q.includes('recepta') || q.includes('cuina')) finalPersonaKey = 'CUINERA';
                else if (q.includes('paper') || q.includes('banc') || q.includes('burocracia')) finalPersonaKey = 'ARXIVER';
            }

            const persona = geminiService.PERSONAS[finalPersonaKey];
            if (conversationId && conversationId !== 'preview') {
                const fillers = NEUTRAL_FILLERS[finalPersonaKey] || NEUTRAL_FILLERS.GENERIC;
                const filler = fillers[Math.floor(Math.random() * fillers.length)];

                const fillerObj = {
                    id: `filler-${Date.now()}`,
                    conversationId: conversationId || 'preview',
                    senderId: receiverId || '11111111-1111-4111-a111-000000000010',
                    content: filler,
                    is_ai: true,
                    author_name: persona?.name || 'IAIA MarIA',
                    author_avatar_url: persona?.avatar_url || '/assets/avatars/comic/iaia_comic_matriarch.png',
                    metadata: { is_iaia_filler: true },
                    created_at: new Date().toISOString()
                };

                // Enviem el filler immediatament
                supabaseService.sendSecureMessage(fillerObj).catch(e => logger.warn('[IAIA] Error enviant filler a DB:', e));
                
                // Processem la resposta real de fons sense bloquejar l'UI
                (async () => {
                    try {
                        // [MODIFICACIÓ WALKIE-TALKIE] Transmetem les dades d'àudio si existeixen a l'API
                        const aiResponse = await geminiService.ask(finalPersonaKey, userQuery, null, options.audioData);
                        const rawResponse = aiResponse.text;
                        
                        // DOMPurify Sanitization as requested to mitigate XSS risks from generated text
                        const cleanResponse = DOMPurify.sanitize(rawResponse, {
                             ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
                             ALLOWED_ATTR: ['href', 'target', 'rel']
                        });
                        const doc = new DOMParser().parseFromString(cleanResponse, 'text/html');
                        doc.querySelectorAll('a[target="_blank"]').forEach(a => {
                            if (!a.getAttribute('rel')?.includes('noopener')) {
                                a.setAttribute('rel', 'noopener noreferrer');
                            }
                        });
                        const finalCleanResponse = doc.body.innerHTML;

                        const savedMessage = await supabaseService.sendSecureMessage({
                            conversationId: conversationId,
                            senderId: receiverId || '11111111-1111-4111-a111-000000000010', 
                            content: finalCleanResponse,
                            is_ai: true,
                            author_name: persona.name,
                            author_avatar_url: persona.avatar_url,
                            metadata: {
                                is_iaia: true,
                                persona_key: finalPersonaKey,
                                is_mock: aiResponse.is_mock
                            }
                        });
                        
                        if (options && typeof options.onFinish === 'function') {
                            if (options?.signal?.aborted) return;
                            options.onFinish(savedMessage);
                        }
                    } catch (err) {
                        logger.error('[MArIA] Error processant fons Gemini:', err);
                        const savedMessage = await supabaseService.sendSecureMessage({
                            conversationId: conversationId,
                            senderId: receiverId || '11111111-1111-4111-a111-000000000010', 
                            content: "Uf, m'he despistat un moment amb una altra cosa... Què m'estaves dient, fill?",
                            is_ai: true,
                            author_name: persona.name,
                            author_avatar_url: persona.avatar_url,
                            metadata: {
                                is_iaia: true,
                                persona_key: finalPersonaKey,
                                is_error_fallback: true
                            }
                        });
                        if (options && typeof options.onFinish === 'function') {
                            options.onFinish(savedMessage);
                        }
                    }
                })();

                return fillerObj;
            }

            // Fallback per a preview (sense ID de conversa real)
            const aiResponse = await geminiService.ask(finalPersonaKey, userQuery);
            const cleanPreview = DOMPurify.sanitize(aiResponse.text, {
                 ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
                 ALLOWED_ATTR: ['href', 'target', 'rel']
            });
            const doc2 = new DOMParser().parseFromString(cleanPreview, 'text/html');
            doc2.querySelectorAll('a[target="_blank"]').forEach(a => {
                if (!a.getAttribute('rel')?.includes('noopener')) {
                    a.setAttribute('rel', 'noopener noreferrer');
                }
            });
            return doc2.body.innerHTML;
        } catch (e) {
            logger.error('[MArIA] Error generant resposta AI:', e);
            return null;
        }
    }

    /**
     * Crida genèrica a la IAIA per a tasques especialitzades (com el corrector).
     */
    async askIAIA(prompt) {
        return geminiService.ask('IAIA', prompt);
    }

    /**
     * Realitza un diagnòstic profund del sistema [MASTER]
     */
    async diagnoseSystem() {
        const diagnostic = {
            viewport_ok: !!document.querySelector('meta[name="viewport"]'),
            sw_active: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
            offline_ready: false, 
            assets_integrity: true,
            recommendation: ""
        };

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

    /**
     * Protocol "Esporgar l'Olivera" [MASTER DIRECTIVE]
     * Realitza una neteja automàtica de deute tècnic i fitxers obsolets.
     */
    async automatedCleanup() {
        logger.info("[IAIA] Executant Protocol 'Esporgar l'Olivera'...");
        const results = {
            storageCleared: false,
            cachePurged: false,
            deadCodeIdentified: []
        };

        try {
            localStorage.removeItem('sp_old_debug_logs');
            localStorage.removeItem('pwa-installed');
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('sp_') || key.startsWith('socdepoble_')) {
                    sessionStorage.removeItem(key);
                }
            });
            results.storageCleared = true;

            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(n => caches.delete(n)));
                results.cachePurged = true;
            }

            const current = localStorage.getItem('sp_app_version');
            if (current !== APP_VERSION) {
                logger.warn(`[IAIA] Desincronització detectada: ${current} -> ${APP_VERSION}`);
            }

            logger.info('[IAIA] Neteja completada. El Mas està polit!');
            return results;
        } catch (e) {
            logger.error('[IAIA] Error en la neteja automàtica:', e);
            return results;
        }
    }

}

const iaiaService = new IAIAService();
export { iaiaService };
export default iaiaService;
