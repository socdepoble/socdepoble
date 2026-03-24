import { logger } from '../utils/logger';

/**
 * HistoricalRecoveryService [VAMPIR DIGITAL]
 * Recupera articles històrics de WordPress (WXR) i Blogger, 
 * MANTENINT EL FORMAT HTML VIBRANT i les fotos (Sense decapitacions).
 */
class HistoricalRecoveryService {
    /**
     * Parseja un fitxer XML d'exportació de WordPress (WXR).
     * @param {string} xmlString 
     * @returns {Array} Llista de recursos/posts recuperats
     */
    parseWordPressXML(xmlString) {
        logger.info('[HistoricalRecovery] Iniciant parseig de WordPress WXR...');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Comprovem si hi ha errors de parseig
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Error de parseig XML. El fitxer podria estar corrupte.');
        }

        const items = xmlDoc.getElementsByTagName('item');
        const recoveredMap = new Map(); // Use map for deduplication

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Només ens interessen els 'posts' publicats
            const postType = this._getTagContent(item, 'wp:post_type');
            const status = this._getTagContent(item, 'wp:status');

            if (postType === 'post' && status === 'publish') {
                const title = this._getTagContent(item, 'title');
                // EXTRACT THE FULL HTML CONTENT, NO STRIPPING!
                const content = this._getTagContent(item, 'content:encoded') || this._getTagContent(item, 'description');
                const link = this._getTagContent(item, 'link');
                const pubDate = this._getTagContent(item, 'pubDate');

                // Extract Categories / Tags for Semantic Tagging
                const categoryElements = item.getElementsByTagName('category');
                const tags = ['#històric', '#blog'];
                for (let j = 0; j < categoryElements.length; j++) {
                    const catLabel = categoryElements[j].textContent || categoryElements[j].text;
                    if (catLabel && typeof catLabel === 'string') {
                        tags.push(catLabel.trim());
                    }
                }

                // Extracció bàsica de la imatge destacada (si n'hi ha)
                const firstImage = this._extractFirstImage(content);

                // Determine the correct Author/Source. Preference: "socdepoble.net" > "El Rentonar"
                let source = 'WordPress (Històric)';
                if (link.includes('socdepoble.net')) {
                    source = 'Sóc de Poble';
                } else if (link.includes('rentonar')) {
                    source = 'El Rentonar';
                }

                const newPost = {
                    title: title || 'Sense títol',
                    url: link,
                    // Preserve FULL HTML in description/content field
                    description: content, 
                    // Create a clean text excerpt for card previews
                    excerpt: this._truncate(this._stripHtml(content), 180),
                    content_type: 'document',
                    source: source,
                    semantic_tags: [...new Set(tags)], // Unique tags
                    metadata: {
                        original_link: link,
                        has_image: !!firstImage,
                        thumbnail_url: firstImage,
                        is_historical_import: true
                    },
                    created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                };

                // Deduplication Logic: If a post with the same title exists, keep 'Sóc de Poble' over 'El Rentonar'
                const existingPost = recoveredMap.get(newPost.title);
                if (!existingPost) {
                    recoveredMap.set(newPost.title, newPost);
                } else {
                    // Overwrite if new post is Sóc de Poble and existing is not
                    if (newPost.source === 'Sóc de Poble' && existingPost.source !== 'Sóc de Poble') {
                        recoveredMap.set(newPost.title, newPost);
                        logger.info(`[HistoricalRecovery] Deduplicat: Reemplaçat '${existingPost.source}' per '${newPost.source}' per a l'article: ${newPost.title}`);
                    }
                }
            }
        }

        const finalRecovered = Array.from(recoveredMap.values());
        
        // Sort chronologically (oldest to newest so they appear correctly on the timeline)
        finalRecovered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        logger.info(`[HistoricalRecovery] Recuperats ${finalRecovered.length} articles de WordPress (després de deduplicar).`);
        return finalRecovered;
    }

    /**
     * Parseja un fitxer XML de Blogger (Atom).
     * @param {string} xmlString 
     */
    parseBloggerXML(xmlString) {
        logger.info('[HistoricalRecovery] Iniciant parseig de Blogger Atom...');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        const entries = xmlDoc.getElementsByTagName('entry');
        const recoveredMap = new Map();

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            // Busquem si és un post (té categoria 'kind#post')
            const categories = entry.getElementsByTagName('category');
            let isPost = false;
            const tags = ['#històric', '#blogger'];

            for (let j = 0; j < categories.length; j++) {
                const term = categories[j].getAttribute('term');
                if (term && term.includes('kind#post')) {
                    isPost = true;
                } else if (term) {
                     // Add legit Blogger labels as tags
                     tags.push(term);
                }
            }

            if (isPost) {
                const title = this._getTagContent(entry, 'title');
                // Retain Full HTML
                const content = this._getTagContent(entry, 'content');
                const pubDate = this._getTagContent(entry, 'published');

                const links = entry.getElementsByTagName('link');
                let link = '';
                for (let k = 0; k < links.length; k++) {
                    if (links[k].getAttribute('rel') === 'alternate') {
                        link = links[k].getAttribute('href');
                        break;
                    }
                }

                const firstImage = this._extractFirstImage(content);

                let source = 'Blogger (Llegat)';
                if (link.includes('rentonar.blogspot')) {
                    source = 'El Rentonar';
                }

                const newPost = {
                    title: title || 'Sense títol',
                    url: link,
                    // Preserve HTML
                    description: content, 
                    // Generate clean excerpt
                    excerpt: this._truncate(this._stripHtml(content), 180),
                    content_type: 'document',
                    source: source,
                    semantic_tags: [...new Set(tags)],
                    metadata: {
                        original_link: link,
                        thumbnail_url: firstImage,
                        is_historical_import: true
                    },
                    created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                };

                 // Basic deduplication for Blogger too
                 if (!recoveredMap.has(newPost.title)) {
                    recoveredMap.set(newPost.title, newPost);
                 }
            }
        }

        const finalRecovered = Array.from(recoveredMap.values());
        
        // Sort chronologically
        finalRecovered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        logger.info(`[HistoricalRecovery] Recuperats ${finalRecovered.length} articles de Blogger.`);
        return finalRecovered;
    }

    // HELPERS
    _getTagContent(parent, tagName) {
        const elements = parent.getElementsByTagName(tagName);
        if (elements && elements.length > 0) {
            return elements[0].textContent || elements[0].text || '';
        }
        return '';
    }

    _stripHtml(html) {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    _truncate(str, length) {
        if (!str) return '';
        // Un-escape HTML entities for the excerpt, then truncate
        const decoded = this._stripHtml(str).trim();
        return decoded.length > length ? decoded.substring(0, length) + '...' : decoded;
    }

    _extractFirstImage(html) {
        if (!html) return null;
        const m = html.match(/<img[^>]+src="([^">]+)"/i);
        return m ? m[1] : null;
    }
}

export const historicalRecoveryService = new HistoricalRecoveryService();
