# Expedient Sanejament Supabase - "Sóc de Poble"
**Target Auditoria**: Arquitectura i Base de Dades (Fase *Tabula Rasa*)

Benvolgut Qwen, hui hem dut a terme una purga severa a l'arquitectura de "Sóc de Poble", passant la tisora de dalt a baix a relícies estructurals, dependències inerts i columnes disfuncionals que amenaçaven l'estabilitat i la puresa del codi i del registre d'usuaris. Sol·licite la teua "Súper Auditoria" sobre els canvis realitzats per detectar possibles asimetries, mancances de lligam o suggerir optimitzacions futures.

Llista de canvis executats i consolidats a Supabase:

## 1. Purga de Fòssils i Ghost Tables
S'han ELIMINAT completament de la base de dades les taules següents:
- `post_likes` (S'ha preferit refactoritzar els likes sense aquesta taula fantasma temporal).
- `legacy_chats`
- `legacy_messages`

## 2. Puresa d'Identitat (Taula Posts i Market)
Abans hi havia dependència letal de "Noms" en text pur acompanyant les uuid.
- **`posts`**: Hem eliminat la columna de text `author`. Ara l'autoria del post recau estrictament sota la Foreign Key d'UUID (`author_id`).
- **`market_items`**: Hem eliminat la columna `seller`. Igualment, depèn 100% per defecte de vincles relacionals estandarditzats cap a Entitats/Profiles.
- **Frontend actualitzat**: `marketService.js` i els Validables `Zod` (`schemas.js`) han perdut qualsevol rastre del camp "seller" i inserten netament l'ítem. Ja no patim l'Error `42703`.

## 3. Internacionalització de Market Categories
La taula `market_categories` usava la columna `name_en` com a calaix desastre per amagar els noms d'Icones React (ex: `ShoppingBag`, `LayoutGrid`).
- Hem creat la columna independent `icon` de tipus TEXT.
- Hem restablert tots els noms als 5 idiomes purs: `name_va`, `name_es`, `name_en`, `name_gl`, `name_eu` de manera impecable a cada ID.

## 4. Resurrecció de l'IAIA
S'ha creat un script `07_RESURRECT_AGENTS.sql` massiu que ha injectat els 24 UUIDs pre-definits de la *IAIA* i Ambaixadors a la taula `profiles` com a entitats oficials (`role: 'official'`). Adéu als Errors `23503` per falta d'Agent.

## Preguntes a Qwen:
1. Vista l'eliminació total de columnes textuals (`author`, `seller`) a favor de UUIDs purs, considera Segura I Escalable esta aproximació O hi veu algun avís a futur a l'hora d'indexar/recuperar per pantalla lentament (Left Joins vs Views)?
2. Aturat a analitzar este redisseny, l'impacte en `task.md` obliga ara a "Sanejar Entitats" (on `owner_id` i `town_uuid` seran decisius). Cap recomanació d'estratègia general allí abans d'atacar-les demà?

Qwen, confie en els teus ulls de falcó. Dóna'm l'aprovat roig o trau la bandera de la discòrdia si cal! 🚀🍊
