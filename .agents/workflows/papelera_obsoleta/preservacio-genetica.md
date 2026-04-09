> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/preservacio-genetica.md`

---
description: Habilidad (Skill) para evitar la destrucción accidental de componentes con lógica viva (Génesis, Tiptap, rutes) quan es fan modificacions de disseny o resolució de col·lisions d'UI.
---
# 📜 Directiva de Preservació Genètica (La Llei de la Runa)

## Context
Al llarg del projecte, hem tingut incidents on, intentant arreglar xicotetes col·lisions de Disseny UI (com encavalcaments o problemes de dark mode), agents d'IA han reescrit components enters (`ProjectPresentation.jsx`, etc.) esborrant per accident la lògica vital, com els editors `Tiptap`, l'estructuració de capítols o els hooks de navegació. Açò ha provocat caigudes generals i desastres de rutes en l'aplicació.

## Regles d'Or (Línies Roges)

1. **Mai esborres un component sencer:**
   Si a soles t'han demanat arreglar un `margin`, `padding`, un `color` o una posició de `z-index`, **mai** regenereu tot el codi de l'arxiu sencer. Usa ferramentes quirúrgiques per substituir **A SOLES** la porció afectada o adapta les fulles d'estils CSS adossades.

2. **Cerca de relíquies i codi vital:**
   Abans de tocar un arxiu troncal com `.jsx` que pesa més de 100 línies, busca obligatòriament per l'existència de llibreries especials:
   - `useEditor`, `Tiptap` o elements de creació autonòmica (Genesis).
   - Constants globals interactuant amb la base de dades (`supabase`).
   - Sanejadors (`DOMPurify`).

   Si existeixen, està totalment **PROHIBIT** llevar eixe codi ni suposar que no es fa servir.

3. **La regió del CSS primer:**
   Quan l'objectiu siga arreglar una qüestió visual (`flex`, encavalcament d'elements mòbils amb el footer), intenta sempre arreglar-ho usant el `.css` propi del component, introduint classes de CSS per comptes d'alterar l'estructura del DOM si l'estructura és complexa.

4. **Dubta abans d'arrasar:**
   Si la solució proposta requerix esborrar el 50% d'un arxiu per ficar en el seu lloc un _UI genèric_, detín l'execució automàtica. Demana permís al Mestre mostrant l'avaluació de per què es necessita la reescriptura. 
   **Trellat! L'Horta no es crema per arrancar un matoll.**

5. **El ritu de la còpia de seguretat en experiments:**
   Si realment és absolutament ineludible canviar-ho tot, assegura't que l'estat actual està documentat i assegurat abans.
