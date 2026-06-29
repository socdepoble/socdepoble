---
name: backup-recovery
description: Estratègia de snapshot diari d'IndexedDB, protocol de recuperació i migracions segures.
authority: Consell de les 11 IAs
version: V21
created_at: 260628_0525
updated_at: 260628_1626
aliases:
  - Backup
  - Recuperació
  - Snapshots OPFS
  - Migració d'Esquemes
---

# 💾 SKILL: Backup, Recovery i Migracions (La Volta Enrere)

> **Visió del Consell d'IAs:** En una aplicació Cloud tradicional (com un SaaS), l'administrador pot apagar el servidor i restaurar la base de dades. En la filosofia *Local-First* del Mas, les dades viuen segrestades als dispositius dels usuaris rurals. Una pèrdua ací, és una memòria cultural esborrada per sempre.

## 🎯 Objectiu
Assegurar implacablement que cap llaurador ni habitant perda dades si l'iPad falla, Safari buida la seua memòria en un pic de RAM, o el document s'ofega per un tancament sobtat de l'aplicació durant una esporga de tombstones.

---

## 🛠️ Normes i Funcions (El Paracaigudes de Dades)

### 1. Protocol de Snapshots (Fotografies del Mas)
La memòria de l'usuari no només resideix en IndexedDB, sinó en còpies de seguretat fredes inabastables per al motor renderitzador.
- **Quan es dispara:** Es realitza un `snapshot` absolutament silenciós de tota la clau idb-keyval. Es llança únicament quan el dispositiu respira (event `visibilitychange`, `pagehide` o quan detecta inactivitat per omissió), no interrompent mai el scroll.
- **Magatzem (OPFS):** Aquesta fotografia es comprimeix fortament (Zstd o equivalent) i s'enterra a l'OPFS (Origin Private File System), lluny de les freqüents i letals purgues asíncrones de l'Storage de Safari.
  - **⚠️ AMNÈSIA DE SAFARI (iOS 15):** Safari esborra tot l'Storage (incloent IndexedDB i OPFS) si l'aplicació no s'obre en 30 dies. Cal educar als usuaris o establir un mecanisme de ping físic/background per evitar l'apocalipsi local.
- **Rotació:** Es guarden un màxim de 3 fotografies en bucle (les més noves esborren les més velles). 

### 2. Rutina de Recuperació (SDP-RECOVERY)
Si al moment de despertar l'aplicació el document Y.js principal brama error per corrupció o asimetria letal entre nodes WebRTC:
1. S'alça la pantalla bloquejant la UI amistosament amb "Refent el Mas...".
2. IndexedDB pateix un esborrat catàrtic (Purga total) per a matar el càncer.
3. El Mas agafa la pàa i desenterra la fotografia viva d'OPFS, descomprimint-la i abocant-la.
4. Es llança una comanda de xarxa per pescar l'estat dels altres llauradors (els State Vectors que falten) i recuperar exactament les hores mortes d'entre el snapshot i el trencament.

### 3. Migracions de Dades (Schema Migrations Infinits)
Quan Sóc de Poble avança a la fase 2.0 i necessita un tauler d'anuncis nou, les variables canvien.
- Y.js no té un esquema (Schema-less), però la UI VanillaJS espera objectes complets. 
- **La Llei de Ferro de la Migració:** Mai s'esborra una columna antiga. Es construeix una de nova (ex: `date` es manté inactiu, `date_v2` passa a ser Unix Epoch). D'esta manera evitem crashear l'App d'un senyor major que encara no ha obert internet des de fa mesos i utilitza la versió antiga de Sóc de Poble.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per connectar aquest sistema de seguretat amb el funcionament del Mas:
- [[05_skills_ia/crdt_optimitzacio/SKILL|Optimització CRDT]] (Capa prèvia abans que els `Tombstones` s'isquen de les mans i provoquen la caiguda).
- [[05_skills_ia/self_repair/SKILL|Self Repair]] (L'eina de l'agent IA per frenar desastres de codi. La Recovery ací llistada és per desastres d'usuari).
- [[04_arquitectura_disseny/arquitectura_cognitiva|Arquitectura Cognitiva]] (Regles globals de conservació).

- [[00_index|Índex Central]]
