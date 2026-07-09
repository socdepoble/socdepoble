# Documentació del projecte

Este és el document principal del projecte `socdepoble.org`.

L'objectiu d'esta reconstrucció és mantindre la mateixa experiència visible del projecte original, però amb una base molt més clara, molt més mantenible i molt més fàcil d'entendre i tocar.

## Què és este projecte

Este projecte actual és `socdepoble.org`, una reimplementació neta del portal.

`socdepoble` és el projecte antic de referència, només lectura. S'usa per a mirar comportaments, fluxos i continguts que calga reproduir o millorar, però no per a modificar.

No és una capa de pedaços damunt del projecte antic. S'ha refet amb una estructura nova per a conservar:

- les mateixes seccions principals;
- el mateix tipus de navegació;
- el mateix tipus de contingut visible;
- el xat;
- el mur;
- el mercat;
- pobles;
- events;
- multimèdia;
- notes;
- i pàgines informatives.

## Stack tècnic real

El projecte actual està fet així:

- `React`
  És la llibreria que construeix la interfície.
- `Vite`
  És el servidor de desenvolupament i l'eina que genera la build final.
- `Node.js`
  Es necessita per a executar Vite i les eines de desenvolupament.
- `Supabase`
  És la capa remota de dades quan està configurada.

Important:

- no és una app Node.js amb backend propi tradicional;
- és una SPA de React que corre al navegador i que llig/escriu dades via Supabase o fallback local.

## Com arranca el projecte actual

El projecte actual està configurat per a arrancar en el port `3340`.

Passos:

```bash
pnpm install
pnpm dev
```

Després s'obri en:

```text
http://localhost:3340/
```

## Com provar la build

Si es vol provar la build generada:

```bash
pnpm build
pnpm preview
```

`preview` només és per a revisar la build final en local.

## Relació amb el projecte antic

La idea actual és:

- el projecte antic es queda al port `3333`;
- este projecte nou va al port `3340`.

Així es poden tindre els dos separats i comparar-los sense confusions.

## Punt d'entrada

El punt d'entrada és:

- [src/main.jsx](src/main.jsx)

Des d'ací es munta:

- l'app principal;
- el context de dades;
- i totes les rutes.

## Estructura important del repositori

### `src/config/`

Ací va la configuració global.

Exemples:

- definició de seccions;
- constants generals;
- navegació;
- helpers compartits;
- configuració d'idiomes;
- utilitats globals.

Norma:

- si una cosa afecta tota l'app, probablement va ací;
- si només afecta una secció concreta, no ha d'anar ací.

### `src/sections/`

Ací està la major part de la lògica funcional per àrees visibles.

Exemples:

- `src/sections/xat/`
- `src/sections/mur/`
- `src/sections/mercat/`
- `src/sections/events/`
- `src/sections/pobles/`
- `src/sections/mapa/`
- `src/sections/multimedia/`
- `src/sections/notes/`
- `src/sections/dispositius/`
- `src/sections/login/`
- `src/sections/detail/`
- `src/sections/text/`
- `src/sections/profile/`

Esta és la norma més important del projecte:

- si es vol tocar una secció concreta, s'ha d'entrar dins de la carpeta d'eixa secció.

És a dir:

- canviar el mur -> `src/sections/mur/`
- canviar el mercat -> `src/sections/mercat/`
- canviar el xat -> `src/sections/xat/`
- canviar pobles -> `src/sections/pobles/`
- canviar el login -> `src/sections/login/`
- preparar connexions directes o WebRTC -> `src/sections/dispositius/`

Fitxes i detall:

- `src/sections/detail/` guarda la capa genèrica compartida de les fitxes;
- `src/sections/<seccio>/detail/` guarda el comportament específic de la fitxa d'eixa secció;
- el detall de cada secció pot reutilitzar el genèric i personalitzar només el que faça falta.

Això vol dir, per exemple:

- el detall del mur es defineix a `src/sections/mur/detail/`;
- el detall del mercat es defineix a `src/sections/mercat/detail/`;
- el detall dels events es defineix a `src/sections/events/detail/`;
- el detall de pobles es defineix a `src/sections/pobles/detail/`;
- i el marc comú de totes les fitxes continua a `src/sections/detail/`.

Connexions i publicacions des de `Connectar`:

- quan es tria `mur`, el formulari guarda una publicació de mur;
- quan es tria `mercat`, guarda un producte o oferta de mercat;
- quan es tria `events`, guarda un esdeveniment;
- en recarregar, eixos elements tornen a aparéixer en la seua secció corresponent.

La persistència d'estes aportacions es fa amb `src/data/supabaseBackend.js` i es recolza en la taula `section_submissions` quan la BD remota està disponible.

### `src/data/`

Ací està la capa de dades.

Esta carpeta s'encarrega de:

- unir continguts;
- decidir si es llig de Supabase o de fallback;
- transformar la informació a un format usable per la UI;
- i gestionar part de la persistència del xat.

La peça clau és:

- [src/data/supabaseBackend.js](src/data/supabaseBackend.js)

### `supabase/`

Ací està el material necessari per a preparar la BD remota:

- [supabase/schema.sql](supabase/schema.sql)
- [supabase/seed.sql](supabase/seed.sql)

## Com funciona la càrrega de dades

La UI no parla directament amb fitxers dispersos en cada render.

El flux real és:

1. cada secció té el seu contingut base o la seua transformació;
2. `src/sections/<seccio>/detail/` defineix com es pinta la fitxa d'eixa secció;
3. `src/sections/detail/` aporta el shell i els helpers genèrics del detall;
4. `src/data/` agrupa i prepara eixes dades;
5. `src/data/supabaseBackend.js` decidix si llig de Supabase o d'un fallback;
6. `src/app/AppDataContext.jsx` compartix el resultat amb tota l'app;
7. les seccions visuals només pinten les dades ja preparades.

Quan es crea contingut des de `Connectar`:

1. el formulari genera un payload específic per a `mur`, `mercat` o `events`;
2. `src/data/supabaseBackend.js` el guarda en local i, si pot, també en Supabase;
3. en recarregar, eixe element es torna a fusionar amb les dades de la secció corresponent.

Això separa bé:

- contingut;
- persistència;
- transformació;
- i presentació.

## D'on ixen les dades

La variable `VITE_DATA_MODE` controla el comportament.

Modes disponibles:

- `auto`
- `supabase`
- `hybrid`
- `seed`
- `local`

Mode recomanat:

- `auto`

Perquè:

- intenta usar Supabase com a origen principal;
- i, si hi ha algun error temporal, evita que la web quede trencada.

## Xat

El xat funciona així:

- intenta llegir i guardar en Supabase;
- si Supabase falla o no té permisos suficients, manté un fallback local;
- per tant, visualment pot continuar funcionant encara que la configuració remota no estiga perfecta.

Les respostes automàtiques actuals del xat no venen d'una IA real ni d'un model remot.

El comportament actual és este:

- l'historial base de cada conversa ix de seeds i contingut local;
- quan l'usuari escriu, el frontend genera una resposta automàtica local;
- eixa resposta es construïx amb frases predefinides segons el personatge o fil actiu;
- després es guarda igual que un missatge més, en Supabase o en fallback local segons el mode de dades.

Els fitxers clau són:

- [src/sections/xat/chatRuntime.js](../src/sections/xat/chatRuntime.js)
- [src/sections/xat/chatContent.js](../src/sections/xat/chatContent.js)
- [src/app/AppDataContext.jsx](../src/app/AppDataContext.jsx)

En concret:

- `chatRuntime.js` conté `makeChatReply()`, que tria una resposta d'un catàleg tancat de frases;
- la selecció depén del nom o identitat del fil (`iaia`, `andreu`, `vicent`, etc.);
- no hi ha interpretació semàntica real del missatge més enllà d'un toc menor amb l'última paraula en alguns casos curts;
- per tant, és una simulació narrativa de xat, no una IA conversacional real.

## Tres nivells de xat

Per a no barrejar responsabilitats, el projecte hauria de conservar esta separació:

### 1. Xat simulat

És el nivell actual de `src/sections/xat/`.

Característiques:

- està pensat per a UX, proves i ambientació;
- usa frases predefinides;
- no depén d'un model d'IA extern;
- es pot guardar en Supabase o en fallback local igual que qualsevol altre missatge.

Fitxers principals:

- [src/sections/xat/chatRuntime.js](../src/sections/xat/chatRuntime.js)
- [src/sections/xat/chatContent.js](../src/sections/xat/chatContent.js)

### 2. Xat entre dispositius

És el nivell que ara viu en `src/sections/dispositius/`.

Característiques:

- és comunicació directa entre instàncies del portal;
- no parla "com un personatge", sinó com un altre dispositiu o altre portal connectat;
- ha de tindre estat de connexió, desconnexió, pestanyes de canals i historial per peer;
- és el lloc natural per a créixer cap a WebRTC o signaling remot.

Fitxers principals:

- [src/sections/dispositius/DevicesSection.jsx](../src/sections/dispositius/DevicesSection.jsx)
- [src/sections/dispositius/devicesRuntime.js](../src/sections/dispositius/devicesRuntime.js)

### 3. Xat amb IA real

Este nivell encara no està implementat i hauria d'entrar com una capa separada.

Quan arribe:

- no hauria de reutilitzar directament `makeChatReply()` com si fora IA;
- hauria d'estar clar quan l'usuari parla amb una simulació i quan parla amb un model real;
- la crida al model, el control de context i la persistència haurien d'estar separats del xat simulat;
- idealment hauria de tindre un runtime o adaptador propi dins de `src/sections/xat/` o `src/data/`, segons el pes real de la integració.

## Regla d'arquitectura per al futur

La norma recomanada és:

- `chatRuntime.js` per a simulació local;
- `dispositius/` per a connexió entre portals o peers;
- una capa nova i explícita per a IA real.

No convé mesclar estos tres nivells dins del mateix flux sense senyalitzar-ho clarament en la UI.

## Dispositius i connexió directa

El projecte té ara una secció específica en:

- [src/sections/dispositius/DevicesSection.jsx](../src/sections/dispositius/DevicesSection.jsx)

Esta secció ja permet:

- anunciar la presència de la instància actual del portal;
- descobrir altres instàncies obertes;
- llançar peticions de connexió;
- acceptar o rebutjar eixes peticions;
- i enviar missatges directes lleugers entre elles.

La implementació actual usa una capa local en navegador per a comunicar instàncies obertes del mateix portal i deixa este espai preparat per a créixer cap a signaling remot i WebRTC sense haver de reinventar la UX.

## Idiomes

La interfície té sistema d'idiomes.

La preferència es guarda en el navegador amb:

- `socdepoble-language`

Els textos estàtics de la interfície es gestionen des de:

- [src/config/i18n.js](src/config/i18n.js)

## Si es vol tocar alguna cosa

### Cas 1: vol tocar una secció concreta

Ha d'entrar a `src/sections/<seccio>/`.

### Cas 2: vol tocar configuració general

Ha d'entrar a `src/config/`.

### Cas 3: vol tocar lectura o guardat de dades

Ha d'entrar a:

- [src/data/supabaseBackend.js](src/data/supabaseBackend.js)
- [supabase/schema.sql](supabase/schema.sql)
- [supabase/seed.sql](supabase/seed.sql)

### Cas 4: vol tocar textos o continguts base

Ha d'entrar als `*Seed.js`, `*Content.js` o `pageContent.js` de la secció corresponent.

## Fitxers clau

- [src/main.jsx](src/main.jsx)
- [src/app/App.jsx](src/app/App.jsx)
- [src/app/AppDataContext.jsx](src/app/AppDataContext.jsx)
- [src/config/i18n.js](src/config/i18n.js)
- [src/config/sections.js](src/config/sections.js)
- [src/data/supabaseBackend.js](src/data/supabaseBackend.js)
- [DOCUMENTACIO_BASE_DE_DADES.md](./DOCUMENTACIO_BASE_DE_DADES.md)
- [INSTRUCCIONS_SUPABASE.md](../INSTRUCCIONS_SUPABASE.md)

## Resum curt

Si es vol entendre el projecte molt ràpid:

- és una app en `React`;
- arranca amb `pnpm dev`;
- va en `http://localhost:3340/`;
- les seccions es toquen dins de `src/sections/`;
- la configuració global va en `src/config/`;
- i la BD remota es prepara amb `Supabase`.
