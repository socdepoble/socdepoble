-- Migration: 20260506_2255_setup_town_provision_webhook.sql
-- Propòsit: Crear el trigger a PostgreSQL que dispararà l'Edge Function
-- 'auto-provision-town' quan es detecte un nou poble al perfil.

-- Habilitem l'extensió pg_net per fer peticions HTTP si no està habilitada
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Creem una funció bridge que interceptarà el canvi i cridarà a l'Edge Function
CREATE OR REPLACE FUNCTION public.trigger_auto_provision_town()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
BEGIN
  -- Si el poble no ha canviat, no fem res
  IF (TG_OP = 'UPDATE' AND OLD.primary_town = NEW.primary_town) THEN
    RETURN NEW;
  END IF;

  -- Comprovem que el poble no és nul o un valor per defecte global
  IF NEW.primary_town IS NULL OR NEW.primary_town IN ('Global', 'Sóc de Poble (Global)', 'Illa de Tabarca', 'Illa de Tabarca (Global)') THEN
    RETURN NEW;
  END IF;

  -- Definim la URL de l'Edge Function. 
  -- ATENCIÓ: Si estem a producció, caldrà canviar açò pel domini real de Supabase.
  -- Ex: 'https://[PROJECT_REF].supabase.co/functions/v1/auto-provision-town'
  -- Com que és un script genèric usarem la crida a pg_net. 
  -- L'estratègia recomanada per Supabase és configurar aquest Webhook directament
  -- des del Dashboard de Supabase (Database -> Webhooks). Ací deixem el codi per si es 
  -- vol configurar per SQL directament usant pg_net:

  -- Construïm el payload: enviem un objecte JSON amb type i record
  PERFORM net.http_post(
      url:='http://supabase_kong:8000/functions/v1/auto-provision-town',
      body:=jsonb_build_object(
        'type', TG_OP,
        'record', row_to_json(NEW)
      ),
      headers:=jsonb_build_object(
        'Content-Type', 'application/json'
        -- Si a producció es requerix AUTH (anon key), afegir:
        -- 'Authorization', 'Bearer EL_TEU_ANON_KEY'
      )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminem el trigger si ja existeix per evitar duplicitats
DROP TRIGGER IF EXISTS on_profile_primary_town_change ON public.profiles;

-- Creem el trigger
CREATE TRIGGER on_profile_primary_town_change
  AFTER INSERT OR UPDATE OF primary_town
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_auto_provision_town();
