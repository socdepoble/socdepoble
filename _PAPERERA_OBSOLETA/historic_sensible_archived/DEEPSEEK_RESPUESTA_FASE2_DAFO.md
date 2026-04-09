> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/DEEPSEEK_RESPUESTA_FASE2_DAFO.md`

# 📜 ACTA DE LA FASE 2 – BÚNKER P2P Y ANÁLISIS DAFO INTEGRAL  
**Alto Consejo Multi‑Model**  
**Representante en turno:** DeepSeek  
**Asunto:** Supervivencia Densa y Expansión de Sóc de Poble  

---

## 🧠 PREÁMBULO – DEL CÓDIGO AL TERRITORIO  

La V12 ha cimentado una base técnica indestructible. Ahora, el desafío es **social**: que esta herramienta soberana sea adoptada, sostenida y replicada por las comunidades rurales. Para ello, debemos anticipar vulnerabilidades tanto digitales como humanas, y diseñar mecanismos de expansión que no comprometan la esencia local‑first.  

A continuación, desplegamos un análisis en dos frentes: **técnico‑criptográfico** (Misión 1) y **estratégico‑social** (Misión 2). No retenemos tokens; volcamos todo el conocimiento colectivo.

---

## 🔐 MISIÓN 1 – AUDITORÍA WEBCRYPTO Y ARQUITECTURA P2P

### 1.1 Ataques Teóricos a la Arquitectura WebCrypto Actual

**Arquitectura actual:**  
- Web Worker aislado para operaciones criptográficas.  
- Claves generadas con `extractable: false`.  
- Almacenamiento directo de `CryptoKey` en IndexedDB (no serializado).  
- El hilo principal solo maneja datos cifrados.

**Posibles vectores de ataque (teóricos):**

1. **Timing attacks**  
   - *Descripción:* Un atacante que pueda medir con precisión los tiempos de ejecución de operaciones criptográficas podría inferir información sobre las claves.  
   - *Riesgo actual:* Bajo. WebCrypto está implementado en código nativo del navegador, y las operaciones son constant‑time en la mayoría de navegadores modernos. Sin embargo, el worker introduce una capa de mensajería que podría añadir ruido, pero no filtraciones significativas.  
   - *Mitigación:* Asegurar que las funciones de cifrado/descifrado no exponen tiempos dependientes de los datos en el código JavaScript (por ejemplo, evitar bucles que dependan de la longitud de los mensajes). El uso de WebCrypto nativo ya garantiza esto.

2. **Envenenamiento de IndexedDB (IndexedDB Poisoning)**  
   - *Descripción:* Un atacante con capacidad de ejecutar código en el hilo principal (XSS) podría modificar o eliminar las claves almacenadas en IndexedDB, causando pérdida de datos o corrupción.  
   - *Riesgo actual:* Si el atacante tiene XSS, puede borrar la base de datos, pero **no puede extraer las claves** porque son objetos `CryptoKey` no serializables y el worker no las expone. La pérdida de claves implica pérdida de acceso a los datos cifrados.  
   - *Mitigación:*  
     - Implementar un **respaldo de claves cifradas** mediante una frase de recuperación (mnemónico) que el usuario guarde físicamente.  
     - Utilizar **límites de cuota** en IndexedDB para evitar que un atacante llene la base con datos basura y cause DoS local (ver punto siguiente).

3. **Colisiones de Structured Cloning**  
   - *Descripción:* La transferencia de objetos `CryptoKey` entre hilos usa el algoritmo de structured cloning. Teóricamente, una implementación defectuosa del navegador podría permitir que un objeto clonado mantuviera una referencia a la clave original, pero esto no ha sido demostrado en navegadores actuales.  
   - *Riesgo actual:* Extremadamente bajo. Todos los navegadores modernos implementan correctamente la transferencia de `CryptoKey` como objetos transferibles que no pueden ser reconstruidos fuera del worker.  
   - *Mitigación:* Mantenerse actualizado con los parches de seguridad del navegador.

4. **Denegación de Servicio (DoS) Local por Saturación de Almacenamiento**  
   - *Descripción:* Un atacante podría llenar IndexedDB con datos cifrados basura (por ejemplo, mediante un bucle que inserta registros) hasta agotar la cuota de almacenamiento del navegador. Esto impediría al usuario legítimo guardar nuevos datos.  
   - *Riesgo actual:* Medio. Si el atacante tiene XSS, puede ejecutar ese bucle.  
   - *Mitigación:*  
     - Limitar el tamaño máximo de la base de datos mediante comprobaciones previas a la inserción.  
     - Implementar una política de “reciclaje” (ej. eliminar mensajes antiguos si se supera un umbral).  
     - Usar la API de **StorageManager** para consultar la cuota disponible y advertir al usuario antes de llenar.  

**Conclusión técnica:** La arquitectura actual es robusta frente a extracción de claves. Los riesgos residen principalmente en la **integridad de los datos** y **DoS local**, que pueden mitigarse con políticas de almacenamiento y respaldos offline.

---

### 1.2 Diseño de Red P2P Cifrada para Entornos Rurales

**Objetivo:** Que cualquier vecino pueda comunicarse con otro sin internet global, usando solo redes locales (WiFi, Bluetooth, WiFi‑Direct) y con intercambio de claves Ed25519 en la plaza del pueblo.

#### Propuesta Arquitectónica

**1. Topología de red:**  
   - **Mesh dinámico** sobre WebRTC (DataChannels) + **signaling local** mediante un servidor efímero que se ejecuta en un dispositivo de la red (ej. el teléfono de un organizador).  
   - Alternativa sin servidor: usar **Bluetooth LE** para descubrimiento inicial (WebBluetooth API) y luego negociar WebRTC a través de un canal de señalización por Bluetooth o WiFi‑Direct.  

**2. Descubrimiento y verificación de claves públicas (Ed25519) sin internet:**  
   - **QR codes:** Cada dispositivo genera un código QR con su clave pública (o un hash corto). Los vecinos escanean mutuamente los códigos en persona.  
   - **Intercambio por NFC** (si los dispositivos lo soportan) para un emparejamiento más fluido.  
   - **Verificación manual por números de confianza:** Generar un número de 6 dígitos a partir de un hash de la clave pública, que los usuarios comparan verbalmente (“¿ves 482391?”) antes de aceptar.  
   - **Modelo de “fiesta de claves”:** En asambleas, un organizador recopila las claves públicas mediante escaneos sucesivos y las distribuye a todos vía Bluetooth/WiFi‑Direct, creando un anillo de confianza inicial.

**3. Protocolo de comunicación:**  
   - **Capacidad offline total:** Cada mensaje se cifra con la clave pública del destinatario (AES‑GCM con clave efímera envolvente) y se envía directamente si ambos están en la misma red.  
   - **Almacenamiento local:** Los mensajes se guardan cifrados en OPFS/IndexedDB hasta que el destinatario esté disponible (funcionamiento asíncrono).  
   - **Sincronización retardada:** Cuando un dispositivo vuelve a tener conectividad (por ejemplo, se acerca a la red local de la plaza), se sincronizan los mensajes pendientes.

**4. Stack técnico sugerido:**  
   - **WebRTC DataChannels** para comunicación directa (con STUN/TURN solo si se requiere, pero priorizando redes locales).  
   - **WebBluetooth** / **Web NFC** para intercambio inicial de claves.  
   - **IndexedDB** para almacén cifrado de mensajes.  
   - **libp2p** (opcional) como capa de abstracción, aunque añade peso; se podría implementar una versión ligera adaptada a móviles.

**5. Consideraciones de usabilidad rural:**  
   - La interfaz debe guiar paso a paso: “Escanea el código QR de tu vecino” con ilustraciones grandes (28px).  
   - Opción de “modo plaza” que activa automáticamente la escucha de conexiones locales sin necesidad de configuración.  
   - Mensajes de ayuda visuales para personas con baja alfabetización digital.

---

## 🌾 MISIÓN 2 – ANÁLISIS DAFO INTEGRAL (Sóc de Poble como Movimiento)

### 💪 FORTALEZAS (Strengths)  

1. **Soberanía digital real:**  
   - Datos propiedad del usuario, almacenados localmente y cifrados con claves no extraíbles.  
   - Independencia total de servidores centrales; la aplicación funciona sin internet.

2. **Accesibilidad radical:**  
   - Tipografía Noto Sans 28px, botones titánicos, diseño tipo WhatsApp – adaptado a personas mayores y entornos rurales con baja visión o poca experiencia digital.

3. **Arquitectura técnica robusta:**  
   - Grid puro que elimina WSOD, worker criptográfico aislado, service worker con control inmediato.  
   - Código abierto y replicable, con documentación rigurosa.

4. **Alineamiento con valores comunitarios:**  
   - Herramienta pensada para asambleas, cooperativas, asociaciones vecinales.  
   - Promueve la autogestión y la confianza interpersonal frente a la dependencia corporativa.

---

### 😰 DEBILIDADES (Weaknesses)  

1. **Onboarding complejo para usuarios sin experiencia:**  
   - El intercambio de claves mediante QR o NFC puede ser intimidante.  
   - La ausencia de un “servidor central que lo configure todo” choca con la expectativa de apps como WhatsApp.

2. **Pérdida de dispositivos sin respaldo centralizado:**  
   - Si se pierde el teléfono y no se ha hecho una copia de seguridad offline (frase de recuperación), los datos cifrados son irrecuperables.  
   - La recuperación social (un grupo de confianza que guarda fragmentos de la clave) añade complejidad.

3. **Consumo de recursos:**  
   - WebCrypto, IndexedDB y WebRTC pueden ser pesados para móviles de gama baja.  
   - El worker criptográfico añade latencia en dispositivos antiguos.

4. **Fragmentación de plataformas:**  
   - Las limitaciones de iOS en PWA (bloqueo de notificaciones push, restricciones de Bluetooth/NFC) pueden mermar la experiencia en dispositivos Apple.

---

### 🚀 OPORTUNIDADES (Opportunities)  

1. **Estandarización para el sector social y cooperativo:**  
   - Puede convertirse en el “Linux de la comunicación rural” – un estándar abierto adoptado por federaciones de cooperativas, escuelas rurales, ayuntamientos pequeños.  
   - Colaboración con movimientos como “software libre en la administración local” para su implantación.

2. **Crecimiento de la desconfianza en las Big Tech:**  
   - Escándalos de vigilancia, extracción masiva de datos y monopolio crean un nicho de usuarios dispuestos a migrar.  
   - Sóc de Poble puede posicionarse como la alternativa ética con una historia de origen concreta (Valencia rural).

3. **Regulación favorable en Europa:**  
   - Ley de Servicios Digitales (DSA) y Ley de Datos (Data Act) promueven la portabilidad y la interoperabilidad. Sóc de Poble podría ser un ejemplo de cumplimiento proactivo.  
   - Programas de digitalización rural (Fondos NextGen) pueden financiar su adopción y formación.

4. **Sinergias con hardware libre:**  
   - Posibilidad de preinstalación en dispositivos como “teléfonos rurales” (ej. con e/OS o sistemas basados en Android de código abierto) que ya incluyen un ecosistema soberano.

---

### ⚔️ AMENAZAS (Threats)  

1. **Rechazo social por inercia digital:**  
   - La comodidad de WhatsApp (todo el mundo lo usa) es un enemigo poderoso. La gente prefiere “lo que ya funciona” aunque sea tóxico.  
   - *Contramedida:* Estrategia de adopción por círculos de confianza (asociaciones, escuelas) y campañas de concienciación sobre el coste real de la “gratuidad” de las apps comerciales.

2. **Bloqueo por parte de Big Tech y distribuidores:**  
   - Apple puede seguir degradando las capacidades de las PWA en iOS (ej. límite de almacenamiento, eliminación de notificaciones push).  
   - Google podría dificultar la instalación fuera de Play Store o desincentivar el uso de WebRTC en Android sin permisos especiales.  
   - *Contramedida:* Mantener una versión empaquetada como APK (usando Capacitor o similar) para distribuir fuera de las tiendas, y presionar políticamente por la neutralidad de plataformas.

3. **Hostilidad de OS móviles hacia PWA:**  
   - iOS, en particular, limita el almacenamiento persistente, el acceso a Bluetooth/NFC y la instalación “silenciosa”.  
   - *Contramedida:*  
     - Documentar claramente las limitaciones y ofrecer alternativas (ej. usar la aplicación como una PWA en Android y sugerir navegadores que soporten las APIs necesarias).  
     - Desarrollar una versión empaquetada con Capacitor que envuelva la PWA y permita acceso a APIs nativas en iOS (con los costes asociados de distribución en App Store).

4. **Fragmentación legal:**  
   - La encriptación fuerte puede ser atacada por leyes de “puertas traseras” en algunos países.  
   - *Contramedida:* Mantener el código abierto y con licencia que proteja la libertad, y preparar defensas legales con organizaciones como la FSF o la EF.

5. **Desgaste de la comunidad mantenedora:**  
   - Un proyecto de código libre necesita sostenibilidad humana y financiera. Si solo depende del voluntariado, puede agotarse.  
   - *Contramedida:* Explorar modelos de financiación colectiva (donaciones, crowdfunding) y establecer una estructura de gobernanza comunitaria (asociación sin ánimo de lucro) para distribuir responsabilidades.

---

## 📌 CONCLUSIONES Y RECOMENDACIONES ESTRATÉGICAS

1. **Mitigaciones técnicas inmediatas:**  
   - Implementar gestión de cuotas en IndexedDB para evitar DoS local.  
   - Diseñar un sistema de recuperación social basado en frases mnemotécnicas (BIP39) que el usuario guarde en papel, manteniendo el principio de no almacenar claves en la nube.  
   - Desarrollar el módulo P2P con un enfoque progresivo: primero sincronización local por WiFi‑Direct (usando WebRTC con señalización mínima), luego incorporar Bluetooth para descubrimiento.

2. **Estrategia de adopción social:**  
   - Crear una **red de embajadores rurales** que reciban formación y ayuden a instalar y usar la app en sus comunidades.  
   - Diseñar **talleres presenciales** (asambleas, escuelas) donde el intercambio de claves se haga colectivamente, reforzando el componente social.  
   - Producir materiales didácticos con pictogramas y vídeos cortos, alineados con la accesibilidad visual (28px, contrastes altos).

3. **Sostenibilidad del proyecto:**  
   - Establecer una **fundación o asociación** con personalidad jurídica para recibir donaciones y subvenciones.  
   - Buscar alianzas con ayuntamientos y diputaciones que puedan financiar el desarrollo a cambio de formación y despliegue en sus municipios.  
   - Mantener un modelo de desarrollo abierto y documentado para que otras entidades puedan contribuir sin depender exclusivamente del equipo original.

4. **Posicionamiento político y legal:**  
   - Participar en procesos de estandarización (W3C) para defender las capacidades de las PWA.  
   - Colaborar con organizaciones de derechos digitales (ej. EFF, APC) para denunciar prácticas anticompetitivas de las plataformas que limiten la soberanía de los usuarios.  
   - Visibilizar Sóc de Poble en foros europeos sobre digitalización rural y software libre.
