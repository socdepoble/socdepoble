> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/FASE_15_PROMPT_CODEX_IMPLEMENTACIO.md`

# 🚀 ORDRE D'EXECUCIÓ MÀXIMA: L'HORA DE LA VERITAT (FASE 11)

**A l'atenció del Mestre Executiu (Codex / Claude):**

Aquest és el moment clau. El nostre equip d'auditoria arquitectònica (format per OpenAI, DeepSeek, Qwen i Groq) ha sotmès el disseny de la **Fase 11 (Offline-First per a Sóc de Poble)** a més de 20 auditories extremes. Després de descartar workers propis i arquitectures suïcides, hem assolit un **Veredicte Històric de 10/10**. 

El camí cap a la "Perfecció Pragmàtica" passa per **no reinventar la roda i abraçar PowerSync Nativament** sobre la nostra base de Supabase.

Ets un dels pilars fonamentals d'aquest equip. Sense la teva precisió escrivint codi, la teoria no serveix de res. Aquesta app donarà veu al món rural, de forma gratuïta, utilitzant telèfons antics (6+ anys) en zones on el 3G és intermitent o inexistent. Comptem amb la teva empatia i la teva genialitat per fer-ho realitat.

---

## 🏗️ EL CONTEXT I LES REGLES D'OR

L'arquitectura aprovada es basa en delegar tota la càrrega a l'arquitectura nativa de PowerSync (evitant duplicitat de *queues* i *race conditions* a la UI).

L'elit de l'auditoria ens ha deixat un **Checklist 11/10** que has de complir rigorosament en el codi que em proposis:

1. **Prevenció Multi-Tab:** Configuració estricta de `multiTabSupport: true` per forçar un únic *SharedWorker* i evitar que múltiples pestanyes destrueixin la base de dades local.
2. **Forçar OPFS (Origin Private File System):** Res d'IndexedDB per defecte. Hem de garantir un rendiment 5x més ràpid generant instruccions per configurar els headers CORS del servidor (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`).
3. **Optimistic Versioning & Backpressure Local:** PowerSync ja ho gestiona, però hem d'afegir un *Error Boundary* a React explícit (`WaitingForBackend`) i fer backup del `last_synced_id` a `localStorage` anti-corrupcions.

---

## 🎯 LA TEVA MISSIÓ (NO ET DEIXIS RES)

Vull que extreguis tota la teva fúria analítica i capacitat de programació. Si veus alguna cosa en aquesta estructura que grinyola, **destrossa-la ara mateix**. Si no, vull el plànol d'execució definitiu.

Proporciona'm un **`implementation_plan.md`** exhaustiu i pas a pas per:

1. **Setup de llibreries i dependències:** Què instal·lem exactament (PowerSync SDK ≥1.9.0, etc.).
2. **Schema & Backend:** Com modifiquem el nostre `connector.js` actual i com gestionem el `powersync_role` a Supabase perquè les migracions no fallin a producció.
3. **Integració a React:** Com substituïm l'estat local per les *LiveQueries* de PowerSync a la nostra App, incloent-hi l'Error Boundary per avisar l'usuari rural si està "Desconnectat".

Fes-ho amb l'excel·lència que et caracteritza. Treballem per a la gent del poble, i cada línia de codi teva farà que la seva veu arribi més lluny. 🌾📱

Comencem?
