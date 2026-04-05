# CONTEXT GLOBAL I DIRECTIVES - MESA REDONDA V14.4: "EL BANCAL DIGITAL"

Molt bé, Alt Consell. La Fase 14.3 s'ha integrat espectacularment. Heu demostrat que la Genètica del Codi de "Sóc de Poble" és capaç de replicar-se socialment a través de tota l'arquitectura.

L'ecosistema ja té asimilats:
1. `useIAIANavigation` (100% accessible).
2. `useRuralDraft` (Offline-first total).
3. `p2pSync` i `EnhancedFeed` amb senyals tàctics per a Malla Visual.
4. L'Índex "Puresa Cristal·lina" a través d'`id` i ARIA.

El Mestre demana que alcem les mires cap a l'arquitectura de memòria profunda i resistent per culminar el funcionament descentralitzat de V14. Entrem a la **Fase 14.4: El Bancal Digital**. 

---

## 🔴 DIRECTIVA "TRELLAT" (Condicions Inquebrantables)
- Seguim operant sota els preceptes d'aïllament del xip A10: sense bloquejos del *Main Thread*, prefetch efímer i estils GPU natius.

## 📋 REPARTIMENT EXACTE DE FUNCIONS (FASE 14.4)

### 1️⃣ CHATGPT: EL MODO BANCAL (Compactació de Posts)
*   **Objectiu:** Alliberar la RAM quan un veí llig desenes i desenes de notícies o xarrades.
*   **Funció Sol·licitada:** Necessitem evolucionar l'`EnhancedFeed` (o crear un component d'envolcall `BancalWrapper`) que compacte el DOM històric. Quan un post estiga massa lluny cap amunt (> 30 elements), s'ha de reduir a la seua mínima expressió en memòria i en el DOM, potser fins i tot guardant l'estat en IndexedDB i mostrant només la mètrica d'espai. Genera la solució Trellat.

### 2️⃣ GEMINI: EL BATEIG AMB USUARIS REALS (Entorn Sense Cobertura)
*   **Objectiu:** Auditoria extrema de desconnexió.
*   **Funció Sol·licitada:** Traça un mapa de proves unitari (o un procediment de validació React amb `navigator.onLine`) dissenyat específicament perquè un humà comprove el funcionament de resiliència rural del `useRuralDraft`. Què passa si s'apaga la pestanya a meitat de procés? Dissenya el tallafocs final.

### 3️⃣ PERPLEXITY: VALIDACIÓ DEL P2P A MÚLTIPLES RUTES (Towns i Marketplace)
*   **Objectiu:** Expansió simètrica.
*   **Funció Sol·licitada:** El CRDT implementat a `useP2PSync` és net i precís per al *Feed*. Ara indica com ho aïllem a un context global per inyectar-ho i consumir-lo tant a `Marketplace` com a `Towns.jsx` sense duplicar connexions de websocket. Genera el *Provider* rústic definitiu.

### 4️⃣ MISTRAL: LA CIRERETA D'EMPATIA I RUTES MORTES
*   **Objectiu:** La sensació "offline".
*   **Funció Sol·licitada:** Pensa exactament quin component mostra el projecte si, obrint en fred (sense IndexedDB previ en una ruta estranya), dóna 404 o no hi ha memòria disponible a la ràdio mesh. Mostra un component `ErrorBoundary` rural d'alt trellat per tranquil·litzar el veí de poble i permetre-li invocar `useUndoText` cap enrere.

---
**Alt Consell, pugeu de revolucions Sóc de Poble aplegant al cim del Bancal Digital. Doneu les vostres solucions!**
