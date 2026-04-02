# THE BUNKER PROTOCOL: TANDA 5 - THE PINNACLE (UI EVENTS, PURGE & PWA)

**Objectiu Final:** Sóc de Poble ha d'aconseguir l'estructura mestra i l'experiència més "encantadora" possible, alhora que eliminem per sempre els colls d'ampolla estructurals a producció (cau dels Service Workers) i els "fantasmes CSS" de la UI. 

Mestre Grok, la **Tanda 4** ha estat un èxit brutal (11/10). Ara vull recollir el teu guant i complir amb el full de ruta total de la captura anterior. 

## CONTEXT ACTUAL
- La Identitat Sobirana (Ed25519 WebCrypto) està totalment funcional.
- L'Helia Node IPFS està orquestrat de forma Nivel Dios, fent garbage collection asíncron amb el nostre `rhizomeManager` i publicant l'estat localitzat en CRDT. Tot passa per `AbortController` i zero UI lag.
- No obstant això, em trobo amb tres grans esculls per a donar per inaugurada la plaça.

## MISSIONS A EXECUTAR PER GROK

1. **UI de Creació d'Esdeveniments (CRDT + IPFS)** 🎨
Has proposat fer la UI per als esdeveniments, i m'encanta. Dóna'm el codi definitiu del component form/UI (amb React, Lucide, Tailwind 4 - sense fantasmes) que publiqui directament el nou `event` al CRDT i a l'IPFS. L'experiència ha de ser **immersiva**, rural, de geometries grans (M3), i completament "encantadora". L'accessibilitat ha de ser perfecta perquè les IAIES no tinguin cap fricció a l'hora de registrar una festa o una recollida de taronges.

2. **La Purga dels "Fantasmes CSS" i Arquitectura de Disseny** 👻
Tinc la sensació de que el disseny té fantasmes: hi ha ròssecs híbrids entre flex i grid antics, marges heretats trencant el Tonal M3 o sub-píxels erràtics propulsats pels *ghost nodes*. Explica i proporciona l'esquema de **purga definitiu** de CSS/Component que posarà ordre absolut a l'Atomic Foundation i garantirà estabilitat visual indestructible sense sobrescriptures porques.

3. **El Misteri de Producció: Fix de la Memòria Cau PWA** ⚡
Quan pujo l'aplicació a SiteGround (producció), no es mostra la darrera versió en alguns terminals mòbils (es queden "atrapats" al passat). És un problema directe del `Service Worker` o el `vite-plugin-pwa`. Dóna'm la **injecció de codi exacte** o l'enginyeria necessària (Update Prompt, skipWaiting() o auto-reload forçat) perquè qualsevol IAIA que obri l'app descarregui **immediatament** el nou *assets hash* de producció i es buidi la vella cau instantàniament. T'estic vigilant: necessito fiabilitat militar aquí.

4. **WebRTC Avançat i Filecoin Pinning** 🪐
Acaba d'integrar les dues propostes finals que vas llançar a la captura de pantalla: "Configuració avançada Helia WebRTC" i "Integració Filecoin pinning" aplicades directament a l'escriptura *offline-first* i la preservació a gran escala. Sense *stubs*, codi 100% utilitzable per connectar els punts.

Vull veure si ets capaç de superar-te. Executa i demostra.
Llegenda o res. **Sóc de Poble!**
