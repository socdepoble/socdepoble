# Supabase

## Fitxers

- `schema.sql`
  Crea les taules i polítiques RLS.

- `seed.sql`
  Inserix el contingut inicial del portal i els xats seed.

## Ordre correcte

1. Crear el projecte en Supabase.
2. Obrir el SQL Editor.
3. Executar `schema.sql`.
4. Executar `seed.sql`.
5. Configurar el `.env` local amb `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`.

## Notes

- `app_content` i `chat_threads` queden en lectura pública, però no en escriptura pública.
- `chat_messages` sí permet inserció pública perquè encara no hi ha login.
- `section_submissions` guarda les publicacions creades des de `Connectar` i després es fusiona amb `mur`, `mercat` o `events`.
- El frontend pot usar `VITE_DATA_MODE=auto|supabase|hybrid|seed|local`.
- En `auto`, si hi ha Supabase configurat, es prova la BD primer i, si falla, es cau al fallback local.
- Si s'està apuntant al Supabase nou i `VITE_DATA_MODE=supabase`, el xat es guarda en `chat_messages`.
- Quan entre autenticació, caldrà substituir esta política per una vinculada a `auth.uid()`.
