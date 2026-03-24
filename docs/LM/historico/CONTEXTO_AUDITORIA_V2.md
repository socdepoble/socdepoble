# Contexto para Auditoría de Seguridad y Arquitectura - FASE 2

Este documento refleja el estado actual del sistema tras la primera ronda de estabilización y endurecimiento.

## NOVEDADES DESDE LA FASE 1
1. **Migración UUID**: Todas las tablas críticas (`post_connections`, `user_tags`) han sido migradas de `TEXT` a `UUID` con claves foráneas reales a `auth.users`.
2. **RLS Reforzado**: Se han implementado políticas `INSERT`, `UPDATE` y `DELETE` basadas en `author_user_id` para `posts` y `market_items`.
3. **Estabilidad Auth**: Corregida race condition en `AppContext.jsx` y limpieza de logs de error sensibles en `supabaseService.js`.
4. **Rendimiento**: Añadidos índices en `town_id` y `author_role`.

---

## PROMPT PARA LA IA AUDITORA (CLAUDE / GPT-4)

**Rol:** Arquitecto de Seguridad Senior y Experto en Base de Datos PostgreSQL.
**Contexto:** Estamos en la Fase 2 de auditoría del proyecto "Sóc de Poble". Ya hemos estabilizado la base y corregido vulnerabilidades obvias. Ahora buscamos un análisis de "guante blanco" sobre casos borde y escalabilidad.

### 1. Estado de la Base de Datos (MIGRACIÓN FINAL)
```sql
-- Estructura unificada tras Fixes V1
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_user_id UUID REFERENCES auth.users(id),
    author_entity_id UUID, -- Managed group/business
    author_role TEXT, -- 'vei', 'grup', 'empresa', 'oficial'
    content TEXT,
    town_id INTEGER REFERENCES towns(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- Políticas Actuales:
-- SELECT USING (true)
-- INSERT WITH CHECK (auth.uid() = author_user_id)
-- UPDATE/DELETE USING (auth.uid() = author_user_id)
```

### 2. Lógica de Servicio (Sanitizada)
```javascript
// src/services/supabaseService.js
export const supabaseService = {
    async getPosts(roleFilter = 'tot', townId = null) {
        try {
            let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
            if (roleFilter !== 'tot') query = query.eq('author_role', roleFilter);
            if (townId) query = query.eq('town_id', townId);
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (err) {
            if (import.meta.env.DEV) console.error('[SupabaseService] Error in getPosts:', err);
            else console.error('[SupabaseService] Error fetching posts');
            return [];
        }
    }
}
```

### 3. Autenticación y Ciclo de Vida (AppContext)
```javascript
// Fix de Race Condition
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (!initialCheckDone && event === 'SIGNED_IN') return; // Ignorar duplicado
    handleAuth(event, session);
});
```

---

## OBJETIVOS DE LA AUDITORÍA FASE 2

Por favor, analiza estos puntos específicos:

1.  **Seguridad de Identidad Delegada**: Los usuarios pueden publicar como "Entidades" (Grupos/Empresas). ¿Cómo asegurar que un usuario no pueda publicar a nombre de una entidad que no gestiona, incluso si el `author_user_id` es el suyo? ¿Faltan políticas en una tabla intermedia `entity_managers`?
2.  **Políticas de Storage**: Aún no hemos definido RLS para `image_url`. ¿Cuáles son las mejores prácticas para buckets públicos de lectura pero privados de escritura en Supabase?
3.  **Recursividad y Town IDs**: Si un post es de un pueblo `X`, pero un usuario de un pueblo `Y` quiere verlo. Actualmente es público. ¿Hay algún riesgo de privacidad si decidimos hacer el sistema "cerrado" por pueblos en el futuro?
4.  **Optimización de Realtime**: Con el crecimiento del feed por pueblos, ¿deberíamos usar `broadcast` o `presence` para notificaciones en lugar de solo suscripciones a tablas?
5.  **Exposición de IDs Secuenciales**: Usamos `SERIAL` (IDs 1, 2, 3...) para `posts` y `towns`. ¿Es una vulnerabilidad de enumeración? ¿Deberíamos migrar todo a `UUID` para IDs públicos?

---

**Responde con:**
1.  **Análisis de Seguridad Lógica**: Identidad delegada y roles.
2.  **Plan de Hardening para IDs**: UUIDs vs Serials.
3.  **Arquitectura Realtime**: Escalabilidad de suscripciones.
4.  **Recomendaciones Proactivas**: Qué será un problema dentro de 6 meses.
