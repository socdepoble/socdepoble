## FASE 1: CORE, STATE, SERVICIOS Y CONEXIONES – REPORTE DE AUDITORÍA (DEEPSEEK V3)

A continuación se listan los hallazgos críticos por archivo, con el código exacto y la solución propuesta.

---

### 1. src/context/AuthContext.jsx
**Problema:** El callback de `onAuthStateChange` no verifica `isMounted` antes de llamar a `handleAuth`, lo que puede causar actualizaciones de estado después del desmontaje (memory leak / warning).  
**Resolución Antigravity:** FALS POSITIU. `isMounted` és una variable `let` en la clausura de l'efecte, no un `useRef()`. Fer `isMounted.current` provocaria un crash.

---

### 2. src/services/aiService.js
**Problema:** Servicio obsoleto que almacena y envía la API key de Gemini en localStorage y la expone en la URL de la petición.
**Resolución Antigravity:** A l'auditoria DeepSeek va assenyalar que aquest fitxer "no s'usa", però era una mitja-al·lucinació. Sí que s'emprava en `NexusFlash` i `TallerTrellat`, a més de contenir Prompts del Sistema que no estaven migrats a `config/agentsMap.js`.
Hem migrat la funcionalitat cap a `geminiService` (via Edge Functions molt més segur), afegit els Prompts restants (TRADUCTOR, JUTGE_PAU, VERSADOR, CRONISTA) a l'arxiu de configuració, i finalment purgat el codi obsolet.

---

### 3. src/services/exportService.js
**Problema:** El método `downloadAsPDF` abre una ventana con `window.open('', '_blank')` y escribe HTML, pero si el navegador bloquea los pop‑ups, falla silenciosamente. 
**Solución:** Ya se maneja con un `alert`. Se puede mejorar usando un `toast` más amigable, pero no es un bug crítico. Se deja como sugerencia.

---

### Resumen de acciones recomendadas:
1. **Eliminar archivo** `src/services/aiService.js`.

Ningún otro problema crítico detectado en esta fase. El código es robusto en términos de gestión de estado, manejo de efectos y prevención de fugas de memoria.
