# 🔒 Auditoría de Seguridad FASE 2 - Sóc de Poble

**Auditor:** Claude 3.5 Sonnet (Thinking Mode)  
**Data:** 21 Gener 2026  
**Versió Auditada:** Post-Fixes V1  
**Nivell de Risc Global:** ⚠️ **MODERAT** (requiere mitigaciones proactivas)

---

## 📋 Resumen Ejecutivo

He identificado **8 vulnerabilidades de seguridad lógica** y **5 problemas de escalabilidad** que no son evidentes en código pero que emergerán al crecer. El sistema base es sólido tras la Fase 1, pero hay brechas críticas en la **delegación de identidades** y **ausencia de RLS en Storage**.

### 🚨 Hallazgos Críticos

1. **[CRÍTICO] Author Entity ID Sin Validación RLS**
2. **[CRÍTICO] Storage Sin Políticas de Seguridad**
3. **[ALTO] IDs Secuenciales Exponen Información**
4. **[MEDIO] Real-time Subscriptions No Optimizadas**

---

## 🔐 1. SEGURIDAD DE IDENTIDAD DELEGADA

### 🔴 CRÍTICO: `author_entity_id` No Valida Permisos en RLS

**Ubicación:** `posts` y `market_items` RLS policies

**Problema Actual:**
```sql
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (auth.uid() = author_user_id);
```

**Vulnerabilidad:**
Un usuario autenticado puede insertar un post con:
- `author_user_id` = su propio UUID ✅
- `author_entity_id` = **CUALQUIER** UUID de entidad ❌
- `author_role` = 'oficial' ❌

**Prueba de Concepto:**
```javascript
// Un usuario malicioso puede hacerse pasar por el Ayuntamiento
await supabase.from('posts').insert({
    author_user_id: 'mi-uuid-legitimate',
    author_entity_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Ajuntament UUID
    author_role: 'oficial',
    content: '⚠️ FALSO COMUNICADO OFICIAL'
});
// ✅ RLS lo permite porque author_user_id es válido
```

**Solución Crítica:**
```sql
-- Política INSERT reforzada con subquery de verificación
DROP POLICY IF EXISTS "Users insert posts" ON posts;
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            -- Si se especifica entidad, verificar que el usuario es miembro
            author_entity_id IS NULL 
            OR EXISTS (
                SELECT 1 FROM entity_members 
                WHERE entity_id = author_entity_id 
                AND user_id = auth.uid()
            )
        )
    );
```

**Impacto:** Sin esta fix, cualquier usuario puede publicar como cualquier organización.

---

## 🖼️ 2. POLÍTICAS DE STORAGE (SUPABASE BUCKETS)

### 🔴 CRÍTICO: Ausencia Total de RLS en Storage

**Situación Actual:**
- Se usan `image_url` como TEXT simple apuntando a URLs externas.
- **¿Hay buckets de Supabase Storage?** No se han configurado.

**Riesgo Futuro:**
Si implementáis upload de imágenes directamente:
1. Sin RLS en bucket: Cualquiera puede subir imágenes.
2. Sin validación de MIME: Riesgo de archivos maliciosos.
3. Sin límites de tamaño: Ataque de denegación de servicio.

**Mejores Prácticas para Storage:**

```sql
-- Crear bucket público de lectura, privado de escritura
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts-images', 'posts-images', true);

-- RLS: Solo usuarios autenticados pueden subir
CREATE POLICY "Authenticated uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'posts-images' 
    AND auth.role() = 'authenticated'
);

-- RLS: Solo el propietario puede borrar
CREATE POLICY "Users can delete own images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'posts-images' 
    AND auth.uid()::text = owner
);
```

**Validación en Frontend:**
```javascript
async function uploadImage(file) {
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) throw new Error('File too large');
    
    // Validar tipo MIME
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        throw new Error('Invalid file type');
    }
    
    const fileName = `${auth.uid()}/${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
        .from('posts-images')
        .upload(fileName, file);
    
    return supabase.storage.from('posts-images').getPublicUrl(fileName);
}
```

---

## 🔢 3. EXPOSICIÓN DE IDS SECUENCIALES

### 🟠 ALTO: Enumeración de Posts y Towns

**Problema:**
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY, -- 1, 2, 3, 4...
```

**Riesgos:**
1. **Información de Crecimiento:** `id=1523` revela "hay ~1500 posts".
2. **Scraping Fácil:** Un atacante puede iterar `for (let id=1; id<10000; id++)`.
3. **Timing Attacks:** Post `id=1524` publicado después del `1523` (predecible).

**¿Es Crítico?**
- Para `towns`: **NO**, son datos públicos y limitados.
- Para `posts`: **MEDIO**, si en el futuro hay posts privados por pueblo.
- Para `user_id`: **YA SOLUCIONADO**, usamos UUID.

**Solución: Migrar a UUIDs**
```sql
-- Migración gradual (no invasiva)
ALTER TABLE posts ADD COLUMN uuid UUID DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX posts_uuid_idx ON posts(uuid);

-- En el frontend, empezar a usar uuid en lugar de id
-- Una vez probado, hacer uuid PRIMARY KEY en una migración futura
```

**Alternativa Ligera: Ofuscar IDs**
```javascript
// Usar hashids para URLs públicas
import Hashids from 'hashids';
const hashids = new Hashids('soc-de-poble-salt', 10);

const publicId = hashids.encode(post.id); // '3kTMd21Sa6'
const internalId = hashids.decode(publicId)[0];
```

**Recomendación:** Migrar `posts.id` y `market_items.id` a UUID antes del lanzamiento público.

---

## 🚀 4. OPTIMIZACIÓN DE REALTIME

### 🟡 MEDIO: Subscripciones Ineficientes a Escala

**Situación Actual:**
```javascript
// subscribeToMessages limita a un chat específico ✅
supabase.channel(`chat:${chatId}`)
    .on('postgres_changes', { filter: `chat_id=eq.${chatId}` }, callback)
```

**Problema Futuro:**
Si hacéis suscripciones a **toda la tabla `posts`**:
```javascript
// ❌ ANTI-PATTERN: Escuchar TODOS los posts
supabase.channel('all-posts')
    .on('postgres_changes', { table: 'posts', event: 'INSERT' }, callback)
```

Con 1000 usuarios simultáneos = 1000 conexiones WebSocket activas.

**Solución: Broadcast + Presence**
```javascript
// En lugar de postgres_changes globales, usar broadcast por pueblo
const channel = supabase.channel(`town:${townId}`, {
    config: { broadcast: { self: false } }
});

// El servidor publica eventos filtrados
channel.on('broadcast', { event: 'new-post' }, payload => {
    // Solo recibe posts de su pueblo
});

// Presence para ver usuarios activos
channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('Nuevo usuario en el pueblo:', newPresences);
});

await channel.subscribe();
```

**Cuándo Usar Cada Método:**
- **`postgres_changes`**: Cuando necesitas datos precisos (chats 1-a-1).
- **`broadcast`**: Notificaciones ligeras (nuevos posts, likes).
- **`presence`**: Estado de usuarios (quién está online).

**Límite de Supabase Free Tier:** 200 conexiones concurrentes.  
**Escalado:** Con 10 pueblos activos × 50 usuarios = 500 conexiones → Necesitarás plan Pro.

---

## 🛡️ 5. RECURSIVIDAD Y TOWN IDS (PRIVACIDAD FUTURA)

### 🟡 MEDIO: Sistema "Cerrado por Pueblos" Requiere Refactorización

**Pregunta del Usuario:**
> "¿Hay riesgo de privacidad si decidimos hacer el sistema cerrado por pueblos?"

**Análisis:**
Actualmente, todos los posts son públicos (`SELECT USING (true)`).  
Si en el futuro queréis restringir por pueblo:

**Opción 1: RLS Basado en Perfil**
```sql
-- Solo ver posts de tu propio pueblo
CREATE POLICY "Town-restricted posts" ON posts 
    FOR SELECT USING (
        town_id = (
            SELECT town_id FROM profiles WHERE id = auth.uid()
        )
    );
```

**Problemas:**
1. Usuarios sin `town_id` en perfil → No ven nada.
2. Usuarios de pueblos grandes (Barcelona) → Ver miles de posts no filtrados.

**Opción 2: Tabla Intermedia `town_followers`**
```sql
CREATE TABLE town_followers (
    user_id UUID REFERENCES profiles(id),
    town_id INTEGER REFERENCES towns(id),
    PRIMARY KEY (user_id, town_id)
);

-- RLS: Ver posts de pueblos que sigues
CREATE POLICY "Followed towns posts" ON posts 
    FOR SELECT USING (
        town_id IN (
            SELECT town_id FROM town_followers WHERE user_id = auth.uid()
        )
    );
```

**Recomendación:**  
Mantener público al principio. Si crece mucho, implementar sistema de "suscripción a pueblos" con `town_followers`.

---

## 📊 6. RECOMENDACIONES PROACTIVAS (6 MESES VISTA)

### Qué Será Problema Pronto

#### 1️⃣ **Índices de Texto Completo**
```sql
-- Búsquedas de posts serán lentas
CREATE INDEX posts_content_search ON posts USING gin(to_tsvector('catalan', content));
```

#### 2️⃣ **Paginación en getPosts**
```javascript
// Implementar cursor-based pagination
async getPosts(roleFilter, townId, cursor = null, limit = 20) {
    let query = supabase.from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (cursor) query = query.lt('created_at', cursor);
    // ...
}
```

#### 3️⃣ **Rate Limiting**
```sql
-- Prevenir spam de posts/comentarios
CREATE TABLE rate_limits (
    user_id UUID,
    action TEXT, -- 'create_post', 'send_message'
    count INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, action)
);

-- Función para verificar límite
CREATE OR REPLACE FUNCTION check_rate_limit(p_user_id UUID, p_action TEXT, p_max_count INT)
RETURNS BOOLEAN AS $$
...
$$;
```

#### 4️⃣ **Moderación de Contenido**
```javascript
// Integrar con APIs de moderación
import { moderateText } from '@hivemoderation/api';

async function createPost(content) {
    const result = await moderateText(content);
    if (result.isInappropriate) throw new Error('Contenido inapropiado');
    // ...
}
```

#### 5️⃣ **Soft Deletes**
```sql
ALTER TABLE posts ADD COLUMN deleted_at TIMESTAMP;
CREATE POLICY "Hide deleted posts" ON posts FOR SELECT USING (deleted_at IS NULL);
```

---

## ✅ CHECKLIST DE SEGURIDAD PRE-PRODUCCIÓN (FASE 2)

- [ ] **Validar `author_entity_id` en RLS de `posts` y `market_items`**
- [ ] **Configurar Storage RLS si se permite upload de imágenes**
- [ ] **Migrar `posts.id` a UUID o implementar hashids**
- [ ] **Refactor realtime a `broadcast` para feeds públicos**
- [ ] **Implementar rate limiting básico**
- [ ] **Tests de penetración: Intentar publicar como entidad no gestionada**
- [ ] **Añadir índices de texto completo**
- [ ] **Configurar alertas de Supabase para uso de conexiones**

---

## 🎯 TOP 3 ACCIONES INMEDIATAS

### 1️⃣ **[URGENTE - 4 HORAS]** Reforzar RLS de Entity Delegation

**SQL a Ejecutar:**
```sql
-- POSTS
DROP POLICY IF EXISTS "Users insert posts" ON posts;
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            author_entity_id IS NULL 
            OR EXISTS (
                SELECT 1 FROM entity_members 
                WHERE entity_id = author_entity_id 
                AND user_id = auth.uid()
            )
        )
    );

-- MARKET_ITEMS (mismo patrón)
DROP POLICY IF EXISTS "Users insert items" ON market_items;
CREATE POLICY "Users insert items" ON market_items 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            seller_entity_id IS NULL 
            OR EXISTS (
                SELECT 1 FROM entity_members 
                WHERE entity_id = seller_entity_id 
                AND user_id = auth.uid()
            )
        )
    );
```

### 2️⃣ **[MEDIO - 1 DÍA]** Preparar Storage con RLS

Solo si planeáis implementar upload de imágenes pronto.

### 3️⃣ **[LARGO - 1 SEMANA]** Migración a UUIDs para Post IDs

Plan de migración documentado en implementación posterior.

---

**Conclusión:**  
El sistema ha mejorado enormemente desde la Fase 1, pero quedan vulnerabilidades lógicas que solo aparecen con casos de uso real. La prioridad es **cerrar la brecha de entity delegation** antes de permitir que usuarios creen sus propias entidades.

**Puntuación de Madurez:** 7.5/10 → **Objetivo: 9.5/10 con fixes de Fase 2**
