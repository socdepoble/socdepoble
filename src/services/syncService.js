import { logger } from '../utils/logger';

/**
 * SyncService: Gestiona el guardado automático de borradores y estados persistentes
 * para evitar pérdida de contenido durante errores de red o crashes.
 */
export const syncService = {
    /**
     * Guarda un borrador en localStorage con una clave única
     */
    saveDraft: (key, content) => {
        try {
            const draft = {
                content,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(`sp_draft_${key}`, JSON.stringify(draft));
            logger.log(`[SyncService] Borrador guardado para: ${key}`);
        } catch (err) {
            logger.error('[SyncService] Error guardando borrador:', err);
        }
    },

    /**
     * Recupera un borrador
     */
    getDraft: (key) => {
        try {
            const data = localStorage.getItem(`sp_draft_${key}`);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    /**
     * Limpia un borrador
     */
    clearDraft: (key) => {
        localStorage.removeItem(`sp_draft_${key}`);
    },

    /**
     * Sistema de respaldo de "emergencia" para el chat amb Garbage Collection
     */
    backupChatInput: (convId, text) => {
        if (!text) return;
        try {
            const backups = JSON.parse(localStorage.getItem('sp_chat_backups') || '{}');
            backups[convId] = { text, at: Date.now() };

            const entries = Object.entries(backups);
            if (entries.length > 20) {
                entries.sort((a, b) => b[1].at - a[1].at);
                const pruned = Object.fromEntries(entries.slice(0, 20));
                localStorage.setItem('sp_chat_backups', JSON.stringify(pruned));
            } else {
                localStorage.setItem('sp_chat_backups', JSON.stringify(backups));
            }
        } catch (err) {
            logger.error('[SyncService] Error fent backup de xat:', err);
        }
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Empaqueta el graf d'operacions com un blob binari opac per al transport.
     */
    packForTransport: (ops) => {
        logger.log('[SyncService] Empaquetant graf operacional (Dumb Pipe)...');
        // En una versió futura, açò usaria LZ4 o Protobuf.
        // Ara mateix generem un Base64 opac per al relay.
        const blob = btoa(unescape(encodeURIComponent(JSON.stringify(ops))));
        return {
            v: '1.0.0-OMEGA',
            payload: blob,
            checksum: ops.length // Verificació prima de quantitat d'ops
        };
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Desempaqueta un blob binari opac provinent d'un transport (Supabase/P2P).
     */
    unpackFromTransport: (packageData) => {
        if (!packageData || packageData.v !== '1.0.0-OMEGA') {
            throw new Error('[SyncService] Versió de paquet incompatible');
        }
        try {
            const raw = decodeURIComponent(escape(atob(packageData.payload)));
            return JSON.parse(raw);
        } catch (err) {
            logger.error('[SyncService] Error desenroscant paquet opac:', err);
            return [];
        }
    }
};
