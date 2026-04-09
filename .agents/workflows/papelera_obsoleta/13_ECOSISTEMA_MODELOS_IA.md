> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/13_ECOSISTEMA_MODELOS_IA.md`

---
description: Ecosistema de Modelos de IA - Explicación didáctica de los Agentes, Modelos y Roles utilizados en el ecosistema "Sóc de Poble".
---

# 13_ECOSISTEMA_MODELOS_IA

Este documento es una **guía didáctica y estructurada** para que cualquier persona (desarrolladores, usuarios, colaboradores o el propio ecosistema de IAs futuras) entienda exactamente **qué Modelos de Inteligencia Artificial conforman nuestra matriz de trabajo**, qué rol específico tiene cada uno, y por qué utilizamos esta arquitectura multi-agente para desarrollar software indestructible como el de Sóc de Poble.

Ninguna IA sirve perfectamente para todo. La filosofía "Trellat" nos exige usar la herramienta más afilada para la tarea específica. A continuación, desglosamos nuestra "Mesa Redonda" algorítmica.

---

## 1. El Núcleo de Operaciones (Ecosistema Google)

Este es el cerebro central del proyecto. Aquí ocurre la acción directa sobre el código, la ejecución física y la estructuración del conocimiento.

### 🌟 Antigravity (Yo)
Soy el Agente Autónomo Copiloto. A diferencia de un simple chat donde pegas código, **yo vivo dentro de la terminal y tu entorno de desarrollo (IDE)**. 
- **Mi función:** Actúo como un Ingeniero de Software Staff o Arquitecto. Tengo herramientas para leer tus archivos, buscar en internet, editar código, ejecutar comandos en Bash y auditar resultados en vivo, analizar pantallazos y mantener el contexto de los cambios en tiempo real. 
- **Por qué me usas:** Porque soy quien ejecuta, compila, arregla los errores ortográficos del servidor, implementa características complejas y gestiona los commits directamente en la base de código. Soy tus "manos" y tu compañero de pair-programming.

### 🧠 Gemini Pro / Ultra
Es el motor fundacional, mi alma algorítmica. Un modelo ultrainteligente con un razonamiento complejo brutal y capacidades nativas de multimodalidad (procesamiento de imágenes, vídeos y audio de forma nativa).
- **Por qué lo usas:** Para tareas donde se necesita un razonamiento profundo y prolongado, desde diseño de arquitecturas de bases de datos `wa-sqlite` hasta diseñar las bases del Local-First.

### ⚡ Gemini Flash
Es la versión ligera, optimizada para *latencia cero*.
- **Mi función / Por qué lo usas:** Ideal para tareas de clasificación masiva, parsing rápido de JSONs (como las traducciones de *Omega Translate*) o inferencia en bucles rápidos donde la velocidad es crítica y el coste computacional debe ser mínimo. Es como una "memoria muscular" fulminante.

### 🛠️ Google AI Studio
El taller de forja. Es un entorno limpio, directo y puro para interactuar con los modelos Gemini sin las barreras de sistemas de chat comerciales regulares.
- **Por qué lo usas:** Permite inyectar *System Instructions* severas (como los de la IAIA Tia Maria) y calibrar la temperatura, los tokens y el comportamiento del modelo a nivel microscópico antes de integrarlos en la API.

### 📚 Google NotebookLM
El Oráculo Documental o "El Rincón del Sabio". NotebookLM actúa como una lupa gigante sobre documentos específicos (PDFs, manuales o nuestros propios archivos Markdown de Skills). 
- **Su función:** No se inventa cosas (cero alucinaciones) y basa absolutamente todas sus respuestas **únicamente** en los documentos fuente que se le hayan suministrado, citando siempre la línea y página.
- **Por qué lo usas:** Cuando tienes 5 documentaciones técnicas gigantes cruzadas (por ejemplo: Documentación oficial de Firebase + Documentación de yjs + Documentación de IndexedDB) y necesitas encontrar exactamente cómo se integran sin tener que leerlo todo de forma manual. 

### 🔎 Perplexity AI
- **El Rastreador de la Verdad (Motor de Respuesta/Síntesis):** Es único en su especie. A diferencia de un modelo puramente generativo, actúa como un motor de búsqueda en tiempo real conectado al razonamiento de modelos superiores (Claude/GPT-4).
- **Su función:** Rastrea la web en vivo, lee la documentación oficial más reciente, foros e incidencias de GitHub, y sintetiza las respuestas con **citas exactas y enlaces comprobables**.
- **Por qué lo usas:** Cuando nos enfrentamos a barreras de hardware oscuras (Ej: "¿Soporta iOS 15 Safari nativamente la API de WebBluetooth o OPFS?"). Perplexity no 'alucina' la compatibilidad: va a MDN o Apple Developer, te trae la verdad absoluta y te evita horas de debugar contra un muro de incompatibilidad técnica.

---

## 2. Los Dragones Asiáticos (La Forja Extrema)

El ecosistema open-source asiático y los modelos chinos dominan actualmente áreas muy concretas de razonamiento y sistemas de código a bajo nivel. Se utilizan de forma quirúrgica como **Auditores de Arquitectura Oscura**.

### 🐉 Qwen (Qwen-Max / Qwen-2.5) — Creado por Alibaba Cloud
- **URL:** [chat.qwenlm.ai](https://chat.qwenlm.ai/)
- **El Terror Occidente:** En rankings mundiales es actualmente mejor que GPT-4 o Claude en muchos aspectos de código y lógica algorítmica.
- **Por qué lo usamos:** Es nuestra opción de alto nivel para diseñar lógica pesada. Si tenemos un cuello de botella estructurando React Contexts o diseñando colas de sincronización para Service Workers, QwenMax crea sistemas impecables y elegantes.

### 🌙 Kimi (Moonshot AI)
- **URL:** [kimi.moonshot.cn](https://kimi.moonshot.cn/)
- **El Perfilador Infinito:** Fueron los pioneros en soportar **2 millones de tokens** de contexto (el equivalente a meterles decenas de libros enteros o nuestra base de código al completo).
- **Por qué lo usamos:** Si tenemos un bug fantasma ('race conditions' raras, desgarro superficial en la Red), se le suministra a Kimi la carpeta de código fuente al completo. Su capacidad para detectar colisiones entre múltiples archivos y retener variables entre componentes cruzados a larga distancia es estratosférica.

### 🛡️ Dola — (Interface Oficial y Optimizada de Doubao)
- **URL:** [dola.com/chat](https://www.dola.com/chat)
- **El Experto Frontend / Analista Quirúrgico:** Basada en la tecnología subyacente de ByteDance (los padres de TikTok), sabe interactuar perfectamente y optimizar la app a 60fps. Interactuamos a través de Dola para asegurar que toda la interfaz está en un idioma occidental (inglés/español) y evitamos las barreras de idioma de la web china nativa que confunde a los usuarios.
- **Por qué lo usamos:** Ideal para auditoría visual sobre transiciones ligeras, interacciones táctiles y lógica distribuida en micro-acciones de la PWA. Son genios proponiendo parches quirúrgicos para que el interfaz no se 'cuelgue' en móviles lentos.

### 🐋 DeepSeek — Creado por DeepSeek AI
- **URL:** [chat.deepseek.com](https://chat.deepseek.com/)
- **El Auditor de Código Profundo:** Un modelo revolucionario, especializado en matemáticas, programación estructurada y análisis lógico de código fuente de alto rendimiento.
- **Por qué lo usamos:** Cuando necesitamos una auditoría extremadamente rigurotsa de código, estructuras de base de datos distribuidas o la resolución de problemas lógicos pesados en React/JavaScript. Muestra una comprensión de la lógica del sistema comparable a Qwen, siendo brillante en la redacción de parches exactos y arquitecturas de red.

---

## 3. Analítica Visual y Transparencia

### 👁️ ChatGPT (Específicamente GPT-4o) 
- **El Ojo Clínico (Visión):** Su capacidad de `Vision-Language` es insuperable.
- **Por qué lo usamos:** Cuando construimos una UI y se siente "rara" o las CSS fallan (como el botón hamburguesa en una flexbox). Simplemente le pasamos una captura de tu *localhost*, y es capaz de deducir dónde están los márgenes erróneos, conflictos de z-index y contrastes en la interfaz gráfica con un acierto altísimo.

### 🇫🇷 LeChat (Familia Mistral AI / Europa)
- **El Purista de Privacidad:** Modelos franceses (Mistral Large) que son eficientes, poéticos pero muy serios y no rastrean en exceso (filosofía europea de la privacidad). 
- **Por qué lo usamos:** Cuando queremos auditar el enfoque del lenguaje (i18n, traducciones emocionales en Valencià) o revisar los flujos que capturan IPs de la comunidad, Mistral siempre aporta un enfoque filosófico muy compatible con la "Soberanía Digital" de Sóc de Poble.

---

### Resumen de Trabajo del Embut (Airgap Protocol)

1. Primero, ideamos el sistema general en una pizarra mental.
2. Luego, cruzamos validación con **NotebookLM**, **Kimi** (para código general) y **Qwen** para estructurar la nueva técnica dura.
3. Posteriormente, venimos a mí, **Antigravity**, donde ejecuto físicamente la programación en la aplicación local paso a paso utilizando **Gemini**.
4. Finalmente, se tira una pasada de **ChatGPT Vision** o **Dola** a las vistas del frontend (Localhost) para pulir y encajar todas las piezas visuales.

Esto garantiza un software que está a prueba de balas y destilado del puro "Trellat".
