# Resum del Governor d'Async de Kimi (Ronda 12)
// Extret del prompt copiat i enganxat a les 04:24 AM.

| Secció | Què fa |
|--------|--------|
| **Mutex Global** | Semàfor central amb 6 blocs (Verema, Autopoiesi, Sync, Backup, GC, Handshake). Un sol worker pesat a la vegada. |
| **Bancal Budget** | Avalua RAM, bateria i finestra de manteniment (3-5 AM) abans de permetre cap operació. |
| **Protocol Quiesce** | Congela deltes, exporta a `.tmp`, verifica SHA-256, persisteix a `.yjs`, allibera tombstones. |
| **Keepalive iOS** | Ping cada 6 dies + touch a OPFS per evitar l'amnèsia de Safari. |
| **Sèquia Mare** | Batching intel·ligent: 100 events normal, 50 sota pressió, 10 en crític. Circuit breaker a 200KB. |
| **Handshake Rural** | Màquina d'estats QR amb 3 reintents i backoff exponencial (2s, 4s, 8s). |
| **Verema Engine** | Quiesce + snapshot lock + swap atòmic + Y.Doc verge. Mensual amb jitter. |
| **Autopoiesi** | Escaneig amb `max_depth=3`, màxim 5 propostes/sessió, poda d'emergència si humà absent 30 dies. |
| **GC Oportunista** | Neteja tombstones si RAM > 400MB, mínim 1 hora entre GCs. |
| **SOSP-LOCK** | Bloqueig absolut amb `Promise.race(10s)` i fallback a Mode Lectura Segura. |
| **Persistència iOS** | `navigator.storage.persist()` a l'arrencada, sense demanar perdó. |

## 🎯 Com usar-lo (Esquelet d'Inicialització)

```javascript
import { GovernorAsync } from './governor_async.js';

// Inicialitzar a l'arrencada de l'App
await GovernorAsync.init({
  yjsDoc: myYDoc,           // El teu document Y.js
  opfsRoot: myOpfsRoot,     // El directori OPFS
  syncFn: enviarALaXarxa,   // Funció de sincronització P2P
  scanFn: escanejarWiki,     // Funció d'escaneig per Autopoiesi
  compressFn: comprimirMd,   // Funció de compressió semàntica
  connectFn: connectarPeer,  // Funció de connexió QR
});

// Forçar operacions manuals (per botons d'UI)
await GovernorAsync.trigger('sync', config);      // Flush de la Sèquia Mare
await GovernorAsync.trigger('verema', config);    // Verema immediata
await GovernorAsync.trigger('handshake', { peerId: 'vei-123', connectFn });

// Consultar estat
const status = await GovernorAsync.status();
console.log(status.budget.state); // 'idle', 'active', 'pressure', 'panic'
```

## 🔒 El Secret del Governor (Kimi)
1. **Yield constant**: Cada 100ms al mutex, cada 10ms entre lots de la Sèquia Mare.
2. **Promise.race a tot**: Cap operació pot penjar-se més de 10 segons.
3. **Fallbacks actius**: Si algo falla, no petar: entrar en Mode Lectura.
4. **Jitter anti-Thundering**: Cap worker es desperta exactament a l'hora.
5. **Bancal Budget**: Abans de qualsevol operació pesada, preguntar "puc?".


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
