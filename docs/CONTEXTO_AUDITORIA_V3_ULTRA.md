# 🛡️ Auditoría de Seguridad y Arquitectura - FASE 3 (HARDENED)
## Proyecto: Sóc de Poble

Este documento es el punto de partida para la **Fase 4** de auditoría. Refleja un sistema que ha sido sometido a un proceso de endurecimiento (Hardening) estructural.

---

## 🏗️ ESTADO ACTUAL DE LA ARQUITECTURA

### 1. Sistema de Identidad y Privacidad (Full UUID)
- Se ha eliminado la dependencia de IDs secuenciales (`SERIAL`) en todas las tablas públicas (`towns`, `posts`, `market_items`).
- **Impacto:** Eliminado el riesgo de ataques de enumeración y exposición de métricas de crecimiento.

### 2. Optimización RLS (Materialized Views)
- Las comprobaciones de membresía para publicar como "Entidad" (Empresa/Grupo) ahora se realizan contra una **Vista Materializada** `entity_member_map`.
- **Mecanismo:** Triggers automáticos en `entity_members` refrescan la vista `CONCURRENTLY`.
- **Impacto:** Rendimiento O(log n) en la evaluación de RLS, desacoplando la política de la tabla de membresía original.

### 3. Seguridad en Storage
- Bucket `images` configurado con RLS. 
- **Lectura:** Pública.
- **Escritura/Gestión:** Solo usuarios autenticados y únicamente sobre los archivos de los que son propietarios (`owner`).

### 4. Anti-Spam y Proteccion Crítica
- Implementado **Rate Limiting** vía disparadores (triggers) de PostgreSQL:
    - Máximo 5 posts cada 10 minutos.
    - Máximo 3 artículos de mercado cada 15 minutos.

---

## 🧩 ESTRUCTURA DE DATOS (SNIPPET PARA AUDITORÍA)

### Tablas de Identidad y Seguridad
```sql
-- Gestión de entidades (Grupos, Empresas, Oficial)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT CHECK (type IN ('grup', 'empresa', 'oficial'))
);

-- Membresía con roles
CREATE TABLE entity_members (
    entity_id UUID REFERENCES entities(id),
    user_id UUID REFERENCES profiles(id),
    role TEXT CHECK (role IN ('admin', 'editor'))
);

-- Vista Optimización RLS
CREATE MATERIALIZED VIEW entity_member_map AS
SELECT DISTINCT entity_id, user_id FROM entity_members;
CREATE UNIQUE INDEX idx_entity_member_map_composite ON entity_member_map(entity_id, user_id);
```

### Política RLS (Ejemplo de Post Hardened)
```sql
CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            author_entity_id IS NULL -- Publicación personal
            OR (
                -- Comprobación ultra-rápida contra la vista materializada
                EXISTS (
                    SELECT 1 FROM entity_member_map 
                    WHERE entity_id = author_entity_id AND user_id = auth.uid()
                )
                AND (
                    (author_role = 'oficial' AND EXISTS (SELECT 1 FROM entities WHERE id = author_entity_id AND type = 'oficial'))
                    OR (author_role <> 'oficial')
                )
            )
        )
    );
```

---

## 🎯 OBJETIVOS DE LA AUDITORÍA FASE 4 (ULTRA)

Para las IAs de alto nivel (**Claude Opus**, **Gemini 1.5 Pro**), solicitamos análisis en los siguientes puntos:

1.  **Consistencia de la Vista Materializada**: El refresco `CONCURRENTLY` tiene una latencia mínima. ¿Qué riesgos hay en una carrera crítica donde un usuario es expulsado de una entidad pero la "cache" RLS todavía le permite publicar durante unos segundos? ¿Cómo mitigarías esto sin perder rendimiento?
2.  **Seguridad en Mensajería Privada (DM)**: Estamos diseñando el sistema de chats. ¿Cómo implementarías RLS para que solo los dos participantes vean los mensajes, sabiendo que uno de ellos podría ser una "Entidad"? ¿Ves viable el cifrado E2E en navegador o es demasiado complejo para este MVP?
3.  **RLS y Escalabilidad de Towns**: Actualmente los posts son públicos para todos los pueblos. Si el sistema escala a 100 pueblos, ¿el filtrado por `town_uuid` en RLS es suficiente o deberíamos particionar las tablas por ID de pueblo para evitar scans masivos?
4.  **Audit Logs**: ¿Deberíamos implementar una tabla de auditoría para cambios críticos (borrado de posts, cambios de roles en entidades)? ¿Cuál es el patrón más eficiente en Supabase/PostgreSQL?
5.  **Sanitización de Contenido**: El Rate-Limiting es estructural. ¿Cómo abordarías la validación de contenido (Detección de insultos/estafas) de forma delegada o automatizada sin depender de servicios externos caros?

---

## 🚀 INSTRUCCIONES PARA LA IA AUDITORA

**Eres un Tech Lead y Auditor de Seguridad de Elite.**
Tu objetivo es encontrar fallos donde otros solo ven código correcto. Analiza la interacción entre los Triggers, la Materialized View y las políticas RLS. 

**Responde con:**
1.  **Vulnerabilidades Lógicas**: Casos borde de la "cache" RLS y triggers.
2.  **Diseño de Mensajería**: Propuesta técnica para DMs seguros y RLS.
3.  **Optimización de Realtime**: Roadmap para pasar de suscripciones a broadcast.
4.  **Conclusiones de Robustez**: ¿Del 1 al 10, qué tan preparado está el sistema para una auditoría externa real?
