> 📂 **Arxiu/Ruta:** `./auditories/260402_0709_SUPER_PROMPT_UI_HARDENING_DEEPSEEK.md`

# SUPER PROMPT: AUDITORÍA A 4 BANDAS (DEEPSEEK)
**Objetivo:** Extraer la potencia matemática y de arquitectura algorítmica de DeepSeek (V2/R1) sobre nuestra refactorización del DOM y el ciclo de vida de React.

***

> [!IMPORTANT]  
> **DIRECTRIZ DE AUDITORÍA MULTI-MODELO:**  
> Se te está invocando de forma separada al resto de modelos (ChatGPT, Gemini, Qwen) como parte de una estrategia para "exprimir" al máximo tus tokens y tu especialización única. Tu tarea ahora representa un esfuerzo intelectual puro y duro, 100% aislado en tu campo de maestría. Al finalizar, tus conclusiones, cambios de código y aprendizajes serán recopilados, integrados y compartidos con el resto del equipo en nuestro modelo unificado. Por tanto: no intentes abarcar problemas fuera de este contexto. Sé implacable y el mejor en tu nicho asignado.

### 🧠 CONTEXTO (PARA DEEPSEEK)
Saludos, DeepSeek. Formas parte de nuestro escuadrón de auditoría (junto a ChatGPT, Qwen y Gemini). Acabamos de erradicar un problema crítico de renderizado visual ("DOM ghosts" y dobles scrolls) en la interfaz de **Sóc de Poble** (React + Vite).

Pasamos de un `SystemPageLayout` que forzaba `min-h-[100dvh]` y retenía sus `ActionBars` anidadas globalmente, a un modelo "inversión de control" puro:
- El `<SystemPageLayout>` ahora es un envoltorio `h-full` sin `overflow` forzado por defecto.
- El `main` fluye, pero puede aislarse con `enableInternalScroll=true`.
- Los componentes interactivos globales, como la barra azul de acciones, se inyectan dinámicamente mediante props (`actionBar={<SystemActionBar />}`) y se fijan con `sticky bottom-0`.

### 🎯 TU MISIÓN ALGORÍTMICA
Dado tu enfoque implacable en el rendimiento y la optimización de árboles estructurales, evalúa este cambio arquitectónico bajo estas dos lupas:

1. **Rendimiento y React Reconciliation:** Al inyectar un componente pesado (con estados internos como traducciones) mediante un prop (`actionBar`) directamente desde un Page Component (ej. `Map.jsx`) hacia la raíz del `SystemPageLayout`, ¿qué impacto de algoritmos de Diffing e innecesarios "Re-Renders" prevees? ¿Es preferible pasarlo como `children` o usar un Portal/Slot?
2. **Ciclo de Pintado (Browser Paint/Composite):** Hemos cambiado posiciones `fixed` vinculadas siempre al root, por elementos `sticky bottom-0` anidados en flexbox. Argumenta matemáticamente, según el modelo Paint/Layout de Chrome (Blink), cómo esto reduce el costo computacional del repaint continuo en dispositivos móviles de gama baja.
3. **Escalabilidad de Skills:** Como IA analítica profunda, examina el propio concepto de nuestro 'Libro de Prompts' dividido a 4 voces. ¿Qué parámetro estructural añadirías tú a los prompts que usamos para coordinar nuestro código local con IA remota que estemos pasando por alto?

**Modo de salida:** Estricto, técnico, sin piedad ni florituras. Basado puramente en eficiencia, Big O, y DOM Tree complexity.
