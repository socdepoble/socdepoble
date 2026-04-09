> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/libro_blueprint_replicacion.md`

# 📖 SÓC DE POBLE: EL LIBRO FUNDACIONAL
---

## CAPÍTULO: EL BLUEPRINT DE LA EMANCIPACIÓN DIGITAL (KNOW-HOW)

*(Este capítulo destila la arquitectura del pensamiento "Local-First" y provee el manual táctico para replicar una red comunitaria tolerante a fallos en cualquier lugar del mundo. Extraído del Dictamen de DeepSeek en la Fase 9).*

### 1. LA ARQUITECTURA DEL PENSAMIENTO LOCAL-FIRST

#### 🧠 El *mindset*: No construyas para la red, construye para la memoria
La mayoría de las aplicaciones modernas parten de una premisa implícita: *“siempre hay conexión”*. Nosotros hemos aprendido a pensar al revés: **el servidor es un visitante ocasional, el dispositivo es el hogar**. Este cambio de mentalidad es la base de todo.

- **Primero el disco, después la nube.** Cada dato que el usuario crea debe escribirse primero en el almacenamiento local (IndexedDB). La sincronización con la nube es secundaria, asíncrona, y ocurre cuando las condiciones lo permiten. El estado local es la fuente de la verdad.
- **Los conflictos no son excepciones, son la norma.** Si dos vecinos editan el mismo bando sin conexión, asume el conflicto y usa estrategias de resolución (LWW / CRDT). Hazlos visibles y dale al usuario el poder de decidir.
- **La sincronización es una coreografía.** No basta con enviar datos al reconectar. Hay que orquestar: detectar estado, encolar mutaciones, reintentar con *backoff* y coordinar pestañas.
- **La criptografía es tu nueva amiga.** En un mundo sin servidor central, la confianza se basa en la verificación. Cada mutación debe estar firmada (ECDSA/Ed25519) por su autor.
- **Recomendación para soñadores:** Sóc de Poble es como un *papel y un bolígrafo*. Internet es el cartero. Si no pasa el cartero, tú ya tienes tu escrito en papel. Cuando pase, lo copia a la cartilla del pueblo.

---

### 2. PROTOCOLO DE DOCUMENTACIÓN PARA IAs DEL FUTURO (AI-READY)
Las IAs leerán este código fuente para expandirlo. Deben entender los *porqués* y no solo los *qués*.

**Reglas de oro para el "DNA comentado":**
1. **Módulos (`MODULE_DOC`):** Encabezado en cada archivo definiendo Propósito, Flujo principal, Dependencias y Modos de fallo.
2. **Funciones (`DOCSTRING`):** Describe flujos, inputs, outputs y, críticamente, alternativas rechazadas ("Por qué existe esto y qué pasa si falla").
3. **El *Por Qué*:** No expliques qué hace el `if`. Explica *el propósito* de la lógica y la directiva de diseño.
4. **Etiquetas Contextuales:** Usa JSDoc tags como `@local-first`, `@crypto`, `@lifecycle` para que los agentes autónomos puedan filtrar dominios semánticos rápidamente al hacer análisis estático (RAG).

---

### 3. EL BLUEPRINT: RECETA DE REPLICACIÓN RÁPIDA (9 PASOS)

Este es el manual para replicar la infraestructura de Sóc de Poble en una tarde:

*   **Paso 0: Entorno.** Vite + PWA Plugin + Zustand + IDB.
*   **Paso 1: Aísla el Almacenamiento Local.** Capa IndexedDB para `mutation-queue`. Implementa auto-canibalismo (QuotaExceededError).
*   **Paso 2: Estado Reactivo Offline.** Guarda optimista en el UI (Zustand), y luego en memoria IDB. Reconstruye el estado al arrancar.
*   **Paso 3: Sincronización.** Crea RPC en servidor con Idempotencia (tabla `mutation_log`). Envía en batch desde el cliente.
*   **Paso 4: Coordinación de Pestañas.** Usa `BroadcastChannel` con firmas HMAC para evitar colisiones y *deadlocks* inyectando señales de liberación en el ciclo de vida de la página.
*   **Paso 5: WebRTC P2P (Sin Internet).** Crea túneles P2P extrayendo el SDP y podándolo para dejar solo candidatos `host`, permitiendo compresión en códigos QR escaneables por móviles de baja gama.
*   **Paso 6: Firmas Criptográficas (Zero-Trust).** Asigna un par de claves asimétricas a cada dispositivo al nacer (alojado no extraíble en `crypto.subtle`). Cada mutación se firma antes de inyectarse en el CRDT.
*   **Paso 7: Accesibilidad Extrema.** Usa `aria-live`, alto contraste y pre-renderizado pesado para reducir la carga de JavaScript y CPU de los terminales más débiles.
*   **Paso 8: Edge Protection.** Protege tu servidor remoto para la nube (Cloudflare Workers, Tarpits para bots y billing circuit-breakers).
*   **Paso 9: Chaos Engineering.** Prueba rompiendo la red (Toggle Offline/Online rápido), llenando la memoria RAM y creando conflictos dobles simultáneos.

---
*Con este Blueprint, la emancipación digital rural deja de ser un milagro algorítmico y se convierte en ingeniería rutinaria.*
