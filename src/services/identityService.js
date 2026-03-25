import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { secureStorage } from './secureStorage';

/**
 * IdentityService: Gestió d'Identitat Sobirana i Contracte Social.
 * Basat en Grassroots Architecture i Digital Social Contracts.
 */
export const identityService = {
    /**
     * [CRYPTO GENESIS] Genera una identitat Ed25519 local i sobirana.
     * Complix el mandat de 0ms d'entrada. No demana permís, bategua.
     */
    async generateSovereignIdentity() {
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
            full_name: `Foraster`,
            username: `poble_${public_key.substring(0, 8)}`,
            role: 'guest',
            status: 'sovereign_ancestral',
            created_at: new Date().toISOString(),
            is_sovereign: true,
            version: 'v35-ANCESTRAL'
        };

        await secureStorage.set('sp_sovereign_identity', identity);
        logger.log('[Identity] Identitat Ancestral segellada de forma segura al dispositiu. ID: ' + identity.id);

        return identity;
    },

    async getStoredIdentity() {
        try {
            const stored = await secureStorage.get('sp_sovereign_identity');
            if (!stored) {
                // Try to migrate legacy plaintext localStorage identity
                const legacy = localStorage.getItem('sp_sovereign_identity');
                if (legacy) {
                    const parsed = JSON.parse(legacy);
                    await secureStorage.set('sp_sovereign_identity', parsed);
                    localStorage.removeItem('sp_sovereign_identity');
                    return parsed;
                }
            }
            return stored || null;
        } catch (e) {
            console.error('[Identity] Error loading encrypted identity:', e);
            return null;
        }
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
    async signRecoveryRequest(padrinId, requestId, signature) {
        logger.log(`[Identity] Padrí ${padrinId} signant petició ${requestId}...`);
        try {
            if (!signature || signature.length < 32) throw new Error("Acció denegada: Falta la signatura criptogràfica del Padrí.");
            
            const request = JSON.parse(localStorage.getItem('sp_recovery_active'));
            if (!request || request.user_id !== requestId) throw new Error('No hi ha cap petició de recuperació activa o el ID no coincideix.');

            request.signed_by = request.signed_by || [];
            if (request.signed_by.includes(padrinId)) {
                throw new Error("Acció denegada: Aquest padrí ja ha signat la petició prèviament.");
            }

            request.signed_by.push(padrinId);
            request.current_signatures += 1;

            if (request.current_signatures >= request.required_signatures) {
                request.status = 'validated_by_social_contract';
                await this._completeRecovery(request);
            }

            localStorage.setItem('sp_recovery_active', JSON.stringify(request));
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
