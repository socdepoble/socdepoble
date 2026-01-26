import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * wordpressImporter - El pont entre la trajectòria antiga i la nova MasIA.
 */
export const wordpressImporter = {
    /**
     * Importa publicacions des de socdepoble.net filtrant per autor i etiqueta.
     */
    async importFromAuthor(authorSlug, tagSlug = 'treball', userId, entityId = null) {
        try {
            logger.info(`[Importer] Iniciant importació per a ${authorSlug} (tag: ${tagSlug})...`);

            // 1. Fetch posts from WordPress REST API (socdepoble.net)
            const response = await fetch(`https://socdepoble.net/wp-json/wp/v2/posts?author=1&tags=trabajo&_embed`);
            if (!response.ok) throw new Error('Error al connectar amb WordPress API');

            const wpPosts = await response.json();
            logger.info(`[Importer] S'han trobat ${wpPosts.length} publicacions.`);

            let importedCount = 0;

            for (const wpPost of wpPosts) {
                // Mapeig al PostSchema de Sóc de Poble
                const postPayload = {
                    uuid: crypto.randomUUID(),
                    author_id: userId,
                    entity_id: entityId, // Vinculació a l'Empresa
                    content: wpPost.content.rendered.replace(/<\/?[^>]+(>|$)/g, ""), // Clean HTML
                    image_url: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    created_at: wpPost.date,
                    town_uuid: 'a40b12da-5c54-4a53-adfd-b20d3019bda5',
                    is_playground: false,
                    type: 'imported_story',
                    metadata: {
                        wp_id: wpPost.id,
                        wp_link: wpPost.link,
                        tag: tagSlug
                    }
                };

                // 2. Insert into Supabase
                const { error } = await supabase.from('posts').insert([postPayload]);
                if (!error) importedCount++;
                else logger.error(`[Importer] Error important post ${wpPost.id}:`, error);
            }

            logger.info(`[Importer] Importació finalitzada: ${importedCount} posts portats al diamant.`);
            return importedCount;
        } catch (error) {
            logger.error('[Importer] Error crític en l\'importació:', error);
            throw error;
        }
    }
};
