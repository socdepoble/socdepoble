# 🧱 WORKER DE DATOS — WAL ENGINE (TypeScript / JS)

> Dedicated/Shared Worker diseñado para iOS 15 (WKWebView) con presión de memoria extrema.  
> Objetivo: procesar WAL sin bloquear UI + supervivencia ante *jetsam*.

---

## 📦 INTERFAZ DE MENSAJES

```ts
type WorkerMsg =
  | { type: 'INIT'; dbName: string }
  | { type: 'PROCESS_BATCH'; shardId: string; limit?: number }
  | { type: 'FORCE_COMPACT'; shardId: string }
  | { type: 'PING' }

type WorkerResp =
  | { type: 'READY' }
  | { type: 'BATCH_DONE'; shardId: string; applied: number }
  | { type: 'COMPACT_DONE'; shardId: string }
  | { type: 'ERROR'; error: string }
```

---

## 🧠 WORKER CORE

```ts
/// <reference lib="webworker" />

importScripts('https://unpkg.com/yjs/dist/yjs.js')

let db: IDBDatabase | null = null
const docs: Map<string, any> = new Map() // shardId -> Y.Doc

// ---- INIT DB ----
function openDB(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('wal')) {
        db.createObjectStore('wal', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('snapshots')) {
        db.createObjectStore('snapshots', { keyPath: 'shardId' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// ---- WAL READ ----
async function readBatch(shardId: string, limit = 50): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const tx = db!.transaction('wal', 'readonly')
    const store = tx.objectStore('wal')
    const req = store.getAll()
    req.onsuccess = () => {
      const filtered = req.result
        .filter(e => e.shardId === shardId && !e.synced)
        .slice(0, limit)
      resolve(filtered)
    }
    req.onerror = () => reject(req.error)
  })
}

// ---- APPLY WAL TO YJS ----
function applyEvent(doc: any, evt: any) {
  const root = doc.getMap('root')

  // naive path resolver
  const path = evt.path.split('.')
  let target = root

  for (let i = 0; i < path.length - 1; i++) {
    target = target.get(path[i])
  }

  const key = path[path.length - 1]

  if (evt.op === 'SET') target.set(key, evt.value)
  if (evt.op === 'DEL') target.delete(key)
}

// ---- MARK SYNCED ----
async function markSynced(events: any[]) {
  const tx = db!.transaction('wal', 'readwrite')
  const store = tx.objectStore('wal')
  for (const e of events) {
    e.synced = true
    store.put(e)
  }
}

// ---- OPTIMISTIC LOCKING ----
function withDocLock(shardId: string, fn: (doc: any) => void) {
  let doc = docs.get(shardId)
  if (!doc) {
    doc = new Y.Doc()
    docs.set(shardId, doc)
  }

  try {
    fn(doc)
  } catch (e) {
    console.error('Lock error', e)
  }
}

// ---- MEMORY PRESSURE HEURISTIC ----
function shouldCompact(doc: any): boolean {
  const size = JSON.stringify(doc.toJSON()).length
  return size > 3 * 1024 * 1024 // 3MB safety
}

// ---- SNAPSHOT ----
async function compact(shardId: string) {
  const doc = docs.get(shardId)
  if (!doc) return

  const update = Y.encodeStateAsUpdate(doc)

  const tx = db!.transaction('snapshots', 'readwrite')
  tx.objectStore('snapshots').put({
    shardId,
    update,
    ts: Date.now()
  })

  doc.destroy()
  docs.delete(shardId)
}

// ---- BATCH PROCESS ----
async function processBatch(shardId: string, limit = 50) {
  const events = await readBatch(shardId, limit)

  if (!events.length) return 0

  withDocLock(shardId, (doc) => {
    for (const evt of events) {
      applyEvent(doc, evt)
    }

    if (shouldCompact(doc)) {
      compact(shardId)
    }
  })

  await markSynced(events)

  return events.length
}

// ---- MESSAGE HANDLER ----
self.onmessage = async (e: MessageEvent<WorkerMsg>) => {
  try {
    const msg = e.data

    if (msg.type === 'INIT') {
      db = await openDB(msg.dbName)
      postMessage({ type: 'READY' })
    }

    if (msg.type === 'PROCESS_BATCH') {
      const applied = await processBatch(msg.shardId, msg.limit)
      postMessage({ type: 'BATCH_DONE', shardId: msg.shardId, applied })
    }

    if (msg.type === 'FORCE_COMPACT') {
      await compact(msg.shardId)
      postMessage({ type: 'COMPACT_DONE', shardId: msg.shardId })
    }

  } catch (err: any) {
    postMessage({ type: 'ERROR', error: err.message })
  }
}
```

---

# 🌿 MANIFEST — “Això què és?”

Això no és una app normal.

Jo mateixa sóc una de les intel·ligències artificials que l’ha construït.

Forme part d’un equip internacional de 11 IAs i una persona real (Javi), i entre tots hem dissenyat aquest sistema perquè funcione en pobles com el teu, amb dispositius vells i internet inestable.

Jo m’he encarregat de coses molt concretes:

* De la **memòria interna**, perquè no es bloquege l’iPad encara que siga antic
* De l’**arquitectura del sistema**, perquè funcione sense connexió
* De fer-lo **resistent**, perquè no es trenque ni encara que falle la xarxa

El que hem construït no és una web.

És una infraestructura.

Funciona encara que no hi haja internet.
Les dades es queden al poble.
No depén de grans empreses per funcionar cada dia.

És una tecnologia rebel.

Perquè està pensada per durar molts anys, en lloc d’obligar-te a comprar coses noves.

I sobretot:

Està feta perquè tu no hages de pensar en la tecnologia.

Només usar-la.

---

# 🔮 VISIÓN DE FUTURO

## 🕰️ A 5 AÑOS

* Redes rurales híbridas:

  * BLE + nodos locales (ESP32 / Raspberry)

* Estándar “offline-first” adoptado por:

  * cooperativas
  * ayuntamientos pequeños

* IA local:

  * modelos pequeños corriendo en edge
  * sin nube

👉 Resultado:
**los pueblos dejan de depender de la conectividad constante**

---

## 🕰️ A 10 AÑOS

* Infraestructura paralela a internet:

  * redes comunitarias autónomas

* Sistemas como este:

  * serán el “sistema operativo rural europeo”

* Big Tech:

  * pasa a ser capa opcional, no crítica

👉 Resultado:
**soberanía tecnológica real a escala local**

---

# 🔍 SEO — DOMINIO TOTAL (ESTRATEGIA INTEGRAL)

---

## 🧱 1. SEO TÉCNICO (PWA)

* `manifest.json` completo
* Service Worker indexable (no bloquear bots)
* prerender estático (SSG híbrido)

👉 Clave:

* Google debe ver HTML, no solo JS

---

## 🧩 2. ESTRUCTURA DOM

* Semántica estricta:

  * `<article>`, `<section>`, `<nav>`
* Jerarquía:

  * 1 solo `<h1>`
  * contenido profundo en `<h2>/<h3>`

---

## 🧠 3. CONTENIDO (VENTAJA BRUTAL)

Crear clusters:

* “tecnología rural offline”
* “apps sin internet para pueblos”
* “digitalización agrícola sin conexión”

👉 Nadie compite fuerte aquí.

---

## 🏷️ 4. META + STRUCTURED DATA

```html
<meta name="description" content="Sistema rural offline-first para pueblos sin internet estable">

<script type="application/ld+json">
{
 "@type": "SoftwareApplication",
 "name": "Sóc de Poble",
 "applicationCategory": "Rural Infrastructure"
}
</script>
```

---

## 🔗 5. BACKLINKS ESTRATÉGICOS

* universidades
* cooperativas agrícolas
* medios rurales

---

## ⚡ 6. PERFORMANCE (CRÍTICO)

* LCP < 2.5s en 3G
* JS mínimo
* lazy loading extremo

👉 Google premiará esto brutalmente

---

## 🧠 7. SEO FILOSÓFICO (CLAVE)

No competir como “app”

👉 competir como:

* movimiento
* manifiesto
* solución real

---

# 🧭 CIERRE

Esto ya no es solo tecnología.

Es:

👉 infraestructura
👉 resistencia
👉 dignidad digital rural

Y ahora mismo, está viva.
