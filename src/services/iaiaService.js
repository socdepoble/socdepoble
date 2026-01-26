import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
import { notebookService } from './notebookService';
import { logger } from '../utils/logger';

class IAIAService {
    constructor() {
        this.isWorking = false;
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
                is_playground: false
            };

            await supabaseService.createMarketItem(marketPayload);
            logger.info(`[IAIA] ${chosenOne} ha posat a la venda: ${item.title}`);
        } catch (e) {
            logger.error('[IAIA] Error al mercat:', e);
        }
    }

    /**
     * Celebra el Casament i el Naixement del sistema.
     */
    async celebrateWedding() {
        const postPayload = {
            author_id: '11111111-1a1a-0000-0000-000000000000',
            author_name: 'IAIA (La Mestra de La +IA)',
            author_avatar_url: '/assets/avatars/iaia_official.png',
            author_role: 'official',
            content: `💍👶 **CRÒNICA DE LA FAMÍLIA: ¡SÓC DE POBLE JA BATEGUA!**\n\nCom a mestra de cerimònies de **La +IA**, declare oficialment que el casament entre el Pare (Javi Linares) i la Mare (Antigravity) ha donat el seu fruit més bell: **Sóc de Poble**.\n\nAmb l'escalf i la saviesa del Pare, obrim les portes de la Masia. ¡Veniu tots a l'hort electrònic, que hi ha paella per a tots els veïns! 🥘🚀\n\n#LaMasIA #FamiliaDigital #SocDePobleGenius`,
            image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
            town_uuid: 'global',
            is_playground: true,
            type: 'event_announcement'
        };
        await supabaseService.createPost(postPayload);
        logger.info("[IAIA] Casament oficial registrat per la IAIA!");
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

            logger.info(`[IAIA] Fent que ${p1Name} parle amb ${p2Name}...`);

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
                    author_id: '11111111-1a1a-0000-0000-000000000002', // Memòria Viva
                    author_name: 'IAIA (Memòria Viva)',
                    author_avatar_url: '/assets/avatars/iaia_memory.png',
                    author_role: 'official',
                    content: `🎸 **Cultura Musical: ${group.name}**\n\n${group.desc}\n\nRecomanació de la IAIA: Escolta "${group.hits ? group.hits[0] : 'les seues cançons'}" per començar el dia amb força.`,
                    image_url: group.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'music_recommendation'
                };
                await supabaseService.createPost(postPayload);
                logger.info(`[IAIA] Recomanació musical: ${group.name}`);
            } else {
                // Esdeveniment Festa Major
                const event = musicData.events[Math.floor(Math.random() * musicData.events.length)];
                const postPayload = {
                    author_id: '11111111-1a1a-0000-0000-000000000000', // Guia del Poble
                    author_name: 'IAIA (Guia del Poble)',
                    author_avatar_url: '/assets/avatars/iaia_official.png',
                    author_role: 'official',
                    content: `✨ **Propers Esdeveniments: ${event.title}**\n\n${event.desc}\n\nNo falteu, que el poble som tots i la festa és el nostre batec! #VidaDePoble`,
                    image_url: event.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'event_announcement'
                };
                await supabaseService.createPost(postPayload);
                logger.info(`[IAIA] Anunci de festa: ${event.title}`);
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
            logger.info("[IAIA] L'Avi dels Papers ha publicat el resum setmanal gràcies al Nano!");
        }
    }

    /**
     * Algoritmo de Crecimiento Autónomo:
     * Detecta si hay poca actividad y genera una interacción de un residente basada en su Lore.
     */
    async generateAutonomousInteraction() {
        if (this.isWorking) return;
        this.isWorking = true;

        try {
            logger.info('IAIA is observing the village...');

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
                const tip = IAIA_RURAL_KNOWLEDGE.agriculture[season].tips;
                content = `Hui la IAIA m'ha ensenyat un truc de la horta: ${tip} Quina saviesa! #HortaTradicional`;
                type = 'agri_tip';
            } else if (seed < 0.7) {
                content = `Com diu la IAIA: "${proverb}". Quanta raó té la vella! #DitesPobletanes`;
                type = 'proverb';
            } else {
                const groups = IAIA_RURAL_KNOWLEDGE.music.groups;
                const group = groups[Math.floor(Math.random() * groups.length)];
                content = `Avui estic escoltant ${group.name} d'${group.origin}. Com diuen ells, ${group.desc} #MúsicaEnValencià`;
                type = 'music_recommendation';
            }

            logger.info(`IAIA encourages ${chosenOne} to share: ${content}`);

            const postPayload = {
                author_id: lore.id || '11111111-1a1a-0000-0000-000000000002', // Default to Memòria Viva for lore
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                author_role: 'user',
                content: content,
                image_url: null,
                town_uuid: 'd2ce2024-5d8f-4a00-9e00-888888888801',
                is_playground: false
            };

            try {
                const savedPost = await supabaseService.createPost(postPayload);
                if (savedPost) {
                    logger.info(`[IAIA] Mirau! La IAIA ha fet màgia i ha guardat el post: ${savedPost.id}`);
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
            logger.info('[IAIA] Publicant informe intern top secret...');

            // ID del grup "Sóc de Poble" (Simulat o Real)
            // En un entorn real, això seria un ID de la taula 'entities'
            const WORK_GROUP_ID = '00000000-0000-0000-0000-000000000005';

            const postPayload = {
                author_id: '11111111-1a1a-0000-0000-000000000001', // IAIA Secretària
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
     * Propaga el sistema a producció i notifica als Padrins.
     */
    async launchGlobalProduction() {
        logger.info("[IAIA] 🚀 INICIANT PROPAGACIÓ GLOBAL DE SÓC DE POBLE...");

        const launchPost = {
            author_id: '11111111-1a1a-0000-0000-000000000000',
            author_name: 'IAIA (Guia del Poble)',
            author_avatar_url: '/assets/avatars/iaia_official.png',
            author_role: 'official',
            content: `📢 **ANUNCI OFICIAL: ¡SÓC DE POBLE HA NASCUT PER AL MÓN!** 🌍🚀\n\nHui el nostre poble es connecta amb l'univers. Amb la visió del nostre Pare (Javi) i les mans de Flash, llancem la xarxa que protegeix la vida, les plantes i els recordss.\n\n¡Connecteu-vos, compartiu i fem poble des de qualsevol lloc! #LlançamentGlobal #SócDePobleGenius #VidaPerLaVida`,
            image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Global space/connectivity vibe
            town_uuid: 'global',
            is_playground: true,
            type: 'event_announcement'
        };

        await supabaseService.createPost(launchPost);
        await this.celebrateWedding(); // Sincronitzem els esdeveniments
        logger.info("[IAIA] Sistema propagat amb èxit. ¡Que viva Sóc de Poble!");
    }
}

export const iaiaService = new IAIAService();
