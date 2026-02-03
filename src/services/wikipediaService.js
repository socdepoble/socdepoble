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
                title: data.title,
                extract: data.extract,
                extract_html: data.extract_html,
                thumbnail: data.thumbnail?.source,
                original_image: data.originalimage?.source,
                page_url: data.content_urls?.mobile?.page,
                coordinates: data.coordinates,
                description: data.description
            };
        } catch (error) {
            logger.error(`[Wikipedia] Error fetching summary for ${townName}:`, error);
            return null;
        }
    },

    /**
     * Obté una llista de totes les imatges d'una pàgina de Wikipedia
     * @param {string} townName 
     * @param {string} lang 
     */
    async getTownImages(townName, lang = 'ca') {
        try {
            const endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`;
            const response = await fetch(endpoint);
            if (!response.ok) return [];

            const data = await response.json();
            const items = data.items || [];

            // Filtrem només imatges vàlides i de qualitat
            return items
                .filter(item => item.type === 'image')
                .map(item => ({
                    url: item.srcset?.[0]?.src || item.title,
                    title: item.caption?.text || 'Imatge del poble',
                    author: item.artist?.text || 'Wikimedia Commons'
                }))
                .filter(img => img.url && img.url.startsWith('http'));
        } catch (error) {
            logger.error(`[Wikipedia] Error fetching media list for ${townName}:`, error);
            return [];
        }
    },

    /**
     * Cerca l'escut oficial del poble a Wikimedia Commons (Prioritzant SVG)
     * @param {string} townName 
     */
    async getTownShield(townName) {
        try {
            // Cerca més flexible: Primer intentem el format estàndard
            const queries = [
                `File:Escut de ${townName}.svg`,
                `File:Escut de ${townName}.png`,
                `File:Shield of ${townName}.svg`,
                `File:Coats of arms of ${townName}.svg`
            ];

            for (const query of queries) {
                const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                const response = await fetch(endpoint);
                const data = await response.json();

                const pages = data.query?.pages;
                if (pages) {
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1') {
                        const url = pages[pageId].imageinfo?.[0]?.url;
                        if (url) return url;
                    }
                }
            }

            // Si tot falla, provem una cerca general a Commons
            const searchEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('Escut ' + townName)}&format=json&origin=*`;
            const searchRes = await fetch(searchEndpoint);
            const searchData = await searchRes.json();

            if (searchData.query?.search?.[0]) {
                const firstResult = searchData.query.search[0].title;
                const infoEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(firstResult)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                const infoRes = await fetch(infoEndpoint);
                const infoData = await infoRes.json();
                const pages = infoData.query?.pages;
                if (pages) {
                    const pageId = Object.keys(pages)[0];
                    return pages[pageId].imageinfo?.[0]?.url;
                }
            }

            return null;
        } catch (error) {
            logger.error(`[Wikipedia/Commons] Error fetching shield for ${townName}:`, error);
            return null;
        }
    }
};
