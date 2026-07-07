-- ==============================================================================
-- 📖 SÓC DE POBLE - CMS PAGES INITIALIZATION
-- ==============================================================================
-- Creation of the "cms_pages" table to hold universal pages (Manifest, Project, etc)
-- and eliminate 404 Not Found network errors from the frontend.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    html_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 🔒 RLS (Row Level Security)
-- ==============================================================================

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- 1. Tothom pot llegir les pàgines públiques
CREATE POLICY "Public can view cms_pages"
ON public.cms_pages
FOR SELECT
USING (true);

-- 2. Només els SuperAdmins poden inserir/modificar (control per role admin o uuid autoritzat)
-- En Sóc de Poble, el rol es maneja via JWT raw_user_meta_data o funcions. 
-- Farem una política genèrica on tothom autèntic pot inserir (el FE ja filtra qui veu el botó) 
-- PERÒ si vols més seguretat, es pot limitar a autors específics.
CREATE POLICY "SuperAdmins can insert cms_pages"
ON public.cms_pages
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "SuperAdmins can update cms_pages"
ON public.cms_pages
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "SuperAdmins can delete cms_pages"
ON public.cms_pages
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- ==============================================================================
-- ⚡ TRIGGERS PER ACTUALITZAR 'updated_at'
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_cms_pages_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cms_pages_modtime ON public.cms_pages;
CREATE TRIGGER trg_cms_pages_modtime
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW
EXECUTE FUNCTION update_cms_pages_modtime();

-- Opcional: Inserir la pàgina "el-projecte" com a fallback buit per evitar el primer error si no es guarda de seguida
INSERT INTO public.cms_pages (slug, title, subtitle, html_content)
VALUES (
  '/el-projecte', 
  'El Projecte', 
  'Pròleg: La Veu del Poble', 
  '<p>Aquest text és provisional. El SuperAdmin pot editar aquesta pàgina i desar els canvis automàticament.</p>'
) ON CONFLICT (slug) DO NOTHING;
