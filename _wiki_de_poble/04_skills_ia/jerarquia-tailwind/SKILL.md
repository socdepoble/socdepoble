---
name: jerarquia-tailwind
description: "Jerarquia definitiva i inamovible de Tailwind dins l'arquitectura Sóc de Poble. Tailwind per a ossos, CSS per a pell."
authority: "Consell de les 11 IAs"
version: "V21"
---
# Skill: Jerarquia Definitiva de Tailwind (Ossos vs Pell)

Aquesta habilitat resol per sempre la contradicció entre CSS i Tailwind al Mas.

## La Llei de Ferro: Ossos i Pell

### 🦴 ELS OSSOS (Tailwind és OBLIGATORI)
Tailwind gestiona **exclusivament**:
- `flex`, `grid`, `flex-col`, `flex-row`
- `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`
- `items-*`, `justify-*`, `text-left`, `text-center`
- `relative`, `absolute`, `fixed`, `sticky`
- `overflow-*`, `hidden`, `block`, `inline`

**AÇÒ SÍ:** `<article class="flex flex-col gap-4 w-full">`

### 🎨 LA PELL (CSS Pur és OBLIGATORI)
La pell visual pertany a classes semàntiques del sistema [[Pedra Seca]]:
- Colors de fons, text o vores → `var(--sp-*)`
- Radis de cantonada → `var(--sp-radius-main)`
- Ombres → `var(--sp-shadow-elevate)`
- Tipografies → `font-family: var(--sp-font-main)`
- Transicions d'estètica → CSS pur

**AÇÒ SÍ:** `<article class="flex flex-col gap-4 w-full sosp-card">` on `.sosp-card` porta tota la pell.

### 🚫 ANTIPATRÓ CAPITAL (Pena de SOSP-LOCK)
**PROHIBIT** absolut:
```html
<!-- AÇÒ NO (Codi Tòxic) -->
<div class="bg-[#FF7300] text-white rounded-[28px] p-6 shadow-lg">
```
Raó: Hardcodeja colors, radis i estètica dins Tailwind, trencant la separació d'Ossos i Pell i violant els tokens globals.

### ✅ PATRÓ CANÒNIC (Pedra Seca Pura)
```html
<!-- AÇÒ SÍ (Arquitectura Sóc de Poble) -->
<article class="flex flex-col gap-4 w-full sosp-card">
```
```css
.sosp-card {
  background-color: var(--sp-orange-10);
  border-radius: var(--sp-radius-main);
  box-shadow: var(--sp-shadow-elevate);
  padding: var(--sp-espai-4);
}
```

## Regla de Verificació Automàtica
Si una classe Tailwind conté:
- `bg-` seguit d'un color que no siga `transparent` o `currentColor`
- `text-` seguit d'un color que no siga `inherit`
- `rounded-` seguit d'un valor numèric o `full`
- `shadow-` seguit d'un valor

→ **ÉS UN CRIM DE PELL DINS OSSOS**. Aplica SOSP-LOCK immediatament.


---

## 🔗 Sinapsi Arquitectònica

- [[SKILL|css-arquitectura/SKILL]]
- [[SKILL|arquitectura-pedra-seca/SKILL]]
- [[SKILL|registre-tokens-unic/SKILL]]
