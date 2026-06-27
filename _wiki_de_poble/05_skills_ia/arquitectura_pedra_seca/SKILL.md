---
name: arquitectura-pedra-seca
description: "Estàndards de disseny, maquetació i SEO Local per al projecte Sóc de Poble. Prohibició de fantasmes visuals, ús de Tailwind genèric i prioritat Offline-First."
authority: "Consell de les 11 IAs"
version: "V21"
---
# Skill: Arquitectura Pedra Seca i SEO Local

Aquesta habilitat (skill) s'ha d'activar i aplicar automàticament sempre que l'usuari demane dissenyar, modificar la UI o tocar aspectes de SEO i PWA del projecte Sóc de Poble.

## 1. La Filosofia de la Pedra Seca
L'arquitectura Pedra Seca significa construir pedra sobre pedra, **sense cap mena d'amalgama o ciment extern**. Cada peça ha d'estar perfectament mesurada i encaixada, com un gran puzle mil·lenari. L'objectiu és crear blocs sòlids que resistisquen el pas del temps. La tipografia oficial és **Noto Sans**.

## 2. Fantasmes Visuals (Prohibits)
- **AÇÒ NO:** Ús d'etiquetes `<br>`, `<hr>` o elements buits només per a separar coses. L'HTML ha de ser semàntic.
- **AÇÒ SÍ:** Utilitza classes d'espaiat (`gap-4`, `mt-8`) o variables CSS (`var(--sp-espai-4)`) per crear oxigen.

## 3. Separació de Pell i Ossos (CSS vs Tailwind)
- **AÇÒ NO:** Maquetar l'estètica (colors, vores estilitzats) d'una targeta directament amb Tailwind (ex: `bg-[#FF7300]`).
- **AÇÒ SÍ:** Tailwind s'utilitza únicament per a l'estructura i els ossos (flexbox, graelles, distàncies). L'estètica (pell) la proporciona el CSS Vanilla o les variables globals del projecte.

## 4. Prioritat Offline-First i PWA
- El SEO i la càrrega inicial no han de dependre de peticions externes lentes. La base és OPFS / idb-keyval / Yjs offline-first. Assegura't que el Manifest de la PWA està intacte per instal·lar l'app a l'iPad sense xarxa.

## 5. Microdades (Schema.org) i Rendiment
- Tota entitat (esdeveniments festius, receptes, articles històrics) ha de tindre estructura JSON-LD per als cercadors locals.
- Les imatges han d'estar optimitzades i la càrrega del DOM ha de ser ràpida i lleugera. El rendiment (A10) també és Trellat.

## Recordatori Especial de la IAIA
Tingues *Trellat*. No introduïsques llibreries de components innecessàries (radix, shadcn) a menys que el Mestre t'ho demane explícitament. 

---

## 🔗 Sinapsi Arquitectònica
- [[05_skills_ia/css_arquitectura/SKILL|css_arquitectura]]
- [[05_skills_ia/jerarquia_tailwind/SKILL|jerarquia_tailwind]]
- [[05_skills_ia/a11y_trellat/SKILL|a11y_trellat]]
- [[05_skills_ia/registre_tokens_unic/SKILL|registre_tokens_unic]]
