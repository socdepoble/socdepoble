import { supabaseService } from './supabaseService';
import { logger } from '../utils/logger';

/**
 * MigrationService [VAMPIR DIGITAL]
 * Encarregat de xuclar dades de fonts externes (Raindrop) i fer-les sobiranes al Rebost.
 */
class MigrationService {
    /**
     * Parseja un fitxer HTML d'exportació de Bookmarks (estàndard Raindrop/Chrome).
     * @param {string} htmlContent 
     * @returns {Array} Llista d'objectes preparats per al Rebost
     */
    parseRaindropHTML(htmlContent) {
        logger.info('[Migration] Iniciant parseig de Raindrop HTML...');
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const links = doc.querySelectorAll('a');

        const items = Array.from(links).map(link => {
            const tags = link.getAttribute('tags') ? link.getAttribute('tags').split(',') : [];
            const folder = link.closest('dl')?.previousElementSibling?.textContent || 'Sense carpeta';

            return {
                title: link.textContent,
                url: link.href,
                description: link.getAttribute('note') || '',
                semantic_tags: [folder, ...tags].filter(t => t && t !== 'Sense carpeta'),
                created_at: new Date(parseInt(link.getAttribute('add_date')) * 1000).toISOString(),
                is_public: false,
                scope: 'private'
            };
        });

        logger.info(`[Migration] Detectats ${items.length} recursos.`);
        return items;
    }

    /**
     * Importa els items al Rebost de l'usuari.
     * @param {Array} items 
     * @param {string} userId 
     */
    async importToRebost(items, userId) {
        if (!userId) throw new Error('Cal un ID d\'usuari per a importar.');

        logger.info(`[Migration] Important ${items.length} items al Rebost de l'usuari ${userId}...`);

        const preparedItems = items.map(item => ({
            ...item,
            owner_id: userId,
            created_at: item.created_at || new Date().toISOString()
        }));

        // Podríem fer un batch de 50 en 50 per no saturar Supabase
        const BATCH_SIZE = 50;
        let successful = 0;

        for (let i = 0; i < preparedItems.length; i += BATCH_SIZE) {
            const batch = preparedItems.slice(i, i + BATCH_SIZE);
            try {
                const { error } = await supabaseService.supabase
                    .from('resources')
                    .insert(batch);

                if (error) throw error;
                successful += batch.length;
                logger.log(`[Migration] Progress: ${successful}/${preparedItems.length}`);
            } catch (err) {
                logger.error(`[Migration] Error en el lot ${i}:`, err);
            }
        }

        return {
            total: items.length,
            successful,
            failed: items.length - successful
        };
    }

    /**
     * Enriquiment "Nano Banana": Genera una caràtula visual si no n'hi ha.
     */
    async enrichResource(resource) {
        // En una versió real, aquí cridaríem a un scraper o API de metadades.
        // Per ara, simulem l'enriquiment de Nano Banana.
        logger.info(`[NanoBanana] Enriquin: ${resource.title}`);

        return {
            ...resource,
            thumbnail_url: `https://api.screenshotmachine.com/?key=DEMO&url=${encodeURIComponent(resource.url)}&dimension=1024x768`, // Placeholder
            enriched: true
        };
    }
}

export const migrationService = new MigrationService();
