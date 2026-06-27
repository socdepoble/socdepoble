import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from '../core/services/supabaseService';
import { logger } from './logger';
import { marketService } from '../core/services/marketService';

/**
 * Town Content Generator [PHASE 4]
 * Dynamically populates "Gent de..." feeds for towns with low activity.
 */
export const townContentGenerator = {
    /**
     * Generates a "Seed Post" for a specific town based on its identity or random rural knowledge.
     * @param {string} townId 
     * @param {string} townName 
     */
    async seedTownFeed(townId, townName) {
        if (!townId || !townName) return;

        logger.info(`[TerritorialExpansion] Seeding feed for ${townName} (${townId})`);

        try {
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            // Select random rural knowledge
            const seed = Math.random();
            let content = '';
            let type = 'post';

            if (seed < 0.3) {
                const proverb = IAIA_RURAL_KNOWLEDGE.proverbs[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.proverbs.length)];
                content = `Caminant per ${townName}, m'ha vingut al cap el que sempre deia ma mare: "${proverb}". Som terra i som memòria.`;
            } else if (seed < 0.6) {
                const legend = IAIA_RURAL_KNOWLEDGE.legends[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.legends.length)];
                content = `He sentit dir que ací a la comarca, a prop de ${townName}, la història de "${legend.title}" encara es recorda. Algú en sap més?`;
                type = 'legend';
            } else {
                const season = this.getCurrentSeason();
                const tip = IAIA_RURAL_KNOWLEDGE.agriculture[season].tips;
                content = `Bon dia, ${townName}! Hui m'he recordat d'un truc per a l'horta: ${tip} Que tingueu un bategat ben bategat!`;
            }

            const payload = {
                author_id: lore.id,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                author_role: 'user',
                content: content,
                town_uuid: townId,
                is_playground: true, // Mark as playground content as it's simulated
                type: type,
                is_iaia_inspired: true
            };

            await supabaseService.createPost(payload);
            
            // Also seed a market item sometimes
            if (Math.random() > 0.7) {
                await this.seedMarketItem(townId, townName);
            }

            return true;
        } catch (e) {
            logger.error(`[TerritorialExpansion] Error seeding ${townName}:`, e);
            return false;
        }
    },

    /**
     * Seeds a market item for a town.
     */
    async seedMarketItem(townId, townName) {
        try {
            const items = [
                { title: 'Mel de romer de la serra', price: 8, category: 'alimentacio' },
                { title: 'Oli verge extra (garrafa 5L)', price: 45, category: 'alimentacio' },
                { title: 'Sardineta fresca (preu/kg)', price: 6, category: 'alimentacio' },
                { title: 'Cistella de bledes i naps', price: 5, category: 'alimentacio' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const payload = {
                title: item.title,
                price: item.price,
                description: `Producte de ${townName}. Qualitat del territori.`,
                category_slug: item.category,
                author_id: lore.id,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                town_uuid: townId,
                is_playground: true,
                is_iaia_inspired: true
            };

            await marketService.createMarketItem(payload);
        } catch (e) {
            logger.error(`[TerritorialExpansion] Market seed error:`, e);
        }
    },

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
};
