import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
import { logger } from '../utils/logger';

class IAIAService {
    constructor() {
        this.isWorking = false;
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

            return {
                id: `iaia-post-${Date.now()}`,
                author: chosenOne,
                author_avatar: lore.avatar_url,
                content: content,
                is_iaia_inspired: true,
                created_at: new Date().toISOString(),
                likes: Math.floor(Math.random() * 15),
                comments: Math.floor(Math.random() * 5),
                type: type
            };

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
}

export const iaiaService = new IAIAService();
