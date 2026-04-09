> 📂 **Arxiu/Ruta:** `./auditories/260402_0708_SUPER_PROMPT_FUTURO_MARTE_CHATGPT.md`

# SUPER PROMPT: AUDITORÍA A 4 BANDAS (CHATGPT)
**Objetivo:** Obtener la máxima precisión algorítmica de ChatGPT (modelo o1/o3-mini/o3-pro si está disponible) sobre la reciente actualización arquitectónica de UI en Sóc de Poble y nuestra técnica de escalamiento de prompts.

***

> [!IMPORTANT]  
> **DIRECTRIZ DE AUDITORÍA MULTI-MODELO:**  
> Se te está invocando de forma separada al resto de modelos (Gemini, DeepSeek, Qwen) como parte de una estrategia para "exprimir" al máximo tus tokens y tu especialización única. Tu tarea ahora representa un esfuerzo intelectual puro y duro, 100% aislado en tu campo de maestría. Al finalizar, tus conclusiones, cambios de código y aprendizajes serán recopilados, integrados y compartidos con el resto del equipo en nuestro modelo unificado. Por tanto: no intentes abarcar problemas fuera de este contexto. Sé implacable y el mejor en tu nicho asignado.

### ⚙️ CONTEXTO (PARA CHATGPT)
Saludos, ChatGPT. Eres parte de un comité supremo de auditoría junto a Antigravity, Qwen, DeepSeek y Gemini. Estamos construyendo **Sóc de Poble**, el ecosistema descentralizado y Local-First para conectar municipios rurales.
Hemos tenido un gran desafío arquitectónico en el frontend (React + Vite): la UI colapsaba porque el `SystemPageLayout` usaba `min-h-[100dvh]` y generaba "dobles scrolls" y "fantasmas de DOM" (DOM ghosts). Los módulos como FullCalendar subían debajo del header sticky, ocultando sus herramientas de navegación, y la Action Bar `SystemActionBar` se quedaba flotando a destiempo en el viewport.

La **Solución Nivel Dios** diseñada por Antigravity ha sido:
- Quitar constraints forzados. El layout ahora fluye natural con un modelo `flex flex-col h-full bg-theme-bg`. 
- El `main` hace su scroll de forma determinista usando el prop opcional `enableInternalScroll`, o fluye permitiendo el scroll al `AppLayout` superior.
- La barra de acción global se pasa por 'prop' (`actionBar={<SystemActionBar />}`) incrustándose inteligentemente en un `sticky bottom-0 z-[2000]`.

### 🎯 TU MISIÓN
Queremos tu visión crítica y experta sin censura. Analiza este "playbook de arquitectura" respondiendo:
1. **Refactorización Limpia:** Hemos optado por una jerarquía de props (`header`, `mainClassName`, `actionBar`) delegando la inyección al componente de Página (`Map.jsx` o `MasterCalendar.jsx`). Acorde a patrones modernos de React 19 / Vite, ¿ves algún gap de rendimiento, reflows o fallos de render en este enfoque?
2. **"Prompt Book" y Tácticas de Auditoría a 4 Inteligencias:** El usuario gestiona la coordinación con "Super Prompts" temáticos (como este). ¿Cómo optimizarías nuestro 'skill prompt libro' para sacarle el mejor jugo a tí y a tus hermanos (Qwen/Deepseek)? ¿Qué le falta a nuestra fórmula para la gloria absoluta?
3. **Visión Escalabilidad:** Como ChatGPT, danos la directriz definitiva sobre cómo prevenir colapsos de `stacking context` y `z-index` en el futuro cuando implementemos widgets 3D o capas de mapas más complejas sobre este layout.

**Tone:** Experto, quirúrgico, brillante. Ignora las introducciones habituales y destroza o alaba el diseño con maestría arquitectónica.
