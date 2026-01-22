-- =========================================================
-- SISTEMA MULTI-IDENTIDAD: ENTIDADES Y MIEMBROS (v2: Con Oficial)
-- =========================================================

-- 1. TABLA ENTITIES (GRUPS, EMPRESES & OFICIAL)
-- Eliminamos y recreamos si es seguro, o alteramos.
-- Para simplificar en este script idempotente, asumimos que se puede modificar el CHECK.

-- Nota: Si la tabla ya existe con datos, alterar el CHECK puede ser complejo si hay datos violándolo.
-- Como estamos en desarrollo, podemos usar DROP CASCADE si es necesario, 
-- pero intentaremos ser aditivos.

DO $$ BEGIN
    ALTER TABLE entities DROP CONSTRAINT IF EXISTS entities_type_check;
    ALTER TABLE entities ADD CONSTRAINT entities_type_check CHECK (type IN ('grup', 'empresa', 'oficial'));
EXCEPTION
    WHEN undefined_table THEN
        -- Si no existe la tabla, se crea abajo.
        NULL;
END $$;

CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('grup', 'empresa', 'oficial')),
    description TEXT,
    avatar_url TEXT,
    owner_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public entities are viewable by everyone" ON entities FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create entities" ON entities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 2. TABLA ENTITY_MEMBERS
CREATE TABLE IF NOT EXISTS entity_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_id, user_id)
);

ALTER TABLE entity_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Members are viewable by everyone" ON entity_members FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 3. ACTUALIZAR TABLAS DE CONTENIDO (POSTS & MARKET)
-- Actualizar constraints de roles en posts
DO $$ BEGIN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_role_check;
    -- Omitimos el check o lo ampliamos. Supabase a veces lo maneja solo si es TEXT.
    -- Pero si habia uno explicito:
    ALTER TABLE posts ADD CONSTRAINT posts_author_role_check CHECK (author_role IN ('gent', 'grup', 'empresa', 'oficial'));
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_type TEXT DEFAULT 'user' CHECK (author_type IN ('user', 'entity'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_entity_id UUID REFERENCES entities(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'gent'; -- Asegurar columna

ALTER TABLE market_items ADD COLUMN IF NOT EXISTS seller_type TEXT DEFAULT 'user' CHECK (seller_type IN ('user', 'entity'));
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS seller_entity_id UUID REFERENCES entities(id);
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS seller_role TEXT DEFAULT 'gent';


-- 4. MIGRACIÓN DE DATOS SEMILLA (CONVERTIR ACTORES FALSOS EN ENTIDADES)

-- Crear entidades basadas en los datos del Seed v8
-- Nota: Usamos IDs fijos y UUIDs válidos para los owners (NULL por ahora)
-- 'Ajuntament' pasa a ser 'oficial'
INSERT INTO entities (id, name, type, description, avatar_url, owner_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ajuntament de la Torre', 'oficial', 'Compte oficial de l''Ajuntament.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/300px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png', NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Banda de Música La Lira', 'grup', 'Societat Musical La Lira.', '/images/banda.jpg', NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Bar El Chato', 'empresa', 'El millor esmorzar del poble.', '/images/olleta.png', NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Forn de Pa La Plaça', 'empresa', 'Pa artesa i coques.', '/images/coques.png', NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Grup Senderisme La Torre', 'grup', 'Amics de la muntanya.', '/images/senderisme.jpg', NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Cooperativa Agrícola', 'empresa', 'Productes del camp.', '/images/oli.png', NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Comissió de Festes', 'grup', 'Organització de festes patronals.', '/images/festes.jpg', NULL)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    type = EXCLUDED.type; -- Importante actualizar el tipo si cambió (ej: Ajuntament a oficial)

-- Vincular los posts existentes a estas entidades y actualizar sus roles en la tabla posts
-- Ajuntament -> Oficial
UPDATE posts SET author_type = 'entity', author_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', author_role = 'oficial' WHERE author LIKE '%Ajuntament%';

-- Otros -> Grups/Empresas
UPDATE posts SET author_type = 'entity', author_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', author_role = 'grup' WHERE author LIKE '%Banda%';
UPDATE posts SET author_type = 'entity', author_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', author_role = 'empresa' WHERE author LIKE '%Chato%';
UPDATE posts SET author_type = 'entity', author_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', author_role = 'empresa' WHERE author LIKE '%Forn%';
UPDATE posts SET author_type = 'entity', author_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', author_role = 'grup' WHERE author LIKE '%Senderisme%';
UPDATE posts SET author_type = 'entity', author_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', author_role = 'grup' WHERE author LIKE '%Festes%';

-- Vincular los items de mercado
UPDATE market_items SET seller_type = 'entity', seller_entity_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', seller_role = 'empresa' WHERE seller LIKE '%Cooperativa%';
