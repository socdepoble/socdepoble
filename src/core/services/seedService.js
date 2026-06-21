import { supabase } from '../../supabaseClient';
import { logger } from '../../utils/logger';

/**
 * SeedService: Gestiona la sembra massiva de dades (Knowledge Base)
 */
export const seedService = {
    /**
     * Importa llavors des d'un fitxer JSON (com rhizome_seed_data.json)
     */
    async importSeeds(seedsData) {
        if (!seedsData || !seedsData.seeds) {
            logger.error('[Seed] No seeds found in data');
            return { success: false, error: 'No data' };
        }

        logger.log(`[Seed] Iniciant sembra de ${seedsData.seeds.length} llavors...`);

        try {
            // Transformem les llavors al format de la taula 'lexicon' o 'posts' 
            // depenent de la col·lecció. Per ara, anem a 'lexicon' com a base de coneixement.
            const lexiconEntries = seedsData.seeds.map(s => ({
                id: s.id,
                term: s.title,
                url: s.url,
                category: s.metadata.collection,
                tags: s.metadata.tags,
                synonyms: [], // Preparat per a futures variants
                audio_url: null, // Preparat per a arxius fonètics
                definition: `Recurs importat de Raindrop. [${s.metadata.collection}]`,
                created_at: s.created_at,
                is_official: s.metadata.is_important,
                source: 'raindrop_import',
                status: 'approved'
            }));

            // Inserció en batches per no saturar Supabase
            const BATCH_SIZE = 100;
            let successCount = 0;

            for (let i = 0; i < lexiconEntries.length; i += BATCH_SIZE) {
                const batch = lexiconEntries.slice(i, i + BATCH_SIZE);
                const { error } = await supabase
                    .from('lexicon')
                    .upsert(batch, { onConflict: 'url' });

                if (error) {
                    logger.error(`[Seed] Error en batch ${i}:`, error);
                } else {
                    successCount += batch.length;
                    logger.log(`[Seed] Progress: ${successCount}/${lexiconEntries.length}`);
                }
            }

            return { success: true, count: successCount };
        } catch (error) {
            logger.error('[Seed] Import failed:', error);
            return { success: false, error };
        }
    }
};
