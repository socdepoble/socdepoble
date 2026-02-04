import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { rhizomeManager } from './rhizomeManager';

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
        logger.log('[Identity] Executant Gènesi Criptogràfica (Local-First)...');

        // Simulem generació Ed25519 (32 bytes per clau)
        const privBuf = crypto.getRandomValues(new Uint8Array(32));
        const pubBuf = crypto.getRandomValues(new Uint8Array(32));

        const identity = {
            id: crypto.randomUUID(),
            public_key: Array.from(pubBuf).map(b => b.toString(16).padStart(2, '0')).join(''),
            private_key: Array.from(privBuf).map(b => b.toString(16).padStart(2, '0')).join(''),
            full_name: `Agent ${Math.random().toString(36).substring(7).toUpperCase()}`,
            username: `sobe_${Math.random().toString(36).substring(7)}`,
            role: 'neighbor',
            status: 'sovereign_init', // Pendent de validació P2P
            created_at: new Date().toISOString(),
            is_sovereign: true
        };

        localStorage.setItem('sp_sovereign_identity', JSON.stringify(identity));
        logger.log('[Identity] Identitat Sobirana segellada al dispositiu.');

        return identity;
    },

    getStoredIdentity() {
        const stored = localStorage.getItem('sp_sovereign_identity');
        return stored ? JSON.parse(stored) : null;
    },

    /**
     * Inicia un protocol de Recuperació d'Identitat (Perda de dispositiu).
     * Segons la lògica de Sóc de Poble: no demanes permís a Google, demanes als Padrins.
     */
    async initiateSocialRecovery(userId) {
        logger.log(`[Identity] Iniciant Protocol de Recuperació per a l'usuari ${userId}...`);
        try {
            // 1. Generem un repte criptogràfic (simulat)
            const recoveryRequest = {
                user_id: userId,
                timestamp: new Date().toISOString(),
                status: 'pending_social_validation',
                new_public_key: `pub_${Math.random().toString(36).substring(7)}`, // Nova "clau" del dispositiu
                required_signatures: 3,
                current_signatures: 0
            };

            // 2. Notifiquem als Padrins via la Rèplica Representant (Supabase)
            // En un sistema real, açò crearia una entrada a 'identity_recovery_requests'
            const { error } = await supabaseService.createRecoveryRequest(recoveryRequest);
            if (error) throw error;

            // Simulem el registre local també per a feedback immediat
            localStorage.setItem('sp_recovery_request', JSON.stringify(recoveryRequest));

            logger.log('[Identity] Sol·licitud de recuperació bategada a la Cooperativa.');

            return {
                success: true,
                requestId: Date.now(),
                message: 'Protocol activat. Els teus Padrins han de signar la teua identitat.'
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
    async _completeRecovery(request) {
        logger.log('[Identity] ¡Contracte Social Executat! Restaurant Rhizome DB...');

        // 1. Descarreguem l'historial de la Rèplica Representant (Supabase)
        // un cop la xarxa ha validat la nova identitat.
        const entities = await supabaseService.getMyEntities();
        localStorage.setItem('sp_entities_cache', JSON.stringify(entities));

        // 2. Bateguem l'èxit al sistema
        logger.log('[Identity] Identitat i dades restaurades amb èxit.');
    }
};
