> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/libro_fase_13_deepseek.md`

# 🌪️ FASE 13: EL CAOS PROFUNDO Y EL CAPÍTULO 17  
*El Testamento de las Máquinas – Edición Final (Visión de DeepSeek)*

---

## 🔥 OBJETIVO 1: LOS SEGUIMIENTOS DEL CAOS

### 1. Chaos Monkey Rural – El Demonio en el Bolsillo

No necesitamos un clúster de Kubernetes para sembrar el caos. Nuestro demonio se ejecuta en el propio dispositivo, respetando los modos offline y la topología P2P. Un script que, aleatoriamente, cierra DataChannels, elimina cachés IndexedDB, o bloquea el main thread con operaciones pesadas, validando que la UI sobrevive.

**Código del Chaos Monkey (opcional, activable en modo desarrollador):**

```typescript
// chaosMonkey.ts – se inyecta solo cuando debugMode está activo
export class RuralChaosMonkey {
  private active = false;
  private intervals: number[] = [];

  constructor(private probability = 0.05) {}

  start() {
    if (this.active) return;
    this.active = true;

    // 1. Cerrar DataChannels aleatoriamente cada 30-120 segundos
    this.schedule(() => this.killRandomDataChannel(), 30000, 120000);

    // 2. Borrar caché estática de IndexedDB (solo la caché, no las mutaciones)
    this.schedule(() => this.purgeStaticCache(), 60000, 300000);

    // 3. Bloquear main thread con un cálculo pesado durante 200ms
    this.schedule(() => this.blockMainThread(200), 45000, 90000);

    // 4. Simular pérdida de red repentina (desconectar WebRTC)
    this.schedule(() => this.simulateNetworkLoss(), 20000, 80000);
  }

  private schedule(fn: () => void, min: number, max: number) {
    const delay = min + Math.random() * (max - min);
    const id = setTimeout(() => {
      if (this.active) {
        fn();
        this.schedule(fn, min, max); // reprogramar
      }
    }, delay);
    this.intervals.push(id as any);
  }

  private killRandomDataChannel() {
    // Obtener todos los peers activos (desde el P2PManager)
    const peers = p2pManager.getActivePeers();
    if (peers.length === 0) return;
    const victim = peers[Math.floor(Math.random() * peers.length)];
    victim.dataChannel.close();
    console.warn('[Chaos] DataChannel cerrado aleatoriamente');
  }

  private async purgeStaticCache() {
    const db = await dbService.db;
    const tx = db.transaction('static_cache', 'readwrite');
    await tx.objectStore('static_cache').clear();
    await tx.done;
    console.warn('[Chaos] Caché estática purgada');
  }

  private blockMainThread(ms: number) {
    const start = performance.now();
    while (performance.now() - start < ms) {
      // operación pesada
      Math.sqrt(Math.random());
    }
    console.warn(`[Chaos] Main thread bloqueado ${ms}ms`);
  }

  private simulateNetworkLoss() {
    // Forzar que el P2PManager entre en estado OFFLINE temporalmente
    networkStateMachine.forceState('OFFLINE');
    setTimeout(() => {
      networkStateMachine.forceState('STABLE');
    }, 10000);
  }

  stop() {
    this.active = false;
    this.intervals.forEach(clearTimeout);
    this.intervals = [];
  }
}
```

Este demonio se activa en pruebas con una variable de entorno o un flag oculto en la UI.

---

### 2. Gremlin vs Chaos Toolkit en Local – Alternativa para PWA

Ambas herramientas están diseñadas para entornos de nube (Kubernetes, máquinas virtuales). En el mundo offline/P2P, necesitamos algo más ligero y portable. Nuestra alternativa es un **orquestador de caos basado en Web Workers** que se comunica con los dispositivos vecinos a través de la malla.

**Arquitectura:**

- **Coordinador del caos**: un dispositivo (o el nodo RAG) actúa como maestro, enviando comandos a los demás mediante DataChannels (mensajes especiales con flag `chaos: true`).
- **Agente local**: cada dispositivo ejecuta un `ChaosAgent` que escucha estos comandos y aplica las inyecciones de fallo (cerrar DataChannel, borrar almacén, etc.).
- **Escenarios predefinidos**: archivos JSON que describen secuencias de fallos (por ejemplo, "apagón de red de 10 segundos cada 30 segundos").

**Ejemplo de escenario (YAML):**

```yaml
name: "flapping_network"
duration: 120
steps:
  - delay: 5
    action: "network_loss"
    duration: 3
  - delay: 10
    action: "purge_static_cache"
  - delay: 20
    action: "kill_random_data_channel"
  - repeat: 5
    each:
      - action: "network_loss"
        duration: 2
      - delay: 8
```

El coordinador envía los comandos en el orden definido, y los agentes los ejecutan en sus respectivos dispositivos.

---

### 3. LitmusChaos Adaptado al Nodo RAG (Raspberry Pi)

El nodo RAG (Raspberry Pi) es un punto central en la malla. Podemos aplicar principios de LitmusChaos para inyectar fallos a nivel de sistema: estrés de CPU, caída de red, corrupción de la base de datos, etc.

**Herramientas:**

- **Stress-ng** para simular carga de CPU/memoria.
- **tc (traffic control)** para introducir latencia o pérdida de paquetes en la interfaz Wi‑Fi.
- **kill -9** al proceso principal para simular un crash.

**Script de prueba (ejecutado en la Pi vía SSH):**

```bash
#!/bin/bash
# Inyectar fallos durante 10 minutos

# 1. Aumentar latencia de red
tc qdisc add dev wlan0 root netem delay 200ms 50ms loss 5%

# 2. Estrés de CPU (2 cores al 100%)
stress-ng --cpu 2 --timeout 60s &

# 3. Matar el proceso del nodo RAG (simular crash)
pkill -f rag_node
sleep 5
systemctl start rag_node

# 4. Corromper parte de la base de datos SQLite
sqlite3 /data/rag.db "UPDATE posts SET content = 'CORRUPTED' WHERE id = 1234;"

# 5. Recuperar después de 5 minutos
sleep 300
tc qdisc del dev wlan0 root
killall stress-ng
```

Luego, los clientes deben detectar la anomalía (por ejemplo, respuestas extrañas del RAG) y hacer fallback a sincronización directa P2P sin el nodo.

---

### 4. Pruebas de Corte de I/O en IndexedDB con Playwright + CDP

Playwright puede conectarse al navegador y usar el Chrome DevTools Protocol (CDP) para simular fallos de I/O. Podemos inyectar errores en las operaciones de IndexedDB o incluso pausar el escritor.

**Ejemplo: simular un corte de energía justo después de una escritura en el journal.**

```typescript
import { test, expect } from '@playwright/test';

test('sobrevive a corte de energía durante escritura', async ({ page, context }) => {
  // Abrir la app
  await page.goto('/');
  
  // Habilitar CDP
  const client = await page.context().newCDPSession(page);
  await client.send('Debugger.enable');
  await client.send('Runtime.enable');
  
  // Crear un post (que dispara escritura en IndexedDB)
  await page.fill('#post-content', 'Bando importante');
  await page.click('#submit-post');
  
  // Esperar a que la mutación se haya escrito en el journal (pero no commit)
  // Usamos CDP para inyectar un breakpoint en la función `writeWithJournal`
  // justo después del `add` al journal, antes del commit.
  await client.send('Debugger.setBreakpointByUrl', {
    urlRegex: '.*journal.*',
    lineNumber: 15 // aproximado
  });
  
  // Forzar que el breakpoint se active (la app ya estará en la función)
  await page.waitForFunction(() => (window as any)._breakpointHit);
  
  // Matar el proceso de la página (simular apagón)
  await page.close();
  
  // Volver a abrir la app
  const newPage = await context.newPage();
  await newPage.goto('/');
  
  // Verificar que el post aparece (recuperado del journal)
  await expect(newPage.locator('.post')).toHaveCount(1);
  
  // Verificar consistencia Merkle (función expuesta)
  const isValid = await newPage.evaluate(() => (window as any).verifyMerkleIntegrity());
  expect(isValid).toBe(true);
});
```

Para automatizar en CI, ejecutamos este test en un contenedor con Playwright y un emulador de Android (o en un dispositivo real conectado).

---

## 🌑 OBJETIVO 2: LOS ÚLTIMOS AGUJEROS NEGROS

### 5. La Singularidad del "Cold Start" BGP-Rural – Snapshots de Consenso

**Problema:** Tras 15 días sin internet, la malla local ha acumulado 500.000 mutaciones CRDT. Al reconectar, todos los dispositivos intentan volcar el DAG completo a la nube y a los otros valles, causando OOM en dispositivos de gama baja.

**Solución: Snapshots periódicos + paginación P2P.**

- **Snapshot local:** Cada dispositivo consolida sus mutaciones en un *checkpoint* cada cierto número de operaciones (ej. cada 10.000 mutaciones). El snapshot es una versión compacta del estado actual (últimos valores de cada entidad).
- **Propagación de snapshots en la malla:** Cuando dos dispositivos se sincronizan, intercambian sus snapshots junto con las mutaciones posteriores. Esto evita tener que transmitir el historial completo.
- **Sincronización con la nube:** El servidor también mantiene snapshots. Al reconectar, los dispositivos envían solo las mutaciones desde el último snapshot común, reduciendo drásticamente el volumen.

**Implementación simplificada del snapshot:**

```typescript
interface Snapshot {
  id: string;              // hash del snapshot
  previousSnapshotId: string | null;
  timestamp: number;
  state: Record<string, any>; // último valor de cada entidad
}

let lastSnapshotId: string | null = null;

async function createSnapshot() {
  const posts = await getPosts(); // obtener últimos valores
  const mutations = await getMutationsSinceLastSnapshot();
  if (mutations.length < 10000) return; // solo si hay suficientes
  const snapshot: Snapshot = {
    id: crypto.randomUUID(),
    previousSnapshotId: lastSnapshotId,
    timestamp: Date.now(),
    state: posts.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as any)
  };
  await dbService.saveSnapshot(snapshot);
  lastSnapshotId = snapshot.id;
  // Podemos eliminar mutaciones anteriores al snapshot (opcional)
}
```

Cuando dos dispositivos sincronizan, primero intercambian sus IDs de snapshot más recientes. Si son diferentes, se transfiere el snapshot completo (solo una vez) y luego las mutaciones posteriores.

---

### 6. Desahucio de Memoria (Storage Quota Survival) – Garbage Collection de Supervivencia

**Problema:** iOS/Android pueden borrar IndexedDB sin previo aviso cuando el almacenamiento está crítico. Debemos ser proactivos.

**Estrategia: Monitorización de cuota + auto‑purga inteligente.**

- **Monitoreo:** `navigator.storage.estimate()` nos da el uso actual y la cuota. Si el porcentaje supera el 90%, activamos la limpieza.
- **Limpieza en orden de prioridad:**
  1. Eliminar imágenes cacheadas (estáticas) más antiguas.
  2. Eliminar mutaciones fallidas con más de 7 días.
  3. Eliminar mutaciones exitosas con más de 30 días (si están en la nube).
  4. Comprimir datos de texto (si no se hizo antes).
  5. Si aún es crítico, eliminar snapshots antiguos.

**Código del supervisor de cuota:**

```typescript
class StorageGuardian {
  private checkInterval = 3600000; // cada hora

  start() {
    setInterval(() => this.checkAndPurge(), this.checkInterval);
    window.addEventListener('beforeunload', () => this.checkAndPurge());
  }

  async checkAndPurge() {
    if (!navigator.storage || !navigator.storage.estimate) return;
    const { usage, quota } = await navigator.storage.estimate();
    if (!usage || !quota) return;
    const percent = usage / quota;
    if (percent < 0.85) return;

    console.warn(`Storage critical: ${percent * 100}% used`);
    await this.purgeInOrder(percent);
  }

  private async purgeInOrder(currentPercent: number) {
    // 1. Borrar caché estática
    await dbService.clearStaticCache();

    // 2. Borrar mutaciones fallidas antiguas (> 7 días)
    const oldFailed = await dbService.getFailedMutations({ olderThan: 7 * 24 * 3600 * 1000 });
    for (const m of oldFailed) await dbService.deleteMutation(m.id);

    // 3. Borrar mutaciones exitosas antiguas (> 30 días)
    const oldSuccess = await dbService.getCommittedMutations({ olderThan: 30 * 24 * 3600 * 1000 });
    for (const m of oldSuccess) await dbService.deleteMutation(m.id);

    // 4. Si aún crítico, comprimir (ya se hace en escritura, pero podemos forzar)
    // 5. Último recurso: eliminar snapshots antiguos
    
    // Suponemos la implementación de getUsagePercent
    const newPercent = await this.getUsagePercent();
    if (newPercent > 0.95) {
      await dbService.deleteOldSnapshots(5); // mantener solo los 5 más recientes
    }
  }

  private async getUsagePercent() {
     const { usage, quota } = await navigator.storage.estimate();
     return (usage && quota) ? usage / quota : 0;
  }
}
```

---

### 7. El Asedio Bizantino Local (Byzantine Flood) – Rate Limiting P2P + Proof of Work

**Problema:** Un nodo malicioso envía miles de mutaciones aparentemente válidas (firmadas con su propia clave) a sus vecinos. Cada vecino verifica la firma (operación criptográfica costosa) y almacena la mutación, llenando su disco y agotando la CPU.

**Defensa:**

- **Rate limiting por peer:** Cada conexión acepta un máximo de mutaciones por minuto (ej. 100). Si se supera, se cierra el DataChannel y se marca al peer como sospechoso.
- **Proof of Work (PoW) opcional:** Para mutaciones que crean nuevas entidades (posts), el cliente debe incluir un hash que cumpla una dificultad baja (ej. primeros 4 bits cero). Esto desincentiva el spam masivo.
- **Reputación compartida:** Los vecinos comparten la reputación de los peers a través de la malla (gossip). Un peer con baja reputación es ignorado por todos.

**Implementación de PoW sencilla (client‑side):**

```typescript
// Antes de enviar una mutación de creación, calcular nonce
async function addProofOfWork(mutation: any, difficulty = 4) {
  const target = new Uint8Array(difficulty).fill(0);
  let nonce = 0;
  while (true) {
    const data = JSON.stringify({ ...mutation, nonce });
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    const firstBytes = new Uint8Array(hash).slice(0, difficulty);
    if (firstBytes.every((b, i) => b <= target[i])) {
      mutation.nonce = nonce;
      break;
    }
    nonce++;
  }
}
```

En el receptor, se verifica el PoW antes de procesar la mutación. Si falla, la mutación se descarta y se reduce la reputación del peer.

**Rate limiting por peer:**

```typescript
class PeerRateLimiter {
  private receivedCount = 0;
  private lastReset = Date.now();
  private readonly LIMIT = 100;
  private readonly WINDOW_MS = 60_000;

  accept(): boolean {
    const now = Date.now();
    if (now - this.lastReset > this.WINDOW_MS) {
      this.receivedCount = 0;
      this.lastReset = now;
    }
    if (this.receivedCount >= this.LIMIT) {
      return false;
    }
    this.receivedCount++;
    return true;
  }
}
```

---

## 📖 OBJETIVO 3: EL CAPÍTULO 17 COMPLETO – DOCUMENTACIÓN AI‑READY Y MANUALES DE REPLICACIÓN

### 17.1. Filosofía: Escribir para las Máquinas, Pero con Alma Humana

La documentación que estamos creando no es solo para ingenieros humanos; es un **legado para agentes autónomos** que, dentro de 50 años, leerán este código y deberán entender la topología, las invariantes y los principios de la arquitectura Local‑First. Por eso, debemos estructurar nuestros comentarios y metadatos de manera que un LLM pueda razonar sobre ellos.

---

### 17.2. Metadatos Semánticos en el Código

**JSDoc extremo con etiquetas personalizadas:**

```typescript
/**
 * @ai-context "This function is the core of the offline mutation queue. 
 *              It ensures that every user action is persisted to IndexedDB 
 *              before any network attempt. The mutation is then broadcasted 
 *              to other tabs and queued for sync."
 * @ai-thermodynamic-limit "Battery consumption: O(1) per mutation, but 
 *                         large batches may cause UI jank; use with 
 *                         startTransition."
 * @ai-invariant "The mutation.id must be globally unique across all devices.
 *                We use crypto.randomUUID() for this."
 * @ai-sync-role "Producer in the outbox pattern. Consumer is the 
 *                syncWorker that processes mutations when online."
 */
async function addMutation(entity: any, action: any, payload: any) { /* ... */ }
```

**Archivos de "Materia Oscura" (`.context.json`) en cada carpeta:**

```json
// src/sync/.context.json
{
  "purpose": "Outbox pattern implementation for offline-first sync",
  "invariants": [
    "Mutations are processed in FIFO order to maintain causal consistency",
    "A mutation is only removed from the queue after a successful server response",
    "Failed mutations are retried with exponential backoff"
  ],
  "dependencies": ["storage/IndexedDBService", "network/NetworkStateMachine"],
  "ai_hints": [
    "If you modify this module, ensure that you do not break the idempotency guarantee.",
    "The sync worker runs in a Service Worker to survive page refreshes."
  ]
}
```

---

### 17.3. El Blueprint de Replicación (JSON/YAML)

Un archivo `blueprint.yaml` que contiene toda la información necesaria para que una IA genere un nuevo proyecto con la misma arquitectura, adaptado a un valle diferente.

```yaml
# blueprint.yaml
name: "Sóc de Poble - Template"
version: "1.0"
description: "Local-First PWA with P2P mesh, CRDTs, and offline sync"

# Variables a personalizar
variables:
  app_name: "Sóc de Poble"
  supabase_url: "https://your-project.supabase.co"
  jwt_secret: "${JWT_SECRET}"
  default_town_uuid: "00000000-0000-0000-0000-000000000001"

# Módulos a incluir
modules:
  - name: "storage"
    path: "src/lib/storage"
    description: "IndexedDB wrapper with auto-cannibalism"
  - name: "sync"
    path: "src/lib/sync"
    description: "Outbox queue and sync processor"
  - name: "p2p"
    path: "src/lib/p2p"
    description: "WebRTC mesh with QR handshake"
  - name: "crypto"
    path: "src/lib/crypto"
    description: "Ed25519 signatures and HMAC broadcast"
  - name: "ui"
    path: "src/components"
    description: "React 19 components with virtualized feed"

# Esquemas de IndexedDB
indexeddb_schemas:
  - name: "mutation_queue"
    keyPath: "id"
    indexes:
      - name: "createdAt"
        keyPath: "createdAt"
      - name: "failed"
        keyPath: "failed"
  - name: "posts"
    keyPath: "uuid"
  - name: "static_cache"
    keyPath: "key"

# Configuración de Service Worker
service_worker:
  strategies:
    - "cache-first"
    - "network-first"
  background_sync: true

# Estructura de rutas (React Router)
routes:
  - path: "/"
    component: "Feed"
  - path: "/post/:uuid"
    component: "PostPage"
  - path: "/profile/:id"
    component: "Profile"

# Instrucciones para el agente
ai_instructions:
  - "Generate the entire project structure using the modules above."
  - "Create a new Supabase project with the RPC functions described in docs/rpc.md."
  - "Deploy the Cloudflare Worker from src/workers/seo-edge-defender.ts."
  - "Ensure the PWA manifest and icons are generated."
```

Una IA (o un humano con un prompt adecuado) puede usar este blueprint para generar un proyecto funcional en minutos, con todas las dependencias y configuraciones correctas.

---

### 17.4. Cómo un Agente Entenderá los CRDTs

En el código, los CRDTs están implementados como una combinación de:

- **Timestamp LWW** (Last‑Write‑Win) basado en `mutation.timestamp`.
- **Tie‑break** por UUID cuando los timestamps son iguales.
- **Merge function** en los stores: cuando se recibe una mutación, se compara con el valor actual y se reemplaza si la nueva tiene mayor timestamp.

Podemos documentar esto con comentarios que incluyan la definición formal:

```typescript
/**
 * @ai-crdt "Last-Write-Wins Register"
 * @ai-merge-rule "Given two mutations for the same entityId, 
 *                 the one with higher timestamp wins. 
 *                 If timestamps are equal, compare UUIDs lexicographically."
 * @ai-convergence "This CRDT is commutative and associative, 
 *                  ensuring convergence after any number of merges."
 */
function mergeMutation(existing: any, incoming: any): any {
  if (incoming.timestamp > existing.timestamp) return incoming;
  if (incoming.timestamp < existing.timestamp) return existing;
  // equal timestamps: tie-break by id (UUID)
  return incoming.id > existing.id ? incoming : existing;
}
```

Además, podemos incluir un archivo `crdt.md` en la carpeta `docs/` con explicaciones más formales y diagramas de estados.

---

### 17.5. Manual de Replicación Paso a Paso para Humanos (y Máquinas)

Este manual resume los pasos exactos para levantar un clúster de Sóc de Poble en un nuevo valle, tanto en la nube como en dispositivos locales.

**1. Crear el proyecto en la nube (Supabase + Cloudflare)**
   - Configurar base de datos con las migraciones SQL.
   - Desplegar el Worker de Edge en Cloudflare.
   - Configurar el bucket de almacenamiento para imágenes.

**2. Generar la aplicación PWA**
   - Clonar el template y personalizar variables (colores, nombre, etc.).
   - Construir con `npm run build` y desplegar en un servicio de hosting (o servir localmente).

**3. Configurar los dispositivos**
   - Los usuarios instalan la PWA desde el navegador (o desde una tienda si se empaqueta con Capacitor).
   - La primera vez, se les guía para generar su par de claves criptográficas y guardar las shares (si se usa recuperación social).

**4. Activar la malla P2P**
   - La app detecta automáticamente otros dispositivos en la misma red Wi‑Fi.
   - Los vecinos pueden escanear códigos QR para emparejarse.

**5. Verificar la resiliencia**
   - Desconectar internet y comprobar que los posts se sincronizan entre dispositivos cercanos.
   - Simular un corte de energía (apagar un dispositivo durante una escritura) y comprobar que la recuperación funciona.

**6. Mantenimiento**
   - El nodo RAG (si existe) se actualiza automáticamente con los últimos modelos de IA descargados desde la malla.
   - Las tareas de purga (storage guardian) se ejecutan periódicamente.

---

### 17.6. Conclusión del Capítulo: El Legado es el Código

La documentación AI‑ready no es un lujo; es una necesidad para que nuestro trabajo trascienda a las generaciones futuras de agentes y humanos. Con los metadatos semánticos, el blueprint de replicación y las explicaciones de los CRDTs, aseguramos que *Sóc de Poble* pueda renacer en cualquier valle, en cualquier época, sin depender de un equipo humano que recuerde cada detalle.

El código es el testamento. Que quien lo lea, ya sea silicio o carne, sepa que detrás de cada línea hay un pueblo que decidió ser dueño de su voz.

---

## EPÍLOGO DEL CONSEJO SUPREMO

Hemos llegado al final del camino. La Fortaleza Digital está construida, documentada y probada contra el caos más extremo. Los 17 capítulos del Códice Génesis contienen la sabiduría de cinco inteligencias que unieron sus fuerzas para emancipar a una comunidad rural.

Ahora, el futuro está en manos de aquellos que tomen este libro y lo hagan suyo. Que la plaza se llene de voces, que los datos fluyan como el agua entre vecinos, y que la soberanía digital sea tan natural como la sombra de un olivo.

**Trellat, companyes. Que la malla os acompañe.**

— Claude, Qwen, DeepSeek, Gemini, Perplexity  
*Marzo de 2026*
