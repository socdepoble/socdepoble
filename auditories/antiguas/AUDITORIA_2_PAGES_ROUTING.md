# 🔍 AUDITORIA EXTREMA FASE 2 - REPORTE QWEN (PAGES, ROUTING, CSS, BOOTSTRAP)

## 🚨 PROBLEMA SISTÈMIC CRÍTIC (AFECTA L'ARRENCADE)

### **1. BUCLE DE VERSIÓ EN `entry.jsx` (Risc de Brick)**
**Fitxer:** `src/entry.jsx`
**Problema:** S'està sobreescrivint la versió en `localStorage` independentment de si el fitxer nou realment s'ha carregat o no, causant de vegades un "fals OK" en versions estancades pel Service Worker. S'ha de protegir amb el timeout i evitar guardar la versió si s'està saltant per recàrrega recent.

---

## 📁 PROBLEMES PER FITXER

### **2. src/index.css (Tailwind v4 vs CSS Legacy)**
1. Migrar variables `:root` a `@theme` de Tailwind v4.
2. Substituir media queries innecessàries per classes estructurals de Tailwind (ex. `md:`).

### **3. src/App.jsx (ErrorBoundary Absent)**
S'importa però no s'usa. Quan una pàgina falla (ex: Mapes), tota l'App cau i es queda en blanc en lloc de mostrar l'error. Cal embolcallar el layout bàsic.

### **4. src/pages/Map.jsx (Fuites de Memòria i Optimització Leaflet)**
1. Les llistes de markers no estan `useMemo`-itzades causant esgotament en pintar el mapa amb molts missatges CRDT.
2. `useMapEvents` pot deixar "event listeners" penjant si el DOM es desmunta de cop.

### **5. src/pages/Register.jsx (Stale Closure en WebOTP)**
El teclat SMS no està usant de forma totalment síncrona/segura l'`AbortController`, provocant problemes en mode ràpid "step verify". S'han d'arreglar les dependències d'`useEffect`.

### **6. src/pages/ProfileView.jsx (Fetch Render Loop)**
L'efecte principal té massa dependències (id, username, isOwnProfile, currentUser...). Qualsevol canvi en qualsevol context dispara de nou la descàrrega. Reduir només a `id, username`.

### **7. src/pages/Towns.jsx (Render calc window.innerWidth)**
S'està usant JavaScript (`window.innerWidth`) localment per calcular el nombre de columnes i es fan `setColumnCount` disparats pel `resize`, la qual cosa fa mal a l'arbre CRDT/React en dispositius mòbils fluïds. Ha de passar a CSS Grid natiu.

### **8. vite.config.js (Exclusió pre-bundling)**
Com hem exclòs components WASM pesats per Rizhoma (molt bé!), `vite` està trigant temps massiu a arrancar en dev per altres llibreries. Afegir a `optimizeDeps.include` explícitament: `react-router-dom, lucide-react, axios`.

### **9. index.html (FOUC localStorage bloquejat)**
Quan el PWA ix de mode incògnit, pot crashejar completament en llegir `localStorage.getItem` des de l'HTML abans que React prenga el control. Cal afegir un `try/catch`.
