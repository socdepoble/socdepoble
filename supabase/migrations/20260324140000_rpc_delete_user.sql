-- ==============================================================================
-- SÓC DE POBLE - MIGRACIÓ DE BORRAT DE COMPTE (ELIMINAR EN 5 SEGONS)
-- ==============================================================================

-- Aquesta funció permet a l'usuari autenticat esborrar el seu propi perfil des de l'App.
-- Com que hem configurat ON DELETE CASCADE prèviament, esborrar el registre de `auth.users`
-- provocarà l'eliminació automàtica i neta de tota la seua activitat (posts, mercat, etc.) 
-- i de la seua fitxa en `profiles` en qüestió de mil·lisegons.

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    -- Seguretat total: Només pot esborrar el compte que fa la petició (auth.uid())
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
