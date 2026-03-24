# 📋 INSTRUCCIONES PARA FLASH: Reparación Post-Auditoría
## Auditoría realizada por Claude Opus - 22 Enero 2026

---

## 🎯 CONTEXTO RÁPIDO

He analizado todo el proyecto y encontré el problema principal: **los scripts de seeding usan UUIDs diferentes para los mismos usuarios**. Esto causa que los posts no aparezcan porque referencian usuarios que no existen.

| Usuario | UUID en `admin_seed_v1` (CORRECTO) | UUID en `phase7_v2` (INCORRECTO) |
|---------|-------------------------------------|----------------------------------|
| Vicent | `11111111-0000-0000-0000-000000000001` ✅ | `f0010000-...001` ❌ |
| Rosa | `11111111-0000-0000-0000-000000000002` ✅ | `f0020000-...002` ❌ |

---

## ✅ ACCIONES A EJECUTAR (en orden)

### PASO 1: Ejecutar Script de Reparación SQL

Ejecuta el archivo **`migration_REPAIR_id_consistency.sql`** en el SQL Editor de Supabase. Este script:
- Limpia posts/items con IDs incorrectos
- Inserta datos de demo con los IDs correctos (`11111111...`)
- Vincula perfiles a pueblos
- Crea interacciones cruzadas

```
Archivo: /migration_REPAIR_id_consistency.sql
```

### PASO 2: Verificar en el Navegador

1. Ir a `http://localhost:5175/mur`
2. Deberían aparecer posts de Vicent, Rosa, Pau, Maria, etc.
3. Ir a `http://localhost:5175/mercat`
4. Deberían aparecer items de Rosa, Clara, Cooperativa

### PASO 3: Completar PublicProfile.jsx

El perfil público tiene la sección de actividad hardcodeada. Hay que cambiar esto:

**Archivo**: `src/pages/PublicProfile.jsx`
**Líneas**: 113-121

**Código actual:**
```jsx
<div className="empty-state-mini">
    <p>Publicacions de {profile.full_name.split(' ')[0]}</p>
    <span className="text-secondary">Pròximament: Historial de lligams i propostes</span>
</div>
```

**Cambiar por:**
```jsx
{userPosts.length > 0 ? (
    userPosts.slice(0, 5).map(post => (
        <div key={post.uuid || post.id} className="mini-post-card">
            <p>{post.content}</p>
            <span className="post-date-small">
                <Calendar size={12} />
                {new Date(post.created_at).toLocaleDateString()}
            </span>
        </div>
    ))
) : (
    <p className="text-secondary">Encara no ha publicat res.</p>
)}
```

Y añadir al `useEffect`:
```jsx
const postsData = await supabaseService.getUserPosts(id);
setUserPosts(postsData);
```

Con el state:
```jsx
const [userPosts, setUserPosts] = useState([]);
```

### PASO 4 (Opcional): Limpiar App.jsx

El seeding automático en `App.jsx` (líneas 50-116) usa IDs numéricos legacy. Considera:
- Eliminar ese bloque completamente
- O adaptarlo para usar UUIDs

---

## 🔧 FIXES YA APLICADOS POR OPUS

1. ✅ FK hints en `supabaseService.js`:
   - `getPosts`: usa `towns!fk_posts_town_uuid(name)`
   - `getMarketItems`: usa `towns!fk_market_town_uuid(name)`

2. ✅ Estructura de metadatos en dos líneas (Feed.jsx, Market.jsx)

3. ✅ Script de reparación SQL creado

---

## 📁 ARCHIVOS CREADOS/MODIFICADOS EN ESTA AUDITORÍA

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `docs/AUDITORIA_OPUS_V1.md` | NUEVO | Informe completo de auditoría |
| `docs/INSTRUCCIONES_PARA_FLASH.md` | NUEVO | Este documento |
| `migration_REPAIR_id_consistency.sql` | NUEVO | Script SQL de reparación |
| `src/services/supabaseService.js` | MODIFICADO | FK hints corregidos |

---

## 🎨 ESTADO VISUAL ACTUAL

- **Tarjetas**: Diseño premium con cabecera naranja, sombras profundas
- **Metadatos**: Dos líneas (Autor / Fecha • Ubicación)
- **Navegación**: Clic en autor lleva a perfil/entidad pública
- **Dark mode**: Funcional

---

## 🚀 PRÓXIMOS PASOS SUGERIDOS (después de la reparación)

1. Implementar búsqueda global (el input ya existe en Header)
2. Hacer funcional el botón "Connectar" en PublicEntity
3. Añadir sistema de comentarios a posts
4. Implementar notificaciones reales

---

**Flash, tienes todo el contexto. El paso más importante es ejecutar el SQL de reparación para ver datos en el feed. ¡Adelante!**
