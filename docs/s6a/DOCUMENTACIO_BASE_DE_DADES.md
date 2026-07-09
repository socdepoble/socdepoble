# Base de dades

## Idea general

El projecte treballa amb una única base de dades remota en `Supabase`.

La web intenta llegir el contingut des d'eixa BD. Si la BD no està configurada, si falta alguna taula o si hi ha un error temporal de lectura, el projecte pot continuar funcionant amb dades locals de suport, sempre que el mode de dades ho permeta.

La peça central d'esta lògica és:

- [src/data/supabaseBackend.js](src/data/supabaseBackend.js)

## Què guarda la BD

La web espera quatre blocs principals:

- `app_content`
  Contingut principal del portal: mur, mercat, pobles, events, multimèdia, notes i pàgines informatives.
- `chat_threads`
  Converses o fils del xat.
- `chat_messages`
  Missatges de cada conversa.
- `section_submissions`
  Publicacions creades des de `Connectar` que després es fusionen amb mur, mercat o events.

En resum:

- quasi tot el contingut visible del portal pot vindre de `app_content`;
- el xat llig de `chat_threads` i `chat_messages`;
- les aportacions noves de `Connectar` es guarden en `section_submissions` i es projecten en la seua secció;
- i, si en un futur hi ha login real, esta mateixa base servirà per a separar les dades per usuari.

## Com llig la web

El flux real és este:

1. `src/data/supabaseBackend.js` prova a llegir la informació des de Supabase.
2. Eixes dades es transformen al format intern que necessita l'app.
3. `src/app/AppDataContext.jsx` reparteix el resultat a tota la interfície.
4. Les seccions visuals consumixen eixes dades ja preparades.

Això vol dir que:

- la UI no “consulta una taula diferent” cada vegada que pintes una targeta;
- primer es carrega el conjunt de dades;
- i després la interfície les reutilitza.

## Com es guarda

La persistència activa més important ara mateix és el xat.

Quan s'envia un missatge:

1. la web intenta inserir-lo en `chat_messages`;
2. si Supabase respon bé, el missatge queda persistit en remot;
3. si Supabase falla o no té permisos suficients, la web no es trenca i el missatge es conserva en local com a fallback.

Per tant:

- la millor situació és guardar en Supabase;
- però, mentre la configuració no estiga perfecta, el projecte continua funcionant.

Quan s'envia una publicació des de `Connectar`:

1. la web intenta inserir el registre en `section_submissions`;
2. eixe registre es transforma en un ítem visible del mur, del mercat o dels events;
3. en recarregar, l'element es torna a carregar en la seua secció corresponent.

## Modes de dades

La variable `VITE_DATA_MODE` controla com es comporta la càrrega.

- `auto`
  Mode recomanat. Si hi ha Supabase configurat, prova la BD i cau a fallback si alguna lectura falla. Si no hi ha Supabase configurat, usa les dades del codi.
- `supabase`
  Força la lectura remota.
- `hybrid`
  Prova Supabase i, si falla, cau a local o seed.
- `seed`
  Carrega directament les dades del codi.
- `local`
  Usa un snapshot guardat al navegador.

Per a qui manté el projecte, el mode recomanat és:

- `VITE_DATA_MODE=auto`

Per què:

- intenta funcionar amb Supabase com a origen principal;
- però no deixa la web en blanc si hi ha alguna incidència temporal.

## Què es guarda al navegador

Hi ha algunes claus locals de suport:

- `socdepoble-app-snapshot-v1`
- `socdepoble-dev-chat-messages`
- `socdepoble-chat-conversation-map`
- `socdepoble-language`

Estes claus no substituïxen Supabase.

Servixen per a:

- mantindre el xat si la part remota falla;
- guardar preferències com l'idioma;
- i evitar que l'experiència es trenque durant proves o configuracions incompletes.

## Quan podem dir que la BD està ben muntada

La BD està ben preparada quan passa tot açò:

- el mur carrega dades reals;
- el mercat carrega dades reals;
- pobles, events, multimèdia i notes carreguen dades reals;
- el xat llig converses;
- el xat pot guardar missatges;
- i en recarregar la pàgina, la informació continua estant disponible.

## Què s'ha de revisar

S'ha de comprovar:

- que les taules existixen;
- que tenen dades inicials;
- que les polítiques de lectura estan ben configurades;
- que `chat_messages` permet inserció mentre encara no hi ha login real;
- i que `section_submissions` permet guardar i llegir les publicacions creades des de `Connectar`.

Si falta alguna d'estes peces:

- la web pot continuar funcionant en fallback;
- però no es podrà dir que “ja està tot en BD”.

## Fitxers importants

- [src/data/supabaseBackend.js](src/data/supabaseBackend.js)
- [src/app/AppDataContext.jsx](src/app/AppDataContext.jsx)
- [supabase/schema.sql](supabase/schema.sql)
- [supabase/seed.sql](supabase/seed.sql)
- [.env.example](.env.example)
- [INSTRUCCIONS_SUPABASE.md](INSTRUCCIONS_SUPABASE.md)
