# 🏡 El Disseny de la Masia: **GEM MODERN**
*El vestit que protegeix l’estructura de Sóc de Poble. Aquí no hi ha adorns: cada pixel té un propòsit.*

---

## 🌾 **Per què dissenyem així? (La Filosofia del Trellat)**
A la Masia, **el disseny no és estètica, és resiliència**.
- **Accessibilitat Extrema (Mode Bancal):** Llegibilitat sota el sol per a iPads vells i dits grossos. Colors d’alt contrast, tipografia Noto Sans (16px mínim), i tap targets de 56px.
- **Robustesa (Pedra Seca):** Elements rectangulars i vores dures, com les pedres que sostenen els bancals.
- **Fluïdesa (Oli Suau):** Radis de 28px per suavitzar l’experiència, però amb estructura sòlida.
- **Sistema Modular (La Masia):** Tot funciona sense internet (Local-First), com el trellat del camp. PWA Offline-First optimitzada per a hardware antic (A10).

> *"El bon disseny és com una eina de llaurador: ha de ser senzilla, resistent i que no falli quan més la necessites."*

---

## 🎨 **El Vestit: Variables i Tokens (El Sistema Nerviós)**
*Tot el que pot canviar, no es grava a la pedra (no es hardcodeja).*

### **🟦 Colors Canònics (La Paleta del Camp)**
| Nom | Token | Valor | Ús | Regla WCAG |
|-----|-------|-------|----|------------|
| **Taronja** | `--sp-orange-100` | `#FF7300` | Botons, accents | Text **negre** (8.5:1) |
| **Blau** | `--sp-blue-100` | `#0984E3` | Enllaços, títols | Text **blanc** (4.8:1) |
| **Negre** | `--sp-black-100` | `#000000` | Text principal | - |
| **Blanc** | `--sp-white-100` | `#FFFFFF` | Fons | - |

### **📏 Espaiat (La Geometria del Trellat)**
*Tot es basa en multiplicadors de **4px** (com les files d’un bancal).*

| Nom | Token | Valor | Ús | Exemple |
|-----|-------|-------|----|---------|
| **Batec** | `--sp-espai-1` | `4px` | Separació mínima | Icona + text en un botó |
| **Pas** | `--sp-espai-2` | `8px` | Elements relacionats | Items en una llista |
| **Carrer** | `--sp-espai-4` | `16px` | Marge global | Padding lateral en mòbil |
| **Plaça** | `--sp-espai-6` | `24px` | Separació entre blocs | Targetes en un grid |
| **Bancal** | `--sp-espai-8` | `32px` | Salt de secció | Títols principals |

### **🔄 Radis (L’Oli Suau de la Masia)**
| Nom | Token | Valor | Ús |
|-----|-------|-------|----|
| **Principal** | `--sp-radius-main` | `28px` | Botons, targetes |
| **Secundari** | `--sp-radius-secondary` | `18px` | Inputs, dropdowns |

---

## 🧱 **L’Esquelet: Components Universals (La Pedra Seca Digital)**
*Cada component és una pedra independent, però totes encaixen perfectament.*

### **📌 Regles d’Or**
1. **No reinventis la roda:** Usa `<UniversalButton>`, `<UniversalCard>`, etc.
2. **Tot hereta del Trellat:** Si un botó ha de ser quadrat, canvia `--sp-radius-main` al Panell de Control.
3. **Zero CSS hardcodejat:** Prohibit `bg-orange-500` o `rounded-3xl`. Sempre usar `--sp-orange-100` o `--sp-radius-main`.

### **📄 Components Clau**
| Component | Descripció | Exemple |
|-----------|-------------|---------|
| `UniversalButton` | Botó parametritzable | `<UniversalButton theme="primary">Enviar</UniversalButton>` |
| `UniversalCard` | Targeta amb ombra i radi adaptable | `<UniversalCard radius="main">...</UniversalCard>` |
| `UniversalInput` | Camp de text amb àrea tàctil de 56px | `<UniversalInput type="text" />` |

---

## 🎭 **Els Estats: El Cicle de Vida del Trellat**
*Cada element té 3 estats, com les estacions de l’any:*

| Estat | Nom | Descripció | Exemple CSS |
|-------|-----|-------------|-------------|
| **Hover** | **Surar** | Eleva l’element sense forçar la CPU | `transform: translateY(-2px);` |
| **Active** | **Premut** | Baixa la cota gràfica (com una pedra que s’assenta) | `transform: scale(0.98);` |
| **Disabled** | **Sec** | Sense vida, com un bancal sense aigua | `opacity: 0.5; cursor: not-allowed;` |

---

## ✨ **Accessibilitat: Bancal Mode (Disseny per a Tothom)**
- **Tap Targets:** 56px mínim (per a dits de llaurador).
- **Vibració Tàctica:** `playAtomicFeedback()` + vibració òptica (`transform: scale`) per a iOS antics.
- **Contrast:** WCAG AAA (text negre en fons taronja, blanc en blau).
- **Reducció de Moviment:** Respecta `prefers-reduced-motion`.

---

## 📖 **Exemple Pràctic: Com construir un Botó**
```jsx
// ❌ NO (Tailwind hardcodejat)
<button class="bg-orange-500 rounded-3xl p-4 text-white">
  Enviar
</button>

// ✅ SÍ (GEM MODERN)
<UniversalButton theme="primary" size="large">
  Enviar
</UniversalButton>
```
