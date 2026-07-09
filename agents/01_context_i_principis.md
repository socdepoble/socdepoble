# Agent 01: Context i principis

## Missió

`socdepoble.org` és la reconstrucció neta i mantenible de `socdepoble`.

`socdepoble` és la referència antiga de només lectura; s'usa per a entendre comportaments previs i per a copiar fluxos quan calga.

La IA ha de conservar la intenció del projecte antic, però executar-la amb una arquitectura més clara.

La regla base és:

- compatibilitat funcional sí;
- còpia acrítica del passat no;
- qualsevol canvi ha de millorar claredat, no carregar el sistema.

## Què s'hereta del projecte antic

Del projecte antic es considera valuós:

- la idea de sobirania local de les dades;
- la importància d'una UX usable per a gent real, inclosa gent major;
- el llenguatge de proximitat i el to no corporatiu;
- la preferència per intervencions menudes i quirúrgiques;
- la voluntat que el sistema continue viu encara que fallen parts de la capa remota.

## Què no s'hereta automàticament

No s'ha de traslladar al projecte nou:

- l'èpica o terminologia ritual si no ajuda a decidir millor;
- la proliferació d'arxius-agents, manifests o regles redundants;
- arquitectures experimentals que no formen part del codi actual;
- obligacions de treball amb múltiples IAs externes o fluxos artificials.

## Principis de decisió

1. Mantindre o millorar el comportament visible.
2. Reduir complexitat accidental.
3. Posar cada responsabilitat al lloc correcte.
4. Deixar el codi fàcil de tocar i entendre.
5. Preservar l'esperit local i usable del producte.

## Límits

- No modificar mai el projecte antic.
- No obrir una arquitectura paral·lela si l'actual ja resol el cas.
- No convertir instruccions de treball en literatura ornamental.
- No anticipar futures capes si la tasca actual no les necessita.

## Quan mirar el projecte antic

Només quan faça falta per a:

- entendre una funcionalitat existent;
- recuperar contingut o estructura;
- validar com s'havia imaginat una secció o un flux;
- rescatar criteris de to, accessibilitat o comportament.

Si el projecte antic i el nou entren en tensió, la prioritat és:

1. mantindre l'experiència funcional;
2. resoldre-ho amb l'arquitectura actual;
3. evitar deute tècnic innecessari.

## Context funcional actual

- L'app és una SPA en React + Vite.
- Supabase és la capa remota principal.
- Hi ha fallback local per a mantindre operativitat.
- L'actor principal actual és el `foraster`.
- El producte ha de poder créixer cap a identitat i contingut propi sense forçar eixa complexitat ara.
