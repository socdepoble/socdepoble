import { logger } from '../utils/logger';
// import { secureStorage } from './secureStorage';

/**
 * RecoveryService: L'Assegurança d'Inmortalitat (OMEGA-4)
 * Exporta i importa l'estat absolut del Poble d'una forma completament
 * segura, blindada criptogràficament i immune a esborrats accidentals.
 */
class RecoveryService {
    
    /**
     * Empaqueta l'ànima del Poble en un Blob xifrat.
     * @param {string} masterPassword Contraçenya humana escollida per l'usuari
     */
    async exportSovereignState(masterPassword) {
        logger.log("[Recovery] Iniciant l'extracció de l'ànima del Poble...");
        if (!masterPassword) throw new Error("Format d'exportació requereix segellat de contrasenya.");

        try {
            // 1. Recollim l'Estat del Sistema (LocalStorage pur)
            const keysToExtract = [
                'sp_xlogs', 'sp_padrins', 'sp_history_cache', 'sp_user_cache', 
                'sp_rhizome_version', 'isPlaygroundMode'
            ];
            
            const payload = {
                metadata: {
                    exported_at: new Date().toISOString(),
                    version: 'OMEGA-4.immortal',
                    type: 'sovereign_snapshot'
                },
                data: {}
            };

            for (const key of keysToExtract) {
                const val = localStorage.getItem(key);
                if (val) payload.data[key] = val;
            }

            // A l'hora de derivar, usarem un SALT aleatori guardat al mateix blob en pla
            const salt = crypto.getRandomValues(new Uint8Array(16));
            
            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
            );
            const cryptoKey = await crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
                keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));
            const plainBytes = enc.encode(JSON.stringify(payload));
            const cipherBytes = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv }, 
                cryptoKey, 
                plainBytes
            );

            // Estructura Exportable (.poble)
            const exportFile = {
                v: '1',
                salt: Array.from(salt),
                iv: Array.from(iv),
                cipher: Array.from(new Uint8Array(cipherBytes))
            };

            const blob = new Blob([JSON.stringify(exportFile)], { type: 'application/json' });
            return blob;

        } catch (error) {
            logger.error('[Recovery] Falla crítica durant el segellat sobirà:', error);
            throw new Error('Falada en la generació del Snapshot.');
        }
    }

    /**
     * Resuscita l'ànima del Poble a partir del Blob xifrat.
     */
    async importSovereignState(fileContentAsJson, masterPassword) {
        logger.log('[Recovery] Iniciant el Protocol de Resurrecció...');
        if (!masterPassword) throw new Error("Falta la clau de desencriptació.");

        try {
            const parsed = JSON.parse(fileContentAsJson);
            if (parsed.v !== '1' || !parsed.salt || !parsed.iv || !parsed.cipher) {
                throw new Error("Sufix o format de l'arxiu .poble malformat o corrupte.");
            }

            const salt = new Uint8Array(parsed.salt);
            const iv = new Uint8Array(parsed.iv);
            const cipherBytes = new Uint8Array(parsed.cipher);

            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
            );
            
            const cryptoKey = await crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
                keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
            );

            const plainBytes = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                cipherBytes
            );

            const payload = JSON.parse(new TextDecoder().decode(plainBytes));

            if (payload.metadata.type !== 'sovereign_snapshot') {
                throw new Error("L'assumpció de l'ànima ha fracassat. Metadades invàlides.");
            }

            // Apliquem la Resurrecció al LocalStorage de forma atòmica
            localStorage.clear(); // [!] PURGA TOTAL. Establiment d'Edèn.
            
            for (const [key, val] of Object.entries(payload.data)) {
                localStorage.setItem(key, val);
            }

            logger.log('[Recovery] Resurrecció Completada. El Poble ha tornat a la vida.');
            return true;

        } catch (error) {
            logger.error('[Recovery] Fracàs absolut en la Resurrecció:', error);
            throw new Error('Contrasenya invàlida o arxiu corrupte.');
        }
    }
}

export const recoveryService = new RecoveryService();
