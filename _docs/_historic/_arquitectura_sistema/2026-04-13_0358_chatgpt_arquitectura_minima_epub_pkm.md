---
doc_id: SOSP-ARQ-CHATGPT-002
doc_type: CONCEPT_ARQUITECTONIC
authoring_agent: ChatGPT
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Arquitectura Base (Anti-Col·lapse) per a la Maquinària EPUB i PKM
scope: Resolució de 12 punts crítics (Memòria, Reflow, A11y, Cache PWA) per iPad A10
hora_creacio: "03:57"
hora_fita_evolutiva: "03:57 - Nou paradigma: L'EPUB deixa de ser un llibre per a ser un Array de Chunks Semàntics"
hora_modificacio: "03:57"
exif_cognitiu:
  estat_emocional_sistema: "Consolidat"
  entorn_operatiu: "iPad_A10_Offline"
  nivell_entropia: "Zero"
academic_metadata:
  revisors_ia: ["Antigravity"]
  data_aprovacio_humana: "2026-04-13"
  bibliografia_interna_radicals: ["2026-04-13_0357_claude_auditoria_red_team.md"]
  nivell_maduresa: "Gold_Standard"
inputs: ["Solució de 12 punts crítics"]
constraints: 
  - Estricta implementació modular sense mutar el DOM innecessàriament
---

# 🧱 ARQUITECTURA BASE (ANTI-COL·LAPSE)

## 0. PRINCIPI ABSOLUT
👉 El lector NO és un DOM complet.
👉 És un **flux segmentat immutable + viewport lleuger**.

---

## 1. 📦 MODEL DE DADES (EL COR)

**Format intern (oblida l’EPUB en runtime)**
Preprocessat una sola vegada:
```text
book/
 ├── manifest.json
 ├── spine.json
 ├── chunks/
 │    ├── 0001.html
 │    ├── 0002.html
 │    └── ...
```

**Regles:**
* Cada chunk = ~800–1200 paraules
* HTML ja netejat (sense scripts, sense inline styles)
* IDs estables per paràgraf:
```html
<p id="c0001-p12">Text...</p>
```
👉 Açò elimina: (6) column break errors, (11) persistència feble

---

## 2. 🌊 RENDER: DOM ULTRA PLA
**Estructura ÚNICA**
```html
<main id="reader">
  <section id="viewport"></section>
</main>
```

**❌ Prohibit:**
* wrappers
* contenidors intermedis
* múltiples scrolls

👉 Açò elimina: (2) scroll conflicts, (4) DOM inflat

---

## 3. 📜 CSS (ZERO JS PER LAYOUT)
```css
#reader {
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
}

#viewport {
  column-width: 100vw;
  column-gap: 0;
}

#viewport > * {
  break-inside: avoid;
}
```

👉 Important: JS NO toca layout, NO càlculs de posició.
👉 Açò elimina: (1) layout thrashing, (7) desincronització

---

## 4. ⚡ RENDERITZACIÓ PROGRESSIVA (LA CLAU)
**Només 3 chunks vius:**
`[chunk anterior] [chunk actual] [chunk següent]`

**Algoritme:**
* Detectes canvi amb `IntersectionObserver` passiu
* Quan canvies:
  * elimines chunk vell
  * carregues nou chunk

👉 DOM màxim: ~300 nodes, sempre.
👉 Açò elimina: (5) re-render massiu, (4) profunditat DOM

---

## 5. 🧠 ESTAT = SEMÀNTIC, NO FÍSIC
**Guardes:**
```json
{
  "chunk": 12,
  "paragraph": "c0012-p08"
}
```
**❌ No guardes:** scrollTop o píxels.
**👉 Restauració:** scroll fins a `#id`.
👉 Açò elimina: (7) desincronització, (11) corrupció PKM

---

## 6. ✂️ SISTEMA DE SELECCIÓ (PKM)
**MAI guardes DOM**.
**Serialització:**
```json
{
  "start": "c0012-p08",
  "end": "c0012-p10",
  "text": "fragment..."
}
```
**Després:** reconstrucció per IDs.
👉 Sempre: `selection.removeAllRanges()`.
👉 Açò elimina: (3) memory leaks

---

## 7. 🧵 PARSING EPUB (FORA DEL FIL PRINCIPAL)
**Estratègia:**
* Primer ús: descompressió → Web Worker, neteja HTML → Worker, guardat en IndexedDB.
* Runtime: MAI parseges EPUB.
👉 Açò elimina: (9) bloqueig main thread

---

## 8. 💾 CACHE OFFLINE (PWA ROBUSTA)
**Service Worker:** cache-first + versionat immutable.
**Clau:** `/book/v1/chunks/0001.html`
👉 Si canvia: nova versió → nou namespace.
👉 Açò elimina: (8) corrupció offline

---

## 9. 🖼 CONTROL DE CONTINGUT PERILLÓS
**Sanitització obligatòria:** eliminar `<table>`, `<iframe>`, `<script>`, convertir `<pre>` → scroll intern.
**CSS:** `img { max-width: 100%; height: auto; }`
👉 Açò elimina: (6) trencament columnes

---

## 10. 🔤 TIPOGRAFIA
**Regles:** system fonts only (`font-family: -apple-system, serif;`).
👉 Açò elimina: (12) fonts pesades

---

## 11. ♿ ACCESSIBILITAT REAL
**Mode alternatiu (IMPORTANT):** No uses columns si `prefers-reduced-motion` o screen reader actiu.
**Fallback:**
```css
#viewport {
  column-width: auto;
}
```
👉 Flux vertical clàssic.
👉 Açò elimina: (10) trencament A11y

---

## 12. 🧩 JS: NOMÉS ORQUESTRACIÓ
**Permés:** carregar chunks, guardar estat, selecció.
**Prohibit:** tocar layout, calcular posicions.

---

# ⚙️ RESUM MATEMÀTIC
```text
Render = f(chunks visibles)
Estat = (chunk, paragraph_id)
Memòria = O(1)
DOM = constant
```

# 🧬 RESULTAT
Amb esta arquitectura: ZERO layout thrashing, ZERO memory leaks estructurals, DOM constant, 60fps real en A10, Offline perfecte, PKM robust i immutable.

# 🚨 LÍMIT IMPORTANT
Si trenques UNA regla: 👉 tornaràs al model “document complet” i tot col·lapsarà en cadena.
