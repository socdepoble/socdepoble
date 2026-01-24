-- Setup Script: Reserved Usernames and Entities for Javi Llinares
-- Execute this on Supabase SQL Editor after running migration_friendly_urls.sql

-- ============================================
-- PART 1: Reserve Usernames
-- ============================================

-- Update Javi's profile to use @socdepoble
UPDATE profiles 
SET username = 'socdepoble'
WHERE id = 'd6325f44-7277-4d20-b020-166c010995ab';

-- Note: The following usernames are RESERVED for future use:
-- @javillinares - Personal profile (future)
-- @rentonar - El Rentonar association (future entity username feature)

-- ============================================
-- PART 2: Create Entity - Sóc de Poble (Company)
-- ============================================

INSERT INTO entities (
    id,
    name,
    type,
    description,
    town_uuid,
    created_by
) VALUES (
    gen_random_uuid(),
    'Sóc de Poble',
    'empresa',
    'Portal de Pobles Connectats. Xarxa social hiper-local que connecta les comunitats valencianes.',
    (SELECT uuid FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1),
    'd6325f44-7277-4d20-b020-166c010995ab'
) RETURNING id;

-- Make Javi admin of Sóc de Poble
-- (Replace <SOCDEPOBLE_ID> with the ID returned above)
-- INSERT INTO entity_members (entity_id, user_id, role)
-- VALUES ('<SOCDEPOBLE_ID>', 'd6325f44-7277-4d20-b020-166c010995ab', 'admin');

-- ============================================
-- PART 3: Create Entity - El Rentonar (Group)
-- ============================================

INSERT INTO entities (
    id,
    name,
    type,
    description,
    town_uuid,
    created_by
) VALUES (
    gen_random_uuid(),
    'El Rentonar',
    'grup',
    'Associació ecologista de La Torre de les Maçanes. Natura i Patrimoni. Treballant per la sostenibilitat i conservació del nostre entorn.',
    (SELECT uuid FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1),
    'd6325f44-7277-4d20-b020-166c010995ab'
) RETURNING id;

-- Make Javi admin of El Rentonar
-- (Replace <RENTONAR_ID> with the ID returned above)
-- INSERT INTO entity_members (entity_id, user_id, role)
-- VALUES ('<RENTONAR_ID>', 'd6325f44-7277-4d20-b020-166c010995ab', 'admin');

-- ============================================
-- PART 4: Create Entity - Banda de La Torre (Group/Cultural)
-- ============================================

INSERT INTO entities (
    id,
    name,
    type,
    description,
    town_uuid,
    created_by
) VALUES (
    gen_random_uuid(),
    'Banda de Música de La Torre de les Maçanes',
    'grup',
    'Banda de música tradicional de La Torre de les Maçanes. Cultura, música i tradició valenciana.',
    (SELECT uuid FROM towns WHERE name = 'La Torre de les Maçanes' LIMIT 1),
    'd6325f44-7277-4d20-b020-166c010995ab'
) RETURNING id;

-- Make Damià admin of Banda de La Torre
-- IMPORTANT: First get Damià's user ID from profiles table
-- SELECT id, full_name, username FROM profiles WHERE full_name ILIKE '%damià%';
-- Then replace <DAMIA_USER_ID> and <BANDA_ID> below:
-- 
-- INSERT INTO entity_members (entity_id, user_id, role)
-- VALUES ('<BANDA_ID>', '<DAMIA_USER_ID>', 'admin');
--
-- Optional: Add Javi as member (non-admin)
-- INSERT INTO entity_members (entity_id, user_id, role)
-- VALUES ('<BANDA_ID>', 'd6325f44-7277-4d20-b020-166c010995ab', 'member');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check Javi's updated username
SELECT id, username, full_name FROM profiles 
WHERE id = 'd6325f44-7277-4d20-b020-166c010995ab';

-- Check created entities
SELECT id, name, type, description FROM entities 
WHERE created_by = 'd6325f44-7277-4d20-b020-166c010995ab';

-- Check entity memberships
SELECT e.name, em.role 
FROM entity_members em
JOIN entities e ON e.id = em.entity_id
WHERE em.user_id = 'd6325f44-7277-4d20-b020-166c010995ab';

-- ============================================
-- NOTES
-- ============================================
-- 
-- Reserved Usernames:
-- - @socdepoble → Javi Llinares (personal profile) ✅ ACTIVE
-- - @javillinares → Reserved for future use
-- - @rentonar → Reserved for El Rentonar association
-- - @bandalatorre → Reserved for Banda de Música
--
-- Entities Created:
-- 1. Sóc de Poble (empresa) - Platform's official page → Admin: Javi
-- 2. El Rentonar (grup) - Environmental association → Admin: Javi
-- 3. Banda de Música de La Torre (grup) - Music band → Admin: Damià
--
-- Next Steps:
-- 1. Get Damià's user ID: SELECT id FROM profiles WHERE full_name ILIKE '%damià%';
-- 2. Uncomment and execute the entity_members INSERT for Banda with Damià's ID
-- 3. Optional: Create usernames support for entities (future feature)
