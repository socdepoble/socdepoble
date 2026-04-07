-- SCRIPT DE MIGRACIÓ FASE 11 (POWERSYNC NATIVE)
-- Crea i configura el rol que PowerSync necessita per sincronitzar de forma segura.

-- 1. Creem el rol
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'powersync_role') THEN
      CREATE ROLE powersync_role WITH LOGIN PASSWORD 'TriaUnaContrasenyaMoltSegura123!';
   END IF;
END
$do$;

-- 2. Li donem permisos d'operació sobre l'esquema públic
GRANT USAGE ON SCHEMA public TO powersync_role;

-- 3. Donem permisos de lectura, inserció, actualització i esborrat a les taules
-- (Això exclou taules del sistema, però inclou public per la sincronització P2P de CRDT)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO powersync_role;

-- 4. Assegurem que qualsevol nova taula creada hereti aquests permisos automàticament
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO powersync_role;

-- 5. PowerSync necessita accés de lectura a les publicacions pg_publication
GRANT SELECT ON pg_publication TO powersync_role;

-- NOTA IMPORTANT DE SEGURETAT (RLS):
-- PowerSync executa les consultes i els uploads com a usuari autenticat
-- Només si activeu RLS assegureu-vos d'afegir el bypass al rol powersync o processar 
-- les regles RLS en les regles de PowerSync al seu propi panell de control (Sync Rules).
