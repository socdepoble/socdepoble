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
            let endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`;
            let response = await fetch(endpoint).catch(err => {
                logger.warn(`[Wikipedia] Network error for ${townName}:`, err);
                return null;
            });

            // [ESPAÑA SCALE FALLBACK] Si no existe en la viquipèdia (ca), probamos en la wikipedia española (es)
            if ((!response || response.status === 404) && lang === 'ca') {
                endpoint = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`;
                response = await fetch(endpoint).catch(() => null);
            }

            if (!response || !response.ok) return null;

            const data = await response.json().catch(err => {
                logger.error(`[Wikipedia] JSON parse error for ${townName}:`, err);
                return null;
            });
            if (!data) return null;

            let population = null;
            // Retrieve exact population from Wikidata if wikibase_item exists
            if (data.wikibase_item) {
                try {
                    const wdRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${data.wikibase_item}&props=claims&format=json&origin=*`);
                    if (wdRes.ok) {
                        const wdData = await wdRes.json();
                        const claims = wdData.entities[data.wikibase_item]?.claims;
                        if (claims && claims.P1082) { // P1082 = Population
                            const amount = claims.P1082[0].mainsnak.datavalue.value.amount;
                            population = parseInt(amount.replace('+', ''), 10);
                        }
                    }
                } catch (e) {
                    logger.warn(`[Wikipedia] Error fetching population from Wikidata for ${townName}:`, e);
                }
            }

            return {
                title: data.title,
                extract: data.extract,
                extract_html: data.extract_html,
                thumbnail: data.thumbnail?.source,
                original_image: data.originalimage?.source,
                page_url: data.content_urls?.mobile?.page,
                coordinates: data.coordinates,
                description: data.description,
                population: population
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
            let endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`;
            let response = await fetch(endpoint).catch(() => null);
            
            // [ESPAÑA SCALE FALLBACK]
            if ((!response || !response.ok) && lang === 'ca') {
                endpoint = `https://es.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(townName)}`;
                response = await fetch(endpoint).catch(() => null);
            }

            if (!response || !response.ok) return [];

            const data = await response.json();
            const items = data.items || [];

            // Filtrem només imatges vàlides i de qualitat
            return items
                .filter(item => item.type === 'image')
                .map(item => {
                    let url = item.srcset?.[0]?.src || item.title;
                    if (url && url.startsWith('//')) url = 'https:' + url;
                    return {
                        url: url,
                        title: item.caption?.text || 'Imatge del poble',
                        author: item.artist?.text || 'Wikimedia Commons'
                    };
                })
                .filter(img => img.url && img.url.includes('upload.wikimedia.org'));
        } catch (error) {
            logger.error(`[Wikipedia] Error fetching media list for ${townName}:`, error);
            return [];
        }
    },

    /**
     * Cerca l'escut oficial del poble a Wikimedia Commons (Prioritzant SVG i soportando España)
     * @param {string} townName 
     */
    async getTownShield(townName) {
        try {
            // Cerca més flexible: Variant valenciana, espanyola i internacional
            const queries = [
                `File:Escut de ${townName}.svg`,
                `File:Escudo de ${townName}.svg`,
                `File:Escut de ${townName}.png`,
                `File:Escudo de ${townName}.png`,
                `File:Shield of ${townName}.svg`,
                `File:Coats of arms of ${townName}.svg`
            ];

            for (const query of queries) {
                const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                const response = await fetch(endpoint).catch(() => null);
                if (!response) continue;
                
                const data = await response.json().catch(() => null);
                if (!data) continue;

                const pages = data.query?.pages;
                if (pages) {
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1') {
                        const url = pages[pageId].imageinfo?.[0]?.url;
                        if (url) return url;
                    }
                }
            }

            // Si tot falla, provem una cerca general a Commons (Dual: Escut y Escudo)
            const searchTerms = [`Escut ${townName}`, `Escudo ${townName}`];
            
            for (const term of searchTerms) {
                const searchEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`;
                const searchRes = await fetch(searchEndpoint).catch(() => null);
                if (!searchRes) continue;
                
                const searchData = await searchRes.json().catch(() => null);
                
                if (searchData?.query?.search?.[0]) {
                    const firstResult = searchData.query.search[0].title;
                    const infoEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(firstResult)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
                    const infoRes = await fetch(infoEndpoint).catch(() => null);
                    if (!infoRes) continue;
                    
                    const infoData = await infoRes.json().catch(() => null);
                    const pages = infoData?.query?.pages;
                    if (pages) {
                        const pageId = Object.keys(pages)[0];
                        const url = pages[pageId].imageinfo?.[0]?.url;
                        if (url) return url;
                    }
                }
            }

            return null;
        } catch (error) {
            logger.error(`[Wikipedia/Commons] Error fetching shield for ${townName}:`, error);
            return null;
        }
    }
};
