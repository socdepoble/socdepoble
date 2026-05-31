-- Migration to explicitly grant access to Data API roles for existing tables
-- This is necessary to comply with Supabase's May 30 change where new projects
-- no longer expose public tables by default to the Data API.

DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Iterar sobre totes les taules de l'esquema public
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
  LOOP
    -- GRANT per al rol anon (accés públic limitat per RLS)
    EXECUTE 'GRANT SELECT ON public.' || quote_ident(r.tablename) || ' TO anon;';
    
    -- GRANT per al rol authenticated (accés amb sessió, limitat per RLS)
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.' || quote_ident(r.tablename) || ' TO authenticated;';
    
    -- GRANT per al rol service_role (backend privilegiat)
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.' || quote_ident(r.tablename) || ' TO service_role;';
  END LOOP;
END $$;
