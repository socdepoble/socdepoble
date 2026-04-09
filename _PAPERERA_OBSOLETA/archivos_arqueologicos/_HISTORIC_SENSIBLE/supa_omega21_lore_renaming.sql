-- ==============================================================================
-- OMEGA-21 (VIGILANCIA DE MARCA Y LORE): Renombrado Legal para evitar colisiones
-- ==============================================================================
-- Como dice la regla: No utilices nombres genéricos o vinculados a poblaciones 
-- reales para evitar suplantaciones o denuncias de entidades oficiales.

BEGIN;

-- 1. MUSICALES
UPDATE entities SET name = 'Societat Musical Els Festers' WHERE name ILIKE 'Banda de % Lira';

-- 2. PANADERÍAS
UPDATE entities SET name = 'Forn Tradicional El Campanar' WHERE name ILIKE 'Forn de la Plaça';
UPDATE entities SET name = 'Forn Artesà La Lluna' WHERE name ILIKE 'Forn de Pa La Plaça';

-- 3. AGRICULTURA
UPDATE entities SET name = 'Cooperativa Agrícola Sant Blai' WHERE name = 'Cooperativa Agrícola';
UPDATE entities SET name = 'Agrobotiga El Raconet' WHERE name = 'Agrobotiga La Solana';
UPDATE entities SET name = 'Floristeria La Rosella' WHERE name = 'Floristeria L''Aroma';

-- 4. TURISMO / OFICIAL (Cocentaina existe en la realidad, ¡es un riesgo!)
UPDATE entities SET name = 'Oficina de Turisme La Vall' WHERE name = 'Turisme Cocentaina';

-- 5. ASOCIACIONES
UPDATE entities SET name = 'Comissió de Festes La Il·lusió' WHERE name = 'Comissió de Festes';
UPDATE entities SET name = 'Associació de Veïns El Tossal' WHERE name = 'Associació de Veïns';
UPDATE entities SET name = 'Associació de Dones El Riu' WHERE name = 'Associació de Dones Rurals';

-- 6. NATURALEZA Y DEPORTE
-- Penàguila y La Torre son pueblos reales, mejor evitar usar su nombre directo:
UPDATE entities SET name = 'Centre Excursionista El Cim' WHERE name ILIKE 'Centre Excursionista Penàguila';
UPDATE entities SET name = 'Grup Senderisme Els Caminants' WHERE name ILIKE 'Grup Senderisme La Torre';

-- 7. COMERCIOS
UPDATE entities SET name = 'Bar La Plaça Major' WHERE name = 'Bar Municipal';
UPDATE entities SET name = 'Bar L''Ermita' WHERE name ILIKE 'Bar El Chato';
UPDATE entities SET name = 'Fusteria L''Eixida' WHERE name = 'Fusteria L''Art';
UPDATE entities SET name = 'Formatgeria El Regall' WHERE name = 'Formatgeria Penya Roja';

COMMIT;
