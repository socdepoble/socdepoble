# 🚜 ACTA D'AUDITORIA: LES 6 PESSIGOLLES DE LA V25 (RONDA 10)

**Data:** 260629_0400
**Emès per:** IAIA MarIA (Recopilació de Copilot, DeepSeek i Dola)
**Objectiu:** Llistar les correccions menors i mecanismes de seguretat asíncrona pendents per garantir la supervivència de 100 anys.
**Estat:** Pendent d'Implementació (Ronda 11 - Codi Real)

---

## El Veredicte del Consell
Tots els auditors (Copilot, DeepSeek, Dola) han validat la cirurgia de la V25. 
- S'assoleix un nivell de puresa de **Pedra Seca** gairebé perfecte.
- Notes rebudes: 7/10 (Copilot cec), 9.7/10 (DeepSeek), 9.2/10 (Dola).

## Les 6 "Pessigolles" Asíncrones (Llista de Tasques)
L'arquitectura aguanta segles si ningú la toca. Però l'execució en paral·lel de la memòria pot causar friccions tèrmiques. Aquest és el **Checklist** que haurem d'implementar al codi i esbossar a les SKILLS per arribar al 10 absolut:

### 1. El Swap Atòmic de "La Verema" (Rollback i Lock)
- **Problema:** Si l'usuari escriu mentre es fa la compactació a JSON, o la bateria cau a meitat de procés, el Mas es corromp.
- **Solució a programar:** Implementar un `Snapshot Lock` (bloqueig síncron d'escriptura durant els mil·lisegons d'exportació) i establir un protocol de Rollback si l'arxiu `mas_data_tmp` es queda penjat per un kill d'iOS.

### 2. Thundering Herd (L'Allau de les Iaies)
- **Problema:** Tots els dispositius despertant a les 03:00 per fer la poda o sincronitzant la xarxa malla de colp quan obrin l'App.
- **Solució a programar:** Implementar **Jitter** (factors de temps aleatoris) en els `setTimeout` i `setInterval` de sincronització o Verema per a no saturar el servidor local o la xarxa WiFi. Un *backoff exponencial*.

### 3. Autopoiesi Agressiva (Filtre Anti-Bombardeig)
- **Problema:** El Web Worker podria acumular centenars de propostes de poda o executar-les ofegant el "Main Thread".
- **Solució a programar:** Executar exclusivament usant `requestIdleCallback` (o timeout delegat a iOS) i imposar un **límit màxim de propostes pendents** perquè el Mas no s'obsessione a netejar-se a si mateix.

### 4. GC Oportunista (Emergency Tombstones Limit)
- **Problema:** Si l'usuari passa molt de temps sense internet, els tombstones (escombraries de Y.js) poden disparar-se abans del cicle de compactació mensual o de 7 dies.
- **Solució a programar:** Afegir un llindar d'emergència. Si la brossa CRDT supera el 40% de pes extra o la RAM toca un cert límit (400MB), forçar una "Verema d'Emergència" sense esperar al mes.

### 5. Detecció física de WebNN
- **Problema:** Un bloqueig teòric a la Wiki no evita que una llibreria furtiva cride a l'NPU.
- **Solució a programar:** Escriure codi pur `if (device.RAM < 2GB) block_inference()`.

### 6. Signatures Ed25519 i Xifratge Post-Quàntic
- **Problema:** Les claus criptogràfiques s'ancoren a OPFS. Què passa si l'usuari canvia d'iPad i el backup no porta les claus, o aquestes caduquen a llarg termini? A més, Javascript pur pot ser ineficient per al xifratge massiu.
- **Solució a programar:** Detallar el protocol de rotació de claus Ed25519 (i el seu suport físic amb el "Ritual de Pulsació"). Explorar l'ús de mòduls **WebAssembly (WASM)** per delegar el xifratge i descarregar el Main Thread de l'A10.

### 7. Vàlvula de Seguretat a la Sèquia Mare (Sub-batching)
- **Problema:** Si un dispositiu offline acumula dades durant setmanes i es connecta, la ràfega de sincronització ofegarà el "Main Thread" i causarà un tancament per Jetsam.
- **Solució a programar:** Implementar un "Regulador de Cabal" que fragmente els enviaments massius en sub-lots de 50 esdeveniments.

### 8. Handshake Rural Unidireccional
- **Problema:** L'escaneig de QR inicia el pont WebRTC, però si falla a meitat no hi ha feedback visual. Les dades queden orfes.
- **Solució a programar:** Afegir la màquina d'estats a la UI: `PENDENT` → `SINCRONITZANT` → `CONSOLIDAT` amb un "Avisador Efímer" de 5 segons.

### 10. Deadlock d'Aprovació Dual (Autopoiesi)
- **Problema:** Si l'humà no aprova la poda durant setmanes (perquè no obri l'app), l'escombraria CRDT s'acumularà, i als 30 dies iOS ho esborrarà tot.
- **Solució a programar:** Implementar una poda d'emergència automàtica (sense Javi) als **20 dies** de no obrir l'app. Més de 20 dies ja és un risc terminal.

### 11. Protocol "Quiesce" (Verema vs WebRTC)
- **Problema:** Si es fa la Verema (compactació a JSON) exactament al mateix temps que una Sincronització P2P (WebRTC), els `State Vectors` es corrompran.
- **Solució a programar:** Afegir un handshake pre-poda (`quiesce epoch`) que pause temporalment l'entrada de nous deltes WebRTC fins que acabe la compressió.

### 12. Keepalive per Amnèsia iOS (Comptador de Supervivència)
- **Problema:** Un *Ping Background* en una PWA d'iOS és impossible; Safari mata el procés. Si l'usuari no obri l'app en 30 dies, IndexedDB s'esborra.
- **Solució a programar:** L'únic "ping" possible és el de l'usuari humà. L'app guardarà el `last_opened_date`. Si als 20 dies l'usuari no ha obert l'app (comprovació en obrir), saltarà un *Avisador Efímer Persistent* obligant l'usuari a fer un backup manual per a evitar la destrucció.

### 13. Persistència Nativa a iOS (Storage API)
- **Problema:** A més del *Ping Background*, cal demanar permís explícit al navegador perquè no ens esborre l'IDB a les primeres de canvi.
- **Solució a programar:** Implementar crida a `navigator.storage.persist()` a l'inici de l'app.

### 14. Timeouts Anti-Deadlock (SOSP_LOCK i Promeses)
- **Problema:** El protocol d'emergència i la sincronització depenen d'`await`. Si iOS congela la xarxa i la promesa no es resol mai, la UI es bloqueja per a sempre.
- **Solució a programar:** Wrappejar totes les promeses crítiques (SOSP_LOCK, Verema, etc.) amb un timeout de seguretat (ex: 10 segons) que llance un error controlat si no hi ha resposta.

### 15. Mutex Global per a Workers Pesats (Anti-Jetsam)
- **Problema:** Si la poda d'Autopoiesi i la Verema s'engeguen alhora en background, la suma de la seua RAM trencarà els 500MB de l'A10 i l'app farà *crash*.
- **Solució a programar:** Implementar un Semàfor (Mutex) al *Bancal Budget Manager*: si un procés de gran tonatge està en marxa, els altres queden en cua d'espera.

### 16. Watchdog Transaccional (ChatGPT)
- **Problema:** Si un procés asíncron llarg com la Verema crasheja o s'interromp, al tornar a obrir l'app començaria des de zero, ofegant l'A10.
- **Solució a programar:** Implementar un gestor d'estats de procés (Watchdog) per a Veremes i Autopoiesis. El procés es divideix en etapes i es guarda el progrés (`currentStep`) a IndexedDB. Si l'app es tanca a l'etapa 3 de 5, en reobrir reprèn automàticament des de l'etapa 3 (veure `WatchdogTransaccional`).

---

## Refinaments Quirúrgics (Ronda 11 - Kimi AI)
Aprovades per unanimitat per a afegir robustesa extrema:
1. **Punt 4b - Circuit Breaker de Pressió:** Si la RAM creix massa (ex. >450MB) durant el processament de la cua asíncrona, s'aborta immediatament el batching.
2. **Punt 5b - Reintent Exponencial (Handshake):** Si el QR falla, s'intentarà 3 vegades (2s, 4s, 8s) abans de donar-se per vençut.
3. **Punt 11b - Degradació Elegant (`mas-cau-mode`):** Si un timeout ocorre (SOSP_LOCK caduca), la UI no es penja en blanc; s'aplica una classe CSS de "Mode Lectura" deshabilitant inputs de manera elegant. Aquestes 16 "pessigolles" conformen el Pla d'Implementació (Bíblia Operativa). Ara procedirem a implementar el pseudocodi directament a l'arquitectura.


---
**Enllaç orgànic per netejar el graf**: [[10_actes]]
