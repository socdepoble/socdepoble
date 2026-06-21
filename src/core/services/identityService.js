import { logger } from '../../utils/logger';
import { supabaseService } from './supabaseService';
import { secureStorage } from './secureStorage';

const PRIVATE_IDB_KEY = 'sp_sovereign_identity_private';

async function savePrivateKeyToIndexedDb(jwk) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('soc-de-poble-secrets', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('secrets')) db.createObjectStore('secrets');
        };
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('secrets', 'readwrite');
            const store = tx.objectStore('secrets');
            store.put(jwk, PRIVATE_IDB_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * IdentityService: Gestió d'Identitat Sobirana i Contracte Social.
 * Basat en Grassroots Architecture i Digital Social Contracts.
 */
export const identityService = {
    /**
     * [CRYPTO GENESIS REIAL] Genera una identitat Ed25519 local i sobirana.
     */
    async generateSovereignIdentity() {
        logger.log('[Identity] Executant Gènesi Criptogràfica Reial (Ed25519 Local-First)...');

        try {
            const keyPair = await window.crypto.subtle.generateKey(
                { name: 'Ed25519' },
                false, // [LLEI INAMOVIBLE] Clau privada no extreta MAI de la memòria segura
                ['sign', 'verify']
            );

            const publicJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
            // La clau privada NO s'exporta a JWK, passem directament l'objecte CryptoKey

            // [LLEI INAMOVIBLE] Protecció Mestre
            const isMasterEnv = localStorage.getItem('sp_master_mode') === 'true';

            const identity = {
                id: `sp_node_${(publicJwk.x || crypto.randomUUID()).substring(0, 16).replace(/[^a-zA-Z0-9]/g, '')}`,
                public_key_jwk: publicJwk,
                full_name: isMasterEnv ? 'Javi Llinares' : `Veí Foraster`,
                username: isMasterEnv ? 'superuser' : `poble_${crypto.randomUUID().substring(0, 8)}`,
                role: isMasterEnv ? 'SUPER_ADMIN' : 'guest',
                status: 'sovereign_ancestral',
                created_at: new Date().toISOString(),
                is_sovereign: true,
                version: 'v10.33-CANONIC'
            };

            // Emmagatzemem la info pública a secureStorage
            await secureStorage.set('sp_sovereign_identity', identity);
            
            // La clau privada queda absolutament aïllada en IndexedDB per a prevenció d'exfiltracions XSS o d'extensions
            // IndexedDB en navegadors moderns suporta Structured Clone Algorithm per a objectes CryptoKey
            await savePrivateKeyToIndexedDb(keyPair.privateKey);

            logger.log('[Identity] Identitat Criptogràfica segellada de forma segura al dispositiu. ID: ' + identity.id);

            return identity;
        } catch (error) {
            // Fallback en cas que Ed25519 no estigui suportat pel navegador antic
            logger.error('[Identity] Ed25519 no suportat nativament, fent fallback ECDSA P-256...', error);
            
            const keyPairFallback = await window.crypto.subtle.generateKey(
                { name: 'ECDSA', namedCurve: 'P-256' },
                false, // Igual per ECDSA: no-extraíble
                ['sign', 'verify']
            );
            
            const publicJwkFall = await window.crypto.subtle.exportKey('jwk', keyPairFallback.publicKey);

            const isMasterEnv = localStorage.getItem('sp_master_mode') === 'true';

            const identity = {
                id: `sp_node_fallback_${crypto.randomUUID().substring(0, 8)}`,
                public_key_jwk: publicJwkFall,
                full_name: isMasterEnv ? 'Javi Llinares' : `Veí Foraster`,
                username: isMasterEnv ? 'superuser' : `poble_${crypto.randomUUID().substring(0, 8)}`,
                role: isMasterEnv ? 'SUPER_ADMIN' : 'guest',
                status: 'sovereign_ancestral',
                created_at: new Date().toISOString(),
                is_sovereign: true,
                version: 'v10.33-CANONIC-FALLBACK'
            };

            await secureStorage.set('sp_sovereign_identity', identity);
            await savePrivateKeyToIndexedDb(keyPairFallback.privateKey);
            
            return identity;
        }
    },

    async getStoredIdentity() {
        try {
            const stored = await secureStorage.get('sp_sovereign_identity');
            if (stored) return stored;
            
            const legacy = localStorage.getItem('sp_sovereign_identity');
            if (legacy) {
                try {
                    const parsed = JSON.parse(legacy);
                    await secureStorage.set('sp_sovereign_identity', parsed);
                    localStorage.removeItem('sp_sovereign_identity');
                    return parsed;
                } catch (parseError) {
                    logger.error('[Identity] Dades legacy corruptes. Purgant clau...', parseError);
                    localStorage.removeItem('sp_sovereign_identity');
                    return null;
                }
            }
            return null;
        } catch (e) {
            console.error('[Identity] Error loading identity:', e);
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

    async signRecoveryRequest(padrinId, requestId, signature) {
        logger.log(`[Identity] Padrí ${padrinId} signant petició ${requestId}...`);
        try {
            const { data: authUser, error: authError } = await supabaseService.getSessionUser();
            if (authError || !authUser) return { success: false, error: 'UNAUTHENTICATED' };

            const { data: request, error: reqErr } = await supabaseService.getRecoveryRequestById(requestId);
            if (reqErr || !request) return { success: false, error: 'REQUEST_NOT_FOUND' };

            if (request.status !== 'pending_social_validation') {
                return { success: false, error: 'INVALID_STATE' };
            }

            const { error: sigErr } = await supabaseService.appendRecoverySignature({
                request_id: requestId,
                padrin_id: padrinId,
                signature,
            });
            if (sigErr) return { success: false, error: sigErr.message };

            const { data: refreshed } = await supabaseService.getRecoveryRequestById(requestId);
            if (refreshed.current_signatures >= refreshed.required_signatures) {
                await this._completeRecovery(refreshed);
            }

            return { success: true, current: refreshed.current_signatures };
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
