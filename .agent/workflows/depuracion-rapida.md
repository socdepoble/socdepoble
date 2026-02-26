---
description: Habilidad (Skill) de sistema para que Antigravity asísle errores y los depure en un entorno seguro antes de pasarlos a producción.
---

# Skill: Depuración Rápida (Rapid Debugging)

Cuando encuentres un error complejo, un bucle infinito o un bug de UI que no se solucione en la primera iteración, **no intentes parchear el código base en caliente inmediatamente**. Ejecuta este flujo de trabajo sistemático:

## 1. Aislamiento (Isolate)

Crea temporalmente un componente o archivo aislado (ej: `TestComponent.jsx`, `bug_test.css`) y copia solo la mínima porción de código necesaria para reproducir el fallo. Nunca hagas pruebas destructivas en el archivo de diseño principal.

## 2. Ejecución y Observación

Verifica el error en local. Si es necesario, utiliza el sub-agente navegador (Browser Subagent) para inyectar datos y forzar la re-producción del fallo tal y como lo haría un usuario (ejemplo: hacer un flujo de Registro fallido). Analiza la consola del navegador y el stack trace.

## 3. Resolución Quirúrgica (Fix)

Modifica el archivo aislado hasta que el Bug desaparezca o la UI funcione. Verifica que la solución:

- Sigue aplicando la _Llei de la Boina Taronja_ y estándares UI.
- No utiliza componentes obsoletos ni interrumpe la navegación.

## 4. Reintegración (Merge)

Una vez la solución esté probada y confirmada en el entorno seguro, integra cuidadosamente el bloque de código corregido de vuelta al archivo principal del proyecto.

## 5. Limpieza Absoluta (Cleanup)

Elimina sistemáticamente cualquier archivo temporal, `TestComponent.jsx` o traza de debug (ej. `console.log()` innecesarios) creados durante el paso 1. Mantenemos el repositorio prístino.
