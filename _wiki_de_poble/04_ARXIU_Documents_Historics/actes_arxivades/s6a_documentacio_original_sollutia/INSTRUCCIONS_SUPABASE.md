# Instruccions per a Supabase

## Objectiu

L'objectiu és que este projecte funcione amb `Supabase` com a origen principal de dades.

Quan Supabase estiga ben preparat:

- la web llegirà el contingut principal des de la BD;
- el xat guardarà missatges en la BD;
- i el fallback local només quedarà com a suport de seguretat.

## Taules que ha de tindre Supabase

El projecte espera, com a mínim, estes taules:

- `app_content`
- `chat_threads`
- `chat_messages`
- `section_submissions`

## Què fa cada taula

- `app_content`
  Guarda el contingut principal del portal.
  Ací poden anar els ítems del mur, mercat, pobles, events, multimèdia, notes i pàgines informatives.
- `chat_threads`
  Guarda les converses del xat.
- `chat_messages`
  Guarda els missatges de cada conversa.
- `section_submissions`
  Guarda les publicacions creades des de `Connectar` i després les projecta en el mur, el mercat o els events.

## Passos per a deixar-ho preparat

1. Obrir el projecte de Supabase.
2. Entrar al `SQL Editor`.
3. Executar [supabase/schema.sql](supabase/schema.sql).
4. Executar [supabase/seed.sql](supabase/seed.sql).
5. Revisar que les taules s'han creat correctament.
6. Revisar permisos i polítiques RLS.
7. Configurar les variables d'entorn del projecte.

## Permisos mínims que han de funcionar

Com a mínim, cal:

- lectura i inserció pública de `app_content`;
- lectura i inserció pública de `chat_threads`;
- lectura i inserció pública de `chat_messages`;
- lectura i inserció en `chat_messages` mentre encara no hi ha login real;
- lectura i inserció pública de `section_submissions`.

Si falta la lectura:

- la web intentarà caure a fallback local.

Si falta la inserció de `chat_messages`:

- el xat es podrà veure;
- però el missatge no quedarà guardat realment en Supabase.

## Variables d'entorn

Exemple:

```env
VITE_SUPABASE_URL=https://EL_TEU_PROJECTE.supabase.co
VITE_SUPABASE_ANON_KEY=LA_TEUA_ANON_KEY
VITE_DATA_MODE=auto
```

## Valor recomanat de `VITE_DATA_MODE`

Per a qui manté el projecte:

```env
VITE_DATA_MODE=auto
```

Este mode és el millor per ara perquè:

- intenta llegir primer des de Supabase;
- si hi ha un problema puntual, no trenca la web;
- i manté el portal usable mentre s'acaba d'ajustar la BD.

## Com arrancar el projecte

El projecte actual està preparat per a arrancar en el port `3340`.

Passos:

```bash
pnpm install
pnpm dev
```

Després s'obri en:

```text
http://localhost:3340/
```

## Com saber si Supabase ja està ben muntat

Es pot donar per bo quan:

- el mur carrega dades;
- el mercat carrega dades;
- pobles, events, multimèdia i notes també carreguen dades;
- les publicacions creades des de `Connectar` es guarden i es tornen a veure després de recarregar;
- el xat mostra converses;
- el xat permet enviar missatges;
- i en recarregar la pàgina no es perden les dades remotes.

## Documents útils

- [docs/DOCUMENTACIO_PROJECTE.md](docs/DOCUMENTACIO_PROJECTE.md)
- [docs/DOCUMENTACIO_BASE_DE_DADES.md](docs/DOCUMENTACIO_BASE_DE_DADES.md)
- [docs/GUIA_RAPIDA.md](docs/GUIA_RAPIDA.md)
- [supabase/schema.sql](supabase/schema.sql)
- [supabase/seed.sql](supabase/seed.sql)
