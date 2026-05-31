-- Migration: Universal Contacts System (Google Contacts Clone / vCard Standard)
-- Date: 2026-05-07
-- Description: Creates a universal `contacts` table strictly compliant with the vCard 3.0/4.0 standard
-- and perfectly aligned 1:1 with Google Contacts fields for pristine VCF/WhatsApp exports.

BEGIN;

-- 1. Create the `contacts` table (Google Contacts Clone)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Name (Google Contacts Standard)
    fn TEXT NOT NULL, -- Formatted Name (Obligatori a VCF)
    n_prefix TEXT,
    n_first TEXT,
    n_middle TEXT,
    n_last TEXT,
    n_suffix TEXT,
    nickname TEXT,
    phonetic_first TEXT,
    phonetic_middle TEXT,
    phonetic_last TEXT,

    -- Work (Google Contacts Standard)
    org_company TEXT,
    org_department TEXT,
    org_title TEXT,
    
    -- JSONB Arrays for multi-value Google VCF properties (label, value, etc.)
    phones JSONB DEFAULT '[]'::jsonb, -- [{"label": "Mobile", "country_code": "+34", "number": "600000000"}]
    emails JSONB DEFAULT '[]'::jsonb, -- [{"label": "Work", "value": "email@domain.com"}]
    addresses JSONB DEFAULT '[]'::jsonb, -- [{"label": "Work", "po_box": "", "street": "...", "city": "...", "region": "...", "postal_code": "...", "country": "..."}]
    urls JSONB DEFAULT '[]'::jsonb, -- [{"label": "Profile", "value": "https://..."}]
    events JSONB DEFAULT '[]'::jsonb, -- [{"label": "Anniversary", "year": "2020", "month": "01", "day": "01"}]
    chat JSONB DEFAULT '[]'::jsonb, -- [{"label": "Skype", "value": "username"}]
    relationships JSONB DEFAULT '[]'::jsonb, -- [{"label": "Manager", "value": "Name"}]
    labels JSONB DEFAULT '[]'::jsonb, -- Custom labels/tags (Google Groups)
    
    bday DATE,
    note TEXT,
    photo_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure a contact is linked to either a profile or an entity (or neither, for loose contacts)
    CONSTRAINT contacts_owner_check CHECK (
        (entity_id IS NOT NULL AND profile_id IS NULL) OR
        (profile_id IS NOT NULL AND entity_id IS NULL) OR
        (entity_id IS NULL AND profile_id IS NULL)
    )
);

-- Index for fast lookup by owner
CREATE INDEX IF NOT EXISTS idx_contacts_entity_id ON public.contacts(entity_id);
CREATE INDEX IF NOT EXISTS idx_contacts_profile_id ON public.contacts(profile_id);

-- 2. Migrate Data from `entities` to `contacts` (Google Contacts Style)
DO $$
DECLARE
    v_entity RECORD;
    v_phone_json JSONB;
    v_email_json JSONB;
    v_url_json JSONB;
    v_addr_json JSONB;
    v_country_code TEXT;
    v_number TEXT;
BEGIN
    FOR v_entity IN 
        SELECT id, name, type, contact_email, contact_phone, website_url, address, description, avatar_url, cover_url 
        FROM public.entities 
        WHERE contact_email IS NOT NULL 
           OR contact_phone IS NOT NULL 
           OR website_url IS NOT NULL 
           OR address IS NOT NULL
    LOOP
        -- Process Phone (Defaulting to 'Work' for entities)
        v_phone_json := '[]'::jsonb;
        IF v_entity.contact_phone IS NOT NULL AND v_entity.contact_phone <> '' THEN
            -- Extracció intel·ligent del +34
            IF v_entity.contact_phone LIKE '+34 %' THEN
                v_country_code := '+34';
                v_number := REPLACE(v_entity.contact_phone, '+34 ', '');
            ELSIF v_entity.contact_phone LIKE '+34%' THEN
                v_country_code := '+34';
                v_number := REPLACE(v_entity.contact_phone, '+34', '');
            ELSE
                v_country_code := '';
                v_number := v_entity.contact_phone;
            END IF;
            
            -- Eliminar espais del número per tindre un format net (Google Contacts Style)
            v_number := REPLACE(v_number, ' ', '');

            v_phone_json := jsonb_build_array(
                jsonb_build_object(
                    'label', 'Work',
                    'country_code', v_country_code,
                    'number', v_number
                )
            );
        END IF;

        -- Process Email (Defaulting to 'Work' for entities)
        v_email_json := '[]'::jsonb;
        IF v_entity.contact_email IS NOT NULL AND v_entity.contact_email <> '' THEN
            v_email_json := jsonb_build_array(
                jsonb_build_object(
                    'label', 'Work',
                    'value', v_entity.contact_email
                )
            );
        END IF;

        -- Process URL (Defaulting to 'Profile' or 'Work')
        v_url_json := '[]'::jsonb;
        IF v_entity.website_url IS NOT NULL AND v_entity.website_url <> '' THEN
            v_url_json := jsonb_build_array(
                jsonb_build_object(
                    'label', 'Website',
                    'value', v_entity.website_url
                )
            );
        END IF;

        -- Process Address (Defaulting to 'Work' for entities)
        v_addr_json := '[]'::jsonb;
        IF v_entity.address IS NOT NULL AND v_entity.address <> '' THEN
            v_addr_json := jsonb_build_array(
                jsonb_build_object(
                    'label', 'Work',
                    'po_box', '',
                    'street', v_entity.address,
                    'city', '',
                    'region', '',
                    'postal_code', '',
                    'country', ''
                )
            );
        END IF;

        -- Inserció a la taula contacts
        INSERT INTO public.contacts (
            entity_id,
            fn,
            n_first,
            org_company,
            note,
            photo_url,
            phones,
            emails,
            addresses,
            urls
        ) VALUES (
            v_entity.id,
            v_entity.name,
            v_entity.name, -- Mapping name as given name and fn
            v_entity.name, -- And as company
            v_entity.description,
            COALESCE(v_entity.avatar_url, v_entity.cover_url),
            v_phone_json,
            v_email_json,
            v_addr_json,
            v_url_json
        );
    END LOOP;
END $$;

COMMIT;

-- Inform the console
DO $$
BEGIN
    RAISE NOTICE 'Universal Contacts (Google Contacts Clone) table created and populated successfully.';
END
$$;
