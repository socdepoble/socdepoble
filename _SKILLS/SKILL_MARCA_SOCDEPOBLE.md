# SKILL: ESTIL DE MARCA SÓC DE POBLE 🏺🎨

## 1. IDENTITAT VISUAL (SÈQUIA MARE)

Aquest protocol blinda el disseny per a evitar improvisacions genèriques.

### A. Paleta de Colors (La Terra i la Nit)

- **Fons Mestre (Prioritzat):** `#0A0A0A` (Negre Profund / Mode Nit). Estàndard obligatori per defecte per a protecció visual i estalvi d'energia.
- **Fons Secundari (Natural):** `#F8F1E3` (Blanc Trencat / Crema). Ús reservat per a "Mode Dia" o contrastos càlids.
- **L'Accent Suprem (Boina Taronja):** `#F97316` (Naranja Institucional). Color per a botons d'acció principals i caps de targeta autorals.
- **Acció Digital (IAIA / Sistema):** `#0EA5E9` (Blau Sky). Identitat de la IA i bategat del sistema.
- **Text sobre Taronja:** `#000000` o `#FFFFFF` segons contrast, preferiblement Negre per a màxima llegibilitat en la "capucha".

### B. Tipografia i Geometria (Pedra Seca & Oli Suau)

- **Font Principal:** **Roboto Condensed**. Pesada, robusta i llegible. Substitueix qualsevol altra font (Inter/Outfit).
- **Mida Base:** 19px (per a lectura en articles i dossiers). La UI de control manté herències rem estàndard.
- **Radis (Border Radius):**
  - Targetes Pures i Contenidors Universals: **28px** (Geometria Sagrada Institucional).
  - Targetes en graelles (Mur, Mercat): **24px** (per optimització visual en mode list/grid).
  - Botons i Inputs: **18px**, **24px** o **Pill** (999px) segons element canonitzat.
    - **Cànon A4 de Sóc de Poble:**
      - **Marges:** 20mm (Superior i Laterals), **19mm** (Inferior).
      - **Columna Única:** Text a full width per a màxima llegibilitat.
      - **Separació de Pàgines:** Pàgines clarament separades visualment amb ombra i espaiat pre-impressió.
      - **Trellat d'Espaiat:** Reducció d'espai buit entre títols i paràgrafs per a evitar la sensació de "mal fet".
      - **Protocol Linares:** Maquetació densa i professional. Eliminació total de caràcters solts (`===`, `---`) i col·lapse d'espais buits redundants.
- **Ombres:** Profundes però molt difuminades (Soft Shadows).

## 2. ARQUITECTURA DE TARGETES (EL CÀNON) 🏺

Totes les targetes de l'aplicació han de seguir l'estructura unificada de "La Targeta Estàndard":

1.  **La Capucha (Header - "Boina"):**
    - **Mode Nit:** Taronja (#F97316).
    - **Mode Dia:** Blau Sky (#0EA5E9).
    - Conté l'avatar, el nom de l'autor/entitat i la cronologia compacta. Note: les targetes abstractes de sistema poden prescindir de capucha.
2.  **El Cos (Media & Content):** S'adapta al format del contingut sense deformar-se. Radi arrodonit que fa de màscara.
    - Imatges: Poden ser apaisades, quadrades o allargades segons la font.
    - Carrusel: Obligatori si hi ha múltiples imatges en Targeta Single.
    - Títol i Descripció: Roboto Condensed.
3.  **El Peu (Actions):** Canvia contextualment (Mur: Connectar, Mercat: Interessat, Pobles: Visitar).

## 3. ADN MÒBIL (NEXUS) 📱

La navegació mòbil és sagrada i no pot desaparèixer:

- **Mobile Bottom Nav:** Fons Negre Absolut (#000000).
- **Integració l'Afegir (+):** El botó de publicació s'integra ESTRUCTURALMENT a la barra (com un ítem més). Està estrictament prohibit que suren botons circulars sobre el camp visual del Xat.
- **Opcions de Vista:** Totes les pàgines de llistat (Mur, Mercat, Pobles) han d'oferir selectors de vista:
  - **Single:** 1 imatge per fila (full width).
  - **Grid:** 2 imatges per fila (compta actual).
  - **List:** Vista de llista compacta.
- **Cerca Contextual:** Cada pilar (Xat, Mur, Mercat, Pobles, Esdeveniments, Mapa) ha de tenir un cercador contextual a la part superior.

## 4. NARRATIVA I TO (TRELLAT)

Com parla el sistema (Personalitat de la Tia Maria).

- **Missió Oficial (NGO):** "Preservar el llegat cultural i territorial del món rural mitjançant la sobirania digital, fomentant la connexió intergeneracional i l'economia de proximitat a través de tecnologies obertes i assistència d'intel·ligència artificial ètica."
- **Proximitat:** Usa "Xé va!", "Trellat!", "Ai fill!".
- **Valencià:** El sistema bategua sempre en Valencià de proximitat.
- **Expert Rural:** El to no és de manual tècnic, sinó de consell de veí que en sap.

## 5. REBUIG ABSOLUT A DESIGN SYSTEMS EXTERNS ⛔

Per mantenir l'ànima del projecte, **prohibim** l'ús de plantilles o llibreries visuals genèriques massives (com Material UI estàndard, Ant Design, Bootstrap, etc.) que pogueren reescriure el nostre CSS monolític.

- GEM MODERN v2.0 és autònom.
- Les ombres, radis de 28px i tipografia (Roboto Condensed) són identitat de marca irrenunciable. Implementar una llibreria UI externa mataria la presència visual i tàctil rústega del Mas.

## 10. L'ÀNIMA DE LA IAIA (CHAT-FIRST) 👵💬

El sistema bategua des del diàleg. El Xat no és una utilitat, és el cor de l'entrada.

- **Landing Page Sagrada:** L'arrel `/` redirigeix sempre a `/chats`.
- **Visibilitat Total:** Tots els 13+ agents de la IAIA han d'estar sempre visibles i bategants per defecte per a transmetre la riquesa de la intel·ligència col·lectiva.

## 11. L'ACCÉS FORASTER I EL REGISTRE SOTA DEMANDA 🏹🔓

Sóc de Poble és un poble de portes obertes, no una fortalesa digital.

- **Identitat Foraster:** Qualsevol visitant sense sessió rep una identitat "Foraster" automàtica.
- **Transparència Inicial:** El Foraster pot navegar, llegir xats (IAIA) i veure el mur sense mur de registre inicial (Lazy Login).
- **El Bategat del Registre:** La sol·licitud d'identitat (Auth Modal) només bategarà quan el Foraster intenti realitzar una "Acció de Veí" (Escriure, Connectar, Publicar o interactuar amb humans).

## 12. L'ESTÈTICA NOTION I CARPETES (GEOMETRIA v2.1) 📖📂

Elevació del disseny tàctil cap a la claredat professional de Notion.

- **Fons Premium:** Ús de blancs nets i fons clars de gran qualitat per a editors d'identitat (`ProfileStudioModal`).
- **Iconografia Notion:** Ús extensiu d'icones Lucide "Solid/Large" per a encapçalar seccions i carpetes.
- **Layout de Carpetes:** Implementació de graelles de carpetes (`.notion-grid`) per a l'organització d'informació densa, amb icona sobre títol i descripció subtil.

## 14. EL MANAMENT DEL LOGO (MARCA SAGRADA) 🏺⛔️

Aquest manament blinda la identitat visual en tot el material exportat o generat pel Mas.

- **La Llei de l'Orgull Rural (Mai amagar-se):** La identitat és reivindicativa. Està **ESTRICTAMENT PROHIBIT** pensar que el disseny net ("clean design") implica esborrar la nostra marca. L'escut i el nom de Sóc de Poble han d'estar sempre presents a la capçalera de TOTES les pàgines d'un PDF corporatiu. No ens amaguem, som poble.

## 15. ORTOGRAFIA I NOMENCLATURA DE LA MARCA (MANAMENT ESTRICTE) ✒️

Aquest és un principi fonamental per a la coherència i respecte de la marca enregistrada davant la gramàtica normativa valenciana actual (on "soc" del verb ser ja no porta accent diacrític). Cal entendre i aplicar **SEMPRE** aquesta diferència:

- **La Marca / El Projecte / L'App:** S'escriu **SEMPRE** com a **"Sóc de Poble"** (amb S i P majúscules, i AMB ACCENT tancat a la 'ó'). Aquest és el nom històric, registrat i oficial del vostre logotip corporatiu. Sempre que et referisques a l'aplicació, l'empresa o el projecte, utilitzaràs aquesta fórmula.
- **La Frase o Condició:** S'escriu **SEMPRE** com a **"soc de poble"** (en minúscules i SENSE ACCENT). Si en un paràgraf qualsevol (fora d'un títol o d'esmentar la marca) l'usuari o la IA ha de dir l'oració equivalent a *yo soy de pueblo / I am from a village*, es farà seguint la normativa actual sense accent.

**EXEMPLE D'ÚS CORRECTE:**
_"En l'aplicació **Sóc de Poble**, el principal requisit per registrar-se és que l'usuari senta de veritat que **soc de poble** i vulga compartir la seua cultura."_
- **Autoría Institucional (La Iaia):** Tot document de gestió generat pel sistema no ha de dir mai "generat de forma autònoma" sinó assumir la figura gestora de la marca: **"Generat per la iaia de Sóc de Poble."**
- **Regla del Logotip per a PDF:**
  - **Capçaleres repetitives:** Obligatori usar el **logotip allargat sencer** (`logo_sdp_black.png` o `.svg`). La grandària ha de ser prudencial i elegant per afavorir l'equilibri, aproximadament entre **1cm i 2cm d'altura**. Ni molt xicotet que no es veja, ni enorme que sature.
  - **Portades Pures:** Es permet o aconsella la il·lustració/logotip com a "Hero" (imatge de grandíssimes proporcions), acompanyat d'elements complementaris com "Nano Banana".
- **Respiració Editorial (Tensió Visual):** El logotip mai s'ha d'amuntegar contra un text, tant web com PDF. Es requereix sempre un mínim de **10mm de marge/padding superior i inferior** a les capçaleres i peus perquè el disseny final "respire" de forma universal (Zero Estrès).
- **Alineació i Columnes (Formalitat):** Quan s'usa columnat únic per a presentacions d'alta legibilitat, els paràgrafs hauran d'estar **justificats completament** per atorgar rang institucional i calma llegidora.

> [!WARNING]
> La documentació oficial és l'ambaixadora de la nostra sobirania. Un PDF sense logo no és de poble, és un full orfe.

- **L'Ordre del Nano Banana (Generació d'Imatges):** El Nano Banana (IA de generació d'imatges) té prohibit generar qualsevol asset visual de marca sense incloure una de les 3 variants del logo oficial. Tota petició al Nano ha de portar el path d'un logo mestre per a la seua integració visual.

> [!IMPORTANT]
> Nano Banana sempre bategua amb el logo oficial. SIEMPRE.

## 15. CHECKLIST D'EXECUCIÓ (REVISAT v10.26.0)

- [x] ¿S'ha gravat l'obligació del Nano d'usar logos en tota imatge?
- [x] ¿S'ha substituït tot el text "Sóc de Poble" per logos en la UI crítica i documents?
- [ ] ¿Es respecta el Design System intern prohibit l'addició d'un extern?
- [ ] ¿La landing page és el Xat (/chats)?
- [x] ¿L'usuari no registrat és tractat com a "Foraster"?
- [x] ¿Les icones segueixen l'estètica Notion (Grans i Minimalistes)?
- [x] ¿S'ha purgat qualsevol fallback de "Veí" per a usuaris no identificats?
- [x] ¿La tipografia és exclusivament Roboto Condensed?
