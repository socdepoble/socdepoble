-- OMEGA-16 (Interrogatorio Profundo): Sacando a la luz la definición secreta de Entities

SELECT definition 
FROM pg_views 
WHERE viewname = 'entities';
