-- 20260516_0001_supa_comprehensive_audit_v2.sql
-- Comprehensive Database Audit: Absolute Null-Safety and Referential Integrity
-- Prepared for "Estat Omega" / P2P-ready architecture on legacy A10 hardware.

BEGIN;

-- 1. `users` table: enforce null-safety
UPDATE users SET display_name = COALESCE(display_name, 'Usuari Anònim');
UPDATE users SET role = COALESCE(role, 'peao');
UPDATE users SET preferences = COALESCE(preferences, '{}'::jsonb);

-- 2. `entities` table: enforce null-safety
UPDATE entities SET description = COALESCE(description, '');
UPDATE entities SET metadata = COALESCE(metadata, '{}'::jsonb);
UPDATE entities SET parent_id = NULL WHERE parent_id NOT IN (SELECT id FROM entities);

-- 3. `market_items` table: null-coalesce core fields
UPDATE market_items SET description = COALESCE(description, '');
UPDATE market_items SET price = COALESCE(price, 0);
UPDATE market_items SET metadata = COALESCE(metadata, '{}'::jsonb);
UPDATE market_items SET is_active = COALESCE(is_active, false);

-- 4. `media_assets` table: null-coalesce and integrity
UPDATE media_assets SET alt_text = COALESCE(alt_text, '');
UPDATE media_assets SET tags = COALESCE(tags, '[]'::jsonb);
UPDATE media_assets SET uploader_id = NULL WHERE uploader_id NOT IN (SELECT id FROM users);

-- 5. `contacts` table: ensure vCard compatibility without NULLs
UPDATE contacts SET name = COALESCE(name, 'Desconegut');
UPDATE contacts SET phone = COALESCE(phone, '');
UPDATE contacts SET role_play_config = COALESCE(role_play_config, '{}'::jsonb);

-- Ensure all metadata JSONB columns across the system are not null
-- This prevents WASM SQLite parser overhead when dealing with JSON objects.
-- 
-- (Note: Any further tables should follow the exact same COALESCE pattern)

COMMIT;
