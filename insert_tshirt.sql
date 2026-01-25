-- Script Intel·ligent V4 (Category Auto-Fix)
-- Executa tot el bloc. Resolt l'error de "category_slug" i "created_by".

DO $$
DECLARE
    v_town_id uuid;
    v_user_id uuid := 'd6325f44-7277-4d20-b020-166c010995ab'; -- El teu ID (Javi)
    v_entity_id uuid;
BEGIN
    -- 1. Buscar l'ID del poble (La Torre)
    SELECT uuid INTO v_town_id FROM towns WHERE name ILIKE 'La Torre%' LIMIT 1;
    IF v_town_id IS NULL THEN SELECT uuid INTO v_town_id FROM towns LIMIT 1; END IF;

    -- 2. Assegurar que existeix la categoria "roba"
    INSERT INTO market_categories (slug, name_va, name_es, icon)
    VALUES ('roba', 'Roba', 'Ropa', 'Shirt')
    ON CONFLICT (slug) DO NOTHING;

    -- 3. Buscar/Crear l'Entitat "Sóc de Poble"
    SELECT id INTO v_entity_id FROM entities WHERE name = 'Sóc de Poble' LIMIT 1;

    IF v_entity_id IS NULL THEN
        -- Crear entitat SENSE created_by
        INSERT INTO entities (name, type, description, town_uuid)
        VALUES ('Sóc de Poble', 'empresa', 'Portal de Pobles Connectats.', v_town_id)
        RETURNING id INTO v_entity_id;
        
        -- Assignar admin
        INSERT INTO entity_members (entity_id, user_id, role)
        VALUES (v_entity_id, v_user_id, 'admin');

        RAISE NOTICE 'Entitat creada amb ID: %', v_entity_id;
    ELSE
        RAISE NOTICE 'Entitat trobada: %', v_entity_id;
        -- Assegurar admin
        IF NOT EXISTS (SELECT 1 FROM entity_members WHERE entity_id = v_entity_id AND user_id = v_user_id) THEN
             INSERT INTO entity_members (entity_id, user_id, role) VALUES (v_entity_id, v_user_id, 'admin');
        END IF;
    END IF;

    -- 4. Inserir Producte
    DELETE FROM market_items WHERE title = 'Camiseta Oficial Sóc de Poble' AND seller = 'Sóc de Poble';
    
    INSERT INTO market_items (
        title, description, price, seller, category_slug, 
        image_url, entity_id, author_id, town_uuid, is_active, created_at
    ) VALUES (
        'Camiseta Oficial Sóc de Poble',
        'La samarreta que connecta pobles. Disseny exclusiu "Ruta del Poble". Cotó 100% orgànic.',
        15.00,
        'Sóc de Poble',
        'roba', -- Ara ja segur que existeix
        'https://soc-de-poble.vercel.app/images/samarreta-soc-de-poble.png',
        v_entity_id, v_user_id, v_town_id, true, NOW()
    );

    RAISE NOTICE 'Producte Camiseta inserit correctament!';
END $$;
