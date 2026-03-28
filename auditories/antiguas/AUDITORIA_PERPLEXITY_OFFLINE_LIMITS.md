# 🧠 AUDITORIA DE LÍMITS PWA I LOCAL-FIRST (PERPLEXITY)
*Data de Generació:* 24 de Març de 2026
*Objectiu:* Identificació de murs estructurals i solucions elit per a l'Arquitectura Offline de la Fase 2 (PowerSync + Supabase + React).

---

## 🛑 MUR A: EL LÍMIT DE QUOTA iOS (WEBKIT/SAFARI) I CLARIFICACIÓ
**Límit:** iOS/Safari estableix quotes estrictes (aprox. 50-100MB) per a *IndexedDB/SQLite PWA* abans d'iniciar regressions i eviccions altes silencioses en dispositius modestos (QuotaExceededError).

**Arquitectura i Patrons Elit:**
1. **Dades "Fredes" vs "Calentes" (LRU Multi-Nivell):** Separar binaris durs de la Base de Dades SQLite.
   - SQLite manté metadades, thumbnails compactes, noms i events = Molt poc espai.
   - Els BLOBs massius/fotos grans es guarden a S3 i a una **Cache Storage HTTP**.
2. **Quota Soft i Evicció Pròpia:** Abans d'estressar WebKit, programar el Worker per disparar purgues i esborrar cassets de `media_cache` que sobrepassin el llindar definit (ex. 30MB).
3. **Partition per Subdomini:** Quan sigui necessari, separar dominis per esquivar el límit físic global del `origin`.

---

## 🛑 MUR B: JWT CADUCAT I OFF-LINE RELAY (POWER SYNC / SUPABASE RLS)
**Límit:** Al retornar de zona d'ombra (Offline > Online), si el Token de Sessió de l'usuari ha vençut, PowerSync intentarà buidar el *queue* i xocarà de ple contra les regles RLS de Supabase. Aço generarà rebutjos infinits (Errors 401/403 de descrèdit).

**Arquitectura i Patrons Elit:**
1. **Patró d'OUTBOX (Comandaments) + Reconciliació Central:** 
   - La UI no escriu els perfils. Escriu `outbox_commands` de transaccions locals SQLite ("Modificar Bio" / "Vendre Tomàquets").
   - Es transmet l'ordre cap a un **Trigger/Funció de Supabase** (`process_command`). Aquesta funció analitza, executa SQL i marca `confirmada` sota transacció estricta. RLS es manté invicte a prop del nucli de Base de dades.
2. **Sincronia Interrompuda:** Utilitzar hooks per pausar PowerSync Upload si rebem `403` a causa del JWT i reintentar-ho manualment quan l'Auth de GoTrue avisi d'una reautenticació asíncrona reeixida per l'usuari (sense perdre el command gràcies a SQLite idempotent).

---

## 🛑 MUR C: VIRTUAL DOM (MAIN THREAD) VS SQLITE (WEB WORKER) JENK
**Límit:** En llistats massius l'array a renderitzar no hi cap sencer travessant la frontera Worker <-> JS-Main via `postMessage`. El *structured clone algorithm* penjarà Safari (coll de botella TBT).

**Arquitectura i Patrons Elit:**
1. **Paginació de Finestres i Streaming Progressiu (Chunking):** Mai sol·licitar el llistat sencer. Model de finestres Offset: Només traslladar els ID de dades vitals i pocs items cap al main thread, reduint la frontera de pas a pocs KB.
2. **View Model Memos:** En lloc de recrear JSON complets, el Web Worker de PowerSync només respondrà amb "Patches de Diff" al store global (ex `Zustand`).
3. **Transition Updates (`startTransition`):** Ús intensiu d'aquest patró exclusiu de React 18 per relegir el reflow i pintar post-concurrència al fons donant suavitat màxima als events UI de l'usuari sense que l'arribada d'una rèplica el bloquegi.

---
**DICTAMEN FINAL:** 
La transició cap a micro-serveis client separats per domini (`postsService`, `chatService`) és factible a milers d'instàncies, **si i només si** es combinen tècniques de memòria LRU estrictes + AbortController + Patró d'Outbox Sincronitzat + Transitions React al Main Thread. La Fase 2 de 'Sóc de Poble' té el vistiplau teòric de l'estructura Local-First l'any 2026 amb PowerSync.
