# Agent 03: Regles d'arquitectura i dades

## Regles d'estructura

### `src/config/`

Ací només van peces globals:

- definicions de seccions;
- configuració comuna;
- constants transversals;
- helpers reutilitzables;
- i18n global;
- adaptadors compartits entre seccions.

No posar ací contingut exclusiu d'una secció.

### `src/sections/`

Cada secció ha de ser tan autònoma com siga raonable.

Patró recomanat:

- `*Section.jsx` per a la vista principal;
- `*Content.js` per a preparació o transformació de contingut;
- `*Seed.js` per a dades locals base;
- `*Runtime.js` o helpers locals si hi ha comportament específic.

Patró de detall:

- `src/sections/detail/` per a shell i helpers genèrics de les fitxes;
- `src/sections/<seccio>/detail/` per a la configuració i el render específic de la fitxa d'eixa secció.

Una necessitat pròpia d'una sola secció s'ha de resoldre dins de la seua carpeta abans de fer-la global.

### `src/data/`

Ací va la capa d'origen de dades:

- lectura remota;
- escriptura remota;
- fallback local;
- snapshots locals;
- agregació i normalització per a la UI.

La UI no hauria de prendre decisions de backend que puguen viure ací.

## Política de dades

La política obligatòria del projecte és:

1. intentar llegir i escriure en Supabase quan estiga disponible;
2. si falla, caure a dades locals, snapshot o seed;
3. mantindre l'experiència usable encara que la capa remota no responga.

## Aplicació pràctica del fallback

- el xat ha de poder continuar funcionant amb persistència local quan siga possible;
- les seccions de contingut han de poder renderitzar-se amb seed o snapshot;
- no s'ha de deixar una pantalla inútil si hi ha un fallback acceptable;
- els errors remots s'han de degradar amb trellat, no trencar tota la UX.

## Regles de mantenibilitat

- si es vol canviar una secció, s'ha de poder entrar a `src/sections/<seccio>/` i trobar el que importa;
- si vol canviar textos o contingut base, això ha d'estar en fitxers previsibles;
- si vol canviar una fitxa concreta, ha de trobar `src/sections/<seccio>/detail/` abans de mirar `src/sections/detail/`;
- si es crea una utilitat nova, primer cal demostrar que és realment transversal.

## Regla específica per a converses

No s'han de mesclar sense criteri estos tres nivells:

- xat simulat local;
- xat entre dispositius;
- xat amb IA real.

Norma pràctica:

- el xat simulat viu en `src/sections/xat/`;
- la connexió entre dispositius viu en `src/sections/dispositius/`;
- una futura IA real hauria de tindre una capa pròpia o un runtime explícit, no disfressar-se de simulació.

## Regles de creixement futur

El projecte ha d'estar preparat per a:

- usuaris registrats;
- contingut personalitzat;
- més interaccions socials;
- més persistència remota.

Però això no justifica complicar el present.

Norma:

- dissenyar amb espai per a créixer;
- implementar només allò que la tasca actual necessita.
