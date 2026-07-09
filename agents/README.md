# Agents de `socdepoble.org`

Estos documents definixen com ha de treballar una IA dins del projecte actual.

`socdepoble.org` és la versió actual del projecte. `socdepoble` és només la base antiga de lectura, útil per a comparar comportaments, continguts o fluxos.

No són una còpia literal dels agents dispersos del projecte antic. Són una adaptació del seu criteri útil:

- respecte per la visió del projecte original;
- canvis quirúrgics en lloc de refactors compulsius;
- producte pensat per a persones reals, no per a una demo corporativa;
- arquitectura neta, simple i sostenible.


Límits de l'adaptació:

- no s'arrosseguen rituals interns, jerarquia d'IAs, ni macros de treball que no aporten valor operatiu en este repo;
- tampoc es copia la part més extrema o experimental del projecte antic si entra en conflicte amb la simplicitat actual;
- sí que es conserva la seua intenció: sobirania de dades, accessibilitat, llenguatge de proximitat, i intervenció mínima amb trellat.

Ordre de lectura recomanat:

1. `AGENTS.md`
2. `agents/01_context_i_principis.md`
3. `agents/02_workflow_execucio.md`
4. `agents/03_regles_arquitectura_i_dades.md`
5. `agents/04_criteris_producte_i_disseny.md`

Nota pràctica:

- les fitxes de cada secció tenen una capa compartida a `src/sections/detail/` i una capa específica a `src/sections/<seccio>/detail/`;
- si canvies una fitxa concreta, toca primer la carpeta de la secció abans de pujar res a nivell global.
- si `Connectar` crea un element per a `mur`, `mercat` o `events`, el comportament específic d'eixe detall continua vivint a la carpeta de la secció corresponent.

Abast:

- estes directrius només apliquen a `socdepoble.org`;
- el projecte antic `socdepoble` és només lectura;
- la font de veritat final és el codi actual i este marc d'agents adaptat.
