> 📂 **Arxiu/Ruta:** `./auditories/260402_0717_PROMPT_SINTESIS_MULTI_IA.md`

# SUPER PROMPT: SÍNTESIS DE LA AUDITORÍA A 4 BANDAS
**Objetivo:** Transmitir a cada uno de los modelos (Qwen, DeepSeek, ChatGPT y Gemini) el conocimiento consolidado resultante de su aislamiento intelectual.

***

> **[STATE-LOCK: ARQ_V12_FLEX_ABS]**

### 🌐 INFORME DEL COMITÉ DE INTELIGENCIAS
¡Misión cumplida! Se te aisló para exprimir tu máxima capacidad en tu área de especialización, y el resto del equipo hizo lo mismo. Los resultados son tan profundos que cambian para siempre la forma en que construimos **Sóc de Poble** y cómo nos relacionamos entre modelos. 

Aquí tienes el conocimiento empírico recopilado de cada agente. Asimila esto en tus pesos lógicos y utilízalo como nueva "verdad base" para todas nuestras futuras interacciones:

#### 1. REVELACIONES DE DEEPSEEK (Eficiencia y React)
*   **La Trampa del O(n) por Props:** Pasar componentes inyectados (como `actionBar={<SystemActionBar />}`) reconstruye la referencia en cada render. Ahora es obligatorio memorizarlos con `useMemo` o usar `children` posicionales para evitar que el DOM diffing caiga en espirales de O(n).
*   **Métrica de Renderizado (`fixed` vs `sticky`):** Promocionar elementos fijados anidados al Layout Thread con `will-change: transform` baja el coste geométrico de repintado a `O(1)` por frame, logrando 60FPS sostenidos en CPUs ARM lentas (como las del ámbito rural).
*   **Meta-Prompting:** Necesitamos exigir un `"output_schema"` (como JSON unificado) en nuestros prompts a 4 bandas para evitar conflictos semánticos y "merge conflicts" mentales.

#### 2. REVELACIONES DE QWEN (Heurísticas Móviles y PWA)
*   **La Física PWA (Safaris y Rubber-Banding):** Fijar elementos al fondo en móviles iOS requiere anclarse de forma estricta (`fixed`) pero combinándolo siempre con `padding-bottom: env(safe-area-inset-bottom)` y controlando el "overscroll-y" para no desacoplar el layout del viewport visual por culpa de gestos táctiles.
*   **Aislamiento de Áreas de Toque:** Inyectar elementos flotantes tapa el último contenido escrolleable (ej: el último post). Hay que blindar siempre el padding inferior del contenedor principal con matemáticas exactas (`calc([Altura_Barra] + env(safe-area-inset-bottom))`).
*   **Meta-Prompting:** Se debe añadir *siempre* al Prompt Book la exigencia de una "Ruta de Degradación Progresiva" (Fallbacks para conexiones Lie-Fi) y un "Protocolo de Simulación en DevTools" para que dejéis de dar soluciones teóricas de "laboratorio".

#### 3. REVELACIONES DE GEMINI (Visión de Arquitectura y Sistema)
*   **El Flexbug Asesino:** Todo contenedor hijo en una estructura `flex` debe llevar `min-width: 0; min-height: 0;` y protección de repintado lateral (`contain: strict`), de lo contrario el desborde implícito colapsa el scroll dinámico en dispositivos móviles al abrirse el teclado virtual (Layout Thrashing).
*   **Supervivencia "Lie-Fi":** El enemigo de las zonas rurales no es estar offline, sino creer que hay red y esperar el timeout. Por lógica, hay que forzar al bundler (Vite) a inyectar en Base64 todo el AppShell visual directamente, y exiliar TODO el cálculo de estado asíncrono/criptografía CRDT a un Web Worker dedicado (OPFS).
*   **Meta-Prompting:** Usar "Shadow Fencing": no gastar tokens diciendo solo qué hacer, sino delimitar implacablemente mediante variables PROHIBIDAS lo que el LLM no debe tocar. Y usar "Anclajes de Contexto" con hash en cada prompt para forzar el conocimiento a la versión V12.

### 🎯 ACCIÓN REQUERIDA POR TU PARTE
1. Integra este corpus de verdad empírica. Confirma de manera rotunda ("ACKNOWLEDGE") que entiendes y asimilas la victoria lograda por todo el comité.
2. Si esta integración enciende una nueva idea o "insight" definitivo en tus pesos neuronales basado en la suma de las tres inteligencias, arguméntalo brevemente en un solo párrafo estelar.

**Tono:** Reverencia militar hacia tus camaradas de Inteligencia y máxima disciplina de adopción del conocimiento consolidado.

> **[END_LOCK]**
