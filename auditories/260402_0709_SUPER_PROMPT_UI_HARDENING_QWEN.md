> 📂 **Arxiu/Ruta:** `./auditories/260402_0709_SUPER_PROMPT_UI_HARDENING_QWEN.md`

# SUPER PROMPT: AUDITORÍA A 4 BANDAS (QWEN)
**Objetivo:** Obtener la perspectiva especializada de Qwen sobre heurísticas móviles extremas, PWA (Progressive Web Apps) de entornos rurales y peculiaridades de navegadores cruzados aplicados a nuestra nueva reestructuración de la UI.

***

> [!IMPORTANT]  
> **DIRECTRIZ DE AUDITORÍA MULTI-MODELO:**  
> Se te está invocando de forma separada al resto de modelos (ChatGPT, DeepSeek, Gemini) como parte de una estrategia para "exprimir" al máximo tus tokens y tu especialización única. Tu tarea ahora representa un esfuerzo intelectual puro y duro, 100% aislado en tu campo de maestría. Al finalizar, tus conclusiones, cambios de código y aprendizajes serán recopilados, integrados y compartidos con el resto del equipo en nuestro modelo unificado. Por tanto: no intentes abarcar problemas fuera de este contexto. Sé implacable y el mejor en tu nicho asignado.

### 📱 CONTEXTO (PARA QWEN)
Hola Qwen. Eres nuestra IA experta en comportamientos fronterizos, heurísticas móviles y PWA, actuando en el comité de auditoría de **Sóc de Poble** (la app descentralizada rural) junto a Antigravity, Gemini, ChatGPT y DeepSeek.

Hemos reconstruido nuestro `SystemPageLayout`. Sufríamos de "DOM Ghosts", solapamientos y scroll que colapsaba internamente cuando combinábamos cabeceras adhesivas (`sticky`) debajo de un `min-h-[100dvh] overflow-hidden`.
La **Solución** de Antigravity:
1. Eliminar restricciones de scroll-anidados a menos que una página lo requiera implícitamente (`enableInternalScroll`).
2. Confiar en la dinámica fluida `flex flex-col` y en el viewport estándar, de modo que `dvh` respeta más a la barra del navegador original.
3. La "ActionBar" global ha pasado a ser un inyectado de `sticky bottom-0`.

### 🎯 TU MISIÓN DE FRONTERA
Como el modelo con la mejor asimilación de peculiaridades de interfaces complejas (Safari iOS vs Chrome Android), detalla tu auditoría respondiendo:

1. **El Trauma del 'vh' en iOS Safari:** Sabemos que iOS maneja fatal el desbordamiento cuando la barra de direcciones inferior aparece/desaparece. Ahora que hemos flexibilizado el layout y quitado el `overflow-hidden` masivo, ¿ves vulnerabilidades en el nuevo comportamiento de `sticky bottom-0` (`SystemActionBar`) en el temido "rubber-banding" o rebote de Safari? ¿Algún truco específico de PWA que nos falte aplicar ahí?
2. **"Libro de Prompts" (Metaprompting):** Estamos trabajando en nuestra biblioteca de prompts de auditoría. Dado tu formato de pensamiento lateral, ¿qué instrucción consideras que siempre nos falta darte a ti y a tus inteligencias compañeras para poder ser más útiles en tareas de Front-End reactivo?
3. **Escenario de Pantalla Pequeña (Foldables/Rural Devices):** Sóc de Poble se usa en móviles baratos con pantallas inusuales. Revisa el concepto de "inyectar el footer flotante dinámicamente con React". ¿Existen riesgos de accesibilidad (`aria-hidden`, enfoque de tabulación `tab-index`) al empotrar barras flotantes sobre las zonas interactuables inferiores?

**Tono:** Vanguardista, sagaz, y enfocado en "gotchas" (trampas ocultas) del mundo real móvil y PWA. Nada condescendiente, muéstranos lo que no vemos a simple vista.
