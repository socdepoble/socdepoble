-- ==============================================================================
-- OMEGA-36: NORMALIZACIÓN ABSOLUTA DE IDENTIDADES ORGÁNICAS Y VIRTUALES
-- ==============================================================================
-- Este script destruye la presencia de "categorías" actuando como "autores"
-- (ej: Cultura, Festers, Transports, Lloratge) y los reasigna masivamente
-- a 'Sóc de Poble' o 'El Rentonar' dependiendo de su afiliación.
-- Respeta escrupulosamente a Javi Llinares, El Rentonar, Sóc de Poble y las Iaias.
-- ==============================================================================

UPDATE posts
SET 
  -- Si el contenido tiene link de Rentonar, es Rentonar. De lo contrario, por descarte es Sóc de Poble.
  author = CASE 
    WHEN content ILIKE '%rentonar.blogspot%' THEN 'El Rentonar'
    ELSE 'Sóc de Poble'
  END,
  
  -- Sóc de Poble es 'company' (proyecto oficial). El Rentonar es 'group' o 'community'.
  author_role = CASE 
    WHEN content ILIKE '%rentonar.blogspot%' THEN 'community'
    ELSE 'company'
  END,
  
  -- Ambos son Entidades (no usuarios físicos)
  author_type = 'entity'

WHERE author NOT IN (
    -- 🛡️ WHITELIST SOBERANA (No tocar a estos autores nunca)
    'Javi Llinares',
    'Sóc de Poble',
    'El Rentonar',
    'IAIA MarIA',
    'Tia Maria',
    'Papies la de la Vall',
    'El Cronista',
    'El Sereno',
    'Ajuntament',
    'Simulació Ajuntament La Torre'
);
