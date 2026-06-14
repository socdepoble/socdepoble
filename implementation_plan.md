# Aplanament Global i Resolució d'Errors (Fase 2)

Aquest pla aborda els errors detectats a la consola i la pèrdua de renderitzat a les UniversalCards després de la injecció dels components purs.

## 1. Diagnòstic de l'Estat Actual
- **Pèrdua de contingut a UniversalCard:** El nou `UniversalCard.jsx` minimalista només accepta props literals (`title`, `subtitle`, `body`) i **ignora `children`**. Com a resultat, totes les vistes que utilitzaven el patró compost (`<UniversalCard.Header>`, `<UniversalCard.Body>`, etc.) com el Visor Nano, ara renderitzen targetes buides.
- **Errors de càrrega de mòduls (Vite):** Els errors `Loading failed for the module` són deguts a què la sobreescriptura de `UniversalPage.jsx` o els canvis d'importació han trencat les rutes d'altres mòduls que depenien d'ell, o bé el Service Worker (`coi-serviceworker`) està servint una pàgina 404 de fallback (d'ací el missatge "PÀGINA NO TROBADA") per rutes que Vite no pot resoldre en calent.
- **Violacions de Rendiment (`message handler took Xms`):** Els temps alts (1343ms) en el fil principal solen ocórrer quan hi ha un coll d'ampolla en la sincronització de dades massives (IndexedDB/WebRTC) que desemboca en un re-renderitzat pesat. Aplanar el DOM ajudarà a mitigar el cost de *Recalculate Style* i *Layout* quan aquests missatges de xarxa disparen actualitzacions de la UI.

## User Review Required
> [!IMPORTANT]
> **Trencament de l'API de UniversalCard:** La versió "pura" de Copilot ha eliminat el suport per a `children` i els subcomponents (`UniversalCard.Header`, etc.).
> **Pregunta:** Vols que (A) modifique la nova `UniversalCard` perquè suporte de nou el patró compost (amb `children` i `.Header`, `.Body`) però aplanat internament, o (B) vols que migrem les vistes (com el Visor Nano i el Mur) perquè usen exclusivament les props `title, subtitle, body`?

## 2. Aplanament de la resta de Plantilles Universals

Mentre rebem les auditories de les 9 IAs, netejarem l'entropia local.

### `UniversalVideo.jsx`
Actualment té una imbricació excessiva per al botó de "Play":
```jsx
<div> -> <div> -> <div> -> <Play>
```
**Proposta:**
Aplanar els contenidors de l'overlay a només 2 nivells:
- Un `<button>` relatiu que continga la miniatura `<img>` absoluta.
- Un `<svg>` de Play absolut i centrat.
Això elimina 2 nivells inútils i redueix l'arbre.

### `UniversalHeader/index.jsx`
La definició `UniversalHeaderRoot` té classes excessivament llargues però el DOM ja és només un `<header>`. Es revisarà si els subcomponents (`.Button`, `.Group`, `.Logo`) afegeixen `divs` innecessaris per agrupar icones.

### `UniversalGrid.jsx`
El `UniversalGridRow` ja retorna un `<div>` simple. Tot i això, podem polir l'ús de `React.memo` si detectem que rep objectes dinàmics que trenquen la igualtat referencial.

## 3. Resolució d'Errors de Consola
1. **Solucionar el 404 (Pàgina no trobada):** Restaurar la versió original de `UniversalPage.jsx` si contenia lògica d'enrutament rellevant que hem esborrat inadvertidament amb la versió "només targetes" de Copilot.
2. **Neteja de la cache del SW:** Per evitar els errors de "JSON inesperat" del worker, recomanarem un *Hard Reload* per saltar-nos l'estat ranci del Service Worker de Vite.

## 4. Pla d'Acció Immediat
1. Escanejar les vistes clau (`VisorNano`, `MurCentralitzat`) per veure com usen `UniversalCard`.
2. Restaurar la compatibilitat de la targeta perquè el Mestre no veja una aplicació "trista" i buida.
3. Aplanar `UniversalVideo` i els components del `UniversalHeader`.

## 5. Tasques de Context i Arquitectura Cognitiva
- **Resolució del "Día de la Marmota" (Fase 1 Assolida):** Hem formalitzat termodinàmicament la memòria a curt termini. El fitxer `_docs/CONTEXT_DEMA.md` ha passat a dir-se `_docs/conversa_d_ahir.md` (què vam fer ahir?). S'ha injectat a la Skill principal (`pedra-seca.skill.yaml`) l'Acte Reflex d'Obertura, que obliga l'agent a llegir aquest fitxer en el primer mil·lisegon d'iniciar el Teatre. Queda pendent refinar si això es pot convertir en un algoritme sistèmic i autònom a nivell d'IDE per no dependre exclusivament del Prompt inicial.
