/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope & { clients: any, skipWaiting: () => void };

import { precacheAndRoute } from 'workbox-precaching';

const CACHE_NAME = 'socdepoble-v1';
const OFFLINE_URL = '/offline.html';

// InjectManifest de Vite PWA inyecta el array de assets generados en el build step aquí.
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        // En caso de fallar fetch de offline ignorar para no crashear instalación
        return cache.add(OFFLINE_URL).catch(() => console.warn('Offline page failed to map during install'));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event: any) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL) as Promise<Response>)
    );
  }
});

self.addEventListener('message', (event: any) => {
  if (event.data?.type === 'SYNC_MUTATIONS') {
    event.waitUntil(processOutbox());
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
  const { getPendingMutations, removeMutation, markMutationFailed } = await import('../data/offline/mutation-queue');
  // Usamos el cliente supabase definido globalmente en nuestro backend / data context
  const { supabase } = await import('../supabaseClient.js');

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
          const channel = new BroadcastChannel('socdepoble_sync');
          channel.postMessage({
            type: 'MUTATION_CONFIRMED',
            payload: { tempId: mutation.id, final: data }
          });
          channel.close();
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

