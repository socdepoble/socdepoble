> 📂 **Arxiu/Ruta:** `./docs/LM/historico/AUDITORIA_PARA_GPT.md`

# 🤖 Auditoria de Seguretat i Arquitectura per a GPT-4

Aquest document ha estat preparat específicament per a una revisió externa per part de GPT-4. Reflecteix l'estat del sistema després de les dues primeres fases d'enduriment (incloent la migració a UUID i el reforç de RLS per a identitats delegades).

---

## 📝 PROMPT PER A GPT-4

**Rol:** Arquitecte de Seguretat Cloud i Expert en PostgreSQL/Supabase.
**Missió:** Realitzar una auditoria de "guante blancas" (Phase 3) sobre el sistema social hiper-local "Sóc de Poble".

### 1. Context del Projecte
Plataforma social per a comunitats rurals. Frontend en React/Vite, Backend en Supabase (Auth, DB, RLS). Els usuaris poden publicar com a persones físiques o com a "Entitats" (Ajuntaments, Comerços, Grups).

### 2. Estat Actual de la Base de Dades (Esquema Crític)

```sql
-- Taula de Posts amb Multi-Identitat
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_user_id UUID REFERENCES auth.users(id), -- L'usuari "real"
    author_entity_id UUID REFERENCES entities(id), -- Entitat opcional
    author_role TEXT CHECK (author_role IN ('gent', 'grup', 'empresa', 'oficial')),
    content TEXT,
    town_id INTEGER REFERENCES towns(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Taula de Membres d'Entitats (Gestió de permisos)
CREATE TABLE entity_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id),
    user_id UUID REFERENCES profiles(id),
    role TEXT CHECK (role IN ('admin', 'editor')),
    UNIQUE(entity_id, user_id)
);

-- RLS REFORÇAT (Fix Fase 2)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert posts" ON posts 
    FOR INSERT WITH CHECK (
        auth.uid() = author_user_id 
        AND (
            author_entity_id IS NULL 
            OR EXISTS (
                SELECT 1 FROM entity_members 
                WHERE entity_id = author_entity_id 
                AND user_id = auth.uid()
            )
        )
    );
```

### 3. Objectius de l'Auditoria (Fase 3)

Sisplau, analitza els següents punts amb màxima ricsa:

1.  **Vulnerabilitats RLS de "Side-Channel"**: Hi ha alguna manera de deduir si un usuari és membre d'una entitat privada (si n'hi hagués) a través del temps de resposta de la subquery `EXISTS` a `entity_members`?
2.  **Seguretat de les "Entitats Oficials"**: El rol 'oficial' s'assigna per frontend. Com podem evitar que un membre d'una 'empresa' inserti un post amb `author_role = 'oficial'` si les polítiques RLS actuals només miren la membresia i no el `type` de la `entity`?
3.  **Enumeració d'IDs**: Encara fem servir `SERIAL` per a `posts` i `towns`. És una vulnerabilitat acceptable en una app social o hauriem de saltar a `UUID` per a tot el que sigui públic?
4.  **Escalabilitat de Polítiques**: La subquery `EXISTS` en la política `INSERT` s'executarà per a cada fila. Amb 100.000 posts, això afectarà el rendiment del `COPY` o `INSERT` massiu? Hi ha una alternativa millor (com `security definer functions` o `claims` de JWT)?
5.  **RLS en Storage**: Encara no hem definit el bucket. Quina política RLS proposaries per a un bucket d'imatges on:
    *   Tothom llegeix les fotos dels posts.
    *   Només els autors (o membres de l'entitat autora) poden esborrar/substituir les fotos d'un post.

### 4. Format de Resposta

Necessitem:
1.  **Hallazgos de Seguretat Lògica**: Errors que permetin saltar-se la identitat.
2.  **Proposta de Refacció SQL**: Millores a les polítiques per fer-les més robustes i ràpides.
3.  **Arquitectura de Storage**: Esquema de polítiques per als buckets d'imatges.
4.  **Full de Ruta de Hardening**: Què hauriem d'implementar per ser "Fort Knox".

---
*(Fi del Prompt)*
