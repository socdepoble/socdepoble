---
description: Habilidad (Skill) para auditar y unificar elementos comunes (navegación) en código importado
---

# Skill: Modo-Producción (Auditoría de Navegación y Viewport)

Stitch (Gem) a menudo olvida o rompe la coherencia de los elementos que se repiten en cada pantalla (como headers, sidebars o reglas de accesibilidad móvil) cuando genera componentes individuales.

Cuando importes un diseño nuevo, aplica estrictamente esta unificación:

1.  **Auditoría de Navegación Lateral (Sidebar / NavigationRail):** Asegúrate de que no se ha perdido ningún enlace histórico. Reintegra o preserva los menús de Sóc de Poble. El menú que importa de Stitch es sólo un placeholder y no debe sobreescribir nuestro componente de enrutado.
2.  **Accesibilidad Móvil (Viewport):** Comprueba que la etiqueta `<meta name="viewport">` o las adaptaciones a móvil (como `MobileBottomNav`) están presentes. Bajo NINGÚN CONCEPTO puede volver a aparecer el código `user-scalable=no`.
3.  **Funcionalidad de Botones:** Garantiza que los botones de llamada a la acción tengan interacciones visuales correctas (`hover`, `active`) y no estén "muertos" si traen lógica antigua.
4.  **Unificación:** Stitch diseña escenas individuales. Antigravity construye aplicaciones. Tu misión es tomar esa escena importada, arrancar el chasis superfluo, e inyectar nuestro Header/Menú Lateral unificado en todos los archivos.
