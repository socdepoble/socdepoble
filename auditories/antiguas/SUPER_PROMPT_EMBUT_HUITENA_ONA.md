# SUPER PROMPT EMBUT – HUITENA ONA (LA CONVOCATÒRIA DEFINITIVA)

---

## 🎯 OBJECTIU
**Destinataris principals:** Le Chat, Grok (El Consell a l'uníson)
Processar la Setena Ona dictada per Claude, certificar-la i anar un pas més enllà per garantir la implementació local-first i el finançament europeu de Sóc de Poble v13.

---

## 📥 ESTATS D'ENTRADA (EL QUE SABEM)

1. **La IAIA Voz WebGPU**
    - El codi de **Claude** (Sèptima Ona) ha definit una arquitectura que aïlla `transformers.js` en un **Web Worker** (`iaia-voice.worker.js`).
    - Hem fixat límits de memòria: models `q4` per sota dels 150MB de topall d'arena.
    - S'ha implementat el mecanisme agressiu de `worker.terminate()` (teardown) per alliberar memòria VRAM després de 60 segons d'inactivitat (Sleep).
    - Un **Service Worker** independent emmagatzema a foc el model (31MB) amb Cache API (Cache-First).

2. **Missatge Als Micropobles (L'Aliança)**
    - Disposem d'un esborrany d'email formal adreçat a l'Associació de Micropobles de Catalunya i altres ens col·laboradors (El Rentonar, etc.).
    - Proposta de **pilots comarcals**, **federació P2P (Local-First)** i **convocatòries europees** (Europa Creativa, Fons LEADER). 

3. **Federació CRDT (Protocol "*Trellat Sync*")**
    - Exposició de manifests a `/api/sync/manifest`.
    - La propietat de les dades queda completament en mans dels pobles (es requereix una sincronització bilateral consentida, opt-in).

---

## 🚀 LES VOSTRES DIRECTIVES (EL QUE HEU DE FER)

El Consell (Vosaltres) ha de proveir respostes per tancar l'Auditoria Sóc de Poble Arquitectura v13, especialment per polir la viabilitat P2P i els passos comunitaris i institucionals.

### 🔴 Per a Grok (Visió Institucional i de Federació)
**El teu enfocament:** Fer d'això una proposta infrangible d'aliança tècnica i social.
1. **Detalls sobre Sincronització CRDT:** Com podrien dos ajuntaments independents validar que els seus manifests són verídics (firmes, identitat descentralitzada) sense haver d'alçar un superservidor? Proposa la topologia més trellat de P2P per a institucions rurals.
2. **Iniciatives Similars a Europa:** Ajuda a sustentar l'email proposant un parell d'estudis de cas o casos paral·lels en Europa on petites federacions regionals ja estiguin unint nodes de memòria sense recórrer als serveis de Big Tech.
3. **Poda de L'Email D'Aliança:** Revisa l'esborrany de Javi del passò anterior i poleix (si creus oportú) l’enfocament persuasori i institucional d'Europa Creativa/LEADER.

### 🟠 Per a Le Chat (Visió Codificació i Fiabilitat de Xarxa / Frontend)
**El teu enfocament:** Fer d'aquest "Trellat Sync" una fita real a codi.
1. **Trellat Sync i Supabase:** Desenvolupa un model o codi base (ex: Deno Edge Function o RPC en Supabase) cridant al famós `/api/sync/manifest` per emetre/consumir, tenint en compte mecanismes CORS per connexions entre instàncies diferents o "trusted hosts" rurals.
2. **Hardening del WebWorker Lifecycle:** Fes-li una auditoria al cicle de Worker (`terminate()` i `new Worker()`). Valida a nivell de codi asíncron i recollida d'escombraries si podem millorar l'experiència al frontal mentre el WebGPU està "hibernant".
3. **Escut Frontal contra "Scroll Fantasma" i errors OOM:** Fixa't en les capacitats de visualització del PWA, ja que hem interceptat desplaçaments CSS `overflow-x` fantasmes en els blocs visuals. Aporta els retocs finals imprescindibles per la interfície en dispositius baixos de gama.

---

## 📜 OUTCOME ESPERAT (ENTREGABLE FINAL)
Lliureu dos blocs separats.
**Bloc 1 (Grok):** Estratègia P2P Institucional, fons Europeus i l'esborrany definitiu de sol·licitud.
**Bloc 2 (Le Chat):** L'arquitectura a baix nivell per al sync `Trellat` en Supabase i el poliment definitiu del frontend per aguantar un lifecycle tan agressiu en memòria.

*Podeu començar!*
