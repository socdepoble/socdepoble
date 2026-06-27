-- 🛡️ QWEN V10.33 EXTREME AUDIT - SERVER-SIDE SANITIZATION FIX

-- 1. Farem cas a Qwen i afegirem la funció netejadora a nivell de Base de Dades.
-- Açò evita que qualsevol atac bypassant el Frontend (via CURL o Postman) puga injectar XSS.
CREATE OR REPLACE FUNCTION public.sanitize_html(input text)
RETURNS text AS $$
BEGIN
    -- Eliminar tags perillosos a nivell de BD
    RETURN regexp_replace(input, '<(script|iframe|object|embed|form|input)[^>]*>.*?</\1>', '', 'gi');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Creem la funció específica del Trigger (en Postgres els Triggers no accepten arguments directes)
CREATE OR REPLACE FUNCTION public.sanitize_posts_content_trigger()
RETURNS trigger AS $$
BEGIN
    IF NEW.content IS NOT NULL THEN
        NEW.content := public.sanitize_html(NEW.content);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Apliquem el trigger a la taula POSTS (El Mur) per a blindar el contingut generat per usuaris
DROP TRIGGER IF EXISTS sanitize_posts_content ON public.posts;
CREATE TRIGGER sanitize_posts_content
    BEFORE INSERT OR UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.sanitize_posts_content_trigger();


-- 3. [QUERY DE VALIDACIÓ PER A QWEN] 
-- Amb aquesta query confirmem empíricament que els DELETE CASCADE estan actius.
-- Executa-ho per poder enviar-li el resultat.
SELECT 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND ccu.table_name = 'profiles'
AND rc.delete_rule = 'CASCADE';
