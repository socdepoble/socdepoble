-- =========================================================================
-- 🛡️ SÓC DE POBLE: PROTOCOL "TABULA RASA" (PURGA ABSOLUTA)
-- =========================================================================
-- El Mestre ha ordenat l'execució del Sant Greal de les neteges.
-- Açò arrasarà TOTS els usuaris d'Auth (inclòs Damià amb els seus fantasmes,
-- la IAIA, Pep, Rosa...) i gràcies a l'arquitectura 'ON DELETE CASCADE' 
-- que hem construït en l'Step 2, la simple eliminació ací polvoritzarà
-- en cadena els seus perfils, missatges i anuncis fins a l'inframón.
-- =========================================================================

BEGIN;

-- Esborrem-ho TOT, excepte l'identificador Sobirà de l'arquitecte en Cap (Tu).
DELETE FROM auth.users 
WHERE id != 'd6325f44-7277-4d20-b020-166c010995ab';

COMMIT;
