-- ==============================================================================
-- OMEGA-37: SINCRONIZACIÓN DE FOREIGN KEYS PARA ENTIDADES
-- ==============================================================================
-- Este script soluciona el problema de los NULLs en author_entity_id.
-- Lee dinámicamente el UUID de la tabla 'entities' (Sóc de Poble, El Rentonar, etc.)
-- y lo inyecta en los posts correspondientes para restablecer el puente relacional.
-- ==============================================================================

UPDATE posts
SET author_entity_id = e.id
FROM entities e
WHERE posts.author = e.name
  AND posts.author_type = 'entity'
  AND posts.author_entity_id IS NULL;
