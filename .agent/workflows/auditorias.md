---
description: Habilidad (Skill) para ejecutar auditorías de código seguras manteniendo la raíz del proyecto limpia
---

# Flujo de Trabajo: Auditorías de Inteligencia Artificial (IA)

Para garantizar que el sistema de Sóc de Poble "no se derrumbe" al crecer en complejidad, utilizamos auditorías de código constantes (con Qwen, DeepSeek, Claude, ChatGPT, etc.). 

Este flujo de trabajo debe seguirse estrictamente cada vez que se inicie o se concluya una auditoría, o cuando el usuario lo solicite explícitamente, asegurando la trazabilidad y la limpieza visual.

## Protocolo de Ejecución

1. **Contexto Maestro Centralizado:**
   - La IA auditora externa necesita "comerse" el código. Siempre existirá **un único archivo** de contexto actualizado en texto plano (ej. `auditorias/ultimo_contexto_fuente_v6.txt`).
   - Esto evita que la IA alucine o asuma partes del ecosistema que han sido modificadas recientemente.

2. **Recepción del Informe (Auditoría):**
   - Cuando la IA auditora entrega sus resultados (errores, mejoras arquitectónicas, refactorización), las recomendaciones deben leerse y aplicarse paso a paso mediante Antigravity.
   - Es importante priorizar la *robustez* (que no se rompa el sistema) sobre las "mejoras cosméticas genéricas". Las reglas de Sóc de Poble (usabilidad y estado) dominan el diseño.

3. **Limpieza y Archivo Histórico Automático (CRÍTICO):**
   - Como flujo de trabajo automático: deben existir las auditorías "activas" (pueden ser varias si se está auditando con Gemini, O3, etc simultáneamente) en la raíz de la carpeta `auditorias/`.
   - Sólo se deben mover a `auditorias/antiguas/` aquellas auditorías que el usuario ya haya dado por concluidas o que pertenezcan a rondas de un día anterior. No las muevas precipitadamente mientras forman parte del contexto actual de trabajo.
   - **Estructura final requerida siempre:**
     ```text
     /Sóc de Poble/
        ├── auditorias/
        │   ├── AUDITORIA_ACTIVA_GEMINI.md  <-- (Auditorías activas o en curso)
        │   ├── AUDITORIA_ACTIVA_O3.md      <-- (Auditorías activas o en curso)
        │   └── antiguas/                   <-- (Todas las auditorías pasadas concluidas archivadas aquí)
     ```

4. **Iteración Rápida:**
   - Construir con la seguridad de la auditoría es ir más rápido. Una vez aplicados todos los cambios, el Agente debe confirmar la estabilidad con herramientas de `linting` o comprobaciones manuales (lanzando o confirmando que corre `npm run dev`), y dejar la base limpia para el próximo ciclo.

**Siguientes pasos de la IA de Antigravity:** 
Revisa la carpeta `auditorias/antiguas` siempre que dudes de qué versión de la auditoría se está debatiendo, pero pon todo el foco ejecutivo de los cambios sobre el código fuente vivo.
