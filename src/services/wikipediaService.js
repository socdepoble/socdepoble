/**
 * Servei de Wikipedia i Wikimedia Commons (Nivell Déu)
 * Connecta el cor de cada poble amb la memòria universal.
 */

import { logger } from '../utils/logger';

export const wikipediaService = {
    /**
     * Obté un resum i imatges d'un poble des de la Wikipedia
     * @param {string} townName - Nom del poble a cercar
     * @param {string} lang - Idioma de la cerca (ca, es, en)
     */
    async getTownSummary(townName, lang = 'ca') {
        try {
            // Wikipedia REST API (Summary endpoint)
            const endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`;
            const response = await fetch(endpoint).catch(err => {
                logger.warn(`[Wikipedia] Network error for ${townName}:`, err);
                return null;
            });

            if (!response || !response.ok) return null;

            const data = await response.json().catch(err => {
                logger.error(`[Wikipedia] JSON parse error for ${townName}:`, err);
                return null;
            });
            if (!data) return null;

            return {
                extract: data.extract,
                extract_html: data.extract_html,
                thumbnail: data.thumbnail?.source,
                original_image: data.originalimage?.source,
                page_url: data.content_urls?.mobile?.page
            };
        } catch (error) {
            logger.error(`[Wikipedia] Error fetching summary for ${townName}:`, error);
            return null;
        }
    },

    /**
     * Cerca l'escut oficial del poble a Wikimedia Commons (Prioritzant SVG)
     * @param {string} townName 
     */
    async getTownShield(townName) {
        try {
            // Exemple de cerca professional en Commons API
            // En el futur, això buscarà fitxers que continguen "Escut de [Poble].svg"
            const query = `File:Escut de ${townName}.svg`;
            const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url&format=json&origin=*`;

            const response = await fetch(endpoint);
            const data = await response.json();

            const pages = data.query?.pages;
            if (pages) {
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1') {
                    return pages[pageId].imageinfo?.[0]?.url;
                }
            }

            // Fallback a PNG si no troba SVG
            return null;
        } catch (error) {
            logger.error(`[Wikipedia/Commons] Error fetching shield for ${townName}:`, error);
            return null;
        }
    }
};
