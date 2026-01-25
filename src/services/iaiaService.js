import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
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
     * Activa a Nano Banana per "fer algo bonic".
     */
    async wakeUpNanoBanana() {
        logger.info('[NanoBanana] 🍌 A pintar el món de colors!');
        // Nano Banana simplement reactiva el cicle de la IAIA amb més intensitat per ara
        await this.generateAutonomousInteraction();
        await this.generateMarketActivity();
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

            if (seed < 0.4) {
                const legend = IAIA_RURAL_KNOWLEDGE.legends[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.legends.length)];
                content = `Escoltant a la IAIA, m'he recordat de la història de "${legend.title}". ${legend.story} #MemoriaViva`;
                type = 'legend';
            } else if (seed < 0.7) {
                const season = this.getCurrentSeason();
                const tip = IAIA_RURAL_KNOWLEDGE.agriculture[season].tips;
                content = `Hui la IAIA m'ha ensenyat un truc de la horta: ${tip} Quina saviesa! #HortaTradicional`;
                type = 'agri_tip';
            } else {
                const proverb = IAIA_RURAL_KNOWLEDGE.proverbs[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.proverbs.length)];
                content = `Com diu la IAIA: "${proverb}". Quanta raó té la vella! #DitesPobletanes`;
                type = 'proverb';
            }

            logger.info(`IAIA encourages ${chosenOne} to share: ${content}`);

            const postPayload = {
                author_id: lore.id || '11111111-0000-0000-0000-000000000000',
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
                author_id: '11111111-0000-0000-0000-000000000000', // IAIA
                author_name: 'IAIA (Secretària)',
                author_avatar_url: '/assets/avatars/iaia.png', // Assegurar que existeix o utilitzar URL externa
                author_role: 'ambassador',
                author_entity_id: WORK_GROUP_ID, // Publicat "en nom de" o "en el grup"
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
}

export const iaiaService = new IAIAService();
