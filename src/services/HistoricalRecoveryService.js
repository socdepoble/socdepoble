import { logger } from '../utils/logger';

/**
 * HistoricalRecoveryService [VAMPIR DIGITAL]
 * Recupera articles històrics de WordPress (WXR) i Blogger.
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
        const recovered = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Només ens interessen els 'posts' publicats
            const postType = this._getTagContent(item, 'wp:post_type');
            const status = this._getTagContent(item, 'wp:status');

            if (postType === 'post' && status === 'publish') {
                const title = this._getTagContent(item, 'title');
                const content = this._getTagContent(item, 'content:encoded');
                const link = this._getTagContent(item, 'link');
                const pubDate = this._getTagContent(item, 'pubDate');

                // Extracció bàsica de la imatge destacada (si n'hi ha)
                // WordPress sol posar referències a attachments, però per ara busquem la primera <img> al content
                const firstImage = this._extractFirstImage(content);

                recovered.push({
                    title: title || 'Sense títol',
                    url: link,
                    description: this._truncate(this._stripHtml(content), 160),
                    excerpt: this._truncate(this._stripHtml(content), 280),
                    content_type: 'document',
                    source: 'WordPress (El Rentonar)',
                    semantic_tags: ['#historíc', '#blog'],
                    metadata: {
                        original_link: link,
                        has_image: !!firstImage,
                        thumbnail_url: firstImage
                    },
                    created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                });
            }
        }

        logger.info(`[HistoricalRecovery] Recuperats ${recovered.length} articles de WordPress.`);
        return recovered;
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
        const recovered = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            // Busquem si és un post (té categoria 'kind#post')
            const categories = entry.getElementsByTagName('category');
            let isPost = false;
            for (let j = 0; j < categories.length; j++) {
                if (categories[j].getAttribute('term')?.includes('kind#post')) {
                    isPost = true;
                    break;
                }
            }

            if (isPost) {
                const title = this._getTagContent(entry, 'title');
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

                recovered.push({
                    title: title || 'Sense títol',
                    url: link,
                    description: this._truncate(this._stripHtml(content), 160),
                    excerpt: this._truncate(this._stripHtml(content), 280),
                    content_type: 'document',
                    source: 'Blogger (Llegat)',
                    semantic_tags: ['#historíc', '#blogger'],
                    metadata: {
                        original_link: link,
                        thumbnail_url: firstImage
                    },
                    created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
                });
            }
        }

        logger.info(`[HistoricalRecovery] Recuperats ${recovered.length} articles de Blogger.`);
        return recovered;
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
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    _truncate(str, length) {
        if (!str) return '';
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    _extractFirstImage(html) {
        const m = html.match(/<img[^>]+src="([^">]+)"/);
        return m ? m[1] : null;
    }
}

export const historicalRecoveryService = new HistoricalRecoveryService();
