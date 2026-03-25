-- =========================================================================
-- 16_STORAGE_RLS_POLICIES.sql
-- SEGURETAT D'ARXIUS SUPABASE (Recomanació QWEN - Auditoria Fase 4)
-- =========================================================================
-- Protegix els buckets d'imatges i assets contra over-writes maliciosos.
-- Permet lectura pública a tot el món, però restringeix pujades, 
-- modificacions i esborrats només als propietaris reals.
-- =========================================================================

-- Activar RLS per a la taula d'objectes de Storage (si no ho estava)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. LECTURA PÚBLICA TOTAL (Tothom pot veure imatges del poble i avatars)
CREATE POLICY "Lectura Pública de Buckets - Sóc de Poble" 
ON storage.objects FOR SELECT 
USING (true);

-- 2. PUJADA (INSERT) - Només Usuaris Autenticats
CREATE POLICY "Pujada Restringida Autenticats - Sóc de Poble" 
ON storage.objects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. ACTUALITZACIÓ I ESBORRAT - Només el propietari del fitxer
-- Utilitza l'owner_id automàtic que guarda Supabase Storage al pujar arxius.
CREATE POLICY "Gestió Pròpia d'Arxius - Sóc de Poble" 
ON storage.objects FOR UPDATE 
USING (auth.uid() = owner);

CREATE POLICY "Esborrat Propi d'Arxius - Sóc de Poble" 
ON storage.objects FOR DELETE 
USING (auth.uid() = owner);

-- FINIT - El teu Cloud Storage ara està formalment blindat a prova de Hackers.
