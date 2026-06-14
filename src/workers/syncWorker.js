// ----------------------------------------------------------------------
// Sóc de Poble Fase 11 - Heartbeat SyncWorker
// Aquest Worker serveix exclusivament per enviar pulsacions (Heartbeats)
// asíncrones sobre l'estat de xarxa o el pes de la càrrega de dades, 
// alliberant el main thread de React d'estar avaluant això al ReactDOM.
// ----------------------------------------------------------------------

let isNetworkAlive = true;
let currentJwt = null;
let pendingQueueSize = 0;
self.addEventListener('message', async e => {
  const {
    type,
    payload
  } = e.data;
  switch (type) {
    case 'HEARTBEAT_NETWORK':
      isNetworkAlive = payload.isOnline;
      // Actualitzem imediatament l'Interfície
      self.postMessage({
        type: 'SYNC_STATE_CHANGED',
        payload: {
          status: isNetworkAlive ? 'online' : 'offline'
        }
      });
      break;
    case 'HEARTBEAT_AUTH':
      currentJwt = payload.token;
      if (isNetworkAlive && pendingQueueSize > 0) {
        self.postMessage({
          type: 'SYNC_STATE_CHANGED',
          payload: {
            status: 'syncing'
          }
        });
      }
      break;
    case 'HEARTBEAT_AUTH_KILL':
      currentJwt = null;
      break;
    case 'MANUAL_SYNC_TRIGGER':
      if (isNetworkAlive) {
        self.postMessage({
          type: 'SYNC_STATE_CHANGED',
          payload: {
            status: 'syncing'
          }
        });

        // Simular que hem posat tasques a la cua que l'SDK consumeix
        setTimeout(() => {
          self.postMessage({
            type: 'SYNC_STATE_CHANGED',
            payload: {
              status: 'online'
            }
          });
          self.postMessage({
            type: 'SYNC_PROGRESS',
            payload: {
              count: 0
            }
          });
        }, 1500); // 1.5s visual feedback
      }
      break;
    default:
      console.warn('[SyncWorker] Heartbeat Desconegut:', type);
  }
});

// Batec de fons (Polling off-thread de 3 segons)
setInterval(() => {
  if (!isNetworkAlive || !currentJwt) return;

  // Ací monitoritzaríem l'API de base de dades off-thread (ex: SQLite Queue count).
  // Ara mateix deleguem a la UI el recompte per simplificar l'adaptador principal.
  // Es pot pollejar /api/metadata o algo semblant en el futur.
}, 3000);