> 📂 **Arxiu/Ruta:** `./docs/LM/historico/AUDIT_PERSPECTIVES.md`

# 🔍 Audit de Perspectives: Sóc de Poble
**Projecte:** Sóc de Poble (Hiper-local Social Ecosystem)
**Data:** 22 de Gener, 2026
**Estat de l'Auditoria:** Fase 4 (Consolidació de Seguretat i Arquitectura)

---

## 🤖 Perspectiva A: GPT-4 (L'Auditor Tècnic)
*Enfocament: Seguretat Lògica, Rendiment SQL i Escabilitat.*

### 1. Fortaleses de Seguretat (Post-Fase 2)
- **Migració a UUID**: S'ha realitzat un treball excel·lent eliminant els IDs de text per a usuaris, la qual cosa permet una integritat referencial real amb `auth.users`.
- **Validació d'Identitat Delegada**: Les polítiques RLS en `posts` i `market_items` ara validen correctament la membresia a `entity_members`. Això tanca el risc de suplantació d'entitats.
- **Coherència de Rols**: El check de `author_role` vs `entity.type` (oficial vs comercial) és una capa addicional de seguretat lògica molt necessària.

### 2. Riscos Crítics Detectats
- **❗ Enumeració d'IDs (IDOR)**: Les taules `posts` i `market_items` encara usen `SERIAL` per al seu ID primari. Un atacant pot calcular exactament el volum de l'app i fer web-scraping seqüencial fàcilment.
- **❗ Storage sense RLS**: No s'han definit polítiques RLS per als buckets de `supabase storage`. Si s'habilita la pujada d'imatges sense RLS, el sistema és vulnerable a DoS per ompliment d'emmagatzematge.
- **⚠️ Bloat en Polítiques RLS**: La política d'inserció de `posts` té 3 subqueries `EXISTS`. Amb una càrrega massiva de dades, això pot penalitzar el rendiment de l'escriptura. Es recomana migrar a `security definer functions` que cachejen els permisos en la sessió.

### 3. Recomanacions de Rendiment
- **Search Optimization**: El `searchAllTowns` actual usa `ilike %query%`. Per a una cerca robusta a mesura que creix el nombre de pobles, cal implementar un índex GIN amb `to_tsvector`.
- **Naming Inconsistency**: He detectat l'ús barrejat de `post_id` i `post_uuid`. Això és tècnicament perillós i pot portar a `null pointer exceptions` en el frontend si no se sincronitzen les migracions.

---

## 🎨 Perspectiva B: Claude 3.5 Sonnet (L'Arquitecte Visionari)
*Enfocament: DX (Developer Experience), UX, Coherència Narrativa i Qualitat de Codi.*

### 1. Qualitat del Codi i DX
- **`AppContext` Monolític**: El context actual s'està convertint en una "God Class". Gestiona des del `theme` fins a l'autenticació i el `loading` global. Això provoca re-renders innecessaris en tota l'app quan es canvia el llenguatge, per exemple. 
    *   *Suggeriment*: Dividir en `AuthContext`, `UIContext` i `TownContext`.
- **Simulació d'IA (NPCs)**: La implementació d'una resposta simulada en el service és brillant per al "vibe" del producte, però hauria d'estar desconnectada de la lògica de base de dades per evitar "side-effects" en els tests.

### 2. UX i Sentit de Comunitat
- **Llenguatge i Localisme**: L'ús del lèxic propi i la simulació de veïns realistes és la proposta de valor més forta. Tècnicament, la implementació d'i18n és correcta, però cal vigilar els "hardcoded strings" en components nous.
- **Loading Experience**: L'estat `loading` és binari (tot o res). Per a una app social, es recomana l'ús de `Skeletons` en el feed per millorar la percepció de velocitat (Perceived Performance).

### 3. Deute Tècnic
- **Constants**: Molts rols (`'vei'`, `'gov'`, `'oficial'`) estan com a strings literals en múltiples fitxers. Una refacció cap a un objecte `CONSTANTS.ROLES` és urgent per evitar errors tipogràfics difícils de depurar.

---

## 🗺️ Full de Ruta Unificat (Next Sprint)

| Prioritat | Tasca | Responsable |
| :--- | :--- | :--- |
| **P0** | Migrar `posts.id` i `market_items.id` a **UUID**. | GPT-4 |
| **P0** | Implementar RLS en **Supabase Storage**. | GPT-4 |
| **P1** | Refactoritzar `AppContext` en contexts especialitzats. | Claude |
| **P1** | Substituir strings literals per **Constants unificades**. | Claude |
| **P2** | Implementar **Cursor-based Pagination** en el feed. | GPT-4 |

---

### Conclusió de l'Auditoria
El projecte ha assolit una maduresa tècnica de **8.5/10** en seguretat de dades després de la Fase 2. El següent pas no és només "arreglar o tancar forats", sinó preparar l'estructura per a una escalabilitat horitzontal (múltiples pobles i milers d'entitats) i millorar l'agilitat del desenvolupament (DX).
