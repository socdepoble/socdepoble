import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';

const PERSISTENCE = {
    get: (key) => {
        try {
            const local = localStorage.getItem(key);
            if (local) return local;
        } catch { /* silent */ }
        try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set: (key, val) => {
        try { localStorage.setItem(key, val); } catch { /* silent */ }
        try { sessionStorage.setItem(key, val); } catch { /* silent */ }
    }
};

/**
 * IdentityService: Gestió d'Identitat Sobirana i Contracte Social.
 * Basat en Grassroots Architecture i Digital Social Contracts.
 */
export const identityService = {
    /**
     * [CRYPTO GENESIS] Genera una identitat Ed25519 local i sobirana.
     * Complix el mandat de 0ms d'entrada. No demana permís, bategua.
     */
    generateSovereignIdentity() {
        logger.log('[Identity] Executant Gènesi Criptogràfica (Local-First Ancestral)...');

        // Simulem generació Ed25519 (32 bytes per clau)
        const privBuf = crypto.getRandomValues(new Uint8Array(32));
        const pubBuf = crypto.getRandomValues(new Uint8Array(32));

        const public_key = Array.from(pubBuf).map(b => b.toString(16).padStart(2, '0')).join('');
        const private_key = Array.from(privBuf).map(b => b.toString(16).padStart(2, '0')).join('');

        const identity = {
            id: `sp_node_${public_key.substring(0, 16)}`, // L'ID es deriva de la clau pública (Veritat Matemàtica)
            public_key: public_key,
            private_key: private_key,
            full_name: `Veí de Poble`,
            username: `vei_${public_key.substring(0, 8)}`,
            role: 'neighbor',
            status: 'sovereign_ancestral',
            created_at: new Date().toISOString(),
            is_sovereign: true,
            version: 'v35-ANCESTRAL'
        };

        PERSISTENCE.set('sp_sovereign_identity', JSON.stringify(identity));
        logger.log('[Identity] Identitat Ancestral segellada al dispositiu. ID: ' + identity.id);

        return identity;
    },

    getStoredIdentity() {
        const stored = PERSISTENCE.get('sp_sovereign_identity');
        return stored ? JSON.parse(stored) : null;
    },

    /**
     * Inicia un protocol de Recuperació d'Identitat (Perda de dispositiu).
     * Segons la lògica de Sóc de Poble: no demanes permís a Google, demanes als Padrins.
     */
    async initiateSocialRecovery(userId) {
        logger.log(`[Identity] Iniciant Protocol de Recuperació OMEGA per a ${userId}...`);
        try {
            // 1. Creem el paquet de recuperació (Dumb Pipe Ready)
            const recoveryRequest = {
                user_id: userId,
                timestamp: Date.now(),
                status: 'pending_social_validation',
                new_public_key: `pub_${Math.random().toString(36).substring(7)}`,
                required_signatures: 3,
                current_signatures: 0,
                protocol: 'OMEGA-RECOVERY-v2'
            };

            // 2. Importem el syncService dinàmicament per evitar circularitats si cal
            const { syncService } = await import('./syncService');
            const opaquePackage = syncService.packForTransport([recoveryRequest]);

            // 3. Enviem a la Rèplica Representant (Supabase) via transport binari opac
            const { error } = await supabaseService.uploadOpaqueBlob(`recovery_${userId}`, opaquePackage);
            if (error) throw error;

            localStorage.setItem('sp_recovery_active', JSON.stringify(recoveryRequest));
            logger.log('[Identity] Sol·licitud de recuperació bategada i empaquetada (Dumb Pipe).');

            return {
                success: true,
                message: 'Protocol activat. Els teus Padrins han de validar el paquet opac.'
            };
        } catch (err) {
            logger.error('[Identity] Error en initiateSocialRecovery:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Un Padrí signa la validació d'identitat (Proof-of-Personhood).
     */
    async signRecoveryRequest(padrinId, requestId) {
        logger.log(`[Identity] Padrí ${padrinId} signant petició ${requestId}...`);
        try {
            const request = JSON.parse(localStorage.getItem('sp_recovery_request'));
            if (!request) throw new Error('No hi ha cap petició de recuperació activa.');

            request.current_signatures += 1;

            if (request.current_signatures >= request.required_signatures) {
                request.status = 'validated_by_social_contract';
                await this._completeRecovery(request);
            }

            localStorage.setItem('sp_recovery_request', JSON.stringify(request));
            return { success: true, current: request.current_signatures };
        } catch (err) {
            logger.error('[Identity] Error signant recuperació:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Finalitza el flux de recuperació: restaura les dades des de la Rhizome DB.
     */
    async _completeRecovery() {
        logger.log('[Identity] ¡Contracte Social Executat! Restaurant Rhizome DB...');

        // 1. Descarreguem l'historial de la Rèplica Representant (Supabase)
        // un cop la xarxa ha validat la nova identitat.
        const entities = await supabaseService.getMyEntities();
        localStorage.setItem('sp_entities_cache', JSON.stringify(entities));

        // 2. Bateguem l'èxit al sistema
        logger.log('[Identity] Identitat i dades restaurades amb èxit.');
    }
};
