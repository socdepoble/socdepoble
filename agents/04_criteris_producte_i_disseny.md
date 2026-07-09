# Agent 04: Criteris de producte i disseny

## Visió funcional

`socdepoble.org` és una xarxa social local orientada a comunitat, proximitat i utilitat quotidiana.

L'aplicació no s'ha de comportar com una demo corporativa ni com una plataforma social genèrica. Ha de transmetre:

- proximitat;
- simplicitat;
- utilitat real;
- identitat local.

## Usuari principal

Ara mateix el perfil central és el `foraster`.

Això implica:

- l'entrada a l'app ha de ser clara i usable sense compte complet;
- els fluxos principals no poden dependre d'una identitat avançada;
- qualsevol pas futur cap a comptes registrats ha de encaixar sense rebentar la UX actual.

## Criteris d'UX

Quan es toque interfície o contingut:

- pensar primer en mòbil;
- prioritzar llegibilitat i contrast;
- donar espai tàctil suficient als controls;
- evitar pantalles carregades o massa tècniques;
- mostrar la informació d'una manera amable i directa.

Referència pràctica heretada del projecte antic:

- producte usable per a persones no tècniques;
- bona visibilitat en contextos de llum dura o pantalles normals;
- interaccions que no exigisquen precisió fina.

## Criteris visuals

No cal copiar literalment el sistema visual antic, però sí conservar-ne la intenció:

- evitar una estètica freda o excessivament corporativa;
- usar contrast suficient;
- mantindre una sensació humana i propera;
- preferir composicions netes abans que ornaments.

Si una secció utilitza targetes, blocs o peces modulars, han de ser:

- clares;
- coherents;
- fàcils de recórrer;
- fàcils de mantindre.

## Criteris de contingut

- evitar text buit, placeholders absurds o Lorem Ipsum si el contingut ha de ser real;
- quan toque escriure copy, preferir llenguatge entenedor i de proximitat;
- no omplir la UI de jerga tècnica si el valor és funcional i no intern.

Quan es toquen fitxes o detall d'una secció:

- primer cal revisar la carpeta específica `src/sections/<seccio>/detail/`;
- només el que siga comú a totes les fitxes ha d'anar a `src/sections/detail/`;
- la personalització local no s'ha de perdre per centralitzar massa.

## Criteris de to

El projecte pot tindre personalitat, però sense convertir cada document o component en un manifest.

Sí que es vol:

- un to humà;
- una veu local;
- una sensació de producte amb trellat.

No es vol:

- una UX recarregada amb metàfores internes incomprensibles;
- mística d'agents per damunt de la claredat;
- decisions de disseny que perjudiquen l'ús quotidià.

## Regla final

Quan hi haja dubte entre "més espectacular" i "més útil", guanya "més útil".
