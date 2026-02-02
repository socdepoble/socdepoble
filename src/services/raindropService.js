import { logger } from '../utils/logger';

/**
 * RAINDROP SERVICE [SISTEMA RIZOMA]
 * Handles mapping from Raindrop bookmarks to Sóc de Poble resources.
 */
export const raindropService = {
    /**
     * Maps a raw Raindrop item to the Sóc de Poble metadata schema.
     */
    mapToResource(raindropItem) {
        const collectionRaw = raindropItem.collection || 'Sin clasificar';

        // Mapeig de Taxonomia Sobirana
        const categoryMap = {
            'SDP': 'Oficial',
            'PRO': 'Professional',
            'SOS': 'Sostenible',
            'PER': 'Gent',
            'GEO': 'Territori',
            '000': 'Arxiu'
        };

        const prefix = collectionRaw.split('|')[0]?.trim() || '';
        const category = categoryMap[prefix] || 'Comunitat';

        return {
            uuid: raindropItem.id || `rd-${Math.random().toString(36).substr(2, 9)}`,
            title: raindropItem.title,
            excerpt: raindropItem.excerpt || raindropItem.note || '',
            coverImage: raindropItem.cover || raindropItem.thumbnail_url || null,
            collection: category,
            tags: raindropItem.tags || [],
            source: raindropItem.domain || new URL(raindropItem.link).hostname,
            url: raindropItem.link,
            author: {
                name: 'Sóc de Poble (Import)',
                avatar: '/logo-circle.png'
            },
            location: {
                town: prefix === 'GEO' ? collectionRaw.split('|')[1]?.trim() : 'La Torre de les Maçanes'
            },
            timestamp: raindropItem.created || new Date().toISOString(),
            syncState: 'local'
        };
    },

    /**
     * MOCK IMPORT: Simulated data from the user screenshot.
     */
    getMockData() {
        return [
            {
                id: 'rd-1',
                title: 'Arena para Gatos Aglomerante de Cáscara de Guisante Go Natural',
                excerpt: 'Catit Go Natural es una nueva gama de arenas para gatos ecológicas hechas a base de recursos sostenibles...',
                link: 'https://catit.es/arena-guisante',
                domain: 'catit.es',
                collection: 'SOS | SOSTENIBLE',
                tags: ['#ecologic', '#mascotes'],
                created: '2025-01-03T10:00:00Z'
            },
            {
                id: 'rd-2',
                title: 'Gift Box ✂️ Templatemaker',
                excerpt: 'Plantilla gratuita y personalizada para un(a) Caja de Regalo',
                link: 'https://templatemaker.nl/giftbox',
                domain: 'templatemaker.nl',
                collection: 'PRO | Gestió',
                tags: ['#disseny', '#eines'],
                created: '2025-09-10T15:00:00Z'
            },
            {
                id: 'rd-3',
                title: 'Carmen Chaves | Casting, Guion, Actriz',
                excerpt: 'Conocido/a por: Yo soy la Juani, Segundo origen, Di Di Hollywood',
                link: 'https://imdb.com/name/nm12345',
                domain: 'imdb.com',
                collection: 'PER | GENT',
                tags: ['#cultura', '#cinema'],
                created: '2025-08-30T12:00:00Z'
            }
        ].map(this.mapToResource);
    },

    /**
     * Unified access to resources.
     */
    async getCollection(collectionId = 'all') {
        // For now, we return our mock data as a unified collection
        return this.getMockData();
    }
};

export default raindropService;
