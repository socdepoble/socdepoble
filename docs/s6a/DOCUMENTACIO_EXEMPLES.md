# Exemples d'organització del projecte

El projecte està organitzat per carpetes segons la funció de cada part.
La idea principal és molt simple:

- si es vol tocar una secció concreta, s'ha de modificar dins de `src/sections/`;
- si es volen tocar dades o persistència, s'ha de modificar dins de `src/data/`;
- si es vol tocar configuració global, s'ha de modificar dins de `src/config/`.

## Com s'ha de pensar el projecte

El projecte no està pensat per a buscar-ho tot en un sol lloc.
Cada secció té la seua pròpia carpeta i, quan cal tocar una funcionalitat concreta, s'ha d'anar al lloc correcte.

Exemples:

- el mur es toca a `src/sections/mur/`;
- el mercat es toca a `src/sections/mercat/`;
- els events es toquen a `src/sections/events/`;
- el xat es toca a `src/sections/xat/`;
- els pobles es toquen a `src/sections/pobles/`.

## Exemple de fitxes i detall

Quan una secció té una fitxa o un detall, la norma és esta:

- la part compartida de totes les fitxes va a `src/sections/detail/`;
- la part específica d'una fitxa d'una secció va a `src/sections/<seccio>/detail/`.

Això vol dir:
- si s'ha de canviar la fitxa d'un producte del mercat, s'ha de mirar `src/sections/mercat/detail/`;
- si s'ha de canviar la fitxa d'un element del mur, s'ha de mirar `src/sections/mur/detail/`;
- si s'ha de canviar la fitxa d'un event, s'ha de mirar `src/sections/events/detail/`.
- si es vol canviar alguna cosa en general per a totes les fitxes, s'ha de mirar en `src/sections/detail/`.

## Regla fàcil de recordar

Si el canvi afecta només una secció:

- entra primer a `src/sections/<seccio>/`.

Si el canvi afecta tota l'app:

- mira `src/config/`.

Si el canvi afecta lectura, escriptura o fallback de dades:

- mira `src/data/`.

## Exemples de prompts

Si volem modificar/ampliar una secció que ja tenim:
"Ajusta la secció Pobles perquè el llistat siga més compacte. Modifica el disseny perquè es mostren 3 pobles per fila en escriptori (3 columnes), amb un disseny responsive per a pantalles més petites."

Si volem crear una nova secció:
Crea una nova secció "Comarques". Ha de mostrar un llistat de totes les comarques. En fer clic en una comarca, s'ha d'obrir el detall de la comarca i mostrar tots els pobles que hi pertanyen.