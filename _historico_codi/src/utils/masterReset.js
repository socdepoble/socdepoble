import { logger } from './logger';

/**
 * Master Reset [DIA ZERO]
 * Protocol OMEGA: Destrucció creativa de l'estat local per a reinici mestre.
 * Útil per a demos impol·lutes o recuperació de desastres.
 */
export const masterReset = async () => {
    logger.log('🚨 [DIA ZERO] Iniciant Protocol de Destrucció Creativa...');

    try {
        // 1. Neteja de LocalStorage (sp_*)
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('sp_') || key.startsWith('supabase.')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        logger.log(`🧹 LocalStorage purificat (${keysToRemove.length} claus eliminades).`);

        // 2. Neteja de IndexedDB (RhizomeDB)
        if (typeof window.indexedDB !== 'undefined') {
            const dbs = ['RhizomeDB-v1']; // Llista de DBs conegudes
            for (const dbName of dbs) {
                await new Promise((resolve, reject) => {
                    const req = window.indexedDB.deleteDatabase(dbName);
                    req.onsuccess = () => {
                        logger.log(`🏺 Base de dades ${dbName} eliminada.`);
                        resolve();
                    };
                    req.onerror = () => reject(new Error(`No s'ha pogut eliminar ${dbName}`));
                    req.onblocked = () => {
                        logger.warn(`🛑 Eliminació de ${dbName} bloquejada. Tanca altres pestanyes.`);
                        resolve();
                    };
                });
            }
        }

        // 3. Neteja de Sessions i Cookies (opcional, depend de l'entorn)
        sessionStorage.clear();

        logger.log('✨ [DIA ZERO] El Mas ha estat purificat. Reiniciant aplicació...');
        
        // Donem temps als storages per consolidar la destrucció abans de recarregar
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);

        return { success: true };
    } catch (err) {
        logger.error('❌ Error en el Protocol DIA ZERO:', err);
        return { success: false, error: err.message };
    }
};
