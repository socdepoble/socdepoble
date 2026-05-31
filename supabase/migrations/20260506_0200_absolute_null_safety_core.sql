-- Migration: 20260506_0200_absolute_null_safety_core.sql
-- Description: Absolute null-safety for all remaining structural tables (market, chat, lexicon, calendars, notifications, etc.)
-- Objective: Ensure zero NULL values that could compromise JSON parsing on offline-first legacy clients (iPad A10).

DO $$
DECLARE
    rec RECORD;
BEGIN
    -------------------------------------------------------------------
    -- 1. CONVERSATIONS & MESSAGES
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.conversations SET last_message_content = 'EMPTY' WHERE last_message_content IS NULL;
        UPDATE public.conversations SET participant_1_type = 'user' WHERE participant_1_type IS NULL;
        UPDATE public.conversations SET participant_2_type = 'user' WHERE participant_2_type IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    BEGIN
        UPDATE public.messages SET content = 'EMPTY' WHERE content IS NULL;
        UPDATE public.messages SET is_ai = false WHERE is_ai IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 2. MARKET_ITEMS
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.market_items SET subtitle = 'EMPTY' WHERE subtitle IS NULL;
        UPDATE public.market_items SET description = 'EMPTY' WHERE description IS NULL;
        UPDATE public.market_items SET category_slug = 'tot' WHERE category_slug IS NULL;
        UPDATE public.market_items SET status = 'active' WHERE status IS NULL;
        UPDATE public.market_items SET semantic_tags = '{}'::text[] WHERE semantic_tags IS NULL;
        UPDATE public.market_items SET external_links = '[]'::jsonb WHERE external_links IS NULL;
        UPDATE public.market_items SET tags = '{}'::text[] WHERE tags IS NULL;
        UPDATE public.market_items SET category_uuids = '{}'::uuid[] WHERE category_uuids IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 3. LEXICON (El Vocabulari)
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.lexicon SET term = 'Definició Pendent' WHERE term IS NULL;
        UPDATE public.lexicon SET definition = 'EMPTY' WHERE definition IS NULL;
        UPDATE public.lexicon SET category = 'general' WHERE category IS NULL;
        UPDATE public.lexicon SET source = 'system' WHERE source IS NULL;
        UPDATE public.lexicon SET is_official = false WHERE is_official IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 4. CMS_PAGES (L'Arxiu D'Or)
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.cms_pages SET title = 'Pàgina sense títol' WHERE title IS NULL;
        UPDATE public.cms_pages SET slug = 'sense-slug-' || substring(id::text from 1 for 8) WHERE slug IS NULL;
        UPDATE public.cms_pages SET html_content = 'EMPTY' WHERE html_content IS NULL;
        UPDATE public.cms_pages SET status = 'draft' WHERE status IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 5. CONNECTIONS (Xarxa P2P)
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.connections SET status = 'accepted' WHERE status IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 6. CALENDARS AND EVENTS
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.sdb_internal_calendars SET description = 'EMPTY' WHERE description IS NULL;
        UPDATE public.sdb_internal_calendars SET color_id = '#169CF9' WHERE color_id IS NULL;
        UPDATE public.sdb_internal_calendars SET role_required = 'authenticated' WHERE role_required IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;
    
    BEGIN
        UPDATE public.sdb_internal_calendar_events SET description = 'EMPTY' WHERE description IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 7. NOTIFICATIONS & PUSH SUBSCRIPTIONS
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.notifications SET type = 'system' WHERE type IS NULL;
        UPDATE public.notifications SET content = 'EMPTY' WHERE content IS NULL;
        UPDATE public.notifications SET meta = '{}'::jsonb WHERE meta IS NULL;
        UPDATE public.notifications SET is_read = false WHERE is_read IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    BEGIN
        UPDATE public.push_subscriptions SET device_info = '{}'::jsonb WHERE device_info IS NULL;
        UPDATE public.push_subscriptions SET is_active = true WHERE is_active IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    -------------------------------------------------------------------
    -- 8. RESOURCES & MUTATION_LOG (Offline Sync Core)
    -------------------------------------------------------------------
    BEGIN
        UPDATE public.resources SET description = 'EMPTY' WHERE description IS NULL;
        UPDATE public.resources SET semantic_tags = '{}'::text[] WHERE semantic_tags IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

    BEGIN
        UPDATE public.mutation_log SET payload = '{}'::jsonb WHERE payload IS NULL;
        UPDATE public.mutation_log SET mutation_type = 'unknown' WHERE mutation_type IS NULL;
        UPDATE public.mutation_log SET status = 'pending' WHERE status IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN undefined_column THEN NULL; END;

END $$;
