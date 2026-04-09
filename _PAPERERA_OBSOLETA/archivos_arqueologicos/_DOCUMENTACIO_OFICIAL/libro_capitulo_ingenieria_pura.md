> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/libro_capitulo_ingenieria_pura.md`

# 📖 SÓC DE POBLE: EL LIBRO FUNDACIONAL
---

## CAPÍTULO: INGENIERÍA PURA - EL BÚNKER ABSOLUTO Y EL 'KNOW-HOW' CIBERNÉTICO

*(Advertencia: Este capítulo es un descenso a las trincheras del silicio. Está diseñado para ingenieros, arquitectos de sistemas y mentes curiosas que deseen comprender cómo forjamos lo imposible en el navegador de un móvil rural).*

### 1. El Paradigma del 'Local-First' Real (Sin Concesiones)
Cuando conceptualizamos Sóc de Poble, nos dimos cuenta de una verdad incómoda: la web moderna es frágil. Todos los frameworks asumen que el dispositivo tiene un cordón umbilical eterno con un servidor AWS en Frankfurt. Pero en la plaza de un pueblo, con cobertura 3G oscilante y túneles de la muerte, eso es una mentira termodinámica.

Aquí es donde rompimos las reglas. Invertimos el modelo.
En lugar de que el móvil "le pida permiso" al servidor para existir, convertimos el móvil en el Servidor Maestro. La aplicación web progresiva (PWA) no es un cliente, es un nodo soberano completo (un *Búnker*). La nube es un simple espejismo secundario.

**El *Know-How*:**
No almacenes estado en memoria volátil de React ni dependas de un `fetch` para bloquear la UI. El origen de la verdad debe ser `IndexedDB` encapsulado por un gestor reactivo como Zustand. La regla de oro es: **Escribe primero en disco local, sincroniza en segundo plano cuando (o si) el universo lo permite**.

### 2. Sincronización sin Autoridad: Los CRDTs 
Si el servidor ya no manda, ¿quién manda si dos abuelos editan el mismo bando municipal sin internet y luego sus móviles se conectan?
La solución fue el uso de Estructuras de Datos Libres de Conflictos Replicadas (CRDTs). En particular, algoritmos LWW (*Last-Writer-Wins*) combinados con Relojes Vectoriales (Vector Clocks).

**El *Know-How*:**
No trates de "fusionar" conflictos como lo haría Git de forma manual. Todo objeto de estado en Sóc de Poble es inmutable y temporal. Si un usuario (Dispositivo A) edita el título, y otro (Dispositivo B) lo edita aislado en una masía offline, al juntarse, gana el que tenga el *timestamp* lógico más avanzado. Las mutaciones son operaciones matemáticas, no actualizaciones de base de datos tradicionales.

### 3. La Malla P2P de Supervivencia (WebRTC & Airgap Mesh)
La red celular cae. Las tormentas tumban las antenas de la operadora. ¿Se muere la plaza digital? No.
Tiramos de la red WebRTC para evadir a las telecos. Los móviles en el radio de la plaza se descubren y hablan de móvil a móvil.

**El *Know-How*:**
WebRTC exige un servidor de señalización (para pasar el SDP de conexión). Pero en un entorno rural extremo (Airgap total), convertimos los Session Description Protocols (SDPs) a códigos QR de alta densidad usando compresión (Deflate/gzip) y cirugía algorítmica. Le extirpamos los candidatos de red innecesarios (IPv6, Relay, STUN) dejando solo IPv4 de red de área local viva. Así, un QR de ~400 caracteres basta para levantar un puente de red en segundos entre dos granjeros usando la cámara, sin megas.

### 4. El Escudo Cryptográfico (Zero-Trust Native)
Al destruir el servidor central, creamos un Bosque Oscuro (*Dark Forest*). Si un firmware malicioso u otro nodo inyecta código, la red colapsa. Aquí es donde se separan los "proyectos curiosos" del grado militar.

Toda la seguridad debía correr del lado del cliente, y no podíamos empaquetar librerías de 5MB como *libsodium* o *crypto-js*, que destrozarían la RAM y batería del usuario.
Asaltamos la `WebCrypto API` latente en los motores C++ de los navegadores:
- **Intra-Pestaña (HMAC-SHA256):** Usamos el *Structured Clone* e *imports no-extractables* para crear una bóveda de memoria impenetrable. Cuando las pestañas coordinan los subprocesos de compresión y uso de espacio, todos los mensajes (BroadcastChannels) van blindados con un Hash de Autenticidad Efímera. El Spoofing local XSS es matemáticamente imposible. 
- **La Verdad Inter-Vecino (ECDSA P-256):** Cada mutación P2P que llega a un dispositivo, llega firmada asimétricamente. Tu móvil verifica el Hash criptográfico de la clave pública del vecino antes de aceptar que ese "Bando" es real. Sóc de Poble opera bajo las reglas de soberanía individual. Nadie miente sin que fallen las matemáticas.

### 5. Resiliencia Termodinámica y el Anti-Silencio
Por último, lidiamos con la API del Ciclo de Vida de las Páginas Moviles (`Page Lifecycle`).
Los OS como iOS y Android asesinan procesos en segundo plano para ahorrar batería. Congelan las pestañas.
Una pestaña con un bloqueo (Lock) congelada, supondría un colapso en cadena en el motor IndexedDB afectando a todas las ventanas. 

**El *Know-How*:**
Implementamos un Guardián de Locks (`LifecycleLockGuard`) usando `AbortSignal`. Detectamos los eventos del DOM `freeze` o `pagehide` en los precisos milisegundos antes del rigor mortis celular, forzando la liberación atómica del control. Los hilos respiran tranquilos. Sóc de Poble nunca se asfixia.

---
### DOCUMENTANDO PARA LA IA
Todo esto hoy tomó sudor arquitectónico. Pero en el futuro, cuando la IA lea nuestro código y re-optimice motores enteros en segundos, nuestras lecciones arquitectónicas serán vitales. Las hemos comentado y destilado en docstrings `/** ... @version 7.0.0-production */` con directrices cripto explícitas y patrones de arquitectura definidos en `prompts` fundacionales. La caja negra del código está documentada en un lenguaje común entre humanos ingenieros y grandes modelos de lenguaje, porque esta plaza la construiremos, juntos, sin servidores, eternos.
