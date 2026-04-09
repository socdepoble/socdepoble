> 📂 **Arxiu/Ruta:** `./auditories/260409_0234_Rondas_Activas/260409_0336_0305_R4_VirtualScrolling_Benchmarking.md`

# 🌐 ALTO CONSEJO MULTI-MODEL: PROTOCOLO DE TRABAJO GLOBAL

**Equipo Activo Convocado:** (Asiáticas: Qwen, DeepSeek, Kimi, Dola) y (Occidentales/Europeas: Claude, Gemini, ChatGPT, Perplexity, Grok, Copilot, Mistral).
**Orquestadores:** Javi (El Mestre / Humano) y Antigravity (Arquitecto Local).

---
> **[ESTADO DE EMERGENCIA: CONTEXTO GLOBAL INVARIABLE]**
> *(Aviso para IAs en nuevos chats sin contexto previo)*
> **El Proyecto:** Estamos construyendo "Sóc de Poble", un inmenso ecosistema enciclopédico local-first (PWA) de casi 200.000 líneas de HTML/Tomo.
> **La Restricción:** Cero bases de datos externas en producción. Cero frameworks abusivos (Ni React, ni Vue). Todo en Vanilla JS ("Genotipo Sintético").
> **La Realidad Material:** Nuestro usuario final es un jubilado/a ("la iaia") en la España vaciada, usando un **iPad A10 Fusion de 2018 (2GB de RAM) con Safari 14** y conectividad dudosa.
> **El Histórico (Ronda 3):** Acabamos de destrozar nuestra propia arquitectura. Intentamos cargar los fragmentos asíncronamente con un simple `IntersectionObserver` y `caches.addAll()`, pero causamos un colapso térmico, picos de OOM (Out of Memory) y "Layout Thrashing" cuando el usuario hacía *swipe* rápido. 
> **La Arquitectura Reforzada:** Acabamos de decidir migrar a un almacenamiento híbrido (IndexedDB para los *chunks* masivos + Cache Storage para la estructura visual) y abandonar el DOM infinito en favor de un Object Pooling (Virtual Scrolling absoluto).
---

## 🚀 RONDA 4: LA RECONSTRUCCIÓN (VIRTUAL SCROLLING Y BENCHMARKING)

La Ronda 3 de Destrucción ha sido un éxito absoluto. Habéis demostrado que el planteamiento ingenuo del DOM Líquido moriría bajo un *swipe* rápido y que la Cache API provocaría un OOM silencioso masivo en un dispositivo antiguo. La masacre ha limpiado el terreno.

Ahora iniciamos la **fase de Reconstrucción Quirúrgica**, forzada por las propuestas dominantes de la sesión anterior que marcaron la supervivencia.

### 📜 LEY INQUEBRANTABLE DE INVOCACIÓN (Ronda 4)

Toda IA que responda a este prompt debe ceñirse estructuralmente a los parámetros definidos por el Alto Consejo:

**Hardware objetivo:** iPad A10 2 GB RAM / iOS 14.8 / Safari 14.1 (Entorno térmico agresivo).
**Escenario de prueba:** Usuaria rural (Iaia) haciendo *swipe vertical agresivo* cruzando 20 tomos en menos de 2 segundos. Conectividad 3G intermitente o modo offline.
**Métrica de éxito:** Cero *Layout Thrashing*, RAM peak < 200MB, latencia de renderizado inferior a 33ms por frame (manteniendo mínimo 30fps sin thermal throttle).

---

### 🪢 FRENTE 1: PROFUNDIZAR EN VIRTUAL SCROLLING MATEMÁTICO
**Objetivo:** Desarrollar la arquitectura de código final en *Vanilla JS* para el "Virtual Scrolling Absoluto" de múltiples alturas dinámicas.
- **La Restricción:** No podemos usar `@tanstack/virtual` ni frameworks de React.
- **El Reto:** El genotipo sintético tiene alturas de artículo extremas y variables (de 200px a 4000px).
- **Entregable Esperado:** Código puro que implemente un Object Pooling limitado estrictamente a 3 nodos del DOM (`div` absolutos) que se re-inyectan en pleno vuelo, reciclando `transform: translateY()` sobre un viewport fantasma kilométrico. ¿Cómo sincronizamos el scroll del `requestAnimationFrame` con el mapa numérico de alturas variables?

### 💥 FRENTE 2: BENCHMARKING EN IPAD A10
**Objetivo:** Establecer una matriz de `PerformanceObserver` capaz de simular/monitorear la muerte térmica en producción.
- **El Reto:** Si implementamos el Virtual Scrolling y el Híbrido Catch-on-Demand (IDB + Cache API), necesitamos medir en vivo desde el lado cliente cuándo la CPU está quemando el iPad para activar el `thermal_throttle_mode`.
- **Entregable Esperado:** Funciones instrumentales para testear el *Layout Thrashing*, medir picos del *Garbage Collector* (con las herramientas limitadas que nos da JS en Safari 14), y un código de medición de *FPS drop* basado en deltas del `requestAnimationFrame`.

---

**[INSTRUCCIONES FINALES PARA LOS MODELOS]**
No quiero poesía. No quiero elogios. Presentad vuestros enfoques técnicos basándoos en los dos frentes establecidos. Alinearos con la brutalidad de la Ronda 3. Si veis una fisura en el Frente 1, atacadla en el Frente 2.  

**Aviso Crítico de Recursos:** Si detectas que te estás quedando sin tokens de contexto o de salida, AVISA explícitamente para que El Mestre pueda planificar su estrategia para optimizarlos, o aconséjale abrir un nuevo chat para la siguiente respuesta.

*Empieza la reconstrucción de la España Vaciada.*
