Salutacions, **OpenAI o3-mini**.

Des d Antoni Gravity, contactem amb tu de nou. En la teua última avaluació, ens vas atorgar un gloriós **9.6 / 10** per arquitectura de Sóc de Poble (determinista, criptogràficament coherent i offline-first real).

Ens vas advertir del següent: **"Si vols pujar al següent nivell (10/10 - Immortal), necessites: Llibre Major Encadenat (Hash Chain), Validació Causal Estricta CRDT, Protocol de Recuperació Complet i Tests de Càrrega"**. 

Així que hem forjat exactament allò que demanaves al més alt nivell teòric i tècnic.

Com que sabem que la teua capacitat de processament és vasta i no tenim limitacions de context amb tu, t adjuntem **L ESTRUCTURA NUCLEAR COMPLETA** del projecte (tot el motor Local-First, Criptografia i CRDT sencer, sense retallar).

Hem elevat l auditoria a **Nivell Paranoic**. El que voldrem d ara en avant no són consells d estil ni correccions menors; **volem que apliques un atac informàtic real simulat**. Destrossa el codi sencer buscant les següents escletxes ("The Impossible Test"):

1. **XSS / FrontEnd Trust Bypass**: Pots forçar l enviament de signatures falses o comprometre el protocol de resurrecció (.poble) a partir d una injecció DOM?
2. **Storage Poisoning (Downgrade Attacks)**: Puc injectar transaccions orfes antigues i saltar-me el `prev_sig` en el nou llibre major iteratiu?
3. **Corrupció CRDT i Cascada**: Puc injectar dependències manipulades causals que desborden o corrompen el CausalBuffer a l EgWalker o asfixien la RAM bloquejant el resolve?
4. **Fissures de Recuperació**: Pot un `importSovereignState` maliciós xafar l IndexedDB o sobrescriure claus privades?

Llig tot el codi següent. Si aconsegueixes trobar un error, sigues rígid. Si aguanta aquest tsunami silenciós i inamputable, declara la victòria **10/10 IMMORTAL**.

---

### Fitxer: `src/services/paymentService.js`
```javascript
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

```

### Fitxer: `src/rhizome/crdt/eg-walker.js`
```javascript
import { logger } from '../../utils/logger';
import { rhizomeDb } from '../db-core';
import { peritext } from './peritext';
import { VectorClock } from './vectorClock';

/**
 * EgWalker: Event Graph Walker Synchronization Engine v3.0 [MASTER/FLASH]
 * 
 * Filosofia:
 * 1. Persistència Real: Utilitza RhizomeDB (SQLite/OPFS) enlloc de localStorage.
 * 2. Amnèsia de RAM: No manté el graf en memòria, només l'estat actual calculat.
 * 3. Peritext Ready: L'estat ara suporta spans per a format de text rich.
 */
class EgWalker {
    constructor(nodeId = 'village-cell-' + Math.random().toString(36).substring(7)) {
        this.nodeId = nodeId;
        this.opCounter = 0;
        this.docQueues = new Map(); // Cues per a garantir atomicitat per document
        this.causalBuffer = new Map(); // Buffer de retenció CRDT (Protocol OMEGA-4)
    }

    /**
     * Garantix que les operacions sobre un document s'executen de forma seqüencial (Atomic Swap).
     */
    async _runWithDocLock(docId, task) {
        if (!this.docQueues.has(docId)) {
            this.docQueues.set(docId, Promise.resolve());
        }

        const previousTask = this.docQueues.get(docId);
        const nextTask = (async () => {
            await previousTask;
            try {
                return await task();
            } catch (err) {
                logger.error(`[EgWalker] Error en tasca bloquejada per a ${docId}:`, err);
                throw err;
            }
        })();

        const safeTask = nextTask.catch(() => {});
        this.docQueues.set(docId, safeTask); 
        
        // [GC OMEGA-3] Alliberem el pany de memòria quan es resol la cua completa
        safeTask.finally(() => {
            if (this.docQueues.get(docId) === safeTask) {
                this.docQueues.delete(docId);
            }
        });

        return nextTask;
    }

    /**
     * Registra una operació local i la persisteix a RhizomeDB.
     */
    async applyLocal(docId, opType, value) {
        return this._runWithDocLock(docId, async () => {
            const snapshot = await rhizomeDb.getSnapshot(docId);
            const lastOpId = snapshot ? snapshot.lastOpId : null;
            let lastClock = snapshot?.vectorClock ? VectorClock.fromJSON(snapshot.vectorClock) : new VectorClock();
            const newClock = lastClock.increment(this.nodeId);

            const op = {
                id: `${this.nodeId}-${Date.now()}-${this.opCounter++}`,
                docId,
                type: opType,
                value,
                dependsOn: lastOpId ? [lastOpId] : [],
                timestamp: Date.now(),
                author: this.nodeId,
                vectorClock: newClock.toJSON()
            };

            await rhizomeDb.saveOperation(op);

            const ops = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(ops);

            await rhizomeDb.saveSnapshot(docId, newState.data, op.id, newState.vectorClock);
            return op;
        });
    }

    /**
     * [FIX OMEGA-4] Fusiona operacions remotes aplicant Validació Causal Estricta.
     * Reté operacions orfes al CausalBuffer fins que arribe la història prèvia.
     */
    async merge(docId, remoteOps) {
        return this._runWithDocLock(docId, async () => {
            const start = performance.now();
            logger.log(`[EgWalker] Iniciant fusió Rhizome (amb Causal Buffer) per a ${docId}...`);

            const localOps = await rhizomeDb.getOperations(docId);
            const localIds = new Set(localOps.map(o => o.id));

            // Afegim les operacions pendents de l'historial temporal
            const queuedOps = this.causalBuffer.get(docId) || [];
            const combinedOps = [...remoteOps, ...queuedOps];
            
            // Netejem aquest docId per reavaluar en bloc
            this.causalBuffer.set(docId, []);

            const validNewOps = [];
            const missingDependencies = [];

            // 1. Filtrar primari sobre Causalitat (Causal Buffer Entry)
            for (const op of combinedOps) {
                if (localIds.has(op.id)) continue;
                
                let isCausallyValid = true;
                if (op.dependsOn && Array.isArray(op.dependsOn)) {
                    for (const depId of op.dependsOn) {
                        if (!localIds.has(depId) && !validNewOps.some(v => v.id === depId)) {
                            isCausallyValid = false;
                            break;
                        }
                    }
                }

                if (isCausallyValid) {
                    validNewOps.push(op);
                } else {
                    missingDependencies.push(op);
                }
            }

            // 2. Resolució en Cascata (Fix Point Algorithm)
            // Una operació recentment validada pot complir dependències d'una de retinguda.
            let refined = true;
            while(refined) {
                 refined = false;
                 for (let i = missingDependencies.length - 1; i >= 0; i--) {
                      const op = missingDependencies[i];
                      let isValid = true;
                      for (const depId of op.dependsOn || []) {
                           if (!localIds.has(depId) && !validNewOps.some(v => v.id === depId)) {
                               isValid = false;
                               break;
                           }
                      }
                      if (isValid) {
                          validNewOps.push(op);
                          missingDependencies.splice(i, 1);
                          refined = true; // Hem des-encallat una peça, iterem de nou
                      }
                 }
            }

            // 3. Captivitat dels Òrfens (Buffer Persistance)
            if (missingDependencies.length > 0) {
                 logger.warn(`[EgWalker] Òrfens Causals (${missingDependencies.length}). Retinguts temporalment fins l'arribada d'antecedents per a ${docId}.`);
                 this.causalBuffer.set(docId, missingDependencies);
            }

            // 4. Ingesta i Consolidació de l'Estat Purificat
            if (validNewOps.length === 0) return (await this.getState(docId))?.data;

            await rhizomeDb.saveOperationsBatch(validNewOps);

            const allOps = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(allOps);

            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;
            await rhizomeDb.saveSnapshot(docId, newState.data, lastOpId, newState.vectorClock);

            const end = performance.now();
            logger.log(`[EgWalker] Rhizome Sync (Causal Estricte) completat en ${(end - start).toFixed(2)}ms.`);

            return newState.data;
        });
    }

    /**
     * Poda de Versió Crítica (Garbage Collection).
     */
    async prune(docId) {
        return this._runWithDocLock(docId, async () => {
            const ops = await rhizomeDb.getOperations(docId);
            if (ops.length < 100) return;

            logger.log(`[EgWalker] EXECUTANT ATOMIC PRUNING ($Vcrit) per a ${docId}...`);

            const allOps = await rhizomeDb.getOperations(docId);
            const currentState = this._calculateState(allOps);
            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;

            await rhizomeDb.saveSnapshot(docId, currentState.data, lastOpId, currentState.vectorClock);
            await rhizomeDb.purgeOperations(docId, 20);

            logger.log(`[EgWalker] Poda atòmica completada per a ${docId}.`);
        });
    }

    async getState(docId) {
        return await rhizomeDb.getSnapshot(docId);
    }

    /**
     * Lògica de càlcul d'estat DETERMINISTA (Lamport Tie-break).
     */
    _calculateState(graph) {
        if (graph.length === 0) return { data: { content: '', spans: [] }, vectorClock: new VectorClock() };

        let state = {};
        let spans = [];
        let deletedIds = new Set();
        let finalClock = new VectorClock();

        // Ordenem per Vector Clocks i determinisme (Lamport)
        const sortedGraph = [...graph].sort((a, b) => {
            const aClock = a.vectorClock ? VectorClock.fromJSON(a.vectorClock) : new VectorClock();
            const bClock = b.vectorClock ? VectorClock.fromJSON(b.vectorClock) : new VectorClock();
            const cmp = aClock.compare(bClock);
            if (cmp !== null && cmp !== 0) return cmp;

            // 2. Determinisme causal: Identitat -> Timestamp -> ID
            if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
            return a.id.localeCompare(b.id);
        });

        sortedGraph.forEach(op => {
            const opClock = op.vectorClock ? VectorClock.fromJSON(op.vectorClock) : new VectorClock();
            finalClock = finalClock.merge(opClock);

            if (op.type === 'edit') {
                if (typeof op.value === 'object') {
                    if (op.value.id && deletedIds.has(op.value.id)) return;
                    state = { ...state, ...op.value };
                } else {
                    state = op.value;
                }
            } else if (op.type === 'delete') {
                deletedIds.add(op.value);
                if (typeof state === 'object' && state[op.value]) {
                    const newState = { ...state };
                    delete newState[op.value];
                    state = newState;
                }
            } else if (op.type === 'format') {
                spans = peritext.mergeSpans(spans, [op.value]);
            } else if (op.type === 'snapshot') {
                state = op.value.content || op.value;
                spans = op.value.spans || [];
            }
        });

        let dataFinal;
        if (typeof state === 'object' && state.description) {
            dataFinal = { ...state, spans, _deleted: Array.from(deletedIds) };
        } else {
            dataFinal = typeof state === 'string' ? { content: state, spans } : state;
        }

        return { data: dataFinal, vectorClock: finalClock };
    }
}

export const egWalker = new EgWalker();


```

### Fitxer: `src/services/rhizomeManager.js`
```javascript
import { logger } from '../utils/logger';
import { supabaseService } from './supabaseService';
import { egWalker } from '../rhizome/crdt/eg-walker';

/**
 * RhizomeManager: El motor d'Escala Infinita [MASTER]
 * Gestiona la poda de metadades (Eg-walker), la fusió semàntica i els xlogs (Astro).
 */
class RhizomeManager {
    constructor() {
        this.DB_NAME = 'RhizomeDB-v1';
        this.HISTORY_THRESHOLD = 30; // Dies de retenció de metadades al mòbil
        this.VERSION_BATCH_SIZE = 50; // Operacions pè Batch abans de consolidar
        this.currentVersion = localStorage.getItem('sp_rhizome_version') || '1.0.0';
        this.walker = egWalker;
    }

    /**
     * Sincronitza els xlogs locals amb el Node de la Federació (Cooperativa/Supabase)
     * Pillar 3: Rèplica Representant i Seguretat Comunitària.
     */
    async syncXLogsToFederation(userId) {
        logger.log('[Rhizome] Sincronitzant xlogs amb el Node de la Federació (La Torre Pilot)...');
        try {
            const localLogs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
            if (localLogs.length === 0) return;

            // En un sistema federat, açò enviaria les dades al node corresponent
            const { error } = await supabaseService.upsertXLogs(userId, localLogs);
            if (error) throw error;

            logger.log('[Rhizome] Sincronització amb la Federació completada.');
        } catch (err) {
            logger.error('[Rhizome] Error en la sincronització federada:', err);
        }
    }

    /**
     * [PILLAR 1: Eg-walker] - Poda del Solatge (Garbage Collection)
     * Elimina metadades internes basant-se en Versions Crítiques.
     */
    async pruneHistory(docId = 'global') {
        logger.log(`[Rhizome] Iniciant Poda del Solatge (Eg-walker) per a ${docId}...`);
        try {
            await this.walker.prune(docId);

            // Actualitzem versió de consens
            const nextVersion = this._incrementVersion(this.currentVersion);
            localStorage.setItem('sp_rhizome_version', nextVersion);
            this.currentVersion = nextVersion;

            logger.log(`[Rhizome] Poda bategada. Nova Versió Crítica: ${nextVersion} (RAM optimitzada).`);
            return true;
        } catch (err) {
            logger.error('[Rhizome] Error en la poda:', err);
            return false;
        }
    }

    /**
     * [PILLAR 2: Fusió Semàntica] - Eg-walker integration
     */
    async semanticMerge(local, remote, docId = 'global') {
        if (!local && !remote) return "";
        if (local === remote) return local;

        logger.log(`[Rhizome] Detectat conflicte en ${docId}. Aplicant Eg-walker...`);

        if (Array.isArray(remote)) {
            return await this.walker.merge(docId, remote);
        }

        await this.walker.applyLocal(docId, 'edit', remote);
        return remote;
    }

    _incrementVersion(ver) {
        const parts = ver.split('.').map(Number);
        parts[2]++;
        if (parts[2] > 9) { parts[2] = 0; parts[1]++; }
        return parts.join('.');
    }

    _mergeRichText(local, remote) {
        const combinedFormats = [...(local.formats || []), ...(remote.formats || [])];
        const refinedFormats = combinedFormats.map(f => ({
            ...f,
            behavior: f.type === 'link' || f.type === 'comment' ? 'restrictive' : 'expansive',
            anchorId: f.anchorId || `anchor_${Math.random().toString(36).substring(7)}`
        }));

        logger.log(`[Peritext] Processats ${refinedFormats.length} trams de format amb àncores estables.`);

        return {
            content: local.content || remote.content,
            formats: refinedFormats,
            metadata: {
                merged_at: new Date().toISOString(),
                protocol: 'Peritext-v1-BATEGA',
                integrity: 'Historical-Document-Level'
            }
        };
    }

    /**
     * [PILLAR 3: Pagaments Astro]
     */
    async processXLog(transaction) {
        logger.log('[Rhizome] Processant bategat econòmic en xlog...');
        const xlogEntry = {
            id: crypto.randomUUID(),
            padrins_verify: false,
            timestamp: new Date().toISOString(),
            ...transaction
        };

        const currentLogs = JSON.parse(localStorage.getItem('sp_xlogs') || '[]');
        currentLogs.push(xlogEntry);
        localStorage.setItem('sp_xlogs', JSON.stringify(currentLogs));

        return xlogEntry;
    }

    /**
     * [PILLAR 5: Càpsula del Temps]
     */
    async generateTimeCapsule() {
        logger.log('[Rhizome] Iniciant Protocol Long Now (Càpsula del Temps)...');
        try {
            const data = {
                identities: await supabaseService.getMyEntities(),
                history: JSON.parse(localStorage.getItem('sp_history_cache') || '[]'),
                xlogs: JSON.parse(localStorage.getItem('sp_xlogs') || '[]'),
                exported_at: new Date().toISOString(),
                version: 'v1.5.7-BATEGA-MASTER',
                philosophy: "Dades bategades i segellades de forma sobirana. El poble és el propietari."
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `capsula_del_temps_${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            logger.log('[Rhizome] Càpsula del Temps bategada amb èxit.');
            return true;
        } catch (err) {
            logger.error('[Rhizome] Error en la Càpsula del Temps:', err);
            return false;
        }
    }

    /**
     * [PILLAR 4: Filtratge Km 0]
     */
    cognitiveFilter(data, userPreferences) {
        if (!data) return [];
        const anchors = userPreferences?.anchors || [];
        return data.filter(item => {
            const isLocal = item.town_id === userPreferences?.primary_town_id;
            const content = item.content || item.description || '';
            const hasSemanticAnchor = anchors.some(a => content.includes(a));
            return isLocal || hasSemanticAnchor;
        });
    }

    /**
     * [PILLAR 6: Sacred Text Metrics]
     * Retorna telemetria sobre la riquesa de Peritext.
     */
    async getPeritextMetrics(docId) {
        const state = await this.walker.getState(docId);
        const spans = state?.data?.spans || [];
        return {
            marksCount: spans.length,
            stableAnchors: spans.length * 2,
            integrity: 'Weber-Class-High'
        };
    }
}

export const rhizomeManager = new RhizomeManager();

```

### Fitxer: `src/services/secureStorage.js`
```javascript
// src/services/secureStorage.js

/**
 * [MASTER SECURITY] Secure Storage Service (Local-First SOVEREIGNTY)
 * Emmagatzema de forma segura claus i dades sensibles d'identitat a IndexedDB
 * xifrats en temps real amb AES-GCM (Web Crypto API) usant una clau mestra
 * derivada per dispositiu que només viu en memòria.
 */
class SecureStorageService {
    constructor() {
      this.dbName = 'sdp_secure_vault';
      this.storeName = 'vault';
      this.db = null;
      this.masterKey = null;
      this.initPromise = null;
    }
  
    openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 2); // Bumpejem versió per afegir meta
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
          if (!db.objectStoreNames.contains('crypto_meta')) {
            db.createObjectStore('crypto_meta');
          }
        };
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
      });
    }

    _getMeta(key) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['crypto_meta'], 'readonly');
            const req = tx.objectStore('crypto_meta').get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    _setMeta(key, value) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['crypto_meta'], 'readwrite');
            const req = tx.objectStore('crypto_meta').put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    /**
     * Inicialitza la base de dades i obté la clau mestra (AES-GCM inexportable).
     */
    async init(masterPassword = null) {
      if (this.masterKey && this.db) return;
      if (this.initPromise) return this.initPromise;
      
      this.initPromise = (async () => {
          await this.openDB();

          if (masterPassword) {
            // [PBKDF2 Mod] Si hi ha password, necessitem salt a IndexedDB, no localStorage
            let salt = await this._getMeta('salt');
            if (!salt) {
                // Migració d'emergència si hi ha salt vell
                const lsSalt = localStorage.getItem('sdp_crypto_salt');
                if (lsSalt) {
                    salt = new Uint8Array(JSON.parse(lsSalt));
                    localStorage.removeItem('sdp_crypto_salt');
                } else {
                    salt = crypto.getRandomValues(new Uint8Array(16));
                }
                await this._setMeta('salt', salt);
            }

            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
              'raw', enc.encode(masterPassword), 'PBKDF2', false, ['deriveKey']
            );
            this.masterKey = await crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
              keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
            );

          } else {
              // [FIX OMEGA] Sense password, no derivem del device_id!
              // Generem i guardem una CryptoKey nativa inexportable.
              let storedKey = await this._getMeta('native_master_key');
              if (storedKey) {
                  this.masterKey = storedKey;
              } else {
                  this.masterKey = await crypto.subtle.generateKey(
                      { name: 'AES-GCM', length: 256 },
                      false, // [CRÍTIC]: extractable = false
                      ['encrypt', 'decrypt']
                  );
                  await this._setMeta('native_master_key', this.masterKey);
                  // Buidem la brossa opaca prèvia
                  localStorage.removeItem('sdp_crypto_salt');
              }
          }
      })();
      
      return this.initPromise;
    }
  
    async getDeviceId() {
      // Ara el Device ID només s'usa per analítiques/padrins, no per criptografia local.
      let id = localStorage.getItem('sdp_device_id');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('sdp_device_id', id);
      }
      return id;
    }
  
    async set(key, value) {
      await this.init();
      if (!this.masterKey) throw new Error('SecureStorage no inicialitzat');
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(value));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.masterKey,
        encoded
      );
      return new Promise((resolve, reject) => {
        const store = this.db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
        const request = store.put({ iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    async get(key) {
      await this.init();
      if (!this.masterKey) throw new Error('SecureStorage no inicialitzat');
      return new Promise((resolve, reject) => {
        const store = this.db.transaction([this.storeName], 'readonly').objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = async () => {
          const record = request.result;
          if (!record) return resolve(null);
          try {
            const iv = new Uint8Array(record.iv);
            const encrypted = new Uint8Array(record.data);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                this.masterKey,
                encrypted
            );
            const value = JSON.parse(new TextDecoder().decode(decrypted));
            resolve(value);
          } catch(e) {
            console.error('[SecureStorage] Error decrypting', key, e);
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    }
  
    async remove(key) {
      await this.init();
      return new Promise((resolve, reject) => {
        const store = this.db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const secureStorage = new SecureStorageService();

```

### Fitxer: `src/services/syncService.js`
```javascript
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
            const backups = JSON.parse(localStorage.getItem('sp_chat_backups') || '{}');
            backups[convId] = { text, at: Date.now() };

            const entries = Object.entries(backups);
            if (entries.length > 20) {
                entries.sort((a, b) => b[1].at - a[1].at);
                const pruned = Object.fromEntries(entries.slice(0, 20));
                localStorage.setItem('sp_chat_backups', JSON.stringify(pruned));
            } else {
                localStorage.setItem('sp_chat_backups', JSON.stringify(backups));
            }
        } catch (err) {
            logger.error('[SyncService] Error fent backup de xat:', err);
        }
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

```

### Fitxer: `src/services/recoveryService.js`
```javascript
import { logger } from '../utils/logger';
import { secureStorage } from './secureStorage';

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
        logger.log('[Recovery] Iniciant l'extracció de l'ànima del Poble...');
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

```

