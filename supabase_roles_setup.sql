-- =========================================================
-- MIGRACIÓN DE ROLES: GENT, GRUPS, EMPRESES
-- =========================================================

-- 1. Actualizar tabla PROFILES
-- Añadimos la columna 'role' con constraint de validación
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'gent' CHECK (role IN ('gent', 'grup', 'empresa'));

-- 2. Actualizar tabla POSTS
-- Añadimos 'author_role' desnormalizado para filtrar rápido en el Feed
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'gent' CHECK (author_role IN ('gent', 'grup', 'empresa'));

-- 3. Actualizar tabla MARKET_ITEMS
-- Añadimos 'seller_role' desnormalizado para filtrar en el Mercado
ALTER TABLE market_items 
ADD COLUMN IF NOT EXISTS seller_role TEXT DEFAULT 'gent' CHECK (seller_role IN ('gent', 'grup', 'empresa'));


-- 4. MIGRACIÓN DE DATOS EXISTENTES (Based on avatar_type logic)

-- Migrar POSTS basado en avatar_type (que usábamos como parche)
UPDATE posts SET author_role = 'grup' WHERE avatar_type IN ('gov', 'group');
UPDATE posts SET author_role = 'empresa' WHERE avatar_type IN ('shop', 'coop');
UPDATE posts SET author_role = 'gent' WHERE avatar_type IN ('user', 'person');

-- Migrar MARKET_ITEMS basado en seller name (heurística simple ya que no teníamos avatar_type en market)
-- Si contiene "Forn", "Bar", "Cooperativa", "Rastro" -> Empresa
UPDATE market_items SET seller_role = 'empresa' 
WHERE seller ILIKE '%Forn%' 
   OR seller ILIKE '%Bar%' 
   OR seller ILIKE '%Cooperativa%' 
   OR seller ILIKE '%Rastro%';

-- Asumimos el resto como 'gent' (default)

-- 5. POLICIES (Opcional, aseguramos lectura pública)
-- Las policies existentes de lectura pública deberían cubrir las nuevas columnas,
-- pero nos aseguramos que cualquier auth user pueda ver los roles.
-- (No es necesario un cambio explícito si la policy es "SELECT using (true)")

