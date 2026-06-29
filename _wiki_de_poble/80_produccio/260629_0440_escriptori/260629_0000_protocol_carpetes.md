# Protocol Anti-Entropia de Carpetes (Nomenclatura i Estructura)

> [!CAUTION]
> **Objectiu d'aquesta Skill:** Evitar la duplicitat de directoris, el caos estructural i l'esquizofrènia d'arxius (ex: tindre `_etnografia_i_llibres` i `_etnografia_llibres` al mateix temps). Qualsevol IA abans de crear una carpeta ha de processar aquest protocol.

## 1. El Problema (L'Entropia)
Els sistemes d'IA (inclòs jo mateix) tenim tendència a crear directoris nous sobre la marxa quan no trobem el que busquem a la primera. Això genera un arbre de fitxers brut, trenca les importacions relatives i genera desordre. En una Mas, no pots tindre dues habitacions que es diguen "El Rebost" i "El_Rebost_2". 

## 2. Regla d'Or: Exploració Abans de Creació
**MAI, sota cap concepte, es crearà una carpeta nova sense abans explorar el directori actual.**
Abans d'executar un `mkdir` o escriure un arxiu en una ruta nova, la IA **ha de llegir el contingut del directori pare** per comprovar si ja existeix una carpeta semànticament idèntica.
- Si vas a crear `_arquitectura_del_sistema`, i ja existeix `_arquitectura_sistema`, utilitza la que ja existeix.

## 3. Convenció de Noms (El Lèxic)
Tota l'estructura profunda del projecte Sóc de Poble segueix una nomenclatura específica:
- **Idioma:** Sempre en valencià.
- **Format:** `snake_case` en minúscules (ex: `gestio_projecte`, no `GestioProjecte`).
- **Nivell Core:** Les carpetes d'estructura principal, documentació profunda o configuració sensible porten un guió baix davant per obligar el sistema a llistar-les primer (ex: `_docs`, `_arquitectura_sistema`, `_disseny_ux_i_marca`).
- **No fer servir nexes innecessaris:** Es prefereix `_etnografia_llibres` abans que `_etnografia_i_llibres`. La concisió mana.

## 4. Com Actuar davant d'una Duplicitat (Procediment de Purga)
Si una IA detecta dues carpetes duplicades (com l'incident `_etnografia_i_llibres` vs `_etnografia_llibres`), la directriu és:
1. Informar immediatament a l'usuari humà ("Mestre, he trobat un tumor estructural").
2. Demanar permís per unificar el contingut cap a la carpeta que tinga el nom més curt i normatiu.
3. Esborrar la carpeta innecessària.

## 5. El Mapa de el Mas (Estructura de Directoris Estricta)
Aquest és el mapa sagrat de l'aplicació (`src/`). Tota nova funcionalitat ha de tindre el seu contenidor natural ací, sense inventar carpetes noves:
- **/src/app/**: L'entrada al sistema. `App.jsx`, providers (`context/`), entry points i CSS arrel. L'escala principal.
- **/src/components/ui/**: Elements bàsics natius (botons, inputs, modals xicotets). La ferreteria.
- **/src/components/core/**: Peces invisibles o estructurals (SEO, rutes mestres, guardes de seguretat). Els fonaments.
- **/src/components/layout/**: Peces estructurals de disseny visual (barres de navegació, peus de pàgina). La bastida.
- **/src/components/features/**: Sistemes funcionals tancats i grans (ex: galeria, editor, calendari). Les estances principals.
- **/src/pages/**: Lògica de vistes de pàgina senceres (rutades a `react-router`), normalment organitzades per àmbits (`public`, `auth`, `community`, `admin`).
- **/src/data/**: Informació pura estàtica en JS/JSON (textos durs, dades de mock, arxius de configuració de l'IA). El rebost.
- **/src/domain/**: Lògica de negoci agnòstica de React, gestors de dades externs.
- **/src/hooks/**: Lògica de cicle de vida de React encapsulada.
- **/src/utils/**: Funcions pures auxiliars (matemàtiques, processament de dates, formateig). Eines soltes.
- **/src/workers/**: Lògica de fons i Web Workers autònoms (sync, sqlite). Les màquines del camp.

> *Aplicant aquest Trellat, mantenim el disc dur tan net com l'era de el Mas.*


---
## 🔗 Registre Històric
- Aquest document està indexat a: [[90_arxiu_historic/00_historial_sessions|Historial de Sessions]]


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
