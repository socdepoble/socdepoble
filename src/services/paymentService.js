import { logger } from '../utils/logger';
import { rhizomeManager } from './rhizomeManager';

/**
 * PaymentService: Gestió de Pagaments Astro i Bategats Econòmics.
 * Pillar 3 de l'Escala Infinita.
 */
export const paymentService = {
    /**
     * Realitza un "Bategat Econòmic" (Pagament Astro)
     * Registra la transacció immediatament al xlog local (Rhizome).
     */
    async sendEconomicBeat(paymentData) {
        logger.log('[Astro] Iniciant Bategat Econòmic (Tele-Oli)...');
        try {
            // 1. Validació bàsica
            if (!paymentData.amount || !paymentData.receiver_id) {
                throw new Error('Dades de pagament incompletes.');
            }

            // 2. Registre al xlog (Exclusive Log) via RhizomeManager
            // Açò garanteix velocitat "més ràpida que VISA" al no esperar a la xarxa.
            const xlogEntry = await rhizomeManager.processXLog({
                amount: paymentData.amount,
                receiver_id: paymentData.receiver_id,
                reference: paymentData.reference || 'Bategat de Proximitat',
                type: 'astro_tele_oli'
            });

            logger.log(`[Astro] Transacció bategada al xlog: ${xlogEntry.id}`);

            // 3. Simulem la propagació asíncrona (Cel·lular Mesh)
            this._propagateTransaction(xlogEntry);

            return {
                success: true,
                transactionId: xlogEntry.id,
                status: 'instant_sealed' // Segellat instantani al mòbil
            };
        } catch (err) {
            logger.error('[Astro] Error en el bategat econòmic:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Propagació asíncrona cap als nodes de Masia i Padrins.
     */
    async _propagateTransaction(entry) {
        // [PILLAR 3] Node de la Federació (Cooperativa)
        const user = JSON.parse(localStorage.getItem('sp_user_cache'));
        if (user) {
            await rhizomeManager.syncXLogsToFederation(user.id);
        }

        logger.log(`[Astro] Transaccions sincronitzades amb el Node de la Federació.`);
    },

    /**
     * Recupera el balanç local bategat (Astro-Balance)
     */
    getLocalBalance() {
        const logs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
        return logs.reduce((total, log) => total + (log.amount || 0), 0);
    },

    /**
     * [PILLAR 3: Custòdia Social] - Gestió de Padrins
     */
    getPadrins() {
        return JSON.parse(localStorage.getItem('sp_padrins') || '[]');
    },

    /**
     * Afegeix un Padrin a la xarxa de confiança.
     */
    async addPadrin(padrin) {
        try {
            const padrins = this.getPadrins();
            if (padrins.length >= 3) {
                logger.warn('[Astro] Xarxa de confiança completa (3 Padrins).');
            }
            const updated = [...padrins, { ...padrin, id: Date.now() }];
            localStorage.setItem('sp_padrins', JSON.stringify(updated));
            logger.log(`[Astro] Nou Padrin afegit: ${padrin.name}`);
            return { success: true, padrins: updated };
        } catch (err) {
            logger.error('[Astro] Error afegint Padrin:', err);
            return { success: false, error: err.message };
        }
    }
};
