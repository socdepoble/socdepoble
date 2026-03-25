import { logger } from "../utils/logger";
import { rhizomeManager } from "./rhizomeManager";

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
    logger.log("[Astro] Iniciant Bategat Econòmic (Tele-Oli)...");
    try {
      // 1. Validació Estricta (Anti-Object Injection i Parsing Segur)
      if (typeof paymentData.receiver_id !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(paymentData.receiver_id)) {
        // En Sóc de Poble treballem amb UUIDv4 de 36 caràcters
        throw new Error("Receiver ID invàlid (requereix UUID valid)");
      }
      
      if (typeof paymentData.amount !== 'number' && typeof paymentData.amount !== 'string') {
        throw new Error("Format d'import invàlid");
      }

      const amountStr = String(paymentData.amount);
      if (!/^\\d+(\\.\\d{1,2})?$/.test(amountStr)) {
        throw new Error("Màxim 2 decimals permesos (format invàlid)");
      }

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0 || amount > 10000) {
        throw new Error("Import invàlid (0 < amount ≤ 10000)");
      }

      // 2. Registre al xlog (Exclusive Log) via RhizomeManager
      // Açò garanteix velocitat "més ràpida que VISA" al no esperar a la xarxa.
      const xlogEntry = await rhizomeManager.processXLog({
        amount: paymentData.amount,
        receiver_id: paymentData.receiver_id,
        reference: paymentData.reference || "Bategat de Proximitat",
        type: "astro_tele_oli",
      });

      logger.log(`[Astro] Transacció bategada al xlog: ${xlogEntry.id}`);

      // 3. Simulem la propagació asíncrona (Cel·lular Mesh)
      this._propagateTransaction(xlogEntry);

      return {
        success: true,
        transactionId: xlogEntry.id,
        status: "instant_sealed", // Segellat instantani al mòbil
      };
    } catch (err) {
      logger.error("[Astro] Error en el bategat econòmic:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Propagació asíncrona cap als nodes de Masia i Padrins.
   */
  async _propagateTransaction() {
    // [PILLAR 3] Node de la Federació (Cooperativa)
    const user = JSON.parse(localStorage.getItem("sp_user_cache"));
    if (user) {
      await rhizomeManager.syncXLogsToFederation(user.id);
    }

    logger.log(
      `[Astro] Transaccions sincronitzades amb el Node de la Federació.`,
    );
  },

  /**
   * Recupera el balanç local bategat (Astro-Balance)
   */
  getLocalBalance() {
    const logs = JSON.parse(localStorage.getItem("sp_xlogs") || "[]");
    return logs.reduce((total, log) => total + (log.amount || 0), 0);
  },

  /**
   * [PILLAR 3: Custòdia Social] - Gestió de Padrins
   */
  getPadrins() {
    return JSON.parse(localStorage.getItem("sp_padrins") || "[]");
  },

  /**
   * Afegeix un Padrin a la xarxa de confiança.
   */
  async addPadrin(padrin) {
    try {
      const padrins = this.getPadrins();
      if (padrins.length >= 3) {
        logger.warn("[Astro] Xarxa de confiança completa (3 Padrins).");
      }
      const updated = [...padrins, { ...padrin, id: Date.now() }];
      localStorage.setItem("sp_padrins", JSON.stringify(updated));
      logger.log(`[Astro] Nou Padrin afegit: ${padrin.name}`);
      return { success: true };
    } catch (err) {
      logger.error('[paymentService] Error:', err);
      return { success: false, error: err.message };
    }
  },
};
