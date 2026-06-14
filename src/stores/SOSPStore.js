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
        // Mutació directa per evitar GC stress de l'spread operator, combinat amb structuredClone
        const nextCart = structuredClone(state.cart);
        nextCart.push(clean);
        state.cart = nextCart;
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
        const nextConns = structuredClone(state.connections);
        nextConns.push(connection);
        state.connections = nextConns;
        emitChange();
        await saveToDB('connections', id, connection);
      }
    },
    ui: {
      toast: (message, type = 'info') => {
        const toast = { id: Date.now(), message: String(message).substring(0, 200), type };
        const nextToasts = structuredClone(state.ui.toasts);
        nextToasts.push(toast);
        state.ui.toasts = nextToasts;
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

window.addEventListener('online', async () => {
  try {
    const db = await initDB();
    const pending = await db.getAll('events');
    if (!pending?.length) return;
    
    // Procès esglaonat (Gemini)
    const tx = db.transaction('events', 'readwrite');
    const store = tx.objectStore('events');

    for (const event of pending) {
      try {
        if (!SOSPStore.getState().isInitialized) await SOSPStore.init();
        
        window.dispatchEvent(new CustomEvent(event.type, { 
          detail: { ...event.payload, _requeued: true },
          bubbles: false, composed: false 
        }));
        
        await store.delete(event.id);
        // Cedir control al main thread entre events per no bloquejar (Gemini)
        await new Promise(r => setTimeout(r, 0));
      } catch (err) {
        event.retryCount = (event.retryCount || 0) + 1;
        if (event.retryCount < 5) {
          await store.put(event);
        } else {
          console.error('[SOSPStore] Event abandonat (5 intents):', event);
          await store.delete(event.id);
        }
      }
    }
  } catch (err) {
    console.error('[SOSPStore] Reprocessament fallit:', err);
  }
});

window.addEventListener('pagehide', () => {
  SOSPStore.flushToDisk();
});
window.addEventListener('beforeunload', () => {
  SOSPStore.destroy();
});
