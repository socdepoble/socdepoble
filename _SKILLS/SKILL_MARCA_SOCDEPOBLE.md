# SKILL: ESTIL DE MARCA SÓC DE POBLE 🏺🎨

## 1. IDENTITAT VISUAL (SÈQUIA MARE)

Aquest protocol blinda el disseny per a evitar improvisacions genèriques.

### A. Paleta de Colors (La Terra)

- **Fons General:** `#FDF5E6` (Crema / Old Lace). Mai blanc pur si no és per a contrast extrem.
- **L'Accent Suprem (Boina Taronja):** `#F97316` (Terracotta / Naranja Institucional). Color per defecte per a botons d'acció principals (CONNECTAR, +) i la capçalera de targetes globals.
- **Fons Secundari:** `#000000` (Negre Absolut). Ús en la barra de navegació inferior mòbil i fons de contrast.
- **Acció Digital (IAIA / Sistema):** `#06B6D4` (Cian). Reservat ESTRICTAMENT per a interaccions de la IA i estats de càrrega del sistema, mai per interaccions humanes.
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

1.  **La Capucha (Header):** Preferiblement color **Taronja (#F97316)** per a publicacions d'autor. Conté l'avatar, el nom de l'autor/entitat i la data. Note: targetes abstractes de sistema poden prescindir de capucha.
2.  **El Cos (Media & Content):** S'adapta al format del contingut sense deformar-se. Radi arrodonit que fa de màscara.
    - Imatges: Poden ser apaisades, quadrades o allargades segons la font.
    - Carrusel: Obligatori si hi ha múltiples imatges en Targeta Single.
    - Títol i Descripció: Roboto Condensed.
3.  **El Peu (Actions):** Canvia contextualment (Mur: Connectar, Mercat: Interessat, Pobles: Visitar).

## 3. ADN MÒBIL (NEXUS) 📱

La navegació mòbil és sagrada i no pot desaparèixer:

- **Mobile Bottom Nav:** Fons Negre Absolut (#000000).
- **Botó Central (+):** Botó de publicació ràpida en color Taronja (#F97316), ressaltat i amb ombra de bategat.
- **Opcions de Vista:** Totes les pàgines de llistat (Mur, Mercat, Pobles) han d'oferir selectors de vista:
  - **Single:** 1 imatge per fila (full width).
  - **Grid:** 2 imatges per fila (compta actual).
  - **List:** Vista de llista compacta.
- **Cerca Contextual:** Cada pilar (Xat, Mur, Mercat, Pobles, Esdeveniments, Mapa) ha de tenir un cercador contextual a la part superior.

## 4. NARRATIVA I TO (TRELLAT)

Com parla el sistema (Personalitat de la Tia Maria).

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

## 13. CHECKLIST D'EXECUCIÓ (REVISAT v18)

- [ ] ¿Es respecta el Design System intern prohibit l'addició d'un extern?
- [ ] ¿La landing page és el Xat (/chats)?
- [ ] ¿L'usuari no registrat és tractat com a "Foraster"?
- [ ] ¿Les icones segueixen l'estètica Notion (Grans i Minimalistes)?
- [ ] ¿S'ha purgat qualsevol fallback de "Veí" per a usuaris no identificats?
- [ ] ¿La tipografia és exclusivament Roboto Condensed?
