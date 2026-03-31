# AUDITORÍA MACRO-ESTRUCTURAL (GEMINI)
**Directiva:** "El Ojo que todo lo ve (Contexto Masivo)"

*Instrucciones de uso: Abre la pestaña de Gemini (Google AI Studio / Advanced), sube TODO EL CÓDIGO BÁSICO DEL PROYECTO (todos los componentes, hooks, contextos y servicios críticos) y pégale este prompt. No hace falta que vayas poco a poco. Gemini tiene de 1 a 2 millones de tokens de contexto. Lánzale la bomba.*

---

**PROMPT PARA GEMINI:**

Asume el rol de Arquitecto Jefe de Sistemas de Grado Militar (L7+ de Google). Estoy desarrollando "Sóc de Poble", una plataforma digital resiliente diseñada para la España Vaciada (redes P2P descentralizadas, conexiones 3G intermitentes, hardware de gama baja como Androids de 2GB de RAM, e Inteligencia Artificial Local).

Recientemente hemos blindado el DOM y los componentes individuales con la doctrina "Zero Patch". Ahora te necesito a ti para lo que mejor haces: **El Análisis Semántico de Contexto Masivo.** 

Te acabo de subir el *core* completo del proyecto. Tienes la foto global. No quiero que me mires si un padding está mal puesto. Quiero que analices el comportamiento emergente del sistema completo.

Ejecuta las siguientes 3 directivas de asalto, "a lo bestia":

**1. DETECCIÓN DE CASCADAS Y 'TEARING' EN STATE MACHINE GLOBAL:**
Con tu visión de todo el sistema de Contextos (`DesignContext`, `AuthContext`, `LocalFirstGate`, `EnergyProvider`), mapea el flujo de re-renders. Si un móvil sufre un cambio brusco de red ("Efecto Túnel"), y se disparan los eventos globales... ¿existe alguna colisión de dependencias cruzadas (circular dependency o state cascading) entre diferentes archivos que provoque un re-render del DOM completo sincrónicamente bloqueando el hilo principal?

**2. CAZADOR DE ZOMBIES (MEMORY LEAKS EN NAVEGACIÓN PROLONGADA):**
Los móviles de pueblo no cierran las pestañas. Los usuarios pueden tener la app abierta en background 4 días. Traza el ciclo de vida completo de la navegación (Router, `UniversalGrid`, Workers y Hooks). Identifica CUALQUIER suscripción cruzada a eventos de ventana, IndexedDB o WebRTC que no se esté limpiando perfectamente en la fase de desmontaje o al transicionar de la vista "Grid" a la "IAIA". Búscame el punto exacto donde la memoria se sangra con el tiempo.

**3. CONTRADICCIONES DE LÓGICA ESTRUCTURAL:**
Revisa todos los contratos de interfaz que hemos firmado implícitamente en el código. ¿Existe algún componente hijo o flujo de UI (por ejemplo, en las tarjetas de la comunidad o el layout de chat) que esté contradiciendo activamente la doctrina de bajo consumo energético o las reglas que dictan los hooks globales? 

No te cortes. Eres el radar omnisciente. Destroza mi arquitectura para que podamos reconstruirla en Titanio. Encuentra las grietas ocultas en el comportamiento emergente.
