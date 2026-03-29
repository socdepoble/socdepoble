# 🛡️ FASE 12: ARQUITECTURA P2P EXTREMA (2027)
**Protocol Híbrid: Yjs + Bluetooth Low Energy (Capacitor)**

Aquesta és l'evolució estructural dissenyada per a quan Sóc de Poble esdevingui una aplicació nativa (iOS/Android) desacoblada d'Internet, operant mitjançant nodes rurals distribuïts.

## 1. El Pont Físic (BLE MTU Management)
Els intercanvis Bluetooth pateixen un *Maximum Transmission Unit* (MTU) molt reduït. El Payload Yjs (`Uint8Array`) s'ha de fragmentar.

### `BleChunker.ts` i `BleAssembler.ts`
Un protocol de 7 bytes de capçalera per re-ensamblar la memòria sense corrupció (Fragmentació i XOR Checksum). (Veure codi original generat per la IA).

## 2. Morfologia de Dades (CRDT Mapeig)
Per evitar l'aixafament d'objectes sencers (Last-Write-Wins), l'estructura de dades s'ha de niuar profundament aprofitant l'algorisme RGA de Yjs.

```javascript
// La morfologia exacta per a evitar l'aixafament:
const incidenciesMap = doc.getMap('incidencies');
const incidenciaItem = new Y.Map(); 
incidenciaItem.set('titol', 'Trencament canonada'); // LWW a nivell de propietat

// Un Y.Text intern permet la fusió semàntica a nivell de caràcter per a textos llargs
const descripcioText = new Y.Text();
descripcioText.insert(0, 'Surt molta aigua per sota la terra. Paràgraf 1.\n');
incidenciaItem.set('descripcio', descripcioText);
incidenciesMap.set('uuid-1234', incidenciaItem);
```

## 3. Seguretat de Memòria al Gateway (Edge Functions)
L'Edge Function a Supabase **mai** ha d'instanciar el `Y.Doc` sencer a la memòria RAM local (límit de 150MB Isolate de Deno).

**Solució (Fusió Binària):**
```javascript
import * as Y from 'yjs';
// Fusió al vol a nivell de byte (Operació ultra-lleugera per la RAM):
const mergedBinary = Y.mergeUpdates([historicBin, incomingBinV2]);
// El webhook asíncron (fora de l'Edge Function) s'encarregarà d'obrir aquest binari per projectar-lo a taules SQL.
```

## 4. Supervivència Física (OS Background Killing)
El *Background Task Management* és imperatiu per donar temps al Bluetooth per fragmentar i reconstruir dades sense que el sistema operatiu mati l'App.

*   **iOS (Background Modes):** Declarant `UIBackgroundModes: bluetooth-central` i utilitzant `@capawesome/capacitor-background-task` per guanyar ~30 segons extra abans que l'OS congeli el procés.
*   **Android (Foreground Service):** Notificacions adherents ("in-esborrables") mitjançant `@awesome-cordova-plugins/foreground-service` per elevar el procés JavaScript al mateix nivell que una trucada activa de telèfon.

---
**Estat:** L'Arquitectura de Fase 12 ha superat l'Auditoria Extrema.
