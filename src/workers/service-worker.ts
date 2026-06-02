/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope & { clients: any, skipWaiting: () => void };
declare const __APP_HASH__: string | undefined;

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { getPendingMutations, removeMutation, markMutationFailed } from '../data/offline/mutation-queue';
import { supabase } from '../supabaseClient';
const APP_HASH = typeof __APP_HASH__ !== 'undefined' ? __APP_HASH__ : 'dev';
const SHELL_CACHE = `shell-${APP_HASH}`;
const OFFLINE_URL = '/offline.html';

cleanupOutdatedCaches();

// InjectManifest de Vite PWA inyecta el array de assets generados en el build step aquí.
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
        // En caso de fallar fetch de offline ignorar para no crashear instalación
        return cache.add(OFFLINE_URL).catch(() => console.warn('Offline page failed to map during install'));
    })
  );
  // ELIMINAT: self.skipWaiting(); per evitar col·lisions de cicle de vida amb Vite PWA
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          // Esborrar qualsevol caché que no siga l'actual de la shell ni la de workbox activa
          if (name !== SHELL_CACHE && !name.startsWith('workbox-precache')) {
            console.log('[SW] Eliminant caché obsoleta per a alliberar memòria:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESTRATÈGIA APP SHELL (EL MIRACLE OFFLINE-FIRST)
try {
  const handler = createHandlerBoundToURL('/index.html');
  const navigationRoute = new NavigationRoute(handler, {
    // Ignorem rutes que han d'anar directes a Supabase o APIs externes
    denylist: [
      new RegExp('^/api/'),
      new RegExp('^/_supabase/')
    ]
  });
  registerRoute(navigationRoute);
} catch (e) {
  console.warn('[SW] Ruta index.html no mapejada. Fallback manual necessari.', e);
}

self.addEventListener('message', async (event: any) => {
  const msg = event.data || {};
  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (msg.type === 'SYNC_MUTATIONS') {
    event.waitUntil(processOutbox());
  }
  
  // Handshake Atòmic (Consell Copilot)
  if (msg.type === 'sw:prepare-update') {
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((name) => {
          if (name !== SHELL_CACHE && !name.startsWith('workbox-precache')) {
            return caches.delete(name);
          }
        })
      );
      event.source?.postMessage({ type: 'update-ready' });
    } catch (err) {
      event.source?.postMessage({ type: 'prepare-failed', payload: String(err) });
    }
  }

  if (msg.type === 'sw:apply-update') {
    self.skipWaiting();
    event.source?.postMessage({ type: 'update-applied' });
  }
});

self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(processOutbox());
  }
});

export async function processOutbox() {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return await navigator.locks.request('socdepoble_sync_lock', { mode: 'exclusive' }, async () => {
      await _executeProcessOutbox();
    });
  } else {
    await _executeProcessOutbox();
  }
}

async function _executeProcessOutbox() {


  const mutations = await getPendingMutations();
  for (const mutation of mutations) {
    try {
      if (mutation.entity === 'posts' && mutation.action === 'CREATE') {
        const { data, error } = await supabase.rpc('create_post_mutation', {
           p_op_id: mutation.id,
           p_base_version: 1,
           p_payload: mutation.payload
        });
        
        if (error) {
           await markMutationFailed(mutation.id, error.message);
        } else if (data && data.status === 'success') {
          await removeMutation(mutation.id);
          let channel: BroadcastChannel | null = null;
          try {
            channel = new BroadcastChannel('socdepoble_sync');
            channel.postMessage({
              type: 'MUTATION_CONFIRMED',
              payload: { tempId: mutation.id, final: data }
            });
          } catch (err) {
            console.error('[SW] Error enviant missatge de confirmació:', err);
          } finally {
            if (channel) {
              channel.close();
            }
          }
        } else if (data && data.status === 'conflict') {
          await markMutationFailed(mutation.id, data.reason || 'conflict');
        }
      }
      // Omitiendo handles extras por el scope del MVP
    } catch (error: any) {
      await markMutationFailed(mutation.id, error.message);
    }
  }
}

