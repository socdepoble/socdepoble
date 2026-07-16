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
pnpm install --frozen-lockfile
pnpm dev
```

La instal·lació només genera derivats ignorats i reproduïbles; no ha de canviar
`package.json`, `pnpm-lock.yaml` ni l'índex Git. Els scripts de lifecycle o una
instal·lació que faça efectes externs queden bloquejats pel protocol.

## Base de dades

El projecte està preparat per a usar Supabase com a BD remota.

## Documentació

Si vols entendre com està repartit el projecte i on tocar cada cosa, mira:

- [Documentació del projecte](docs/s6a/DOCUMENTACIO_PROJECTE.md)
- [Documentació de la base de dades](docs/s6a/DOCUMENTACIO_BASE_DE_DADES.md)
- [Exemples d'organització](docs/s6a/DOCUMENTACIO_EXEMPLES.md)
- [Instruccions de Supabase](docs/s6a/INSTRUCCIONS_SUPABASE.md)
- [Regles dels agents](.agents/AGENTS.md)

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

Regenerar el SQL de dades seed és una mutació governada. Necessita una sessió
Reflex segellada que declare l'operació `supabase-seed`, incloga
`supabase/seed.sql` dins del seu scope i aporte el rebut vigent:

```bash
pnpm run db:seed:generate -- --receipt=.sdp-reflex/sessions/<session-id>.json
```

El generador valida el rebut abans de crear cap temporal i publica
`supabase/seed.sql` de manera atòmica; si la validació o l'escriptura fallen,
no deixa un seed parcial visible.

## Integritat de la Wiki

La definició local de CI de `.github/workflows/wiki-integrity.yml` comprova els tests, l'auditoria estricta, les recaigudes de Robotomia, la prevalidació i `doctor --ci` contra la baseline segellada. Només quedarà activa en GitHub després de versionar-la i publicar-la; protegir la branca principal continua sent una decisió de governança separada.

Un clon nou activa de forma idempotent l'estat privat i els hooks amb
`pnpm run reflex:init`; després es diagnostica amb `pnpm run reflex:doctor`.
`doctor` ha de continuar roig si les
regles, scripts, cinc hooks o workflow encara no estan seguits per Git: existir
al disc no equival a una protecció durable.
