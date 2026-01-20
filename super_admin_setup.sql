-- =========================================================
-- SÓC DE POBLE: SUPER ADMIN SETUP
-- =========================================================

-- 1. Assegurar que el rol existeix
INSERT INTO roles (name, description) 
VALUES ('super_admin', 'Administrador amb accés total a la xarxa')
ON CONFLICT (name) DO NOTHING;

-- 2. Snippet per promoure un usuari (Executar desprès del registre)
-- REEMPLAÇA 'correu@exemple.com' pel teu mail real quan t'hagis registrat!
/*
UPDATE profiles 
SET role = 'super_admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'correu@exemple.com');
*/

-- 3. Notificació de Mode Demo (Opcional, es pot gestionar per codi)
-- Podem afegir-ho a la taula de configuració si la tinguéssim
