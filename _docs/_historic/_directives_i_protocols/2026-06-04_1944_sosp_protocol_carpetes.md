# Protocol Anti-Entropia de Carpetes (Nomenclatura i Estructura)

> [!CAUTION]
> **Objectiu d'aquesta Skill:** Evitar la duplicitat de directoris, el caos estructural i l'esquizofrènia d'arxius (ex: tindre `_etnografia_i_llibres` i `_etnografia_llibres` al mateix temps). Qualsevol IA abans de crear una carpeta ha de processar aquest protocol.

## 1. El Problema (L'Entropia)
Els sistemes d'IA (inclòs jo mateix) tenim tendència a crear directoris nous sobre la marxa quan no trobem el que busquem a la primera. Això genera un arbre de fitxers brut, trenca les importacions relatives i genera desordre. En una Masía, no pots tindre dues habitacions que es diguen "El Rebost" i "El_Rebost_2". 

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

---
> *Aplicant aquest Trellat, mantenim el disc dur tan net com l'era de la Masía.*
