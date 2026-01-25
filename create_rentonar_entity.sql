-- Script to create 'El Rentonar' entity if it doesn't exist
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    new_entity_id UUID;
    javi_id UUID := 'd6325f44-7277-4d20-b020-166c010995ab'; -- Javi's ID
    town_uuid UUID;
BEGIN
    -- Get La Torre de les Maçanes UUID
    SELECT uuid INTO town_uuid FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1;

    -- Check if entity exists
    IF NOT EXISTS (SELECT 1 FROM entities WHERE name = 'El Rentonar') THEN
        -- Create Entity
        INSERT INTO entities (
            name,
            type,
            description,
            town_uuid,
            avatar_url
        ) VALUES (
            'El Rentonar',
            'grup',
            'Associació ecologista de La Torre de les Maçanes. Natura i Patrimoni. Treballant per la sostenibilitat i conservació del nostre entorn.',
            town_uuid,
            'https://socdepoble.net/wp-content/uploads/2020/01/logo-rentonar.jpg' -- Placeholder based on likely URL, can be updated
        ) RETURNING id INTO new_entity_id;

        -- Make Javi Admin
        INSERT INTO entity_members (entity_id, user_id, role)
        VALUES (new_entity_id, javi_id, 'admin');

        RAISE NOTICE 'Entity El Rentonar created with ID: %', new_entity_id;
    ELSE
        RAISE NOTICE 'Entity El Rentonar already exists.';
    END IF;
END $$;
