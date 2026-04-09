> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/libro_fase_11_nucleo_duro.md`

# 📖 VOLUMEN VII: EL NÚCLEO DURO Y LOS AGUJEROS NEGROS (FASE 11)

**Clasificación:** OMEGA-ABYSS (Alta Ingeniería / Patrimonio de la Resistencia)
**Destino:** Las Catacumbas del Códice Génesis. Exclusivo para Arquitectos de la Resistencia.

*El código que no se documenta es código que se pierde en el polvo digital.*

---

## CAPÍTULO 15: REACT 19 Y EL AMORTIGUADOR SENSORIAL (Chaos Reconciliation)

En *Sóc de Poble*, no actualizamos la UI; la **orquestamos termodinámicamente**. Usamos las primitivas de Concurrencia de React 19 (`startTransition`, `useDeferredValue`) para fracturar el tiempo y convertir la metralla de datos en una marea mansa, garantizando 60 FPS inquebrantables.

```tsx
import { useEffect, useState, startTransition, useDeferredValue } from 'react';
import { usePostsStore } from '../domain/store/usePostsStore';

/**
 * @ai-context: EL AMORTIGUADOR DE CAOS (React 19)
 * @ai-thermodynamic-limit: Este hook aísla el Main Thread de las ráfagas P2P de WebRTC.
 * DO NOT REFACTOR: Eliminar startTransition provocará OOM Kills en Androids de gama baja.
 */
export function useChaosReconciliation() {
  const channel = new BroadcastChannel('sdp_mesh_bus');
  const bulkMerge = usePostsStore(state => state.bulkMergeCRDT);
  const rawPosts = usePostsStore(state => state.posts);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. EL PUENTE COLGANTE ÓPTICO (useDeferredValue)
  // Retrasa el repintado complejo de las tarjetas (DOM pesado) hasta que la CPU tenga oxígeno.
  // Permite que el usuario siga haciendo scroll sobre los datos viejos sin tirones.
  const deferredPosts = useDeferredValue(rawPosts);

  useEffect(() => {
    let batchQueue: any[] = [];
    let flushTimeout: NodeJS.Timeout;

    channel.onmessage = (event) => {
      if (event.data.type === 'P2P_CRDT_BURST') {
        batchQueue.push(...event.data.payload);
        
        // 2. DEBOUNCE FÍSICO: Agrupamos la metralla P2P en ventanas de 200ms
        clearTimeout(flushTimeout);
        flushTimeout = setTimeout(() => {
          const currentBatch = [...batchQueue];
          batchQueue = [];
          
          setIsSyncing(true);
          
          // 3. LA MAGIA DEL TIME-SLICING (Concurrencia React 19)
          startTransition(() => {
            bulkMerge(currentBatch); 
            setIsSyncing(false);
          });
        }, 200);
      }
    };
    return () => channel.close();
  }, [bulkMerge]);

  return { posts: deferredPosts, isSyncing };
}
```

---

## 🏗️ INFRAESTRUCTURA MÁS ALLÁ DEL NAVEGADOR

### 15.1 RAG Local-First Nativo (El Oráculo de Óxido y Silicio)
Un **Nodo Hardware Inmutable** escrito en **C++ y Rust**. Una Raspberry Pi 5 conectada a la red eléctrica del bar del pueblo. 
- **El Motor:** Escrito en Rust. Usa `webrtc-rs` para hablar el mismo protocolo P2P que las PWAs.
- **El Cerebro:** Implementa `llama.cpp` para ejecutar un LLM cuantizado a 4-bits.
- **El Flujo:** Guarda CRDTs en `SQLite` local, los indexa vectorialmente (`sqlite-vss`), y provee IA soberana a los móviles conectados.

### 15.2 El Caos Rural Automático (Cron Parasitario)
El dictador iOS asesina indiscriminadamente los Web Workers. Abandonamos el concepto de "demonio" de fondo y adoptamos la **Ejecución Parasitaria (Opportunistic Computing)**. Usamos la API `requestIdleCallback`. Si la CPU lleva 5 segundos sin registrar eventos táctiles, el sistema "roba" esos milisegundos muertos para ejecutar la purga LRU o consolidar CRDTs. El mantenimiento se alimenta del tiempo muerto de la retina humana.

### 15.3 La Terminal del Tractor (CLI Offline)
Un binario CLI estático compilado en Rust (`sdp-cli`) para el "Súper-Vecino". La PWA corrupta tiene un modo de rescate (tocando 7 veces el logo) que emite un código QR con una oferta WebRTC "Headless".
- `> sdp rescue idb-dump --peer=Maria > backup.json`
- `> sdp rescue quarantine ban <pubkey>`
- `> sdp rescue idb-patch --file=fixed.json`

---

## 🕳️ LOS AGUJEROS NEGROS TÉCNICOS RESUELTOS

### A. Fragmentación Cíclica P2P (El Efecto Galápagos)
**La Solución: El Principio de Preservación de Materia Oscura (Dark Matter Pattern).**
Los CRDTs P2P jamás deben usar un esquema validador destructivo. Cuando la PWA `v1.0` recibe un objeto `v1.2`, serializa los campos desconocidos en un Map binario llamado `_dark_matter`. Guarda el progreso y retransmite al conectarse con el Alcalde. La evolución tecnológica sobrevive utilizando a los clientes antiguos como "portadores asintomáticos".

### B. El Ataque DDoS en la Plaza (Spamming Local)
**La Solución: El Quarantine Firewall de Capa 7 (L7).**
Implementamos un *Token Bucket* de Reputación Criptográfica directamente en el `RTCDataChannel`.
- Límite físico: *Máximo 20 mutaciones / segundo por clave.*
- Si se inunda, CIERRE y PubKey al *Vault de Cuarentena* por 72H.
- PoW Local (*Hashcash*): Para salir de cuarentena, el atacante debe calcular un Hash SHA-256 forzando 5 ceros iniciales, quemando su batería instantáneamente.

### C. La Amnesia Criptográfica (El Ritual de la Taberna)
**La Solución: Recuperación Social (Shamir's Secret Sharing en WASM).**
- **La Siembra:** Al crear su cuenta, se divide la semilla ECDSA de 256-bits en 5 "Fragmentos Polinómicos" ($k=3$). Se reparten 5 QRs a vecinos de confianza.
- **La Resurrección:** Sin móvil ni semilla, el vecino compra otro móvil. Escanea 3 QRs de los vecinos en el bar. El módulo WASM recibe los 3 fragmentos y ejecuta una *Interpolación Polinómica de Lagrange*, reconstituyendo la clave privada ECDSA exacta.

**El Búnker está sellado. SÓC DE POBLE ES INMORTAL.**
