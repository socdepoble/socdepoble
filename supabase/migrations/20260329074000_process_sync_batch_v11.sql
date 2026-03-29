-- -----------------------------------------------------------------------------------------
-- Arquitectura Sóc de Poble (Fase 11) - SyncWorker CRDT 3-Way Merge amb LWW
-- Aquest RPC serà cridat pel Worker de PowerSync per combinar lots d'operacions (Batching).
-- Implementa exclusivament LWW (Last-Write-Wins) a nivell de columna i bloqueig FOR UPDATE
-- per prevenció d'agressions d'alta concurrència rural (Lost Updates).
-- -----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION process_sync_batch_v11(batch jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    item jsonb;
    current_id uuid;
    incoming_updated_at timestamptz;
    db_row jsonb;
    db_updated_at timestamptz;
    old_rec jsonb;
    new_rec jsonb;
    merged_rec jsonb;
    col text;
    -- Taules sincronitzades suportades teòricament; en aquest cas ens centrem en indicències o CMS.
    cols text[] := ARRAY['titol', 'descripcio', 'estat', 'deleted_at']; -- Llista de columnes conflictables per defecte per a incidencies.
    success_count int := 0;
    errors jsonb := '[]'::jsonb;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(batch)
    LOOP
        BEGIN
            current_id := (item->>'id')::uuid;
            incoming_updated_at := (item->>'updated_at')::timestamptz;
            old_rec := item->'old_record';
            new_rec := item->'new_record';

            -- PAS 1: Lectura atòmica amb bloqueig pessimista (FOR UPDATE)
            -- Aquest bloqueig impedeix 'Lost Updates' si dos telèfons sincronitzen al mateix ms
            SELECT to_jsonb(incidencies), updated_at INTO db_row, db_updated_at
            FROM incidencies WHERE id = current_id FOR UPDATE;

            IF NOT FOUND THEN
                -- És una fila totalment nova creada offline, inserció lliure.
                INSERT INTO incidencies (id, titol, descripcio, estat, created_by, updated_at, deleted_at)
                VALUES (
                    current_id, new_rec->>'titol', new_rec->>'descripcio', new_rec->>'estat',
                    (new_rec->>'created_by')::uuid, incoming_updated_at, (new_rec->>'deleted_at')::timestamptz
                );
                success_count := success_count + 1;
                CONTINUE;
            END IF;

            -- PAS 2: EL 3-WAY MERGE (Fusió per Columnes)
            merged_rec := db_row;

            FOREACH col IN ARRAY cols
            LOOP
                -- Ha tocat el pagès (Client offline) aquest camp específic?
                IF (old_rec->>col) IS DISTINCT FROM (new_rec->>col) THEN
                    
                    -- L'havien tocat al servidor mentrestant (Presidenta online)?
                    IF (db_row->>col) IS DISTINCT FROM (old_rec->>col) THEN
                        -- COL·LISIÓ (Conflicte). Només per aquest camp guanya qui ho va fer cronològicament últim.
                        IF incoming_updated_at > db_updated_at THEN
                            merged_rec := jsonb_set(merged_rec, ARRAY[col], new_rec->col);
                        END IF;
                        -- (Else: el servidor ho va canviar més tard, per la qual cosa respectem i descartem el canvi d'aquest camp particular).
                    ELSE
                        -- UNIÓ NETA. La presidenta i el servidor no ho havien alterat, s'aplica pacíficament el del pagès.
                        merged_rec := jsonb_set(merged_rec, ARRAY[col], new_rec->col);
                    END IF;
                END IF;
            END LOOP;

            -- PAS 3: Guardat
            IF merged_rec IS DISTINCT FROM db_row THEN
                UPDATE incidencies SET
                    titol = merged_rec->>'titol',
                    descripcio = merged_rec->>'descripcio',
                    estat = merged_rec->>'estat',
                    updated_at = GREATEST(incoming_updated_at, db_updated_at),
                    deleted_at = (merged_rec->>'deleted_at')::timestamptz
                WHERE id = current_id;
            END IF;

            success_count := success_count + 1;

        EXCEPTION WHEN OTHERS THEN
            -- Atrape els errors aïllats sense rebentar el lot de PowerSync sencers (BATCH 25)
            errors := errors || jsonb_build_object('id', current_id, 'error', SQLERRM);
        END;
    END LOOP;

    RETURN jsonb_build_object('success_count', success_count, 'errors', errors);
END;
$$;
