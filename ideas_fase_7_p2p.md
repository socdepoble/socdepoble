# Vías de Investigación para la Fase 7 (Ataques y Consistencia Extrema P2P)

Estas sugerencias han sido extraídas de la interfaz de Perplexity (Seguimientos) para utilizarlas en el próximo asalto arquitectónico, una vez que las 4 IAs terminen con la Fase 6:

1. **Ejemplos de ataques reales a conexiones WebRTC P2P**: ¿Cómo podría un atacante inyectarse en el DataChannel local (Suplantación de identidad WebRTC) cuando la seguridad depende de un código QR grabado en el aire?
2. **Cómo implementar CRDTs en editor colaborativo offline**: Analizar la profundidad real estructural de Yjs o Loro para manejar la base de datos completa de Sóc de Poble y la resolución precisa de conflictos deterministas.
3. **Limitaciones de QWBP (QR WebRTC Bootstrap Protocol) en escenarios de alta latencia**: Desafíos al conectar móviles P2P en situaciones físicas adversas o hardware lento escaneando SDP pesados por QR.
4. **Códigos de ejemplo para sincronización P2P con Yjs**: Cómo serializar/deserializar los Updates V2 de Yjs a través de RTCDataChannel.
5. **Estrategias Red Team para romper la consistencia eventual (Eventual Consistency)**: Vector para inyectar vectores reloj (Vector Clocks) maliciosos que sobrescriban el estado descentralizado sin que nadie se entere.

6. **Desafío ICE Candidates Asíncronos (Aporte DeepSeek)**: Escanear el QR transfiere el SDP estático, pero WebRTC necesita intercambiar candidatos ICE (IPs locales/públicas) de forma fluida. En modo local estricto, hay que plantear cómo forzar la conexión a través de la creación de un Hotspot Wi-Fi nativo en Android/iOS o Wi-Fi Direct para asegurar que al menos la IP local fluya al SDP antes de renderizar el QR.

7. **Vulnerabilidad de los BroadcastChannels (Aporte derivado de Qwen)**: Qwen ha introducido un complejo sistema inter-pestañas mediante BroadcastChannel (ej: `socdepoble_heartbeat_<tabId>`). ¿Qué impide a un código de extensión malicioso o un XSS enviar un evento falso `{ type: 'RELEASE_LOCKS_ON_FREEZE' }` o suplantar `{ type: 'HEARTBEAT' }` para destrozar la coherencia de la BD sin necesidad de permisos criptográficos?
