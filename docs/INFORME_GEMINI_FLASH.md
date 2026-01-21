# Informe para Gemini Flash

## Cambios realizados (Phase 2)
- **Política RLS reforzada**: Inserción de posts valida que el usuario sea miembro de la entidad (`entity_members`).
- **Validación de rol "oficial"**: Se añadió verificación del tipo de entidad antes de permitir `author_role = 'oficial'`.
- **Índices de rendimiento**: `idx_posts_town_role`, `idx_posts_created`, `idx_market_town`.
- **Foreign keys idempotentes**: `fk_posts_town` y `fk_market_town` ahora envueltos en bloques `DO $$ … $$` para evitar errores en ejecuciones repetidas.
- **Limpieza de logs**: Mensajes de error sanitizados en `supabaseService.js`.
- **Race‑condition en Auth**: Flag `initialCheckDone` para evitar eventos duplicados.

## Conclusiones
- **Seguridad**: Vulnerabilidad crítica de suplantación de entidad cerrada. El sistema ahora garantiza que solo los miembros pueden publicar bajo una entidad.
- **Privacidad**: Los IDs secuenciales siguen en uso; aunque aceptables para una comunidad local, se recomienda migrar a UUID para evitar enumeración.
- **Rendimiento**: Las subconsultas `EXISTS` en RLS son seguras para volúmenes actuales, pero se sugiere una vista materializada (`entity_member_map`) para cargas masivas.
- **Storage**: Falta política RLS para Supabase Storage; se propone una política basada en `owner_id` y `entity_id`.

## Propuestas de fortalecimiento (Roadmap)
1. **Migrar IDs a UUID** (posts, towns, market_items) para eliminar enumeración.
2. **Implementar vista materializada** `entity_member_map` y refrescar cada 5‑10 min para acelerar políticas RLS.
3. **Definir RLS en Storage**: crear bucket `post-images` con metadatos `owner_id` y `entity_id`; políticas de `INSERT/DELETE` que solo permitan al propietario o a miembros de la entidad.
4. **Auditoría continua**: habilitar logs de Supabase y alertas para intentos fallidos de RLS.
5. **Rate‑limiting**: aplicar límites de peticiones por usuario para prevenir abuso de inserciones masivas.
6. **Documentación**: actualizar `SECURITY_AUDIT_PHASE2.md` con las nuevas políticas y procedimientos.

---
*Generado por Antigravity – 21 enero 2026*
