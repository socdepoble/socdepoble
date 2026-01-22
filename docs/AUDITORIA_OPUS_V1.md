# 🔍 Auditoría Profunda: Sóc de Poble
## Realizada por Claude Opus - 22 Enero 2026

---

## 📋 Resumen Ejecutivo

El proyecto está en un estado **funcional pero con inconsistencias importantes** que hay que resolver antes de avanzar. La arquitectura es sólida, el diseño visual es premium, pero hay **deuda técnica acumulada** en el sistema de datos que causa los errores que estás viendo.

### Estado General: 🟡 Requiere Atención

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Inconsistencia de UUIDs de Usuarios de Prueba**

Este es el problema principal que causa que "no aparezca actividad":

```
migration_admin_seed_v1.sql usa:    11111111-0000-0000-0000-000000000001 (Vicent)
migration_phase7_v2.sql usa:        f0010000-0000-0000-0000-000000000001 (Vicent)
migration_social_activity_v3.sql:   f0010000-0000-0000-0000-000000000001 (Vicent)
```

**El problema**: Si ejecutaste `migration_admin_seed_v1.sql` primero (que es lo normal), los perfiles de Vicent, Rosa, etc. tienen IDs que empiezan por `11111111-...`. Luego, los scripts de seeding de Phase 7 intentan insertar posts con IDs `f00...` que **NO EXISTEN** en la tabla `profiles`.

**Solución inmediata**: Decidir cuál es el esquema definitivo. Recomiendo mantener `11111111-...` porque ya está en producción/demo y reescribir el script de seeding.

### 2. **getMarketItems: Campo incorrecto para el nombre del vendedor**

En `Market.jsx` línea 98:
```jsx
{item.seller || item.seller_name || 'Usuari'}
```

Pero en `createMarketItem` (supabaseService línea 323-334) el campo que se guarda es `seller`, no `seller_name`. Y el seeding usa `seller`. **Esto está bien**, pero falta el campo `author_role` para distinguir colores de avatars correctamente.

### 3. **PublicProfile: Seccion de Actividad Vacía**

En `PublicProfile.jsx` líneas 113-121, la sección de "Activitat Recent" está hardcodeada con un placeholder:

```jsx
<div className="empty-state-mini">
    <p>Publicacions de {profile.full_name.split(' ')[0]}</p>
    <span className="text-secondary">Pròximament: Historial de lligams i propostes</span>
</div>
```

**Debería usar `supabaseService.getUserPosts(id)`** que ya existe y funciona.

### 4. **PublicEntity: Ubicación Hardcodeada**

En `PublicEntity.jsx` línea 81:
```jsx
<span>La Torre de les Maçanes</span>
```

Esto está fijo en lugar de usar `entity.town_name` o similar. No hay join con towns para entidades.

---

## 🟡 PROBLEMAS MODERADOS

### 5. **Columnas Legacy sin Limpiar**

Los scripts de migración añadieron `town_uuid` pero dejaron `town_id` como "legacy". Esto causa confusión en el código:

```javascript
// supabaseService.js línea 314
const isUuid = typeof townId === 'string' && townId.includes('-');
query = query.eq(isUuid ? 'town_uuid' : 'town_id', townId);
```

Esta lógica de bifurcación debería ser temporal pero lleva ahí desde hace tiempo. Si ya todo es UUID, simplificar.

### 6. **Seeding en App.jsx**

El componente `App.jsx` (líneas 50-116) hace seeding automático en cliente. Esto es útil para demos pero:
- Usa IDs numéricos (`post.id`) mezclados con UUIDs
- No tiene en cuenta el nuevo esquema de `author_user_id`

```javascript
// App.jsx línea 79
id: post.id,  // Esto es numérico, pero la PK de posts ahora es UUID
```

### 7. **Falta de Manejo de Errores en Navegación de Autor**

En `Feed.jsx` líneas 235-238:
```jsx
onClick={() => {
    if (post.author_entity_id) navigate(`/entitat/${post.author_entity_id}`);
    else if (post.author_user_id) navigate(`/perfil/${post.author_user_id}`);
}}
```

No hay fallback si ambos son null. Debería al menos no activar la navegación.

---

## ✅ ELEMENTOS BIEN IMPLEMENTADOS

1. **Sistema de diseño CSS**: Excelente. Los tokens están bien organizados, el dark mode funciona, las tarjetas son consistentes.

2. **Queries relacionales con FK hints**: El fix de `fk_posts_town_uuid` y `fk_market_town_uuid` es correcto y necesario para PostgREST.

3. **Estructura de metadatos en dos líneas**: Bien implementado visual y semánticamente.

4. **Sistema de mensajería con NPC simulation**: Creativo y funcional para demos.

5. **Contexto de usuario (AppContext)**: Limpio y bien encapsulado.

6. **Internacionalización (i18n)**: Preparada aunque algunas strings están hardcodeadas.

---

## 🛠️ SCRIPT DE REPARACIÓN RECOMENDADO

He preparado un script que unifica los IDs y resuelve las inconsistencias:

```sql
-- ==========================================
-- REPARACIÓN DE CONSISTENCIA DE IDs
-- ==========================================

BEGIN;

-- 1. Usar el esquema 11111111 que es el que tiene profiles reales
-- Actualizar migration_social_activity para usar IDs correctos

DELETE FROM posts WHERE author_user_id LIKE 'f00%';
DELETE FROM market_items WHERE author_user_id LIKE 'f00%';

-- 2. Insertar posts de demostración con IDs correctos (1111...)
INSERT INTO posts (author, author_role, author_user_id, content, town_uuid, created_at)
VALUES 
('Vicent Ferris', 'vei', '11111111-0000-0000-0000-000000000001', 
 'Bon dia des de Cocentaina! Acaben de traure el pa del forn. Quina olor!', 
 (SELECT uuid FROM towns WHERE name ILIKE '%Cocentaina%' LIMIT 1), 
 NOW() - INTERVAL '2 hours'),

('Vicent Ferris', 'vei', '11111111-0000-0000-0000-000000000001', 
 'Qui ve a la fira aquest cap de setmana? Jo no me la perdo!', 
 (SELECT uuid FROM towns WHERE name ILIKE '%Cocentaina%' LIMIT 1), 
 NOW() - INTERVAL '1 day');

-- Rosa con entidad
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Floristería L''Aroma | Rosa Soler', 'empresa', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044',
 'Ja tenim els rams d''hivern preparats! Passeu a veure''ls 🌸',
 (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1),
 NOW() - INTERVAL '3 hours');

-- Pau con entidad (Dimonis)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Colla de Dimonis de Muro | Pau Garcia', 'grup', '11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000022',
 'Assaig general aquest divendres a les 20h al local de sempre!',
 (SELECT uuid FROM towns WHERE name ILIKE '%Muro%' LIMIT 1),
 NOW() - INTERVAL '5 hours');

-- Maria (Dones)
INSERT INTO posts (author, author_role, author_user_id, author_entity_id, content, town_uuid, created_at)
VALUES 
('Assoc. de Dones de la Torre | Maria Blanes', 'grup', '11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000033',
 'Recollida de farigola aquest dissabte al matí. Qui s''apunta?',
 (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1),
 NOW() - INTERVAL '6 hours');

-- 3. Market item de Rosa
INSERT INTO market_items (title, description, price, tag, image_url, seller, author_role, author_user_id, author_entity_id, town_uuid, created_at)
VALUES 
('Rams de Temporada', 'Flors fresques de la Mariola, fetes amb amor.', '18€', 'productes',
 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400',
 'Floristería L''Aroma | Rosa Soler', 'empresa', 
 '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000044',
 (SELECT uuid FROM towns WHERE name ILIKE '%Torre%Maçanes%' LIMIT 1),
 NOW() - INTERVAL '1 day');

COMMIT;
```

---

## 📝 PRÓXIMOS PASOS RECOMENDADOS

### Prioridad Alta (Hacer Primero)
1. **Ejecutar el script de reparación** para tener datos coherentes y ver actividad
2. **Refactorizar PublicProfile.jsx** para mostrar posts reales con `getUserPosts(id)`
3. **Eliminar el seeding automático de App.jsx** o adaptarlo al nuevo esquema UUID

### Prioridad Media
4. **Limpiar columnas legacy** (`town_id`, `seller_role`) tras confirmar que todo usa UUID
5. **Añadir join de town a entities** para mostrar ubicación real en PublicEntity
6. **Implementar el botón "Connectar"** en PublicEntity (actualmente es decorativo)

### Prioridad Baja
7. Implementar búsqueda global (el input ya existe en el header)
8. Añadir comentarios a los posts
9. Sistema de notificaciones real

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Archivos SQL de migración | 25 |
| Componentes React | ~40 |
| Líneas en supabaseService.js | 716 |
| Rutas en App.jsx | 13 |
| Estado de cobertura i18n | ~70% |

---

## 🎯 Conclusión

El proyecto tiene una base excelente pero sufre de "acumulación de migraciones" que han dejado inconsistencias. La solución es consolidar los IDs de usuarios demo, limpiar el código legacy, y completar las features a medio hacer (PublicProfile, PublicEntity).

Con el script de reparación ejecutado, deberías ver inmediatamente:
- Posts de Vicent en el Mur
- Posts de Rosa con identidad de empresa
- Items en el Mercat con autoría correcta
- Navegación funcional a perfiles públicos

---

*Auditoría completada a las 02:45 del 22/01/2026 por Claude Opus*
