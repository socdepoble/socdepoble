# 🔍 Informe de Auditoría Fase 4 - Para Revisión de Flash

**Proyecto:** Sóc de Poble  
**Autor del Informe:** Antigravity (Gemini)  
**Fecha:** 21 de enero de 2026  
**Destinatario:** Gemini Flash (Contexto del Proyecto)

---

## 📋 RESUMEN EJECUTIVO

He completado un análisis de seguridad y arquitectura avanzado sobre el sistema tras el hardening de Fase 3. El sistema ha alcanzado un **8.5/10** en robustez general, con áreas de mejora identificadas.

---

## ✅ LO QUE YA ESTÁ BIEN (No tocar)

| Área | Estado | Notas |
| :--- | :---: | :--- |
| UUID Migration | ✅ 10/10 | Enumeración eliminada |
| RLS Core | ✅ 9/10 | Políticas sólidas |
| Rate Limiting | ✅ 9/10 | Anti-spam activo |
| Storage RLS | ✅ 8/10 | Funcional |

---

## ⚠️ HALLAZGOS Y PROPUESTAS

### 1. Race Condition en Vista Materializada
**Riesgo:** Un usuario expulsado de una entidad puede seguir publicando durante ~500ms hasta el refresco de la cache.

**Propuesta:** Añadir un fallback directo a `entity_members` en la política RLS.

**Prioridad:** MEDIA (edge case poco probable)

---

### 2. Mensajería Privada (DMs) - Sin Implementar
**Riesgo:** No hay RLS para chats. Si se implementa sin diseño, será vulnerable.

**Propuesta:** 
- Tabla `conversations` con participantes (user o entity).
- RLS que valide membresía para entidades.
- **No** E2E encryption en MVP (demasiado complejo).

**Prioridad:** ALTA (bloqueo de funcionalidad)

---

### 3. Escalabilidad de Towns
**Riesgo:** Sin índices, el filtrado por `town_uuid` será un full scan con >100 pueblos.

**Propuesta:** Crear índices en `posts(town_uuid)` y `market_items(town_uuid)`.

**Prioridad:** ALTA (fácil de implementar, alto impacto)

---

### 4. Audit Logs - No Implementado
**Riesgo:** Sin trazabilidad de acciones críticas (borrado de posts, cambios de roles).

**Propuesta:** Tabla `audit_log` con trigger genérico para `posts` y `entity_members`.

**Prioridad:** MEDIA (necesario para compliance, no urgente)

---

### 5. Sanitización de Contenido
**Riesgo:** Rate Limiting no detecta contenido ofensivo.

**Propuesta:** 
- Blocklist local de términos.
- Botón "Reportar" con ocultación automática tras 3 reportes.

**Prioridad:** BAJA (puede esperar)

---

## 🎯 PREGUNTAS PARA FLASH

1. **¿Cuál es la prioridad real de DMs?** ¿Es una funcionalidad del MVP o puede esperar?
2. **¿Hay planes de escalar a más de 50 pueblos pronto?** Esto determina la urgencia de los índices.
3. **¿Se necesita compliance (GDPR, etc.) antes del lanzamiento?** Esto afecta a la prioridad de Audit Logs.
4. **¿Estás de acuerdo con el orden de prioridades propuesto?**

---

## 📊 ROADMAP SUGERIDO

| Orden | Tarea | Esfuerzo | Impacto |
| :---: | :--- | :---: | :---: |
| 1 | Índices para Towns | 5 min | Alto |
| 2 | RLS para DMs (si es MVP) | 2h | Crítico |
| 3 | Fallback en cache RLS | 15 min | Medio |
| 4 | Audit Logs | 1h | Medio |
| 5 | Sanitización contenido | 2h | Bajo |

---

**Esperando tu feedback para priorizar y ejecutar.** 🛡️
