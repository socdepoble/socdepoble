---
name: registre-tokens-unic
description: "El Diccionari Inviolable i font única de veritat per al CSS."
tags: [arquitectura, ui, tokens, estetica]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Registre de Tokens Únic (El Diccionari Inviolable)

Qualsevol IA que vinga darrere i demane de modificar el color, el tamany o les ombres de Sóc de Poble ha d'obeir cegament aquesta regla. Queda abolit el "Hardcoding" o "Màgic Numbers".

## 1. L'Única Font de Veritat
Tots els radis, paletes de colors, alçades, tipografies i transicions resideixen exclusivament en un sol fitxer mestre al projecte: `tokens/design-tokens.json` (i els seus derivats per a CSS natiu). Si un color no està ací, **no existeix al Mas**.

## 2. Mapa dels Tokens Radicals (Les variables CSS de Poble)
A l'hora de suggerir o generar components TSX, l'agent només emprarà la clau semàntica o classe consolidada. Mai el valor absolut. Ací tens el vocabulari fonamental:

### Mètriques del Dit (Touch Targets)
* `--sp-touch-cuspide`: L'àrea tàctil base de 48px que garanteix usabilitat (substitueix l'antic `4*px` o qualsevol padding a ull).
* `--sp-touch-minim`: Aquest valor només s'usa per a ajustos interns a les files.

### La Pell de la Terra (Colors)
* `--sp-pell-base`: Color de fons de la interfície.
* `--sp-pell-pedra`: Color de superfície o cartes (`.sosp-card`).
* `--sp-pell-mar`, `--sp-pell-olivera`, `--sp-pell-error`: Accents semàntics de la UI per evitar emprar colors neutres de Tailwind com `blue-500` o `green-400`.

### Geometria de la Pedra Seca (Radis i Tipografia)
* `--sp-font-arrel`: Noto Sans, 16px (Tota l'aplicació).
* `--sp-radius-main`: El radi unificat per als cantons dels components. Mai introduïrem `rounded-xl` manualment; ho heretem.

## 3. Com Procedir (El Mètode de Cita)
Si l'humà et demana: "Fes que aquest botó siga més roig i redó", tu li contestaràs: 
*"Mestre, he aplicat el color `var(--sp-pell-error)` i l'he tallat amb la `var(--sp-radius-main)`. Si vols més roig per a tot el projecte, ho he de modificar al fitxer central `design-tokens.json`."*


---

## 🔗 Sinapsi Arquitectònica

- [[SKILL|css-arquitectura/SKILL]]
- [[SKILL|arquitectura-pedra-seca/SKILL]]
- [[SKILL|jerarquia-tailwind/SKILL]]
