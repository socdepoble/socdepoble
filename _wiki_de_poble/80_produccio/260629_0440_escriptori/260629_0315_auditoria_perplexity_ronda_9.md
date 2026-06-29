# AUDITORIA ZERO — EL MAS PURIFICAT (Perplexity)
**Data:** 260629_0315
**Agent Auditor:** Perplexity (Consell de la Petorreta)
**Score Objectiu:** 7.4 / 10

## Resum del Veredicte
Arquitectura offline-first viable però al límit per a l'iPad A10. Requereix mecanismes estrictes de pressupost energètic per a sobreviure a la coincidència de processos pesats (CRDT, RAG).

## 1. Llacunes Arquitectòniques
- **Límits de Dades:** Falta definir els límits exactes entre dades col·laboratives, personals i públiques, i la resolució de conflictes quan hi ha degradació.
- **Pressupost Energètic RAG:** No hi ha criteris per a decidir quan degradar de WebNN/RAG a "simple cerca". Falta un pressupost energètic estricte per sessió i per consulta.

## 2. Contradiccions Residuals
- **Ortografia i Dispersió:** PouchDB vs PuchDB, dispersió per OCR o esporga.
- **Governança Fragmentada:** Es demana una Font Única de Veritat, però l'arquitectura divideix els conceptes en molts arxius. L'engine de contradiccions haurà d'esforçar molt els alias.

## 3. Mètriques Termodinàmiques
- La càrrega paral·lela de CRDT, fusions, Web Workers i RAG pot afonar l'A10 si coincideixen en el mateix cicle.
- Faltan **límits durs**: mida de lot màxima, temps màxim de worker, memòria de vectors.

## 4. Modificació Estructural (Bancal Budget Manager)
Perplexity demana implementar el **"Bancal Budget Manager"**: Un mòdul que decidisca abans de cada cicle si hi ha energia, memòria i temps per fer la tasca. Si no n'hi ha, degrada autòmaticament a lectura, encua, o fa resum semàntic. Aquesta és la clau de l'Autopoiesi pura.

## 5. DAFO
- Destaca que la densitat simbòlica pot generar fricció per a nous contributors.
- Alerta que si la governança es ritualitza molt, el projecte pot semblar una religió més que codi operatiu.


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
