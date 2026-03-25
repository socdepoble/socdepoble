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
  
    /**
     * Inicialitza la base de dades i deriva la clau mestra.
     */
    async init(masterPassword = null) {
      if (this.masterKey && this.db) return;
      if (this.initPromise) return this.initPromise;
      
      this.initPromise = (async () => {
          // 1. Obtenir o generar el salt persistent
          let salt = localStorage.getItem('sdp_crypto_salt');
          if (!salt) {
            salt = crypto.getRandomValues(new Uint8Array(16));
            localStorage.setItem('sdp_crypto_salt', JSON.stringify(Array.from(salt)));
          } else {
            salt = new Uint8Array(JSON.parse(salt));
          }
      
          // 2. Derivar la clau mestra (PBKDF2)
          let keyMaterial;
          if (masterPassword) {
            const enc = new TextEncoder();
            keyMaterial = await crypto.subtle.importKey(
              'raw',
              enc.encode(masterPassword),
              'PBKDF2',
              false,
              ['deriveKey']
            );
          } else {
            // Sense contrasenya: utilitzem un secret derivat del dispositiu
            const deviceId = await this.getDeviceId();
            const enc = new TextEncoder();
            keyMaterial = await crypto.subtle.importKey(
              'raw',
              enc.encode(deviceId),
              'PBKDF2',
              false,
              ['deriveKey']
            );
          }
      
          this.masterKey = await crypto.subtle.deriveKey(
            {
              name: 'PBKDF2',
              salt,
              iterations: 100000,
              hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
          );
      
          // 3. Obrir IndexedDB
          await this.openDB();
      })();
      
      return this.initPromise;
    }
  
    async getDeviceId() {
      const data = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        (navigator.hardwareConcurrency || '')
      ].join('|');
      const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  
    openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
      });
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
      const store = this.db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
      store.put({ iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }, key);
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
      const store = this.db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
      store.delete(key);
    }
  }
  
  export const secureStorage = new SecureStorageService();
