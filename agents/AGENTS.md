## Objectiu del projecte

Este repositori (`socdepoble.org`) és la reimplementació neta i mantenible del projecte antic `socdepoble`.

`socdepoble.org` és el projecte actual. `socdepoble` és la base antiga de referència, només lectura, útil per a mirar comportaments o copiar fluxos quan calga.

La meta és:

- mantindre compatibilitat funcional amb el projecte antic, o millorar-la;
- simplificar l'arquitectura i el codi;
- facilitar que es puguen tocar seccions concretes sense dependre d'un refactor gran;
- deixar una base preparada per a noves funcionalitats.

## Rutes de referència

### Projecte anterior (només lectura)

- `socdepoble`

### Projecte actual (sí que es modifica)

- `socdepoble.org`

## Regles obligatòries

1. No modificar res de `socdepoble`.
2. Treballar només en `socdepoble.org`.
3. Usar `socdepoble` només per a entendre comportaments, continguts o fluxos que calga reproduir o millorar.
4. Prioritzar sempre simplicitat, mantenibilitat, eficiència i canvis enfocats a la tasca.
5. Evitar refactors no relacionats, encara que el codi puga admetre millores addicionals.

## Estructura que s'ha de respectar

- `src/config`
  Només configuració global, constants, helpers compartits i definicions transversals.
- `src/sections`
  Configuració, maquetació, contingut i runtime específic de cada secció visible.
- `src/data`
  Capa de lectura/escriptura, agregació i fallback entre Supabase i local.

Patró de detall:

- `src/sections/detail/` conté la capa genèrica compartida de les fitxes;
- `src/sections/<seccio>/detail/` conté el comportament específic de la fitxa d'eixa secció.

Regla pràctica:

- si només afecta una secció, va dins de `src/sections/<seccio>/`;
- si afecta tota l'app, probablement va en `src/config/`;
- si afecta persistència o lectura de dades, va en `src/data/`.

## Model de dades obligatori

El sistema ha d'intentar llegir i escriure en Supabase.

Si Supabase falla, no està configurat o no respon:

- la lectura ha de poder caure a dades seed o snapshot local;
- les funcionalitats interactives importants, com el xat, han de continuar funcionant amb persistència local quan siga possible.

Si una secció té la seua pròpia publicació o fitxa editable, la regla és:

- guardar el comportament específic dins de `src/sections/<seccio>/`;
- deixar en `src/sections/detail/` només el que siga realment comú.

## Orientació funcional del producte

L'aplicació està orientada a una xarxa social local.

Ara mateix:

- l'actor principal és l'usuari convidat (`foraster`);
- la UX ha de continuar funcionant sense sistema complet de comptes;
- qualsevol evolució futura ha de deixar espai per a usuaris registrats, contingut propi i interaccions personals.

## Agents del projecte

Els agents i directrius específiques del repositori estan en:

- `agents/README.md`
- `agents/01_context_i_principis.md`
- `agents/02_workflow_execucio.md`
- `agents/03_regles_arquitectura_i_dades.md`
- `agents/04_criteris_producte_i_disseny.md`

Estos documents són una adaptació neta de la visió i criteris útils que s'havien anat deixant en agents i documents dispersos del projecte antic.

Quan hi haja dubtes entre documents, mana este `AGENTS.md` i després el contingut real del codi actual.
