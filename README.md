# Sóc de Poble

Projecte actual: `socdepoble.org`.

Referència antiga, només lectura: `socdepoble`.

Rebuild net del projecte amb una base més simple i mantenible.

## Estructura

- `src/config/`: configuració global i helpers compartits.
- `src/sections/`: cada secció té el seu component, el seu `*Content.js` i, si cal, el seu `*Seed.js`.
- `src/data/`: capa de backend, agregació i persistència.
- `src/components/`: peces reutilitzables de UI.
- `src/styles/`: estils globals.

## Arrencar

```bash
pnpm install
pnpm dev
```

## Base de dades

El projecte està preparat per a usar Supabase com a BD remota.

## Documentació

Si vols entendre com està repartit el projecte i on tocar cada cosa, mira:

- [docs/DOCUMENTACIO_PROJECTE.md](docs/DOCUMENTACIO_PROJECTE.md)
- [docs/DOCUMENTACIO_BASE_DE_DADES.md](docs/DOCUMENTACIO_BASE_DE_DADES.md)
- [docs/GUIA_RAPIDA.md](docs/GUIA_RAPIDA.md)
- [INSTRUCCIONS_SUPABASE.md](INSTRUCCIONS_SUPABASE.md)
- [agents/AGENTS.md](agents/AGENTS.md)

## Modes de dades

L'app admet `VITE_DATA_MODE` per a poder provar sense trencar la web:

- `auto`
  Mode per defecte. Si hi ha Supabase configurat, intenta BD i, si falla, cau al fallback local. Si no hi ha Supabase, cau al seed local.

- `supabase`
  Força la lectura des de BD. El xat també intenta guardar-se en la BD.

- `hybrid`
  Intenta BD i, si falla, cau al snapshot local o al seed.

- `seed`
  Mostra dades del codi. Va bé per a demos o proves ràpides.

- `local`
  Carrega un snapshot complet de `localStorage` i el usa com a backend local de prova.

Passos mínims:

1. Crear un projecte a Supabase.
2. Executar [supabase/schema.sql](supabase/schema.sql).
3. Executar [supabase/seed.sql](supabase/seed.sql).
4. Crear un `.env` basat en [.env.example](.env.example).
5. Arrancar el projecte.

Exemple de `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DATA_MODE=auto
```

Si vols regenerar el SQL de dades seed a partir del contingut actual:

```bash
pnpm db:seed:generate
```
