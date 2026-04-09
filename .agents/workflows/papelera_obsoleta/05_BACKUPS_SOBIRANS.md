> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/05_BACKUPS_SOBIRANS.md`

---
description: Protocol d'Auditoria i Execució de Còpies de Seguretat Sobiranes (JSON i SQL) per a garantir el blindatge de Sóc de Poble.
---

# 🛡️ 05_BACKUPS_SOBIRANS: Protocol de Còpies de Seguretat

> La memòria del poble no depèn de servidors aliens, sinó de les mans del Mestre. Sense backup, no hi ha res.

Aquest workflow estableix l'obligatorietat, la freqüència i el mètode d'execució de les còpies de seguretat de **Sóc de Poble**, d'acord amb la filosofia del Tancament Sobirà.

## 1. Obligatorietat de les Còpies
Qualsevol canvi crític estructurat (nous agents, taules, o canvis massius al codi base) requereix immediatament després efectuar i descarregar una còpia de seguretat manual a través de les següents vies:
- **Codi font:** Commit i push a GitHub.
- **Base de dades:** Exportació de dades.

## 2. Modes d'Exportació

### 2.1 Mètode d'Emergència Local (JSON d'Alta Velocitat) ⚡
Ideal per a petites migracions, pèrdues temporals de connexió a la consola de Supabase o abans d'una actualització del codi. Aquest mètode és completament autosuficient.

1. Navegar fins al **Panel d'Administrador** des de local.
2. Localitzar el mòdul de **Governança de la Memòria (Tancament Sobirà)**.
3. Fer clic al botó roig d'exportació d'emergència.
4. Desar immediatament a la safata segura (`/safata_entrada` o un directori xifrat).

### 2.2 Mètode Canònic Tècnic (SQL via pg_dump i GitHub Actions) 🗄️
Ús periòdic mensual o setmanal fort, que agrupa esquemes, dades estructurals, procediments i triggers de manera transaccional.

1. Mitjançant terminal local o l'automatització CRON del workflow de GitHub, demanem un procés de **pg_dump**.
2. Garantir el volcatque de les taules "vital" de publicacions i usuaris al mateix temps (`roles`, `agent_responses`, etc.).
3. Descarregar des dels artefactes de GitHub / Correu / Directori Segur i arxivar l'`.sql`.

## 3. Periodicitat i Auditories de Dades
- Com a regla d'or de la *Tia Maria*, el sistema ha de realitzar un control d'integritat per revisar si els últims usuaris afegits estan a l'última còpia exportada.
- No apagar els servidors de desenvolupament en fites massives sense confirmar que tot el pes cau sobre una còpia neta.
- Les dades no són *d'ells* (el núvol), són *nostres* (la masia).
