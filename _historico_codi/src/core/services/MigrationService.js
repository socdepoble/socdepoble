import { supabaseService } from './supabaseService';
import { logger } from '../../utils/logger';

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
            title: item.title || 'Sense títol',
            url: item.url || '',
            description: item.description || '',
            excerpt: item.excerpt || item.description || '',
            content_type: item.content_type || 'link',
            semantic_tags: item.semantic_tags || [],
            source: item.source || 'Importació',
            metadata: item.metadata || {},
            owner_id: userId,
            created_at: item.created_at || new Date().toISOString(),
            is_public: item.is_public || false,
            scope: item.scope || 'private'
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

    /**
     * EXPORTACIÓ SOBIRANA: Descarrega tota la informació de l'usuari.
     * @param {Array} resources 
     */
    async exportRebostData(resources) {
        logger.info('[Sovereignty] Iniciant exportació total de dades...');

        const dataStr = JSON.stringify(resources, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `meua_memoria_sdp_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        logger.log('[Sovereignty] Exportació culminada amb èxit.');
    }

    /**
     * Parseja un fitxer JSON de Notion (exportació estàndard).
     */
    parseNotionJSON(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);

            // Notion pot exportar un array o un objecte amb un camp 'results'
            const items = Array.isArray(data) ? data : (data.results || [data]);

            logger.info(`[Migration] Parsejats ${items.length} items de Notion.`);
            return items;
        } catch (e) {
            logger.error('[Migration] Error parsejant Notion JSON:', e);
            throw new Error('El fitxer JSON de Notion no és vàlid o està corrupte.');
        }
    }
}

export const migrationService = new MigrationService();
