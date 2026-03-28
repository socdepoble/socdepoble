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
