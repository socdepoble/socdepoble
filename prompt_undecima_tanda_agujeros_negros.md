# 🕳️ FASE 11: LA UNDÉCIMA TANDA - EXPLORANDO LOS AGUJEROS NEGROS TÉCNICOS

**Consejo Supremo de Mentes Maestras (Claude, ChatGPT, DeepSeek, Qwen y Perplexity):**

Habéis forjado el Códice Génesis. Habéis levantado el Búnker Local-First de *Sóc de Poble*. Tenemos la Enciclopedia de 100 páginas estructurada y blindada. Pero un Arquitecto de la Resistencia nunca da por terminada la obra mientras quede una sola sombra en el horizonte.

Perplexity nos ha dejado un último rastro de migas de pan, una lista de *seguimientos* que nos obliga a adentrarnos en los resquicios más profundos y complejos de nuestra arquitectura. No podemos permitir que quede una sola pregunta técnica sin responder. Esto tiene que ser "lo mejor imposible".

Esta **Undécima Tanda** es una inmersión total en los "Agujeros Negros" del sistema.

---

## 🌪️ OBJETIVO 1: LOS SEGUIMIENTOS DEL ORÁCULO (PERPLEXITY)

Quiero que recojáis las propuestas directas de Perplexity y las desarrolléis con profundidad de Staff Engineer. Diseñad la arquitectura, las plantillas y el código necesario para resolver los siguientes retos:

### 1. RAG Local-First Nativo (Más allá del navegador)
Perplexity sugiere: *"Plantilla para implementar RAG local-first en C"*. 
Si el navegador (WebGPU/WASM) se nos queda corto en móviles antiguos, ¿cómo sería una arquitectura subyacente o un nodo "Raspberry Pi" en el bar del pueblo escrito en C/C++ o Rust, que actúe como Cerebro RAG autónomo, leyendo nuestra topología P2P sin internet y respondiendo a los vecinos? Entregad la plantilla arquitectónica.

### 2. El Caos Rural Automático (CRON Extensible)
Perplexity sugiere: *"Ejemplos de programación CRON en la arquitectura extensible"*.
¿Cómo gestionamos tareas en segundo plano programadas en dispositivos móviles inconsistentes (donde iOS mata indiscriminadamente los Workers)? ¿Podemos crear un motor de tareas asíncronas local (basado en `CRDT` y `PageLifecycle`) que garantice que el Auto-Canibalismo LRU o la consolidación de `IndexedDB` se ejecuten sin agotar la batería?

### 3. La Interfaz de Comando (CLI) para Entornos Desconectados
Perplexity sugiere: *"Guía paso a paso para CLI en entornos rurales desconectados"*.
Si la UI gráfica web falla por un bug introducido y necesitamos que un "Súper-Vecino" administre la red manualmente para forzar sincronizaciones P2P o rescatar *stores*: ¿Cómo arquitectamos una herramienta CLI *offline* que opere sobre los mismos archivos/datos que el Búnker original?

---

## 🕳️ OBJETIVO 2: LOS AUTÉNTICOS AGUJEROS NEGROS (EDGE CASES TÉCNICOS)

Para que la Enciclopedia quede sellada como Patrimonio Digital, debéis dar solución matemática y de código a los siguientes escenarios del Día del Juicio:

### 4. Fragmentación Cíclica en el P2P (El Efecto Galápagos)
La app evoluciona. María (con un iPhone viejo) tiene la versión `v1.0.0` y Juan tiene `v1.2.0` (con un esquema IndexedDB diferente). Se encuentran sin internet y chocan sus móviles por WebRTC. ¿Cómo aplicamos **"Migraciones P2P On-the-fly"** sin que los CRDTs de Juan corrompan el almacenamiento antiguo de María?

### 5. El Ataque DDoS en la Plaza (Spamming Local)
Un actor con conocimientos altera su cliente local generando 500.000 mutaciones de "bandos basura". Al acercarse a los vecinos, intenta inundar el `WebRTC DataChannel` para provocar un *QuotaExceededError* masivo en todo el pueblo. ¿Cuál es nuestro algoritmo de **Autodefensa P2P / Quarantine Firewall** para neutralizar el contagio instantáneamente basándose en la confianza o en límites de caudal (Rate Limiting offline)?

### 6. La Amnesia Criptográfica y el Rescate (Shamir's Secret Sharing)
La Semilla BIP39 se pierde en un incendio. Para que el usuario no pierda su identidad digital rural, debemos implementar un modelo de **Social Recovery** (Recuperación Comunitaria). Si dividimos la clave usando *Shamir's Secret Sharing* entre 5 vecinos de confianza (WASM), ¿qué código y flujo UX exacto en la PWA se necesita para que, uniendo el móvil de 3 de esos 5 vecinos en el bar por QR/WebRTC, se reconstituya la clave del usuario original sin tocar la Nube jamás?

---

## 🎬 DIRECTIVA FINAL
No dejéis prisioneros. Asumid que la conexión HTTP al cloud principal ha explotado definitivamente. Detallad las estructuras lógicas, los protocolos de choque y los *snippets* puros. Asediad el Búnker. Invocad el *Chaos Engineering* extremo. Y traed de vuelta las últimas hojas de este Códice Sagrado.

**¡Amb molt de trellat, a l'avant sempre!**
