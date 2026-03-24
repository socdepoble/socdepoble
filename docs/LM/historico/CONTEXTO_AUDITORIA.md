# Contexto para Auditoría Externa de Arquitectura y Seguridad

Este documento contiene una recopilación de los archivos críticos del proyecto "Sóc de Poble" para facilitar una auditoría externa por parte de otros modelos de IA (Claude 3.5 Sonnet, GPT-4o, etc.).

## INSTRUCCIONES PARA EL USUARIO
Copia el siguiente prompt y pégalo en una nueva conversación con la IA de tu elección. Si el contenido es muy largo, puedes pasarlo en dos partes.

---
## PROMPT PARA LA IA AUDITORA

**Rol:** Actúa como un Arquitecto de Software Senior y Experto en Seguridad especializado en React y Supabase.

**Objetivo:** Realizar una auditoría de código profunda para identificar vulnerabilidades de seguridad, cuellos de botella de rendimiento y debilidades arquitectónicas en el proyecto "Sóc de Poble".

**Contexto del Proyecto:** "Sóc de Poble" es una plataforma social para conectar comunidades rurales. Usa React (Vite) en el frontend y Supabase en el backend (Auth + Postgres + RLS).

**A continuación te proporciono los archivos clave del proyecto:**

### 1. Dependencias (`package.json`)
```json
{
  "name": "soc-de-poble",
  "private": true,
  "version": "1.1.3",
  "type": "module",
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1",
    "i18next": "^25.7.4",
    "i18next-browser-languagedetector": "^8.2.0",
    "lucide-react": "^0.562.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-i18next": "^16.5.3",
    "react-router-dom": "^7.12.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "^7.2.4"
  }
}
```

### 2. Configuración del Cliente Supabase (`src/supabaseClient.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Lógica de Autenticación Principal (`src/context/AppContext.jsx`)
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'va');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const loginAsGuest = () => {
        const demoId = '00000000-0000-0000-0000-000000000000';
        setUser({ id: demoId, email: 'vei@socdepoble.net', isDemo: true });
        setProfile({
            id: demoId,
            full_name: 'Veí de Prova',
            username: 'veiprestat',
            role: 'vei',
            is_demo: true,
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
        });
        setLoading(false);
        localStorage.setItem('isDemoMode', 'true');
    };
    
    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/chats`
            }
        });
        if (error) throw error;
    };

    const logout = async () => {
        localStorage.removeItem('isDemoMode');
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    useEffect(() => {
        let isMounted = true;

        const handleAuth = async (event, session) => {
            if (!isMounted) return;
            console.log('[AppContext] Auth Event:', event, session?.user?.id);

            if (session?.user) {
                setUser(session.user);
                localStorage.removeItem('isDemoMode');
                try {
                    const profileData = await supabaseService.getProfile(session.user.id);
                    if (isMounted) setProfile(profileData);
                } catch (error) {
                    console.error('[AppContext] Error loading profile:', error);
                }
            } else if (localStorage.getItem('isDemoMode') === 'true') {
                loginAsGuest();
            } else {
                setUser(null);
                setProfile(null);
            }

            if (isMounted) setLoading(false);
        };

        // 1. Verificación inicial de sesión explícita
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuth('INITIAL_SESSION', session);
        });

        // 2. Suscripción a cambios futuros
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Algunos eventos secundarios no necesitan disparar todo el proceso
            if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                handleAuth(event, session);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (language !== i18n.language) {
            i18n.changeLanguage(language);
        }
        localStorage.setItem('language', language);
    }, [language, i18n]);

    const toggleLanguage = () => {
        const languages = ['va', 'es', 'gl', 'eu', 'en'];
        const currentIndex = languages.indexOf(language);
        const nextIndex = (currentIndex + 1) % languages.length;
        setLanguage(languages[nextIndex]);
    };

    return (
        <AppContext.Provider value={{
            language,
            setLanguage,
            toggleLanguage,
            theme,
            toggleTheme,
            user,
            profile,
            setProfile,
            loading,
            setUser,
            loginAsGuest,
            logout,
            loginWithGoogle,
            isCreateModalOpen,
            setIsCreateModalOpen
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe usarse dentro de un AppProvider');
    }
    return context;
};
```

### 4. Capa de Servicios y API (`src/services/supabaseService.js` - Fragmentos críticos)
```javascript
import { supabase } from '../supabaseClient';

export const supabaseService = {
    // Feed / Muro con filtrado geográfico
    async getPosts(roleFilter = 'tot', townId = null) {
        try {
            let query = supabase
                .from('posts')
                .select('*')
                .order('id', { ascending: false });

            if (roleFilter !== 'tot') {
                query = query.eq('author_role', roleFilter);
            }
            if (townId) {
                query = query.eq('town_id', townId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('[SupabaseService] Error in getPosts:', err);
            return [];
        }
    },
    
    // Gestión de Conexiones (Antiguos likes + tags personales)
    async togglePostConnection(postId, userId, tags = []) {
        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingConnection) {
            if (tags.length > 0 || (tags.length === 0 && existingConnection.tags?.length > 0)) {
                const { data, error } = await supabase
                    .from('post_connections')
                    .update({ tags })
                    .eq('post_id', postId)
                    .eq('user_id', userId)
                    .select();
                if (error) throw error;
                return { connected: true, tags: data[0].tags };
            } else {
                await supabase.from('post_connections').delete().eq('post_id', postId).eq('user_id', userId);
                return { connected: false, tags: [] };
            }
        } else {
            const { data, error } = await supabase
                .from('post_connections')
                .insert([{ post_id: postId, user_id: userId, tags: tags }])
                .select();
            if (error) throw error;
            return { connected: true, tags: data[0].tags };
        }
    },
    
    // Perfiles con manejo graceful de usuarios sin perfil completo
    async getProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (err) {
            console.error('[SupabaseService] Error in getProfile:', err);
            return null;
        }
    }
};
```

### 5. Estructura de Base de Datos y RLS (`supabase_setup_MASTER.sql` + Migraciones)

**Esquema Principal:**
```sql
-- NOTA: RLS está activado en todas las tablas críticas

-- Tablas de contenido social
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author TEXT,
    author_role TEXT,
    content TEXT,
    image_url TEXT,
    town_id INTEGER, -- Filtrado geográfico
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_connections (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}', -- Tags personales (privados)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

CREATE TABLE user_tags (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    tag_name TEXT NOT NULL,
    UNIQUE(user_id, tag_name)
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'vei',
    town_id INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pueblos con datos geográficos
CREATE TABLE towns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    province TEXT,
    comarca TEXT,
    description TEXT,
    logo_url TEXT,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Políticas RLS Aplicadas:**
```sql
-- Posts: Lectura pública, escritura abierta (demo)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);

-- Conexiones: Lectura pública, escritura solo del usuario
ALTER TABLE post_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public select post_connections" ON post_connections FOR SELECT USING (true);
CREATE POLICY "Users can insert their own connections" ON post_connections 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own connections" ON post_connections 
    FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own connections" ON post_connections 
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Tags personales: Solo acceso del propietario
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tags" ON user_tags 
    FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own tags" ON user_tags 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own tags" ON user_tags 
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Perfiles: Lectura pública, actualización solo del propietario
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);
```

**Migración Crítica Reciente (`migration_town_id_fix.sql`):**
```sql
-- Añadir columnas geográficas a towns
ALTER TABLE towns ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE towns ADD COLUMN IF NOT EXISTS comarca TEXT;

-- Añadir town_id a posts y market_items para filtrado local
ALTER TABLE posts ADD COLUMN IF NOT EXISTS town_id INTEGER;
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS town_id INTEGER;

-- Re-sembrado con pueblos catalanoparlantes localizados
TRUNCATE TABLE towns RESTART IDENTITY CASCADE;
INSERT INTO towns (name, province, comarca, description, population) VALUES 
('La Torre de les Maçanes', 'Alacant', 'L''Alacantí', 'Poble pintoresc...', 700),
('Cocentaina', 'Alacant', 'El Comtat', 'Vila comtal...', 11500),
('Muro d''Alcoi', 'Alacant', 'El Comtat', 'Porta de la Vall...', 9300);
```

### 6. Visión Social y Arquitectura

**Objetivo del Proyecto:**
Crear una red social hiper-local que sustituya WhatsApp/Telegram para la comunicación comunitaria entre pueblos rurales.

**Principios de Diseño:**
1. **Privacidad por Diseño:** 
   - Las etiquetas (tags) de las publicaciones son privadas del usuario (diccionario personal)
   - Las conexiones son públicas pero las organizaciones personales son privadas

2. **Escalabilidad Rural:** 
   - Capacidad de segmentar contenido por pueblo (`town_id`)
   - Filtrado por comarca para agrupar localidades próximas
   - Priorización de contenido local en el feed

3. **Identidad Flexible:** 
   - Sistema de "Managed Entities" para publicar como uno mismo o como representante
   - Soporte para múltiples roles (vecino, comercio, ayuntamiento, cooperativa)

4. **Modo Demo:**
   - Usuario demo con UUID fijo `00000000-0000-0000-0000-000000000000`
   - Persiste en localStorage para facilitar pruebas sin autenticación

---

**Por favor, responde con:**
1.  **Seguridad RLS:** ¿Hay fugas potenciales en las políticas de `post_connections`, `profiles` o `user_tags`? ¿El modo demo representa un riesgo?
2.  **Arquitectura de Estado:** ¿Es eficiente el uso de `AppContext` para una app que escala en tiempo real? ¿Hay problemas con las subscripciones de auth?
3.  **Rendimiento en DB:** ¿Son correctos los índices y las relaciones `foreign key` para las consultas de filtrado por zona? ¿Falta algún índice crítico?
4.  **Gestión de Errores:** ¿Hay casos donde el manejo de errores podría exponer información sensible?
5.  **Recomendaciones:** Top 3 cambios técnicos urgentes para mejorar seguridad, rendimiento o arquitectura.

