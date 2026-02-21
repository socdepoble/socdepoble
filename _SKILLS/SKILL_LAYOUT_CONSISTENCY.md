# SKILL: CONSISTÈNCIA DE DISSENY I LAYOUT 🎨🪐

Per a assegurar que el Mas bategue amb harmonia, s'han de seguir aquestes regles de layout:

## 1. El ContextualMenu (Pestanyes Universals) 📑

- **Posició**: Sempre `sticky top-0` dins del contenidor `main`. Com que el `Header` sobirà (64px) ja està a sobre del `main` a `AppLayout.jsx`, no cal afegir cap `offset` extra a la pàgina interna.
- **Visibilitat**:
  - S'ha de mostrar a les pàgines de contingut fluid (Xat, Mur, Mercat, Pobles).
  - S'ha d'OCULTAR a les aplicacions completes o pàgines amb sidebar pròpia (Bloc de Notes).
- **Z-Index**: Ha de tindre un `z-[900]` per a quedar per sota del `Header` (`z-[1000]`) però per sobre del contingut.

## 2. Rellevància a la Sidebar 📓

- Els elements de segon nivell (com el Bloc de Notes) no han d'eclipsar els Pilars del Mas.
- **Tipografia**: Utilitzar `font-medium` o `font-normal` en lloc de `font-black` per a ítems de suport.
- **Colors**: Evitar colors primaris (Magenta, Taronja) si l'usuari no està activament en eixa secció. Usar transparències `bg-white/[0.03]`.

## 3. Blindatge de Consola 🛡️

- Malgrat que el sistema evolucione, cal mantenir el [GHOST-SHIELD] actiu a `supabaseService.js` per a capturar i silenciar queries malformades sobre `entities` o columnes dinàmiques.
