import { openDB } from 'idb';

const DB_NAME = 'SOSPStore';
const DB_VERSION = 1;
const STORES = ['cart', 'connections', 'ui', 'events'];

let dbPromise = null;
let initPromise = null;
let listeners = new Set();

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        STORES.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            const options = store === 'events' ? { keyPath: 'id', autoIncrement: true } : undefined;
            db.createObjectStore(store, options);
          }
        });
      },
    });
  }
  return dbPromise;
};

const saveToDB = async (store, key, value) => {
  try {
    const db = await initDB();
    await db.put(store, value, key);
  } catch (err) {
    console.warn(`[SOSPStore] Error IndexedDB (${store}):`, err);
    try { localStorage.setItem(`sdp:backup:${store}:${key}`, JSON.stringify(value)); } catch (e) { /* ignore localStorage errors in private mode */ }
  }
};

const getFromDB = async (store, key) => {
  try {
    const db = await initDB();
    return await db.get(store, key);
  } catch (err) {
    const backup = localStorage.getItem(`sdp:backup:${store}:${key}`);
    return backup ? JSON.parse(backup) : null;
  }
};

const getAllFromDB = async (store) => {
  try {
    const db = await initDB();
    return await db.getAll(store);
  } catch (err) {
    return [];
  }
};

export const saveEventToQueue = async (type, payload) => {
  const eventData = { type, payload, ts: Date.now(), retryCount: 0 };
  try {
    const db = await initDB();
    await db.add('events', eventData);
    
    // Background Sync API per sincronitzar en segon pla (Vibe)
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('sync-sosp-events');
    }
  } catch (err) {
    console.warn('[SOSPStore] Fallada cua offline. Guardant a localStorage (Fallback)');
    try {
      const queue = JSON.parse(localStorage.getItem('sdp:event-queue') || '[]');
      queue.push({ type, payload: eventData });
      localStorage.setItem('sdp:event-queue', JSON.stringify(queue));
    } catch(e) {
      console.warn('[SOSPStore] No s\'ha pogut escriure el fallback a localStorage');
    }
  }
};

const emitChange = () => { for (let listener of listeners) listener(); };

let state = { 
  cart: [], 
  connections: [], 
  ui: { toasts: [], currentModal: null }, 
  isInitialized: false 
};

// SANITITZADOR: extraiem primitives pures per evitar fuites de memòria i estructures circulars
const sanitizeItem = (item) => {
  if (!item || typeof item !== 'object') return null;
  const { id, title, price, qty, imageUrl, type, authorName, content } = item;
  return {
    id: String(id || ''),
    title: String(title || authorName || '').substring(0, 200),
    content: String(content || '').substring(0, 500),
    price: Math.max(0, Number(price) || 0),
    qty: Math.max(1, Math.floor(Number(qty) || 1)),
    imageUrl: String(imageUrl || '').substring(0, 500),
    type: String(type || 'product')
  };
};

export const SOSPStore = {
  getState() { return state; },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  destroy: () => {
    listeners.clear();
    dbPromise = null;
    initPromise = null;
    state.isInitialized = false;
  },
  init: async () => {
    if (initPromise) return initPromise;
    
    // Demanar a Safari iOS que no ens purgue l'IndexedDB quan falte espai (Gemini)
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }

    initPromise = (async () => {
      if (state.isInitialized) return;
      try {
        const savedCart = await getFromDB('cart', 'items');
        const savedConnections = await getAllFromDB('connections');
        state = { 
          ...state, 
          cart: (savedCart || []).map(sanitizeItem).filter(Boolean), 
          connections: savedConnections || [], 
          isInitialized: true 
        };
        emitChange();
      } catch (err) {
        console.error('[SOSPStore] Init fallit:', err);
      }
    })();
    return initPromise;
  },
  actions: {
    cart: {
      add: async (item) => {
        const clean = sanitizeItem(item);
        if (!clean) return;
        
        // Optimistic UI amb Spread Operator (10x més ràpid que structuredClone a A10)
        state.cart = [...state.cart, clean];
        emitChange();
        
        await saveToDB('cart', 'items', state.cart);
      },
      remove: async (itemId) => {
        state.cart = state.cart.filter(i => i.id !== itemId);
        emitChange();
        await saveToDB('cart', 'items', state.cart);
      }
    },
    connection: {
      request: async (id, type) => {
        const connection = { id: String(id), type: String(type), ts: Date.now() };
        state.connections = [...state.connections, connection];
        emitChange();
        await saveToDB('connections', id, connection);
      }
    },
    ui: {
      toast: (message, type = 'info') => {
        const toast = { id: Date.now(), message: String(message).substring(0, 200), type };
        state.ui.toasts = [...state.ui.toasts, toast];
        emitChange();
        
        setTimeout(() => {
          state.ui.toasts = state.ui.toasts.filter(t => t.id !== toast.id);
          emitChange();
        }, 3000);
      },
      clearToast: (id) => {
        state.ui.toasts = state.ui.toasts.filter(t => t.id !== id);
        emitChange();
      }
    },
    modal: {
      open: (modalType, payload) => {
        state.ui.currentModal = { type: modalType, payload };
        emitChange();
      },
      close: () => {
        state.ui.currentModal = null;
        emitChange();
      }
    }
  },
  flushToDisk: () => {
    try {
      localStorage.setItem('sdp:backup:cart:items', JSON.stringify(state.cart));
      localStorage.setItem('sdp:backup:connections:all', JSON.stringify(state.connections));
    } catch (e) {
      console.warn('[SOSPStore] Error fent flush a disk:', e);
    }
  }
};

// Netejat per Claude: Els listeners s'han de gestionar fora de l'estat global per evitar memory leaks.
