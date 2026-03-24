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
- **La Bellesa com a Deure (Zero Estrès):** Qualsevol targeta (Card), document o aplicació dissenyada per nosaltres **ha de transmetre calma i seguretat**. Si l'usuari sent tensió visual intentant entendre "què fa ací aquest text enganxat", el disseny ha fallat.
- **La Llei de l'Orgull Rural (Mai Amagar la Marca):** Mai per excés de "clean design" eliminarem l'escut a les targetes principals, capçaleres o documents formals. Sentim orgull de 'Sóc de Poble' i ho reivindiquem als espais. Mentres hi haja aire i marges (sense amuntegar-se de manera tensa), el logotip (sencer, amb textos o només poma depenent de l'element) sempre presideix l'escena.
- **La Respiració Universal (Equivalència PDF vs Pantalla):** Tant en paper (margin de 10mm-20mm) com a la web (paddings de `p-6`, `p-8`, `gap-y` generosos), els elements (sobretot els de les Targetes o Cards) han de poder respirar. En el desenvolupament web, s'han d'estudiar sempre els píxels exactes per garantir aquesta distància sense apinyament. Cal mesurar perfectament espais buits (negatius) i plens. L'apretament constant d'elements contra els marges queda prohibit. L'ull necessita calma on aterrar.
- **Mides de Logo i Marges d'Aire**: El logo a les capçaleres ha de mantenir una proporció racional (ex. menys de 30px d'alt) i sempre incloure caixes d'aire/respiració (marges equivalents a mínim 10mm o 3-4 rems lliures al seu voltant) per no eclipsar la funcionalitat ni amuntegar-se.
- **Reflexió en la Col·locació**: No es tracta d'eixir del pas ni moure píxels al vol; tota decisió gràfica (com presentar la informació contextual d'un NFT, o el final d'un Document amb capçaleres en Blau i peu justificat) ha d'estar sostinguda per raons d'usabilitat netes, aconseguint que la vista es clave exactament on cal.

## 5. El Protocol de la Boina (Header) 🏺🧢

- **Identitat Visual**: Les targetes d'autor porten el header (boina) amb color institucional.
- **Mode Nit (Dark Mode)**: Color **Taronja Institucional** (#F97316). Màxima visibilitat sobre negre.
- **Mode Dia (Light Mode)**: Color **Blau Sky** (#0EA5E9). Harmonia amb el cel rural.
- **Contingut**: Nom a l'esquerra, cronologia (data/hora) a la dreta. **PROHIBIT** duplicar el nom del projecte si ja apareix com a autor.

## 6. Ubicació del Preu (Mercat) 💰🏷️

- **Posició**: Estrictament a la part **inferior dreta** de la targeta (body), a sobre de la barra d'accions.
- **Estil**: Pastilla robusta (Pill) amb color de la Boina bategant, font Roboto Condensed Bold, i ombra profunda per a destacar l'oferta.

## 7. Arquitectura de 3 Nivells del Perfil (Progressive Disclosure) 🏛️

- **Nivell 1 (L'Aparador - Vista Pública):** El perfil base de la persona o entitat (`ProfileView`). Ha de ser net. Si l'usuari veu el seu propi perfil, **ESTÀ PROHIBIT** embrutar l'Aparador amb botons massius d'Edició o d'Administrador Giga. Tota configuració es deriva exclusivament de la icona d'engranatge de navegació (TopBar).
- **Nivell 2 (La Rerabotiga - Ajustaments):** Obert pel botó d'Ajustaments. Format llista i estètica neta (identitat visual, idioma, territorialitat).
- **Nivell 3 (El Llavador / Laboratori):** Exclusivament per a Super Admins. És una secció al fons de La Rerabotiga amb estètica d'alerta (verd/roig foscs) on s'allotgen els botons perillosos (Sincronització de Rhino, Mode Forense, etc). D'aquesta manera, el xarampió administratiu no contamina l'Aparador.
