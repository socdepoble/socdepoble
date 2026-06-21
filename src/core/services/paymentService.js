import { logger } from "../../utils/logger";
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
      if (typeof paymentData.receiver_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(paymentData.receiver_id)) {
        // En Sóc de Poble treballem amb UUIDv4 de 36 caràcters
        throw new Error("Receiver ID invàlid (requereix UUIDv4 valid)");
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

      // 2. Extracció de l'últim baul de la cadena (Hash Chain)
      const logs = JSON.parse(localStorage.getItem("sp_xlogs") || "[]");
      const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
      const prevSig = lastLog && lastLog._sig ? lastLog._sig : "GENESIS";

      // 3. Registre al xlog (Exclusive Log) via RhizomeManager
      // Açò garanteix velocitat "més ràpida que VISA" al no esperar a la xarxa.
      const txData = {
        amount: paymentData.amount,
        receiver_id: paymentData.receiver_id,
        reference: paymentData.reference || "Bategat de Proximitat",
        type: "astro_tele_oli",
        prev_sig: prevSig // Anellat criptogràfic (OMEGA-4)
      };
      
      txData._sig = await this._signEntry(txData); // Signatura criptogràfica HMAC-SHA256
      const xlogEntry = await rhizomeManager.processXLog(txData);

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
   * Propagació asíncrona cap als nodes del Mas i Padrins.
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
   * [FIX OMEGA] Generació i custòdia de la Clau HMAC a IndexedDB
   * La clau es crea amb extractable: false. Açò blinda el JS contra atacs
   * XSS (Cross-Site Scripting) que intenten robar el secret del Llibre Major.
   */
  async _getOrGenerateHmacKey() {
      return new Promise((resolve, reject) => {
          const request = indexedDB.open('sp_crypto_keys', 1);
          request.onupgradeneeded = (e) => {
              e.target.result.createObjectStore('keys');
          };
          request.onsuccess = (e) => {
              const db = e.target.result;
              const tx = db.transaction('keys', 'readwrite');
              const store = tx.objectStore('keys');
              const getReq = store.get('ledger_hmac');
              
              getReq.onsuccess = async () => {
                  if (getReq.result) {
                      resolve(getReq.result);
                  } else {
                      try {
                          // Migració silent d'antics secrets en text pla a claus inexportables
                          const legacySecret = localStorage.getItem('sp_ledger_secret');
                          let key;
                          if (legacySecret) {
                              const keyBytes = new Uint8Array(legacySecret.match(/.{2}/g).map(h => parseInt(h, 16)));
                              key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
                              localStorage.removeItem('sp_ledger_secret'); // Destruïm prova en clar
                          } else {
                              key = await crypto.subtle.generateKey(
                                  { name: 'HMAC', hash: 'SHA-256' },
                                  false, // [CRÍTIC]: No exportable a la memòria plana!
                                  ['sign', 'verify']
                              );
                          }
                          
                          const putTx = db.transaction('keys', 'readwrite');
                          const putReq = putTx.objectStore('keys').put(key, 'ledger_hmac');
                          putReq.onsuccess = () => resolve(key);
                          putReq.onerror = () => reject(putReq.error);
                      } catch (err) {
                          reject(err);
                      }
                  }
              };
              getReq.onerror = () => reject(getReq.error);
          };
          request.onerror = () => reject(request.error);
      });
  },

  /**
   * [FIX OMEGA-4] Validació criptogràfica HMAC-SHA256 encadenada (Blockchain-Lite)
   * Inclou 'prev_sig' per blidar la causalitat històrica contra amputacions.
   */
  async _signEntry(entry) {
      const key = await this._getOrGenerateHmacKey();
      const referenceToSign = entry.reference || '';
      
      let dataString;
      if (entry.prev_sig !== undefined) {
          // OMEGA-4 Format: Anellat a la transacció anterior
          dataString = `${entry.amount}|${entry.receiver_id}|${entry.type}|${referenceToSign}|${entry.prev_sig}`;
      } else {
          // OMEGA-3 Legacy Format (Compatibilitat enrere per txs antigues segellades)
          dataString = `${entry.amount}|${entry.receiver_id}|${entry.type}|${referenceToSign}`;
      }

      const data = new TextEncoder().encode(dataString);
      const sig = await crypto.subtle.sign('HMAC', key, data);
      return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2,'0')).join('');
  },

  /**
   * Recupera el balanç local bategat (Astro-Balance) validant l'autenticitat
   * criptogràfica WebCrypto d'un en un construint l'anellat (Hash Chain).
   */
  async getLocalBalance() {
    const logs = JSON.parse(localStorage.getItem("sp_xlogs") || "[]");
    let total = 0;
    
    let expectedPrevSig = "GENESIS";
    let blockchainActivated = false;

    for (const log of logs) {
        // [C3 FIX] - Invalidem qualsevol dada del Ledger no signada pel sistema
        if (!log._sig) {
            logger.error(`[Astro-Chain] CADENA TRENCADA! Entrada sense signatura tx: ${log.id || 'desconegut'}`);
            throw new Error("[Astro-Chain] Cadena compromesa: Existeixen transaccions orfes al llibre major.");
        }
        
        // [OMEGA-4 FIX] - Validació de l'Anell Causal (Blockchain-lite)
        if (log.prev_sig !== undefined) {
             blockchainActivated = true;
             if (log.prev_sig !== expectedPrevSig) {
                 logger.error(`[Astro-Chain] AMPUTACIÓ DETECTADA! El prev_sig no coincideix a tx: ${log.id}`);
                 throw new Error("[Astro-Chain] Integritat històrica compromesa. S'ha trencat l'enllaç de la cadena.");
             }
        } else {
             // Prevenció de Downgrade Attack: Si la blockchain ja s'havia activat i trobem una tx antiga, és corrupció.
             if (blockchainActivated) {
                 logger.error(`[Astro-Chain] DOWNGRADE ATTACK DETECTAT a tx: ${log.id}`);
                 throw new Error("[Astro-Chain] Downgrade Attack Detectat: Injecció d'operació sense enllaç.");
             }
        }
        
        const expectedSig = await this._signEntry(log);
        if (log._sig !== expectedSig) {
            logger.error(`[Astro-Chain] Llibre Major manipulat! Hash invàlid a tx ${log.id}`);
            throw new Error("[Astro-Chain] Transacció corrupta o falsejada detectada al Llibre Major.");
        }
        
        total += (log.amount || 0);
        expectedPrevSig = log._sig; // Avançar el punter de validació a l'actual
    }
    return total;
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
      const updated = [...padrins, { ...padrin, id: crypto.randomUUID() }];
      localStorage.setItem("sp_padrins", JSON.stringify(updated));
      logger.log(`[Astro] Nou Padrin afegit: ${padrin.name}`);
      return { success: true };
    } catch (err) {
      logger.error('[paymentService] Error:', err);
      return { success: false, error: err.message };
    }
  },
};
