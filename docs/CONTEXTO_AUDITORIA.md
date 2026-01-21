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
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
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
                redirectTo: `${window.location.origin}/mur`
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
        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                localStorage.removeItem('isDemoMode');
                try {
                    const profileData = await supabaseService.getProfile(session.user.id);
                    setProfile(profileData);
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
                setLoading(false);
            } else if (localStorage.getItem('isDemoMode') === 'true') {
                loginAsGuest();
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe usarse dentro de un AppProvider');
    }
    return context;
};
```

### 4. Estructura de Base de Datos y Políticas de Seguridad Master (`supabase_setup_MASTER.sql`)
```sql
-- =========================================================
-- SÓC DE POBLE: SCRIPT MAESTRO (VERSION IDEMPOTENTE)
-- =========================================================

-- 1. SEGURIDAD (RLS) PARA TABLAS EXISTENTES
ALTER TABLE IF EXISTS chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS market_items ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Chats
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chats' AND policyname = 'Public chats are viewable by everyone') THEN
        CREATE POLICY "Public chats are viewable by everyone" ON chats FOR SELECT USING (true);
    END IF;
    -- Messages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Public messages are viewable by everyone') THEN
        CREATE POLICY "Public messages are viewable by everyone" ON messages FOR SELECT USING (true);
    END IF;
    -- Posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Public posts are viewable by everyone') THEN
        CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);
    END IF;
    -- Market
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_items' AND policyname = 'Public market_items are viewable by everyone') THEN
        CREATE POLICY "Public market_items are viewable by everyone" ON market_items FOR SELECT USING (true);
    END IF;
END $$;

-- 2. PUEBLOS
CREATE TABLE IF NOT EXISTS towns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    image_url TEXT,
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO towns (name, description, logo_url, population) 
VALUES 
('Altea', 'La cúpula del Mediterrani. Un poble amb encant, cases blanques i carrers empedrats.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Escut_d%27Altea.svg/1200px-Escut_d%27Altea.svg.png', 23000),
('Dénia', 'Capital de la Marina Alta. Famosa pel seu castell, el port i la seua gastronomia (la gamba roja).', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Escudo_de_Denia.svg', 43000),
('Xàbia', 'On surt el sol a la Comunitat Valenciana. Amb cales impressionants i el Montgó dominant el paisatge.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Escut_de_X%C3%A0bia.svg/1200px-Escut_de_X%C3%A0bia.svg.png', 28000),
('Bocairent', 'Un poble tallat a la roca. Declarat conjunt historicoartístic nacional.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Escut_de_Bocairent.svg/1200px-Escut_de_Bocairent.svg.png', 4200)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'towns' AND policyname = 'Public towns are viewable by everyone') THEN
        CREATE POLICY "Public towns are viewable by everyone" ON towns FOR SELECT USING (true);
    END IF;
END $$;

-- 3. LIKES Y FAVORITOS
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_likes' AND policyname = 'Public post_likes viewable by everyone') THEN
        CREATE POLICY "Public post_likes viewable by everyone" ON post_likes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_likes' AND policyname = 'Anyone can insert likes') THEN
        CREATE POLICY "Anyone can insert likes" ON post_likes FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_likes' AND policyname = 'Anyone can delete likes') THEN
        CREATE POLICY "Anyone can delete likes" ON post_likes FOR DELETE USING (true);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS market_favorites (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES market_items(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, user_id)
);

ALTER TABLE market_favorites ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_favorites' AND policyname = 'Public market_favorites viewable by everyone') THEN
        CREATE POLICY "Public market_favorites viewable by everyone" ON market_favorites FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_favorites' AND policyname = 'Anyone can insert favorites') THEN
        CREATE POLICY "Anyone can insert favorites" ON market_favorites FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_favorites' AND policyname = 'Anyone can delete favorites') THEN
        CREATE POLICY "Anyone can delete favorites" ON market_favorites FOR DELETE USING (true);
    END IF;
END $$;

-- 4. PERFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'vei',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
        CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;
```

### 5. Correcciones Recientes de RLS (`fix_rls_final.sql`)
```sql
-- =========================================================
-- SÓC DE POBLE: CORRECCIÓN FINAL DE SEGURIDAD (RLS) - V2
-- =========================================================

-- 1. Habilitar RLS en tablas críticas
ALTER TABLE IF EXISTS post_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_tags ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas antiguas
DROP POLICY IF EXISTS "Public post_connections are viewable by everyone" ON post_connections;
DROP POLICY IF EXISTS "Users can manage their own connections" ON post_connections;
DROP POLICY IF EXISTS "Public select post_connections" ON post_connections;
DROP POLICY IF EXISTS "Users can insert their own connections" ON post_connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON post_connections;
DROP POLICY IF EXISTS "Users can delete their own connections" ON post_connections;
DROP POLICY IF EXISTS "Users can view their own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can insert their own tags" ON user_tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON user_tags;

-- 3. Políticas para post_connections
-- Usamos casting ::text para evitar el error "operator does not exist: uuid = text"
CREATE POLICY "Public select post_connections" ON post_connections
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own connections" ON post_connections
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own connections" ON post_connections
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own connections" ON post_connections
    FOR DELETE USING (auth.uid()::text = user_id::text);


-- 4. Políticas para user_tags (Diccionario personal)
CREATE POLICY "Users can view their own tags" ON user_tags
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own tags" ON user_tags
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own tags" ON user_tags
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 5. Asegurar columna tags en post_connections
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'post_connections' AND column_name = 'tags') THEN
        ALTER TABLE post_connections ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;
```

**Por favor, responde con:**
1.  Un análisis de vulnerabilidades de seguridad críticas, especialmente en las políticas RLS.
2.  Sugerencias para mejorar la estructura del `AppContext` y el manejo de estado.
3.  Cualquier mala práctica detectada en el manejo de conexiones o dependencias.
4.  Recomendaciones inmediatas para el desarrollador.
