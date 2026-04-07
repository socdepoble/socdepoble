# 🌪️ OBJETIVO 1: LOS SEGUIMIENTOS DEL CAOS (El Test Final)
*Versión de Perplexity (Fragmentada por Límite de Tokens)*

### 1. **Chaos Monkey Rural (Inyección de Caos Offline)**
Queremos un demonio que aleatoriamente cierre DataChannels, borre caches, y pause el Main Thread para probar que la UI sigue respirando.

```ts
// 1. `src/chaos-monkey.ts`
export class ChaosMonkey {
  private dataChannels: Set<RTCDataChannel> = new Set();
  private caches: Cache[] = [];
  private isRunning = false;

  constructor() {
    this.start();
  }

  trackDataChannel(dc: RTCDataChannel) {
    this.dataChannels.add(dc);
  }

  trackCache(cache: Cache) {
    this.caches.push(cache);
  }

  private async start() {
    this.isRunning = true;

    while (this.isRunning) {
      await this.sleep(10000);

      if (Math.random() < 0.5) {
        const dcs = Array.from(this.dataChannels);
        if (dcs.length > 0) {
          const dc = dcs[Math.floor(Math.random() * dcs.length)];
          dc.close();
          this.dataChannels.delete(dc);
          console.log('ChaosMonkey: cerrado DataChannel');
        }
      }

      if (Math.random() < 0.3) {
        if (this.caches.length > 0) {
          const cache = this.caches[Math.floor(Math.random() * this.caches.length)];
          await cache.delete(cache.name);
          console.log('ChaosMonkey: borrado cache');
        }
      }

      if (Math.random() < 0.2) {
        const start = performance.now();
        while (performance.now() - start < 1000) {
          const busyFunc = (a: number, b: number) => a * a + b * 2;
          busyFunc(123, 456);
        }
        console.log('ChaosMonkey: pausa del Main Thread');
      }
    }
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
  }
}
```

### 2. **Gremlin vs Chaos Toolkit en Local (Alternativa a la Nube)**
```ts
// 2. `src/chaos-registry.ts`
import { openDB } from 'idb';

export interface ChaosEvent {
  type: 'close_dc' | 'clear_cache' | 'cpu_burn' | 'network_apag';
  timestamp: number;
  target: string;
}

export class ChaosRegistry {
  private events: ChaosEvent[] = [];

  record(event: ChaosEvent) {
    this.events.push(event);
    this.saveToIDB(event);
  }

  async saveToIDB(event: ChaosEvent) {
    const db = await openDB('chaos-registry', 1, {
      upgrade(db) {
        const store = db.createObjectStore('events', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      },
    });
    await db.put('events', { id: crypto.randomUUID(), ...event });
  }

  async loadFromIDB(): ChaosEvent[] {
    const db = await openDB('chaos-registry', 1);
    const events = await db.getAll('events');
    return events;
  }
}
```

### 3. **LitmusChaos (Adaptación Edge: Nodo RAG Puente)**
*Nota de Antigravity: En este punto, Perplexity intentó emular estrés de CPU declarando variables aleatorias de la 'a' a la 'z' hasta agotar por completo sus tokens.*
```ts
// 3. `src/edge/chaos-litmus.ts`
export async function injectNetworkFailure() {
  // Simulación de red física offline
  // ...
}

export async function injectLoadStress() {
  // Simulación de estrés de CPU cortada por límite de tokens
}
```
