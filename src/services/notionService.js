import { logger } from '../utils/logger';

/**
 * NOTION SERVICE [MEMÒRIA PERSONAL]
 * Encarregat de traduir l'arquitectura de Notion al Rebost Sobirà.
 */
export const notionService = {
    /**
     * Mapeja un objecte de Notion (CSV/JSON) al schema de Sóc de Poble.
     */
    mapToResource(notionItem) {
        // Notion sol exportar propietats com 'Name', 'Tags', 'Created', 'URL'
        const title = notionItem.Name || notionItem.title || 'Document sense títol';
        const rawTags = notionItem.Tags || notionItem.tags || '';
        const tags = Array.isArray(rawTags)
            ? rawTags
            : rawTags.split(',').map(t => t.trim()).filter(t => t);

        return {
            uuid: notionItem.id || `nt-${Math.random().toString(36).substr(2, 9)}`,
            title: title,
            excerpt: notionItem.excerpt || notionItem.content || '',
            content_type: 'document',
            source: 'Notion',
            url: notionItem.URL || notionItem.url || '',
            collection: notionItem.Category || 'Arxiu Personal',
            semantic_tags: ['#notion', ...tags],
            created_at: notionItem.Created || notionItem.created_time || new Date().toISOString(),
            owner_id: null, // S'assigna en la importació
            is_public: false,
            scope: 'private'
        };
    },

    /**
     * Simula una càrrega de dades per a proves de volum.
     */
    getMockVolume(count = 100) {
        const mocks = [];
        for (let i = 1; i <= count; i++) {
            mocks.push({
                id: `nt-mock-${i}`,
                Name: `Projecte Sobirà ${i}: ${Math.random().toString(36).substr(7)}`,
                Tags: 'notion, idea, futur',
                Category: i % 2 === 0 ? 'Projectes' : 'Pensaments',
                Created: new Date().toISOString()
            });
        }
        return mocks.map(this.mapToResource);
    }
};

export default notionService;
