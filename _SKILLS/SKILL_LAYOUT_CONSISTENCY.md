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

## 4. Harmonia i Equilibri Visual 🏺⚖️

- **Equilibri del Contingut**: El disseny ha de permetre que el contingut "respire". L'excés de mida pot trencar la pau del territori.
- **Mides de Logo**: El logo a la capçalera ha de mantenir una proporció equilibrada (aprox. `h-10` a `h-11`) per a no eclipsar la funcionalitat de les eines.
- **Espaiat de Capçalera**: La distància entre el menú sandvitx i el logo ha de ser de `24px` (`gap-6`) sense marges addicionals, per a evitar buits innecessaris i mantenir la cohesió.
- **Reflexió en la Col·locació**: Cada element ha de ser fruit d'una reflexió sobre la seua posició i l'harmonia global del Mas. Més gran no sempre és millor; l'equilibri és el bategat perfecte.

## 5. El Protocol de la Boina (Header) 🏺🧢

- **Identitat Visual**: Les targetes d'autor porten el header (boina) amb color institucional.
- **Mode Nit (Dark Mode)**: Color **Taronja Institucional** (#F97316). Màxima visibilitat sobre negre.
- **Mode Dia (Light Mode)**: Color **Blau Sky** (#0EA5E9). Harmonia amb el cel rural.
- **Contingut**: Nom a l'esquerra, cronologia (data/hora) a la dreta. **PROHIBIT** duplicar el nom del projecte si ja apareix com a autor.

## 6. Ubicació del Preu (Mercat) 💰🏷️

- **Posició**: Estrictament a la part **inferior dreta** de la targeta (body), a sobre de la barra d'accions.
- **Estil**: Pastilla robusta (Pill) amb color de la Boina bategant, font Roboto Condensed Bold, i ombra profunda per a destacar l'oferta.
