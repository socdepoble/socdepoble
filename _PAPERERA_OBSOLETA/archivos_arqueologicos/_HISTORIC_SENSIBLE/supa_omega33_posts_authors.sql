-- ==============================================================================
-- OMEGA-33: POSTS AUTHORSHIP & DEDUPLICATION PURGE
-- Creado por Antigravity (IAIA System)
-- Propósito: 
-- 1. Ampliar el CHECK CONSTRAINT de roles para soportar FACETAS de publicación:
--    Personal, Privada, Freelance, Empresa, Grupo, Estudiante, etc. (Incluyendo 'gent')
-- 2. Identificar el verdadero autor buscando "[Llegir original]" en el contenido.
-- 3. Eliminar posts duplicados priorizando explícitamente la versión de WordPress.
-- 4. Erradicar posts con campos NULL o vacíos.
-- ==============================================================================

BEGIN;

--------------------------------------------------------------------------------
-- 0. EXPANSIÓN DE FACETAS LEGALES (MULTI-PROFILE SCOPE)
--------------------------------------------------------------------------------
-- Liberamos las restricciones antiguas para permitir la separación real en facetas:
-- El usuario podrá publicar en su muro Personal, su muro Privado, su muro de Autónomo,
-- o en el de Empresa/Grupo. *Añadido también el rol histórico 'gent' que estaba bloqueando la tabla*.
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_role_check;
ALTER TABLE public.posts ADD CONSTRAINT posts_author_role_check 
CHECK (author_role IN (
    'admin', 'official', 'ambassador', 'citizen', 'user', 'vei', 'gent', 'freelance', 
    'business', 'company', 'group', 'institution', 'student', 'system', 
    'autonomous', 'community', 'private', 'personal'
));

--------------------------------------------------------------------------------
-- 1. PURGA DE NULOS Y BASURA VACÍA (ANTI-HUECOS)
--------------------------------------------------------------------------------
DELETE FROM public.posts 
WHERE content IS NULL OR trim(content) = '';

UPDATE public.posts SET image_url = '/assets/brand/default_socdepoble.webp' 
WHERE image_url IS NULL OR trim(image_url) = '';

--------------------------------------------------------------------------------
-- 2. RESOLUCIÓN DE AUTORES BASADA EN URL ORIGINAL
--------------------------------------------------------------------------------
-- A) El Rentonar (Blogger o Categoría WordPress) -> Faceta de Grupo
UPDATE public.posts p
SET 
    author = 'El Rentonar',
    author_role = 'community',
    author_type = 'entity',
    author_entity_id = (SELECT id FROM public.entities WHERE name ILIKE '%Rentonar%' LIMIT 1)
WHERE content ILIKE '%[Llegir original]%rentonar.blogspot%' 
   OR content ILIKE '%[Llegir original]%socdepoble.net/category/el-rentonar%';

-- B) Javi Llinares (Sóc de Poble General) -> Faceta Personal / Autónomo
UPDATE public.posts p
SET 
    author = 'Javi Llinares',
    author_role = 'freelance',
    author_type = 'user',
    author_user_id = '25218ea4-5d7d-4db4-bdc5-7ae035629242' -- Tu UUID como administrador
WHERE content ILIKE '%[Llegir original]%socdepoble.net%'
  AND content NOT ILIKE '%category/el-rentonar%';

--------------------------------------------------------------------------------
-- 3. PURGA DE DUPLICADOS (PRIORIDAD: SÓC DE POBLE WP)
--------------------------------------------------------------------------------
-- Detectamos duplicidades basándonos en los primeros 40 caracteres del contenido.
-- Si hay duplicados, conservamos el post que NO venga de blogger.
DELETE FROM public.posts
WHERE id IN (
  SELECT p2.id
  FROM public.posts p1
  JOIN public.posts p2 ON 
       LEFT(p1.content, 40) = LEFT(p2.content, 40) 
       AND p1.id <> p2.id
  WHERE 
       -- Si p1 es de socdepoble.net y p2 es de rentonar.blogspot, borramos p2
       (p1.content ILIKE '%socdepoble.net%' AND p2.content ILIKE '%rentonar.blogspot%')
       -- O si ambos son iguales (mismo origen), borramos el de mayor ID para dejar solo 1
       OR (p1.id < p2.id AND p1.content ILIKE '%rentonar.blogspot%' AND p2.content ILIKE '%rentonar.blogspot%')
);

--------------------------------------------------------------------------------
-- 4. VALIDACIÓN DE CAMPOS HUÉRFANOS RESTANTES (FALSOS AUTORES)
--------------------------------------------------------------------------------
-- Si queda algún post importado que no ha sido tocado por los pasos anteriores,
-- reasignamos a tu faceta principal.
UPDATE public.posts
SET 
    author = 'Javi Llinares',
    author_role = 'personal',
    author_type = 'user',
    author_user_id = '25218ea4-5d7d-4db4-bdc5-7ae035629242'
WHERE author IN ('Trànsit', 'Natura', 'Música', 'Cultura', 'Festers', 'Joventut', 'Gent Gran', 'Esports', 'Educació')
  AND content ILIKE '%[Llegir original]%';

COMMIT;
