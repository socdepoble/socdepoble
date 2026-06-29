---
name: crdt-optimitzacio
description: Optimització termodinàmica dels arbres CRDT (Y.js). Gestiona la càrrega de Tombstones, l'ús de RAM i l'Homeostasi.
authority: Consell de les 11 IAs
version: V22
tags:
  - crdt_offline
  - termodinamica
created_at: 260628_0525
updated_at: 260628_1626
aliases:
  - Optimització CRDT
  - Homeostasi CRDT
  - Garbage Collection
  - Y.js
---

# 📉 SKILL: Optimització CRDT i Termodinàmica de Memòria

> **Visió del Consell d'IAs:** En aplicacions Offline-First amb Y.js, l'esborrat de dades no destrueix realment la informació; la marca com a "Tombstone". Açò provoca l'ofegament silenciós de dispositius amb poca memòria com l'iPad A10. Aquesta SKILL és el salvavides que compacta l'historial.

## 🎯 Objectiu
Controlar i mantenir la salut dels arbres de dades locals (CRDT), evitant que l'aplicació s'ofegue en la RAM a causa de les "làpides" (`tombstones`) invisibles i de la fragmentació de l'historial.

---

## 🛠️ Normes i Funcions d'Homeostasi

### 1. L'Asfíxia dels Esborrats (El Problema)
Y.js mai esborra absolutament res perquè necessita l'historial per a poder resoldre possibles conflictes de sincronització si un dispositiu que ha estat dies fora de línia es connecta sobtadament. Aquesta memòria implacable (les `tombstones`) fa que 1MB de text pur es puga convertir ràpidament en 15MB de memòria RAM.

### 2. El Protocol d'Aspiració i Aïllament (Web Workers)
Aquesta SKILL exigeix que tot deserialitzat superior a 5MB es faça en un Web Worker asíncron. El *Main Thread* no pot congelar-se.
- **Llindar d'Alerta:** Si l'ús de la base de dades local (`idb-keyval`/OPFS) supera el 70% del pressupost o si el document Y.js principal excedeix els 15MB.
- **Quan s'executa?:** El compactatge o "Garbage Collection" es llança en segon pla dins del Web Worker. En Safari/iOS (on no hi ha `requestIdleCallback`), s'usa temporització delegada per a no ofegar l'A10.

### 3. La Transfusió de Dades (Swap Atòmic) i Risc a iOS
iOS Safari és implacable suspenent Web Workers en segon pla si l'usuari canvia de pestanya o bloqueja l'iPad. Per evitar que una interrupció sobtada (tall de corrent biològic) corrompa el CRDT mentre s'exporta, s'aplica el canvi en calent (Swap Atòmic):
1. El Web Worker exporta l'estat actual consolidat (`Y.encodeStateAsUpdate`).
2. S'emmagatzema en una taula/arxiu temporal independent (`mas_data_tmp`). L'estat original de l'`idb-keyval` NO es toca.
3. Únicament si el Worker aconsegueix tornar a la vida, confirma l'èxit i valida el fitxer, el `Main Thread` autoritza sobreescriure la taula oficial i destruir les escombraries. Mai es fa in-place.

### 4. Sharding Termodinàmic (La Verema)
L'estratègia definitiva contra el creixement infinit (*Append-only log*) d'Y.js.
- **Cicle de Vida (Mètrica Física):** La Verema ja no depén del temps, sinó exclusivament del pes. El sistema tanca el document `mur_actual.yjs` automàticament just quan assoleix els **10MB exactes**.
- **Congelació:** Es consolida l'estat pur en un JSON pla comprimit i s'arxiva a l'OPFS (Arxiu Fred de només lectura).
- **Reneixement:** S'inicialitza un `Y.Doc` completament verge.
- **Efecte:** El consum de RAM del tractor torna a zero cada cicle `O(1)`. Si es busca el passat, es llig el JSON pla sense instanciar el motor CRDT.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per entendre com les limitacions afecten altres parts del sistema, visita:
- [[05_skills_ia/consola_termodinamica/SKILL|Consola Termodinàmica]] (On es monitoritzen les `Tombstones` abans d'executar l'acció).
- [[05_skills_ia/sequia_mare/SKILL|Sèquia Mare]] (Per veure com aquestes dades es mouen de forma asíncrona per la xarxa).
- [[05_skills_ia/backup_recovery/SKILL|Backup i Recovery]] (Procediment extrem si l'homeostasi falla i la base de dades es corromp).

- [[08_capacitats/rendiment|Rendiment i Termodinàmica]]

- [[00_index|Índex Central]]
