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
            const raw = localStorage.getItem('sp_chat_backups');
            const backups = raw ? JSON.parse(raw) : {};
            const now = Date.now();
            const MAX_CONVERSATIONS = 50;
            const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

            for (const [id, backup] of Object.entries(backups)) {
                const ts = Number(backup?.at || 0);
                if (!ts || (now - ts) > MAX_AGE_MS) {
                    delete backups[id];
                }
            }

            backups[convId] = { text, at: now };

            const ordered = Object.entries(backups)
                .sort((a, b) => (b[1]?.at || 0) - (a[1]?.at || 0))
                .slice(0, MAX_CONVERSATIONS);

            localStorage.setItem('sp_chat_backups', JSON.stringify(Object.fromEntries(ordered)));
        } catch (e) {
            logger.error('[SyncService] Error guardant backup de xat:', e);
        }
    },

    /**
     * Auditoria i neteja d'imatges fantasma en cache local.
     */
    purgeGhostMediaCache: ({ dryRun = true } = {}) => {
        const GHOST_PROTOCOLS = ['blob:', 'data:'];
        const GHOST_HINTS = ['placeholder', 'mock', 'seed', 'demo', 'tmp'];
        const report = {
            scannedKeys: 0,
            affectedKeys: [],
            urlsFlagged: [],
            removedKeys: []
        };

        const looksGhostUrl = (value) => {
            if (typeof value !== 'string') return false;
            const lower = value.trim().toLowerCase();
            if (!lower) return false;
            if (GHOST_PROTOCOLS.some(protocol => lower.startsWith(protocol))) return true;
            return GHOST_HINTS.some(hint => lower.includes(hint));
        };

        const walk = (node, keyPath = '') => {
            if (Array.isArray(node)) {
                node.forEach((item, idx) => walk(item, `${keyPath}[${idx}]`));
                return;
            }
            if (!node || typeof node !== 'object') return;

            Object.entries(node).forEach(([key, value]) => {
                const nextPath = keyPath ? `${keyPath}.${key}` : key;
                if (typeof value === 'string' && /avatar|cover|image|photo|attachment/i.test(key) && looksGhostUrl(value)) {
                    report.urlsFlagged.push({ path: nextPath, value });
                }
                walk(value, nextPath);
            });
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith('sp_')) continue;
            report.scannedKeys += 1;

            const raw = localStorage.getItem(key);
            if (!raw) continue;

            let parsed = null;
            try {
                parsed = JSON.parse(raw);
            } catch {
                if (looksGhostUrl(raw)) {
                    report.affectedKeys.push(key);
                    report.urlsFlagged.push({ path: key, value: raw });
                    if (!dryRun) {
                        localStorage.removeItem(key);
                        report.removedKeys.push(key);
                    }
                }
                continue;
            }

            const urlsBefore = report.urlsFlagged.length;
            walk(parsed, key);
            if (report.urlsFlagged.length > urlsBefore) {
                report.affectedKeys.push(key);
                if (!dryRun) {
                    localStorage.removeItem(key);
                    report.removedKeys.push(key);
                }
            }
        }

        // logger.log(`[SyncService] Ghost media audit (${dryRun ? 'dry-run' : 'cleanup'}):`, report);
        return report;
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Empaqueta el graf d'operacions com un blob binari opac per al transport.
     */
    packForTransport: async (ops) => {
        logger.log('[SyncService] Empaquetant graf operacional (Dumb Pipe)...');
        // Usar FileReader (C++ engine) per convertir grans arrays a base64 sense bloquejar UI
        const encoder = new TextEncoder();
        const bytes = encoder.encode(JSON.stringify(ops));
        
        const base64 = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(new Blob([bytes]));
        });

        return {
            v: '1.0.0-OMEGA',
            payload: base64,
            checksum: ops.length // Verificació prima de quantitat d'ops
        };
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Desempaqueta un blob binari opac provinent d'un transport (Supabase/P2P).
     */
    unpackFromTransport: async (packageData) => {
        if (!packageData || packageData.v !== '1.0.0-OMEGA') {
            throw new Error('[SyncService] Versió de paquet incompatible');
        }
        try {
            // Unpack asíncron, evitant `atob` síncron massiu que bloqueja Main Thread
            // S'usa el motor Fetch C++ per desencriptar el blob Base64 directament
            const res = await fetch(`data:application/octet-stream;base64,${packageData.payload}`);
            const buf = await res.arrayBuffer();
            return JSON.parse(new TextDecoder().decode(buf));
        } catch (err) {
            logger.error('[SyncService] Error desenroscant paquet opac:', err);
            return [];
        }
    }
};
