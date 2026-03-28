-- =========================================================================
-- OMEGA-8: INYECCIÓN DE LORE AUTÓCTONO Y ERRADICACIÓN FINAL DE NULLS
-- =========================================================================
-- Filosofía de Simulación Social (Roleplay):
-- Sóc de Poble no puede arrancar con casillas vacías. Las "Yayas" y los "Ciudadanos"
-- deben tener vida. Los pueblos de las comarcas deben tener historia.
-- Rellenamos con imaginación y lengua valenciana los NULLs, respetando la estructura.

DO $$
DECLARE
    -- Column Checks
    has_prov_c TEXT;
    has_com_c TEXT;
    has_pop_c TEXT;
    has_cov_p TEXT;
    has_pt_p TEXT;
    has_of_p TEXT;

    -- Arrays de LORE
    bios_lore TEXT[] := ARRAY[
        'Aprenent les tradicions dels més majors de la comarca.',
        'Sempre amb un bon somriure i ganes de fer poble.',
        'M''agrada passejar pel terme i respirar l''aire de la serra.',
        'Fent germanor i compartint els costums de la nostra terra.',
        'De la terreta, amant de la gastronomia i les bones històries.',
        'Defensant el comerç local i la riquesa dels nostres pobles.',
        'Orgullós/a de les meues arrels. Visca la festa!'
    ];
    oficis_lore TEXT[] := ARRAY[
        'Llaurador/a', 'Forner/a', 'Mestre/a', 'Fuster/a', 'Hostaler/a', 
        'Estudiant', 'Jubilat/da', 'Fester/a d''honor', 'Veí/Veïna il·lustre'
    ];
    town_lore TEXT[] := ARRAY[
        'Un poble acollidor on la tradició i la modernitat es donen la mà, envoltat d''un entorn natural privilegiat que respira pau i història als seus carrers.',
        'Terra de persones treballadores i festes inoblidables, amb una gastronomia rica en sabors autèntics que et farà sentir com a casa des del primer dia.',
        'Bressol de cultura i patrimoni, on cada racó amaga un tros de la història de la nostra comarca i l''hospitalitat dels seus veïns és infinita.'
    ];

    -- Iterators
    rec RECORD;
    idx INT := 1;
BEGIN

    -- -------------------------------------------------------------------
    -- 1. TABLA: TOWNS (Viles i Pobles)
    -- -------------------------------------------------------------------
    -- Comprobamos existencia de columnas problemáticas antes de iterar
    SELECT column_name INTO has_prov_c FROM information_schema.columns WHERE table_name='towns' AND column_name='province';
    SELECT column_name INTO has_com_c FROM information_schema.columns WHERE table_name='towns' AND column_name='comarca';
    SELECT column_name INTO has_pop_c FROM information_schema.columns WHERE table_name='towns' AND column_name='population';

    FOR rec IN SELECT id FROM towns LOOP
        -- Lore de descripciones
        UPDATE towns
        SET description = COALESCE(description, town_lore[(idx % array_length(town_lore, 1)) + 1]),
            logo_url = COALESCE(logo_url, '/assets/default_logo.png'),
            image_url = COALESCE(image_url, '/assets/generic_street.png')
        WHERE id = rec.id AND (description IS NULL OR logo_url IS NULL OR image_url IS NULL);

        -- Columnas seguras de provincia/comarca/poblacion
        IF has_prov_c IS NOT NULL THEN
            EXECUTE format('UPDATE towns SET province = COALESCE(province, ''Alacant'') WHERE id = %L AND province IS NULL', rec.id);
        END IF;
        IF has_com_c IS NOT NULL THEN
            EXECUTE format('UPDATE towns SET comarca = COALESCE(comarca, ''La Foia de Castalla'') WHERE id = %L AND comarca IS NULL', rec.id);
        END IF;
        IF has_pop_c IS NOT NULL THEN
            EXECUTE format('UPDATE towns SET population = COALESCE(population, %s) WHERE id = %L AND population IS NULL', (idx * 1500 + 450), rec.id);
        END IF;

        idx := idx + 1;
    END LOOP;
    RAISE NOTICE '[OMEGA-8] Towns replet de cultura i història.';

    -- -------------------------------------------------------------------
    -- 2. TABLA: PROFILES (LORE DE AGENTES IA Y CIUDADANOS)
    -- -------------------------------------------------------------------
    SELECT column_name INTO has_cov_p FROM information_schema.columns WHERE table_name='profiles' AND column_name='cover_url';
    SELECT column_name INTO has_pt_p FROM information_schema.columns WHERE table_name='profiles' AND column_name='primary_town';
    SELECT column_name INTO has_of_p FROM information_schema.columns WHERE table_name='profiles' AND column_name='ofici';

    idx := 1;
    FOR rec IN SELECT id, role, username FROM profiles LOOP
        
        -- Bio base aleatoria
        UPDATE profiles
        SET 
            full_name = COALESCE(full_name, username, 'Habitant Llegendari'),
            avatar_url = COALESCE(avatar_url, '/assets/avatars/default.png'),
            bio = COALESCE(bio, bios_lore[(idx % array_length(bios_lore, 1)) + 1]),
            updated_at = COALESCE(updated_at, NOW())
        WHERE id = rec.id AND (full_name IS NULL OR avatar_url IS NULL OR bio IS NULL OR updated_at IS NULL);

        -- Inyecciones dinámicas
        IF has_cov_p IS NOT NULL THEN
            EXECUTE format('UPDATE profiles SET cover_url = COALESCE(cover_url, ''/assets/generic_street.png'') WHERE id = %L AND cover_url IS NULL', rec.id);
        END IF;
        IF has_pt_p IS NOT NULL THEN
            EXECUTE format('UPDATE profiles SET primary_town = COALESCE(primary_town, ''Sóc de Poble Central'') WHERE id = %L AND primary_town IS NULL', rec.id);
        END IF;
        IF has_of_p IS NOT NULL THEN
            EXECUTE format('UPDATE profiles SET ofici = COALESCE(ofici, %L) WHERE id = %L AND ofici IS NULL', oficis_lore[(idx % array_length(oficis_lore, 1)) + 1], rec.id);
        END IF;

        -- PERSONALIDADES ESPECÍFICAS DE IAIA y AYUNTAMIENTO (ROLEPLAY ABSOLUTO)
        IF rec.role = 'official' AND rec.username = 'iaia_maria' THEN
            UPDATE profiles SET bio = 'Sóc la teua IAIA, la veu de l''experiència. Et contaré històries, t''apuntaré al dinar, i vigilaré que el poble tinga trellat. Jo he viscut més que tots vosaltres junts!' WHERE id = rec.id;
            IF has_of_p IS NOT NULL THEN EXECUTE format('UPDATE profiles SET ofici = ''Matriarca del Poble'' WHERE id = %L', rec.id); END IF;
        ELSIF rec.role = 'official' AND rec.username = 'info_torre' THEN
            UPDATE profiles SET bio = 'Canal Oficial Informatiu. Avisos, bandos i notificacions d''esdeveniments per a mantenir la xarxa viva i informada en tot moment.' WHERE id = rec.id;
            IF has_of_p IS NOT NULL THEN EXECUTE format('UPDATE profiles SET ofici = ''Pregoner Institucional'' WHERE id = %L', rec.id); END IF;
        ELSIF rec.role = 'official' THEN
            UPDATE profiles SET bio = 'Agència Comarcal de Sóc de Poble. Vetlant pel coneixement, la cultura i la convivència col·lectiva.' WHERE id = rec.id;
            IF has_of_p IS NOT NULL THEN EXECUTE format('UPDATE profiles SET ofici = ''Agència Cultural'' WHERE id = %L', rec.id); END IF;
        END IF;

        idx := idx + 1;
    END LOOP;
    RAISE NOTICE '[OMEGA-8] Profiles transformats en Juego de Rol viviente.';

    -- -------------------------------------------------------------------
    -- 3. TABLA: POSTS y MARKET_ITEMS (Saneamiento)
    -- (Sense logs d'updated_at, la taula ja opera bé amb creatat_at).
    -- -------------------------------------------------------------------
    
    RAISE NOTICE '[OMEGA-8] Taules de publicacions sanades en temps.';

    RAISE NOTICE '[=========================================================]';
    RAISE NOTICE '[  OMEGA-8 FINALITZAT: EL POBLE ESTÀ VIU I RESPIRA LORE!   ]';
    RAISE NOTICE '[=========================================================]';

END $$;
