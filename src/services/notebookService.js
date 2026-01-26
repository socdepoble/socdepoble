import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';

/**
 * NotebookService: El Cerebro Analítico (El Marido de la IAIA)
 * Inspirado en Google NotebookLM para síntesis de conocimiento rural.
 */
class NotebookService {
    constructor() {
        this.sources = [];
        this.memoryLimit = 50;
    }

    /**
     * Ingiere una nueva fuente de conocimiento.
     */
    async ingestSource(type, content, metadata = {}) {
        const sourceId = `src-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.sources.push({ id: sourceId, type, content, metadata, timestamp: new Date().toISOString() });

        if (this.sources.length > this.memoryLimit) {
            this.sources.shift(); // FIFO Memory
        }

        logger.info(`[Notebook] Fuente ingerida: ${type} - ${metadata.title || 'Sense títol'}`);
        return sourceId;
    }

    /**
     * Genera una síntesis semántica basada en las fuentes actuales.
     */
    async generateSynthesis(query = '') {
        logger.info(`[Notebook] Generant síntesi per a: ${query || 'Resum general'}`);

        // Simulación de razonamiento NotebookLM (RAG Lite)
        const relevantSources = query
            ? this.sources.filter(s => s.content.toLowerCase().includes(query.toLowerCase()))
            : this.sources;

        if (relevantSources.length === 0) {
            return "L'Avi encara no té papers sobre aquest tema, però la memòria del poble és gran.";
        }

        // Síntesis "Avi Style" (Séria, analítica, pero con alma)
        const summary = relevantSources.map(s => s.content.substring(0, 100)).join('... ');
        return `Basant-me en els documents històrics i l'activitat recent: ${summary}...\n\n-- L'Avi dels Papers`;
    }

    /**
     * Genera un 'Audio Overview' textual para ser leído por TTS.
     */
    async generateAudioOverview(topic) {
        logger.info(`[Notebook] Preparant guió d'àudio per a: ${topic}`);
        // Estructura de podcast NotebookLM: Avi & IAIA hablando
        return `AVI: Bon dia, IAIA. He estat revisant els papers sobre ${topic}.
                IAIA: Home, ja era hora! Què diuen les dades?
                AVI: Diuen que el poble està més viu que mai, amb un increment de l'actividad en el mercat i molta música.
                IAIA: Això ja ho sabia jo sense tant de paper, però m'agrada que ho confirmes.`;
    }

    /**
     * Genera el Resumen Semanal del Pueblo.
     */
    async generateVillageWeeklySummary() {
        try {
            // 1. Recopilar actividad real de la DB (Mocks silenciados en prod)
            const posts = await supabaseService.getPosts('tot', null, 0, 20);
            const marketCount = await supabaseService.getMarketItems(); // Simplified check

            // 2. Sintetizar
            const summary = `Hui l'Avi dels Papers ens porta el resum de la setmana a la Torre:\n\n📊 Hem tingut ${posts.length} noves històries compartides al Mur.\n🍎 El Mercat està bullint amb ${marketCount?.length || 'molta'} activitat.\n🎵 La música valenciana ha estat el fil conductor de les nostres converses.\n\nKeep it rural, keep it smart.`;

            return {
                author_id: '11111111-notebook-0000-0000-000000000000',
                author_name: "L'Avi dels Papers",
                author_avatar_url: '/assets/avatars/avi_papers.png',
                author_role: 'official',
                content: summary,
                type: 'weekly_synthesis',
                is_playground: true
            };
        } catch (e) {
            logger.error('[Notebook] Error generant resum setmanal:', e);
            return null;
        }
    }
}

export const notebookService = new NotebookService();
