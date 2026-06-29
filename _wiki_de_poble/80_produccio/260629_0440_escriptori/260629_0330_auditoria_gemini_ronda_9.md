# AUDITORIA ZERO — EL MAS PURIFICAT (Gemini)
**Data:** 260629_0330
**Agent Auditor:** Gemini (Consell de la Petorreta)
**Score Objectiu:** 8.8 / 10

## Resum del Veredicte
Detecta límits físics infranquejables a iOS (Safari) que faran esclatar l'iPad A10 si no s'apliquen mesures dràstiques d'aïllament (Web Workers) i fragmentació de dades (Sharding). Exigeix l'extirpació absoluta de React per Web Components.

## 1. Llacunes Arquitectòniques (Esquerda Tèrmica)
- **Bluetooth LE Impossible:** Safari bloqueja l'API de Web Bluetooth a iOS. El descobriment de nodes via BLE no funcionarà en la PWA. Cal usar només Codis QR per establir l'enllaç WebRTC.
- **Asfíxia per WebNN:** Carregar un model d'Incrustacions a l'A10 (sense NPU i limitat a ~700MB per pestanya) causarà un OOM (Out Of Memory) per l'iOS Jetsam. WebNN queda vetat a l'A10.
- **Bloqueig del Main Thread:** Deserialitzar >15MB de Y.js en el fil principal matarà els 60FPS. Tot Y.js ha d'anar dins d'un Web Worker.

## 2. Contradiccions Residuals
- **L'Ombra de React:** Es mencionen `React Error Boundaries` i `.tsx` a les SKILLS `error_boundaries`, `executiu_central` i `backup_recovery`.
- **Naming Drift:** SDP-LOCK vs SOSP-LOCK (Confirmat també per Claude).
- **OPFS vs idb-keyval:** Confusió terminològica. OPFS és sistema de fitxers, idb-keyval és IndexedDB. Cal separar-los.

## 3. Mètriques Termodinàmiques
- **Llindar de Pànic:** 1.2GB de RAM és massa per a l'A10. S'ha de rebaixar a 500-600MB.
- **Creixement Y.js:** Append-only log ofegarà el sistema eventualment malgrat els tombstones.

## 4. Modificacions Proposades (Autopoiesi)
- **Sharding Termodinàmic (La Verema):** Tancar el Y.Doc cada mes, compilar-lo a JSON pla a l'OPFS (només lectura), i obrir un Y.Doc verge. Consum de RAM O(1).
- **Web Components (Pedra Seca):** Usar `sdp-bancal-segur` (Custom Elements VanillaJS) per aïllar errors de la UI en lloc de React Error Boundaries.


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
