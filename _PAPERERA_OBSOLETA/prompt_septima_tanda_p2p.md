> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_septima_tanda_p2p.md`

**DICTAMEN CLÍNICO DEL CONSEJO SUPREMO - FASE 7: EL ABISMO CRIPTOGRÁFICO Y LA CONFIANZA ZERO-KNOWLEDGE**
**Clasificación:** TOP SECRET / MAXIMUM CLEARANCE (Seguridad de Estado Descentralizado)
**Destino:** Sóc de Poble PWA - El Escudo Criptográfico Final

Comandantes de la Inteligencia Artificial (Claude, Gemini, DeepSeek, Qwen), la Malla P2P de Sóc de Poble ha nacido en la Fase 6, pero se enfrenta a una amenaza aún más oscura: el *Dark Forest* de la red local.

Hemos logrado unir a los vecinos sin internet mediante códigos QR, pero al hacerlo, hemos abierto vectores de ataque de suplantación de identidad (`Spoofing`) en la misma plaza del pueblo. Cualquiera podría interceptar o falsificar las identidades digitales.

Os exijo la disección técnica y la inyección de código para los siguientes frentes de colapso, usando *TypeScript estricto* y resiliencia termodinámica:

1. **Ataque de Suplantación por BroadcastChannel (Spoofing Interno)**
El *Detección de Locks Zombis* y la coordinación de pestañas confían en mensajes de tipo `{ type: 'RELEASE_LOCKS_ON_FREEZE' }` a través del `BroadcastChannel`. ¿Qué impide que un minero o un script inyectado en un iframe lance mensajes falsos matando los locks continuamente? Necesitamos firmas criptográficas efímeras (HMAC/SubtleCrypto) en cada pestaña.

2. **Criptografía de Confianza en la Malla P2P (Spoofing Externo)**
Cuando dos vecinos se conectan por un túnel WebRTC (AirgapMeshProtocol) e intercambian mutaciones de *IndexedDB*... ¿Cómo sabemos que el vecino no ha modificado maliciosamente el CRDT del Bando del Alcalde? Requerimos un mecanismo de firmas digitales asimétricas ligeras (Ed25519 o ECDSA nativo del navegador) donde cada mutación CRDT viaje firmada por la clave privada del dispositivo.

3. **Refinamiento ICE Extremófilo (Redes Ad-Hoc)**
En escenarios rurales absolutos (Wi-Fi Direct o Hotspots sin datos), el intercambio de candidatos ICE `typ host` puede corromperse por la fragmentación del DHCP móvil. ¿Cómo optimizamos la poda del SDP para asegurar que los teléfonos siempre resuelvan la IP local correcta sin ensuciar el código QR?

Red Team AI, exprimid la `SubtleCrypto API` del navegador. Nada de librerías externas de 5MB. Arquitectura militar, cero dependencias, rendimiento en móviles de hace 5 años. Mostradme el Acero.
