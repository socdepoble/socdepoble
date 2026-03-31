-- AÑADIR CONTROL DE ACCESO A CMS_PAGES
ALTER TABLE public.cms_pages 
ADD COLUMN IF NOT EXISTS collaborators uuid[] DEFAULT '{}';

-- CREAR TABLA HISTÓRICA DE VERSIONES (COMO GOOGLE DOCS)
CREATE TABLE IF NOT EXISTS public.cms_page_versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
    html_content text,
    title text,
    subtitle text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- HABILITAR SEGURIDAD (RLS)
ALTER TABLE public.cms_page_versions ENABLE ROW LEVEL SECURITY;

-- PERMITIR LECTURA A CUALQUIERA (para consultar el histórico web, opcional) 
-- En principio lo limitaremos a Autenticados para seguridad.
CREATE POLICY "Enable read access for authenticated users to versions" ON public.cms_page_versions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users to versions" ON public.cms_page_versions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- FUNCIÓN TRIGGER: CREA UN SNAPSHOT CADA VEZ QUE SE GUARDA LA PÁGINA
CREATE OR REPLACE FUNCTION public.log_cms_page_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo inserta si hay cambios reales en el contenido HTML o el título
    IF (TG_OP = 'INSERT') OR 
       (NEW.html_content IS DISTINCT FROM OLD.html_content) OR 
       (NEW.title IS DISTINCT FROM OLD.title) OR 
       (NEW.subtitle IS DISTINCT FROM OLD.subtitle) THEN
       
       INSERT INTO public.cms_page_versions (page_id, html_content, title, subtitle, author_id)
       VALUES (NEW.id, NEW.html_content, NEW.title, NEW.subtitle, auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER ASOCIADO A CMS_PAGES
DROP TRIGGER IF EXISTS trigger_log_cms_page_version ON public.cms_pages;
CREATE TRIGGER trigger_log_cms_page_version
    AFTER INSERT OR UPDATE ON public.cms_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.log_cms_page_version();
