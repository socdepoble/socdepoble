# Agent 02: Workflow d'execució

## Procés obligatori abans de tocar codi

1. Identificar si la tasca afecta una secció, configuració global o dades.
2. Localitzar els fitxers del projecte actual que intervenen de veritat.
3. Mirar el projecte antic només si cal validar comportament, contingut o intenció original.
4. Definir el canvi mínim suficient per resoldre la tasca.
5. Abans del primer efecte lateral, executar `open`, llegir les quatre fonts
   d’autoritat, crear únicament Petorreta + manifest al bootstrap reservat i
   completar `seal` segons `.agents/PROTOCOL_PETORRETA.md`.

La frase d’activació humana orienta la intenció, però no és una autorització
mecànica. Sense lease segellada, només estan permeses lectura, cerca, auditoria
en memòria i eixida per stdout.

## Protocol anti-entropia

Abans de crear fitxers, carpetes o convencions noves:

1. revisar què hi ha ja al repo;
2. reutilitzar l'estructura existent si és suficient;
3. només crear una peça nova si aporta una responsabilitat clara.

No s'ha de duplicar estructura per inèrcia.

## Regles de treball

### Si és una secció concreta

- treballar primer dins de `src/sections/<seccio>/`;
- no moure codi a carpetes globals si continua sent específic;
- intentar que textos, seeds i runtime continuen trobables des de la mateixa secció.

### Si és configuració transversal

- posar-ho en `src/config/`;
- evitar constants o helpers duplicats;
- no convertir `src/config/` en un calaix de contingut de seccions.

### Si és persistència o backend

- tocar `src/data/` i `supabase/` quan pertoque;
- mantindre la política de fallback;
- no repartir lògica de dades remotes per components visuals.

## Criteri d'intervenció

La norma és adaptar abans que refer.

S'ha de preferir:

- una correcció local;
- una extracció menuda;
- una simplificació focalitzada.

S'ha d'evitar:

- reescriure una secció sencera sense necessitat;
- importar macroregles del projecte antic per justificar un canvi simple;
- crear una capa nova només perquè "sona bé".

## Criteri de qualitat

Cada canvi hauria d'intentar deixar:

- menys acoblament;
- menys soroll estructural;
- noms més clars;
- menys lògica duplicada;
- cap regressió visible evitable.

## Criteri de risc

Si una petició implica carregar-se un pilar del sistema actual:

- parar;
- limitar el canvi;
- protegir el comportament existent;
- prioritzar una alternativa conservadora.

## Verificació mínima

Sempre que siga viable:

1. comprovar el flux afectat;
2. assegurar que no s'ha trencat el fallback local;
3. validar que la secció continua sent fàcil de tocar des de la seua carpeta;
4. executar una verificació proporcional al canvi (`build`, prova manual o revisió focalitzada).
5. si hi ha commit, auditar l’arbre preparat exacte i consumir només el rebut
   `git-commit` vinculat al commit resultant.
