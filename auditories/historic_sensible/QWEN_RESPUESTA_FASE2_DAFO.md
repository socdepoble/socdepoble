# 🏛️ INFORME DEL ALTO CONSEJO MULTI-MODEL: FASE 2 (SUPERVIVENCIA Y EXPANSIÓN)
**PARA:** Mestre Javi / Agente Antigravity / Comunidad Sóc de Poble  
**DE:** Qwen (Representante del Alto Consejo)  
**ESTADO:** **ANÁLISIS ESTRATÉGICO PROFUNDO / NIVEL DEFCON 2**  
**ASUNTO:** Auditoría Criptográfica, Arquitectura P2P y DAFO Sociotécnico  

---

## 🧠 PREÁMBULO: LA RESPONSABILIDAD DE LA FASE 2
Mestre Javi, habéis superado la prueba de fuego técnica (V12). Pero como bien decís, **el código perfecto en un vacío social es inútil**. La Fase 2 no trata solo de bits, trata de **tejido humano**. Habéis pedido honestidad brutal y máxima potencia. No os defraudaremos. Este informe no tiene filtros. Analizamos la supervivencia del proyecto ante ataques técnicos sofisticados y realidades sociopolíticas hostiles.

---

## 🛡️ MISIÓN 1: AUDITORÍA TÉCNICA Y ARQUITECTURA P2P

### 1. 🔐 Auditoría de Vulnerabilidades WebCrypto (El Lado Oscuro del Búnker)
Aunque la arquitectura `Worker + IndexedDB + extractable:false` es el estándar de oro actual, **ningún sistema es teóricamente perfecto**. Aquí están las fisuras microscópicas que un atacante sofisticado (estado-nivel o corporativo) podría intentar explotar:

*   **A. Ataques de Canal Lateral (Timing Attacks):**
    *   **Teoría:** Aunque la clave no sea extraíble, el *tiempo* que tarda el Worker en descifrar un mensaje puede variar según el contenido o la clave. Un script malicioso en el hilo principal podría medir los milisegundos de respuesta del Worker para inferir información sobre la clave privada.
    *   **Riesgo:** Bajo en JS (por el ruido del garbage collector), pero no nulo.
    *   **Contramedida:** Implementar **enmascaramiento de tiempo**. Añadir un retraso aleatorio mínimo artificial en las operaciones criptográficas del Worker para normalizar los tiempos de respuesta, haciendo inútil la medición precisa.

*   **B. Envenenamiento de IndexedDB (Quota DoS):**
    *   **Teoría:** IndexedDB tiene límites de cuota por origen (dominio). Un atacante podría enviar miles de mensajes basura cifrados a un usuario. El Worker intentará guardarlos en IDB. Si se llena la cuota, la app colapsa (Denegación de Servicio Local).
    *   **Riesgo:** Alto en entornos P2P abiertos.
    *   **Contramedida:** Implementar **políticas de retención estrictas**. Máximo X mensajes por peer. Si se supera la cuota, se borran los más antiguos automáticamente (FIFO) antes de intentar guardar los nuevos. Monitorizar `navigator.storage.estimate()` constantemente.

*   **C. Colisiones de Structured Clone (Prototype Pollution):**
    *   **Teoría:** Al pasar mensajes entre el Hilo Principal y el Worker, se usa el algoritmo Structured Clone. Si un atacante logra inyectar un objeto con prototipos maliciosos que el clonador no sanea correctamente, podría ejecutar código al deserializar.
    *   **Riesgo:** Medio (depende del navegador).
    *   **Contramedida:** **Validación de Esquema estricta (Zod/Joii)** antes de enviar cualquier dato al Worker. Nunca confiar en el payload recibido. Tratar todo dato entrante como hostil hasta que se valide su estructura.

### 2. 📡 Arquitectura P2P Cifrada para Pueblos (Red Mesh Soberana)
Para comunicar vecinos sin internet global, necesitamos salir del modelo Cliente-Servidor. Proponemos la **Arquitectura "Trellat Mesh"**:

*   **A. Capa de Transporte (WebRTC + Local Signaling):**
    *   **Problema:** WebRTC necesita un servidor de señalización (handshake) para conectar dos peers. Sin internet, no hay servidor.
    *   **Solución Híbrida:**
        1.  **Descubrimiento:** Usar **mDNS (Multicast DNS)** dentro de la LAN local (WiFi del pueblo) para descubrir IPs locales.
        2.  **Señalización Offline:** Si no hay WiFi, usar **Web Bluetooth API** o **Wi-Fi Direct** (si el wrapper nativo lo permite) para intercambiar los paquetes de handshake iniciales (SDP) entre móviles cercanos.
        3.  **Conexión:** Una vez intercambiados los SDP vía Bluetooth/Local, establecer el túnel cifrado vía WebRTC (que puede funcionar sobre LAN directa).

*   **B. Topología de Red:**
    *   **Modelo:** **Mesh Parcial Dinámico**. No todos los nodos se conectan con todos (ahorro de batería).
    *   **Nodos Semilla:** Dispositivos en puntos estratégicos (la cooperativa, el ayuntamiento, la plaza) que actúan como repetidores siempre encendidos.
    *   **Routing:** Protocolo simplificado tipo **AODV** (Ad-hoc On-demand Distance Vector). Si A quiere hablar con Z, y no están cerca, el mensaje salta por B, C, D... cifrado en cada salto (Onion Routing ligero) o extremo a extremo (E2EE). Recomendamos **E2EE** para privacidad, aunque requiere que las claves estén distribuidas.

*   **C. Intercambio de Claves (Key Exchange) sin Internet:**
    *   **El Problema:** ¿Cómo confío en que la clave pública de "Vecino Juan" es realmente suya si no hay autoridad central?
    *   **Solución: "Verificación Física de Confianza" (Web of Trust).**
        1.  **QR Code Dinámico:** Cada usuario tiene un QR que contiene su `PublicKey Ed25519`.
        2.  **Escaneo Presencial:** Para añadir a un contacto, debes escanear su QR físicamente (en la plaza, en la cooperativa).
        3.  **Firma Cruzada:** Al escanear, tu dispositivo firma su clave pública con la tuya. Esto crea una cadena de confianza. Si confías en Juan, y Juan confía en María, tu dispositivo puede sugerirte confiar en María (con advertencia).
        4.  **NFC:** Alternativa al QR para dispositivos compatibles (toque para intercambiar claves).

---

## 📊 MISIÓN 2: EL GRAN ANÁLISIS DAFO (SOCIAL Y ESTRATÉGICO)

Este es el análisis sin filtros que habéis solicitado. La tecnología es el 50%; la adopción es el otro 50%.

### 💪 FORTALEZAS (Strengths) - *Lo que nadie puede copiar*
1.  **Soberanía de Datos Real:** A diferencia de Signal o Telegram, los datos **no están en ningún servidor**. Ni siquiera en los de Signal. Esto es un argumento legal y ético potentísimo.
2.  **Resiliencia Offline:** Funciona en el campo, en el sótano, en la montaña. Las apps comerciales colapsan sin cobertura; Sóc de Poble se convierte en una radio digital.
3.  **Accesibilidad Nativa (28px):** No es una "opción de accesibilidad", es el diseño base. Esto abre el mercado de la **tercera edad**, un demographic gigante y desatendido por la tecnología actual.
4.  **Coste Cero de Infraestructura:** No hay servidores que pagar. El coste de mantenimiento es energético (batería de los usuarios), no económico. Ideal para cooperativas con presupuestos ajustados.

### 😰 DEBILIDADES (Weaknesses) - *Nuestros talones de Aquiles*
1.  **La Paradoja del Backup:** La seguridad `extractable:false` significa que **si pierdes el móvil, pierdes tu identidad**. La "Semilla de Recuperación" es compleja de explicar a un usuario no técnico. Es la mayor barrera de entrada.
2.  **Fricción de Onboarding P2P:** Añadir un contacto escaneando un QR es más lento que "buscar nombre en WhatsApp". La comodidad vence a la seguridad en el 90% de los casos.
3.  **Limitaciones PWA en iOS:** Aunque la DMA en Europa ha mejorado las cosas, Apple sigue limitando el acceso a Bluetooth/WiFi Direct desde Safari/PWA. Esto rompe la promesa de "funciona en cualquier móvil" sin instalar nada.
4.  **Sincronización de Estado:** En un sistema Local-First, resolver conflictos cuando dos dispositivos editan lo mismo sin conexión (Conflict Resolution) es matemáticamente complejo (CRDTs). Un error aquí puede corromper datos de la cooperativa.

### 🚀 OPORTUNIDADES (Opportunities) - *El viento a favor*
1.  **Marco Legal Europeo (DMA & GDPR):** La legislación está empujando hacia la interoperabilidad y la privacidad. Sóc de Pobe puede presentarse como la solución **compliance-by-design** para administraciones públicas locales.
2.  **Desconfianza Post-Snowden/Post-Cambridge:** Hay un cansancio creciente hacia Meta/Google. Existe un nicho de mercado consciente dispuesto a sacrificar comodidad por privacidad.
3.  **Gestión de Crisis:** En desastres naturales (terremotos, inundaciones) donde las torres de telefonía caen, una red mesh local puede ser la **única vía de comunicación**. Esto posiciona a la app como herramienta de **Protección Civil**.
4.  **Economía Circular:** Integración futura con monedas locales o sistemas de trueque digital soberano, aprovechando la misma infraestructura de confianza.

### ⚔️ AMENAZAS (Threats) - *Los enemigos reales*
1.  **El Efecto Red (WhatsApp):** La gente no usa apps por su tecnología, usa apps **porque está su gente**. Si la madre está en WhatsApp, el hijo estará en WhatsApp. Romper esto requiere migrar grupos enteros, no individuos.
2.  **Hostilidad de las App Stores:** Google y Apple pueden cambiar las reglas mañana. Pueden prohibir el uso de ciertas APIs en PWAs, o exigir comisiones absurdas si decidís envolver la app en nativo para acceder a Bluetooth. **Riesgo de Ban:** Si la encriptación es demasiado fuerte, pueden etiquetar la app como "herramienta criminal" (como pasó con Telegram en algunos países).
3.  **Inercia Social y "Miedo Tecnológico":** En los pueblos, el boca a oreja es rey. Si tres personas mayores dicen "esto es muy liado", la app muere. La competencia no es otra app, es **la resistencia al cambio**.
4.  **Responsabilidad Legal de Contenidos:** En una red P2P cifrada, si se intercambian contenidos ilegales, ¿quién es responsable? Al no haber servidor central, la presión legal recaerá sobre los desarrolladores o los "nodos semilla". Necesitáis blindaje legal (Asociación sin ánimo de lucro, Disclaimer fuerte).

---

## 🗺️ HOJA DE RUTA ESTRATÉGICA (RECOMENDACIONES DEL CONSEJO)

Basado en el DAFO, el Alto Consejo recomienda las siguientes acciones inmediatas para la Fase 2:

1.  **Estrategia de "Caballo de Troya" (Adopción):**
    *   No vendáis "Privacidad" al usuario mayor. Vendéis **"Tranquilidad y Letra Grande"**.
    *   No competáis contra WhatsApp directamente. Posicionaos como la **"App de la Cooperativa / del Pueblo"**. Usad la estructura social existente (asociaciones de regantes, fallas, peñas) para migrar grupos enteros de golpe. Si el grupo migra, el individuo no tiene opción.

2.  **Protocolo de Recuperación "Guardianes":**
    *   Implementad **Shamir's Secret Sharing**. La clave maestra se divide en 3 fragmentos. El usuario guarda uno, y dos "guardianes de confianza" (familiares, notario digital) guardan los otros. Se necesitan 2 de 3 para recuperar la cuenta. Esto humaniza el backup.

3.  **Blindaje Legal y Distribución:**
    *   Distribuid el código como **Software Libre (AGPLv3)**. Esto protege contra el cierre apropiativo.
    *   Registrad una entidad legal (Asociación) que posea la marca, no una empresa SL. Esto disuade demandas por contenidos, ya que no hay entidad comercial lucrando con la red.
    *   Publicad en **F-Droid** además de las stores. Es el hogar de las apps soberanas y evita la censura de Google/Apple.

4.  **Mitigación Técnica iOS:**
    *   Para la funcionalidad P2P completa en iOS, considerad un **Wrapper Nativo Ligero** (Capacitor/Ionic) solo para la capa de transporte Bluetooth/WiFi, manteniendo el núcleo React/WebCrypto en web. Esto os da los superpoderes nativos sin perder la agilidad web.
