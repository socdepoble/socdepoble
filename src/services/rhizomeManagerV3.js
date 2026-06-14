/**
 * RhizomeManagerV3.js
 * 
 * Gestor del Riizoma CRDT per a la Masia Eterna.
 * Filosofia Pedra Seca: cap dependència, cap framework, pura resistència.
 * 
 * Estratègia de persistència:
 *   - IDB: velocitat d'accés (però Safari pot traïcionar-lo)
 *   - OPFS: búnquer de pedra, sobreviu a l'apocalipsi del navegador
 *   - Worker: fflate + AES-GCM en fil separat, no bloqueja l'UI de l'avi
 */

class RhizomeManagerV3 {
  constructor({
    dbName,
    cryptoKey,
    worker,
    opfsStore,
    onStateChange,
    onError
  }) {
    this.dbName = dbName || 'masia-rhizome-v3';
    this.storeName = 'estat';
    this.cryptoKey = cryptoKey; // CryptoKey d'AES-GCM
    this.worker = worker; // Instància de RhizomeWorker
    this.opfsStore = opfsStore; // Instància d'OPFSStore
    this.onStateChange = onStateChange || (() => {});
    this.onError = onError || (() => {});
    this.state = null;
    this.version = 0;
    this.vectorClock = new Map(); // Rellotge vectorial per a CRDT
    this.pendingOps = []; // Operacions no persistides
    this.saveTimer = null;
    this.isSaving = false;
    this.destroyed = false;

    // SOSP-LOCK: Semàfor d'operació crítica en progrés
    this.sospLock = false;
    this.abortCtrl = new AbortController();
  }

  // === INICIALITZACIÓ ===

  async init() {
    if (this.destroyed) throw new Error('El riizoma ja ha mort. No es pot ressuscitar.');
    await this.loadState();
    this._startHeartbeat();
    return this;
  }

  // === CARREGA D'ESTAT ===

  async loadState() {
    // Estratègia: IDB és ràpid, OPFS és segur
    let loaded = false;
    let rawPayload = null;
    let source = null;

    // 1. Intenta IndexedDB — el camí ràpid, però traïdor a Safari
    try {
      rawPayload = await this._readIDB();
      if (rawPayload) {
        source = 'idb';
      }
    } catch (err) {
      console.warn('[Rhizome] IDB no respon o està corromput:', err.message);
      // No bloquegem, continuem a OPFS
    }

    // 2. Si IDB està buit o falla, recorre al Búnquer OPFS
    if (!rawPayload) {
      try {
        rawPayload = await this.opfsStore.read('rhizome-state.bin');
        if (rawPayload) {
          source = 'opfs';
        }
      } catch (err) {
        console.warn('[Rhizome] OPFS també calla:', err.message);
      }
    }

    // 3. Si tenim càrrega, desxifra i descomprimeix
    if (rawPayload) {
      try {
        let buffer = rawPayload;

        // Si ve d'OPFS, probablement està comprimit i xifrat
        if (source === 'opfs' || rawPayload instanceof ArrayBuffer || rawPayload instanceof Uint8Array) {
          // Deleguem al worker per no asfixiar l'iPad A10
          buffer = await this.worker.unpack({
            payload: rawPayload,
            key: this.cryptoKey,
            signal: this.abortCtrl.signal
          });
        }

        // Deserialització defensiva
        const decoded = this._deserialize(buffer);

        // Validació d'integritat CRDT
        if (this._validateState(decoded)) {
          this.state = decoded.state || decoded; // Compatibilitat amb formats antics
          this.version = decoded.version || 1;
          this.vectorClock = new Map(Object.entries(decoded.vectorClock || {}));
          this.pendingOps = decoded.pendingOps || [];
          loaded = true;
          // Si veníem d'OPFS, restaurem IDB per a la pròxima vegada
          if (source === 'opfs') {
            this._scheduleSave(true); // Força escriptura immediata a IDB
          }
        } else {
          throw new Error('Estat corromput: hash vectorial no coincideix');
        }
      } catch (err) {
        console.error('[Rhizome] Desxifratge o validació fallida:', err);
        this.onError('load-corrupt', err);
        // No marquem loaded = true; caurem a l'estat verge
      }
    }

    // 4. Si tot falla, naix l'estat verge — la Masia des de la pols
    if (!loaded) {
      this.state = this._createVirginState();
      this.version = 1;
      this.vectorClock = new Map();
      this.pendingOps = [];
    }

    // 5. Notifica als murs que ja hi ha sostre
    this.onStateChange(this.state, {
      origin: source || 'virgin',
      version: this.version
    });
    return this.state;
  }

  // === PERSISTÈNCIA ===

  async saveState(force = false) {
    if (this.destroyed || this.isSaving) return;

    // SOSP-LOCK: Si hi ha una operació crítica, espera
    if (this.sospLock && !force) {
      this._scheduleSave();
      return;
    }
    this.isSaving = true;
    const snapshot = this._prepareSnapshot();
    try {
      // 1. Serialitza i comprimeix en el worker (no bloqueja l'UI)
      const packed = await this.worker.pack({
        state: snapshot,
        key: this.cryptoKey,
        signal: this.abortCtrl.signal
      });

      // 2. Escriu a IDB (ràpid, per a la pròxima arrencada)
      await this._writeIDB(packed.meta, 'rhizome-meta'); // Meta ràpida
      await this._writeIDB(packed.full, 'rhizome-main'); // Backup complet

      // 3. Escriu a OPFS (el búnquer) — operació atòmica
      await this.opfsStore.write('rhizome-state.bin', packed.full, {
        atomic: true
      });

      // 4. Neteja operacions pendents ja persistides
      this.pendingOps = [];
      this.version++;
    } catch (err) {
      console.error('[Rhizome] Error en la fossilització:', err);
      this.onError('save-failed', err);
      // Les ops queden en pendingOps per a reintentar
    } finally {
      this.isSaving = false;
    }
  }
  _scheduleSave(immediate = false) {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    const delay = immediate ? 50 : 2000; // 2s de coalescència, o 50ms si és urgent

    this.saveTimer = setTimeout(() => {
      this.saveState();
    }, delay);
  }

  // === OPERACIONS CRDT ===

  applyOperation(op) {
    if (this.destroyed) return;

    // Afig rellotge vectorial
    const nodeId = op.nodeId || 'masia-central';
    const current = this.vectorClock.get(nodeId) || 0;
    this.vectorClock.set(nodeId, Math.max(current, op.ts || 0));

    // Aplica a l'estat (LWW-Register o LWW-Map segons el tipus)
    this._mergeOperation(op);

    // Acumula per a persistència
    this.pendingOps.push(op);

    // Notifica i programa guardat
    this.onStateChange(this.state, {
      origin: 'local',
      op
    });
    this._scheduleSave();
    return this.state;
  }

  // === SINCRONITZACIÓ (per a quan arribe la connexió o un altre dispositiu) ===

  async sync(incomingBuffer) {
    if (this.destroyed) return;
    try {
      // Desempaqueta el que ens envien
      const incoming = await this.worker.unpack({
        payload: incomingBuffer,
        key: this.cryptoKey,
        signal: this.abortCtrl.signal
      });
      const merged = this._mergeStates(this.state, incoming.state, incoming.vectorClock);
      this.state = merged.state;
      this.vectorClock = merged.vectorClock;
      this.version++;

      // Persisteix el resultat
      this._scheduleSave(true);
      return {
        success: true,
        conflicts: merged.conflicts
      };
    } catch (err) {
      this.onError('sync-failed', err);
      return {
        success: false,
        error: err.message
      };
    }
  }

  // === UTILITATS INTERNES ===

  _createVirginState() {
    // L'estat inicial de la Masia: un mapa buit on cada clau és un LWW-Register
    return {
      __type: 'RhizomeStateV3',
      createdAt: Date.now(),
      registers: new Map()
    };
  }
  _prepareSnapshot() {
    return {
      version: this.version,
      state: this.state,
      vectorClock: Object.fromEntries(this.vectorClock),
      pendingOps: this.pendingOps,
      timestamp: Date.now(),
      checksum: this._computeChecksum()
    };
  }
  _deserialize(data) {
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
      // Probablement JSON en UTF-8
      const text = new TextDecoder().decode(data);
      return JSON.parse(text);
    }
    if (typeof data === 'string') return JSON.parse(data);
    return data;
  }
  _serialize(obj) {
    const text = JSON.stringify(obj);
    return new TextEncoder().encode(text);
  }
  _validateState(decoded) {
    if (!decoded) return false;
    // Comprovació mínima d'integritat
    if (decoded.__type && decoded.__type !== 'RhizomeStateV3') return false;
    return true;
  }
  _mergeOperation(op) {
    // LWW-Map: l'operació amb timestamp major guanya
    const {
      key,
      value,
      ts,
      nodeId
    } = op;
    const registers = this.state.registers || (this.state.registers = new Map());
    const existing = registers.get(key);
    if (!existing || ts > existing.ts) {
      registers.set(key, {
        value,
        ts,
        nodeId
      });
    }
  }
  _mergeStates(local, remote, remoteClock) {
    const conflicts = [];
    const mergedState = {
      ...local,
      registers: new Map(local.registers)
    };

    // Fusiona rellotges vectorials
    const mergedClock = new Map(this.vectorClock);
    for (const [node, time] of Object.entries(remoteClock)) {
      const localTime = mergedClock.get(node) || 0;
      if (time > localTime) mergedClock.set(node, time);
    }

    // Fusiona registres LWW
    const remoteRegs = remote.registers || {};
    for (const [key, remoteReg] of Object.entries(remoteRegs)) {
      const localReg = mergedState.registers.get(key);
      if (!localReg || remoteReg.ts > localReg.ts) {
        if (localReg && localReg.nodeId !== remoteReg.nodeId) {
          conflicts.push({
            key,
            local: localReg,
            remote: remoteReg
          });
        }
        mergedState.registers.set(key, remoteReg);
      }
    }
    return {
      state: mergedState,
      vectorClock: mergedClock,
      conflicts
    };
  }
  _computeChecksum() {
    // Checksum simple per a detecció d'integritat (no criptogràfic)
    const str = JSON.stringify(this.state) + JSON.stringify([...this.vectorClock]);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Converteix a 32bit
    }
    return hash;
  }

  // === INDEXEDDB WRAPPER (robust per a Safari) ===

  _openIDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }
  async _readIDB() {
    const db = await this._openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get('rhizome-main');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  }
  async _writeIDB(data, key = 'rhizome-main') {
    const db = await this._openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(data, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  }

  // === CICLE DE VIDA ===

  _startHeartbeat() {
    // Cada 30 segons, força una persistència si hi ha ops pendents
    this._heartbeat = setInterval(() => {
      if (this.pendingOps.length > 0) {
        this._scheduleSave(true);
      }
    }, 30000);
  }
  destroy() {
    this.destroyed = true;
    this.abortCtrl.abort();
    if (this.saveTimer) clearTimeout(this.saveTimer);
    if (this._heartbeat) clearInterval(this._heartbeat);

    // Última oportunitat de persistir
    if (this.pendingOps.length > 0) {
      // Sincronitza per a no perdre res
      this.saveState(true).catch(() => {});
    }
  }

  // === GETTERS PÚBLICS ===

  getState() {
    return this.state;
  }
  getVersion() {
    return this.version;
  }
  getPendingCount() {
    return this.pendingOps.length;
  }
}
export { RhizomeManagerV3 };