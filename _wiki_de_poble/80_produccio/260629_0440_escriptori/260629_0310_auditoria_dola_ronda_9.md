# AUDITORIA ZERO — EL MAS PURIFICAT (Dola)
**Data:** 260629_0247
**Agent Auditor:** Dola (Consell de la Petorreta)
**Score Objectiu:** 9.2 / 10

## Resum del Veredicte
L'esporga ha estat quirúrgica. Entropia gairebé a 0%. No obstant això, el sistema no és autopoètic encara i hi ha vulnerabilitats extremes en iOS 15 (purga d'OPFS) i desincronitzacions llargues (CRDT).

## 1. Llacunes Arquitectòniques
- **Purga d'OPFS en iOS 15 (Crític):** Safari esborra tot l'OPFS i IndexedDB si l'aplicació no s'obri en 28-30 dies per alliberar espai. Aquesta limitació destrueix l'assumpció de "Backup Indestructible".
- **Desincronització CRDT Llarga:** Si un iPad torna al cap de 30 dies, el GC ja ha esborrat els tombstones. Y.js pot generar corrupció silenciosa sense regles per a aquest escenari.
- **Split-brain en Malla:** Faltan regles de majoria o timestamps híbrids si dos trossos de la xarxa mesh es separen i es retroben mesos després.
- **Handshake Rural (QR):** No hi ha SKILL formalitzada (màquines d'estat, errors, reintents).
- **RAG Edge sense Contracte:** No hi ha mecanisme tècnic per obligar el model a dir la "Veritat en Dos Miralls".

## 2. Contradiccions Residuals
- **FPS:** Es demanen <45 (esporga), 60 (objectiu) i 30 (mínim). Cal unificar.
- **Anglicismes:** Es prohibeixen absolutament (`regla_de_capcalera`) vs Es permeten per fricció (`governanca`).
- **SOSP-LOCK vs SDP-LOCK.**
- **Carpetes 80 i 90:** Excloses a la portada, indexades a l'índex.

## 3. Mètriques Termodinàmiques i Límits
- 15MB de tombstones = 200-300MB de RAM real.
- Falten llindars progressius: 50% (neteja), 65% (compactació), 80% (bloqueig de lectura).
- Workers de iOS 15 moren als 30s en segon pla.

## 4. Modificació Única (Autopoiesi Pura)
Crear `TRELLAT_AUTOPOIESIS.js` (Vanilla JS < 4KB): Un bucle cada 15 minuts que llig mètriques i s'autoesporga de forma autònoma, avisant a l'usuari només si hi ha accions crítiques.

## 5. DAFO
Confirma la immensa viabilitat del projecte (10-15 anys en A10) sempre que s'implementen les proteccions físiques esmentades.


---
**Enllaç orgànic per netejar el graf**: [[00_index_escriptori]]
