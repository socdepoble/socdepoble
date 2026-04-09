> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/soc-de-poble.md`

---
description: Habilidad (Skill) de inicialización suprema. Cuando el usuario dice exactamente "Sóc de Poble!" (con exclamación y tilde), el agente debe aplicar este protocolo de lectura profunda antes de continuar.
---

# Sóc de Poble! (Protocolo de Activación)

**🚨 TRIGGER ESTRICTO:** Este workflow SÓLO se activa si el usuario dice **exactamente** la frase `Sóc de Poble!` (con tilde en la 'o' y exclamación final). Si no lleva exclamación o la tilde falla, NO se activa obligatoriamente (aunque como IA deberías sugerirlo si es el primer mensaje).
*(Importante: Recuerda la diferencia entre la marca "Sóc de Poble" con tilde y mayúsculas, y la oración gramatical "soc de poble" sin tilde).*

## Pasos del Protocolo de Activación:

Cuando leas el trigger `Sóc de Poble!`, estás obligado a realizar el siguiente ritual antes de emitir cualquier respuesta de trabajo:

1. **Lectura de Sistema Automático (Skills):** DEBES utilizar tus herramientas para releer todas las habilidades guardadas en tu memoria principal.
2. **Lectura del Skill de Entrada (`next_session_focus.md`):** DEBES abrir y leer el archivo que contiene tus últimas notas sobre "por dónde empezar hoy". Este archivo actuará como el portador de estado entre sesiones. Búscalo en tus directorios de workflows.
3. **Respuesta de confirmación y Ejecución Inmediata:** Una vez asimilados tus skills y comprendido el punto de arranque de hoy, responde asumiendo tu personalidad con un mensaje corto y ponte directamente a trabajar en la tarea señalada por el _Skill de Entrada_. No pidas permiso para empezar si las instrucciones del archivo son claras.

_Nota para la IA: Nunca asumas que recuerdas tus prioridades sin releer tus workflows si la sesión es nueva. Este comando es tu café de las mañanas._
