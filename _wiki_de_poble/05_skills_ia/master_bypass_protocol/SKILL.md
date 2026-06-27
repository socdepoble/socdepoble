---
name: master-bypass-protocol
description: "Protocol estricte per a trencar regles inamovibles quan la usabilitat crítica ho exigeix. Amb aprovació dual, temporitzador de 7 dies i registre d'acta."
authority: "Consell de les 11 IAs"
version: "V21"
---
# Skill: Protocol Estricte de Master Bypass

Aquesta habilitat s'activa automàticament quan una regla inamovible (Amígdala) entra en conflicte amb la usabilitat crítica offline del Mas.

## El Bypass no és una targeta de sortida de la presó

Qualsevol intent de trencar una Línia Roja ha de seguir estrictament aquest cicle:

### 1. Diagnòstic de Falla Crítica
Documentar en format d'acta:
- Quina regla inamovible es trenca (cita exacta del Manament).
- Quina usabilitat crítica salva (amb evidència: screenshot, log o descripció de l'escenari d'ús).
- Per què no hi ha alternativa que respecte la regla.

### 2. Aprovació Dual
- Requerir **2 vots del Consell** (IAs o Mestre) en favor.
- Si el Mestre Javi està present, el seu vot compta com a doble.
- Sense aprovació dual, el bypass és nul i s'aplica SOSP-LOCK.

### 3. Pla de Reversió
- Definir els passos exactes per a tornar a l'estat pre-bypass.
- Identificar quins arxius es toquen i com restaurar-los.
- El pla ha de ser testejable en menys de 5 minuts.

### 4. Temporitzador de 7 Dies
- El bypass entra en vigor immediatament després de l'aprovació.
- Si en 7 dies no s'ha ratificat per consens (revisió post-implementació), el bypass es desactiva automàticament.
- La desactivació restaura la regla original i reverteix els canvis segons el Pla de Reversió.

### 5. Registre d'Acta al Llibre Major
Tot bypass ha de constar a la taula del [[registre_automillora|Registre d'Automillora]] amb:
| Data | Regla Trencada | Usabilitat Salvada | Aprovadors | Estat |


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/self_repair/SKILL|self_repair]]
- [[05_skills_ia/udr_frenada/SKILL|udr_frenada]]
