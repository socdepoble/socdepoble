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
        // Notion exports can have properties like 'Name', 'Tags', 'Created', 'URL', 'Content', 'Description'
        const title = notionItem.Name || notionItem.title || notionItem.Title || 'Document de Notion';
        const content = notionItem.Content || notionItem.content || notionItem.Description || notionItem.description || '';
        const url = notionItem.URL || notionItem.url || '';

        const rawTags = notionItem.Tags || notionItem.tags || '';
        let tags = Array.isArray(rawTags)
            ? rawTags
            : typeof rawTags === 'string' ? rawTags.split(',').map(t => t.trim()).filter(t => t) : [];

        // Detecció intel·ligent de categoria basada en el títol o contingut
        let category = notionItem.Category || notionItem.category || 'Arxiu Personal';
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('projecte') || lowerTitle.includes('proposta')) category = 'Projectes';
        else if (lowerTitle.includes('idea') || lowerTitle.includes('pensament')) category = 'Pensaments';
        else if (lowerTitle.includes('comunitat') || lowerTitle.includes('veïns')) category = 'Comunitat';

        return {
            uuid: notionItem.id || `nt-${Math.random().toString(36).substr(2, 9)}`,
            title: title,
            excerpt: notionItem.excerpt || (content ? content.substring(0, 280) : ''),
            content_type: 'document',
            source: 'Notion',
            url: url,
            collection: category,
            semantic_tags: ['#notion', ...tags.map(t => t.startsWith('#') ? t : `#${t}`)],
            created_at: notionItem.Created || notionItem.created_time || new Date().toISOString(),
            owner_id: null, // S'assigna en la importació
            is_public: false,
            scope: 'private',
            metadata: {
                full_content: content,
                import_date: new Date().toISOString(),
                original_source: 'Notion Export'
            }
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
