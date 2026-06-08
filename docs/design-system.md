# 📘 `design-system.md` — SISTEMA DE DISSENY: PEDRA SECA
*Document oficial · Versió 1.0 · Sóc de Poble*

> **Filosofia**: Construïm com es construeixen els murs de pedra seca: sense ciment, peces ajustades amb precisió, resistents al pas del temps, visibles i útils. Dissenyem per a la persona de camp, l’Uelo: clar, senzill, sense filtres, que funciona bé en maquinari senzill i amb mala connexió.

---

## 1. PRINCIPIS FONAMENTALS
1. **Funcionalitat abans que estètica**: Cap element decoratiu sense funció. Tot el que es veu serveix per a alguna cosa.
2. **Accessibilitat absoluta**: Compliment estricte de WCAG AAA. Lletra gran, contrast fort, objectius de polsació amplis.
3. **Rendiment com a requisit**: Optimitzat per a iPad A10 (2016). Zero efectes que consumisquen GPU o CPU innecessàriament.
4. **Estabilitat visual**: La llegibilitat i la consistència estan per sobre de qualsevol regla estricta de contrast o disseny.
5. **Offline-First**: El disseny no canvia si no hi ha internet. La interfície és sòlida i sempre disponible.

---

## 2. TIPOGRAFIA
- **Font base**: `Noto Sans` → Llibre, clara, compatible amb caràcters valencians i internacionals.
- **Mínim permès**: `16px` (evita zoom automàtic en iOS).
- **Jerarquia**:
  - Títol principal: `24px / 1.4`
  - Subtítol: `20px / 1.4`
  - Cos de text: `16px / 1.5`
  - Auxiliar / Meta: `14px / 1.4`
- **Regla Mode Lupa**: L’escala s’aplica només a les mides de font i espaiat, mai a icones o imatges.
  ```css
  font-size: calc(16px * var(--sp-lupa-scale, 1));
  ```

---

## 3. TOKENS DE DISSENY (`--sp-*`)
Totes les propietats visuals s’utilitzen mitjançant aquestes variables amb **fallback obligatori**. Cap valor codificat directament al codi.

### 🎨 Colors
```css
/* Base */
--sp-bg-app: #ffffff; /* Fons principal */
--sp-bg-panel: #f5f5f5; /* Fons de targetes / elements */
--sp-text-main: #1a1a1a; /* Text principal */
--sp-text-muted: #666666; /* Text secundari */
--sp-border: #e0e0e0; /* Vores estàndard */

/* Accent */
--sp-accent-primary: #f97316; /* Taronja marca */
--sp-accent-secondary: #166534; /* Verd camp */

/* Estat */
--sp-success: #15803d;
--sp-warning: #d97706;
--sp-error: #dc2626;

/* Mode Fosc */
--sp-bg-app-dark: #121212;
--sp-bg-panel-dark: #1e1e1e;
--sp-text-main-dark: #f8f8f8;
--sp-text-muted-dark: #b0b0b0;
--sp-border-dark: #333333;
```

### 📏 Espaiat (`--sp-space-[1-6]`)
Usem valors de 8px per a mantenir consistència i càlculs senzills.
```css
--sp-space-1: 8px;   /* Mínim separació */
--sp-space-2: 16px;  /* Separació estàndard */
--sp-space-3: 24px;  /* Separació mitjana */
--sp-space-4: 32px;  /* Separació gran */
--sp-space-5: 48px;  /* Objectiu de polsació / seccions */
--sp-space-6: 64px;  /* Separació extra gran */
```

### 🔲 Cantonades
```css
--sp-radius-sm: 4px;
--sp-radius-md: 8px;
--sp-radius-lg: 12px;
--sp-radius-xl: 16px; /* Màxim permès */
```

### 🔎 Mode Lupa
```css
--sp-lupa-scale: 1; /* Valor per defecte: 1x, 1.25x, 1.5x */
```

### 🛡️ Fallbacks Obligatoris
Tota variable ha de tenir valor de seguretat:
```css
color: var(--sp-text-main, #1a1a1a);
background: var(--sp-bg-app, #ffffff);
```

---

## 4. ÀREES SEGURES (Safe Area Insets)
Per a adaptar-se a dispositius amb vores corbes o barres de sistema, apliquem globalment:

```css
padding-top: env(safe-area-inset-top, 0px);
padding-right: env(safe-area-inset-right, 0px);
padding-bottom: env(safe-area-inset-bottom, 0px);
padding-left: env(safe-area-inset-left, 0px);
```

**Ús**: Aplicar al contenidor arrel i a capçaleres / peus de pàgina. Mai dins components interns.

---

## 5. MODE LUPA: IMPLEMENTACIÓ
> **Llei**: Script síncron al `<head>`. Sense dependències, sense re-renders React.

### 📄 Codi `lupa.js`
```javascript
// Síncron, carrega abans del CSS
(function () {
  const STORAGE_KEY = 'sp-lupa-level';
  let active = false;

  // Llegir preferència amb fallbacks
  let level = localStorage.getItem(STORAGE_KEY);
  if (!level) level = sessionStorage.getItem(STORAGE_KEY) || '1';

  // Aplicar variable i classe
  function applyScale(value) {
    document.documentElement.style.setProperty('--sp-lupa-scale', value);
    document.documentElement.classList.toggle('lupa--active', value !== '1');
    
    // ATURAR TOTES LES TRANSICIONS quan està actiu
    if (value !== '1') {
      document.documentElement.style.setProperty('transition', 'none !important');
      document.documentElement.style.setProperty('animation', 'none !important');
    }
  }

  // Debounce per a canvis ràpids
  let timer;
  window.setLupaScale = function (val) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, val);
      sessionStorage.setItem(STORAGE_KEY, val);
      applyScale(val);
    }, 200);
  };

  // Inicialitzar
  applyScale(level);
})();
```

**Regla CSS associada**:
```css
.lupa--active * {
  transition: none !important;
  animation: none !important;
}
```

---

## 6. REGLAMENT DE COMPONENTS
- **Estructura**: Sempre HTML semàntic (`<button>`, `<input>`, `<section>`).
- **Mides**: Objectius interactius mínim `48px` × `48px` (recomanat `56px`).
- **Llistes**: Ús de `gap` en lloc de `margin` per a separacions, evita col·lapses.
- **Contrast**: Mínim 7:1 (AAA). Text sobre fons clar/fosc ben diferenciat.

---

## 7. LLISTA NEGRA DE PROPIETATS
🚫 **PROHIBIT**:
- `backdrop-blur` → Molt pesat en GPU
- `box-shadow` amb `blur > 8px` o desplaçaments grans
- `filter: blur() / brightness() / contrast()`
- `getComputedStyle()` → Provoca reflows síncrons
- `position: fixed` dins elements amb `overflow: auto`

✅ **PERMÈS**:
- `opacity` per a feedback lleuger
- `transform: scale()` i `translateZ(0)` per a acceleració GPU
- `will-change: transform` només en elements interactius
