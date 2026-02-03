import { logger } from '../utils/logger';

/**
 * MemoriaVivaService.js
 * Infraestructura per a l'Àlbum de Memòria Sobirana (Estil Google Fotos).
 * Gestiona l'etiquetatge automàtic en VALENCIÀ i la catalogació del bategat.
 */

const PREDEFINED_TAGS = [
    '#Horta', '#Festa', '#Llegat', '#Còmic', '#Realitat',
    '#Oficial', '#Maser', '#SantGregori', '#Patrimoni', '#Saviesa'
];

class MemoriaVivaService {
    constructor() {
        this.storageKey = 'sdp_memoria_viva';
    }

    /**
     * Nano Banana bategua etiquetes automàtiques segons el context.
     * @param {Object} content - El bategat a etiquetar.
     * @returns {Array} Etiquetes bategades.
     */
    async bategarEtiquetes(content) {
        const tags = new Set();
        const text = (content.content || content.title || '').toLowerCase();

        if (text.includes('poma') || text.includes('horta') || text.includes('oliva')) tags.add('#Horta');
        if (text.includes('festa') || text.includes('sant gregori')) tags.add('#Festa');
        if (text.includes('iaia') || text.includes('nano')) tags.add('#Còmic');
        if (text.includes('oficial') || text.includes('ajuntament')) tags.add('#Oficial');
        if (content.tag === 'LlegatRealista') tags.add('#LlegatRealista');

        // Sempre afegim el bategat genèric de l'Atall si no n'hi ha cap
        if (tags.size === 0) tags.add('#Llegat');

        return Array.from(tags);
    }

    /**
     * Guarda un nou element multimèdia a l'Àlbum Sobirà.
     */
    async guardarEnAlbum(item, userTags = []) {
        try {
            const autoTags = await this.bategarEtiquetes(item);
            const finalTags = [...new Set([...autoTags, ...userTags])];

            const albumItem = {
                ...item,
                tags: finalTags,
                bategat_at: new Date().toISOString()
            };

            const currentAlbum = this.getAlbum();
            currentAlbum.push(albumItem);
            localStorage.setItem(this.storageKey, JSON.stringify(currentAlbum));

            logger.info(`[MemoriaViva] Element guardat amb etiquetes: ${finalTags.join(', ')}`);
            return albumItem;
        } catch (error) {
            logger.error('[MemoriaViva] Error guardant en l\'Àlbum:', error);
            return null;
        }
    }

    getAlbum() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}

export const memoriaVivaService = new MemoriaVivaService();
