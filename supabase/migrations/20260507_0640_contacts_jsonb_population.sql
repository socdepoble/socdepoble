-- ==============================================================================
-- MIGRATION: 20260507_0640_contacts_jsonb_population.sql
-- DESCRIPTION: Extreme Realism population for empty JSONB arrays (phones, emails,
--              addresses, urls, dates, socials, chat_handles, labels).
-- PHILOSOPHY: Trellat (Món Virtual Complet)
-- ==============================================================================

-- Població d'EVENTS (dates importants, etc)
UPDATE public.contacts SET
    events = CASE 
        WHEN contact_type = 'human' THEN ('[{"type": "Aniversari_plataforma", "value": "2024-01-01"}]')::jsonb
        WHEN contact_type = 'ai' THEN ('[{"type": "Entrenament_inici", "value": "2023-11-15"}]')::jsonb
        ELSE ('[{"type": "Registre", "value": "2024-01-01"}]')::jsonb
    END
WHERE events IS NULL OR events = '[]'::jsonb;

-- Població de PHONES (Si és buit o nul)
UPDATE public.contacts SET
    phones = CASE 
        WHEN contact_type IN ('institution', 'business') THEN '[{"type": "Work", "value": "+34 965 00 00 00"}]'::jsonb
        WHEN contact_type IN ('system', 'ai') THEN '[{"type": "Main", "value": "+34 600 000 000"}]'::jsonb
        ELSE '[{"type": "Mobile", "value": "+34 666 00 00 00"}]'::jsonb
    END
WHERE phones IS NULL OR phones = '[]'::jsonb;

-- Població d'EMAILS
UPDATE public.contacts SET
    emails = CASE 
        WHEN contact_type = 'ai' THEN ('[{"type": "System", "value": "agent.' || id || '@socdepoble.org"}]')::jsonb
        WHEN contact_type = 'system' THEN ('[{"type": "Support", "value": "sys.' || id || '@socdepoble.org"}]')::jsonb
        WHEN contact_type = 'institution' THEN '[{"type": "Work", "value": "info@institucio.gov.es"}]'::jsonb
        WHEN contact_type = 'business' THEN ('[{"type": "Work", "value": "contacte@' || COALESCE(nickname, 'empresa') || '.com"}]')::jsonb
        ELSE ('[{"type": "Personal", "value": "hola.' || COALESCE(nickname, id::text) || '@example.com"}]')::jsonb
    END
WHERE emails IS NULL OR emails = '[]'::jsonb;

-- Població d'ADDRESSES
UPDATE public.contacts SET
    addresses = CASE 
        WHEN contact_type = 'ai' THEN '[{"type": "Virtual", "street": "Servidor Cloud 1", "city": "Alacant", "region": "Comunitat Valenciana", "postal_code": "03001", "country": "Espanya"}]'::jsonb
        WHEN contact_type = 'system' THEN '[{"type": "Virtual", "street": "Data Center", "city": "València", "region": "Comunitat Valenciana", "postal_code": "46001", "country": "Espanya"}]'::jsonb
        ELSE '[{"type": "Work", "street": "Plaça Major, 1", "city": "Poble Mític", "region": "Comunitat Valenciana", "postal_code": "03000", "country": "Espanya"}]'::jsonb
    END
WHERE addresses IS NULL OR addresses = '[]'::jsonb;

-- Població d'URLS i SOCIALS (Google Contacts permet socials separats, però al nostre schema els ajuntem com URLs de tipus perfil social)
UPDATE public.contacts SET
    urls = (
        CASE 
            WHEN contact_type IN ('ai', 'system') THEN '[{"type": "Dashboard", "value": "https://admin.socdepoble.org"}]'::jsonb
            ELSE ('[{"type": "Profile", "value": "https://socdepoble.org/u/' || COALESCE(nickname, 'perfil') || '"}]')::jsonb
        END
    ) || (
        CASE 
            WHEN contact_type IN ('institution', 'business') THEN '[{"type": "LinkedIn", "value": "https://linkedin.com/company/local"}]'::jsonb
            WHEN contact_type IN ('ai', 'system') THEN '[{"type": "GitHub", "value": "https://github.com/socdepoble"}]'::jsonb
            ELSE ('[{"type": "X", "value": "https://x.com/' || COALESCE(nickname, 'user') || '"}]')::jsonb
        END
    )
WHERE urls IS NULL OR urls = '[]'::jsonb;



-- Població de LABELS (Etiquetes simples de text)
UPDATE public.contacts SET
    labels = CASE 
        WHEN contact_type = 'ai' THEN '["AI Agent", "System"]'::jsonb
        WHEN contact_type = 'system' THEN '["Infrastructure", "Bot"]'::jsonb
        WHEN contact_type = 'human' THEN '["Usuari", "Comunitat"]'::jsonb
        WHEN contact_type = 'institution' THEN '["Públic", "Oficial"]'::jsonb
        WHEN contact_type = 'business' THEN '["Privat", "Comerç"]'::jsonb
        WHEN contact_type = 'group' THEN '["Associació", "Grup"]'::jsonb
        ELSE '["Contacte"]'::jsonb
    END
WHERE labels IS NULL OR labels = '[]'::jsonb OR labels = '[null]'::jsonb;
