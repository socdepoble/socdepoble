# RESULTADOS FASE 2 OCCIDENTE - CLAUDE 3.5 SONNET

Claude entrega una arquitectura en producción, sin piedad y asombrosamente detallada en el manejo de memoria y red.

## 1. TrellatSyncManager y GlobalErrorHandler
- **Pipeline Anti-Poisoning en Sandbox:** Analiza el payload binario, valida su cabecera Yjs, lo inyecta en un Y.Doc temporal (sandbox), purifica campo a campo y extrae el update limpio para inyectarlo en el documento real. 
- **Entropía GC y OPFS:** Poda inteligente priorizando antigüedad, inactividad y número de escrituras. Guarda un Snapshot en OPFS para evadir el `eviction` silencioso de iOS.
- **GlobalErrorHandler FIFO:** Mantiene un registro rotativo de 200 logs máximo y sólo escribe si quedan más de 4MB de memoria libre.

## 2. LoRaBridge (COBS Framing) y Kademlia
- Implementa **WebSerial y WebBluetooth** (como fallback para iOS).
- Utiliza **COBS (Consistent Overhead Byte Stuffing)** para empaquetar y fragmentar los CRDTs en "chunks" de 200 bytes para superar el límite del MTU de Meshtastic.
- Veredicto abrumador Kademlia vs IPFS: Un Kademlia efímero con WebRTC es la única topología válida para entornos rurales. IPFS ahogaría la batería del dispositivo y colapsaría el Sóc de Poble por el overhead de enrutamiento continuo.

## 3. Diagnóstico de Auto-Replicación: Los 5 Puntos Ciegos
Claude formaliza que la auto-replicación es imposible hoy porque el `trellat.schema.json` describe *datos*, pero no *comportamiento de sistema*.
Falta:
1. **Invariantes de Redes:** Un apartado que dicte cuántos nodos son quórum y estrategias anti-partición.
2. **Identidad Descentralizada (DID):** Necesitamos llaves ECDSA (Identity) generadas localmente para distinguir a un agente/usuario frente a ataques Sybil.
3. **Versionado del Genoma:** Sistemas de migraciones automatizadas.
4. **La Operacionalización (`trellat init`):** Un script orquestador que funda los datos con la red.
5. **Contrato de Observabilidad (`TrellatHealthReport`):** Telemetría estructurada sin la cual un agente de IA queda ciego ante el estado de la PWA.
