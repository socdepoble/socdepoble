---
name: css-arquitectura
description: "Blindatge de l'arquitectura CSS. Regles estrictes sobre la separació de variables corporatives (Pell) i classes d'utilitat (Ossos)."
authority: "Consell de les 11 IAs"
version: "V21"
---
# Skill: Arquitectura CSS i Blindatge Estètic

Aquesta habilitat assegura que el disseny del projecte no es desintegra pel mal ús d'eines externes com Tailwind. S'ha de respectar la dualitat "Pell i Ossos".

## Regles CSS

### 1. Variables Corporatives vs Tailwind
- **AÇÒ NO:** Fer servir colors de la paleta per defecte de Tailwind per a elements de marca (ex: `text-red-500`, `bg-blue-600`). Açò trenca l'homogeneïtat del Mas.
- **AÇÒ SÍ:** Utilitzar exclusivament les variables CSS pròpies definides al disseny per a colors i tipografies (ex: `color: var(--sp-color-primari);`, o les seues equivalències si s'han estès al Tailwind config del projecte).

### 2. Estructura amb Tailwind (Els Ossos)
- Tailwind és benvingut i obligatori per a definir l'estructura: espaiats (marges i paddings seguint la graella oficial de Tailwind o les variables pròpies), flexbox, graelles (grid) i posicionament. Prohibit usar 28px per a paddings.

### 3. La Classe Mestra `.sosp-card`
- L'aspecte visual principal dels contenidors no s'ha de construir encadenant classes d'utilitat (`shadow-lg border rounded-xl bg-white...`), sinó utilitzant les classes globals consolidades com `.sosp-card` per a garantir que tota l'aplicació (la Pell) es veu igual i es pot canviar des d'un sol lloc.


---

## 🔗 Sinapsi Arquitectònica

- [[SKILL|jerarquia-tailwind/SKILL]]
- [[SKILL|arquitectura-pedra-seca/SKILL]]
- [[SKILL|registre-tokens-unic/SKILL]]
