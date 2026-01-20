-- =========================================================
-- SÓC DE POBLE: MIGRACIÓ PER A MURS LOCALITZATS
-- =========================================================

DO $$ 
BEGIN
    -- 1. Unificar referència de pobles en Profiles
    -- Si existeix village_id, el canviem a town_id per consistència
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'village_id') THEN
        ALTER TABLE profiles RENAME COLUMN village_id TO town_id;
    END IF;

    -- Assegurar que town_id és del tipus correcte (INT) per a coincidir amb towns.id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'town_id') THEN
        ALTER TABLE profiles ADD COLUMN town_id INTEGER REFERENCES towns(id);
    ELSE
        -- Si ja existeix però és TEXT, l'intentem convertir (amb cura)
        -- Nota: Això pot fallar si hi ha dades no convertibles, però en el nostre prototip hauria d'estar net.
        ALTER TABLE profiles ALTER COLUMN town_id TYPE INTEGER USING town_id::integer;
    END IF;

    -- 2. Afegir town_id a Posts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'town_id') THEN
        ALTER TABLE posts ADD COLUMN town_id INTEGER REFERENCES towns(id);
    END IF;

    -- 3. Afegir town_id a Market Items
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'market_items' AND column_name = 'town_id') THEN
        ALTER TABLE market_items ADD COLUMN town_id INTEGER REFERENCES towns(id);
    END IF;

END $$;

-- 4. Actualitzar dades existents per defecte a La Torre de les Maçanes (ID 101)
-- Això evita que les llistes es queden buides de colp
UPDATE profiles SET town_id = 101 WHERE town_id IS NULL;
UPDATE posts SET town_id = 101 WHERE town_id IS NULL;
UPDATE market_items SET town_id = 101 WHERE town_id IS NULL;

-- 5. Crear índexs per a millorar el rendiment dels filtres per poble
CREATE INDEX IF NOT EXISTS idx_posts_town_id ON posts(town_id);
CREATE INDEX IF NOT EXISTS idx_market_items_town_id ON market_items(town_id);
CREATE INDEX IF NOT EXISTS idx_profiles_town_id ON profiles(town_id);
