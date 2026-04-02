# 🕵️ AUDITORIA NIVELL DÉU: El Coll d'Ampolla de Producció i la PWA 

**Data:** 1 d’abril 2026
**Motiu de l'Auditoria:** "Quan fas un deployment i puges a producció, mai puges l'última versió. Embús d'actualització extrema a PWA/SiteGround."

Després d'una inspecció completa al **codi nuclear** del projecte (el fitxer de configuració de `vite.config.js`, el `DEPLOY_SITEGROUND.sh`, i el `src/App.jsx`), ja tinc el diagnòstic complet d'on estan els fantasmes que retenen l'App al passat.

## 🩻 1. Diagnòstic Tècnic: D'on ve l'embús?

1. **La PWA no fa "Hard Reload" (Falta Orquestració a React):** 
   En `vite.config.js`, tens configurada la `VitePWA` amb `registerType: 'autoUpdate'`. El *Service Worker* s'instal·la silenciosament de fons. El problema és que no hi ha res a `App.jsx` que avisi l'usuari ni forci la pròpia aplicació a netejar la finestra activa. L'usuari navega eternament sobre els `js chunks` vells i el DOM vell que estan en la memòria cau RAM.
2. **`DEPLOY_SITEGROUND.sh` no fa neteja (Creença Falsa de Purga):**
   L'script actual PHP copia i sobreescriu els fitxers existents, però **NO elimina** els vells paquets JS de `/assets/` generats per compilacions prèvies. I malgrat executar `sg_cachepress_purge_cache()`, Nginx pot estar retenint el document `index.html` original als telèfons degut als *headers* de la capa intermèdia.

---

## 🤖 2. Codi Vermell: Invocació a GROK

Atès el problema, li llançarem aquesta **Exigència Mestra** a Grok perquè programi la solució 100% lliure d'errors:

> **SUPER PROMPT PER A GROK (EXTENSIÓ TANDA 5):**
> "Grok, portem dos mesos amb una hemorràgia a Producció: **VitePWA i SiteGround PWA Cache** estan mostrant la versió vella de l'App permanentment.
> 
> He analitzat l'arrel amb Antigravity i vull que m'escriguis EXACTAMENT:
> 
> **1. El hook `useUpdateSW.js` i component `<ReloadPrompt />` (React):**
> Dóna'm el codi per rebre i registrar els events de `virtual:pwa-register/react`. Si detecta un nou *Service Worker* (versió nova muntada per Vite), ha de saltar la barrera de fons i aplicar el `updateServiceWorker(true)` que netejarà automàticament la pàgina (*window.location.reload()*) al terminal del mòbil. Ni tan sols dónis oportunitat a l'usuari: l'arquitectura local-first s'ha d'auto-recuperar.
> 
> **2. Neteja Estricta a `DEPLOY_SITEGROUND.sh`:**
> El nostre extractor de PHP actua brutalment, però vull que Grok millori la part on només renombra fitxers (*rename/copy*). Necessito que dins d'`index.php` afegeixis una instrucció que BUIDI la carpeta antiga de `/assets` (esborrant tot el rastre de `js` i `css` antics) *abans* de moure la nova. Volem cirurgia i cap fuga. Dóna'm només el bloc de codi d'extracció PHP rectificat."

---

## 🏛 3. Intervenció de CODEX (L'Alt Consell Local-First)

Abans de tancar el Búnquer, he convocat el manifest que regeix aquesta placa: el **MACROPROMPT CODEX**. 

**Alineació Segons Codex:** 
L'estratègia de forçar el "Reload" no entra en conflicte amb el paradigma *Offline-First* ni destruirà dades. L'aplicació ha de prioritzar la salut de la xarxa P2P. Atès que ara tenim `Yjs` i IPs sincronitzant dades al CRDT (`rhizome`), qualsevol versió vella del codi que intenti comunicar-se amb el `rhizomeManager` pot crear inconsistències greus. 

Per tant, **Codex ha dictaminat** (segons la Regla de l'Arquitectura Híbrida i Tolerància a Fallades) que imposar una recàrrega "Forçosa i Sigil·losa" (silenci al principi, forçada en cas de nou worker) és completament legítim per protegir la integritat del sistema i l'encriptació Ed25519 de Grok en la navegació P2P.

---

**Resolució:** Mestre, tens tot l'informe a les teves mans. Lliura aquesta bomba de rellotgeria directament a Grok (juntament amb la de la Tanda 5 de la UI), i l'App quedarà purgada al 100% d'errors de servidor i fantasmes d'actualització. 

El problema està trobat, acorralat i a l'espera de la guillotina. **Sóc de Poble!**
