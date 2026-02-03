# 🔧 Informe Consolidat d'Auditories per a Gemini Flash

## Context
Aquest document consolida els resultats de dues auditoríes complementàries:
1. **Claude 3.5 Sonnet (Thinking)** → Seguretat, RLS, vulnerabilitats
2. **Simulació GPT-4o** → Arquitectura, escalabilitat, patrons de disseny

Ambdues auditoríes coincideixen en els punts crítics i ofereixen una visió completa dels problemes a resoldre.

---

## 📊 Resum Executiu

| Métrica | Valor |
|---------|-------|
| **Problemes de seguretat** | 12 (3 crítics, 4 alts, 5 mitjans) |
| **Anti-patterns detectats** | 4 (God Context, N+1, Magic values, No caching) |
| **Puntuació actual** | 6.5/10 |
| **Objectiu pre-producció** | 9/10 |
| **Temps estimat fixes crítics** | 3-5 dies |

---

## 🚨 1. VULNERABILITATS CRÍTIQUES (Acció Immediata)

### 1.1 Políticas RLS Incompletes en `posts` i `market_items`

**Problema:**
```sql
-- ACTUAL: Només hi ha SELECT policy
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);
-- ❌ FALTA: INSERT, UPDATE, DELETE policies
```

**Risc:** Qualsevol usuari autenticat pot inserir, modificar o esborrar posts arbitràriament.

**Solució (URGENT - 1 dia):**
```sql
-- 1. Afegir columna author_user_id
ALTER TABLE posts ADD COLUMN author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE market_items ADD COLUMN author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Migrar dades existents (mapear author → author_user_id)
-- Aquest pas requereix script de migració personalitzat

-- 3. Crear policies completes
CREATE POLICY "Authenticated users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_user_id);

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_user_id);

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = author_user_id);

-- Repetir per market_items
```

**Priorització:** ★★★★★ (ROI màxim)

---

### 1.2 UUID Demo Hardcoded Pot Bypasear Auth

**Problema:**
```javascript
// AppContext.jsx línia 27
const loginAsGuest = () => {
    const demoId = '00000000-0000-0000-0000-000000000000';
    setUser({ id: demoId, email: 'vei@socdepoble.net', isDemo: true });
    // ...
};
```

**Risc:** Si un atacant força `localStorage.setItem('isDemoMode', 'true')` en producció, pot actuar com un usuari fantasma.

**Solució:**
```javascript
// 1. Externalitzar a constants.js
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// 2. Desactivar en producció
const loginAsGuest = () => {
    if (import.meta.env.PROD) {
        throw new Error('Demo mode disabled in production');
    }
    const demoId = DEMO_USER_ID;
    // ... rest del codi
};
```

**Priorització:** ★★★★☆

---

### 1.3 `user_id` com TEXT Trenca Foreign Keys

**Problema:**
```sql
CREATE TABLE post_connections (
    user_id TEXT NOT NULL, -- ❌ Hauria de ser UUID
    -- ...
);

-- Comparació posterior amb casting:
CREATE POLICY "..." ON post_connections 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
```

**Conseqüències:**
- No es pot crear FK a `auth.users(id)`
- Risc d'injecció (menys crític amb Supabase client però conceptualment malament)
- Comparacions `::text` són més lentes

**Solució (URGENT - 1 setmana):**
```sql
-- 1. Afegir columna temporal
ALTER TABLE post_connections ADD COLUMN user_id_uuid UUID;
ALTER TABLE user_tags ADD COLUMN user_id_uuid UUID;

-- 2. Migrar dades
UPDATE post_connections SET user_id_uuid = user_id::uuid;
UPDATE user_tags SET user_id_uuid = user_id::uuid;

-- 3. Eliminar columna antiga
ALTER TABLE post_connections DROP COLUMN user_id;
ALTER TABLE user_tags DROP COLUMN user_id;

-- 4. Renombrar
ALTER TABLE post_connections RENAME COLUMN user_id_uuid TO user_id;
ALTER TABLE user_tags RENAME COLUMN user_id_uuid TO user_id;

-- 5. Afegir Foreign Keys
ALTER TABLE post_connections ADD CONSTRAINT fk_user 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE user_tags ADD CONSTRAINT fk_user 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

**Priorització:** ★★★★☆

---

### 1.4 Unificació de l'Identitat (author_type vs author_role)

**Problema:**
Hi ha duplicitat i confusió entre `author_type` (user/entity) i `author_role` (gent/grup/empresa/oficial).

**Solució:**
- Eliminar `author_type` i usar només `author_role` com a font de veritat.
- Assegurar que `author_entity_id` és `NULL` si `author_role` és `gent`.
- Afegir `CHECK` constraint per validar aquesta lògica a la base de dades.

**Priorització:** ★★★☆☆

---

## ⚡ 2. PROBLEMES DE RENDIMENT

### 2.1 Falten Índexs en Columnes de Filtratge

**Impacte:**
- Amb 1.000 posts: ~50ms (acceptable)
- Amb 100.000 posts: ~2.000ms (inacceptable)
- Amb 1.000.000 posts: Timeout probable

**Solució (URGENT - 2 dies):**
```sql
-- Índexs compostos per consultes comunes
CREATE INDEX CONCURRENTLY idx_posts_town_role ON posts(town_id, author_role);
CREATE INDEX CONCURRENTLY idx_posts_created_desc ON posts(created_at DESC);
CREATE INDEX CONCURRENTLY idx_market_town ON market_items(town_id);
CREATE INDEX CONCURRENTLY idx_user_tags_user ON user_tags(user_id);
CREATE INDEX CONCURRENTLY idx_post_conn_user_post ON post_connections(user_id, post_id);

-- Per a búsqueda de pobles
CREATE INDEX idx_towns_search ON towns USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description, '')));
```

**Priorització:** ★★★★☆

---

### 2.2 Foreign Keys Sense ON DELETE CASCADE

**Problema:**
```sql
ALTER TABLE posts ADD COLUMN town_id INTEGER; -- ❌ Sense REFERENCES
```

Si s'esborra un poble, els posts queden orfes.

**Solució:**
```sql
ALTER TABLE posts 
    ADD CONSTRAINT fk_posts_town 
    FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE SET NULL;
    
ALTER TABLE market_items 
    ADD CONSTRAINT fk_market_town 
    FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE SET NULL;

ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_town
    FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE SET NULL;
```

**Priorització:** ★★★☆☆

---

## 🏗️ 3. ANTI-PATTERNS ARQUITECTÒNICS

### 3.1 God Context (`AppContext` Massa Pesat)

**Problema:**
`AppContext` barreja Auth + UI + i18n → qualsevol canvi provoca render de tota l'app.

**Solució (MITJÀ - 1 setmana):**

**Opció A: Dividir en contextos separats**
```javascript
// src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    // ... només auth logic
};

// src/context/UIContext.jsx
export const UIProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // ... només UI logic
};

// src/context/I18nContext.jsx - O millor, usar directament i18next
```

**Opció B: Migrar a Zustand (RECOMANAT)**
```javascript
// src/stores/authStore.js
import create from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    profile: null,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    logout: () => set({ user: null, profile: null })
}));

// src/stores/uiStore.js
export const useUIStore = create((set) => ({
    theme: 'light',
    isCreateModalOpen: false,
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open })
}));
```

**Beneficis:**
- Menys re-renders
- Millor tree-shaking
- Més fàcil de testejar

**Priorització:** ★★★☆☆

---

### 3.2 Problema N+1 en Feed

**Problema:**
```javascript
// 1. Carregar posts
const posts = await supabaseService.getPosts('tot', townId);

// 2. Després carregar connexions per separat (N+1)
for (const post of posts) {
    const connections = await supabase
        .from('post_connections')
        .select('*')
        .eq('post_id', post.id);
}
```

**Solució A: JOIN en la query (Quick Win)**
```javascript
async getPosts(roleFilter = 'tot', townId = null) {
    let query = supabase
        .from('posts')
        .select(`
            *,
            post_connections (
                id,
                user_id,
                tags
            )
        `)
        .order('created_at', { ascending: false });
    
    if (roleFilter !== 'tot') query = query.eq('author_role', roleFilter);
    if (townId) query = query.eq('town_id', townId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}
```

**Solució B: Materialized View (Escalabilitat)**
```sql
CREATE MATERIALIZED VIEW feed_by_town AS
SELECT 
    p.*,
    json_agg(pc.*) AS connections
FROM posts p
LEFT JOIN post_connections pc ON p.id = pc.post_id
GROUP BY p.id;

-- Refresh programat cada minut
CREATE OR REPLACE FUNCTION refresh_feed_by_town()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY feed_by_town;
END;
$$ LANGUAGE plpgsql;

-- Cron job (amb pg_cron extension)
SELECT cron.schedule('refresh-feed', '* * * * *', 'SELECT refresh_feed_by_town()');
```

**Priorització:** ★★★☆☆

---

### 3.3 No Hi Ha Caché

**Problema:** Cada navegació refetch tot des de Supabase.

**Solució (QUICK WIN - 1 dia):**

**Opció A: Redis (Producció)**
```javascript
// src/services/cacheService.js
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

export const cacheService = {
    async getFeed(townId) {
        const key = `feed:${townId}`;
        const cached = await redis.get(key);
        if (cached) return JSON.parse(cached);
        
        const data = await supabaseService.getPosts('tot', townId);
        await redis.set(key, JSON.stringify(data), { EX: 30 }); // TTL 30s
        return data;
    }
};
```

**Opció B: LocalStorage (Desenvolupament / MVP)**
```javascript
// src/utils/cache.js
const CACHE_TTL = 30000; // 30 segons

export const cache = {
    get(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const { data, timestamp } = JSON.parse(item);
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    },
    
    set(key, data) {
        localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    }
};

// Ús en supabaseService.js
async getPosts(roleFilter = 'tot', townId = null) {
    const cacheKey = `posts:${roleFilter}:${townId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // ... fetch from Supabase
    cache.set(cacheKey, data);
    return data;
}
```

**Priorització:** ★★★☆☆

---

### 3.4 Magic Values Hardcoded

**Problema:**
```javascript
const demoId = '00000000-0000-0000-0000-000000000000';
if (roleFilter !== 'tot') { ... }
if (role === 'vei') { ... }
```

**Solució (QUICK WIN - 1 hora):**
```javascript
// src/constants.js
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export const ROLES = {
    ALL: 'tot',
    PEOPLE: 'gent',
    GROUPS: 'grups',
    BUSINESS: 'empreses',
    OFFICIAL: 'oficial'
};

export const USER_ROLES = {
    NEIGHBOR: 'vei',
    GROUP: 'grup',
    BUSINESS: 'empresa',
    OFFICIAL: 'oficial'
};

// Ús:
import { ROLES, DEMO_USER_ID } from './constants';

if (roleFilter !== ROLES.ALL) { ... }
const demoId = DEMO_USER_ID;
```

**Priorització:** ★★★★☆ (Quick win)

---

## 🛡️ 4. GESTIÓ D'ERRORS

### 4.1 console.error() Pot Filtrar Detalls en Producció

**Problema:**
```javascript
} catch (err) {
    console.error('[SupabaseService] Error in getPosts:', err);
    return [];
}
```

**Solució:**
```javascript
// src/utils/logger.js
export const logger = {
    error(message, error) {
        if (import.meta.env.DEV) {
            console.error(message, error);
        } else {
            console.error(message); // Només missatge genèric
            // TODO: Enviar a Sentry
            // Sentry.captureException(error);
        }
    }
};

// Ús:
} catch (err) {
    logger.error('[SupabaseService] Error in getPosts', err);
    return [];
}
```

**Priorització:** ★★★☆☆

---

## 📋 5. ROADMAP D'IMPLEMENTACIÓ

### Setmana 1 - Seguretat Crítica
- [ ] Migrar `user_id` a UUID en totes les taules
- [ ] Afegir `author_user_id` a `posts` i `market_items`
- [ ] Crear policies RLS completes (INSERT/UPDATE/DELETE)
- [ ] Desactivar mode demo en producció
- [ ] Crear arxiu `constants.js` amb valors externs

**Temps estimat:** 3-4 dies  
**Priorització:** ★★★★★

---

### Setmana 2 - Rendiment de Consultes
- [ ] Crear índexs compostos (`town_id + author_role`, `created_at DESC`)
- [ ] Afegir Foreign Keys amb ON DELETE CASCADE
- [ ] Implementar JOIN en `getPosts` per evitar N+1
- [ ] (Opcional) Crear Materialized View `feed_by_town`

**Temps estimat:** 2-3 dies  
**Priorització:** ★★★★☆

---

### Setmana 3 - Arquitectura i Caché
- [ ] Refactorizar `AppContext` a Zustand (o dividir en contextos)
- [ ] Dividir `supabaseService` en repositoris (`postsRepo`, `connectionsRepo`, etc.)
- [ ] Implementar cache localStorage (MVP) o Redis (producció)
- [ ] Actualitzar logging condicional per producció

**Temps estimat:** 4-5 dies  
**Priorització:** ★★★☆☆

---

### Setmana 4-6 - Observabilitat i Proves
- [ ] Integrar Sentry per tracking d'errors
- [ ] Configurar Prometheus + Grafana (opcional, producció)
- [ ] Escriure tests unitaris per repositoris
- [ ] Escriure tests d'integració per fluxos d'auth
- [ ] Executar proves de càrrega (k6) simulant 10k RPS

**Temps estimat:** 1-2 setmanes  
**Priorització:** ★★☆☆☆

---

## 🎯 6. PRIORITZACIÓ PER ROI

| Prioritat | Acció | Impacte | Esfuerç | ROI |
|-----------|-------|---------|---------|-----|
| ★★★★★ | Policies RLS completes + UUID migration | Seguretat crítica | M | **10/10** |
| ★★★★☆ | Índexs compostos | Latència feed -80% | S | **9/10** |
| ★★★★☆ | Constants externalitzades | Menys bugs, millor mantenibilitat | S | **9/10** |
| ★★★☆☆ | JOIN en getPosts (evitar N+1) | Latència -60% | S | **8/10** |
| ★★★☆☆ | Cache localStorage/Redis | Latència -70% | S-M | **8/10** |
| ★★★☆☆ | Zustand per state management | Menys renders, millor DX | M | **7/10** |
| ★★☆☆☆ | Materialized Views | Escalabilitat futura | M | **6/10** |
| ★★☆☆☆ | Observabilitat (Sentry/Prometheus) | Detecció proactiva | L | **5/10** |

---

## ✅ 7. CHECKLIST PRE-PRODUCCIÓ

- [ ] **Seguretat RLS:**
  - [ ] Policies INSERT/UPDATE/DELETE en `posts`
  - [ ] Policies INSERT/UPDATE/DELETE en `market_items`
  - [ ] `user_id` migrat a UUID amb FK
  - [ ] Mode demo desactivat en producció

- [ ] **Rendiment:**
  - [ ] Índexs creats (`town_id`, `author_role`, `created_at`)
  - [ ] Foreign Keys amb ON DELETE CASCADE
  - [ ] JOIN implementat en `getPosts`
  - [ ] Cache activat (localStorage o Redis)

- [ ] **Arquitectura:**
  - [ ] `AppContext` refactoritzat (Zustand o contextos separats)
  - [ ] `supabaseService` dividit en repositoris
  - [ ] Constants externalitzades

- [ ] **Observabilitat:**
  - [ ] Sentry integrat
  - [ ] Logs condicionals (no errors detallats en prod)
  - [ ] Variables d'entorn verificades

- [ ] **Testing:**
  - [ ] Tests unitaris per repositoris
  - [ ] Tests d'integració per fluxos d'auth
  - [ ] Proves de càrrega executades

---

## 📞 8. CONCLUSIÓ I SEGÜENTS PASSOS

**Puntuació actual:** 6.5/10  
**Objectiu pre-producció:** 9/10  
**Temps estimat total:** 3-5 setmanes (depenent de la disponibilitat)

**Acció immediata per Gemini Flash:**
1. Començar per la **Setmana 1** (seguretat crítica)
2. Validar canvis amb proves manuals
3. Executar **Setmana 2** (rendiment)
4. Revisar amb l'equip abans de passar a **Setmana 3**

**Contacte:** Aquest document està pensat per ser executat per Gemini Flash, que coneix el projecte en profunditat. Qualsevol dubte, refer-se als informes originals:
- `SECURITY_AUDIT_CLAUDE.md` (auditoria de seguretat detallada)
- `CONTEXTO_AUDITORIA_GPT4.md` (context per auditoria arquitectònica)

---

## 🗺️ 9. ALINEACIÓ AMB EL ROADMAP DE PRODUCTE

Segons el document `ARQUITECTURA.md`, després de les millores tècniques, Flash hauria de reprendre el desenvolupament de:

1. **Fase 2: Conexiones y Léxico** (Sistema de connexions robust, etiquetes privades, lèxic local).
2. **Fase 3: Funcionalidades Sociales** (Comentaris, compartició, notificacions).
3. **Fase 4: Producción** (Autenticació real, storage d'imatges, moderació).

Les millores tècniques d'aquest document (Setmanes 1-3) són el **requisit previ** per a que les Fases 2-4 siguen estables i escalables.

---

*Document generat el 21/01/2026 per Claude 3.5 Sonnet (Thinking) basat en auditoríes de seguretat i arquitectura.*
