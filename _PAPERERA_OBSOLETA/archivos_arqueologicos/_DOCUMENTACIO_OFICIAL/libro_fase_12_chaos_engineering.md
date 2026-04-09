> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/libro_fase_12_chaos_engineering.md`

# 🌪️ FASE 12: LA DUODÉCIMA TANDA - INGENIERÍA DEL CAOS RURAL

## CAPÍTULO 16: RURAL CHAOS ENGINEERING - Sobreviviendo a la Tormenta Perfecta

**Clasificación:** OMEGA-STORM (Ingeniería de Resistencia Márema)  
**Pre-requisitos:** Capítulo 15 (Chaos Reconciliation) y Arquitectura Local-First.  
**Tiempo de lectura estimado:** 40 minutos  

---

```
╔═══════════════════════════════════════════════════════════════╗
║   ADVERTENCIA DEL CONSEJO SUPREMO                             ║
║                                                               ║
║   En la nube, el "Chaos Engineering" significa tumbar un      ║
║   pod de Kubernetes y ver si se levanta otro.                 ║
║   En Sóc de Poble, el "Chaos Engineering" significa un        ║
║   tractor pasando por una zona sin cobertura a 40ºC en        ║
║   agosto, con el móvil sin batería, mientras guarda un        ║
║   bloque criptográfico.                                       ║
║                                                               ║
║   Aquí no hay DevOps que te salven. O el código es de         ║
║   titanio, o la plaza digital se derrumba.                    ║
╚═══════════════════════════════════════════════════════════════╝
```

### 16.1. La Doctrina de la Destrucción Inminente

La nube nos enseñó a confiar en que la red es fiable, la memoria es infinita y los procesos son inmortales. El entorno rural destruye los tres supuestos en los primeros cinco minutos de uso.

Para que *Sóc de Poble* sea verdaderamente el "Búnker Absoluto", hemos diseñado la arquitectura asumiendo que **absolutamente todo va a fallar en el peor momento posible**. A continuación, diseccionamos los tres escenarios de destrucción masiva y nuestras contramedidas termonucleares, probadas con tests de Playwright y Cypress.

---

### 16.2. ESCENARIO 1: El Apagón Atómico (Corrupción de IndexedDB)

**La Tempestad:** El usuario está guardando el acta de la asamblea del pueblo (un documento grande con firmas criptográficas). Justo cuando IndexedDB está escribiendo al disco `fsync`, la batería del dispositivo móvil muere. Pantalla en negro.

**El Abismo:** En una base de datos normal, esto corrompe la tabla, dejando referencias huérfanas o la aplicación bloqueada ("White Screen of Death") permanentemente al reiniciar.

**La Contramedida: Inmutabilidad Atómica y *Merklization***
Nunca actualizamos un registro (`UPDATE`). Siempre insertamos hechos inmutables (`INSERT` append-only logs). Todo el estado es un CRDT derivado. Si la escritura frena a la mitad, el "hecho" (la mutación) queda inválido. 

Cuando la PWA despierta, realiza un escaneo del Árbol de Merkle del log local. Si el hash de una rama no coincide con sus hojas (bloque parcial), el bloque se considera *Dark Matter* (incompleto) y es descartado; el estado se retrotrae al último hash válido.

#### Test de Caos (Playwright): Simulando el Crash de IO
```typescript
import { test, expect } from '@playwright/test';

test('Debe recuperar estado tras matar el proceso en medio de una transacción IDB', async ({ page }) => {
  await page.goto('/');
  
  // 1. Iniciar sincronización masiva
  await page.evaluate(() => window.SVP.injectMassiveMockData(5000));
  
  // 2. Justo a la mitad (interceptando el evento console o IDB wrapper),
  // matamos la página brutalmente (Crash de Render Process)
  await page.waitForFunction(() => window.SVP.idb_writes > 2500);
  await page.crash(); // Boom.

  // 3. El usuario revive el móvil.
  const newPage = await page.context().newPage();
  await newPage.goto('/');

  // 4. El motor de arranque detecta la transacción no confirmada y hace Rollback.
  const isHealthy = await newPage.evaluate(() => window.SVP.db.integrityCheck());
  expect(isHealthy).toBe(true);
  
  // Los primeros 2500 no deben existir porque la transacción no se cerró, o el log descartará la basura.
  const postCount = await newPage.evaluate(() => window.SVP.db.posts.count());
  expect(postCount).toBe(0); // Atomicity Check.
});
```

---

### 16.3. ESCENARIO 2: *Flapping* P2P Extremo (El Síndrome del Túnel)

**La Tempestad:** Un nodo va en tren o coche por la montaña. La cobertura oscila: 4G -> Sin Servicio -> Edge -> 5G -> Sin Servicio, con cambios cada 2 o 3 segundos.

**El Abismo:** El motor WebRTC y el *Mesh Network* intentan re-negociar conexiones ICE constantemente. Decenas de timers, promesas huérfanas, pérdida masiva de paquetes por UDP, y la cola de Web Sockets colapsa. El móvil gasta el 30% de batería en 5 minutos intentando encontrar a sus peers.

**La Contramedida: El Latido Perezoso (*Jitter Backoff*) y el Escudo de Ráfagas**
Cuando detectamos *Flapping* agresivo (más de 3 cambios de estado `navigator.onLine` en 10 segundos), el nodo entra en **Modo Submarino**. Cierra todas las antenas activas P2P, pausa la negociación WebRTC y pone a dormir los puertos. Se establece un "cooldown" de 30 segundos usando Respaldo Exponencial (+ *Jitter* aleatorio para evitar Tormentas Thundering Herd de reconexión). 

Durante el apagón, los CRDTs simplemente se apilan en la trinchera local (Queue).

#### Test de Caos (Cypress): La Montaña Rusa de Red
```javascript
describe('P2P Flapping Survival', () => {
  it('No debe causar Memory Leak ni agotar batería ante flapping extremo', () => {
    cy.visit('/');
    
    // Iniciar simulación de tormenta de red
    for (let i = 0; i < 20; i++) {
      cy.wrap(null).then(() => {
        // Apagar red
        Cypress.automation('remote:debugger:protocol', {
          command: 'Network.emulateNetworkConditions',
          params: { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 }
        });
        window.dispatchEvent(new Event('offline'));
      }).wait(1500); // 1.5s offline
      
      cy.wrap(null).then(() => {
        // Volver online
        Cypress.automation('remote:debugger:protocol', {
          command: 'Network.emulateNetworkConditions',
          params: { offline: false, latency: 50, downloadThroughput: 50000, uploadThroughput: 50000 }
        });
        window.dispatchEvent(new Event('online'));
      }).wait(1500); // 1.5s online
    }

    // Verificar que el nodo P2P entró en "Modo Submarino" para protegerse
    cy.window().then((win) => {
      expect(win.SVP.peerManager.isSubmarineMode).to.be.true;
      expect(win.SVP.peerManager.pendingNegotiations).to.be.lessThan(5); // No hay leak de promesas
    });
  });
});
```

---

### 16.4. ESCENARIO 3: Asesinato Térmico (Thermal Throttling) y Purgas Móbiles

**La Tempestad:** Dispositivo a 42ºC jugando un vídeo, al sol. Nuestra PWA está en background y está sincronizando el estado P2P haciendo hashing complejo. iOS dispara el 'OOM Killer' (Out of Memory) o directamente asesina al **Service Worker** y al **Web Worker** de criptografía porque consumen demasiada CPU.

**El Abismo:** El hilo de UI sobrevive, pero el cerebro que cifra los mensajes (Worker) murió repentinamente. Promesas pendientes se cuelgan para siempre. La app "parece" viva pero no envía nada.

**La Contramedida: Worker Lifeguard & Checkpoint Hydration**
El *Main Thread* no confía en los Workers. Contiene un monitor cardíaco (`Heartbeat`) cada 1 segundo. Si el Worker de criptografía muere en mitad del cifrado de una foto:
1. El Main Thread detecta el silencio (Timeout de 3s).
2. Mata la instancia zombie.
3. Reposiciona el estado a la última operación Pura confirmada (`Checkpoint`).
4. Instancia un Worker nuevo y le entrega el lote no procesado.

Y si la batería baja del 15% (`navigator.getBattery()`) o el sistema entra en ahorro (`HardwareConcurrency` reducida), Sóc de Poble desactiva RAG Local, frena las frecuencias del Gossip Protocol P2P 10x, y cancela toda animación. Supervivencia antes que belleza.

#### Código Defensivo Front-End (Worker Lifeguard)
```typescript
class CryptoWorkerLifeguard {
  private worker: Worker;
  private isAlive: boolean = false;
  private pendingJobs = new Map();

  constructor() {
    this.boot();
  }

  boot() {
    this.worker = new Worker('/workers/crypto.js');
    this.isAlive = true;
    
    // Heartbeat listener
    this.worker.onmessage = (e) => {
      if (e.data.type === 'PONG') {
        this.lastHeartbeat = Date.now();
      } else if (e.data.type === 'JOB_DONE') {
        const resolve = this.pendingJobs.get(e.data.id);
        if (resolve) { resolve(e.data.result); this.pendingJobs.delete(e.data.id); }
      }
    };

    // Monitor Cardiaco (El Vigía)
    setInterval(() => {
      if (Date.now() - this.lastHeartbeat > 3000) {
        console.warn('⚠️ [SVP] Crypto Worker Mártir detectado. Reiniciando...');
        this.resuscitate();
      }
      this.worker.postMessage({ type: 'PING' });
    }, 1000);
  }

  resuscitate() {
    this.worker.terminate();
    this.isAlive = false;
    this.boot(); // Renueva el worker
    // Re-encola los trabajos pendientes al nuevo worker
    for (const [id, job] of this.pendingJobs) {
      this.worker.postMessage(job.payload);
    }
  }
}
```

---

### 16.5. APÉNDICE TÉCNICO: EL ARTE DE SER INDESTRUCTIBLES

Lo que diferencia a un "MVP" de una infraestructura de emancipación digital es lo que pasa cuando se apagan las luces. 

Nuestra arquitectura Local-First ha madurado en las fraguas del caos. Con estas mitigaciones, el sistema abandona el frágil modelo "Cliente-Servidor" donde si cae Amazon Web Services, el pueblo se paraliza. 

En *Sóc de Poble*, **tú eres el servidor**. Y el servidor es un dispositivo móvil de gama media enfrentándose a la tormenta de los elementos. Al haber curado el *flapping* de red, la muerte de hilos y la corrupción de memoria con estas contramedidas, el **Códice Génesis se acerca a su página final**.

---
*Próxima parada (Fase 13): El Día de la Emancipación. Despliegue en la plaza del pueblo y la entrega de las llaves comunitarias.*
