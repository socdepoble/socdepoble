> 📂 **Arxiu/Ruta:** `./docs/LM/historico/MENSAJE_PARA_FLASH.md`

# Missatge Inicial per a Gemini Flash

---

## 👋 Context de la situació

Hola Flash! He fet realitzar dues auditories externes del projecte **"Sóc de Poble"** per assegurar-nos que l'arquitectura i la seguretat són sòlides abans de continuar desenvolupant funcionalitats noves.

Les auditories han estat realitzades per:
1. **Claude 3.5 Sonnet (Thinking)** - Especialitzat en seguretat, RLS i vulnerabilitats
2. **Simulació d'arquitectura tipus GPT-4o** - Enfocat en escalabilitat i patrons de disseny

Ambdues coincideixen en els punts crítics i s'han consolidat en documents que trobaràs a la carpeta `docs/`.

---

## 📚 Documents que has de revisar

### 🎯 Document Principal (LLEGIR PRIMER)
**`docs/RECOMENDACIONES_GEMINI_FLASH.md`**

Aquest és el teu full de ruta. Conté:
- **8 seccions** amb vulnerabilitats crítiques detectades
- **Codi SQL/JavaScript complet** llest per executar
- **Roadmap setmanal** dividit en 4 setmanes
- **Priorització per ROI** (Impacte vs Esforç)
- **Checklist pre-producció**

**Acció:** Llegeix-lo sencer i familiaritza't amb la Setmana 1 abans de començar.

---

### 🔒 Document de Referència Tècnica
**`docs/SECURITY_AUDIT_CLAUDE.md`**

Aquest és l'informe tècnic detallat de Claude sobre seguretat. Inclou:
- **12 problemes de seguretat** (3 crítics, 4 alts, 5 mitjans)
- **Anàlisi de riscos** amb proves de concepte
- **Explicacions tècniques** de per què cada vulnerabilitat és perillosa
- **Top 3 recomanacions urgents**

**Acció:** Consulta aquest document quan tingues dubtes sobre **per què** cal implementar alguna solució.

---

### 📋 Document de Context (Opcional)
**`docs/CONTEXTO_AUDITORIA.md`**

Aquest és el context que vaig proporcionar als auditors. Conté:
- Estructura del projecte
- Arxius crítics (`AppContext.jsx`, `supabaseService.js`)
- Esquema de base de dades
- Polítiques RLS actuals

**Acció:** Llegeix-lo si necessites entendre millor l'estat actual del projecte.

---

## 🚀 Per on començar

### Pas 1: Revisar els documents
Llegeix en aquest ordre:
1. `RECOMENDACIONES_GEMINI_FLASH.md` (complet)
2. `SECURITY_AUDIT_CLAUDE.md` (almenys el Resum Executiu i les 3 vulnerabilitats crítiques)

### Pas 2: Executar la Setmana 1 del Roadmap
La **Setmana 1** se centra en **seguretat crítica** i inclou:

#### 🔴 Tasca 1.1: Migrar `user_id` a UUID
- **On:** Taules `post_connections`, `user_tags`, `post_likes`
- **Per què:** Trenca Foreign Keys i és menys eficient
- **Codi SQL:** Secció 1.3 de `RECOMENDACIONES_GEMINI_FLASH.md`

#### 🔴 Tasca 1.2: Afegir `author_user_id` a posts
- **On:** Taules `posts` i `market_items`
- **Per què:** Necessari per policies RLS d'ownership
- **Codi SQL:** Secció 1.1 de `RECOMENDACIONES_GEMINI_FLASH.md`

#### 🔴 Tasca 1.3: Crear policies RLS completes
- **On:** Taules `posts` i `market_items`
- **Per què:** Actualment qualsevol pot modificar/esborrar posts
- **Codi SQL:** Secció 1.1 de `RECOMENDACIONES_GEMINI_FLASH.md`

#### 🔴 Tasca 1.4: Desactivar mode demo en producció
- **On:** `src/context/AppContext.jsx`
- **Per què:** Pot ser explotat per bypasear autenticació
- **Codi JS:** Secció 1.2 de `RECOMENDACIONES_GEMINI_FLASH.md`

#### 🔴 Tasca 1.5: Crear arxiu de constants
- **On:** Nou arxiu `src/constants.js`
- **Per què:** Elimina "magic values" hardcoded
- **Codi JS:** Secció 3.4 de `RECOMENDACIONES_GEMINI_FLASH.md`

#### 🔴 Tasca 1.6: Unificació de l'Identitat (author_type vs author_role)
- **On:** Taules `posts` i `market_items`
- **Per què:** Evitar duplicitat i inconsistències en la font de veritat de l'autor
- **Acció:** Eliminar `author_type` i centralitzar en `author_role` + `author_entity_id`
- **Codi/Instruccions:** Secció 1.4 de `RECOMENDACIONES_GEMINI_FLASH.md`

**Temps estimat:** 3-4 dies

---

### Pas 3: Validar canvis
Després de la Setmana 1:
1. Executa `npm run build` per assegurar que no hi ha errors
2. Prova manualment:
   - Login/Logout
   - Crear un post
   - Modificar el teu propi post
   - Intentar modificar un post d'altre usuari (hauria de fallar)
3. Revisa que el mode demo no es puga activar en producció

---

### Pas 4: Informar del progrés
Quan completis la Setmana 1, informa'm amb:
- ✅ Tasques completades
- 🐛 Problemes trobats
- 📝 Canvis addicionals que has hagut de fer

Llavors revisarem junts i passarem a la **Setmana 2** (Rendiment de consultes).

---

## ⚠️ Avisos importants

1. **Backup abans de tot:** Fes un backup de la base de dades abans de començar les migracions SQL.
2. **Executa en desenvolupament primer:** Prova tots els canvis en local abans de pujar-los a producció.
3. **Commits atòmics:** Fes commits petits i descriptius per poder fer rollback si cal.
4. **Consulta els documents:** Si tens dubtes sobre PER QUÈ cal fer alguna cosa, consulta `SECURITY_AUDIT_CLAUDE.md`.
5. **CONCURRENTLY en índexs:** Usa sempre `CREATE INDEX CONCURRENTLY` per no bloquejar la base de dades.

---

## 🎯 Objectiu final

**Puntuació actual:** 6.5/10  
**Objectiu pre-producció:** 9/10  
**Temps estimat total:** 3-5 setmanes

Al final d'aquest procés, el projecte tindrà:
- ✅ Seguretat RLS completa i robust
- ✅ Rendiment optimitzat (latència feed < 200ms)
- ✅ Arquitectura escalable (suporta 100k DAU)
- ✅ Codi net i mantenible (sense anti-patterns)
- ✅ Observabilitat (errors trackejats, mètriques disponibles)

---

## 💬 Pregunta'm si necessites ajuda

Si tens qualsevol dubte sobre:
- Interpretació d'alguna vulnerabilitat
- Com executar alguna migració SQL
- Trade-offs entre diferents solucions
- Priorització de tasques

**No dubtis a preguntar-me!** Estic aquí per ajudar-te a implementar aquests canvis de la manera més segura i eficient possible.

---

**Endavant, Flash! 🚀**  
*Els auditors externs han fet la seua feina. Ara et toca a tu convertir aquestes recomanacions en realitat.*
