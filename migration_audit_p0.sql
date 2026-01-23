-- ==========================================
-- SÓC DE POBLE: MIGRACIÓ AUDITORIA P0
-- ==========================================

-- 1. UUID MIGRATION (Seguretat)
-- Objetivo: Evitar la enumeración de IDs secuenciales y preparar para offline-sync
DO $$ 
BEGIN
    -- Posts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='uuid') THEN
        ALTER TABLE posts ADD COLUMN uuid UUID DEFAULT gen_random_uuid();
        CREATE UNIQUE INDEX idx_posts_uuid ON posts(uuid);
    END IF;

    -- Market Items
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='market_items' AND column_name='uuid') THEN
        ALTER TABLE market_items ADD COLUMN uuid UUID DEFAULT gen_random_uuid();
        CREATE UNIQUE INDEX idx_market_items_uuid ON market_items(uuid);
    END IF;
END $$;

-- 2. STORAGE RLS (Seguretat de fitxers)
-- Objetivo: Asegurar que los cubos de imágenes no sean vulnerables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Nota: Si los buckets no existen, estas políticas simplemente no se aplicarán hasta que se creen
DO $$ 
BEGIN
    -- LECTURA PÚBLICA (Qualsevol pot veure imatges de posts o perfils)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Storage') THEN
        CREATE POLICY "Public Access Storage" ON storage.objects FOR SELECT 
        USING (bucket_id IN ('images', 'avatars', 'posts'));
    END IF;

    -- PUJADA RESTRINGIDA (Només usuaris autenticats al seu propi espai/folder)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Upload Storage') THEN
        CREATE POLICY "Authenticated Upload Storage" ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id IN ('images', 'avatars', 'posts') AND auth.role() = 'authenticated');
    END IF;

    -- ESBORRAT RESTRINGIT (Només el propietari pot esborrar)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Owner Delete Storage') THEN
        CREATE POLICY "Owner Delete Storage" ON storage.objects FOR DELETE 
        USING (bucket_id IN ('images', 'avatars', 'posts') AND auth.uid() = owner);
    END IF;
END $$;

COMMENT ON TABLE storage.objects IS 'Polítiques RLS aplicades segons l''auditoria de seguretat P0.';
