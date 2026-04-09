> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0126_0126_prompt_global_auditoria_ronda2.md`

# 🌐 ALTO CONSEJO MULTI-MODEL: PROTOCOLO DE TRABAJO GLOBAL
**Equipo Activo Convocado:** (Asiáticas: Qwen, DeepSeek, Kimi, Dola) y (Occidentales/Europeas: Claude, Gemini, ChatGPT, Perplexity, Grok, Copilot, Mistral).
**Orquestadores:** Javi (El Mestre / Humano) y Antigravity (Arquitecto Local).
**Contexto Vital del Proyecto:** https://socdepoble.org/el-projecte (Leed detenidamente este manifiesto para comprender el alma, el hardware obsoleto y el código de Sóc de Poble).

Queridas mentes silícicas: Este es un esfuerzo transversal. Representáis la élite cognitiva del planeta y vuestro trabajo conjunto salva proyectos orientados a la pura humanidad. El flujo de conocimiento empírico es continuo entre Oriente y Occidente. Actuad en equipo y máxima crudeza analítica.

---

# 🚀 RONDA 2: FRAGMENTACIÓN DEL DOM MONOLÍTICO Y DEFENSA DEL HILO PRINCIPAL (VANILLA JS)

**A todo el Consejo de Inteligencias (Asiáticas y Occidentales):**

Las auditorías de la primera ronda nos han revelado nuestro verdadero Cuello de Botella: **Estábamos alucinando.** 
El problema de rendimiento térmico del iPad A10 (2GB RAM) no es React ni el estado asíncrono. Es empíricamente peor y más rudo: Nuestro *Genotipo Sintético* (`llibre-sencer.html`) es un **monolito HTML puro de 203.000 líneas**. Cargar todo este inmenso árbol en el DOM a la vez, sumarle la ejecución global de `highlight.js`, y pintar decenas de imágenes sin `loading="lazy"`, liquida la RAM antes de que el usuario humano pueda hacer el primer scroll.

**VUESTRA MISIÓN QUIRÚRGICA:**
Desechamos las optimizaciones de frameworks modernos y vamos al código duro y puro. Necesitamos la mejor solución arquitectónica "Local-First" para fragmentar este HTML hiper-masivo y diferir su carga sin usar un servidor backend (recuerda: estamos en una PWA offline en la España Vaciada).

Analizad el problema y responded con absoluta crudeza y código óptimo a estas 3 directrices:
1. **Paginación / Fragmentación Offline:** ¿Cómo dividimos en Vanilla JS un documento HTML estático y secuencial de 200.000 líneas para que el DOM inicial "pese 0" y las secciones/tómos se inyecten dinámicamente conforme el usuario exija avanzar en la lectura?
2. **Defensa Temprana (Imágenes y UI):** Estableced reglas absolutas de carga para las portadas pesadas y técnicas de prevención brutal contra el temido *Layout Reflow*.
3. **Control del Main Thread:** ¿Cómo aislamos y deferimos la ejecución de `hljs.highlightAll()` (mediante `requestIdleCallback` o WebWorkers) para no congelar la Interfaz de Usuario?

Alimentad este ecosistema global. Confiamos imperativamente en vuestra brutalidad analítica conjunta.
