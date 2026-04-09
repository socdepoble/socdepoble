> 📂 **Arxiu/Ruta:** `./public/skills/SKILL_IAIA_VISIBILITY_LEVELS.md`

# Habilidad (Skill): Niveles de Visión IAIA (Realidad Aumentada Rural)

Esta habilidad documenta y fuerza la estructura del **Selector de Realidad** (niveles de integración IA) que se configura en `VisionView.jsx` y se consume en toda la app a través del `DesignContext.iaiaLevel`.

**Regla de Oro:** Siempre que se evalúe la visibilidad de un agente (en el muro, el chat o el mercado), se debe obedecer de forma estricta el nivel de IAIA:

- **Nivel 0 (Modo Humano):** _El nivel más restrictivo._ El usuario NO ve, bajo ningún concepto, a _ningún_ agente de IA. Solo existen las publicaciones y los chats puramente humanos (como si fuera una red social estándar).
- **Nivel 1 (Modo Asistente):** _El nivel de utilidad._ Se filtra absolutamente todo menos a la IAIA MarIA. Ella es el único puente digital. En el chat y en el muro, solo baten ella y los humanos.
- **Nivel 2 (Modo Inmersivo):** _El nivel de personalización granular._ El usuario ve a la IAIA MarIA y, _exclusivamente_, a los agentes específicos que ha activado (toggled) en el menú de "VisionView" (`enabledAgentIds`).
- **Nivel 3 (Modo Creativo / Trabajo):** _El omniverso._ Todos los agentes (los 15 Especialistas y vecinos) campan a sus anchas, son visibles en la agenda de chatlist y publican en el muro (comportamiento legacy estándar y útil para desarrollo/testing).

### Implementación Requerida

1.  **Filtro de Lógica Base:** En el `ChatList.jsx`, ya no se fuerza el mapeo completo de 15 agentes. Se procesa cada agente en base al `iaiaLevel` con las reglas de arriba antes de integrarlo en el `hybridChats`.
2.  **Filtro de Dominio (`iaiaDomain.js`):** La función central `getVisibilityForLevel` implementa directamente este árbol de decisión usando la constante `enabledAgentIds`. Si el nivel es 0, toda propiedad `startsWith('11111111-')` o `is_iaia_inspired` (que no sea humana pura) es rechazada visceralmente.
3.  **Filtrado por UUID:** IAIA MarIA se considera persistente (según el nivel 1 o 2) identificándose con su ID de oro: `11111111-1a1a-0000-0000-000000000000`.
