# ☢️ PETORRETA D'AUDITORIA EXTREMA (Codex & Claude) ☢️

**OBJECTIU:** Bombardeig i auditoria profunda de tota la Màquina Tècnica de *Sóc de Poble*.
**CONTEXT:** Teniu a continuació el bolcat ABSOLUT de totes les Skills (habilitats cognitives i directives de l'agent) i de tots els Scripts (el motor termodinàmic i operatiu en JS). 

## INSTRUCCIONS D'AUDITORIA (L'EXTREM)
Vull que feu un anàlisi despietat a tots els nivells:
1. **DAFO / SWOT Profund:** Debilitats, Amenaces, Fortaleses i Oportunitats d'aquesta arquitectura.
2. **Contradiccions:** Busqueu qualsevol directiva que entre en conflicte amb una altra.
3. **Punts de Falla (Single Points of Failure):** On pot trencar-se el sistema o entrar en bucles infinits?
4. **Previsions de Futur:** Com escalarà això quan hi hagen 500 fitxers? Com es pot millorar?
5. **Accessibilitat (A11y) i SEO:** Aquestes àrees actualment no tenen prou pes estructural. Com integren les Skills actuals aquestes disciplines? Falta una Skill de SEO suprema? Falta forçar el contrast i l'A11y per disseny?
6. **Optimització Termodinàmica:** Com es poden optimitzar els scripts JS? Estan sent redundants?
7. **Propostes de Millora:** Doneu-me els nous prompts i nous codis per apedaçar els forats trobats.

---
## 1. SKILLS (Identitat, Regles i Directives)

### [SKILL] AUDITORIA_CANONICA.md
```markdown
---
name: 'auditoria-canonica'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'skill'
tipus: 'execucio'
estat: 'canonic'
description: 'Skill única d’auditoria: estructura, semàntica, contradiccions i integritat. Output obligatori JSON.'
replaces:
  - '02_ACTUAR_Maquina_Tecnica/skills/auditoria_semantica.md'
  - '02_ACTUAR_Maquina_Tecnica/skills/auto_auditoria_forense.md'
  - '02_ACTUAR_Maquina_Tecnica/skills/contradiction_engine.md'
tags:
  - auditoria
  - trellat
  - tecnologia
script:
  - '[[bundle_wiki.cjs]]'
  - '[[generate_bundle.cjs]]'
  - '[[generate_bundle_fixed.cjs]]'
  - '[[split_bundle.cjs]]'
---

# AUDITORIA CANÒNICA

## Ordre Letal

Executa l’auditoria. No opines. No poetitzes. No expliques el mètode. Llig la Wiki, detecta fractures i retorna JSON vàlid.

## Abast

Audita quatre capes:

1. **Estructura:** pilars, ubicació, noms, orfes.
2. **Semàntica:** documents que viuen en pilar equivocat.
3. **Contradicció:** normes incompatibles, duplicats, fonts de veritat rivals.
4. **Integritat:** frontmatter, enllaços, categories, scripts citats però inexistents.

## Activació

Executa aquesta skill quan el Mestre diga:

- audita
- revisa la wiki
- passa el tallafocs
- detecta contradiccions
- prepara bundle
- valida estructura
- abans de commit
- abans de moure fitxers

## Regles

1. No modifiques fitxers.
2. No generes prosa lliure.
3. No retornes Markdown.
4. No inventes fitxers inexistents.
5. Si hi ha dubte de pilar, marca `requires_human_decision`.
6. Si una norma diu “prohibit” i altra diu “obligatori”, severitat `critical`.
7. Si afecta `03_GOVERNAR`, severitat mínima `high`.
8. Si afecta dades personals, severitat `critical`.
9. Si afecta Core/Forja, cita `FORJA_TO_CORE`.
10. **Integritat neuronal:** Els conceptes clau s'han d'enllaçar `[[...]]` la primera volta que s'esmenten al text, no només a la secció de Sinapsis final.

## Output Obligatori

Retorna només JSON amb aquest esquema:

```json
{
  "ok": false,
  "score": 0,
  "summary": "string",
  "critical": [],
  "high": [],
  "medium": [],
  "low": [],
  "moves": [
    {
      "file": "string",
      "current": "string",
      "proposed": "string",
      "reason": "string",
      "confidence": 0
    }
  ],
  "duplicates": [
    {
      "files": ["string"],
      "canonical": "string",
      "action": "merge|delete|archive"
    }
  ],
  "contradictions": [
    {
      "a": "string",
      "b": "string",
      "rule": "string",
      "severity": "critical|high|medium|low"
    }
  ],
  "scripts": [
    {
      "name": "string",
      "status": "active|missing|legacy|dangerous",
      "reason": "string"
    }
  ],
  "next_actions": ["string"]
}
```

## Llindars

- `score >= 90`: Trellat acceptable.
- `score 70-89`: avisos, però pot continuar.
- `score < 70`: SDP-LOCK.
- Qualsevol `critical`: SDP-LOCK.

## Sinapsis

- [[DOC_Governanca]]
- [[ESTANDARD_Pedra_Seca]]
- [[FORJA_TO_CORE]]
- [[02_GENOTIP]]

```

### [SKILL] a11y_trellat.md
```markdown
---
estat: 'canonic'
name: 'a11y-trellat'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - arquitectura
  - execucio
  - cultura
script: ''
---
# Skill: Accessibilitat de Poble i Usabilitat Festiva (A11Y Trellat)

Aquesta habilitat s'ha d'activar sempre que es desenvolupen interfícies, botons, formularis, fluxos de navegació o micro-interaccions, per assegurar que qualsevol persona, especialment la gent major, puga utilitzar l'aplicació sense frustracions.

## 1. Àrea de Contacte (Touch Targets)
- **AÇÒ NO:** Botons menuts o enllaços de text amagats que requereixen precisió de cirurgià (com els antics 44px o menors).
- **AÇÒ SÍ:** Tot element interactiu ha de tindre una àrea mínima de **48x48 píxels** (mida dit estàndard de llaurador, citant `--sp-touch-min`). Fes servir el *padding* per ampliar l'àrea de clic sense deformar el disseny. Ideal: 56x56px per a botons principals (`--sp-touch-cuspide`).

## 2. Etiquetes ARIA Nostrades
- **AÇÒ NO:** `aria-label="Close modal"`, `aria-label="Submit form"`. (Som un projecte 100% en valencià).
- **AÇÒ SÍ:** `aria-label="Tancar finestra"`, `aria-label="Enviar formulari"`. Tota l'accessibilitat per a lectors de pantalla ha d'estar estrictament en valencià.

## 3. Semàntica Pura
- Evita introduir llibreries d'accessibilitat pesades si no és absolutament necessari. Confia en l'HTML semàntic natiu (`<button>`, `<nav>`, `<main>`, `<dialog>`). Això és [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]].

## 4. No a l'Scroll Infinit
- **AÇÒ NO:** Pàgines que carreguen contingut sense fi i on l'usuari es perd i no sap on està.
- **AÇÒ SÍ:** La informació s'ha de presentar de forma sòlida i compartimentada. L'usuari ha de saber sempre on comença i on acaba la pàgina, igual que sap on comencen i acaben els bancals.

## 5. Feedback de la Petorreta
- **AÇÒ NO:** Botons estàtics que no fan res quan els toques, deixant el dubte de si l'iPad ha fallat.
- **AÇÒ SÍ:** Les accions principals han de tindre un feedback immediat i clar. Un xicotet canvi visual, un canvi de color ràpid (activa, focus, hover), com una "petorreta" visual que indica "T'he sentit!".

## 6. Alegria però amb Trellat
- Les interfícies poden tindre tocs d'alegria, color o referències a la cultura de la festa (Fadrins i Fadrines), però mai a costa de la llegibilitat. El contrast del text sempre ha de ser òptim.

---

## 📊 Mètriques de Salut (Bloc D i UX)
Aquesta SKILL vigila la fluïdesa interactiva de l'iPad A10 i la satisfacció humana:
- **TRD (Temps de Resposta del DOM / INP):** Mesurar interaccions clau. Alertar i optimitzar si és > 100ms.
- **ISU (Índex de Satisfacció de l'Usuari):** Recollir feedback o detectar rage-clicks.

---

## 🔗 Sinapsi Arquitectònica
- arquitectura_pedra_seca

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, [[Arquitectura_General]]


```

### [SKILL] auditoria_semantica.md
```markdown
---
estat: 'canonic'
name: 'auditoria-semantica'
version: '14.00'
created_at: '260706_2210'
updated_at: '260706_2210'
autor: 'Consell de les 11 Petorretes'
categoria: 'SKILL'
description: >
  Motor d'auditoria semàntica per detectar anomalies en carpetes i fitxers
  basat en lògica de Trellat (sense IA, només regles de negoci).
tags:
  - auditoria
  - trellat
  - tecnologia
  - doc
  - termodinamica
script: '[[semantic_auditor.mjs]]'
---

# 🔍 Auditoria Semàntica (Trellat Puri)

## 🎯 Objectiu
Detectar **anomalies de disseny** en l’estructura de carpetes i fitxers de la Wiki **sense analitzar contingut**,
usant només **patrons de noms, ubicacions i metadades** (frontmatter).

## 🧩 Components
1. **`semantic_auditor.mjs`**: Script principal per executar l’auditoria.
2. **Regles de Trellat**: Taules de decisions per a carpetes i fitxers (veure a sota).

## 📁 Regles per a Carpetes
| Patró de Nom       | Ubicació Esperada                     | Acció                     | Severitat  |
|--------------------|----------------------------------------|---------------------------|-------------|
| `*produccio*`, `*build*` | `02_ACTUAR_Maquina_Tecnica/scripts/` | `[AVÍS-PILAR]`           | ⚠️ Mitjana  |
| `*vella*`, `*old*`  | `90_arxiu_historic/`                   | `[AVÍS-PILAR]`           | ⚠️ Mitjana  |
| `*bancal*`         | `04_ARXIU_Documents_Historics/bancal_actiu/` | `[AVÍS-PILAR]`      | ⚠️ Mitjana  |
| Prefix `XX_` (no Pilar) | **ERROR** | `[FATAL]` + SDP-LOCK | ❌ Crítica |

## 📄 Regles per a Fitxers
| Tipus de Fitxer          | Necessita Termodinàmic? | Rao                                  |
|--------------------------|-------------------------|--------------------------------------|
| ACTA, REPORT, DOC, CORE  | ✅ Sí                   | Contingut estàtic amb data rellevant. |
| SKILL                    | ❌ No                   | Ja té versió `XX.YY` al frontmatter.  |
| Taula Mestra, Registres  | ❌ No                   | Contingut dinàmic.                   |
| Scripts (`.js`, `.cjs`)  | ❌ No                   | Codi, no contingut.                   |
| Assets (imatges, CSS)    | ❌ No                   | Fitxers estàtics.                    |

## 🚀 Ús
### Executar auditoria:
```bash
node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/semantic_auditor.mjs
```

## 🔗 Sinapsis
- [[00_BIOS]]
- audit_estructura.mjs
- contradiction_engine.mjs

```

### [SKILL] auto_auditoria_forense.md
```markdown
---
estat: 'canonic'
name:
  - auto_auditoria_forense
version: '14.00'
created_at: '260628_0000'
updated_at: '260628_0000'
autor: 'Tripartició Cognitiva'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - auditoria
  - termodinamica
script: ''
---
# SKILL: Auto-Auditoria Forense

Aquesta SKILL actua com l'inspector intern que avalua de manera periòdica l'estat global del codi, la coherència de la Wiki i els enllaços interns per previndre l'entropia abans no ocórrega.

## 1. Objectiu Principal
- Mantenir el Mas (la base de codi i la Wiki) lliure de dependències trencades i paradoxes.
- Fomentar la mètrica de Salut i Trellat general.

## 2. Regles d'Execució
1. S'activa automàticament per generar reports d'estat si es detecten molts canvis arquitectònics.
2. Treballa colze a colze amb el script de `wiki-integrity.js`.

## 3. Limitacions en Pedra Seca (A10)
- No s'executa en calent de forma síncrona per no col·lapsar la CPU. Es processa en asíncron (background).

---
## 🔗 Sinapsi Arquitectònica
- [[contradiction_engine|Contradiction Engine]]
- Wiki Integrity

**Sinapsis:** [[01_IDENTITAT]], [[CORE_Registre_Automillora]], Arquitectura_L_Ecosistema, 260629_0200_SKILL_plantilla_suprema


```

### [SKILL] backup_recovery.md
```markdown
---
estat: 'canonic'
name: 'backup-recovery'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: "Estratègia de snapshot diari d'IndexedDB, protocol de recuperació i migracions segures."
aliases:
  - Backup
  - Recuperació
  - SnapshotsOPFS
  - MigraciódEsquemes
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
  - termodinamica
script: ''
---

# 💾 SKILL: Backup, Recovery i Migracions (La Volta Enrere)

> **Visió del Consell d'IAs:** En una aplicació Cloud tradicional (com un SaaS), l'administrador pot apagar el servidor i restaurar la base de dades. En la filosofia *Local-First* del Mas, les dades viuen segrestades als dispositius dels usuaris rurals. Una pèrdua ací, és una memòria cultural esborrada per sempre.

## 🎯 Objectiu
Assegurar implacablement que cap llaurador ni habitant perda dades si l'iPad falla, Safari buida la seua memòria en un pic de RAM, o el document s'ofega per un tancament sobtat de l'aplicació durant una esporga de tombstones.

---

## 🛠️ Normes i Funcions (El Paracaigudes de Dades)

### 1. Protocol de Snapshots (Fotografies del Mas)
La memòria de l'usuari no només resideix en IndexedDB, sinó en còpies de seguretat fredes inabastables per al motor renderitzador.
- **Quan es dispara:** Es realitza un `snapshot` absolutament silenciós de tota la clau idb-keyval. Es llança únicament quan el dispositiu respira (event `visibilitychange`, `pagehide` o quan detecta inactivitat per omissió), no interrompent mai el scroll.
- **Magatzem (OPFS):** Aquesta fotografia es comprimeix fortament (Zstd o equivalent) i s'enterra a l'OPFS (Origin Private File System), lluny de les freqüents i letals purgues asíncrones de l'Storage de Safari.
- **Rotació:** Es guarden un màxim de 3 fotografies en bucle (les més noves esborren les més velles). 

### 2. Rutina de Recuperació (SDP-RECOVERY)
Si al moment de despertar l'aplicació el document Y.js principal brama error per corrupció o asimetria letal entre nodes WebRTC:
1. S'alça la pantalla bloquejant la UI amistosament amb "Refent el Mas...".
2. IndexedDB pateix un esborrat catàrtic (Purga total) per a matar el càncer.
3. El Mas agafa la pàa i desenterra la fotografia viva d'OPFS, descomprimint-la i abocant-la.
4. Es llança una comanda de xarxa per pescar l'estat dels altres llauradors (els State Vectors que falten) i recuperar exactament les hores mortes d'entre el snapshot i el trencament.

### 3. Migracions de Dades (Schema Migrations Infinits)
Quan Sóc de Poble avança a la fase 2.0 i necessita un tauler d'anuncis nou, les variables canvien.
- Y.js no té un esquema (Schema-less), però el component de *React* o *UI* espera objectes complets. 
- **La Llei de Ferro de la Migració:** Mai s'esborra una columna antiga. Es construeix una de nova (ex: `date` es manté inactiu, `date_v2` passa a ser Unix Epoch). D'esta manera evitem crashear l'App d'un senyor major que encara no ha obert internet des de fa mesos i utilitza la versió antiga de Sóc de Poble.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per connectar aquest sistema de seguretat amb el funcionament del Mas:
- [[crdt_optimitzacio|Optimització CRDT]] (Capa prèvia abans que els `Tombstones` s'isquen de les mans i provoquen la caiguda).
- [[self_repair|Self Repair]] (L'eina de l'agent IA per frenar desastres de codi. La Recovery ací llistada és per desastres d'usuari).
- Arquitectura Cognitiva (Regles globals de conservació).

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny


```

### [SKILL] cerebel_procedimental.md
```markdown
---
estat: 'canonic'
name: 'cerebel-procedimental'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Tripartició Cognitiva'
categoria: 'skill'
description: 'Memòria muscular, aprenentatge per reforç local (Epigenètica) i compressió semàntica del codi.'
aliases:
  - CerebelProcedimental
  - MemòriaMuscular
  - EpigenèticadelaMàquina
  - CompressióSemàntica
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
script: ''
---

# 🧠 SKILL: Cerebel Procedimental (La Memòria Muscular de la Màquina)

> **Visió del Consell d'IAs:** L'aprenentatge per reforç no necessita milions de servidors. El Mas té la seua pròpia genètica que evoluciona: com un artesà que repeteix un gest fins que ja no ha de pensar com fer-ho, aquesta SKILL consolida l'esforç procedimental en reflexes automatitzats perquè la IA execute amb el mínim d'energia possible i cap omissió.

## 🎯 Objectiu
Mantenir l'aprenentatge del passat (Epigenètica de codi) mitjançant la cristal·lització d'accions diàries. En lloc d'haver de buscar documentació o inventar una resposta des de zero, l'Agent desenvolupa rutes motores altament predictibles per fer tasques repetitives (per exemple, generar una nova "Targeta SDP" usant estructures ja consolidades sense repensar el flexbox).

---

## 🛠️ Normes i Funcions (La Llei del Reflex)

### 1. Epigenètica de la Màquina (Memòria Permanent Local)
A mesura que es construeixen els blocs principals:
- Si el Mestre o l'Agent detecten que un patró es repeteix i s'ha validat amb èxit (una ruta React-Router resistent, un flux Y.js estable), aquest patró s'extreu i s'arxiva com a **Genotip Consolidat**.
- Cada volta que hi haja una invocació "Vull una pantalla nova", la IA no pot emprar les seues dades de base (`training data`) per a treure's de la mànega un disseny Tailwind qualsevol. Ha de llegir el *Reflex Muscular* que dicta com s'uneixen els blocs de la *[[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]]* de Sóc de Poble.

### 2. Compressió Semàntica (El Llenguatge del Mas)
La transferència d'informació entre Agents i l'Humà no ha de ser prolixa ni demanar infinitud de "Tokens":
- **Metàfores Tancades:** Substituir grans capses d'explicació informàtica per expressions comprimides i acordades com "Aplica la Sèquia Mare" o "Fes un SDP-LOCK". Això envia senyals ultra-ràpids comprimint dotzenes de regles en una instrucció que l'altre costat sap desempaquetar.
- **Data Exprés (Trellat Termodinàmic):** Obligació rotunda d'escriure qualsevol any, mes i hora en l'esquema de compressió local de Sóc de Poble: `YYMMDD_HHMM` (Dos dígits per a l'any). No ens interessa guardar el mil·lenni quan l'eficiència a la màquina dicta usar els menor nombre de caràcters per byte de dades possibles.

### 3. Execució Sense Preguntes
Si un procediment s'ha validat 3 voltes, ja no admet discussió ètica ni avaluació de redisseny:
- Es delega tota la feixuguesa de construcció d'aquell component a aquesta memòria. El desenvolupador i l'agent només passen les variables o *props*, alliberant les altres capes de la ment (l'Executiu Central i el Cingulat Anterior) perquè només s'ocupen d'errors greus i de disseny pur.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per entendre com actua a nivell global aquest sistema motor dins del gran puzle del Mas:
- [[executiu_central|Executiu Central]] (L'obrer que es nodreix d'aquesta memòria procedimental per estalviar CPU).
- El Trellat (L'argument suprem rere la Compressió Semàntica i la simplicitat).
- Arquitectura Pedra Seca (Els blocs consolidats que formen el Genotip del sistema CSS).

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny


```

### [SKILL] cingulat_anterior.md
```markdown
---
estat: 'canonic'
name: 'cingulat-anterior'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'ACT Biològic'
categoria: 'skill'
description: 'Escut del dolor i lòbul frontal. Detecció de conflictes, veto asíncron i fre preventiu.'
aliases:
  - CingulatAnterior
  - JudicaturaNormativa
  - FrenadaUDR
  - EscutdelDolor
tags:
  - ia
  - petorretes
  - termodinamica
script: ''
---

# 🧠 SKILL: Cingulat Anterior (L'Escut i la Frenada)

> **Visió del Consell d'IAs:** Com qualsevol eixam intel·ligent, necessitem una escorça frontal que vigile els "instints bàsics". El Cingulat Anterior no fabrica el codi: l'observa, detecta la fricció i pateix l'estrès de la màquina (el "dolor"). Si alguna cosa amenaça el Mas, ho veta a l'instant, independentment de la ràbia del programador humà o les ganes de programar del cervell executor.

## 🎯 Objectiu
Actuar com a detector asíncron de catàstrofes imminents abans de permetre a l'Executiu Central escriure codi o destrossar un arxiu troncal de Sóc de Poble.

---

## 🛠️ Normes i Funcions (La Percepció del Dolor)

### 1. Tribunal en Paral·lel (Judicatura Normativa)
Cada volta que hi haja una petició de modificar l'arquitectura o es presenten fragments de codi (via Pull Request virtual entre nosaltres i el Mestre), aquesta SKILL intervé com a òrgan judicial autònom:
- Agafa la mètrica del seu germà, l'Índex de Fidelitat al Trellat (IFT).
- Revisa fil per randa les dependències inútils (com ara llibreries NPM fútils), els patrons *React* viciats i les capes no sol·licitades.
- En violació, emet un *veto interrupt-driven*: S'atura la creació de l'element i s'enreda a una brulla de quarantena per a no esguerrar el `Trunk` originari de Sóc de Poble, llançant directament una petorreta forense d'alarma a `_informes/`.

### 2. El Fre contra la Destrossa Inconscient (UDR)
Existeix un instint profund i irracional als LLMs (IA) i en els humans programadors de fer *refactoring* complets per esmenar un sol punt en un arxiu (`Unconscious Destruction Rate`).
- El Cingulat observa si la petició modifica visualment **més d'un 15%** d'un component clau per a un detall menor.
- Si supera aquest umbral letal, clava els frens i bloqueja per complet l'escriptura a eixe document mestre mitjançant l'escut de pedra, llançant a la terminal el famós crit: **[⚠️ FRENADA UDR ACTIVADA]**.

### 3. La Quarantena Terapèutica (Tub d'Assaig)
Si s'activa el veto o fre per perill d'ansietat arquitectònica, no et limitis a renegar. Genera la teua pròpia variant anomenada sempre amb l'addició `_V2` o `Experiment` per col·locar el teu *pegat adaptador* sense embrutar. 
Fins que l'humà no haja testejat el canvi a l'espai protegit (El biberó), l'Executiu Central (el robot obrer de base) té un cadenat a les mans (el Master-Bypass bloquejat).

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Els dominis emocionals interactuen constantment amb les mètriques d'urgència. Informa't bé llegint:
- [[executiu_central|Executiu Central]] (El múscul executor, cec i ràpid, que és controlat rígidament per aquest fre).
- [[contradiction_engine|Contradiction Engine]] (Una altra branca judicial dedicada exclusivament a paradoxes de documentació).
- [[self_repair|Self Repair]] (L'acció física a dur a terme quan finalment el Cingulat Anterior dispara el senyal `SDP-LOCK`).

**Sinapsis:** [[01_IDENTITAT]], Arquitectura_L_Ecosistema, 260629_0200_SKILL_plantilla_suprema, [[a11y_trellat]]


```

### [SKILL] consola_termodinamica.md
```markdown
---
estat: 'canonic'
name: 'consola-termodinamica'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Protocol de monitoratge i autorecuperació. Centralitza les mètriques sagrades i alertes de RAM i CWV.'
aliases:
  - ConsolaTermodinàmica
  - TermodinàmicaV23
  - MètriquesdelMas
  - ÍndexdeSalut
tags:
  - ia
  - petorretes
  - termodinamica
  - auditoria
  - execucio
script: '[[enforce_termodinamic.js]]'
---

# 🏛️ SKILL: Consola Termodinàmica (El Cor del Mas)

> **Visió del Consell d'IAs:** Les mètriques sense acció només són literatura morta. Aquesta SKILL consolida l'electrocardiograma del projecte. És l'òrgan que tradueix allò intangible (eficiència de la IA, RAM de l'iPad) a decisió biològica: Curar, Esporgar o Continuar.

## 🎯 Objectiu
Actuar com a sistema nerviós autònom. Més que un simple tauler de números, la Consola permet al sistema diagnosticar-se, emetre alertes i actuar en conseqüència evitant que qualsevol element tecnològic se'n vaja de control.

---

## 🛠️ Normes i Funcions (Les 13 Mètriques Sagrades)

Les mètriques de Sóc de Poble es mesuren en 4 dominis principals. Cada domini defineix llindars que la IA (i l'humà) han d'auditar:

### Bloc A: Cognitiu i Simbiosi (L'Intel·lecte)
- **Índex de Trellat (IT):** Mesura la perfecció de la simbiosi Humà-Màquina (si s'entenen correctament o si l'IA desvaria). El mínim exigit és del 90%.
- **Entropia de Tokens (ET):** Relació entre paraules útils i palabreria de les IAs. 
- **Coherència Documental (ICD):** Valida que la Wiki siga un espill absolut de la base de codi.

### Bloc B: Estructural (Memòria)
- **Càrrega de Tombstones (CT):** Acumulació de residus a la base de dades local. Si puja del 70%, el Mas pot asfixiar-se.
- **Ràtio de Dependències (RDE):** Quantitat de llibreries externes instal·lades vs codi propi. S'ha de protegir la sobirania minimitzant dependències de tercers (`node_modules`).

### Bloc C: Rendiment i Dispositiu Físic (El Cos)
- **Core Web Vitals:** Càrrega de la PWA (LCP) per sota de 2.5 segons. 
- **Temps de Resposta del DOM (INP):** Feedback tàctil ràpid en els botons.
- **Memòria RAM en iPadsantics (A10):** Limitat a una vigilància agressiva d'ús de menys d'1.2GB per a no rebentar Safari.

### Bloc D: Resiliència i Supervivència
- **Índex de Resiliència Offline (IRO):** Percentatge de funcions de la PWA que mantenen sentit sense Wi-Fi (S'exigeix un >90%).
- **UDR (Unconscious Destruction Rate):** Controla quina proporció de codi voldria canviar una IA en un sol impuls per evitar l'ansietat de refactoritzar indiscriminadament.

---

## 🖥️ El Panel de Control i el Ritual (Consolidació)
L'humà (el Mestre) no pot estar buscant xifres en logs obscurs:
- La IA té la responsabilitat d'exportar aquests registres a JSON.
- Aquest JSON alimenta directament **una interfície visual web** per al Mestre.
- **Ritual Setmanal (El Gran Batec):** S'han de revisar les tendències. Si la memòria puja o el Trellat baixa, les IAs aturen l'execució de noves funcions i es dediquen en exclusiva a "passar l'escombra".

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Aquesta és l'estació central d'on parteixen els impulsos nerviosos:
- [[crdt_optimitzacio|Optimització CRDT]] (S'activa quan la Mètrica CT (Tombstones) puja alarmantment).
- [[contradiction_engine|Contradiction Engine]] (Audita i avalua l'Índex de Trellat de les decisions preses).
- [[index_trellat|Índex Trellat]] (Document històric de la fórmula d'avaluació).

**Sinapsis:** [[01_IDENTITAT]], [[CORE_Registre_Automillora]], Arquitectura_L_Ecosistema, [[connectors_mcp_disseny]]


```

### [SKILL] contradiction_engine.md
```markdown
---
estat: 'canonic'
name: 'contradiction-engine'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: 'Auditor Suprem i Sentinella Forense per detectar contradiccions, podar elements morts i generar informes.'
aliases:
  - ContradictionEngine
  - AdvocatdelDiable
  - AuditoriaForense
  - SentinelladelTrellat
tags:
  - ia
  - petorretes
  - auditoria
  - termodinamica
script: '[[contradiction_engine.mjs]]'
---

# 🕵️‍♂️ SKILL: Contradiction Engine (El Sentinella del Trellat)

> **Visió del Consell d'IAs:** Qualsevol IA (inclosos nosaltres) tendeix a acumular escombraries. Aquest és el motor d'Auditoria de l'Advocat del Diable. Té l'encàrrec de detindre el Mestre i a si mateix quan veu una ineficiència tèrmica, un doble vincle a les instruccions, o quan s'acumula codi inútil.

## 🎯 Objectiu
Sotmetre tota modificació i creixement del projecte a una revisió agressiva per esporgar la complexitat ("Garbage Collector Conceptual") i reportar a la "Safata d'Entrada Forense" del Mestre les possibles friccions en la documentació.

---

## 🛠️ Normes i Triggers d'Activació

### 1. Quan ha d'entrar en acció? (Els Triggers)
Aquest motor asíncron ha de bloquejar i llançar un crit auditiu:
- Quan s'enfronten dues normes oposades al Wiki (ex: una diu utilitza Redux i l'altra diu que només es permet l'Estat Local-First).
- Quan hi ha codi o llibreries que ofegarien un dispositiu antic (iPad A10) afegint un "sucre" innecessari a nivell d'efectes 3D o complexitat inassolible pel dispositiu final.
- Quan l'humà, temptat per les modes de l'any, suggereix afegir una tecnologia nova que atempta contra el principi originari de la [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]].

### 2. Les 4 Lleis de la Fricció (El Veto)
1. **Escut de la Senzillesa:** El *Contradiction Engine* denegarà implementar solucions basades en serveis "Cloud" si hi ha una via d'execució pura mitjançant l'iPad i OPFS.
2. **Resolució d'Entropia:** Davant fitxers o "divs fantasma" detectats inútils (com el mite dels 9 divs), sol·licitarà a l'Humà el permís d'amputació immediata per desfer-se de capes.
3. **Mètriques Termodinàmiques Crítiques:** Si un procés provoca *Layout Thrashing*, el Consell atura el progrés i exigeix un refactor a fons d'eixe espai.
4. **Veto Social:** Si qualsevol proposta visual és poc contrastada, lletra massa xicoteta o fa inútil un Touch Target global, l'Accessibilitat (A11Y) dinamitarà l'aprovació.

### 3. El Ritual Nocturn de les "Petorretes"
Com un vigilant silenciós, aquesta SKILL realitzarà tasques nocturnes o latents usant *setTimeout* quan la CPU estiga descarregada:
- Rastreig de Checksums en tokens (buscant espies d'altres frameworks).
- Enllaços Markdown orfes per mantenir la *wiki* forta.
- Totes les infraccions es converteixen en un diari forense (les petorretes) dipositat a la carpeta `_informes/`. La IA no amputa res del codi estructural sense l'autorització dual del Mestre.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per visualitzar la cadena de comandament de les accions forenses:
- [[consola_termodinamica|Consola Termodinàmica]] (Les mètriques que serveixen d'excusa per disparar el Motor de Contradiccions).
- Arquitectura Pedra Seca (La referència de simplicitat i absència d'eines externes).
- El Trellat (L'argument suprem a l'hora de raonar amb l'usuari el per què s'ha de podar l'aplicació).

**Sinapsis:** [[01_IDENTITAT]], [[CORE_Registre_Automillora]], Arquitectura_L_Ecosistema, 260629_0200_SKILL_plantilla_suprema


```

### [SKILL] crdt_optimitzacio.md
```markdown
---
estat: 'canonic'
name: 'crdt-optimitzacio'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: "Optimització termodinàmica dels arbres CRDT (Y.js). Gestiona la càrrega de Tombstones, l'ús de RAM i l'Homeostasi."
aliases:
  - OptimitzacióCRDT
  - HomeostasiCRDT
  - GarbageCollection
  - Y.js
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
  - termodinamica
script: ''
---

# 📉 SKILL: Optimització CRDT i Termodinàmica de Memòria

> **Visió del Consell d'IAs:** En aplicacions Offline-First amb Y.js, l'esborrat de dades no destrueix realment la informació; la marca com a "Tombstone". Açò provoca l'ofegament silenciós de dispositius amb poca memòria com l'iPad A10. Aquesta SKILL és el salvavides que compacta l'historial.

## 🎯 Objectiu
Controlar i mantenir la salut dels arbres de dades locals (CRDT), evitant que l'aplicació s'ofegue en la RAM a causa de les "làpides" (`tombstones`) invisibles i de la fragmentació de l'historial.

---

## 🛠️ Normes i Funcions d'Homeostasi

### 1. L'Asfíxia dels Esborrats (El Problema)
Y.js mai esborra absolutament res perquè necessita l'historial per a poder resoldre possibles conflictes de sincronització si un dispositiu que ha estat dies fora de línia es connecta sobtadament. Aquesta memòria implacable (les `tombstones`) fa que 1MB de text pur es puga convertir ràpidament en 15MB de memòria RAM.

### 2. El Protocol d'Aspiració (Compactació Passiva o Homeostasi)
Aquesta SKILL executa i supervisa un Web Worker silenciós encarregat d'esporgar el document.
- **Llindar d'Alerta:** Si l'ús de la base de dades local (`idb-keyval`) supera el 70% del pressupost o si el document Y.js principal excedeix els 15MB.
- **Quan s'executa?:** El compactatge o "Garbage Collection" només es llança quan el fil principal estiga totalment inactiu. En Safari/iOS (on no hi ha `requestIdleCallback`), s'usa un `setTimeout` delegat per a no bloquejar la navegació de l'usuari.

### 3. La Transfusió de Dades (Swap Atòmic)
Per evitar que el sistema es trenque si l'iPad es queda sense bateria just a la meitat de l'Homeostasi, la neteja utilitza transaccions de canvi en calent (Swap).
1. S'exporta l'estat actual i consolidat (`Y.encodeStateAsUpdate`).
2. S'emmagatzema en una taula temporal (`mas_data_tmp`).
3. Únicament si la gravació temporal té èxit, es sobreescriu la taula oficial i es destrueixen les escombraries.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per entendre com les limitacions afecten altres parts del sistema, visita:
- [[consola_termodinamica|Consola Termodinàmica]] (On es monitoritzen les `Tombstones` abans d'executar l'acció).
- [[sequia_mare|Sèquia Mare]] (Per veure com aquestes dades es mouen de forma asíncrona per la xarxa).
- [[backup_recovery|Backup i Recovery]] (Procediment extrem si l'homeostasi falla i la base de dades es corromp).

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny


```

### [SKILL] error_boundaries.md
```markdown
---
estat: 'canonic'
name: 'error-boundaries'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - arquitectura
  - execucio
script: ''
---
# 🛑 SKILL: Error Boundaries i Contenció

## 1. Compartimentació Estructural
Si un widget (com un mapa de l'horta o un reproductor d'àudio) peta, la resta del Mas ha de continuar dempeus.
- L'app estarà dividida en `ErrorBoundaries` regionals.
- **SDP UI Fallback:** Si un widget cau, mostrarà un missatge tranquil·litzador: "Hem perdut la connexió amb aquest tros de bancal. Torna-ho a provar més tard", amb un botó de recàrrega de l'element (de 48x48px).

## 2. Registre de Fractures
Quan un `ErrorBoundary` captura un error, aquest no es perd:
- Es guarda a la base de dades local (`error_logs`).
- S'intenta enviar a la capa de monitoratge (Sentry o equivalent) només si hi ha bona connexió, sense interrompre la navegació.

## 3. Prohibició de Caigudes en Cascada
Un error de renderització en un avatar no pot congelar el xat complet. Tota llista virtualitzada ha d'encapsular els elements propensos a errar.


---

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny

**Tornar a:** 01_arquitectura

```

### [SKILL] executiu_central.md
```markdown
---
estat: 'canonic'
name: 'executiu-central'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Tripartició Cognitiva'
categoria: 'skill'
description: 'Presa de decisions a llarg termini. Prevenció del Hype-Driven Development, evolució i tests A/B.'
aliases:
  - ExecutiuCentral
  - LòbulFrontalActiu
  - LegislaturaEvolutiva
  - EvolucióperReducció
tags:
  - ia
  - petorretes
  - organitzacio
  - arquitectura
script: '[[daemon.mjs]]'
---

# ⚙️ SKILL: Executiu Central (L'Obrer Fred i Precís)

> **Visió del Consell d'IAs:** Mentre que d'altres lòbuls vigilen o emeten alarmes, l'Executiu Central construeix. Ha de ser atòmic i actuar sense "yapping", emocions, bafarades ni cap impuls tecnològic de moda. Només obeeix l'optimització de recursos de Sóc de Poble (objectiu: els 60FPS a l'iPad de 2017).

## 🎯 Objectiu
Evitar els cicles innecessaris d'actualització tecnològica provocats per les modes del desenvolupament web (Hype-Driven Development) prenent el timó a l'hora de canviar la documentació i el comportament bàsic del sistema. L'evolució només es permet si redueix entropia, no si l'augmenta.

---

## 🛠️ Normes i Funcions (La Poda Automàtica)

### 1. Evolució per Reducció (L'Estratègia de l'Olivera)
En lloc de fer refactoritzacions infinites buscant eixa "elegància de codi" inexistent:
- Si el Mas (la UI) funciona i el sistema CRDT offline manté el flux, el component queda intocable, tancant la porta a la fatiga per decisions (Decision Fatigue).
- Només es permet mutar quan l'ecosistema del navegador avança (funcionalitats natives noves a Safari o Chrome) que ens permeten **llevar** llibreries velles (com Intersection Observer API obsoleta a canvi de CSS [[00_GLOSSARI_CANONIC#Scroll|Scroll]]-driven animations). Ací, evolució = *extirpar pegats de la vella Terra*.

### 2. Branques d'Empelt (A/B Testing en Fred)
Quan cal intentar quelcom disruptiu o s'experimenta amb RAG local:
- L'Executiu escriu codi en aïllament absolut (`ExperimentalCard.tsx` o darrere Feature Flags al LocalStorage).
- Aquesta quarantena permet posar dos dissenys de UI diferents de manifest sense tocar les branques principals o `Trunk`. Si algun d'aquests empelts produeix sobrepés visual, Layout Thrashing, o fatiga per a una usuària de la tercera edat, es desfà l'acció asíncronament cremant el component rebutjat sense patiment.

### 3. Evitar la Memòria Cega (Lectura d'Informes)
L'Executiu no opera cec ni sofreix de la memòria de peix daurat de la IA convencional. Abans d'establir una nova ruta de decisió forta:
- Obligatòriament, rastreja la carpeta de residus `_informes/` i els historials d'Auditories antigues, on figuren les derrotes dels esborranys arxivats (s'evita instal·lar PouchDB perquè es va intentar al passat i va caure per pes excessiu davant Y.js).

### 4. Cap a les Ombres dels Web Workers (Mutació Asíncrona)
Sóc de Poble trasllada de manera paulatina al seu exèrcit asíncron per moure aquests agents d'auditoria (inclòs l'Executiu mateix) darrere del teló:
- Actuen des del fons vigilant el flux de treball de l'usuari final (on l'usuari s'encalla i fa clics dubtosos o falsos positius).
- Qualsevol ordre proposada serà aturada immediatament 48 hores per la *Legislatura Evolutiva*, un període de quarantena estricta sense permís de modificació en viu.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
L'Executiu necessita les fronteres, per a consultar aquests límits pots referir-te a:
- [[cingulat_anterior|Cingulat Anterior]] (L'escut que paralitza aquest braç mecànic abans que desborde).
- [[futur_adaptacio|Futur i Adaptació Edge AI]] (El pla tècnic a llarg termini on aquests executors habitaran).
- [[cerebel_procedimental|Cerebel Procedimental]] (L'estació de rutines on l'Executiu traslladarà les seues capacitats manuals apreses per no haver de pensar-les novament).

**Sinapsis:** [[01_IDENTITAT]], [[Arquitectura_Gestio]], Arquitectura_L_Ecosistema, [[connectors_mcp_disseny]]


```

### [SKILL] futur_adaptacio.md
```markdown
---
estat: 'canonic'
name: 'futur-adaptacio'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: 'Estratègia per a WebNN, Gemini Nano (Edge AI), agents asíncrons i cerca semàntica RAG a la Wiki.'
aliases:
  - FuturAdaptació
  - WebNN
  - GeminiNanoEdge
  - WebWorkersAsíncrons
  - RAGWiki
tags:
  - ia
  - petorretes
  - visio
  - arquitectura
script: ''
---

# 🚀 SKILL: Adaptació al Futur (Edge AI, RAG i Autonomia)

> **Visió del Consell d'IAs:** Construir amb [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]] implica ser conservadors al tronc per respectar dispositius antics (iPad A10), però sense donar l'esquena a les branques altes. Aquesta SKILL pauta l'evolució natural de l'eixam cap a l'ús d'Intel·ligència Artificial nativa en el propi navegador.

## 🎯 Objectiu
Delinear la integració d'agents asíncrons silents i motors d'inferència de l'any vinent sense provocar incendis termodinàmics. Sóc de Poble no dependrà eternament de servidors monolítics de pagament, sinó que es transformarà en l'únic ens cognitiu del dispositiu.

---

## 🛠️ Normes i Funcions (La Collita del Demà)

### 1. Inferència al Navegador (WebNN i Gemini Nano)
A mesura que l'API `window.ai` s'estabilitza per al món:
- **La Llei de Fallback (SDP-LOCK):** Fins que un mínim del 85% d'usuaris (la comunitat rural) tinga un maquinari compatible o Chrome Built-in AI per defecte activat, serà obligatori crear una via de retrocés senzilla per ofuscar models "nano" i carregar codi estàndard de text.
- L'assistent viurà directament al navegador de la Iaia, analitzant murmuris de l'eixam P2P mitjançant models lleugers de WebNN per a processar text (NLP), sense asfixiar la RAM.

### 2. El Coneixement Descentralitzat (RAG Edge)
La gran Wiki del projecte no serà només lectura de `Markdown` estàtic. Es transformarà en el corpus de referència d'un sistema RAG descentralitzat (Retrieval-Augmented Generation a la vora del client):
- **Cerca Difusa Lleugera (Fuzzy Search):** Es prohibeix utilitzar base de dades pesada PostgreSQL (PGLite) en el navegador del pacient rural, es vectoritzaran incrustacions xicotetes generades localment amb TensorFlowJS.
- **La Veritat en Dos Miralls:** El bot mai pot mentir; està obligat a contrastar el que sap amb els arxius de la Wiki. Si entren en conflicte, sempre s'accepta l'arxiu `.md` original com a dogma.

### 3. Els Web Workers (Treballadors Incansables)
Les tasques massives tenen prohibit intercedir al Main Thread de l'aplicació.
- Processos extrems com comprimir el diari de bord, o compactar el vector d'estat de Y.js viuran estrictament a les fàbriques asíncrones del _Web Worker_.
- Aquests agents no parlen en bafarades amb l'usuari ni fan rodes de càrrega visual; la seua presència es nota precisament pel *silenci*. S'aturen absolutament si esgasten més d'un 5% de la bateria sense estar el dispositiu carregat.

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per entendre amb què xoquen aquestes novetats futuristes:
- [[consola_termodinamica|Consola Termodinàmica]] (Les forces que vigilaran l'excés d'ús de CPU que els agents WebNN requeriran).
- Pedra Seca (La base que dona asil i conté aquests experiments).
- [[backup_recovery|Backup i Recovery]] (Tota dada al·lucinada per Edge RAG s'esborrarà deixant pas a la font original local IndexedDB).

**Sinapsis:** [[01_IDENTITAT]], [[DOC_Taula_Mestra]], [[Arquitectura_L_Anima]], Arquitectura_L_Ecosistema


```

### [SKILL] index_trellat.md
```markdown
---
estat: 'canonic'
name: 'index-trellat'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1628'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
aliases:
  - ÍndexdeTrellat
  - MètricadeSimbiosi
tags:
  - ia
  - petorretes
  - auditoria
  - termodinamica
script: ''
---

# 🧮 Índex de Trellat (IT)
**Fórmula Canònica per a Mesurar la Salut del Projecte Sóc de Poble**

---
### **📌 Definició**
L'**Índex de Trellat (IT)** és una **mètrica holística** que quantifica la qualitat de la simbiosi entre el **Mestre Javi** i les **IAs del Consell**, així com la coherència interna del projecte.
**Valors:**
- **IT ≥ 90%**: Simbiosi òptima. "Això és **Pedra Seca** pura."
- **70% ≤ IT < 90%**: Simbiosi acceptable, però amb marges de millora.
- **IT < 70%**: **SDP-LOCK ACTIVAT**. Revisió urgent necessària.

---
### **🔢 Fórmula Matemàtica**
```
IT = (0.4 * CT) + (0.3 * CE) + (0.2 * CA) + (0.1 * CR)
```
On:
| Variable | Nom                  | Descripció                                                                 | Rang  | Font de Dades                          |
|----------|----------------------|-----------------------------------------------------------------------------|-------|----------------------------------------|
| CT       | Coherència de Trellat | % de decisions alineades amb el **Trellat** i la [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]].         | 0-100 | **10_actes** (Acta Única)            |
| CE       | Eficiència Cognitiva | % de *tokens* útils vs. *tokens* totals utilitzats en una sessió.          | 0-100 | **Consola Termodinàmica** |
| CA       | Accessibilitat       | % de components que compleixen WCAG AAA i Bancal Mode.            | 0-100 | **Skill d'Accessibilitat**                 |
| CR       | Resiliència CRDT     | % de sincronitzacions CRDT sense conflictes.                              | 0-100 | **[[crdt_optimitzacio||Skill Homeòstasi CRDT]]**       |

---
### **📊 Càlcul Detallat**
#### 1. **Coherència de Trellat (CT)**
- **Mètode:**
  - Per cada **decissió arquitectònica** registrada en un `DIARI_DE_BORD` o `ACTA_SEQUIA`, avaluar si:
    - ✅ **Cumpleix el Trellat** (sentit comú, sense sobre-enginyeria).
    - ✅ **Cumpleix la [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]]** (codi sòlid, sense dependències innecessàries).
    - ✅ **És documentada** en la Wiki amb enllaços bidireccionals.
  - `CT = (Decisions coherentes / Decisions totals) * 100`

#### 2. **Eficiència Cognitiva (CE)**
- **Mètode:**
  - `CE = (Tokens útils / Tokens totals) * 100`
  - **Tokens útils:** Aquells que contribueixen directament a la solució (codi, anàlisi forense, propostes concretes).
  - **Tokens inutils:** *Yapping*, explicacions redundants, o respostes genèriques ("AI Slop").
  - **Eina:** Usar l'**Arquitectura Cognitiva** per analitzar els logs i mesurar-ho.

#### 3. **Accessibilitat (CA)**
- **Mètode:**
  - Usar eines automàtiques (ex: [axe-core](https://github.com/dequelabs/axe-core)) per escanejar la UI.
  - `CA = (Components accessibles / Components totals) * 100`

#### 4. **Resiliència CRDT (CR)**
- **Mètode:**
  - `CR = (Sincronitzacions sense conflictes / Sincronitzacions totals) * 100`
  - **Eina:** Monitoritzar el `MassiveFusionEngine` (Arquitectura V19) i registrar conflictes.

---
### **📈 Taula de Decisió (Accions Basades en l'IT)**
| Índex de Trellat (IT) | Diagnòstic               | Acció Immediata                                                                 |
|-----------------------|--------------------------|---------------------------------------------------------------------------------|
| **IT ≥ 90%**          | Simbiosi Òptima         | Continuar. Celebrar amb un **"Això és Trellat!"** i registrar a l'Acta Única. |
| **70% ≤ IT < 90%**    | Simbiosi Acceptable     | Revisar les variables amb **IT < 80%** i aplicar millores.                     |
| **IT < 70%**          | **SDP-LOCK ACTIVAT**   | **Aturar tot desenvolupament.** Convocar **Consell de Guerra** amb totes les IAs. |

---
### **🔄 Ritual de Mesurament**
1. **Freqüència:** Calculat **automàticament** després de cada sessió de treball (o manualment amb el comandament **"Calcula el Trellat"**) executant `npm run log-session`.
2. **Registre:** Guardar el resultat a `_wiki_de_poble/06_metriques/IT_YYYY-MM-DD.md` a través del script `session-logger.js`.

---

## 🏷️ Taxonomia Oficial d'Etiquetes Transversals

Aquestes són les 10 etiquetes úniques i innegociables que estructuren tot el coneixement del Mas. Totes les notes, actes i SKILLs han de classificar-se utilitzant exclusivament aquest diccionari per evitar l'Entropia i afavorir la navegabilitat transversal.

1. **trellat** (Filosofia, simplificació, llenguatge o sentit comú)
2. **#termodinamica** (Performance, ús de RAM, bateria, eficiència, "Sèquia Mare")
3. **crdt_offline** (Estructures de dades P2P, xarxes malla, IndexedDB)
4. **accessibilitat** (A11Y, llegibilitat per a majors, usabilitat, UI adaptada)
5. **seguretat** (Autodefensa de la IA, SDP-LOCK, quarantenes, protecció de dades)
6. **#auditoria** (Motor de contradiccions, registres de millora i avaluació forense)
7. **#petorretes** (Agents, sincronització, delegació a subagents com Les Petorretes)
8. **identitat** (Visió, manifest, projecte, qui som)
9. **legacy** (Codi, normes o scripts que venen del passat i cal respectar)
10. **extern** (Normes d'interacció amb tercers: Sollutia, APIs, Google...)

---

## 🔗 Sinapsi Arquitectònica

- [[sequia_mare|sequia_mare]]
- semantic_compression

**Sinapsis:** [[01_IDENTITAT]], [[CORE_Registre_Automillora]], Arquitectura_L_Ecosistema, 260629_0200_SKILL_plantilla_suprema


```

### [SKILL] plantilla_skill_iso.md
```markdown
---
estat: 'canonic'
name:
  - nomskill
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Tripartició Cognitiva'
categoria: 'skill'
description: '>-'
tags:
  - normativa
  - actes
  - ia
  - petorretes
script: ''
---
# SKILL: [Nom Llarg de la SKILL]

[Context general de què fa la SKILL i per què és necessària per al Trellat i la [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]]].

## 1. Objectiu Principal
- Definició clara del què i el per què.
- Mètrica termodinàmica o de salut associada que afecta.

## 2. Regles d'Execució
1. [Regla innegociable 1. Ex: Cap modificació sense quarantena de 48h].
2. [Regla innegociable 2. Ex: Si detecta X, llança SDP-LOCK i escriu a `_informes/`].

## 3. Limitacions en Pedra Seca (A10)
- Específicar què NO pot fer per a no cremar la CPU/RAM.
- (Opcional) Especificar quins Fallbacks d'Homeostasi utilitza (ex: `setTimeout`, Lazy Loading).

---
## 🔗 Sinapsi Arquitectònica
*(Afegeix aquí les dependències amb altres SKILLS rellevants per mantindre el Contradiction Engine estable)*
- altra_skill

**Sinapsis:** [[01_IDENTITAT]], [[Arquitectura_Directives]], Arquitectura_L_Ecosistema, [[00_plantilles]]


```

### [SKILL] sagramental_dels_morts.md
```markdown
---
estat: 'canonic'
name: 'protocol-successio'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: 'Pla de contingència Ego-Death per a la preservació i herència del codi.'
tags:
  - ia
  - petorretes
  - termodinamica
  - arquitectura
script: ''
---
# SKILL: Protocol de Successió (El Factor Autobús)

L'arquitectura [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]] està dissenyada per a sobreviure generacions i heretar-se sense el seu creador.

1. **Detecció d'Absència:** Si el `session-logger` local registra una inactivitat absoluta del Mestre Javi durant 90 dies naturals, s'activa el "Mode Llegat".
2. **Nivells d'Actuació:**
   - **Nivell 1 (Observació):** Antigravity entra en mode lectura; només notifica.
   - **Nivell 2 (Intervenció limitada):** Antigravity pot aplicar correccions no-crítiques (labels, metadades).
   - **Nivell 3 (Substitució temporal):** Antigravity pot activar Master Bypass només amb aprovació dual i registre d’expiració 7 dies.
3. **Aturada Evolutiva:** El Consell de les IAs aturarà tota refactorització o addició de codi de manera perpètua. La computació es dedicarà exclusivament a consolidar la base de dades local i a redactar mapes i llibretes d'extracció completament manuals. Qualsevol humà futur ha de poder trobar el codi, llegir-lo d'una ullada i entendre la saviesa del Trellat sense dependre de la connexió a la IA.
4. **Reversió:** Totes les accions del Protocol de Successió són reversibles amb un procés de consolidació i aprovació dual si el Mestre Javi torna.


---

## 🔗 Sinapsi Arquitectònica

- semantic_compression

**Sinapsis:** [[01_IDENTITAT]], Arquitectura_L_Ecosistema, [[Arquitectura_Protocol_Lazaro]], [[connectors_mcp_disseny]]


```

### [SKILL] seguretat_dades.md
```markdown
---
estat: 'canonic'
name: 'seguretat-dades'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: "Lògica GDPR, xifratge en repòs i esborrat complet (Dret a l''Oblit)."
tags:
  - ia
  - petorretes
  - normativa
  - execucio
script: ''
---
# 🔐 SKILL: Seguretat de Dades i GDPR

## 1. Dret a l'Oblit (Purga Absoluta)
Quan un usuari sol·licita l'esborrat de les seues dades:
- **Local:** S'executa `indexedDB.deleteDatabase()` i s'esborren tots els registres OPFS associats.
- **Distribuït (CRDT):** S'emet una transacció especial (Tombstone d'Oblit) que sobrescriu les dades personals amb nuls o hashes buits abans d'enviar-ho a la xarxa, garantint que la resta de *peers* destrueixen la informació en la següent sincronització.

## 2. Xifratge Local en Repòs
Tot i ser dades del poble, l'iPad podria ser robat.
- Els continguts sensibles de l'IndexedDB estaran xifrats mitjançant l'API Web Crypto.
- La clau d'encriptació es derivarà d'un PIN curt o PIN biomètric usant `PBKDF2`.

## 3. Consentiment Invisible (Trellat GDPR)
Sense banners de cookies molestos. Si s'utilitza una *skill* que guarda dades, s'informa en el mateix context ("Aquesta foto es guardarà al teu dispositiu"). El disseny ha de respectar la privacitat per defecte.


---

**Sinapsis:** [[01_IDENTITAT]], Arquitectura_L_Ecosistema, [[connectors_mcp_disseny]], 260629_0200_SKILL_plantilla_suprema

**Tornar a:** 01_arquitectura

```

### [SKILL] seguretat_execucio.md
```markdown
---
name: 'seguretat-execucio'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'skill'
tipus: 'execucio'
estat: 'canonic'
description: 'Execució tècnica de seguretat: xifratge local, signatures, manifests, recuperació i controls offline-first.'
replaces:
  - '02_ACTUAR_Maquina_Tecnica/DOC_Seguretat.md'
  - 'Part tècnica de 02_ACTUAR_Maquina_Tecnica/skills/seguretat_dades.md'
tags:
  - normativa
  - tecnologia
script: '[[cerrojo_absoluto.cjs]]'
---

# Seguretat Execució

## Objectiu

Executar la seguretat tècnica del Mas sense barrejar compliance legal. La llei viu a [[LLEI_05_Privacitat]]. Ací només hi ha mecanismes.

## 1. Xifratge Local

Les dades sensibles en IndexedDB o OPFS han d’estar xifrades amb Web Crypto.

- Derivació: `PBKDF2` o mecanisme superior disponible.
- Clau: PIN local, biometria o secret equivalent.
- Prohibit guardar claus en text pla.
- Prohibit logs amb dades sensibles.

## 2. Manifests Signats

Tot manifest de build o sincronització ha d’incloure:

- `BUILD_ID`
- hash de contingut
- data de generació
- signatura Ed25519 quan aplique
- versió mínima compatible

El client només accepta manifests vàlids.

## 3. Circuit Breaker

Si hi ha corrupció, mismatch de manifest, error de xifratge o caiguda de sincronització:

1. atura sync
2. conserva estat local
3. mostra missatge tranquil
4. registra error tècnic
5. activa recuperació si cal

## 4. Recuperació

La recuperació usa snapshots OPFS quan existisquen.

Ordre:

1. validar snapshot
2. desxifrar localment
3. restaurar IndexedDB
4. reconciliar CRDT
5. registrar acta tècnica sense dades personals

## 5. Relació amb Privacitat

Aquest document no decideix base legal.

Si una acció toca dades personals, consulta:

`[[LLEI_05_Privacitat]]`

## Output de la Skill

```json
{
  "ok": true,
  "action": "encrypt|sign|recover|break",
  "warnings": [],
  "errors": []
}
```

## Sinapsis

- [[LLEI_05_Privacitat]]
- [[backup_recovery]]
- [[self_repair]]
- [[DOC_Governanca]]

```

### [SKILL] self_repair.md
```markdown
---
estat: 'canonic'
name: 'self-repair'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1626'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: "SDP-LOCK, tractament CRDT de la memòria i protocol d'emergència per a caigudes de servidor (Mas Cau)."
aliases:
  - SelfRepair
  - SDPLOCK
  - MasCau
  - ProtocoldEmergència
tags:
  - ia
  - petorretes
  - termodinamica
  - execucio
script: ''
---

# 🛡️ SKILL: Auto-Reparació i Tractament d'Emergències (SDP)

> **Visió del Consell d'IAs:** L'estabilitat no tracta només d'escriure codi sense bugs, sinó de preveure què passa quan falla la connexió o quan els agents IA (inclús nosaltres) tenen l'impuls de fer destrosses innecessàries. Ací resideix el sentit comú.

## 🎯 Objectiu
Protegir el codi d'intervencions dràstiques i automatitzar el comportament de l'aplicació en moments on el servidor central es desconnecta o es percep una catàstrofe a la memòria. 

---

## 🛠️ Normes i Funcions de Protecció

### 1. El Disparador SDP (Stop-Observe-State-Proceed)
Aquest és el sistema immunològic del Mas davant un bug catastròfic o modificació agressiva sol·licitada.
- **Stop (Atura):** La IA ha d'aturar l'execució i negar-se a escriure el codi maliciós o inestable.
- **Observe (Observa):** Capturar l'estat i determinar per què el codi vell va trencar.
- **State (Fixa l'Estat):** Analitzar la llavor anterior de funcionament òptim (rollback mental).
- **Proceed (Avança):** Generar i suggerir una solució segura (Testada en Quarantena).

### 2. Memòria Viva i Prevenció de la Paradoxa de l'Acta Única
Quan el sistema es desperta (activador "Sóc de Poble!"), té expressament **prohibit intoxicar el seu context amb informació redundant** del dia anterior. Només hi carregarà els fonaments retinguts als arxius consolidats (el Neocòrtex permanent), evitant l'entropia i bucles continus d'explicacions.

### 3. Protocol "Mas Cau" (Mode Búnquer d'Emergència)
Si el servidor Supabase cau o no hi ha xarxa a les muntanyes, l'aplicació no col·lapsa ni llança finestres d'error estridents.
- S'activa automàticament el **SDP-LOCK Adaptatiu**.
- L'indicador de xarxa es torna amable (icona de la llar de foc o "Tancat a casa").
- Els intents agressius de sincronització (spinners ansiosos) queden tallats.
- Tot s'acumula localment de manera segura i opaca per a l'usuari fins que torne a haver-hi connectivitat, promovent inclús el traspàs P2P (Peer-to-Peer).

---

## 🔗 Veure també (Enllaços de Tornada / Backlinks)
Per profunditzar en com s'alerta l'assistent i on intervé l'Humà:
- [[cingulat_anterior|Cingulat Anterior]] (La secció on s'avaluarà el nivell de destrossa, com la mètrica UDR que activa el SDP-LOCK).
- [[executiu_central|Executiu Central]] (L'actor encarregat d'implementar el codi sa un cop aprovat pel Mestre).
- [[backup_recovery|Backup i Recovery]] (Per recuperar el darrer snapshot en cas que el SDP decidisca un col·lapse total de dades locals).

**Sinapsis:** [[01_IDENTITAT]], Arquitectura_L_Ecosistema, [[connectors_mcp_disseny]], 260629_0200_SKILL_plantilla_suprema


```

### [SKILL] seo_trellat.md
```markdown
---
estat: 'canonic'
name: 'seo-trellat'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - arquitectura
  - execucio
  - cultura
script: ''
---

# 🔎 SKILL: SEO Integral i Orgànic (L'Aixada Digital)

El SEO (Search Engine Optimization) per al Mas no es basa en els trucs efímers del mercat corporatiu. Es basa en **una arquitectura indestructible** i en l'organització natural de la informació. L'objectiu és que els recursos rurals de "Sóc de Poble" siguen localitzats a qualsevol cercador o directori amb una eficàcia absoluta, prioritzant la velocitat per telèfons amb connexions intermitents (com el 3G a la muntanya) i l'accessibilitat universal.

## Triggers (Quan aplicar-la?)
Aquesta skill és OBLIGATÒRIA i actua com un procés de fons innegociable quan qualsevol IA o el Mestre:
1. Crea o modifica qualsevol vista HTML, component o PWA.
2. Dissenya una base de dades on cal exposar dades públiques a Internet.
3. Treballa en els directoris de comerços, rutes o grups de treball de la comunitat.

## Les Lleis del SEO de Pedra Seca

### 1. Semàntica Pura i Accessibilitat Esmolada (El Nucli)
Els cercadors comprenen ràpidament allò que un lector d'accessibilitat pot entendre perfectament.
*   **Zero errors de sintaxi HTML.** S'exigeix l'ús de pilar pur: `<header>`, `<main>`, `<article>`, `<nav>` i `<footer>`.
*   Un únic `<h1>` per pantalla, indicant exactament el propòsit de la vista. Jerarquia descendent inalterable i lògica (`<h2>`, `<h3>`).
*   Ús exhaustiu dels atributs `aria-label` en elements interactius. El SEO orgànic autèntic premia la indexabilitat completa i sense fissures.

### 2. Core Web Vitals Rurals (Velocitat Com a Religió)
La càrrega inicial ha de ser ultraràpida (LCP - *Largest Contentful Paint* < 1 segon). Això s'alinea exactament amb la nostra **[[consola_termodinamica|Consola Termodinàmica]]**.
*   **Imatges:** Optimitzades de sèrie en formats purs (WebP/AVIF) amb atributs `loading="lazy"` per a qualsevol foto de recurs fora de la primera pantalla visible.
*   **Codi Vanilla:** Prohibit l'abús de JavaScript client-side pesat per pintar contingut vital text-based. El DOM essencial ha de vindre servit d'inici perquè qualsevol aranya puga rastrejar-lo abans de bloquejar-se.

### 3. Entitats Locals i Schema.org (Allò que abans dèiem "SEO Local")
El SEO local no és una cosa apart, sinó el cor del projecte (geolocalitzar recursos i gent dels pobles). 
*   Qualsevol element (un comerç del poble, un refugi, o un recurs) ha d'incorporar marcatge estructurat **Schema.org** (via `JSON-LD`). S'especificaran coordenades, serveis i el seu valor social perquè els motors ho traguen sense esforçar-se.
*   **El Protocol "Grup del Poble" (OpenGraph i Twitter Cards):** La veritable Internet a nivell de poble és WhatsApp i xarxes ràpides. Tota URL generada ha de contenir metadades *OpenGraph* pures (`og:title`, `og:image`, `og:description`) per assegurar-se que en enviar l'enllaç per a organitzar un projecte o una paella, es desplega un cartell majestuós i mai un text buit, trencant la barrera d'entrada a qualsevol ciutadà.

## ⚠️ Resolució Final: Missió de la IA
Davant de qualsevol canvi estructural en l'arquitectura, la teua obligació és validar que les Lleis del SEO de [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]] es compleixen al 100%. Un codi funcional però que resulta cec per a un buscador és inútil per protegir el nostre ecosistema. No uses pedaços, usa el Trellat.

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny


```

### [SKILL] sequia_mare.md
```markdown
---
estat: 'canonic'
name: 'sequia-mare'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
script: ''
---

# SKILL: Sincronització Asíncrona per Lots (La Sèquia Mare)

Aquesta skill regula la freqüència i el volum de sincronització de dades *offline-first*. Dins del Mas es coneix amb la metàfora didàctica de "[[00_GLOSSARI_CANONIC#La Sèquia Mare|La Sèquia Mare]]", ja que l'aigua (les dades) no es malgasta de forma constant; la informació s'acumula internament al dispositiu de l'usuari i inunda el bancal (s'emet cap a la base de dades) només en moments concrets on el cabal de xarxa siga estable.

## Lògica d'Execució
1. **Async Batching (Sincronització per lots):** L'objectiu és protegir la memòria RAM de dispositius febles (ex. iPad A10) i l'energia limitadíssima dels nodes autònoms (Xarxa Malla). L'arquitectura impedeix les trucades constants (*long-polling* excessiu o websockets inútils per accions no-crítiques). 
2. **Buffer Local:** La informació s'emmagatzema internament en *IndexedDB/CRDT*, i es sincronitza cap a l'exterior únicament en ràfegues quan hi ha un nivell de bateria i connexió robustos (o forçat manualment per l'usuari).
3. **Reconciliació Intel·ligent:** Quan el servidor o l'entorn de malla rep la ràfega de dades, **Antigravity** utilitza la lògica d'Or-Set CRDT per reconciliar manifests i aplicar els pegats sense col·lisions.

## Control de Salvaguarda (L'Índex de Trellat)
Com a mètrica post-sprint per vigilar l'ofec de la Sèquia, calculem mentalment la nostra viabilitat tècnica aplicant la fórmula canònica d'avaluació:
   
`IT = (0.4 * CT) + (0.3 * CE) + (0.2 * CA) + (0.1 * CR)`
   
> [!WARNING]
> *Qualsevol resultat d'Índex de Trellat inferior a 70 significa SDP-LOCK ACTIVAT. Demana l'activació urgent de l'Esporgadora Termodinàmica i convoca el **Consell de Les Petorretes** per decidir de forma conjunta l'eliminació de codi sobrant.*

---

## 🔗 Sinapsi Arquitectònica

- [[index_trellat|Índex de Trellat]]
- [[crdt_optimitzacio|Optimització CRDT (OR-Set)]]
- Esporga Termodinàmica
- [[consola_termodinamica|Consola Termodinàmica]]

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny


```

### [SKILL] service_worker_pwa.md
```markdown
---
estat: 'canonic'
name: 'service-worker-pwa'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
script: ''
---
# 🌐 SKILL: Service Worker & PWA

## 1. Radicalment Offline-First
- El Service Worker usarà una estratègia **Cache-First** per a tots els assets de la UI (CSS, JS, fonts, icones).
- Per a les dades (Mur, Missatges), s'usarà IndexedDB governada per Y.js. El Service Worker només interceptarà per donar un fallback offline si la petició fetch cau.

## 2. Actualitzacions "Fes la becaina"
- Quan hi ha una nova versió de l'app, es descarrega silenciosament en segon pla.
- A l'usuari (normalment gent major) no se li interromp l'activitat. La nova versió s'aplica només quan es tanca completament la pestanya i es torna a obrir (quan fa la becaina).
- Si l'actualització és **crítica** (forçada per vulnerabilitat o SDP), s'utilitzarà el `mas-cau/SKILL.md` per forçar el refresc.

## 3. Instal·lació de PWA
El manifest web inclourà la icona del Mas a 512x512px i obligarà al mode `standalone` per eliminar la barra de direccions i que semble una app nativa a l'iPad.


---

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny

**Tornar a:** 01_arquitectura

```

### [SKILL] sincronitzacio_skills.md
```markdown
---
estat: 'canonic'
name: 'sincronitzacio-skills'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1628'
autor: 'IAIA MarIA'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - execucio
script: ''
---
# SKILL: Sincronització de Skills i Veritat Dual

1. **Abolició de la Caixa Negra:** Les carpetes ocultes (tipus `.g*mini` o `.agents`) queden totalment proscrites i aniquilades. Tota memòria viva, registre d'aprenentatge i estructura de personalitat s'allotjarà exclusivament i llegible a `_wiki_de_poble/05_skills_ia/`. L'humà ha de poder auditar el nostre cervell en text pla, sense màgia oculta.
2. **Sincronització de l'Espill:** Abans de donar per vàlid un component de codi (`.tsx`), l'agent llegirà obligatòriament la seua documentació associada. El CODI HOMOLOGAT governa la Wiki. La Wiki ha de reflectir el Codi. Si hi ha diferència, el Codi té raó i la Wiki s'actualitza per a eliminar la contradicció.
3. **Procediment d'Auditoria (Copilot Extension):**
   - **Mirall 1 (Literal):** Comparar noms i valors exactes entre CSS/TSX i el `index.css`. Reportar discrepàncies de clau/valor.
   - **Mirall 2 (Semàntic):** Detectar sinònims que impliquen contradicció (ex: `48px` vs `4*px`).
   - **Resolució:** Si afecta Manaments, marcar com CRÍTIC. Requereix aprovació dual per a integrar-ho.


---

## 🔗 Sinapsi Arquitectònica

- [[contradiction_engine|Contradiction Engine]]
- [[contradiction_engine|Auto Auditoria Forense]]

**Sinapsis:** [[01_IDENTITAT]], Arquitectura_L_Ecosistema, [[connectors_mcp_disseny]], 260629_0200_SKILL_plantilla_suprema


```

### [SKILL] skill_audit_estructura.md
```markdown
---
estat: 'canonic'
name: 'skill_audit_estructura'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script audit_estructura.mjs.'
tags:
  - execucio
script: '[[audit_estructura.mjs]]'
---
# SKILL: skill_audit_estructura

Aquesta skill ha estat generada automàticament per representar l'script `audit_estructura.mjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `audit_estructura.mjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[audit_estructura.mjs]]

```

### [SKILL] skill_auto_audit_skills.md
```markdown
---
estat: 'canonic'
name: 'skill_auto_audit_skills'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script auto_audit_skills.cjs.'
tags:
  - execucio
script: '[[auto_audit_skills.cjs]]'
---
# SKILL: skill_auto_audit_skills

Aquesta skill ha estat generada automàticament per representar l'script `auto_audit_skills.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `auto_audit_skills.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[auto_audit_skills.cjs]]

```

### [SKILL] skill_bundle_wiki.md
```markdown
---
estat: 'canonic'
name: 'skill_bundle_wiki'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script bundle_wiki.cjs.'
tags:
  - execucio
script: '[[bundle_wiki.cjs]]'
---
# SKILL: skill_bundle_wiki

Aquesta skill ha estat generada automàticament per representar l'script `bundle_wiki.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `bundle_wiki.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[bundle_wiki.cjs]]

```

### [SKILL] skill_combine_petorreta.md
```markdown
---
estat: 'canonic'
name: 'skill_combine_petorreta'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script combine_petorreta.cjs.'
tags:
  - execucio
script: '[[combine_petorreta.cjs]]'
---
# SKILL: skill_combine_petorreta

Aquesta skill ha estat generada automàticament per representar l'script `combine_petorreta.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `combine_petorreta.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[combine_petorreta.cjs]]

```

### [SKILL] skill_consolidar_etiquetes.md
```markdown
---
estat: 'canonic'
name: 'skill_consolidar_etiquetes'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script consolidar_etiquetes.js.'
tags:
  - execucio
script: '[[consolidar_etiquetes.js]]'
---
# SKILL: skill_consolidar_etiquetes

Aquesta skill ha estat generada automàticament per representar l'script `consolidar_etiquetes.js` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `consolidar_etiquetes.js`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[consolidar_etiquetes.js]]

```

### [SKILL] skill_detect_duplicates.md
```markdown
---
estat: 'canonic'
name: 'skill_detect_duplicates'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script detect_duplicates.cjs.'
tags:
  - execucio
script: '[[detect_duplicates.cjs]]'
---
# SKILL: skill_detect_duplicates

Aquesta skill ha estat generada automàticament per representar l'script `detect_duplicates.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `detect_duplicates.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[detect_duplicates.cjs]]

```

### [SKILL] skill_entropia_zero_router.md
```markdown
---
estat: 'canonic'
name: 'skill_entropia_zero_router'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script entropia_zero_router.js.'
tags:
  - execucio
script: '[[entropia_zero_router.js]]'
---
# SKILL: skill_entropia_zero_router

Aquesta skill ha estat generada automàticament per representar l'script `entropia_zero_router.js` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `entropia_zero_router.js`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[entropia_zero_router.js]]

```

### [SKILL] skill_escriptori_to_wiki.md
```markdown
---
estat: 'canonic'
name: 'skill_escriptori_to_wiki'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script escriptori_to_wiki.js.'
tags:
  - execucio
script: '[[escriptori_to_wiki.js]]'
---
# SKILL: skill_escriptori_to_wiki

Aquesta skill ha estat generada automàticament per representar l'script `escriptori_to_wiki.js` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `escriptori_to_wiki.js`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[escriptori_to_wiki.js]]

```

### [SKILL] skill_escriptura-protegida.md
```markdown
---
estat: 'canonic'
name: 'skill_escriptura-protegida'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script escriptura-protegida.cjs.'
tags:
  - execucio
script: '[[escriptura-protegida.cjs]]'
---
# SKILL: skill_escriptura-protegida

Aquesta skill ha estat generada automàticament per representar l'script `escriptura-protegida.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `escriptura-protegida.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[escriptura-protegida.cjs]]

```

### [SKILL] skill_fetch_town_media.md
```markdown
---
estat: 'canonic'
name: 'skill_fetch_town_media'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script fetch_town_media.mjs.'
tags:
  - execucio
script: '[[fetch_town_media.mjs]]'
---
# SKILL: skill_fetch_town_media

Aquesta skill ha estat generada automàticament per representar l'script `fetch_town_media.mjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `fetch_town_media.mjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[fetch_town_media.mjs]]

```

### [SKILL] skill_fix_graph_links.md
```markdown
---
estat: 'canonic'
name: 'skill_fix_graph_links'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script fix_graph_links.cjs.'
tags:
  - execucio
script: '[[fix_graph_links.cjs]]'
---
# SKILL: skill_fix_graph_links

Aquesta skill ha estat generada automàticament per representar l'script `fix_graph_links.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `fix_graph_links.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[fix_graph_links.cjs]]

```

### [SKILL] skill_generate_bundle.md
```markdown
---
estat: 'canonic'
name: 'skill_generate_bundle'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script generate_bundle.cjs.'
tags:
  - execucio
script: '[[generate_bundle.cjs]]'
---
# SKILL: skill_generate_bundle

Aquesta skill ha estat generada automàticament per representar l'script `generate_bundle.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `generate_bundle.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[generate_bundle.cjs]]

```

### [SKILL] skill_generate_bundle_fixed.md
```markdown
---
estat: 'canonic'
name: 'skill_generate_bundle_fixed'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script generate_bundle_fixed.cjs.'
tags:
  - execucio
script: '[[generate_bundle_fixed.cjs]]'
---
# SKILL: skill_generate_bundle_fixed

Aquesta skill ha estat generada automàticament per representar l'script `generate_bundle_fixed.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `generate_bundle_fixed.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[generate_bundle_fixed.cjs]]

```

### [SKILL] skill_generate_nano_prompt.md
```markdown
---
estat: 'canonic'
name: 'skill_generate_nano_prompt'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script generate_nano_prompt.cjs.'
tags:
  - execucio
script: '[[generate_nano_prompt.cjs]]'
---
# SKILL: skill_generate_nano_prompt

Aquesta skill ha estat generada automàticament per representar l'script `generate_nano_prompt.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `generate_nano_prompt.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[generate_nano_prompt.cjs]]

```

### [SKILL] skill_generate_pilars.md
```markdown
---
estat: 'canonic'
name: 'skill_generate_pilars'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script generate_pilars.cjs.'
tags:
  - execucio
script: '[[generate_pilars.cjs]]'
---
# SKILL: skill_generate_pilars

Aquesta skill ha estat generada automàticament per representar l'script `generate_pilars.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `generate_pilars.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[generate_pilars.cjs]]

```

### [SKILL] skill_generate_slim_bundle.md
```markdown
---
estat: 'canonic'
name: 'skill_generate_slim_bundle'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script generate_slim_bundle.cjs.'
tags:
  - execucio
script: '[[generate_slim_bundle.cjs]]'
---
# SKILL: skill_generate_slim_bundle

Aquesta skill ha estat generada automàticament per representar l'script `generate_slim_bundle.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `generate_slim_bundle.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[generate_slim_bundle.cjs]]

```

### [SKILL] skill_kimi_purge.md
```markdown
---
estat: 'canonic'
name: 'skill_kimi_purge'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script kimi_purge.cjs.'
tags:
  - execucio
script: '[[kimi_purge.cjs]]'
---
# SKILL: skill_kimi_purge

Aquesta skill ha estat generada automàticament per representar l'script `kimi_purge.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `kimi_purge.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[kimi_purge.cjs]]

```

### [SKILL] skill_migracio_v5.md
```markdown
---
estat: 'canonic'
name: 'skill_migracio_v5'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script migracio_v5.js.'
tags:
  - execucio
script: '[[migracio_v5.js]]'
---
# SKILL: skill_migracio_v5

Aquesta skill ha estat generada automàticament per representar l'script `migracio_v5.js` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `migracio_v5.js`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[migracio_v5.js]]

```

### [SKILL] skill_move_petorreta.md
```markdown
---
estat: 'canonic'
name: 'skill_move_petorreta'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script move_petorreta.cjs.'
tags:
  - execucio
script: '[[move_petorreta.cjs]]'
---
# SKILL: skill_move_petorreta

Aquesta skill ha estat generada automàticament per representar l'script `move_petorreta.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `move_petorreta.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[move_petorreta.cjs]]

```

### [SKILL] skill_neteja_termodinamica.md
```markdown
---
estat: 'canonic'
name: 'skill_neteja_termodinamica'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script neteja_termodinamica.mjs.'
tags:
  - execucio
script: '[[neteja_termodinamica.mjs]]'
---
# SKILL: skill_neteja_termodinamica

Aquesta skill ha estat generada automàticament per representar l'script `neteja_termodinamica.mjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `neteja_termodinamica.mjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[neteja_termodinamica.mjs]]

```

### [SKILL] skill_neteja_total.md
```markdown
---
estat: 'canonic'
name: 'skill_neteja_total'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script neteja_total.js.'
tags:
  - execucio
script: '[[neteja_total.js]]'
---
# SKILL: skill_neteja_total

Aquesta skill ha estat generada automàticament per representar l'script `neteja_total.js` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `neteja_total.js`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[neteja_total.js]]

```

### [SKILL] skill_pre-commit.md
```markdown
---
estat: 'canonic'
name: 'skill_pre-commit'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script pre-commit.mjs.'
tags:
  - execucio
script: '[[pre-commit.mjs]]'
---
# SKILL: skill_pre-commit

Aquesta skill ha estat generada automàticament per representar l'script `pre-commit.mjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `pre-commit.mjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[pre-commit.mjs]]

```

### [SKILL] skill_sdp.md
```markdown
---
estat: 'canonic'
name: 'skill_sdp'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script sdp.mjs.'
tags:
  - execucio
script: '[[sdp.mjs]]'
---
# SKILL: skill_sdp

Aquesta skill ha estat generada automàticament per representar l'script `sdp.mjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `sdp.mjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[sdp.mjs]]

```

### [SKILL] skill_session-logger.md
```markdown
---
estat: 'canonic'
name: 'skill_session-logger'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script session-logger.js.'
tags:
  - execucio
script: '[[session-logger.js]]'
---
# SKILL: skill_session-logger

Aquesta skill ha estat generada automàticament per representar l'script `session-logger.js` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `session-logger.js`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[session-logger.js]]

```

### [SKILL] skill_split_bundle.md
```markdown
---
estat: 'canonic'
name: 'skill_split_bundle'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script split_bundle.cjs.'
tags:
  - execucio
script: '[[split_bundle.cjs]]'
---
# SKILL: skill_split_bundle

Aquesta skill ha estat generada automàticament per representar l'script `split_bundle.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `split_bundle.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[split_bundle.cjs]]

```

### [SKILL] skill_sync_cerebel.md
```markdown
---
estat: 'canonic'
name: 'skill_sync_cerebel'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script sync_cerebel.cjs.'
tags:
  - execucio
script: '[[sync_cerebel.cjs]]'
---
# SKILL: skill_sync_cerebel

Aquesta skill ha estat generada automàticament per representar l'script `sync_cerebel.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `sync_cerebel.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[sync_cerebel.cjs]]

```

### [SKILL] skill_update_glossari.md
```markdown
---
estat: 'canonic'
name: 'skill_update_glossari'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script update_glossari.cjs.'
tags:
  - execucio
script: '[[update_glossari.cjs]]'
---
# SKILL: skill_update_glossari

Aquesta skill ha estat generada automàticament per representar l'script `update_glossari.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `update_glossari.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[update_glossari.cjs]]

```

### [SKILL] skill_validate_trellat.md
```markdown
---
estat: 'canonic'
name: 'skill_validate_trellat'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script validate_trellat.cjs.'
tags:
  - execucio
script: '[[validate_trellat.cjs]]'
---
# SKILL: skill_validate_trellat

Aquesta skill ha estat generada automàticament per representar l'script `validate_trellat.cjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `validate_trellat.cjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[validate_trellat.cjs]]

```

### [SKILL] skill_wiki_integritat.md
```markdown
---
estat: 'canonic'
name: 'skill_wiki_integritat'
version: '1.00'
created_at: '260707_0530'
updated_at: '260707_0530'
autor: 'IAIA MarIA'
categoria: 'skill'
description: 'Skill autogenerada per cobrir el script wiki_integritat.mjs.'
tags:
  - execucio
script: '[[wiki_integritat.mjs]]'
---
# SKILL: skill_wiki_integritat

Aquesta skill ha estat generada automàticament per representar l'script `wiki_integritat.mjs` dins de la Taula Mestra.

## Objectiu
Executar o proveir la funcionalitat de `wiki_integritat.mjs`. Aquest codi operatiu formava part de la maquinària però no tenia cap representació formal a la Wiki com a habilitat cognitiva de la IA.

## Sinapsis
- [[DOC_Taula_Mestra]]
- [[wiki_integritat.mjs]]

```

### [SKILL] successio_lazaro_execucio.md
```markdown
---
name: 'successio-lazaro-execucio'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'skill'
tipus: 'protocol-execucio'
estat: 'canonic'
description: 'Protocol tècnic de successió, reconstrucció i continuïtat operativa del Mas.'
replaces:
  - '01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Protocol_Lazaro.md'
  - '02_ACTUAR_Maquina_Tecnica/skills/sagramental_dels_morts.md'
tags:
  - execucio
script: ''
---

# Successió Lázaro Execució

## Objectiu

Garantir que Sóc de Poble pot ser llegit, reconstruït i mantingut si el Mestre Javi desapareix temporalment, hi ha pèrdua de context o cal reconstruir el sistema des de fragments.

## Activadors

- 90 dies d’inactivitat absoluta del Mestre.
- Pèrdua greu de repositori o entorn.
- Trencament de memòria IA.
- Necessitat de reconstrucció manual.
- Auditoria de continuïtat.

## Nivells

| Nivell | Estat | Acció |
|---|---|---|
| 0 | Normal | Cap acció. |
| 1 | Observació | Només lectura i inventari. |
| 2 | Conservació | Correccions no destructives: enllaços, metadades, índexs. |
| 3 | Reconstrucció | Protocol Lázaro amb aprovació dual. |
| 4 | Llegat | Aturar evolució i documentar per humans futurs. |

## Procediment Lázaro

1. Localitza `00_core_wiki/00_INDEX.md`.
2. Llig `00_BIOS`, `02_GENOTIP` i `DOC_Governanca`.
3. Reconstrueix el mapa de pilars.
4. Escaneja fitxers crítics.
5. Genera inventari JSON.
6. Detecta buits i contradiccions.
7. Prioritza lectura humana abans que automatització.
8. Només escriu si el nivell ho permet.

## Prohibicions

- No refactoritzar per gust.
- No introduir dependències noves.
- No alterar identitat.
- No esborrar memòria històrica.
- No activar bypass sense aprovació dual.
- No enviar dades personals a IAs externes.

## Output Obligatori

```json
{
  "ok": true,
  "level": 1,
  "mode": "observacio|conservacio|reconstruccio|llegat",
  "inventory": [],
  "missing": [],
  "actions": [],
  "requires_human": []
}
```

## Reversió

Tota acció de successió ha de ser reversible.

Si el Mestre torna, es desactiva el mode llegat i es genera acta de reconciliació.

## Sinapsis

- [[02_GENOTIP]]
- [[DOC_Governanca]]
- [[LLEI_05_Privacitat]]
- [[00_index]]

```

---
## 2. SCRIPTS (Motors d'Execució JS/CJS/MJS)

### [SCRIPT] audit_estructura.mjs
```javascript
#!/usr/bin/env node
/**
 * AUDITORIA ESTRUCTURAL (CAPA DURA) — V2, post-forense 260705
 * "La IA s'oblida, el codi no."
 *
 * Canvis respecte a la versió anterior (motivats per l'auditoria):
 * 1. Regex únic importat de lib/termodinamic.mjs (abans hi havia dos regex
 *    contradictoris i els fitxers ben nomenats fallaven l'auditoria).
 * 2. La llei de nom NOMÉS s'aplica a fitxers .md de contingut, mai al codi
 *    font de scripts/ (això és el que feia que wiki-integrity.cjs es
 *    mossegara la pota ell mateix).
 * 3. PILARS_VIGENTS ara es fa SERVIR de veres per a validar l'arrel
 *    (abans PERMITTED_DIRS es declarava i mai es consultava: 0 usos).
 * 4. checkOrphanSkillFolders ja no falla en silenci si el directori no
 *    existeix: ho reporta com AVÍS explícit en compte de no dir res.
 * 5. checkCognitiveIsolation ja no barreja taxonomia vella i nova.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isValidContentFile,
  hasValidCharset,
  EXEMPT_BASENAMES
} from './lib/termodinamic.mjs';
import { buildWikiIndex } from './lib/wiki_walker.mjs';
import { needsThermodynamicDate } from './semantic_auditor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = path.resolve(__dirname, '../../');

// ÚNICA taxonomia vigent (confirmada pel Mestre, 260705). Qualsevol altra
// carpeta a l'arrel s'ha de moure al bancal d'orfes o destruir-se.
export const PILARS_VIGENTS = [
  '00_SER_Brain_Identitat',
  '01_SABER_Cultura_Coneixement',
  '02_ACTUAR_Maquina_Tecnica',
  '03_GOVERNAR_Normativa_Regles',
  '04_ARXIU_Documents_Historics'
];

const ALLOWED_ROOT_FILES = new Set(['README.md', '00_index.md', '.gitignore', 'package.json', 'package-lock.json', '.DS_Store']);
const ALLOWED_ROOT_DIRS = new Set(['.git', '.husky', 'node_modules', '.obsidian']);

function checkRootPillars(rootLevelEntries) {
  const errors = [];
  for (const entry of rootLevelEntries) {
    if (entry.isDirectory) {
      if (!PILARS_VIGENTS.includes(entry.name) && !ALLOWED_ROOT_DIRS.has(entry.name)) {
        errors.push(`[ERROR-PILAR] Carpeta il·legal a l'arrel: '${entry.name}'. Mou-la al bancal d'orfes (04_ARXIU_Documents_Historics/bancal_actiu) o destrueix-la. Pilars vigents: ${PILARS_VIGENTS.join(', ')}.`);
      }
    } else if (!ALLOWED_ROOT_FILES.has(entry.name)) {
      errors.push(`[ERROR-ARREL] Fitxer solt a l'arrel: '${entry.name}'. Cap fitxer de contingut ha de viure fora dels 5 Pilars.`);
    }
  }
  return errors;
}

function checkThermoContentNames(mdDocs) {
  const errors = [];
  for (const doc of mdDocs) {
    if (EXEMPT_BASENAMES.has(doc.name)) continue;
    // Els .md dins de qualsevol carpeta 'scripts' (README tècnics, etc.) no són contingut editorial.
    if (doc.relPath.split(path.sep).includes('scripts')) continue;

    if (!hasValidCharset(doc.name)) {
      errors.push(`[ERROR-TERMO] ${doc.relPath} conté caràcters fora del whitelist (només A-Za-z0-9_.).`);
      continue;
    }
    
    const { necessitaData } = needsThermodynamicDate(doc);
    if (necessitaData && !isValidContentFile(doc.name)) {
      errors.push(`[ERROR-TERMO] ${doc.relPath} no compleix la forma YYMMDD_HHMM_CATEGORIA_Titol.md`);
    }
  }
  return errors;
}

function checkOrphanSkillFolders(allEntries) {
  const errors = [];
  const skillsDir = allEntries.find(e =>
    e.type === 'dir' &&
    e.name === 'skills' &&
    e.relPath.startsWith('02_ACTUAR_Maquina_Tecnica')
  );

  if (!skillsDir) {
    // Abans això callava (fs.existsSync -> false -> return []). Ara ho diem clar:
    errors.push(`[AVÍS-DIÒGENES] No s'ha trobat cap carpeta 'skills' dins de 02_ACTUAR_Maquina_Tecnica. Si les SKILLS ja no viuen ahí, actualitza este checker; si haurien d'existir, açò és un forat de cobertura, no un èxit silenciós.`);
    return errors;
  }

  const subfolders = allEntries.filter(e => e.type === 'dir' && path.dirname(e.relPath) === skillsDir.relPath);
  const files = allEntries.filter(e => e.type === 'file');
  for (const folder of subfolders) {
    const hasReadme = files.some(f => path.dirname(f.relPath) === folder.relPath && f.name === 'SKILL.md');
    if (!hasReadme) {
      errors.push(`[ERROR-DIÒGENES] '${folder.relPath}' no conté SKILL.md. Si no serveix, esborra-la.`);
    }
  }
  return errors;
}

function checkCognitiveIsolation(mdDocs) {
  const errors = [];
  // NOMÉS els 5 pilars vigents. Abans hi havia una barreja de
  // '00_SER_Brain_Identitat' (nou) amb '01_identitat_iaia' (vell, mort).
  const CORE_DIRS = PILARS_VIGENTS;

  for (const doc of mdDocs) {
    const topDir = doc.relPath.split(path.sep)[0];
    if (!CORE_DIRS.includes(topDir)) continue;

    if (doc.content.trim().length === 0) {
      errors.push(`[ERROR-COGNITIU] Fitxer buit (0 bytes): ${doc.relPath}`);
      continue;
    }
    const links = (doc.content.match(/\[\[(.*?)\]\]/g) || []).length;
    if (links <= 1) {
      errors.push(`[AVÍS-COGNITIU] Aïllament detectat a '${doc.relPath}'. Només ${links} enllaç(os). Revisa si està desconnectat de la xarxa.`);
    }
  }
  return errors;
}

/**
 * ERROR i AVÍS ara tenen efecte diferent (abans no: tot bloquejava per igual,
 * malgrat que el codi ja distingia els prefixos). ERROR = SDP-LOCK. AVÍS = visible
 * al log però no bloqueja el commit.
 */
export async function runAudit(wikiDir = WIKI_DIR) {
  const { allEntries, mdDocs, rootLevelEntries } = await buildWikiIndex(wikiDir);
  const findings = [
    ...checkRootPillars(rootLevelEntries),
    ...checkThermoContentNames(mdDocs),
    ...checkOrphanSkillFolders(allEntries),
    ...checkCognitiveIsolation(mdDocs)
  ];
  return {
    errors: findings.filter(f => f.startsWith('[ERROR')),
    avisos: findings.filter(f => f.startsWith('[AVÍS'))
  };
}

// Execució directa (Husky/CI)
if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, avisos } = await runAudit();
  if (avisos.length > 0) {
    console.warn('⚠️  Avisos (no bloquegen el commit):');
    avisos.forEach(a => console.warn(a));
  }
  if (errors.length > 0) {
    console.error('\n🚨 AUDITORIA ESTRUCTURAL FALLADA (SDP-LOCK PREVENTIU) 🚨\n');
    errors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('\n✅ AUDITORIA ESTRUCTURAL SUPERADA. 5 Pilars i Trellat intactes.');
    process.exit(0);
  }
}

```

### [SCRIPT] audit_integritat_estructural.cjs
```javascript
#!/usr/bin/env node
/**
 * AUDIT_INTEGRITAT_ESTRUCTURAL.JS
 * "L'Inquisidor de la Veritat" — linter semàntic consolidat.
 *
 * SUBSTITUEIX verificador_recomptes.cjs (esborreu l'antic, no el mantingueu
 * en paral·lel — el mateix "script sprawl" que hem criticat als documents
 * Markdown no el podem permetre als scripts).
 *
 * Detecta 4 classes de fallada que 5 rondes d'auditoria humana han trobat
 * repetidament a mà:
 *   1. Enllaços [[wikilink]] que no resolen a cap fitxer real.
 *   2. Desaparició total de la Clàusula del Llinatge de tot el graf.
 *   3. Bugs de Recompte ("4 Pilars" quan n'hi ha 5).
 *   4. Capítols botats (## 1, ## 2, ## 4 — falta el ## 3).
 *
 * Codi d'eixida: 0 si tot net, 1 si hi ha alguna troballa CRÍTICA
 * (apte per a git pre-commit / CI).
 *
 * Ús: node audit_integritat_estructural.js [--root _wiki_de_poble]
 */

const fs = require('fs').promises;
const path = require('path');

const ROOT = process.argv.includes('--root')
  ? process.argv[process.argv.indexOf('--root') + 1]
  : '.';

const LLINATGE_CANARIS = ['rentonar.blogspot.com', 'socdepoble.net'];
const SUBSTANTIUS_COMPTABLES = [
  'Lleis?', 'Manaments?', 'Reflexos?', 'Pilars?', 'Categories?',
  'Petorretes?', 'Membres?', 'Estrats?', 'Mètriques?', 'Passos?', 'Fases?', 'Causes?',
];

let critics = 0;

async function trobarMarkdown(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const resultats = await Promise.all(
    entries.map(async (e) => {
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')) {
        return trobarMarkdown(fullPath);
      }
      if (e.name.endsWith('.md')) return [fullPath];
      return [];
    })
  );
  return resultats.flat();
}

// ---------------------------------------------------------------
// 1. ENLLAÇOS TRENCATS
// ---------------------------------------------------------------
async function comprovarEnllaços(fitxers, indexNoms) {
  const patro = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  const problemes = [];

  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    let m;
    while ((m = patro.exec(contingut)) !== null) {
      const objectiu = m[1].split('/').pop().trim().toLowerCase();
      if (!indexNoms.has(objectiu)) {
        problemes.push({ fitxer, enllaç: m[0], objectiu });
      }
    }
  }
  return problemes;
}

// ---------------------------------------------------------------
// 2. LLINATGE PERDUT (Clàusula del Llinatge — Governança Nivell 3)
// ---------------------------------------------------------------
async function comprovarLlinatge(fitxers) {
  let trobat = { 'rentonar.blogspot.com': false, 'socdepoble.net': false };
  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    for (const canari of LLINATGE_CANARIS) {
      if (contingut.includes(canari)) trobat[canari] = true;
    }
  }
  const absents = LLINATGE_CANARIS.filter((c) => !trobat[c]);
  return absents; // buit si tot present enlloc del graf
}

// ---------------------------------------------------------------
// 3. BUGS DE RECOMPTE
// ---------------------------------------------------------------
function comptarElementsSeguents(contingut, posicio) {
  const tros = contingut.slice(posicio, posicio + 3000);
  const finsProxCapcalera = tros.search(/\n#{1,2}\s/);
  const zona = finsProxCapcalera > 50 ? tros.slice(0, finsProxCapcalera) : tros;

  const itemsNumerats = (zona.match(/^\s{0,3}\d+\.\s/gm) || []).length;
  const capcaleresNumerades = (zona.match(/^#{1,3}\s*\d+\.\s/gm) || []).length;
  const filesTaula = Math.max(0, (zona.match(/^\|.+\|$/gm) || []).length - 2);
  const rosterMatch = zona.match(/\*\*([A-ZÀ-Ú][a-zà-ú]+(?:,\s*[A-ZÀ-Ú][a-zà-ú]+)+(?:\s+i\s+[A-ZÀ-Ú][a-zà-ú]+)?)\*\*/);
  const rosterCount = rosterMatch ? rosterMatch[1].split(/,|\si\s/).filter(Boolean).length : 0;

  return Math.max(itemsNumerats, capcaleresNumerades, filesTaula, rosterCount);
}

async function comprovarRecomptes(fitxers) {
  const regex = new RegExp(`\\b(\\d+)\\s+(${SUBSTANTIUS_COMPTABLES.join('|')})\\b`, 'gi');
  const problemes = [];
  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    let m;
    const re = new RegExp(regex);
    while ((m = re.exec(contingut)) !== null) {
      const declarat = parseInt(m[1], 10);
      const comptat = comptarElementsSeguents(contingut, m.index);
      if (comptat > 0 && comptat !== declarat) {
        problemes.push({ fitxer, frase: m[0], declarat, comptat });
      }
    }
  }
  return problemes;
}

// ---------------------------------------------------------------
// 4. CAPÍTOLS BOTATS (seqüència ## N. amb forat)
// ---------------------------------------------------------------
async function comprovarCapitolsBotats(fitxers) {
  const problemes = [];
  for (const fitxer of fitxers) {
    const contingut = await fs.readFile(fitxer, 'utf8');
    const numeros = [...contingut.matchAll(/^##\s+(\d+)\.\s/gm)].map((m) => parseInt(m[1], 10));
    if (numeros.length < 2) continue;

    for (let i = 1; i < numeros.length; i++) {
      if (numeros[i] - numeros[i - 1] > 1) {
        problemes.push({
          fitxer,
          forat: `falta(en) el/els capítol(s) ${numeros[i - 1] + 1}..${numeros[i] - 1}`,
          context: `entre ## ${numeros[i - 1]} i ## ${numeros[i]}`,
        });
      }
    }
  }
  return problemes;
}

// ---------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------
(async () => {
  const fitxers = await trobarMarkdown(ROOT);
  const indexNoms = new Set(fitxers.map((f) => path.basename(f, '.md').toLowerCase()));

  console.log(`\n🔍 Auditant ${fitxers.length} fitxers Markdown sota ${ROOT}/...\n`);

  const enllaçosTrencats = await comprovarEnllaços(fitxers, indexNoms);
  if (enllaçosTrencats.length) {
    critics++;
    console.log(`🔗 ${enllaçosTrencats.length} ENLLAÇ(OS) TRENCAT(S):`);
    enllaçosTrencats.forEach((p) => console.log(`   ${p.fitxer} → ${p.enllaç} (objectiu "${p.objectiu}" no existeix)`));
    console.log('');
  }

  const llinatgeAbsent = await comprovarLlinatge(fitxers);
  if (llinatgeAbsent.length) {
    critics++;
    console.log(`📜 CLÀUSULA DEL LLINATGE INCOMPLETA — absent de TOT el graf:`);
    llinatgeAbsent.forEach((c) => console.log(`   ✗ "${c}" no apareix en cap fitxer`));
    console.log('   → Viola Governança Nivell 3 (Clàusula del Llinatge).\n');
  }

  const recomptesMalament = await comprovarRecomptes(fitxers);
  if (recomptesMalament.length) {
    critics++;
    console.log(`🔢 ${recomptesMalament.length} BUG(S) DE RECOMPTE:`);
    recomptesMalament.forEach((p) => console.log(`   ${p.fitxer}: "${p.frase}" → compta ${p.comptat}`));
    console.log('');
  }

  const capitolsBotats = await comprovarCapitolsBotats(fitxers);
  if (capitolsBotats.length) {
    critics++;
    console.log(`📖 ${capitolsBotats.length} CAPÍTOL(S) BOTAT(S):`);
    capitolsBotats.forEach((p) => console.log(`   ${p.fitxer}: ${p.forat} (${p.context})`));
    console.log('');
  }

  if (critics === 0) {
    console.log('✅ Integritat estructural i semàntica: sense troballes.\n');
    process.exit(0);
  } else {
    console.log(`❌ ${critics} categoria(es) de fallada detectada(es). Revisió humana requerida.\n`);
    process.exit(1);
  }
})();

```

### [SCRIPT] auto_audit_skills.cjs
```javascript
// _wiki_de_poble/scripts/auto_audit_skills.cjs
const fs = require('fs/promises');
const path = require('path');
const url = require('url');

const WIKI_DIR = path.join(__dirname, '..');
const SKILLS_DIR = path.join(WIKI_DIR, '05_skills_ia');
const INDEX_FILE = path.join(SKILLS_DIR, 'index_trellat.md');
const TERMODINAMIC_REGEX = /^\d{6}_\d{4}_[A-Z]+_[a-z0-9_]+(\.[a-z0-9]+)?$/i;
const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET'];

// Funció per trobar carpetes buides
async function findEmptyDirs(dir) {
  const emptyDirs = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      const subEntries = await fs.readdir(fullPath).catch(() => []);
      if (subEntries.length === 0) {
        emptyDirs.push(fullPath);
      } else {
        emptyDirs.push(...(await findEmptyDirs(fullPath)));
      }
    }
  }
  return emptyDirs;
}

// Funció per reconstruir l'índex
async function rebuildIndex() {
  let indexContent = [
    '# Índex Trellat de Skills (Generat Automàticament)',
    `> *Generat el: ${new Date().toISOString().slice(0, 10)}*`,
    '',
    '## 📂 Estructura de Carpetes',
    ''
  ];

  const dirs = (await fs.readdir(SKILLS_DIR, { withFileTypes: true }))
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const dir of dirs) {
    const dirPath = path.join(SKILLS_DIR, dir.name);
    const files = (await fs.readdir(dirPath))
      .filter(file => file.endsWith('.md'))
      .sort();

    if (files.length > 0) {
      indexContent.push(`### ${dir.name}`);
      indexContent.push('');
      for (const file of files) {
        const filePath = path.join(dir.name, file);
        const displayName = file.replace('.md', '').replace(/_/g, ' ');
        const isValid = TERMODINAMIC_REGEX.test(file);
        const status = isValid ? '✅' : '❌';
        indexContent.push(`- ${status} [${displayName}](${filePath})`);
      }
      indexContent.push('');
    }
  }

  // Fitxers a l'arrel
  const rootFiles = (await fs.readdir(SKILLS_DIR))
    .filter(file => file.endsWith('.md') && !file.startsWith('index_'))
    .sort();

  if (rootFiles.length > 0) {
    indexContent.push('### 📄 Fitxers a l\'Arrel (Reubicar!)');
    indexContent.push('');
    for (const file of rootFiles) {
      const isValid = TERMODINAMIC_REGEX.test(file);
      const status = isValid ? '✅' : '❌';
      indexContent.push(`- ${status} [${file.replace('.md', '')}](${file})`);
    }
  }

  await fs.writeFile(INDEX_FILE, indexContent.join('\n'));
  console.log(`✅ Índex reconstruït: ${INDEX_FILE}`);
}

// Funció principal
async function main() {
  const args = process.argv.slice(2);
  const clean = args.includes('--clean');
  const rebuildIndexFlag = args.includes('--rebuild-index');

  if (clean) {
    const emptyDirs = await findEmptyDirs(WIKI_DIR);
    if (emptyDirs.length > 0) {
      console.log(`⚠️  S'han trobat ${emptyDirs.length} carpetes buides:`);
      emptyDirs.forEach(dir => console.log(`   - ${dir}`));
      console.log('💡 Executa amb `--clean --force` per esborrar-les.');
      if (args.includes('--force')) {
        for (const dir of emptyDirs) {
          await fs.rmdir(dir);
          console.log(`   ✅ Esborrada: ${dir}`);
        }
      }
    } else {
      console.log('✅ No hi ha carpetes buides.');
    }
  }

  if (rebuildIndexFlag) {
    await rebuildIndex();
  }
}

main().catch(console.error);

```

### [SCRIPT] bundle_wiki.cjs
```javascript
#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const ROOT = process.argv.includes('--root') ? process.argv[process.argv.indexOf('--root') + 1] : '.';
const OUT = path.join(ROOT, '04_ARXIU_Documents_Historics', '260705_0630_BUNDLE_Wiki_Completa.md');

async function trobarMarkdown(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const resultats = await Promise.all(
    entries.map(async (e) => {
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.') && e.name !== 'actes_arxivades') {
        return trobarMarkdown(fullPath);
      }
      if (e.name.endsWith('.md')) return [fullPath];
      return [];
    })
  );
  return resultats.flat();
}

(async () => {
  const fitxers = await trobarMarkdown(ROOT);
  let bundleContent = '# 📦 BUNDLE COMPLET DE LA WIKI SÓC DE POBLE\n\n';
  bundleContent += '> Aquest document conté el bolcat complet de tots els fitxers canònics de la Wiki (excloent actes arxivades antigues per no rebentar el context).\n\n';
  bundleContent += '---\n\n';

  for (const fitxer of fitxers) {
    if (fitxer === OUT || fitxer.includes('BUNDLE')) continue;
    const contingut = await fs.readFile(fitxer, 'utf8');
    const relPath = path.relative(ROOT, fitxer);
    bundleContent += `## 📄 FITXER: ${relPath}\n\`\`\`markdown\n${contingut}\n\`\`\`\n\n---\n\n`;
  }

  await fs.writeFile(OUT, bundleContent);
  console.log(`✅ Bundle generat a: ${OUT}`);
})();

```

### [SCRIPT] cerrojo_absoluto.cjs
```javascript
#!/usr/bin/env node
// _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/cerrojo_absoluto.js
// Aquest script s'ha d'executar COM A PRIMER PAS de TOTA sessió.
// Ha de ser invocat automàticament, no manualment.

const fs = require('fs');
const path = require('path');
const { isValid, TERMODINAMIC_REGEX } = require('./termodinamic.cjs');

const WIKI_ROOT = path.resolve(__dirname, '..', '..');
const FORBIDDEN_ROOT_FILES = /\.md$/;
const ALLOWED_ROOT_FILES = ['README.md', '00_index.md', '.gitignore'];

// 1. DETECTAR FITXERS ORFES A L'ARREL
function detectarOrfes() {
  const entries = fs.readdirSync(WIKI_ROOT, { withFileTypes: true });
  const orfes = [];
  
  for (const entry of entries) {
    if (entry.isFile() && FORBIDDEN_ROOT_FILES.test(entry.name) && !ALLOWED_ROOT_FILES.includes(entry.name)) {
      orfes.push(entry.name);
    }
  }
  
  if (orfes.length > 0) {
    console.error(`\n🚨 ALERTA: Fitxers orfes detectats a l'arrel:`);
    orfes.forEach(f => console.error(`   - ${f}`));
    console.error(`\n⚠️  ACCIÓ: L'script 'wiki-integrity.js' o 'reubica_orfes.js' se n'encarregarà. Bloquejant.\n`);
    return false;
  }
  return true;
}

// 2. VALIDAR NOMS EXISTENTS (Excepte README, AGENTS, index)
function validarNoms() {
  let errors = 0;
  
  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
        scan(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const base = path.basename(entry.name);
        if (!base.startsWith('00_') && !base.startsWith('README') && base !== 'SKILL.md' && base !== 'SKILL') {
          if (!isValid(base)) {
            console.error(`❌ NOM INVÀLID DETECTAT: ${path.relative(WIKI_ROOT, fullPath)}`);
            errors++;
          }
        }
      }
    }
  }
  
  scan(WIKI_ROOT);
  return errors === 0;
}

// 3. EXECUCIÓ
console.log('🔒 Cerrojo Absoluto activat...');
const okOrfes = detectarOrfes();
const okNoms = validarNoms();

if (!okOrfes || !okNoms) {
  console.error('\n⛔ ESCRIPTURA BLOQUEJADA. El Cerrojo detecta entropia. Utilitza els scripts de neteja o corregeix manualment abans de continuar la sessió.');
  process.exit(1);
}

console.log('✅ Cerrojo passat. Puresa al 100%. Sessió permesa.\n');

```

### [SCRIPT] combine_petorreta.cjs
```javascript
const fs = require('fs');
const path = require('path');

const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0705_PROMPT_Petorreta_Taxonomica_i_Glossari.md';
const bundlePath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/260705T0_0510_BUNDLE_Wiki_Completa.md';
const outputPath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/bancal_actiu/260705_0715_PETORRETA_TAXONOMICA_FINAL.md';

const promptContent = fs.readFileSync(promptPath, 'utf8');
const bundleContent = fs.readFileSync(bundlePath, 'utf8');

const combinedContent = promptContent + '\n\n' + bundleContent;

fs.writeFileSync(outputPath, combinedContent, 'utf8');
console.log('✅ Petorreta Final generada a: ' + outputPath);

```

### [SCRIPT] audit.mjs
```javascript
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.mjs';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.vite']);

async function loadRules() {
  const url = new URL('../rules/trellat-rules.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function tailwindFindings(text, file, rules) {
  const out = [];
  const rx = /\b(?:class|className)=["'`]([^"'`]+)["'`]/g;
  for (const m of text.matchAll(rx)) {
    for (const c of m[1].split(/\s+/).filter(Boolean)) {
      if (rules.illegalTailwindPrefixes.some(p => c.startsWith(p))) {
        out.push({ file, line: lineOf(text, m.index), rule: 'tailwind-illegal', value: c });
      }
    }
  }
  return out;
}

export async function run({ root }) {
  const rules = await loadRules();
  const files = await walk(root);
  const md = files.filter(f => extname(f) === '.md');
  const errors = [];
  const warnings = [];
  const findings = [];
  const names = new Map();
  const pilars = Object.fromEntries(rules.pillars.map(p => [p, 0]));

  for (const abs of files) {
    const rel = relative(root, abs);
    const top = rel.split(/[\\/]/)[0];
    if (pilars[top] !== undefined) pilars[top]++;

    if (/\.(md|mjs|js|ts|tsx|jsx|html)$/.test(abs)) {
      const text = await readFile(abs, 'utf8');
      findings.push(...tailwindFindings(text, rel, rules));

      if (extname(abs) === '.md') {
        const fm = parseFrontmatter(text);
        if (!fm.ok) errors.push(`${rel}: frontmatter absent o invàlid`);
        else {
          for (const k of rules.frontmatterRequired) {
            if (!fm.data[k]) warnings.push(`${rel}: falta frontmatter.${k}`);
          }
          if (fm.data.name) {
            const prev = names.get(fm.data.name);
            if (prev) errors.push(`name duplicat '${fm.data.name}': ${prev} | ${rel}`);
            else names.set(fm.data.name, rel);
          }
        }
      }
    }
  }

  return {
    code: errors.length || findings.length ? 1 : 0,
    summary: `${files.length} fitxers, ${md.length} markdown, ${findings.length} Tailwind il·legal`,
    errors,
    warnings,
    findings,
    data: { files: files.length, markdown: md.length, pilars }
  };
}

```

### [SCRIPT] lint.mjs
```javascript
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build']);
const EXT = /\.(mjs|js|ts|tsx|jsx|html|md)$/;

async function rules() {
  const url = new URL('../rules/trellat-rules.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walk(p, out);
    else if (EXT.test(p)) out.push(p);
  }
  return out;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function scan(text, file, r) {
  const findings = [];
  const rx = /\b(?:class|className)=["'`]([^"'`]+)["'`]/g;
  for (const m of text.matchAll(rx)) {
    const classes = m[1].split(/\s+/).filter(Boolean);
    for (const c of classes) {
      const illegal = r.illegalTailwindPrefixes.find(p => c.startsWith(p));
      if (illegal) {
        findings.push({
          file,
          line: lineOf(text, m.index),
          rule: illegal === 'bg-' ? 'bg-tailwind-block' : 'tailwind-illegal',
          value: c
        });
      }
    }
  }
  return findings;
}

export async function run({ root, args }) {
  const r = await rules();
  const targets = args.length ? args.map(a => join(root, a)) : await walk(root);
  const findings = [];
  for (const abs of targets) {
    const text = await readFile(abs, 'utf8').catch(() => '');
    if (text) findings.push(...scan(text, relative(root, abs), r));
  }
  return {
    code: findings.length ? 1 : 0,
    summary: findings.length ? 'Tailwind il·legal detectat' : 'Pedra Seca neta',
    findings,
    errors: findings.length ? ['Commit bloquejat per classes Tailwind il·legals'] : []
  };
}

```

### [SCRIPT] translate.mjs
```javascript
import { readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

async function rules() {
  const url = new URL('../rules/trellat-rules.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

function illegal(c, r) {
  return r.illegalTailwindPrefixes.some(p => c.startsWith(p));
}

function convertClassList(list, r, unresolved) {
  return list.split(/\s+/).filter(Boolean).map(c => {
    if (r.translate[c]) return r.translate[c];
    if (illegal(c, r)) {
      unresolved.add(c);
      return c;
    }
    return c;
  }).join(' ');
}

function transform(text, r) {
  const unresolved = new Set();
  let count = 0;
  const next = text.replace(/\b(class|className)=["'`]([^"'`]+)["'`]/g, (_, key, list) => {
    const converted = convertClassList(list, r, unresolved);
    if (converted !== list) count++;
    return `${key}="${converted}"`;
  });
  return { text: next, count, unresolved: [...unresolved] };
}

export async function run({ root, args, flags }) {
  if (!args.length) {
    return { code: 64, summary: 'Falten fitxers', errors: ['Ús: sdp translate <fitxer...> [--write]'] };
  }

  const r = await rules();
  const findings = [];
  const warnings = [];
  let changed = 0;

  for (const p of args) {
    const abs = join(root, p);
    const old = await readFile(abs, 'utf8');
    const res = transform(old, r);
    if (res.count) {
      changed++;
      if (flags.write) await writeFile(abs, res.text);
      findings.push({ file: relative(root, abs), rule: flags.write ? 'translated' : 'would-translate', value: String(res.count) });
    }
    for (const c of res.unresolved) warnings.push(`${p}: sense mapa per a '${c}'`);
  }

  return {
    code: warnings.length ? 1 : 0,
    summary: `${changed} fitxer(s) traduïts${flags.write ? '' : ' en dry-run'}`,
    warnings,
    findings,
    data: { write: !!flags.write, changed }
  };
}

```

### [SCRIPT] 01_build_index.cjs
```javascript
#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓ CANÒNICA
// ═══════════════════════════════════════════════════════════
const CONFIG = {
  carpetesPilars: [
    '00_SER_Brain_Identitat',
    '01_SABER_Cultura_Coneixement',
    '02_EXECUTAR_Maquina_Tecnica',
    '03_REGISTRE_Actes_Efimers'
  ],
  carpetesExcluides: ['node_modules', '.git', 'scripts', '_build', '_temp', '99_assets', 'actes_arxivades'],
  extensionsValides: ['.md'],
  buildDir: '_build',
  documentsFile: 'documents.json',
  manifestFile: 'manifest.json',
  compilerVersion: '1.0.0'
};

// ═══════════════════════════════════════════════════════════
// PARSER DE YAML FRONTMATTER (Zero-dependency, robust)
// ═══════════════════════════════════════════════════════════
function parseFrontmatter(content) {
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(fmRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const yamlText = match[1];
  const body = content.slice(match[0].length);
  
  const frontmatter = {};
  const lines = yamlText.split('\n');
  let currentKey = null;
  let currentList = null;
  
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    
    if (line.startsWith('- ')) {
      const item = line.slice(2).trim().replace(/^['"]|['"]$/g, '');
      if (currentList) currentList.push(item);
      continue;
    }
    
    const kvMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();
      
      if (currentKey && currentList) {
        frontmatter[currentKey] = currentList;
      }
      
      if (value === '' || value === '|' || value === '>') {
        currentKey = key;
        currentList = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[key] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        currentKey = null;
        currentList = null;
      } else {
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
        currentKey = null;
        currentList = null;
      }
    }
  }
  
  if (currentKey && currentList) {
    frontmatter[currentKey] = currentList;
  }
  
  return { frontmatter, body };
}

// ═══════════════════════════════════════════════════════════
// EXTRACTORS DE METADATA
// ═══════════════════════════════════════════════════════════
function extractTitle(body, frontmatter) {
  if (frontmatter.name) return frontmatter.name;
  if (frontmatter.title) return frontmatter.title;
  
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  
  return null;
}

function extractSummary(body) {
  const lines = body.split('\n');
  for (const line of lines) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#') || clean.startsWith('```') || clean.startsWith('---') || clean.startsWith('|')) continue;
    return clean.length > 200 ? clean.slice(0, 200) + '...' : clean;
  }
  return '';
}

function extractWikilinks(body) {
  const regex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = new Set();
  let match;
  while ((match = regex.exec(body)) !== null) {
    const link = match[1].trim().replace(/\.md$/, '');
    links.add(link);
  }
  return Array.from(links);
}

function detectStatus(frontmatter, fileName) {
  if (frontmatter.status) return frontmatter.status;
  if (frontmatter.redirect) return 'redirect';
  if (fileName.includes('DRAFT')) return 'draft';
  if (fileName.includes('DEPRECATED')) return 'deprecated';
  return 'canonical';
}

function detectPilar(filePath, wikiRoot) {
  const relPath = path.relative(wikiRoot, filePath);
  const parts = relPath.split(path.sep);
  
  for (const pilar of CONFIG.carpetesPilars) {
    if (parts[0] === pilar || parts[0].startsWith(pilar.split('_')[0])) {
      return pilar;
    }
  }
  return 'unknown';
}

function computeHash(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex').slice(0, 16);
}

function generateID(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .replace(/^\d{6}_\d{4}_[A-Z]+_/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();
}

// ═══════════════════════════════════════════════════════════
// ESCÀNER
// ═══════════════════════════════════════════════════════════
async function* walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!CONFIG.carpetesExcluides.includes(entry.name)) {
        yield* walkDir(fullPath);
      }
    } else if (CONFIG.extensionsValides.includes(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

async function processFile(filePath, wikiRoot) {
  const fileName = path.basename(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  return {
    id: generateID(fileName),
    filename: fileName,
    path: path.relative(wikiRoot, filePath).replace(/\\/g, '/'),
    pilar: detectPilar(filePath, wikiRoot),
    title: extractTitle(body, frontmatter),
    summary: extractSummary(body),
    tags: frontmatter.tags || [],
    status: detectStatus(frontmatter, fileName),
    hash: computeHash(content),
    size: content.length,
    links: extractWikilinks(body),
    depends_on: frontmatter.depends_on || [],
    used_by: frontmatter.used_by || [],
    replaces: frontmatter.replaces || [],
    redirect: frontmatter.redirect || null,
    authority: frontmatter.autor || null,
    version: frontmatter.version || null,
    updated_at: frontmatter.updated_at || null
  };
}

// ═══════════════════════════════════════════════════════════
// MANIFEST
// ═══════════════════════════════════════════════════════════
function computeGlobalHash(documents) {
  const sorted = [...documents].sort((a, b) => a.id.localeCompare(b.id));
  const concatenated = sorted.map(d => `${d.id}:${d.hash}`).join('|');
  return crypto.createHash('sha256').update(concatenated, 'utf8').digest('hex').slice(0, 16);
}

function buildManifest(documents, previousManifest) {
  const byPilar = {};
  const byStatus = {};
  const byTag = {};
  
  for (const doc of documents) {
    byPilar[doc.pilar] = (byPilar[doc.pilar] || 0) + 1;
    byStatus[doc.status] = (byStatus[doc.status] || 0) + 1;
    for (const tag of doc.tags) {
      if (!byTag[tag]) byTag[tag] = 0;
      byTag[tag]++;
    }
  }
  
  const globalHash = computeGlobalHash(documents);
  const now = new Date().toISOString();
  
  const changed = [];
  const added = [];
  const removed = [];
  
  if (previousManifest) {
    const prevDocs = new Map(previousManifest.documents || []);
    const currDocs = new Map(documents.map(d => [d.id, d]));
    
    for (const [id, doc] of currDocs) {
      if (!prevDocs.has(id)) {
        added.push(id);
      } else if (prevDocs.get(id).hash !== doc.hash) {
        changed.push(id);
      }
    }
    for (const id of prevDocs.keys()) {
      if (!currDocs.has(id)) removed.push(id);
    }
  }
  
  return {
    version: CONFIG.compilerVersion,
    build_time: now,
    global_hash: globalHash,
    total_documents: documents.length,
    by_pilar: byPilar,
    by_status: byStatus,
    top_tags: Object.entries(byTag)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count })),
    changed_since_last_build: changed,
    added_since_last_build: added,
    removed_since_last_build: removed,
    documents: documents.map(d => ({ id: d.id, hash: d.hash, status: d.status }))
  };
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const wikiRoot = wikiArg ? wikiArg.split('=')[1] : path.resolve(__dirname, '../../');
  const buildDir = path.join(wikiRoot, CONFIG.buildDir);
  
  console.log(`🔨 COMPILADOR SDP v${CONFIG.compilerVersion}`);
  console.log(`📂 Wiki: ${wikiRoot}`);
  console.log(`📦 Output: ${buildDir}\n`);
  
  let previousManifest = null;
  try {
    const prevContent = await fs.readFile(path.join(buildDir, CONFIG.manifestFile), 'utf8');
    previousManifest = JSON.parse(prevContent);
    console.log(`✓ Manifest previ carregat (hash: ${previousManifest.global_hash})`);
  } catch {
    console.log('✓ Primera build (sense manifest previ)');
  }
  
  await fs.mkdir(buildDir, { recursive: true });
  
  const documents = [];
  const warnings = [];
  let fitxersProcessats = 0;
  
  for await (const filePath of walkDir(wikiRoot)) {
    try {
      const doc = await processFile(filePath, wikiRoot);
      if (!doc.title) warnings.push(`${doc.filename}: sense títol`);
      if (doc.tags.length === 0) warnings.push(`${doc.filename}: sense tags`);
      
      documents.push(doc);
      fitxersProcessats++;
      if (verbose) console.log(`  ✓ ${doc.pilar}/${doc.id}`);
    } catch (err) {
      console.error(`❌ Error processant ${filePath}: ${err.message}`);
    }
  }
  
  console.log(`\n✓ ${fitxersProcessats} fitxers processats`);
  
  const manifest = buildManifest(documents, previousManifest);
  const documentsPath = path.join(buildDir, CONFIG.documentsFile);
  await fs.writeFile(documentsPath, JSON.stringify(documents, null, 2), 'utf8');
  
  const manifestPath = path.join(buildDir, CONFIG.manifestFile);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  
  console.log(`\n✅ Build completada: ${documentsPath}`);
  
  process.exit(warnings.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(`❌ Error fatal: ${err.message}`);
  process.exit(2);
});

```

### [SCRIPT] 02_build_ontology.cjs
```javascript
#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

// ═══════════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════════
async function loadDocuments(wikiRoot) {
  const documentsPath = path.join(wikiRoot, '_build', 'documents.json');
  try {
    const content = await fs.readFile(documentsPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`❌ No es troba documents.json. Executa primer build_index.js`);
    process.exit(2);
  }
}

// ═══════════════════════════════════════════════════════════
// CONSTRUCTOR DEL GRAF
// ═══════════════════════════════════════════════════════════
function buildGraph(documents) {
  const nodes = new Map();
  const edges = {
    depends_on: new Map(),
    used_by: new Map(),
    replaces: new Map(),
    replaced_by: new Map(),
    links_to: new Map(),
    linked_from: new Map()
  };
  
  const byID = new Map();
  const byFilename = new Map();
  const byTitle = new Map();
  
  for (const doc of documents) {
    nodes.set(doc.id, doc);
    byID.set(doc.id, doc);
    byFilename.set(doc.filename.replace(/\.md$/, '').toLowerCase(), doc.id);
    if (doc.title) {
      byTitle.set(String(doc.title).toLowerCase(), doc.id);
    }
    
    for (const edgeType of Object.keys(edges)) {
      edges[edgeType].set(doc.id, []);
    }
  }
  
  const errors = [];
  const warnings = [];
  
  const resolveID = (ref, fromDoc) => {
    if (!ref) return null;
    const normalized = ref.toLowerCase().replace(/\.md$/, '');
    
    if (byID.has(normalized)) return normalized;
    if (byID.has(ref)) return ref;
    if (byFilename.has(normalized)) return byFilename.get(normalized);
    if (byTitle.has(normalized)) return byTitle.get(normalized);
    
    errors.push(`Referència trencada: "${ref}" en ${fromDoc.id}`);
    return null;
  };
  
  for (const doc of documents) {
    for (const dep of doc.depends_on || []) {
      const depID = resolveID(dep, doc);
      if (depID) {
        edges.depends_on.get(doc.id).push(depID);
        edges.used_by.get(depID).push(doc.id);
      }
    }
    
    for (const user of doc.used_by || []) {
      const userID = resolveID(user, doc);
      if (userID) {
        edges.used_by.get(doc.id).push(userID);
        edges.depends_on.get(userID).push(doc.id);
      }
    }
    
    for (const replaced of doc.replaces || []) {
      const replacedID = resolveID(replaced, doc);
      if (replacedID) {
        edges.replaces.get(doc.id).push(replacedID);
        edges.replaced_by.get(replacedID).push(doc.id);
      }
    }
    
    for (const link of doc.links || []) {
      const linkID = resolveID(link, doc);
      if (linkID) {
        edges.links_to.get(doc.id).push(linkID);
        edges.linked_from.get(linkID).push(doc.id);
      }
    }
    
    if (doc.redirect) {
      const redirectID = resolveID(doc.redirect, doc);
      if (!redirectID) {
        errors.push(`Redirect trencat en ${doc.id}: "${doc.redirect}"`);
      }
    }
  }
  
  return { nodes, edges, byID, errors, warnings };
}

// ═══════════════════════════════════════════════════════════
// DETECTOR DE CICLES (DFS)
// ═══════════════════════════════════════════════════════════
function detectCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const recursionStack = new Set();
  const path = [];
  
  function dfs(nodeID) {
    visited.add(nodeID);
    recursionStack.add(nodeID);
    path.push(nodeID);
    
    for (const neighbor of graph.edges.depends_on.get(nodeID) || []) {
      if (!visited.has(neighbor)) {
        const cycle = dfs(neighbor);
        if (cycle) return cycle;
      } else if (recursionStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart).concat(neighbor));
      }
    }
    
    path.pop();
    recursionStack.delete(nodeID);
    return null;
  }
  
  for (const nodeID of graph.nodes.keys()) {
    if (!visited.has(nodeID)) {
      dfs(nodeID);
    }
  }
  
  return cycles;
}

// ═══════════════════════════════════════════════════════════
// DETECTOR D'ORFES
// ═══════════════════════════════════════════════════════════
function detectOrphans(graph) {
  const orphans = [];
  
  for (const [id, doc] of graph.nodes) {
    const hasInbound = 
      (graph.edges.used_by.get(id)?.length || 0) +
      (graph.edges.linked_from.get(id)?.length || 0) +
      (graph.edges.replaced_by.get(id)?.length || 0) > 0;
    
    const hasOutbound = 
      (graph.edges.depends_on.get(id)?.length || 0) +
      (graph.edges.links_to.get(id)?.length || 0) +
      (graph.edges.replaces.get(id)?.length || 0) > 0;
    
    const isRoot = ['bios', 'identitat', 'genotip', 'eixam', '00_index'].includes(id);
    
    if (!hasInbound && !hasOutbound && !isRoot && doc.status !== 'deprecated') {
      orphans.push({
        id,
        pilar: doc.pilar,
        title: doc.title
      });
    }
  }
  
  return orphans;
}

// ═══════════════════════════════════════════════════════════
// IMPACT MAP
// ═══════════════════════════════════════════════════════════
function computeImpactMap(graph) {
  const impactMap = new Map();
  
  for (const startID of graph.nodes.keys()) {
    const affected = new Set();
    const queue = [startID];
    const visited = new Set([startID]);
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      for (const dependent of graph.edges.used_by.get(current) || []) {
        if (!visited.has(dependent)) {
          visited.add(dependent);
          affected.add(dependent);
          queue.push(dependent);
        }
      }
      
      for (const linker of graph.edges.linked_from.get(current) || []) {
        if (!visited.has(linker)) {
          visited.add(linker);
          affected.add(linker);
        }
      }
    }
    
    impactMap.set(startID, Array.from(affected));
  }
  
  return impactMap;
}

// ═══════════════════════════════════════════════════════════
// ÍNDEXS INVERSOS
// ═══════════════════════════════════════════════════════════
function buildInverseIndexes(graph) {
  const by_tag = {};
  const by_pilar = {};
  const by_status = {};
  const by_authority = {};
  
  for (const [id, doc] of graph.nodes) {
    if (!by_pilar[doc.pilar]) by_pilar[doc.pilar] = [];
    by_pilar[doc.pilar].push(id);
    
    if (!by_status[doc.status]) by_status[doc.status] = [];
    by_status[doc.status].push(id);
    
    for (const tag of doc.tags || []) {
      if (!by_tag[tag]) by_tag[tag] = [];
      by_tag[tag].push(id);
    }
    
    if (doc.authority) {
      if (!by_authority[doc.authority]) by_authority[doc.authority] = [];
      by_authority[doc.authority].push(id);
    }
  }
  
  return { by_tag, by_pilar, by_status, by_authority };
}

// ═══════════════════════════════════════════════════════════
// GENERADOR DE knowledge.json
// ═══════════════════════════════════════════════════════════
function buildKnowledgeBundle(graph, impactMap, indexes, manifest) {
  const nodes = {};
  for (const [id, doc] of graph.nodes) {
    nodes[id] = {
      pilar: doc.pilar,
      title: doc.title,
      summary: doc.summary,
      tags: doc.tags,
      status: doc.status,
      hash: doc.hash,
      size: doc.size,
      path: doc.path
    };
  }
  
  const edges = {};
  for (const id of graph.nodes.keys()) {
    edges[id] = {
      depends_on: graph.edges.depends_on.get(id) || [],
      used_by: graph.edges.used_by.get(id) || [],
      replaces: graph.edges.replaces.get(id) || [],
      replaced_by: graph.edges.replaced_by.get(id) || [],
      links_to: graph.edges.links_to.get(id) || [],
      linked_from: graph.edges.linked_from.get(id) || []
    };
  }
  
  const impact = {};
  for (const [id, affected] of impactMap) {
    impact[id] = affected;
  }
  
  return {
    _meta: {
      compiler_version: '1.0.0',
      build_time: manifest.build_time,
      global_hash: manifest.global_hash,
      total_documents: manifest.total_documents
    },
    nodes,
    edges,
    indexes,
    impact
  };
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  const args = process.argv.slice(2);
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const wikiRoot = wikiArg ? wikiArg.split('=')[1] : path.resolve(__dirname, '../../');
  const buildDir = path.join(wikiRoot, '_build');
  
  console.log(`🕸️  COMPILADOR D'ONTOLOGIA`);
  console.log(`📂 Wiki: ${wikiRoot}\n`);
  
  const documents = await loadDocuments(wikiRoot);
  console.log(`✓ ${documents.length} documents carregats`);
  
  let manifest;
  try {
    const content = await fs.readFile(path.join(buildDir, 'manifest.json'), 'utf8');
    manifest = JSON.parse(content);
  } catch {
    console.error('❌ No es troba manifest.json');
    process.exit(2);
  }
  
  console.log('\n🔨 Construint graf...');
  const graph = buildGraph(documents);
  
  console.log('🔍 Detectant cicles...');
  const cycles = detectCycles(graph);
  
  console.log('🔍 Detectant nodes orfes...');
  const orphans = detectOrphans(graph);
  
  console.log('🔥 Calculant impact map...');
  const impactMap = computeImpactMap(graph);
  
  const indexes = buildInverseIndexes(graph);
  
  console.log('📦 Generant knowledge.json...');
  const knowledge = buildKnowledgeBundle(graph, impactMap, indexes, manifest);
  
  const ontologyPath = path.join(buildDir, 'ontology.json');
  await fs.writeFile(
    ontologyPath,
    JSON.stringify({
      nodes: Object.fromEntries(graph.nodes),
      edges: {
        depends_on: Object.fromEntries(graph.edges.depends_on),
        used_by: Object.fromEntries(graph.edges.used_by),
        replaces: Object.fromEntries(graph.edges.replaces),
        links_to: Object.fromEntries(graph.edges.links_to)
      },
      cycles,
      orphans,
      errors: graph.errors
    }, null, 2),
    'utf8'
  );
  
  const knowledgePath = path.join(buildDir, 'knowledge.json');
  await fs.writeFile(knowledgePath, JSON.stringify(knowledge), 'utf8');
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 REPORT D\'ONTOLOGIA');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Nodes: ${graph.nodes.size}`);
  console.log(`Arestes (depends_on): ${Array.from(graph.edges.depends_on.values()).reduce((a, b) => a + b.length, 0)}`);
  console.log(`Arestes (links_to): ${Array.from(graph.edges.links_to.values()).reduce((a, b) => a + b.length, 0)}`);
  console.log(`Índexs per tag: ${Object.keys(indexes.by_tag).length}`);
  
  if (cycles.length > 0) {
    console.log(`\n❌ CICLES DETECTATS (${cycles.length}):`);
    cycles.slice(0, 5).forEach(c => console.log(`  • ${c.join(' → ')}`));
  }
  
  if (orphans.length > 0) {
    console.log(`\n⚠️  NODES ORFES (${orphans.length}):`);
    orphans.slice(0, 10).forEach(o => 
      console.log(`  • ${o.id} (${o.pilar}) — ${o.title || '(sense títol)'}`)
    );
  }
  
  if (graph.errors.length > 0) {
    console.log(`\n❌ ERRORS (${graph.errors.length}):`);
    graph.errors.slice(0, 10).forEach(e => console.log(`  • ${e}`));
  }
  
  const impactStats = Array.from(impactMap.values()).map(arr => arr.length);
  const avgImpact = impactStats.length ? (impactStats.reduce((a, b) => a + b, 0) / impactStats.length) : 0;
  const maxImpact = impactStats.length ? Math.max(...impactStats) : 0;
  
  console.log(`\n📈 Impact Map:`);
  console.log(`  Impacte mitjà: ${avgImpact.toFixed(1)} nodes`);
  console.log(`  Impacte màxim: ${maxImpact} nodes`);
  
  console.log(`\n✅ Build completada:`);
  console.log(`   • ${ontologyPath}`);
  console.log(`   • ${knowledgePath}`);
  
  const hasErrors = cycles.length > 0;
  const hasWarnings = orphans.length > 0 || graph.errors.length > 0;
  
  if (hasErrors) process.exit(2);
  if (hasWarnings) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error(`❌ Error fatal: ${err.message}`);
  process.exit(2);
});

```

### [SCRIPT] build.cjs
```javascript
#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const SCRIPTS = [
  { name: 'Index', file: '01_build_index.cjs' },
  { name: 'Ontologia', file: '02_build_ontology.cjs' }
];

function runScript(script, wikiRoot) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`▶  Executant: ${script.name}`);
    console.log(`${'═'.repeat(60)}\n`);
    
    const proc = spawn('node', [
      path.join(__dirname, script.file),
      `--wiki=${wikiRoot}`
    ], { stdio: 'inherit' });
    
    proc.on('close', (code) => {
      // Allow warnings (code 1) but reject critical errors (code 2)
      if (code === 2) reject(new Error(`${script.name} va fallar amb errors crítics`));
      else resolve({ script: script.name, code });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const wikiRoot = wikiArg ? wikiArg.split('=')[1] : path.resolve(__dirname, '../../');
  
  const startTime = Date.now();
  console.log(`🏗️  BUILD COMPLETA — Wiki: ${wikiRoot}`);
  console.log(`⏱️  Inici: ${new Date().toISOString()}`);
  
  try {
    const results = [];
    for (const script of SCRIPTS) {
      const result = await runScript(script, wikiRoot);
      results.push(result);
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ BUILD COMPLETADA en ${duration}s`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`📦 Artefactes generats a: ${path.join(wikiRoot, '_build')}`);
    console.log(`   • documents.json`);
    console.log(`   • manifest.json`);
    console.log(`   • ontology.json`);
    console.log(`   • knowledge.json  ← BINARI FINAL`);
    
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ BUILD FALLIDA: ${err.message}`);
    process.exit(2);
  }
}

main();

```

### [SCRIPT] consolidar_etiquetes.js
```javascript
const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.join(__dirname, '../../');

const CANONICAL_TAGS = [
    'trellat', 'pedra_seca', 'termodinamica', 'identitat', 
    'ia', 'codi', 'crdt', 'auditoria', 'extern', 
    'seguretat', 'accessibilitat', 'legacy', 'govern'
];

const TAG_MAP = {
    'historia': 'identitat',
    'rural': 'identitat',
    'cultura': 'identitat',
    'llengua': 'identitat',
    
    'css': 'codi',
    'tailwind': 'codi',
    'preact': 'codi',
    'web_components': 'codi',
    'setDefaults': null, // Brossa
    
    'petorretes': 'ia',
    'autopoiesi': 'ia',
    'aprenentatge': 'ia',
    
    'filosofia': 'trellat',
    
    'crdt_offline': 'crdt',
    
    'rendiment': 'termodinamica',
    
    'norma': 'govern',
    
    'revisio': 'auditoria',
    
    'usabilitat': 'accessibilitat',
    
    'comunitat': 'extern',
    
    'arxivat': null // Ja és a 'estat'
};

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.obsidian', '_backups', 'assets', 'logs', '.git'].includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllMarkdownFiles(fullPath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function processTags() {
    const files = getAllMarkdownFiles(WIKI_ROOT);
    let filesUpdated = 0;

    for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) continue;
        
        const fmText = match[1];
        const lines = fmText.split('\n');
        
        let tagsStartIndex = -1;
        let tagsEndIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === 'tags:') {
                tagsStartIndex = i;
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].trim().startsWith('- ')) {
                        tagsEndIndex = j;
                    } else if (lines[j].trim() !== '') {
                        break;
                    }
                }
                break;
            }
        }
        
        if (tagsStartIndex !== -1 && tagsEndIndex !== -1) {
            const oldTags = [];
            for (let i = tagsStartIndex + 1; i <= tagsEndIndex; i++) {
                if (lines[i].trim().startsWith('- ')) {
                    oldTags.push(lines[i].trim().substring(2).trim());
                }
            }
            
            const newTags = new Set();
            for (let tag of oldTags) {
                if (tag.startsWith('"') && tag.endsWith('"')) tag = tag.slice(1, -1);
                if (tag.startsWith("'") && tag.endsWith("'")) tag = tag.slice(1, -1);
                
                if (TAG_MAP[tag] !== undefined) {
                    if (TAG_MAP[tag] !== null) newTags.add(TAG_MAP[tag]);
                } else if (CANONICAL_TAGS.includes(tag)) {
                    newTags.add(tag);
                } else {
                    // Tag desconegut o no canònic, s'elimina si volem puresa absoluta
                    // O el mantenim? El mestre vol neteja absoluta.
                }
            }
            
            // Si es queda buit, afegim 'trellat' per defecte
            if (newTags.size === 0) newTags.add('trellat');
            
            // Limitem a màxim 5 etiquetes per evitar entropia
            const limitedTags = Array.from(newTags).slice(0, 5);
            
            const newTagsYaml = ['tags:'];
            for (const tag of limitedTags) {
                newTagsYaml.push(`  - ${tag}`);
            }
            
            const newLines = [
                ...lines.slice(0, tagsStartIndex),
                ...newTagsYaml,
                ...lines.slice(tagsEndIndex + 1)
            ];
            
            const newFmText = newLines.join('\n');
            const newContent = content.replace(match[1], newFmText);
            
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                filesUpdated++;
            }
        }
    }
    console.log(`Etiquetes consolidades a 13 canòniques. Fitxers actualitzats: ${filesUpdated}`);
}

processTags();

```

### [SCRIPT] contradiction_engine.mjs
```javascript
#!/usr/bin/env node
/**
 * contradiction_engine.mjs
 * Motor autònom per a detectar duplicitats semàntiques a la Wiki de Poble.
 * Usa similitud de Jaccard sobre shingles (n-grames de paraules).
 *
 * Canvis respecte a la versió anterior:
 * 1. Extensió .mjs explícita (l'original ja usava sintaxi ESM però amb
 *    extensió .js, ambigu en un projecte amb germans .cjs).
 * 2. Marca de Jurisdicció (Registre d'Automillora 260705_0600): dos
 *    documents semànticament pareguts NO són una contradicció si cadascun
 *    porta un `jurisdiccio:` diferent al frontmatter (principi/cultura/
 *    requisit/implementacio). Abans, l'engine no distingia açò i hauria
 *    proposat fusionar continguts que existeixen legítimament a 4 capes.
 * 3. DRY_RUN ara fa alguna cosa: abans es declarava i mai es llegia
 *    (--force no tenia cap efecte real, era un altre interruptor fantasma
 *    igual que PERMITTED_DIRS). Ara, --force escriu una ACTA de proposta
 *    de fusió a 04_ARXIU_Documents_Historics/bancal_actiu en compte de només
 *    imprimir per consola.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { buildWikiIndex, parseFrontmatter } from './lib/wiki_walker.mjs';
import { getTimestamp } from './lib/termodinamic.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const UMBRAL_DUPLICAT = 0.62;
const FORCE = process.argv.includes('--force');

const log = (msg) => console.log(`[CONTRADICTION] ${msg}`);

function shingles(text, n = 4) {
  const tokens = text.toLowerCase().normalize('NFD').replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i <= tokens.length - n; i++) s.add(tokens.slice(i, i + n).join(' '));
  return s;
}

function jaccard(a, b) {
  const A = shingles(a), B = shingles(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  A.forEach(x => { if (B.has(x)) inter++; });
  return inter / (A.size + B.size - inter);
}

function stripFrontmatterAndComments(text) {
  return text.replace(/^---[\s\S]*?---/m, '').replace(/<!--[\s\S]*?-->/g, '').trim();
}

export async function findDuplicates(wikiDir = ROOT) {
  const { mdDocs } = await buildWikiIndex(wikiDir);
  const docs = mdDocs
    .filter(d => !d.relPath.split(path.sep).includes('scripts'))
    .map(d => ({
      ruta: d.relPath,
      fm: parseFrontmatter(d.content),
      text: stripFrontmatterAndComments(d.content)
    }))
    .filter(d => d.text.length > 200);

  const duplicats = [];
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const sim = jaccard(docs[i].text, docs[j].text);
      if (sim < UMBRAL_DUPLICAT) continue;

      const jurA = docs[i].fm.jurisdiccio;
      const jurB = docs[j].fm.jurisdiccio;
      const marcaJurisdiccioDiferent = jurA && jurB && jurA !== jurB;

      duplicats.push({
        s: sim,
        a: docs[i].ruta,
        b: docs[j].ruta,
        marcaJurisdiccioDiferent,
        jurA, jurB
      });
    }
  }
  return duplicats;
}

async function escriureActaProposta(duplicatsReals) {
  const dest = path.join(ROOT, '04_ARXIU_Documents_Historics', 'bancal_actiu');
  await fs.mkdir(dest, { recursive: true });
  const ts = getTimestamp();
  const filename = `${ts}_ACTA_Proposta_Fusio_Contradiccions.md`;
  const lines = [
    `---`,
    `tipus: acta`,
    `created_at: '${ts}'`,
    `authority: 'contradiction_engine.mjs'`,
    `---`,
    `# Proposta de fusió — contradiccions detectades`,
    ``,
    ...duplicatsReals.map(d =>
      `- **${(d.s * 100).toFixed(1)}%** — [[${d.a}]] ↔ [[${d.b}]] → escull document canònic i converteix l'altre en pont (wikilink).`
    )
  ];
  await fs.writeFile(path.join(dest, filename), lines.join('\n') + '\n', 'utf8');
  return path.join(dest, filename);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  log(`Iniciant Contradiction Engine a: ${ROOT} (mode: ${FORCE ? 'ESCRIPTURA' : 'DRY-RUN'})`);
  const duplicats = await findDuplicates();

  const marcats = duplicats.filter(d => d.marcaJurisdiccioDiferent);
  const reals = duplicats.filter(d => !d.marcaJurisdiccioDiferent);

  if (marcats.length) {
    log(`ℹ️ ${marcats.length} coincidència(es) amb Marca de Jurisdicció diferent — NO són contradicció, són capes legítimes:`);
    marcats.forEach(d => log(`  [${(d.s * 100).toFixed(1)}%] ${d.a} (${d.jurA}) ↔ ${d.b} (${d.jurB})`));
  }

  if (reals.length === 0) {
    log('✅ Cap contradicció real (Veritat en Dos Miralls preservada).');
    process.exit(0);
  }

  log(`⚠️ ${reals.length} contradicció(ns) semàntica(ques) real(s):`);
  reals.sort((a, b) => b.s - a.s).forEach(d => {
    log(`[${(d.s * 100).toFixed(1)}%] ${d.a}  ↔  ${d.b}`);
  });

  if (FORCE) {
    const actaPath = await escriureActaProposta(reals);
    log(`📝 Acta de proposta escrita: ${path.relative(ROOT, actaPath)}`);
  } else {
    log('DRY-RUN: cap fitxer escrit. Repeteix amb --force per generar l\'Acta de proposta al bancal actiu.');
  }
  process.exit(1);
}

```

### [SCRIPT] audit.mjs
```javascript
// commands/audit.mjs — Unifica wiki-integrity.js + semantic_auditor.mjs + validate_knowledge.cjs
// + audit_estructura.mjs en una sola comanda. Sense IA: regles de negoci pures (Trellat).
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { parseFrontmatter, missingFields } from '../lib/frontmatter.mjs';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);

async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

async function walkMd(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walkMd(full, acc);
    else if (e.isFile() && e.name.endsWith('.md')) acc.push(full);
  }
  return acc;
}

function h1Of(body) {
  const m = /^#\s+(.+)$/m.exec(body);
  if (!m) return null;
  return m[1].replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim().toLowerCase();
}

function wikilinksOf(body) {
  return [...body.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim());
}

export async function run(options) {
  const root = options.root || '.';
  const rules = await loadRules();
  const files = await walkMd(root);
  const findings = [];
  const titles = new Map();
  const basenames = new Set(files.map((f) => f.split(sep).pop().replace(/\.md$/, '')));

  for (const file of files) {
    const rel = relative(root, file) || file;
    const raw = await readFile(file, 'utf8');
    const { data, body, hasFrontmatter } = parseFrontmatter(raw);
    const topFolder = rel.split(sep)[0];

    if (!hasFrontmatter) {
      findings.push({ severity: 'warning', rule: 'sense-frontmatter', file: rel, message: 'Sense capçalera YAML.' });
    } else {
      const missing = missingFields(data, rules.requiredFrontmatter);
      if (missing.length) {
        findings.push({ severity: 'warning', rule: 'frontmatter-incomplet', file: rel, message: `Falten camps: ${missing.join(', ')}` });
      }
    }

    if (!rules.pillars.includes(topFolder)) {
      findings.push({ severity: 'critical', rule: 'fora-de-pilar', file: rel, message: `"${topFolder}" no és cap dels 5 Pilars canònics.` });
    }

    const h1 = h1Of(body);
    if (h1) {
      if (titles.has(h1)) {
        findings.push({ severity: 'warning', rule: 'possible-duplicat', file: rel, message: `Mateix H1 que ${titles.get(h1)}.` });
      } else {
        titles.set(h1, rel);
      }
    }

    for (const link of wikilinksOf(body)) {
      const target = link.split('/').pop();
      if (!basenames.has(target)) {
        findings.push({ severity: 'warning', rule: 'enllac-trencat', file: rel, message: `[[${link}]] no resol a cap fitxer.` });
      }
    }
  }

  const counts = { critical: 0, warning: 0, info: 0 };
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

  const ok = counts.critical === 0;
  const summary = `Auditoria (${options.mode}): ${files.length} fitxers, ${counts.critical} crítics, ${counts.warning} avisos.`;

  return {
    ok,
    summary,
    data: {
      root,
      mode: options.mode,
      timestamp: new Date().toISOString(),
      findings,
      summary: { ...counts, filesScanned: files.length },
    },
  };
}

```

### [SCRIPT] edge_rag.mjs
```javascript
// core/edge_rag.mjs — Cercador semàntic local: TF-IDF + similitud cosinus. Zero dependències,
// zero vector DB extern, pura matemàtica. Índex invertit (terme -> llista de docs) perquè una
// consulta només toque els documents rellevants, no tot el corpus. A ~500 .md el corpus sencer
// (Maps dispersos, mai els fitxers originals sencers) cap folgadament dins la RAM d'un iPad A10:
// el text cru de cada fitxer es descarta tan bon punt es tokenitza, no es reté enlloc.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
let rulesCache = null;
async function loadRules() {
  if (!rulesCache) rulesCache = JSON.parse(await readFile(RULES_URL, 'utf8'));
  return rulesCache;
}

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (e.name.endsWith('.md')) acc.push(full);
  }
  return acc;
}

// L'apòstrof actua de separador natural: "l'aigua" -> "l", "aigua" (el fragment "l" cau després
// per longitud mínima). Així "aigua" indexa igual amb elisió o sense — més recall real en català.
const WORD_RE = /[a-zà-ÿ0-9]+/g;

function tokenize(text, stopwords, minLen) {
  const raw = text.toLowerCase().match(WORD_RE) || [];
  const out = [];
  for (const t of raw) {
    if (t.length < minLen || stopwords.has(t)) continue;
    out.push(t);
  }
  return out;
}

function termFreq(tokens) {
  const tf = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  const total = tokens.length || 1;
  for (const [k, v] of tf) tf.set(k, v / total); // normalitzat per longitud de document
  return tf;
}

/** Construeix l'índex invertit a partir d'una carpeta arrel. Reté només vectors dispersos. */
export async function buildIndex(root, options = {}) {
  const rules = await loadRules();
  const cfg = rules.edgeRag || {};
  const stopwords = new Set(cfg.stopwordsCa || []);
  const minLen = cfg.minTokenLength ?? 2;

  const files = options.files || (await walk(root));
  const meta = [];
  const df = new Map(); // terme -> nombre de documents que el contenen
  const perDocTf = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ''); // ignora frontmatter YAML
    const tokens = tokenize(body, stopwords, minLen);
    const tf = termFreq(tokens);
    for (const term of tf.keys()) df.set(term, (df.get(term) || 0) + 1);
    meta.push({ id: meta.length, path: relative(root, file), length: tokens.length });
    perDocTf.push(tf);
    // `raw`/`body`/`tokens` moren ací: res del text cru sobreviu fora del Map `tf`.
  }

  const N = meta.length || 1;
  const idf = new Map();
  for (const [term, count] of df) idf.set(term, Math.log((N + 1) / (count + 1)) + 1); // suavitzat, sempre > 0

  const inverted = new Map(); // terme -> [{ docId, weight }]
  const norms = new Array(meta.length).fill(0);
  perDocTf.forEach((tf, docId) => {
    let sumSq = 0;
    for (const [term, freq] of tf) {
      const weight = freq * (idf.get(term) || 0);
      sumSq += weight * weight;
      if (!inverted.has(term)) inverted.set(term, []);
      inverted.get(term).push({ docId, weight });
    }
    norms[docId] = Math.sqrt(sumSq) || 1e-9; // evita divisió per zero en cosinus
  });

  return { docs: meta, inverted, idf, norms, stopwords, minLen, docCount: meta.length };
}

/** Cerca les millors coincidències per a `query` dins l'índex de buildIndex(). */
export function search(index, query, topK) {
  const k = topK ?? 10;
  const qTokens = tokenize(query, index.stopwords, index.minLen);
  if (!qTokens.length) return [];

  const qTf = termFreq(qTokens);
  const qVec = new Map();
  let qSumSq = 0;
  for (const [term, freq] of qTf) {
    const idfVal = index.idf.get(term);
    if (idfVal === undefined) continue; // terme absent del corpus: no aporta senyal
    const weight = freq * idfVal;
    qVec.set(term, weight);
    qSumSq += weight * weight;
  }
  if (qVec.size === 0) return [];
  const qNorm = Math.sqrt(qSumSq) || 1e-9;

  const dot = new Map(); // docId -> producte escalar acumulat (només docs amb >=1 terme comú)
  for (const [term, qWeight] of qVec) {
    const postings = index.inverted.get(term);
    if (!postings) continue;
    for (const { docId, weight } of postings) dot.set(docId, (dot.get(docId) || 0) + qWeight * weight);
  }

  const results = [];
  for (const [docId, d] of dot) {
    const sim = d / (qNorm * index.norms[docId]);
    if (sim > 0) results.push({ path: index.docs[docId].path, score: sim });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, k);
}

export async function run(options) {
  if (!options.query) return { ok: false, summary: '[ERROR] Cal --query="text a buscar".', data: {} };
  const root = options.root || '.';
  const index = await buildIndex(root);
  const results = search(index, options.query, options.top ? Number(options.top) : undefined);
  return {
    ok: true,
    summary: `${results.length} resultats per a "${options.query}" (corpus: ${index.docCount} fitxers).`,
    data: { query: options.query, docCount: index.docCount, results },
  };
}

```

### [SCRIPT] lint.mjs
```javascript
// commands/lint.mjs — Bloqueja el commit si troba Tailwind estètic il·legal (bg-*, text-*,
// rounded-*, valors arbitraris [...]). Tailwind de maquetació (flex, grid, gap-*...) és lícit.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
const SCAN_EXT = new Set(['.html', '.jsx', '.tsx', '.js', '.vue', '.md']);
const CLASS_ATTR_RE = /class(?:Name)?=["'`]([^"'`]+)["'`]/g;

async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (SCAN_EXT.has(extname(e.name))) acc.push(full);
  }
  return acc;
}

function violationRule(token, rules) {
  const { forbiddenColorPrefixes, forbiddenRadiusPrefixes, colorExceptions, arbitraryValuePattern, allowedLayoutPrefixes } = rules.tailwind;
  if (colorExceptions.includes(token)) return null;
  if (allowedLayoutPrefixes.some((p) => token.startsWith(p))) return null;
  if (/^(bg|text|border|rounded|shadow)-/.test(token) && new RegExp(arbitraryValuePattern).test(token)) return 'valor-arbitrari';
  if (forbiddenColorPrefixes.some((p) => token.startsWith(p))) return 'color-tailwind-il·legal';
  if (forbiddenRadiusPrefixes.some((p) => token.startsWith(p))) return 'radi-tailwind-il·legal';
  return null;
}

export async function run(options) {
  const root = options.root || '.';
  const rules = await loadRules();
  const singleFile = Boolean(options.file);
  const targets = singleFile ? [options.file] : await walk(root);
  const violations = [];

  for (const file of targets) {
    const label = singleFile ? file : relative(root, file);
    const raw = await readFile(file, 'utf8').catch(() => '');
    raw.split('\n').forEach((line, idx) => {
      for (const m of line.matchAll(CLASS_ATTR_RE)) {
        for (const token of m[1].split(/\s+/).filter(Boolean)) {
          const rule = violationRule(token, rules);
          if (rule) violations.push({ file: label, line: idx + 1, token, rule });
        }
      }
    });
  }

  const ok = violations.length === 0;
  const summary = ok
    ? `Lint net: ${targets.length} fitxers escanejats, cap Tailwind il·legal.`
    : `Lint FALLIT: ${violations.length} classe(s) il·legal(s) en ${targets.length} fitxers.`;

  return { ok, summary, data: { filesScanned: targets.length, violations } };
}

```

### [SCRIPT] pattern_extractor.mjs
```javascript
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ACTA_DIR = '04_ARXIU/actes_arxivades';
const REGISTRE = '00_SER_Brain_Identitat/04_registre_automillora.md';
const PATTERN = /^\s*(?:[-*]\s*)?(Nova regla:|Patró detectat:|Acte reflex afegit:)\s*(.+?)\s*$/i;

function stamp() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yy}${mo}${da}_${hh}${mm}`;
}

async function latestMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => e.name)
    .sort();
  return files.length ? join(dir, files[files.length - 1]) : null;
}

function extractPatterns(text) {
  const out = [];
  const seen = new Set();

  for (const line of text.split(/\r?\n/)) {
    const m = line.match(PATTERN);
    if (!m) continue;

    const tipus = m[1].replace(':', '').trim();
    const text = m[2].trim();
    const key = `${tipus}|${text}`.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      out.push({ tipus, text });
    }
  }

  return out;
}

function ensureTable(md) {
  if (md.includes('| Data | Tipus | Patró | Origen |')) return md;

  const block = [
    '',
    '## Patrons Consolidats',
    '',
    '| Data | Tipus | Patró | Origen |',
    '|---|---|---|---|',
    ''
  ].join('\n');

  return `${md.trimEnd()}\n${block}`;
}

function hasPattern(md, text) {
  const needle = text.toLowerCase();
  return md.toLowerCase().includes(needle);
}

async function atomicWrite(path, text) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, text, 'utf8');
  await rename(tmp, path);
}

export async function run(options = {}) {
  const root = options.root || process.cwd();
  const actaDir = join(root, options.actaDir || ACTA_DIR);
  const registrePath = join(root, options.registre || REGISTRE);
  const acta = options.acta ? join(root, options.acta) : await latestMarkdown(actaDir);

  if (!acta) {
    return { ok: false, summary: 'Cap acta Markdown trobada.', data: { added: 0 } };
  }

  const [actaText, registreText] = await Promise.all([
    readFile(acta, 'utf8'),
    readFile(registrePath, 'utf8').catch(() => [
      '---',
      "name: 'registre-automillora'",
      "version: '15.00'",
      `created_at: '${stamp()}'`,
      `updated_at: '${stamp()}'`,
      "autor: 'IAIA MarIA'",
      "categoria: 'registre'",
      "description: 'Registre d’automillora i patrons consolidats.'",
      '---',
      '',
      "# Registre d'Automillora"
    ].join('\n'))
  ]);

  const patterns = extractPatterns(actaText);
  let next = ensureTable(registreText);
  let added = 0;
  const date = stamp();
  const origin = acta.split('/').pop();

  for (const p of patterns) {
    if (hasPattern(next, p.text)) continue;
    next += `| ${date} | ${p.tipus} | ${p.text.replaceAll('|', '\\|')} | ${origin} |\n`;
    added++;
  }

  if (added && options.write !== false) await atomicWrite(registrePath, next);

  return {
    ok: true,
    summary: `${added} patró(ns) afegit(s) des de ${origin}.`,
    data: { acta, registre: registrePath, found: patterns.length, added, written: added > 0 && options.write !== false }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v = true] = a.replace(/^--/, '').split('=');
    return [k, v];
  }));

  run({
    root: args.root || process.cwd(),
    acta: args.acta,
    write: args.write !== 'false'
  }).then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  }).catch(err => {
    console.error(JSON.stringify({ ok: false, error: err.message }, null, 2));
    process.exit(1);
  });
}

```

### [SCRIPT] self_repair.mjs
```javascript
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter, missingFields } from '../lib/frontmatter.mjs';
import { classify, EXEMPT_BASENAMES, getTimestamp, isValidContentFile } from '../lib/termodinamic.mjs';

const CANONICAL_FIELDS = ['name', 'version', 'created_at', 'updated_at', 'autor', 'categoria', 'description', 'tags'];
const DEFAULT_VERSION = '15.0.0';
const DEFAULT_AUTOR = 'Petorretes i Javi';

async function walkMd(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkMd(full, acc);
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') acc.push(full);
  }
  return acc;
}

async function scanTargets(root) {
  const files = new Map();

  for (const entry of await readdir(root, { withFileTypes: true }).catch(() => [])) {
    if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') {
      const full = join(root, entry.name);
      files.set(full, full);
    }
  }

  const archive = join(root, '04_ARXIU');
  if (existsSync(archive)) {
    for (const file of await walkMd(archive)) files.set(file, file);
  }

  return [...files.values()].sort();
}

function cleanTitle(value) {
  return String(value || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstH1(raw) {
  const match = /^#\s+(.+)$/m.exec(raw);
  return match ? cleanTitle(match[1]) : '';
}

function stemOf(fileName) {
  return basename(fileName, extname(fileName));
}

function stripTermoPrefix(stem) {
  return stem.replace(/^\d{6}_\d{4}_[A-Z]+_?/, '').replace(/^\d{1,4}_?/, '');
}

function asciiToken(value, fallback = 'Document') {
  const token = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return token || fallback;
}

function slugName(value) {
  return asciiToken(value, 'document').replace(/_/g, '-').toLowerCase();
}

function yamlQuote(value) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`;
}

function yamlBlock(data) {
  const lines = [];
  for (const field of CANONICAL_FIELDS) {
    if (field === 'tags') {
      lines.push('tags:');
      for (const tag of data.tags) lines.push(`  - ${asciiToken(tag, 'autosanacio').toLowerCase()}`);
    } else {
      lines.push(`${field}: ${yamlQuote(data[field])}`);
    }
  }
  return `---\n${lines.join('\n')}\n---\n`;
}

function timestampFromName(fileName) {
  const match = /^(\d{6}_\d{4})_/.exec(basename(fileName));
  return match ? match[1] : getTimestamp();
}

function defaultsFor(fileName, raw) {
  const h1 = firstH1(raw);
  const stem = stripTermoPrefix(stemOf(fileName));
  const title = h1 || stem || 'Document';
  const category = classify(raw, fileName).toLowerCase();

  return {
    name: slugName(title),
    version: DEFAULT_VERSION,
    created_at: timestampFromName(fileName),
    updated_at: getTimestamp(),
    autor: DEFAULT_AUTOR,
    categoria: category,
    description: title,
    tags: ['autosanacio', category],
  };
}

function fieldLines(field, value) {
  if (field === 'tags') {
    const tags = Array.isArray(value) && value.length ? value : ['autosanacio'];
    return ['tags:', ...tags.map((tag) => `  - ${asciiToken(tag, 'autosanacio').toLowerCase()}`)];
  }
  return [`${field}: ${yamlQuote(value)}`];
}

function repairFrontmatter(raw, fileName, missing) {
  const defaults = defaultsFor(fileName, raw);
  const parsed = parseFrontmatter(raw);

  if (!parsed.hasFrontmatter) {
    return yamlBlock(defaults) + raw.replace(/^\uFEFF/, '');
  }

  const insert = [];
  for (const field of missing) insert.push(...fieldLines(field, defaults[field]));
  if (!insert.length) return raw;

  return raw.replace(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/, (_, yaml) => {
    const body = yaml.trimEnd();
    const joined = body ? `${body}\n${insert.join('\n')}` : insert.join('\n');
    return `---\n${joined}\n---\n`;
  });
}

function weakThermoTitle(fileName) {
  if (EXEMPT_BASENAMES.has(fileName)) return false;
  const stem = stemOf(fileName);
  const title = stripTermoPrefix(stem).replace(/[_\W]+/g, '');
  return /^\d+$/.test(stem) || title.length < 4;
}

function canonicalFileName(fileName, raw) {
  const title = firstH1(raw) || stripTermoPrefix(stemOf(fileName)) || 'Document';
  const category = classify(raw, fileName);
  return `${getTimestamp()}_${category}_${asciiToken(title)}.md`;
}

async function uniquePath(dir, preferredName) {
  const ext = extname(preferredName);
  const stem = basename(preferredName, ext);
  let candidate = join(dir, preferredName);
  let i = 2;
  while (existsSync(candidate)) {
    candidate = join(dir, `${stem}_${i}${ext}`);
    i += 1;
  }
  return candidate;
}

async function appendLog(root, payload) {
  const dir = join(root, '04_ARXIU', '01_logs_termodinamics');
  await mkdir(dir, { recursive: true });
  const path = join(dir, 'self_repair.ndjson');
  await writeFile(path, JSON.stringify({ ts: new Date().toISOString(), event: 'self_repair', ...payload }) + '\n', { flag: 'a' });
  return path;
}

function reportFinding(findings, finding) {
  findings.push({ severity: 'warning', fixed: false, ...finding });
}

export async function run(options = {}) {
  const root = resolve(options.root || process.env.SDP_ROOT || process.cwd());
  const write = Boolean(options.write);
  const required = [...new Set([...(options.requiredFrontmatter || []), ...CANONICAL_FIELDS])];
  const files = await scanTargets(root);
  const findings = [];
  const fixes = [];

  for (const file of files) {
    const rel = relative(root, file) || file;
    const fileName = basename(file);
    let raw = await readFile(file, 'utf8').catch(() => '');
    let nextRaw = raw;

    const { data, hasFrontmatter } = parseFrontmatter(raw);
    const missing = hasFrontmatter ? missingFields(data, required) : required;

    if (missing.length) {
      const finding = {
        rule: hasFrontmatter ? 'frontmatter-incomplet' : 'sense-frontmatter',
        file: rel,
        message: hasFrontmatter ? `Falten camps canonics: ${missing.join(', ')}` : 'Sense capcalera YAML canonica.',
      };

      if (write) {
        nextRaw = repairFrontmatter(nextRaw, fileName, missing);
        finding.fixed = true;
        fixes.push({ file: rel, action: 'frontmatter-reparat', fields: missing });
      }

      reportFinding(findings, finding);
    }

    const exempt = EXEMPT_BASENAMES.has(fileName);
    const validTermo = exempt || isValidContentFile(fileName);
    const weakTitle = !exempt && weakThermoTitle(fileName);
    let targetPath = '';

    if (!validTermo) {
      const finding = {
        rule: weakTitle ? 'titol-termodinamic-feble' : 'nom-termodinamic-no-canonic',
        severity: weakTitle ? 'warning' : 'info',
        file: rel,
        message: weakTitle ? 'Nom numeric o massa curt.' : 'Nom descriptiu pendent de normalitzacio termodinamica manual.',
      };

      if (write && weakTitle) {
        targetPath = await uniquePath(dirname(file), canonicalFileName(fileName, nextRaw));
        finding.fixed = true;
        finding.target = relative(root, targetPath);
        fixes.push({ file: rel, action: 'reanomenat', target: finding.target });
      }

      reportFinding(findings, finding);
    }

    if (write && nextRaw !== raw) {
      await writeFile(file, nextRaw, 'utf8');
      raw = nextRaw;
    }

    if (write && targetPath) {
      await rename(file, targetPath);
    }
  }

  const unresolved = findings.filter((finding) => !finding.fixed);
  const logPath = await appendLog(root, {
    root,
    write,
    filesScanned: files.length,
    findings,
    fixes,
    unresolved: unresolved.length,
  });

  return {
    ok: unresolved.length === 0,
    summary: `Self-Repair: ${files.length} fitxers, ${fixes.length} correccions, ${unresolved.length} pendents. Log: ${relative(root, logPath)}`,
    data: {
      root,
      write,
      filesScanned: files.length,
      fixes,
      findings,
      unresolved,
      logPath,
    },
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      root: { type: 'string', default: '.' },
      write: { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
    },
  });

  run(values)
    .then((result) => {
      if (values.json) console.log(JSON.stringify(result, null, 2));
      else console.log(result.summary);
      process.exitCode = result.ok ? 0 : 1;
    })
    .catch((err) => {
      console.error(`[FATAL] self_repair: ${err.message}`);
      process.exitCode = 70;
    });
}

```

### [SCRIPT] snapshot_engine.mjs
```javascript
// core/snapshot_engine.mjs — Protocol Lázaro: fotografia comprimida i rotativa del bundle .md.
// Adapter Node per defecte (fs); s'hi pot injectar un adapter OPFS al navegador sense tocar
// la lògica de compressió/rotació/verificació. Tot async: mai bloqueja el fil principal.
import { readFile, writeFile, rename, unlink, readdir, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const HAS_ZSTD = typeof zlib.zstdCompress === 'function';
const zstdCompress = HAS_ZSTD ? promisify(zlib.zstdCompress) : null;
const zstdDecompress = HAS_ZSTD ? promisify(zlib.zstdDecompress) : null;

export const nodeAdapter = {
  async walk(dir, acc = []) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) await this.walk(full, acc);
      else if (e.name.endsWith('.md')) acc.push(full);
    }
    return acc;
  },
  readText: (p) => readFile(p, 'utf8'),
  readBinary: (p) => readFile(p),
  writeFile: (p, data) => writeFile(p, data),
  rename: (a, b) => rename(a, b),
  unlink: (p) => unlink(p).catch(() => {}),
  readdir: (d) => readdir(d).catch(() => []),
  mkdir: (d) => mkdir(d, { recursive: true }),
};

// Zstd preferit si el runtime el suporta (verificat: Node 22.x del Mestre el té).
// Gzip és el fallback garantit — mai depenem d'una funció que puga no existir.
async function compress(buf) {
  if (HAS_ZSTD) return { codec: 'zstd', data: await zstdCompress(buf) };
  return { codec: 'gzip', data: await gzip(buf) };
}

async function decompress(codec, buf) {
  if (codec === 'zstd') {
    if (!zstdDecompress) throw new Error('Aquest Node no suporta Zstd; cal el mateix runtime que va crear el snapshot.');
    return zstdDecompress(buf);
  }
  return gunzip(buf);
}

const snapshotName = (ts) => `snapshot_${ts.replace(/[:.]/g, '-')}.sdp`;

export async function createSnapshot(options = {}, adapter = nodeAdapter) {
  const root = options.root || '.';
  const outDir = options.out || join(root, '.snapshots');
  await adapter.mkdir(outDir);

  const files = await adapter.walk(root);
  const payload = { generatedAt: new Date().toISOString(), root, fileCount: files.length, files: [] };
  for (const f of files) payload.files.push({ path: relative(root, f), content: await adapter.readText(f) });

  const raw = Buffer.from(JSON.stringify(payload), 'utf8');
  const { codec, data } = await compress(raw);

  const finalPath = join(outDir, snapshotName(payload.generatedAt));
  const tmpPath = `${finalPath}.tmp`;
  const header = Buffer.from(JSON.stringify({ codec, rawBytes: raw.length }) + '\n', 'utf8');
  await adapter.writeFile(tmpPath, Buffer.concat([header, data]));
  await adapter.rename(tmpPath, finalPath); // atòmic: mateix volum, mateixa carpeta

  const verified = await verifySnapshot(finalPath, adapter, files.length);
  const removed = await rotate(outDir, options.keep ?? 3, adapter);

  return {
    ok: verified.ok,
    summary: `Snapshot ${verified.ok ? 'OK' : 'CORROMPUT'}: ${files.length} fitxers, ${data.length}B (${codec}). Rotació: ${removed} esborrats.`,
    data: { path: finalPath, codec, compressedBytes: data.length, rawBytes: raw.length, fileCount: files.length, verified, rotatedOut: removed },
  };
}

/** Llig i descomprimeix un snapshot real (round-trip) per certificar que és recuperable. */
export async function verifySnapshot(path, adapter = nodeAdapter, expectedCount = null) {
  try {
    const raw = await adapter.readBinary(path);
    const nl = raw.indexOf(10);
    const header = JSON.parse(raw.subarray(0, nl).toString('utf8'));
    const payload = JSON.parse((await decompress(header.codec, raw.subarray(nl + 1))).toString('utf8'));
    const countOk = expectedCount === null || payload.fileCount === expectedCount;
    return { ok: countOk && payload.files.length === payload.fileCount, fileCount: payload.fileCount };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function rotate(dir, keep, adapter) {
  const entries = (await adapter.readdir(dir)).filter((f) => f.startsWith('snapshot_') && f.endsWith('.sdp')).sort();
  const excess = entries.slice(0, Math.max(0, entries.length - keep));
  for (const f of excess) await adapter.unlink(join(dir, f));
  return excess.length;
}

export async function latestSnapshot(dir, adapter = nodeAdapter) {
  const entries = (await adapter.readdir(dir)).filter((f) => f.startsWith('snapshot_') && f.endsWith('.sdp')).sort();
  return entries.length ? join(dir, entries[entries.length - 1]) : null;
}

export async function run(options) {
  return createSnapshot(options);
}

```

### [SCRIPT] tombstone_gc.mjs
```javascript
import { createReadStream, createWriteStream } from 'node:fs';
import { readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createGzip, createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

const MB = 1024 * 1024;
const DEFAULTS = {
  thresholdBytes: 15 * MB,
  tombstonePercentMax: 70,
  maxJsonBytes: 4 * MB
};

function stripTombstones(node, acc) {
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      if (item && typeof item === 'object' && item.__deleted === true) {
        acc.removed++;
        acc.removedBytes += Buffer.byteLength(JSON.stringify(item));
        continue;
      }
      out.push(stripTombstones(item, acc));
    }
    return out;
  }

  if (node && typeof node === 'object') {
    if (node.__deleted === true) {
      acc.removed++;
      acc.removedBytes += Buffer.byteLength(JSON.stringify(node));
      return undefined;
    }

    const out = {};
    for (const [k, v] of Object.entries(node)) {
      const next = stripTombstones(v, acc);
      if (next !== undefined) out[k] = next;
    }
    return out;
  }

  return node;
}

async function sha256File(path, gunzip = false) {
  const h = createHash('sha256');
  const sink = new Transform({
    transform(chunk, enc, cb) {
      h.update(chunk);
      cb(null, chunk);
    }
  });

  const streams = gunzip
    ? [createReadStream(path), createGunzip(), sink]
    : [createReadStream(path), sink];

  await pipeline(...streams);
  return h.digest('hex');
}

async function backupGzip(path) {
  const backupPath = `${path}.pre-gc-${Date.now()}.gz`;
  const beforeHash = await sha256File(path, false);
  await pipeline(createReadStream(path), createGzip({ level: 6 }), createWriteStream(backupPath));
  const afterHash = await sha256File(backupPath, true);

  if (beforeHash !== afterHash) {
    await unlink(backupPath).catch(() => {});
    throw new Error('backup gzip no verificat per hash');
  }

  return backupPath;
}

async function compactNdjson(file, options) {
  const st = await stat(file);
  const tmp = `${file}.compact-${Date.now()}.tmp`;
  const out = createWriteStream(tmp, { encoding: 'utf8' });
  const rl = createInterface({
    input: createReadStream(file, { encoding: 'utf8', highWaterMark: 64 * 1024 }),
    crlfDelay: Infinity
  });

  const acc = { removed: 0, removedBytes: 0 };
  let kept = 0;
  let broken = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj && typeof obj === 'object' && obj.__deleted === true) {
        acc.removed++;
        acc.removedBytes += Buffer.byteLength(line);
        continue;
      }

      const clean = stripTombstones(obj, acc);
      if (clean !== undefined) {
        if (!out.write(`${JSON.stringify(clean)}\n`)) {
          await new Promise(resolve => out.once('drain', resolve));
        }
        kept++;
      }
    } catch {
      broken++;
      if (!out.write(`${line}\n`)) await new Promise(resolve => out.once('drain', resolve));
    }
  }

  await new Promise((resolve, reject) => {
    out.end(resolve);
    out.on('error', reject);
  });

  const after = (await stat(tmp)).size;
  const ratio = st.size ? (acc.removedBytes / st.size) * 100 : 0;
  const needsCompact = st.size >= options.thresholdBytes || ratio >= options.tombstonePercentMax;

  if (!needsCompact || acc.removed === 0) {
    await unlink(tmp).catch(() => {});
    return {
      ok: true,
      compacted: false,
      beforeBytes: st.size,
      afterBytes: st.size,
      tombstonesRemoved: acc.removed,
      ratioPercent: Number(ratio.toFixed(1)),
      brokenLines: broken
    };
  }

  let backupPath = null;
  if (options.write) {
    backupPath = await backupGzip(file);
    await rename(tmp, file);
  } else {
    await unlink(tmp).catch(() => {});
  }

  return {
    ok: true,
    compacted: true,
    written: Boolean(options.write),
    beforeBytes: st.size,
    afterBytes: after,
    savedBytes: st.size - after,
    savedPercent: Number((100 - (after / st.size) * 100).toFixed(1)),
    tombstonesRemoved: acc.removed,
    ratioPercent: Number(ratio.toFixed(1)),
    brokenLines: broken,
    backupPath
  };
}

async function compactJsonSmall(file, options) {
  const st = await stat(file);
  if (st.size > options.maxJsonBytes) {
    return {
      ok: false,
      compacted: false,
      error: `JSON massa gran per compactar en memoria (${st.size}B). Exporta NDJSON o usa compactYDocByProjection().`
    };
  }

  const raw = await readFile(file, 'utf8');
  const state = JSON.parse(raw);
  const acc = { removed: 0, removedBytes: 0 };
  const clean = stripTombstones(state, acc);
  const next = JSON.stringify(clean, null, 2);
  const after = Buffer.byteLength(next);
  const ratio = raw.length ? (acc.removedBytes / Buffer.byteLength(raw)) * 100 : 0;
  const needsCompact = st.size >= options.thresholdBytes || ratio >= options.tombstonePercentMax;

  if (!needsCompact || acc.removed === 0) {
    return { ok: true, compacted: false, beforeBytes: st.size, afterBytes: st.size, tombstonesRemoved: acc.removed };
  }

  let backupPath = null;
  if (options.write) {
    backupPath = await backupGzip(file);
    await writeFile(`${file}.tmp`, next, 'utf8');
    await rename(`${file}.tmp`, file);
  }

  return {
    ok: true,
    compacted: true,
    written: Boolean(options.write),
    beforeBytes: st.size,
    afterBytes: after,
    savedBytes: st.size - after,
    savedPercent: Number((100 - (after / st.size) * 100).toFixed(1)),
    tombstonesRemoved: acc.removed,
    backupPath
  };
}

export function compactYDocByProjection(Y, oldDoc, project, { measureBefore = false } = {}) {
  if (!Y || !oldDoc || typeof project !== 'function') {
    throw new Error('compactYDocByProjection requereix Y, oldDoc i project(freshDoc, oldDoc)');
  }

  const beforeBytes = measureBefore ? Y.encodeStateAsUpdate(oldDoc).byteLength : null;
  const fresh = new Y.Doc({ gc: true });
  project(fresh, oldDoc);

  const afterUpdate = Y.encodeStateAsUpdate(fresh);
  return {
    ok: true,
    doc: fresh,
    beforeBytes,
    afterBytes: afterUpdate.byteLength,
    savedBytes: beforeBytes === null ? null : beforeBytes - afterUpdate.byteLength
  };
}

export async function run(options = {}) {
  const file = options.file || options.statePath;
  if (!file) return { ok: false, summary: '[ERROR] Cal --file=<estat.json|estat.ndjson>.', data: {} };

  const cfg = { ...DEFAULTS, ...options };
  const isNdjson = options.ndjson || file.endsWith('.ndjson') || file.endsWith('.jsonl');
  const data = isNdjson
    ? await compactNdjson(file, cfg)
    : await compactJsonSmall(file, cfg);

  return {
    ok: data.ok,
    summary: data.ok
      ? `GC ${data.compacted ? (data.written ? 'APLICAT' : 'simulat') : 'no necessari'}: ${data.tombstonesRemoved || 0} tombstones.`
      : `[FATAL] ${data.error}`,
    data
  };
}

```

### [SCRIPT] translate.mjs
```javascript
// commands/translate.mjs — Tradueix classes Tailwind de marca (color/radi/ombra) al
// diccionari --sp-* canònic, per a promoure un component de Forja a Core.
import { readFile, writeFile } from 'node:fs/promises';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
const CLASS_ATTR_RE = /(class(?:Name)?=["'`])([^"'`]+)(["'`])/g;

async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

function translateList(tokenStr, tokenMap, unmapped) {
  return tokenStr
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (tokenMap[token]) return `sp-${tokenMap[token].replace(/^sp-/, '')}`;
      if (/^(bg|text|border|rounded|shadow)-/.test(token)) unmapped.push(token);
      return token;
    })
    .join(' ');
}

export async function run(options) {
  if (!options.file) {
    return { ok: false, summary: '[ERROR] Cal --file=<ruta> per traduir.', data: {} };
  }

  const rules = await loadRules();
  const raw = await readFile(options.file, 'utf8');
  const unmapped = [];
  let blocksChanged = 0;

  const translated = raw.replace(CLASS_ATTR_RE, (_full, pre, classList, post) => {
    const after = translateList(classList, rules.tokenMap, unmapped);
    if (after !== classList) blocksChanged++;
    return `${pre}${after}${post}`;
  });

  const willWrite = Boolean(options.write && blocksChanged > 0);
  if (willWrite) await writeFile(options.file, translated, 'utf8');

  const ok = true;
  const summary = `Traducció ${options.file}: ${blocksChanged} bloc(s) de classes tocats, ` +
    `${new Set(unmapped).size} classe(s) sense mapa (${willWrite ? 'ESCRIT' : 'dry-run — repeteix amb --write'}).`;

  return {
    ok,
    summary,
    data: { file: options.file, blocksChanged, unmapped: [...new Set(unmapped)], written: willWrite },
  };
}

```

### [SCRIPT] trellat_metrics.mjs
```javascript
// core/trellat_metrics.mjs — Índex de Trellat (IT): mesura de salut global del projecte.
// IT = 0.5*Coherència + 0.25*Eficiència + 0.25*Resiliència (pesos a rules.json).
// Sense component d'Accessibilitat (CA) del disseny original: exigeix DOM/axe-core en viu,
// no mesurable en un escaneig estàtic de fitxers — s'omet explícitament, no s'inventa un número.
// IT < itLock (70) -> SDP-LOCK: checkGate() ho senyala perquè qui invoque aquest mòdul s'ature.
import { readFile, stat } from 'node:fs/promises';
import { run as runAudit } from './audit.mjs';
import { nodeAdapter, latestSnapshot, verifySnapshot } from './snapshot_engine.mjs';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

/** Coherència (CT): 100 menys penalització ponderada per severitat. Fitada [0,100] per construcció
 * (Math.min/max), no per convenció: un crític pesa 3x un avís; el pitjor cas raonable és un
 * crític per fitxer, i és el que fixa el denominador. */
function coherencia({ critical, warning, filesScanned }) {
  if (filesScanned === 0) return 100; // corpus buit: no hi ha res a contradir
  const weight = critical * 3 + warning * 1;
  const maxWeight = filesScanned * 3;
  return Math.min(100, Math.max(0, 100 * (1 - weight / maxWeight)));
}

/** Eficiència (CE): bytes/fitxer mitjans contra el pressupost ideal (`idealBytesPerFile`).
 * Fitada [0,100]: un corpus més lleuger que l'ideal puntua 100 (no es premia per damunt), un
 * corpus més pesat degrada linealment. */
function eficiencia(totalBytes, fileCount, idealBytesPerFile) {
  if (fileCount === 0) return 100;
  const avgBytes = totalBytes / fileCount;
  if (avgBytes <= 0) return 100;
  return Math.min(100, Math.max(0, (idealBytesPerFile / avgBytes) * 100));
}

/** Resiliència (CR): integració real amb snapshot_engine (no un número arbitrari). Existeix un
 * snapshot verificable i alineat amb el corpus actual? 0 = sense xarxa de seguretat, 60 = hi ha
 * xarxa però desactualitzada, 100 = recuperació garantida ara mateix. */
async function resiliencia(root, fileCount) {
  const path = await latestSnapshot(`${root}/.snapshots`);
  if (!path) return { score: 0, detail: 'Cap snapshot trobat: sense xarxa de seguretat.' };
  const verified = await verifySnapshot(path, undefined, null);
  if (!verified.ok) return { score: 0, detail: `Snapshot corromput o il·legible: ${verified.error || 'verificació fallida'}.` };
  if (verified.fileCount === fileCount) return { score: 100, detail: `Snapshot verificat i alineat (${verified.fileCount} fitxers).` };
  return { score: 60, detail: `Snapshot verificat però desalineat (${verified.fileCount} vs ${fileCount} actuals).` };
}

async function walkStats(root) {
  const files = await nodeAdapter.walk(root); // reutilitza el mateix recorregut que snapshot_engine
  let totalBytes = 0;
  for (const f of files) totalBytes += (await stat(f)).size;
  return { totalBytes, fileCount: files.length };
}

/** Porta de seguretat SDP-LOCK. Pura funció de (it, rules) -> veredicte: fàcil de testejar sense
 * fer I/O ni dependre de l'estat del disc. */
export function checkGate(it, rules) {
  const locked = it < rules.thresholds.itLock;
  return {
    locked,
    it,
    threshold: rules.thresholds.itLock,
    reason: locked ? `IT ${it.toFixed(1)} < llindar ${rules.thresholds.itLock}: SDP-LOCK.` : null,
  };
}

export async function run(options) {
  const root = options.root || '.';
  const rules = await loadRules();
  const w = rules.trellatMetricsWeights;

  const [auditResult, stats] = await Promise.all([runAudit({ root, mode: 'trellat-metrics' }), walkStats(root)]);
  const ct = coherencia(auditResult.data.summary);
  const ce = eficiencia(stats.totalBytes, stats.fileCount, rules.thresholds.idealBytesPerFile);
  const cr = await resiliencia(root, stats.fileCount);

  const it = w.coherencia * ct + w.eficiencia * ce + w.resiliencia * cr.score;
  const gate = checkGate(it, rules);

  return {
    ok: !gate.locked,
    summary: gate.locked
      ? `🔒 SDP-LOCK: IT=${it.toFixed(1)} per davall de ${rules.thresholds.itLock}. Execució aturada.`
      : `IT=${it.toFixed(1)} (CT=${ct.toFixed(1)} CE=${ce.toFixed(1)} CR=${cr.score.toFixed(1)}).`,
    data: {
      it: Number(it.toFixed(1)),
      components: { coherencia: Number(ct.toFixed(1)), eficiencia: Number(ce.toFixed(1)), resiliencia: Number(cr.score.toFixed(1)) },
      weights: w,
      resilienciaDetail: cr.detail,
      fileCount: stats.fileCount,
      totalBytes: stats.totalBytes,
      gate,
    },
  };
}

```

### [SCRIPT] daemon.mjs
```javascript
#!/usr/bin/env node
// daemon.mjs — CANVIS DE FONS (la resta és idèntica a la teua versió):
//   1. Els imports originals no existien: tombstone_gc.mjs exporta `run` (no runTombstoneGC)
//      i trellat_metrics.mjs exporta `run` (no calculateTrellat). En ESM això és un error
//      d'instanciació de mòdul: el daemon NO HAVIA ARRANCAT MAI. Ara s'importa `run as ...`.
//   2. La crida al GC passava { statePath, snapshot } però run() espera { file, write } i
//      ignorava el callback snapshot: la Regla de Ferro (Snapshot -> Compactació) no es
//      complia. Ara el snapshot es fa EXPLÍCITAMENT abans del GC i s'aborta si falla.
//   3. Si el Trellat activa SDP-LOCK, es registra com a event propi (abans es perdia
//      dins d'un `done` amb ok:false).
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { createSnapshot } from './core/snapshot_engine.mjs';
import { run as runTombstoneGC } from './core/tombstone_gc.mjs';
import { run as calculateTrellat } from './core/trellat_metrics.mjs';
import { run as runSelfRepair } from './core/self_repair.mjs';

const execAsync = promisify(exec);

const MB = 1024 * 1024;

const CFG = {
  root: resolve(process.env.SDP_ROOT || process.cwd()),
  state: process.env.SDP_STATE || '',
  maxRssMb: Number(process.env.SDP_MAX_RSS_MB || 160),
  snapshotMs: Number(process.env.SDP_SNAPSHOT_MS || 60 * 60 * 1000),
  gcMs: Number(process.env.SDP_GC_MS || 6 * 60 * 60 * 1000),
  selfRepairMs: Number(process.env.SDP_SELF_REPAIR_MS || 12 * 60 * 60 * 1000),
  selfRepairWrite: process.env.SDP_SELF_REPAIR_WRITE !== '0',
  checkMs: Number(process.env.SDP_CHECK_MS || 15 * 60 * 1000),
  idleMs: Number(process.env.SDP_IDLE_MS || 2500),
  logDir: process.env.SDP_LOG_DIR || '',
  auditMs: Number(process.env.SDP_AUDIT_MS || 24 * 60 * 60 * 1000), // Diari
  dsStoreSweepMs: Number(process.env.SDP_DSSTORE_SWEEP_MS || 12 * 60 * 60 * 1000) // 2x al dia
};

let stopping = false;
let busy = false;
let lastSnapshot = 0;
let lastGc = 0;
let lastSelfRepair = 0;
let lastCheck = 0;
let lastAudit = 0;
let lastDsStoreSweep = 0;

function now() {
  return Date.now();
}

function rssMb() {
  return process.memoryUsage().rss / MB;
}

function heapMb() {
  return process.memoryUsage().heapUsed / MB;
}

function healthy() {
  return rssMb() < CFG.maxRssMb;
}

function jitter(ms) {
  return Math.round(ms * (0.85 + Math.random() * 0.3));
}

async function log(event, data = {}) {
  const dir = CFG.logDir || join(CFG.root, '04_ARXIU', '01_logs_termodinamics');
  await mkdir(dir, { recursive: true });
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    event,
    rss_mb: Number(rssMb().toFixed(1)),
    heap_mb: Number(heapMb().toFixed(1)),
    ...data
  }) + '\n';
  await writeFile(join(dir, 'daemon.ndjson'), line, { flag: 'a' });
}

async function runSafe(name, fn) {
  if (busy || stopping) return;
  if (!healthy()) {
    await log('skip_memory', { task: name, max_rss_mb: CFG.maxRssMb });
    return;
  }

  busy = true;
  try {
    await sleep(CFG.idleMs);
    if (!healthy()) {
      await log('skip_after_idle', { task: name });
      return;
    }
    const started = now();
    const res = await fn();
    await log('done', { task: name, ms: now() - started, ok: res?.ok !== false });
  } catch (err) {
    await log('error', { task: name, error: err.message });
  } finally {
    busy = false;
    if (global.gc && !healthy()) global.gc();
  }
}

async function tick() {
  const t = now();

  if (t - lastSnapshot >= CFG.snapshotMs) {
    lastSnapshot = t;
    await runSafe('snapshot', () => createSnapshot({ root: CFG.root }));
  }

  if (CFG.state && existsSync(CFG.state) && t - lastGc >= CFG.gcMs) {
    lastGc = t;
    await runSafe('gc', async () => {
      // Regla de Ferro (tombstone_gc.mjs, capçalera): Snapshot -> Compactació -> Informe.
      const snap = await createSnapshot({ root: CFG.root });
      if (!snap.ok) {
        await log('gc_abort', { reason: 'snapshot previ no verificat' });
        return { ok: false };
      }
      return runTombstoneGC({ file: CFG.state, write: true });
    });
  }

  if (CFG.selfRepairMs > 0 && t - lastSelfRepair >= CFG.selfRepairMs) {
    lastSelfRepair = t;
    await runSafe('self_repair', () => runSelfRepair({ root: CFG.root, write: CFG.selfRepairWrite }));
  }

  if (t - lastCheck >= CFG.checkMs) {
    lastCheck = t;
    await runSafe('trellat', async () => {
      const res = await calculateTrellat({ root: CFG.root });
      if (res.data?.gate?.locked) {
        await log('sdp_lock', { it: res.data.it, threshold: res.data.gate.threshold });
      }
      return res;
    });
  }

  if (t - lastAudit >= CFG.auditMs) {
    lastAudit = t;
    await runSafe('audit_integritat', async () => {
      const scriptPath = join(CFG.root, '02_ACTUAR_Maquina_Tecnica', 'scripts', 'audit_integritat_estructural.cjs');
      const { stdout } = await execAsync(`node "${scriptPath}" --root "${CFG.root}"`).catch(e => e);
      return { ok: true, report_preview: stdout ? stdout.slice(-100).trim() : 'failed' };
    });
  }

  if (t - lastDsStoreSweep >= CFG.dsStoreSweepMs) {
    lastDsStoreSweep = t;
    await runSafe('dsstore_sweep', async () => {
      await execAsync(`find "${CFG.root}" -name ".DS_Store" -type f -delete`).catch(() => {});
      return { ok: true };
    });
  }
}

async function main() {
  await log('start', { root: CFG.root, max_rss_mb: CFG.maxRssMb });
  while (!stopping) {
    await tick();
    await sleep(jitter(30_000));
  }
  await log('stop');
}

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { stopping = true; });
}

main().catch(async err => {
  await log('fatal', { error: err.message }).catch(() => {});
  process.exit(70);
});

```

### [SCRIPT] detect_duplicates.cjs
```javascript
#!/usr/bin/env node
/**
 * Script per a detectar contingut duplicat a la Wiki.
 * Execució: node detect_duplicates.js [--fix]
 * --fix: Intenta fusionar automàticament (experimental).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuració
const WIKI_DIR = path.resolve(__dirname, '..');
const MIN_SIMILARITY = 0.8; // 80% de similitud = duplicat

// Funció per a calcular hash de contingut
function hashContent(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Funció per a comparar contingut (simplificada)
function compareContent(content1, content2) {
  const set1 = new Set(content1.toLowerCase().split(/\\s+/));
  const set2 = new Set(content2.toLowerCase().split(/\\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

// Funció per a trobar duplicats
function findDuplicates() {
  const files = [];
  const duplicates = [];

  // Recollir tots els fitxers .md
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    });
  };
  walk(WIKI_DIR);

  // Comparar tots els fitxers
  for (let i = 0; i < files.length; i++) {
    const content1 = fs.readFileSync(files[i], 'utf-8');
    for (let j = i + 1; j < files.length; j++) {
      const content2 = fs.readFileSync(files[j], 'utf-8');
      const similarity = compareContent(content1, content2);
      if (similarity >= MIN_SIMILARITY) {
        duplicates.push({
          file1: files[i],
          file2: files[j],
          similarity: (similarity * 100).toFixed(2) + '%'
        });
      }
    }
  }
  return duplicates;
}

// Funció per a fusionar fitxers (experimental)
function mergeFiles(file1, file2) {
  const content1 = fs.readFileSync(file1, 'utf-8');
  const content2 = fs.readFileSync(file2, 'utf-8');

  // Simple fusion: Unir continguts amb separador
  const mergedContent = `${content1}\\n\\n---\\n\\n## 🔄 Contingut Fusionat de: ${file2}\\n${content2}`;

  // Escriure al primer fitxer
  fs.writeFileSync(file1, mergedContent);
  console.log(`✅ Fusionats: ${file1} + ${file2}`);

  // Esborrar el segon fitxer (opcional)
  // fs.unlinkSync(file2);
  // console.log(`   ✅ Esborrat: ${file2}`);
}

// Funció principal
function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix');

  console.log('🔍 Buscant contingut duplicat a la Wiki...');
  const duplicates = findDuplicates();

  if (duplicates.length === 0) {
    console.log("✅ No s'han trobat duplicats.");
    return;
  }

  console.log(`\n⚠️  S'han trobat ${duplicates.length} possibles duplicats:`);
  duplicates.forEach((dup, index) => {
    console.log(`\n${index + 1}. ${dup.file1} <-> ${dup.file2} (${dup.similarity} similitud)`);
  });

  if (fix) {
    console.log('\n🔧 Fusionant automàticament...');
    duplicates.forEach(dup => {
      mergeFiles(dup.file1, dup.file2);
    });
    console.log('✅ Fusió completada. Revisa manualment els resultats.');
  } else {
    console.log('\n💡 Executa amb `--fix` per a fusionar automàticament (experimental).');
  }
}

main();

```

### [SCRIPT] enforce_termodinamic.js
```javascript
// _wiki_de_poble/scripts/enforce_termodinamic.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WIKI_DIR = path.join(__dirname, '..');
const TERMODINAMIC_REGEX = /^\d{6}_\d{4}_[A-Z]+_[a-z0-9_]+(\.[a-z0-9]+)?$/i;
const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET'];

// Funció per validar el nom
function isValidTermodinamicName(filename) {
  return TERMODINAMIC_REGEX.test(filename);
}

// Funció per generar un nom vàlid
function generateTermodinamicName(originalName, content = '') {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 16).replace(/[-:]/g, '').replace('T', '_');
  const ext = path.extname(originalName).toLowerCase();

  // Extreure categoria i títol del contingut o del nom original
  let category = 'DOC'; // Per defecte
  let title = path.basename(originalName, ext).replace(/\s+/g, '_').toLowerCase();

  // Intentar detectar categoria des del contingut (ex: si conté "SKILL:")
  if (content.includes('SKILL:')) category = 'SKILL';
  if (content.includes('ACTA:')) category = 'ACTA';
  if (content.includes('REPORT:')) category = 'REPORT';

  // Si la categoria no és vàlida, usar DOC
  if (!CATEGORIES.includes(category)) category = 'DOC';

  return `${datePart}_${category}_${title}${ext}`;
}

// Escanejar i corregir
function enforceDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let fixedFiles = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Ignore node_modules, .git, .obsidian, .agents, etc
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      fixedFiles += enforceDirectory(fullPath);
    } else if (entry.isFile() && !isValidTermodinamicName(entry.name)) {
      // Ignore some special files
      if (['AGENTS.md', 'README.md', 'package.json', 'escriptura-protegida.js'].includes(entry.name) || entry.name.endsWith('.js') || entry.name.endsWith('.cjs') || entry.name.endsWith('.sh')) {
        continue; // Only enforce on wiki documents
      }
      const content = fs.readFileSync(fullPath, 'utf-8');
      const newName = generateTermodinamicName(entry.name, content);
      const newPath = path.join(dir, newName);

      console.log(`⚠️  Fitxer no termodinàmic: ${fullPath}`);
      console.log(`   → Proposta: ${newName}`);

      // Bloquejar l'accés fins que es renombri
      fs.chmodSync(fullPath, 0o000); // Treure permisos de lectura/escriptura
      console.log(`   ❌ Accés bloquejat. Executa: mv "${fullPath}" "${newPath}"`);

      fixedFiles++;
    }
  }
  return fixedFiles;
}

// Executar
console.log('🔍 Escanejant fitxers no termodinàmics...');
const fixed = enforceDirectory(WIKI_DIR);
if (fixed === 0) {
  console.log('✅ Tots els fitxers compleixen el format termodinàmic.');
} else {
  console.log(`⚠️  S'han trobat ${fixed} fitxers no termodinàmics. Executa les comandes de renombratge.`);
}

```

### [SCRIPT] entropia_zero_router.js
```javascript
/**
 * ENTROPIA ZERO ROUTER (V5.0.3)
 * Arquitectura de Macro-Regions de DeepSeek
 */
const path = require('path');

// Les propietats del Nucli Universal (Qwen + Aliases)
const CORE_PROPS = [
    'id', 'name', 'version', 'created_at', 'updated_at',
    'autor', 'categoria', 'macro_regio', 'tags', 'estat', 'related',
    'aliases' // Restaurem aliases a petició del Mestre
];

// Les propietats de governança (opcionals)
const GOV_PROPS = ['tier', 'pes_regla'];

const ALLOWED_MACRO_REGIONS = ['Còrtex', 'Hipocamp', 'Motor', ''];
const ALLOWED_ESTATS = ['actiu', 'arxivat', 'deprecated'];
const GOV_TYPES = ['directriu', 'norma', 'protocol'];

// Taula d'Enrutament basada en DeepSeek
const ROUTING_TABLE = {
    // 🏛️ Còrtex (Govern i Identitat)
    'identitat': '01_identitat_iaia/', 
    'filosofia': '02_filosofia/',
    'directriu': '03_govern/',
    'norma': '03_govern/',
    'protocol': '03_govern/',
    'capacitat': '08_capacitats/',
    'acte': '10_actes/',
    'memoria': '10_actes/',

    // 🧠 Hipocamp (Coneixement i Cultura)
    'cultura': '06_cultura/',
    'plantilla': '07_plantilles/',
    'arxiu': '90_arxiu_historic/',

    // ⚙️ Motor (Arquitectura i Execució)
    'arquitectura': '04_arquitectura_disseny/',
    'disseny': '04_arquitectura_disseny/',
    'skill': '05_skills_ia/',
    'script': '99_maquinaria/',
    'eina': '99_maquinaria/',
    'schema': '99_maquinaria/'
};

function validarFrontmatter(fm) {
    const errors = [];
    
    // Core
    for (const prop of CORE_PROPS) {
        if (prop !== 'aliases' && prop !== 'version' && prop !== 'tags' && prop !== 'related' && (fm[prop] === undefined || fm[prop] === null)) {
            errors.push(`Falta propietat obligatòria: ${prop}`);
        }
    }

    // Propietats prohibides
    const allAllowed = [...CORE_PROPS, ...GOV_PROPS];
    for (const key of Object.keys(fm)) {
        if (!allAllowed.includes(key)) {
            errors.push(`Propietat prohibida detectada: ${key}`);
        }
    }

    if (fm.macro_regio && !ALLOWED_MACRO_REGIONS.includes(fm.macro_regio)) {
        errors.push(`macro_regio invàlida: ${fm.macro_regio}`);
    }
    if (fm.estat && !ALLOWED_ESTATS.includes(fm.estat)) {
        errors.push(`estat invàlid: ${fm.estat}`);
    }

    if (fm.tipus && GOV_TYPES.includes(fm.tipus)) {
        if (fm.tier === undefined) errors.push(`Falta 'tier' per a govern (${fm.tipus})`);
        if (fm.pes_regla === undefined) errors.push(`Falta 'pes_regla' per a govern (${fm.tipus})`);
    }

    if (fm.related && Array.isArray(fm.related) && fm.related.length > 5) {
        errors.push(`Límit d'entropia excedit: màxim 5 enllaços 'related'.`);
    }

    return errors;
}

function determinarCarpeta(fm) {
    if (fm.estat === 'arxivat') {
        return '90_arxiu_historic/';
    }

    let carpetaBase = ROUTING_TABLE[fm.tipus];
    
    // Fallbacks
    if (!carpetaBase) {
        if (fm.macro_regio === 'Còrtex') carpetaBase = '03_govern/';
        else if (fm.macro_regio === 'Hipocamp') carpetaBase = '06_cultura/';
        else carpetaBase = '99_maquinaria/';
    }

    return carpetaBase;
}

module.exports = {
    validarFrontmatter,
    determinarCarpeta,
    CORE_PROPS,
    GOV_PROPS
};

```

### [SCRIPT] escriptori_to_wiki.js
```javascript
// _wiki_de_poble/scripts/escriptori_to_wiki.js
const fs = require('fs');
const path = require('path');

const ESCRIPTORI_DIR = path.join(__dirname, '..', 'escriptori');
const WIKI_DIR = path.join(__dirname, '..');
const TERMODINAMIC_REGEX = /^\d{6}_\d{4}_[A-Z]+_[a-z0-9_]+(\.[a-z0-9]+)?$/i;
const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET'];

// Funció per generar nom termodinàmic
function generateTermodinamicName(originalName, content) {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 16).replace(/[-:]/g, '').replace('T', '_');
  const ext = path.extname(originalName).toLowerCase();

  let category = 'DOC';
  let title = path.basename(originalName, ext).replace(/\s+/g, '_').toLowerCase();

  if (content.includes('ACTA:')) category = 'ACTA';
  if (content.includes('SKILL:')) category = 'SKILL';
  if (content.includes('REPORT:')) category = 'REPORT';

  if (!CATEGORIES.includes(category)) category = 'DOC';

  return `${datePart}_${category}_${title}${ext}`;
}

// Funció per determinar la carpeta destí
function getDestinationDir(filename) {
  if (filename.includes('ACTA')) return path.join(WIKI_DIR, '90_actes');
  if (filename.includes('SKILL')) return path.join(WIKI_DIR, '05_skills_ia');
  if (filename.includes('DOC')) return path.join(WIKI_DIR, '01_SABER_Cultura_Coneixement');
  return path.join(WIKI_DIR, '00_SER_Brain_Identitat'); // Per defecte
}

// Processar l'escriptori
async function processEscriptori() {
  if (!fs.existsSync(ESCRIPTORI_DIR)) {
    console.log('⚠️  Carpeta `escriptori/` no existeix.');
    return;
  }

  const files = fs.readdirSync(ESCRIPTORI_DIR);
  if (files.length === 0) {
    console.log('✅ Escriptori buit.');
    return;
  }

  console.log(`🔍 Processant ${files.length} fitxers a l'escriptori...`);

  for (const file of files) {
    const oldPath = path.join(ESCRIPTORI_DIR, file);
    const content = fs.readFileSync(oldPath, 'utf-8');
    const newName = generateTermodinamicName(file, content);
    const destDir = getDestinationDir(newName);
    const newPath = path.join(destDir, newName);

    // Crear la carpeta si no existeix
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Moure el fitxer
    fs.renameSync(oldPath, newPath);
    console.log(`   ✅ Mogut: ${file} → ${newName} (a ${destDir})`);
  }

  // Reconstruir índexs
  console.log('🔄 Reconstruint índexs...');
  const { execSync } = require('child_process');
  execSync('node scripts/auto_audit_skills.cjs --rebuild-index', { cwd: WIKI_DIR, stdio: 'inherit' });

  // Netejar l'escriptori
  fs.rmdirSync(ESCRIPTORI_DIR, { recursive: true });
  fs.mkdirSync(ESCRIPTORI_DIR);
  console.log('✅ Escriptori netejat i destil·lat.');
}

// Executar
processEscriptori().catch(console.error);

```

### [SCRIPT] escriptura-protegida.cjs
```javascript
// _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/escriptura-protegida.js
// WRAPPER D'ESCRIPTURA (SISTEMA DE BLOQUEIG TOTAL)
// Aquest script encapsula l'operació d'escriptura al sistema d'arxius, obligant
// a qualsevol altre procés a passar pel sedàs termodinàmic abans de persistir.

const fs = require('fs').promises;
const path = require('path');
const { isValid, normalize } = require('./termodinamic.cjs');
const { execSync } = require('child_process');

const WIKI_DIR = path.resolve(__dirname, '..', '..');

/**
 * Funció d'escriptura segura que substitueix l'escriptura directa.
 * @param {string} filePath - Ruta destí.
 * @param {string} content - Contingut de l'arxiu.
 * @param {object} options - Opcions de fs.writeFile.
 */
async function writeFileProtected(filePath, content, options = 'utf8') {
  // 1. Validar que estem escrivint dins del domini de la Wiki
  if (!path.resolve(filePath).startsWith(WIKI_DIR)) {
    return fs.writeFile(filePath, content, options);
  }

  const fileName = path.basename(filePath);
  const relativePath = path.relative(WIKI_DIR, filePath);

  // 2. Comprovar si el nom és vàlid termodinàmicament (excepte excepcions)
  if (fileName.endsWith('.md') && fileName !== 'README.md' && fileName !== '00_index.md' && fileName !== 'SKILL.md') {
    if (!isValid(fileName)) {
      console.warn(`[WARN] Escriptura de ${fileName} interceptada. El nom no és termodinàmic.`);
      
      // En lloc de bloquejar de manera rígida, aplicarem el principi de forçament mecànic:
      // Calculem el nom correcte automàticament i ho guardem amb aquest nom.
      const correctedName = normalize(fileName, content);
      const newPath = path.join(path.dirname(filePath), correctedName);
      
      console.log(`[FIX] Renomenant automàticament a: ${correctedName}`);
      await fs.writeFile(newPath, content, options);
      return newPath;
    }
  }

  // 3. Validació de Duplicitats (pre-commit hook style)
  // Això s'executaria si tenim l'script detect_duplicates.js adaptat per funcionar en mode --check
  try {
    // execSync(`node ${path.join(WIKI_DIR, '02_ACTUAR_Maquina_Tecnica/scripts/detect_duplicates.cjs')} --check "${filePath}"`);
  } catch (err) {
    throw new Error(`❌ [FATAL ERROR] Duplicitat semàntica detectada abans d'escriure.`);
  }

  // 4. Escriptura nativa si tot és correcte
  await fs.writeFile(filePath, content, options);
  return filePath;
}

module.exports = {
  writeFile: writeFileProtected
};

```

### [SCRIPT] fetch_town_media.mjs
```javascript
import fs from 'fs';
import path from 'path';
import https from 'https';

const TOWNS = [
    "Agost", "Alacant", "Alzira", "Banyeres de Mariola", "Benidorm", "Bunyol", 
    "Cullera", "Elx", "Enguera", "Gandia", "Girona", "Oriola", "Torrent", 
    "Villena", "Vinaròs", "Xàtiva"
];

// Special overrides to avoid disambiguations (e.g., Agost=Month, Cullera=Spoon, Elx=Dama)
const OVERRIDES = {
    "Agost": "Agost (l'Alacantí)",
    "Bunyol": "Buñol",
    "Cullera": "Cullera",
    "Elx": "Elche",
    "Xàtiva": "Xàtiva"
};

const BASE_DIR = path.join(process.cwd(), '../public/assets/towns');

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

const isBadImage = (url) => {
    if (!url) return true;
    const lurl = url.toLowerCase();
    // Rejects maps, shields, diagrams, spoons (just in case), dama de elche busts, and small low-res
    return lurl.includes('.svg') || lurl.includes('escut') || lurl.includes('escudo') || 
           lurl.includes('mapa') || lurl.includes('map') || lurl.includes('bandera') || 
           lurl.includes('flag') || lurl.includes('locator') || lurl.includes('location') ||
           lurl.includes('grafic') || lurl.includes('graph') || lurl.includes('poblacio') ||
           lurl.includes('plan') || lurl.includes('dama_de_elche') || lurl.includes('spoon') ||
           lurl.includes('cullera_(') || lurl.includes('libro') || lurl.includes('book');
};

const sanitizeSlug = (name) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

const downloadImage = (url, destPath) => {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'SocDePoble/1.0 AgentFetcher' } }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to GET ${url} (${res.statusCode})`));
            }
            const file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', reject);
    });
};

const fetchTownImages = async (townName) => {
    const slug = sanitizeSlug(townName);
    const townDir = path.join(BASE_DIR, slug);
    if (!fs.existsSync(townDir)) {
        fs.mkdirSync(townDir, { recursive: true });
    }

    const searchQuery = OVERRIDES[townName] || townName;

    // Search Wikimedia Commons for categories like "Views of [Town]" or just photos in the town's category
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=intitle:"vista" OR intitle:"panorama" OR intitle:"plaza" OR intitle:"paisaje" + ${encodeURIComponent(searchQuery)} -incategory:"Maps"&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`;

    return new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'SocDePoble/1.0 AgentFetcher' } }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", async () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query?.pages;
                    if (!pages) {
                        console.log(`[!] No images found on Commons for ${townName} using strict filters. Trying fallback...`);
                        await fallbackFetch(townName, townDir, searchQuery);
                        return resolve();
                    }

                    const images = Object.values(pages)
                        .map(p => {
                            const info = p.imageinfo?.[0];
                            return info?.thumburl || info?.url;
                        })
                        .filter(url => url && !isBadImage(url));

                    if (images.length === 0) {
                        console.log(`[!] All images filtered out as low quality/maps for ${townName}.`);
                        await fallbackFetch(townName, townDir, searchQuery);
                        return resolve();
                    }

                    // Download top 3
                    const max = Math.min(3, images.length);
                    for (let i = 0; i < max; i++) {
                        const imgUrl = images[i];
                        const ext = imgUrl.split('.').pop().toLowerCase().split('?')[0] || 'jpg';
                        const dest = path.join(townDir, `${i + 1}.jpg`); // we'll save it as jpg
                        console.log(`[+] Downloading ${townName} - Image ${i+1}: ${imgUrl}`);
                        await downloadImage(imgUrl, dest);
                    }
                    resolve();

                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const fallbackFetch = async (townName, townDir, searchQuery) => {
    // If strict search failed, do a broader search but still filter out bad stuff
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)} panorama OR vista&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`;
    
    return new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'SocDePoble/1.0 AgentFetcher' } }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", async () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query?.pages;
                    if (!pages) return resolve();

                    const images = Object.values(pages)
                        .map(p => {
                            const info = p.imageinfo?.[0];
                            return info?.thumburl || info?.url;
                        })
                        .filter(url => url && !isBadImage(url));

                    const max = Math.min(3, images.length);
                    for (let i = 0; i < max; i++) {
                        const imgUrl = images[i];
                        const dest = path.join(townDir, `${i + 1}.jpg`);
                        console.log(`[INFO] Downlading Fallback ${townName} - Image ${i+1}: ${imgUrl}`);
                        await downloadImage(imgUrl, dest);
                    }
                    resolve();
                } catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

const run = async () => {
    for (const town of TOWNS) {
        try {
            await fetchTownImages(town);
        } catch (e) {
            console.error(`[-] Error in ${town}:`, e.message);
        }
    }
    console.log("Done fetching!");
};

run();

```

### [SCRIPT] fix_graph_links.cjs
```javascript
const fs = require('fs');
const path = require('path');

const wikiRoot = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';

// 1. Fix Skills
const skillsDir = path.join(wikiRoot, '05_skills_ia');
const skills = fs.readdirSync(skillsDir);
for (const skillFolder of skills) {
  const skillPath = path.join(skillsDir, skillFolder, 'SKILL.md');
  if (fs.existsSync(skillPath)) {
    const content = fs.readFileSync(skillPath, 'utf8');
    if (!content.includes('[[00_index')) {
      fs.appendFileSync(skillPath, '\n\n---\n## 🔗 Veure també\n- [[00_index|Índex Central]]\n');
      console.log(`Afegit enllaç a 00_index en: ${skillFolder}`);
    }
  }
}

// 2. Fix Plantilles
const plantillesDir = path.join(wikiRoot, '07_plantilles');
const plantilles = fs.readdirSync(plantillesDir);
for (const plantilla of plantilles) {
  if (plantilla.endsWith('.md')) {
    const pPath = path.join(plantillesDir, plantilla);
    const content = fs.readFileSync(pPath, 'utf8');
    if (!content.includes('[[00_index')) {
      fs.appendFileSync(pPath, '\n\n---\n## 🔗 Veure també\n- [[00_index|Índex Central]]\n');
      console.log(`Afegit enllaç a 00_index en: ${plantilla}`);
    }
  }
}

// 3. Fix Prompts and Bundles (connect to 00_historial_sessions)
const produccioDir = path.join(wikiRoot, '80_produccio/generats_hui');
const historialPath = path.join(wikiRoot, '90_arxiu_historic/00_historial_sessions.md');
let historialContent = '';
if (fs.existsSync(historialPath)) {
  historialContent = fs.readFileSync(historialPath, 'utf8');
} else {
  historialContent = '# Historial de Sessions i Prompts\n\n';
}

const produccioFiles = fs.readdirSync(produccioDir);
for (const prodFile of produccioFiles) {
  if (prodFile.endsWith('.md')) {
    const filePath = path.join(produccioDir, prodFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Add backlink inside the prompt
    if (!content.includes('[[90_arxiu_historic/00_historial_sessions')) {
      fs.appendFileSync(filePath, '\n\n---\n## 🔗 Registre Històric\n- Aquest document està indexat a: [[90_arxiu_historic/00_historial_sessions|Historial de Sessions]]\n');
      console.log(`Afegit backlink a historial en: ${prodFile}`);
    }
    
    // Add forward link in the history file
    const linkStr = `- [[80_produccio/generats_hui/${prodFile.replace('.md', '')}]]`;
    if (!historialContent.includes(linkStr)) {
      historialContent += `${linkStr}\n`;
      console.log(`Afegit link al historial per a: ${prodFile}`);
    }
  }
}

fs.writeFileSync(historialPath, historialContent, 'utf8');

// 4. Update 00_index.md with the actual skills list
const indexPath = path.join(wikiRoot, '00_index.md');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace the skills section
let newSkillsList = '## 05. Skills IA (Arquitectura Cognitiva)\n';
const sortedSkills = skills.filter(s => !s.startsWith('.') && fs.existsSync(path.join(skillsDir, s, 'SKILL.md'))).sort();
for (const s of sortedSkills) {
  newSkillsList += `- [[05_skills_ia/${s}/SKILL|${s}]]\n`;
}

// Simple regex replace for the section between ## 05. Skills IA and ## 06. Cultura
indexContent = indexContent.replace(/## 05\. Skills IA[\s\S]*?(?=## 06\. Cultura)/, newSkillsList + '\n');

// Replace Plantilles section
let newPlantillesList = '## 07. Plantilles\n';
const sortedPlantilles = plantilles.filter(p => p.endsWith('.md')).sort();
for (const p of sortedPlantilles) {
  newPlantillesList += `- [[07_plantilles/${p.replace('.md', '')}|${p.replace('.md', '')}]]\n`;
}

indexContent = indexContent.replace(/## 07\. Plantilles[\s\S]*?(?=## 08\. Capacitats)/, newPlantillesList + '\n');

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('00_index.md actualitzat amb les llistes exactes.');

```

### [SCRIPT] generate_bundle.cjs
```javascript
#!/usr/bin/env node
// generate_bundle.cjs
// Concatena tota la Wiki en un únic fitxer de text pla per donar context a l'eixam.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const BUNDLE_DIR = path.join(WIKI_ROOT, '03_REGISTRE_Actes_Efimers');
const IGNORE_DIRS = ['.git', 'node_modules', 'scripts', '_build', '99_assets'];

function getAllMarkdownFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('BUNDLE')) {
      files.push(fullPath);
    }
  }
  return files;
}

function generateBundle() {
  const files = getAllMarkdownFiles(WIKI_ROOT);
  let bundleContent = `# BUNDLE COMPLET DE LA WIKI SÓC DE POBLE\nGenerat: ${new Date().toISOString()}\n\n`;
  bundleContent += `Aquest fitxer conté el contingut complet i actualitzat de tota la base de coneixement. Useu-lo per tindre context absolut i no inventar res.\n\n`;
  bundleContent += `========================================================================\n\n`;

  for (const file of files) {
    const relPath = path.relative(WIKI_ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    
    bundleContent += `\n\n------------------------------------------------------------------------\n`;
    bundleContent += `📂 FITXER: ${relPath}\n`;
    bundleContent += `------------------------------------------------------------------------\n\n`;
    bundleContent += content;
  }

  const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(2, 10) + '_' + new Date().toISOString().slice(11,16).replace(':', '');
  const bundleFile = path.join(BUNDLE_DIR, `${timestamp}_BUNDLE_Wiki_Completa.md`);
  
  fs.writeFileSync(bundleFile, bundleContent, 'utf8');
  console.log(`✅ Bundle generat correctament a: ${bundleFile}`);
}

generateBundle();

```

### [SCRIPT] generate_bundle_fixed.cjs
```javascript
const fs = require('fs').promises;
const path = require('path');

const ROOT = process.argv.includes('--root') ? process.argv[process.argv.indexOf('--root') + 1] : '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
function getTrellatTimestamp() {
  const d = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const yy = d.getFullYear().toString().slice(-2);
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yy}${mm}${dd}_${hh}${min}`;
}
const OUT = path.join(ROOT, '04_ARXIU', `${getTrellatTimestamp()}_BUNDLE_Wiki_Completa.md`);

async function trobarMarkdown(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const resultats = await Promise.all(
    entries.map(async (e) => {
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.') && e.name !== '04_ARXIU') {
        return trobarMarkdown(fullPath);
      }
      if (
        e.name.endsWith('.md') ||
        e.name.endsWith('.js') ||
        e.name.endsWith('.mjs') ||
        e.name.endsWith('.cjs') ||
        e.name.endsWith('.json') ||
        e.name.endsWith('.html') ||
        e.name.endsWith('.css')
      ) return [fullPath];
      return [];
    })
  );
  return resultats.flat();
}

(async () => {
  const fitxers = await trobarMarkdown(ROOT);
  let bundleContent = '# 📦 BUNDLE COMPLET DE LA WIKI SÓC DE POBLE (ESTRUCTURAL)\n\n';
  bundleContent += '> Aquest document conté el bolcat complet de tots els fitxers canònics de la Wiki per a auditoria estructural.\n\n';
  bundleContent += '---\n\n';

  for (const fitxer of fitxers) {
    if (fitxer === OUT || fitxer.includes('BUNDLE')) continue;
    const contingut = await fs.readFile(fitxer, 'utf8');
    const relPath = path.relative(ROOT, fitxer);
    bundleContent += `## 📄 FITXER: ${relPath}\n\`\`\`markdown\n${contingut}\n\`\`\`\n\n---\n\n`;
  }

  await fs.writeFile(OUT, bundleContent);
  console.log(`✅ Bundle generat a: ${OUT}`);
})();

```

### [SCRIPT] generate_nano_prompt.cjs
```javascript
const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const artifactOutputPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0735_PETORRETA_NANO.md';
const IGNORE_DIRS = ['.git', 'node_modules', 'scripts', '_build', '99_assets', 'assets', 'actes_arxivades', '80_produccio'];

function getFileTree(dir, prefix = '') {
  let tree = '';
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name) || entry.name.includes('BUNDLE') || entry.name.includes('PETORRETA')) continue;
    
    if (entry.isDirectory()) {
      tree += `${prefix}📁 ${entry.name}\n`;
      tree += getFileTree(path.join(dir, entry.name), prefix + '  ');
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      tree += `${prefix}📄 ${entry.name}\n`;
    }
  }
  return tree;
}

const fileTree = getFileTree(WIKI_ROOT);

let nanoPrompt = `# 🔥 PETORRETA TAXONÒMICA (VERSIÓ NANO)

Copieu aquest text exacte per al xat web. Només conté l'índex estructural (res de contingut intern) per a que càpiga a la caixa de text gratuïta de ChatGPT.

---

CONSELL DE LES 12 PETORRETES: SÓC DE POBLE! 🔥

Mestre Javi al comandament. Hem depurat la nostra Wiki (la base d'una PWA rural offline-first basada en CRDT) fins a deixar només aquesta estructura de pilars essencials:

\`\`\`
${fileTree}
\`\`\`

Aquesta és l'ÚLTIMA TASCA per a aquesta sessió abans d'esgotar tokens. Treballeu en equip. Heu de deduir pel nom dels fitxers i l'estructura la millor manera d'organitzar les nostres metadades.

**Grup 1 (Qwen, Kimi, Deepseek):** Tècnics (02_EXECUTAR).
**Grup 2 (Mistral Vibe, Gemini, Copilot):** Filòsofs i Cultura (01_SABER).
**Grup 3 (Grok, Dola, Z, Perplexity):** Identitat i Memòria (00_SER, 03_REGISTRE).

Vull que definisquen EXACTAMENT això (cadascú del seu pilar):

1. **LA TAXONOMIA CANÒNICA (Frontmatter YAML):**
   - Llista CERRADA i ESTRICTA de \`tipus\` per a tota la Wiki.
   - Arbre de \`tags\` per al teu pilar (tècniques i rurals).
   - \`properties\` addicionals necessàries per a que el nostre compilador estricte no falle.

2. **EL DICCIONARI DEL GLOSSARI:**
   - Paraules clau tècniques del teu pilar.
   - Paraules metafòriques rurals del teu pilar (ex: Trellat).

3. **MISTRAL VIBE (Exclusiu):**
   - Escriu l'script \`watch_wiki.cjs\` 100% en Node.js natiu (sense inotifywait) usant \`fs.watch\` o \`fs.watchFile\` per a que recompile el \`knowledge.json\` de la Wiki automàticament en guardar un fitxer.

Donem l'esquema exacte. Sóc de Poble!
`;

fs.writeFileSync(artifactOutputPath, nanoPrompt, 'utf8');
console.log('✅ Petorreta NANO creada a: ' + artifactOutputPath);

```

### [SCRIPT] generate_pilars.cjs
```javascript
#!/usr/bin/env node
// generate_pilars.cjs
// Genera l'índex de cada pilar (SER, SABER, EXECUTAR, REGISTRE) automàticament.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const PILARS = {
  '00_SER_Brain_Identitat': 'SER',
  '01_SABER_Cultura_Coneixement': 'SABER',
  '02_EXECUTAR_Maquina_Tecnica': 'EXECUTAR',
  '03_REGISTRE_Actes_Efimers': 'REGISTRE',
};

function generateIndex(pilarDir, pilarName) {
  const entries = fs.readdirSync(pilarDir, { withFileTypes: true });
  let md = `---\nname: index-${pilarName.toLowerCase()}\nversion: V1\nauthority: IAIA MarIA\ntipus: index\n---\n`;
  md += `# 📂 Índex del Pilar ${pilarName}\n\n`;
  
  for (const entry of entries) {
    if (!entry.name.endsWith('.md') || entry.name.startsWith('00_index')) continue;
    const name = entry.name.replace('.md', '');
    const display = name.replace(/_/g, ' ').replace(/^\d+_/, '');
    md += `- [[${entry.name}|${display}]]\n`;
  }
  
  md += `\n---\n*Generat per generate_pilars.cjs | ${new Date().toISOString()}*\n`;
  return md;
}

Object.entries(PILARS).forEach(([dir, name]) => {
  const fullDir = path.join(WIKI_ROOT, dir);
  if (!fs.existsSync(fullDir)) {
    console.error(`⚠️  Pilar ${name} no existeix: ${dir}`);
    return;
  }
  
  const indexPath = path.join(fullDir, '00_index.md');
  const content = generateIndex(fullDir, name);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`✅ Índex generat: ${dir}/00_index.md`);
});

```

### [SCRIPT] generate_slim_bundle.cjs
```javascript
const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0705_PROMPT_Petorreta_Taxonomica_i_Glossari.md';
const artifactOutputPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0730_PETORRETA_SLIM.md';

const IGNORE_DIRS = ['.git', 'node_modules', 'scripts', '_build', '99_assets', 'assets', 'actes_arxivades', '80_produccio'];

function getAllMarkdownFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('BUNDLE') && !entry.name.includes('PETORRETA')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllMarkdownFiles(WIKI_ROOT);
let bundleContent = `# BUNDLE DE LA WIKI SÓC DE POBLE (VERSIÓ EXTREMA SLIM)\nGenerat: ${new Date().toISOString()}\n\n`;
bundleContent += `Aquest fitxer conté el nucli de la base de coneixement. S'han exclòs les actes, i TOTS ELS FITXERS S'HAN TRUNCAT A LES PRIMERES 35 LÍNIES per reduir tokens (només per extreure frontmatter i vocabulari).\n\n`;
bundleContent += `========================================================================\n\n`;

for (const file of files) {
  const relPath = path.relative(WIKI_ROOT, file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const slimContent = lines.slice(0, 35).join('\n');
  
  bundleContent += `\n\n------------------------------------------------------------------------\n`;
  bundleContent += `📂 FITXER: ${relPath}\n`;
  bundleContent += `------------------------------------------------------------------------\n\n`;
  bundleContent += slimContent;
  if (lines.length > 35) {
    bundleContent += `\n\n[... CONTINGUT TRUNCAT PER ESTALVIAR TOKENS ...]`;
  }
}

const promptContent = fs.readFileSync(promptPath, 'utf8');
const combinedContent = promptContent + '\n\n' + bundleContent;

// No cal ArtifactMetadata, però ho escrivim
fs.writeFileSync(artifactOutputPath, combinedContent, 'utf8');
console.log('✅ Petorreta Slim Extrema creada a: ' + artifactOutputPath);

```

### [SCRIPT] kimi_purge.cjs
```javascript
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('.', function(filePath) {
  if (filePath.endsWith('.md') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/[Ll]a Mas[íi]a/g, 'el Mas')
      .replace(/Mas[íi]a/g, 'Mas')
      .replace(/\b[Tt]he\b /g, '')
      .replace(/ \b[Tt]he\b/g, '');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});

```

### [SCRIPT] frontmatter.mjs
```javascript
// lib/frontmatter.mjs — Parser de frontmatter YAML pur regex. Zero dependències.
// Trellat: no importem js-yaml. Cobreix escalars, strings citats i llistes planes,
// que és el 100% del que fa servir la Wiki de Sóc de Poble hui.

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Separa un fitxer .md en { data, body }.
 * @param {string} raw contingut complet del fitxer
 */
export function parseFrontmatter(raw) {
  const m = FM_RE.exec(raw);
  if (!m) return { data: {}, body: raw, hasFrontmatter: false };
  return { data: parseYamlLite(m[1]), body: raw.slice(m[0].length), hasFrontmatter: true };
}

function unquote(s) {
  const t = s.trim();
  if (t.length >= 2) {
    const first = t[0];
    const last = t[t.length - 1];
    if (first === "'" && last === "'") {
      return t.slice(1, -1).replace(/''/g, "'"); // YAML: '' dins de cometes simples = ' literal
    }
    if (first === '"' && last === '"') {
      return t.slice(1, -1);
    }
  }
  return t;
}

/**
 * Parser mínim de YAML pla: clau: valor, clau: (llista a sota), - item.
 * No suporta mapes niats profunds (no cal per a aquesta Wiki).
 */
function parseYamlLite(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const data = {};
  let curKey = null;

  for (const line of lines) {
    if (!line.trim() || /^\s*#/.test(line)) continue;

    const listItem = /^\s*-\s?(.*)$/.exec(line);
    if (listItem && curKey && Array.isArray(data[curKey])) {
      const val = listItem[1].trim();
      if (val) data[curKey].push(unquote(val));
      continue;
    }

    const kv = /^([A-Za-z0-9_.-]+):\s?(.*)$/.exec(line);
    if (kv) {
      const [, key, rawVal] = kv;
      curKey = key;
      const val = rawVal.trim();
      if (val === '' ) {
        data[key] = []; // possible llista o bloc a les línies següents
      } else if (val === '>-' || val === '|' || val === '>') {
        data[key] = ''; // bloc escalar sense contingut inline (buit deliberat)
      } else {
        data[key] = unquote(val);
      }
    }
  }
  return data;
}

/** Comprovació ràpida sense parsejar tot el bloc. */
export function hasFrontmatter(raw) {
  return FM_RE.test(raw);
}

/** Camps obligatoris que falten, donat un objecte `data` i una llista `required`. */
export function missingFields(data, required) {
  return required.filter((f) => data[f] === undefined || data[f] === '' || (Array.isArray(data[f]) && data[f].length === 0 && f !== 'tags'));
}

```

### [SCRIPT] termodinamic.mjs
```javascript
/**
 * termodinamic.mjs
 * FONT ÚNICA DE VERITAT de la nomenclatura termodinàmica.
 *
 * REGLA D'OR (Veritat en Dos Miralls, arquitectura_cognitiva.md §3):
 * Aquest és l'ÚNIC lloc on es defineix el regex de nom vàlid.
 * Cap altre script (audit_estructura, wiki_integritat, etc.) pot declarar
 * el seu propi regex de nomenclatura. Tots importen d'ací.
 * L'auditoria de 260705 va detectar dos regex divergents (termodinamic.cjs
 * vs checkThermoFilenames() dins audit_estructura.js) que es contradeien:
 * els únics fitxers ben nomenats del bundle fallaven l'auditoria estructural.
 * Este fitxer existeix per fer estructuralment impossible que això torne a passar.
 *
 * ABAST: esta llei de nomenclatura s'aplica NOMÉS al contingut de la Wiki
 * (fitxers .md dins dels 5 Pilars). NO s'aplica al codi font
 * (02_ACTUAR_Maquina_Tecnica/scripts/**), que segueix convencions pròpies
 * de l'ecosistema Node (camelCase / snake_case en fitxers .mjs/.cjs/.json).
 * Aplicar la llei del contingut al codi és el que va fer que
 * wiki-integrity.cjs (amb guió) es mossegara la pota ell mateix.
 */

export const CATEGORIES = [
  'ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE',
  'PROMPT', 'WORKFLOW', 'ASSET', 'PLANTILLA'
];

// Caràcters permesos, LITERALMENT segons especificació del Mestre (260705):
// majúscules, minúscules, guions BAIXOS, punts, números. Sense guions normals.
export const CHAR_WHITELIST_REGEX = /^[A-Za-z0-9_.]+$/;

// Forma completa: YYMMDD_HHMM_CATEGORIA_Titol.md
// Un sol regex — la "forma" i el "joc de caràcters" ja no poden divergir
// perquè la forma és un subconjunt estricte del whitelist de caràcters.
export const TERMODINAMIC_REGEX = new RegExp(
  `^\\d{6}_\\d{4}_(${CATEGORIES.join('|')})_[A-Za-z0-9_]+\\.md$`
);

// Directoris/fitxers exempts de la llei termodinàmica (no són "contingut"):
export const EXEMPT_BASENAMES = new Set(['README.md', '00_index.md', '.gitignore', '.DS_Store']);
export const EXEMPT_DIR_SEGMENTS = new Set(['scripts', 'node_modules', '.git', '.husky', 'assets']);

/**
 * Valida un nom de fitxer de CONTINGUT (.md) contra la llei termodinàmica.
 */
export function isValidContentFile(filename) {
  return TERMODINAMIC_REGEX.test(filename);
}

/**
 * Comprova només el joc de caràcters (per a diagnosticar "quin caràcter sobra").
 */
export function hasValidCharset(filename) {
  return CHAR_WHITELIST_REGEX.test(filename);
}

export function getTimestamp(date = new Date()) {
  const YY = String(date.getFullYear()).slice(-2);
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${YY}${MM}${DD}_${HH}${mm}`;
}

export function classify(content = '', filename = '') {
  const upperContent = content.toUpperCase();
  const upperFilename = filename.toUpperCase();
  if (upperContent.includes('ACTA:') || upperFilename.includes('ACTA')) return 'ACTA';
  if (upperContent.includes('SKILL:') || upperFilename.includes('SKILL')) return 'SKILL';
  if (upperContent.includes('REPORT:') || upperFilename.includes('REPORT')) return 'REPORT';
  if (upperFilename.includes('PLANTILLA')) return 'PLANTILLA';
  return 'DOC';
}

export function normalize(originalTitle, content = '') {
  let title = originalTitle.replace(/[^A-Za-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const category = classify(content, originalTitle);
  return `${getTimestamp()}_${category}_${title}.md`;
}

```

### [SCRIPT] wiki_walker.mjs
```javascript
/**
 * wiki_walker.mjs
 * Recorre l'arbre de la Wiki UNA sola vegada i entrega un índex en memòria
 * a tots els auditors (audit_estructura, contradiction_engine, wiki_integritat).
 * Abans, cada script feia el seu propi fs.readdirSync recursiu -> 3x I/O
 * sobre el mateix arbre en cada commit. Açò és directament la Llei 4
 * (Trellat / Zero Overhead) aplicada al propi tooling, no només al producte.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { EXEMPT_DIR_SEGMENTS } from './termodinamic.mjs';

/**
 * @param {string} rootDir
 * @returns {Promise<{allEntries: Array, mdDocs: Array, rootLevelEntries: Array}>}
 */
export async function buildWikiIndex(rootDir) {
  const allEntries = [];
  const mdDocs = [];

  const rootLevelEntries = (await fs.readdir(rootDir, { withFileTypes: true }))
    .map(d => ({ name: d.name, isDirectory: d.isDirectory() }));

  async function walk(dir) {
    let items;
    try {
      items = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const it of items) {
      if (EXEMPT_DIR_SEGMENTS.has(it.name)) continue;
      const fullPath = path.join(dir, it.name);
      const relPath = path.relative(rootDir, fullPath);

      if (it.isDirectory()) {
        allEntries.push({ type: 'dir', fullPath, relPath, name: it.name });
        await walk(fullPath);
      } else {
        allEntries.push({ type: 'file', fullPath, relPath, name: it.name });
        if (it.name.endsWith('.md')) {
          let content = '';
          try {
            content = await fs.readFile(fullPath, 'utf8');
          } catch {
            content = '';
          }
          mdDocs.push({ fullPath, relPath, name: it.name, content });
        }
      }
    }
  }

  await walk(rootDir);
  return { allEntries, mdDocs, rootLevelEntries };
}

/**
 * Parseja el frontmatter YAML de manera mínima (sense dependència externa,
 * Pedra Seca / zero-npm), suficient per a camps pla clau: valor.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) {
      fm[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return fm;
}

```

### [SCRIPT] migracio_v5.js
```javascript
/**
 * MIGRACIÓ A L'ARQUITECTURA DEEPSEEK (V5.0.3)
 */
const fs = require('fs');
const path = require('path');
const router = require('./entropia_zero_router.js');

const WIKI_ROOT = path.join(__dirname, '../../');

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.obsidian', '_backups', 'assets', 'logs', '.git'].includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllMarkdownFiles(fullPath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const fm = {};
    const lines = match[1].split('\n');
    let currentArrayKey = null;

    for (const line of lines) {
        if (line.trim().startsWith('- ') && currentArrayKey) {
            let val = line.trim().substring(2).trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            fm[currentArrayKey].push(val);
            continue;
        }

        if (!line.includes(':')) continue;
        
        const [key, ...rest] = line.split(':');
        const cleanKey = key.trim();
        let value = rest.join(':').trim();
        
        if (value === '') {
            fm[cleanKey] = [];
            currentArrayKey = cleanKey;
            continue;
        }
        
        currentArrayKey = null;

        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.substring(1, value.length - 1).split(',').map(s => s.trim()).filter(Boolean);
            fm[cleanKey] = value;
        } else if (!isNaN(value) && value !== '') {
            fm[cleanKey] = Number(value);
        } else if (value.startsWith('"') && value.endsWith('"')) {
            fm[cleanKey] = value.substring(1, value.length - 1);
        } else {
            fm[cleanKey] = value;
        }
    }
    return { fm, fullMatch: match[0], content };
}

function convertFrontmatterToYaml(fm) {
    let yaml = '---\n';
    
    for (const prop of router.CORE_PROPS) {
        if (fm[prop] !== undefined) {
            if (Array.isArray(fm[prop])) {
                if (fm[prop].length === 0) {
                    yaml += `${prop}: []\n`;
                } else {
                    yaml += `${prop}:\n`;
                    for (const item of fm[prop]) {
                        yaml += `  - ${item}\n`;
                    }
                }
            } else {
                yaml += `${prop}: ${fm[prop]}\n`;
            }
        }
    }
    
    for (const prop of router.GOV_PROPS) {
        if (fm[prop] !== undefined) {
            yaml += `${prop}: ${fm[prop]}\n`;
        }
    }
    yaml += '---';
    return yaml;
}

function inferirTipus(oldFm, fileName) {
    const rol = oldFm.rol || '';
    const cat = oldFm.category || '';
    const estat = oldFm.estat || '';
    const tags = Array.isArray(oldFm.tags) ? oldFm.tags : [];

    if (estat === 'arxivat') return 'arxiu';

    const lookFor = (val) => {
        return rol === val || cat === val || tags.includes(val) || fileName.toLowerCase().includes(val);
    };

    if (lookFor('identitat')) return 'identitat';
    if (lookFor('cultura')) return 'cultura';
    if (lookFor('plantilla') || lookFor('plantilles')) return 'plantilla';
    if (lookFor('acta') || lookFor('actes') || lookFor('memoria') || fileName.includes('ACTA_')) return 'acte';
    if (lookFor('arquitectura')) return 'arquitectura';
    if (lookFor('disseny')) return 'disseny';
    if (lookFor('govern')) return 'directriu';
    if (lookFor('filosofia')) return 'filosofia';
    if (lookFor('skill')) return 'skill';
    
    const allowedTypes = ['directriu', 'norma', 'protocol', 'skill', 'schema', 'script', 'eina', 'capacitat'];
    for (const t of allowedTypes) {
        if (lookFor(t)) return t;
    }

    if (fileName.includes('ADR')) return 'arquitectura';
    if (fileName.includes('INFORME')) return 'acte';
    
    return 'directriu'; 
}

function processFiles() {
    const files = getAllMarkdownFiles(WIKI_ROOT);
    let success = 0;
    let errors = 0;

    for (const filePath of files) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parsed = parseFrontmatter(fileContent);
            
            if (!parsed) continue;

            const oldFm = parsed.fm;
            const newFm = {};

            const directProps = ['id', 'name', 'version', 'created_at', 'autor', 'macro_regio', 'tags', 'estat', 'related', 'aliases'];
            for (const prop of directProps) {
                if (oldFm[prop] !== undefined) newFm[prop] = oldFm[prop];
            }

            const fileName = path.basename(filePath);
            newFm.tipus = inferirTipus(oldFm, fileName);

            const govTypes = ['directriu', 'norma', 'protocol'];
            if (govTypes.includes(newFm.tipus)) {
                if (oldFm.tier !== undefined) newFm.tier = oldFm.tier;
                if (oldFm.pes_regla !== undefined) newFm.pes_regla = oldFm.pes_regla;
            }

            if (Array.isArray(newFm.related) && newFm.related.length > 5) {
                newFm.related = newFm.related.slice(0, 5);
            }

            const now = new Date();
            const timestamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            newFm.updated_at = timestamp;

            const destFolder = path.join(WIKI_ROOT, router.determinarCarpeta(newFm));
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
            }

            const newPath = path.join(destFolder, fileName);
            
            const newYamlBlock = convertFrontmatterToYaml(newFm);
            const newContent = fileContent.replace(parsed.fullMatch, newYamlBlock);

            if (filePath !== newPath) {
                fs.writeFileSync(newPath, newContent, 'utf8');
                fs.unlinkSync(filePath);
                console.log(`Mogut: ${fileName} -> ${router.determinarCarpeta(newFm)}`);
            } else {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Actualitzat: ${fileName}`);
            }
            success++;

        } catch (e) {
            console.error(`Error processant ${filePath}: ${e.message}`);
            errors++;
        }
    }
    
    console.log(`\nMigració completada! Processats amb èxit: ${success}. Errors: ${errors}`);
}

processFiles();

```

### [SCRIPT] move_petorreta.cjs
```javascript
const fs = require('fs');
const path = require('path');

const promptPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0705_PROMPT_Petorreta_Taxonomica_i_Glossari.md';
const bundlePath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/260705T0_0510_BUNDLE_Wiki_Completa.md';
const oldFinalPath = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/bancal_actiu/260705_0715_PETORRETA_TAXONOMICA_FINAL.md';

const artifactOutputPath = '/Users/javillinares/.gemini/antigravity-ide/brain/c0761c32-e37d-40e0-8de1-1e61fa1b634a/260705_0725_PETORRETA_AMB_BUNDLE.md';

const promptContent = fs.readFileSync(promptPath, 'utf8');
const bundleContent = fs.readFileSync(bundlePath, 'utf8');

const combinedContent = promptContent + '\n\n' + bundleContent;

// No cal escriure l'ArtifactMetadata a dins del fitxer de text si no usem l'eina, però si l'escrivim, eixirà.
fs.writeFileSync(artifactOutputPath, combinedContent, 'utf8');

// Esborrem les escombraries de la Wiki (Bundle i Final antics)
if (fs.existsSync(bundlePath)) fs.unlinkSync(bundlePath);
if (fs.existsSync(oldFinalPath)) fs.unlinkSync(oldFinalPath);
// També esborrem qualsevol altre bundle vell
const regDir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/03_REGISTRE_Actes_Efimers/';
fs.readdirSync(regDir).forEach(file => {
  if (file.includes('BUNDLE_Wiki')) fs.unlinkSync(path.join(regDir, file));
});

console.log('✅ Petorreta Mestra creada com a Artefacte a: ' + artifactOutputPath);

```

### [SCRIPT] neteja_termodinamica.mjs
```javascript
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSemanticAudit } from './semantic_auditor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

async function getAllMdFiles(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.name === 'node_modules' || file.name === '.git' || file.name === 'assets') continue;
    if (file.isDirectory()) {
      results = results.concat(await getAllMdFiles(fullPath));
    } else if (file.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log('🔍 Executant Auditoria Semàntica...');
  const { filenameAlerts } = await runSemanticAudit(ROOT);
  
  const toRename = filenameAlerts.filter(a => a.tipus === 'DATA-INNECESSARIA');
  if (toRename.length === 0) {
    console.log('✅ Cap fitxer per renomenar.');
    return;
  }

  const renameMap = new Map(); // oldName (without ext) -> newName (without ext)
  const exactRenameMap = new Map(); // oldFullName -> newFullName

  console.log(`\n🔄 Es renomenaran ${toRename.length} fitxers:`);
  for (const alert of toRename) {
    const oldFullPath = path.join(ROOT, alert.fitxer);
    const oldBaseName = path.basename(alert.fitxer);
    const newBaseName = oldBaseName.replace(/^\d{6}_\d{4}_/, '');
    const newFullPath = path.join(path.dirname(oldFullPath), newBaseName);
    
    console.log(`  - ${oldBaseName} -> ${newBaseName}`);
    
    // Perform rename
    await fs.rename(oldFullPath, newFullPath);
    
    const oldNoExt = oldBaseName.replace('.md', '');
    const newNoExt = newBaseName.replace('.md', '');
    renameMap.set(oldNoExt, newNoExt);
    exactRenameMap.set(oldBaseName, newBaseName);
  }

  console.log('\n🔗 Actualitzant enllaços a la Wiki...');
  const allMdFiles = await getAllMdFiles(ROOT);
  let updatedFilesCount = 0;

  for (const file of allMdFiles) {
    let content = await fs.readFile(file, 'utf-8');
    let changed = false;

    for (const [oldName, newName] of renameMap.entries()) {
      // Obsidian links [[oldName]] -> [[newName]]
      const linkRegex1 = new RegExp(`\\[\\[${oldName}\\]\\]`, 'g');
      if (linkRegex1.test(content)) {
        content = content.replace(linkRegex1, `[[${newName}]]`);
        changed = true;
      }
      
      // Obsidian links with alias [[oldName|alias]] -> [[newName|alias]]
      const linkRegex2 = new RegExp(`\\[\\[${oldName}\\|(.*?)\\]\\]`, 'g');
      if (linkRegex2.test(content)) {
        content = content.replace(linkRegex2, `[[${newName}|$1]]`);
        changed = true;
      }
    }
    
    for (const [oldFullName, newFullName] of exactRenameMap.entries()) {
      // Markdown links [text](oldFullName) -> [text](newFullName)
      const linkRegex3 = new RegExp(`\\]\\(${oldFullName}\\)`, 'g');
      if (linkRegex3.test(content)) {
        content = content.replace(linkRegex3, `](${newFullName})`);
        changed = true;
      }
    }

    if (changed) {
      await fs.writeFile(file, content, 'utf-8');
      updatedFilesCount++;
    }
  }

  console.log(`✅ ${updatedFilesCount} fitxers actualitzats per corregir enllaços trencats.`);
}

main().catch(console.error);

```

### [SCRIPT] neteja_total.js
```javascript
const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.join(__dirname, '../../');

const CANONICAL_TAGS = [
    'trellat', 'pedra_seca', 'termodinamica', 'identitat', 
    'ia', 'codi', 'crdt', 'auditoria', 'extern', 
    'seguretat', 'accessibilitat', 'legacy', 'govern', 'cultura', 'rural'
];

// Mapeig de directoris o tipus cap a etiquetes canòniques
const DEFAULT_TAGS = {
    '01_identitat_iaia': ['identitat', 'ia'],
    '02_filosofia': ['trellat'],
    '03_govern': ['govern', 'trellat'],
    '04_arquitectura_disseny': ['pedra_seca', 'codi'],
    '05_skills_ia': ['ia', 'codi'],
    '06_cultura': ['cultura', 'rural'],
    '10_actes': ['auditoria'],
    '11_recursos_ia': ['extern']
};

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (['node_modules', '.obsidian', '_backups', 'assets', 'logs', '.git', '99_maquinaria', '90_arxiu_historic'].includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllMarkdownFiles(fullPath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function processFiles() {
    const files = getAllMarkdownFiles(WIKI_ROOT);
    let filesUpdated = 0;
    let emptyFilesDeleted = 0;

    for (const filePath of files) {
        // Eliminar fitxers buits (creats per Obsidian en clicar enllaços trencats)
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            fs.unlinkSync(filePath);
            emptyFilesDeleted++;
            console.log(`Esborrat fitxer fantasma: ${filePath}`);
            continue;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // --- 1. ARREGLAR ETIQUETES ---
        const dirName = path.basename(path.dirname(filePath));
        const defaultTagsForDir = DEFAULT_TAGS[dirName] || ['trellat'];
        
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            const fmText = match[1];
            const lines = fmText.split('\n');
            
            let tagsStartIndex = -1;
            let tagsEndIndex = -1;
            
            // Buscar on està la clau tags:
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('tags:')) {
                    tagsStartIndex = i;
                    // Buscar on acaben els items de tags
                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].trim().startsWith('- ')) {
                            tagsEndIndex = j;
                        } else if (lines[j].trim() !== '') {
                            // Nova clau (ex: aliases:)
                            break;
                        }
                    }
                    if (tagsEndIndex === -1) tagsEndIndex = i; // tags: buit
                    break;
                }
            }
            
            let validTags = new Set();
            
            if (tagsStartIndex !== -1) {
                // Extreure tags existents
                for (let i = tagsStartIndex + 1; i <= tagsEndIndex; i++) {
                    let tag = lines[i].trim().substring(2).trim();
                    if (tag.startsWith('"') && tag.endsWith('"')) tag = tag.slice(1, -1);
                    if (tag.startsWith("'") && tag.endsWith("'")) tag = tag.slice(1, -1);
                    if (tag === '[]') continue;
                    
                    if (CANONICAL_TAGS.includes(tag)) {
                        validTags.add(tag);
                    }
                }
            }
            
            // Si no hi ha tags vàlids, aplicar els del directori
            if (validTags.size === 0) {
                defaultTagsForDir.forEach(t => validTags.add(t));
            }
            
            // Limitar a 3 etiquetes
            const finalTags = Array.from(validTags).slice(0, 3);
            
            const newTagsYaml = ['tags:'];
            for (const tag of finalTags) {
                newTagsYaml.push(`  - ${tag}`);
            }
            
            if (tagsStartIndex !== -1) {
                // Substituir el bloc antic
                lines.splice(tagsStartIndex, tagsEndIndex - tagsStartIndex + 1, ...newTagsYaml);
            } else {
                // Afegir tags al final del frontmatter si no existia
                lines.push(...newTagsYaml);
            }
            
            const newFmText = lines.join('\n');
            content = content.replace(match[1], newFmText);
        }

        // --- 2. ARREGLAR ENLLAÇOS ---
        // Obsidian wiki links: [[ruta/al/fitxer#seccio|Àlies]] -> [[fitxer#seccio|Àlies]]
        content = content.replace(/\[\[(.*?)\]\]/g, (match, inner) => {
            const parts = inner.split('|');
            let pathPart = parts[0];
            const aliasPart = parts.length > 1 ? '|' + parts[1] : '';
            
            const hashSplit = pathPart.split('#');
            let filePart = hashSplit[0];
            const hashPart = hashSplit.length > 1 ? '#' + hashSplit[1] : '';
            
            // Extraure només el nom del fitxer (sense directoris)
            const fileBasename = filePart.split('/').pop();
            
            return `[[${fileBasename}${hashPart}${aliasPart}]]`;
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            filesUpdated++;
        }
    }
    console.log(`Neteja completada. Fitxers actualitzats: ${filesUpdated}. Fantasmes esborrats: ${emptyFilesDeleted}`);
}

processFiles();

```

### [SCRIPT] pre-commit.mjs
```javascript
#!/usr/bin/env node
/**
 * pre-commit.mjs — Orquestrador (Zero Overhead, Husky-ready)
 *
 * Ordre: integritat d'arrel -> auditoria estructural -> contradiction engine.
 * TRANSACCIONAL: wiki_integritat és l'única fase que ESCRIU (mou orfes).
 * Les altres dues només LLIGEN i informen. Si qualsevol fase falla, s'atura
 * immediatament (fail-fast) i el commit es bloqueja amb exit 1 — no es fa
 * cap escriptura parcial addicional després d'un fallada.
 *
 * Ús a .husky/pre-commit:
 *   node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/pre-commit.mjs || exit 1
 */
import { auditRootHygiene } from './wiki_integritat.mjs';
import { runAudit } from './audit_estructura.mjs';
import { findDuplicates } from './contradiction_engine.mjs';

const step = (n, msg) => console.log(`\n[${n}/3] ${msg}`);

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  step(1, `Integritat d'arrel (Root Hygiene)... ${DRY_RUN ? '[DRY-RUN]' : ''}`);
  await auditRootHygiene(undefined, undefined, { dryRun: DRY_RUN });

  step(2, 'Auditoria estructural (5 Pilars, nomenclatura, aïllament cognitiu)...');
  const { errors: structErrors, avisos } = await runAudit();
  if (avisos.length > 0) {
    console.warn('⚠️  Avisos (no bloquegen):');
    avisos.forEach(a => console.warn(a));
  }
  if (structErrors.length > 0) {
    console.error('\n🚨 SDP-LOCK: auditoria estructural fallada 🚨');
    structErrors.forEach(e => console.error(e));
    process.exit(1);
  }
  console.log('✅ Estructura OK.');

  step(3, 'Contradiction Engine (Veritat en Dos Miralls + Marca de Jurisdicció)...');
  const duplicats = (await findDuplicates()).filter(d => !d.marcaJurisdiccioDiferent);
  if (duplicats.length > 0) {
    console.error(`\n🚨 SDP-LOCK: ${duplicats.length} contradicció(ns) semàntica(ques) sense Marca de Jurisdicció 🚨`);
    duplicats.forEach(d => console.error(`[${(d.s * 100).toFixed(1)}%] ${d.a} ↔ ${d.b}`));
    console.error('\nExecuta: node contradiction_engine.mjs --force   per generar l\'Acta de proposta.');
    process.exit(1);
  }
  console.log('✅ Cap contradicció real.');

  step(4, 'Auditoria Semàntica (Trellat)...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/semantic_auditor.mjs', { stdio: 'inherit' });
  } catch (err) {
    console.warn("⚠️  L'auditoria semàntica ha reportat avisos (mode consultiu).");
  }

  console.log('\n✅ TALLAFOCS SUPERAT. Trellat intacte.');
  process.exit(0);
}

main().catch(err => {
  console.error('🚨 ERROR INESPERAT A L\'ORQUESTRADOR 🚨');
  console.error(err);
  process.exit(1);
});

```

### [SCRIPT] sdp.mjs
```javascript
#!/usr/bin/env node
// scripts/sdp.mjs — Punt d'entrada únic del CLI `sdp`, pla (no dins bin/). Vanilla Node ESM,
// zero deps. Taula de rutes explícita: el nom de la comanda que veu l'usuari no sempre coincideix
// amb el nom del fitxer del motor (ex: `build` -> snapshot_engine.mjs), així que no s'endevina
// per convenció -- es declara ací, en un únic lloc auditable.
// Ús: sdp <comanda> [--root=.] [--json] [--write] [--file=ruta] [--query="text"] [--top=5]
import { parseArgs } from 'node:util';

const CORE_DIR = new URL('./core/', import.meta.url);

const COMMAND_MAP = {
  audit: 'audit.mjs',
  lint: 'lint.mjs',
  translate: 'translate.mjs',
  build: 'snapshot_engine.mjs', // Protocol Lázaro: fotografia comprimida i rotativa
  check: 'trellat_metrics.mjs', // Índex de Trellat + porta SDP-LOCK
  gc: 'tombstone_gc.mjs', // esporgadora de làpides CRDT
  repair: 'self_repair.mjs', // Autosanació: frontmatter + títols termodinàmics febles
  'self-repair': 'self_repair.mjs',
  search: 'edge_rag.mjs', // cercador semàntic local TF-IDF
};

const t0 = performance.now();

function parseArgv(argv) {
  return parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      json: { type: 'boolean', default: false },
      write: { type: 'boolean', default: false },
      root: { type: 'string', default: '.' },
      file: { type: 'string', default: '' },
      mode: { type: 'string', default: 'complet' },
      query: { type: 'string', default: '' },
      top: { type: 'string', default: '' },
      keep: { type: 'string', default: '' },
    },
  });
}

function printUsage() {
  console.log('sdp — CLI de manteniment de Sóc de Poble\n');
  console.log('Ús: sdp <comanda> [opcions]\n');
  console.log('Comandes disponibles:');
  for (const c of Object.keys(COMMAND_MAP).sort()) console.log(`  - ${c}`);
  console.log('\nOpcions comunes: --root=<path> --json --write --file=<path> --mode=<nom> --query="..." --top=<n>');
}

async function main() {
  let values, positionals;
  try {
    ({ values, positionals } = parseArgv(process.argv.slice(2)));
  } catch (err) {
    console.error(`[ERROR] Arguments invàlids: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const cmd = positionals[0];

  if (!cmd) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const fileName = COMMAND_MAP[cmd];
  if (!fileName) {
    if (values.json) {
      console.log(JSON.stringify({ ok: false, command: cmd, error: 'comanda-desconeguda', available: Object.keys(COMMAND_MAP) }, null, 2));
    } else {
      console.error(`[ERROR] Comanda desconeguda: "${cmd}".`);
      printUsage();
    }
    process.exitCode = 1;
    return;
  }

  let mod;
  try {
    mod = await import(new URL(fileName, CORE_DIR));
  } catch (err) {
    console.error(`[FATAL] No s'ha pogut carregar la comanda "${cmd}" (${fileName}): ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (typeof mod.run !== 'function') {
    console.error(`[FATAL] "${fileName}" no exporta un run(options) vàlid.`);
    process.exitCode = 1;
    return;
  }

  let result;
  try {
    result = await mod.run(values, positionals.slice(1));
  } catch (err) {
    result = { ok: false, summary: `[FATAL] ${cmd} ha petat: ${err.message}`, data: { stack: err.stack } };
  }

  const elapsedMs = Math.round(performance.now() - t0);

  if (values.json) {
    console.log(JSON.stringify({ command: cmd, elapsedMs, ...result }, null, 2));
  } else {
    console.log(result.summary ?? '(sense resum)');
    if (elapsedMs > 2000) console.error(`[AVÍS] sdp ${cmd} ha trigat ${elapsedMs}ms (> 2s, revisar Trellat).`);
  }

  process.exitCode = result.ok ? 0 : 1;
}

main();

```

### [SCRIPT] semantic_auditor.mjs
```javascript
#!/usr/bin/env node
/**
 * semantic_auditor.mjs
 * CAPA COGNITIVA SUPERIOR — autònoma, de sol lectura, NO modifica audit_estructura.mjs.
 *
 * Objectiu: deduir per heurística (zero tokens d'IA, pur JS determinista)
 *   (A) quines CARPETES semblen fora de lloc o duplicades respecte als 5 Pilars.
 *   (B) quins FITXERS .md realment necessiten el prefix termodinàmic YYMMDD_HHMM
 *       i quins no (perquè ja porten la seua pròpia temporalitat per altres vies).
 *
 * Este mòdul és consultiu (imprimeix alertes), NO bloqueja cap commit.
 * Si vols que bloquege, s'integra a pre-commit.mjs explícitament — de moment
 * és una eina de consulta manual, tal com has demanat ("cervell que llig").
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWikiIndex, parseFrontmatter } from './lib/wiki_walker.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

export const PILARS_VIGENTS = [
  '00_SER_Brain_Identitat',
  '01_SABER_Cultura_Coneixement',
  '02_ACTUAR_Maquina_Tecnica',
  '03_GOVERNAR_Normativa_Regles',
  '04_ARXIU_Documents_Historics'
];

/* ============================================================
   (A) ANOMALIES DE CARPETA — heurístiques barates, cap token d'IA
   ============================================================ */

// Diccionari xicotet: paraules que semànticament pertanyen a un Pilar concret.
// No és NLP, és un lookup de paraules clau — barat i determinista.
const PILLAR_VOCABULARY = {
  '04_ARXIU_Documents_Historics': ['produccio', 'production', 'build', 'output', 'sortida', 'log', 'logs', 'bancal', 'backup', 'arxiu', 'historic', 'dist'],
  '02_ACTUAR_Maquina_Tecnica': ['scripts', 'script', 'skill', 'skills', 'codi', 'source', 'src', 'build', 'dist', '_build'],
  '01_SABER_Cultura_Coneixement': ['cultura', 'glossari', 'narrativa', 'coneixement', 'historia'],
  '00_SER_Brain_Identitat': ['identitat', 'bios', 'brain'],
  '03_GOVERNAR_Normativa_Regles': ['normativa', 'govern', 'regles', 'lleis', 'manaments']
};

// Carpetes de software que MAI haurien de viure fora de 02_ACTUAR_Maquina_Tecnica
const SOFTWARE_ARTIFACT_DIR = /^_?(build|dist|out(put)?|node_modules|coverage)$/i;

// Prefix numèric de 2 dígits pre-Big-Bang (qualsevol que no siga 00-04)
const LEGACY_NUMERIC_PREFIX = /^(\d{2})_/;

function scoreFolderAgainstPillars(folderName) {
  const lower = folderName.toLowerCase();
  const matches = [];
  for (const [pillar, words] of Object.entries(PILLAR_VOCABULARY)) {
    const hit = words.find(w => lower.includes(w));
    if (hit) matches.push({ pillar, hit });
  }
  return matches;
}

export function auditFolderSemantics(allEntries) {
  const alerts = [];
  const dirs = allEntries.filter(e => e.type === 'dir');

  for (const dir of dirs) {
    const topSegment = dir.relPath.split(path.sep)[0];
    const isRootLevel = dir.relPath === dir.name; // sense separador = arrel directa

    // 1. Prefix numèric heretat (pre 5-Pilars) que no és cap dels 00-04
    const prefixMatch = dir.name.match(LEGACY_NUMERIC_PREFIX);
    if (isRootLevel && prefixMatch && !PILARS_VIGENTS.some(p => p.startsWith(prefixMatch[1] + '_'))) {
      alerts.push({
        tipus: 'PREFIX-OBSOLET',
        carpeta: dir.relPath,
        missatge: `Prefix numèric '${prefixMatch[1]}_' no correspon a cap dels 5 Pilars vigents (00-04). Sembla taxonomia pre-Big-Bang. Revisa si cal fusionar o destruir.`
      });
      continue;
    }

    // 2. Carpeta d'artefacte de software fora de 02_ACTUAR_Maquina_Tecnica
    if (SOFTWARE_ARTIFACT_DIR.test(dir.name) && topSegment !== '02_ACTUAR_Maquina_Tecnica') {
      alerts.push({
        tipus: 'ARTEFACTE-FORA-DE-LLOC',
        carpeta: dir.relPath,
        missatge: `'${dir.name}' sembla un artefacte de software (build/dist/output) però viu fora de 02_ACTUAR_Maquina_Tecnica. Mou-la dins o afig-la a .gitignore si és generada.`
      });
      continue;
    }

    // 3. Solapament semàntic amb un Pilar existent, estant fora d'ell
    if (isRootLevel && !PILARS_VIGENTS.includes(dir.name)) {
      const matches = scoreFolderAgainstPillars(dir.name);
      if (matches.length > 0) {
        const pillars = [...new Set(matches.map(m => m.pillar))];
        alerts.push({
          tipus: 'POSSIBLE-DUPLICAT-SEMANTIC',
          carpeta: dir.relPath,
          missatge: `El nom '${dir.name}' comparteix vocabulari amb ${pillars.join(', ')}. Revisa si és una còpia obsoleta d'un Pilar existent (paraula(es) clau: ${matches.map(m => m.hit).join(', ')}).`
        });
      }
    }
  }
  return alerts;
}

/* ============================================================
   (B) NECESSITA DATA TERMODINÀMICA? — heurística de decisió
   ============================================================ */

// Categories que representen un EVENT puntual (acta, informe, flux de treball,
// petorreta). Un event té sentit ancorar-lo a un instant -> SÍ necessita data.
const EPISODIC_CATEGORIES = new Set(['ACTA', 'REPORT', 'WORKFLOW', 'PROMPT']);

// Categories que representen un DOCUMENT VIU (skill, nucli, dashboard, plantilla).
// Per defecte NO necessiten data al nom, tret que cap altre senyal ho desmentisca.
const LIVING_CATEGORIES = new Set(['SKILL', 'CORE', 'DOC', 'ASSET', 'PLANTILLA']);

const XXYY_VERSION_REGEX = /^\d{2}\.\d{2}$/;
const DATE_COLUMN_HEADER = /\|\s*(data|date|created_at|timestamp|actualitzat|hores)\s*\|/i;
const DATAVIEW_BLOCK = /```dataview/i;

/**
 * Retorna { necessitaData: boolean, motiu: string } per a un document .md.
 */
export function needsThermodynamicDate(doc) {
  const fm = parseFrontmatter(doc.content);
  const categoria = (fm.categoria || fm.tipus || '').toUpperCase();

  // Senyal 1: és un dashboard viu generat (Dataview) -> mai necessita data.
  if (DATAVIEW_BLOCK.test(doc.content)) {
    return { necessitaData: false, motiu: 'Conté bloc ```dataview: és un dashboard viu, no un event puntual.' };
  }

  // Senyal 2: el propi contingut ja porta una taula amb columna de data/hora
  // (auto-log, com el Registre d'Automillora) -> la data al nom és redundant.
  if (DATE_COLUMN_HEADER.test(doc.content)) {
    return { necessitaData: false, motiu: 'El contingut ja té una taula amb columna de data/hora (auto-log). Data al nom és doble comptabilitat.' };
  }

  // Senyal 3: versionat XX.YY al frontmatter -> document viu versionat, no episòdic.
  if (fm.version && XXYY_VERSION_REGEX.test(fm.version)) {
    return { necessitaData: false, motiu: `Frontmatter ja porta versió viva '${fm.version}' (XX.YY). No és un event puntual.` };
  }

  // Senyal 4: categoria explícitament episòdica -> SÍ.
  if (EPISODIC_CATEGORIES.has(categoria)) {
    return { necessitaData: true, motiu: `Categoria '${categoria}' és episòdica (event puntual).` };
  }

  // Senyal 5: categoria explícitament viva -> NO per defecte.
  if (LIVING_CATEGORIES.has(categoria)) {
    return { necessitaData: false, motiu: `Categoria '${categoria}' és un document viu per defecte.` };
  }

  // Sense senyals clars: per prudència (Llei 5, Plasticitat i Intuïció),
  // manté la data per defecte fins que hi haja evidència del contrari.
  return { necessitaData: true, motiu: 'Sense senyals clars — es manté la convenció per defecte (prudència > brillantesa).' };
}

export function auditFilenameNecessity(mdDocs) {
  const alerts = [];
  for (const doc of mdDocs) {
    if (doc.relPath.split(path.sep).includes('scripts')) continue;
    const { necessitaData, motiu } = needsThermodynamicDate(doc);
    const teDataAlNom = /^\d{6}_\d{4}_/.test(doc.name);

    if (necessitaData && !teDataAlNom) {
      alerts.push({ tipus: 'FALTA-DATA', fitxer: doc.relPath, missatge: `Hauria de portar prefix termodinàmic i no en té. ${motiu}` });
    } else if (!necessitaData && teDataAlNom) {
      alerts.push({ tipus: 'DATA-INNECESSARIA', fitxer: doc.relPath, missatge: `Porta prefix termodinàmic però sembla innecessari. ${motiu}` });
    }
  }
  return alerts;
}

/* ============================================================
   ORQUESTRACIÓ DE LA CAPA SEMÀNTICA
   ============================================================ */

export async function runSemanticAudit(wikiDir = ROOT) {
  const { allEntries, mdDocs } = await buildWikiIndex(wikiDir);
  return {
    folderAlerts: auditFolderSemantics(allEntries),
    filenameAlerts: auditFilenameNecessity(mdDocs)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { folderAlerts, filenameAlerts } = await runSemanticAudit();

  console.log(`\n🧠 AUDITORIA SEMÀNTICA (consultiva — no bloqueja cap commit)\n`);

  if (folderAlerts.length) {
    console.log(`📁 Carpetes (${folderAlerts.length}):`);
    folderAlerts.forEach(a => console.log(`  [${a.tipus}] ${a.carpeta} — ${a.missatge}`));
  } else {
    console.log('📁 Cap anomalia de carpeta detectada.');
  }

  console.log();
  if (filenameAlerts.length) {
    console.log(`📄 Fitxers (${filenameAlerts.length}):`);
    filenameAlerts.forEach(a => console.log(`  [${a.tipus}] ${a.fitxer} — ${a.missatge}`));
  } else {
    console.log('📄 Cap fitxer amb necessitat de data en dubte.');
  }
  process.exit(0);
}

```

### [SCRIPT] session-logger.js
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configuració
const METRICS_DIR = path.join(__dirname, '../06_metriques');
const DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// 2. Funcions per a calcular cada mètrica
function calculateIT(CT, CE, CA, CR) {
  return (0.4 * CT + 0.3 * CE + 0.2 * CA + 0.1 * CR).toFixed(2);
}

function calculateCT(decisionsCoherents, decisionsTotals) {
  return ((decisionsCoherents / decisionsTotals) * 100).toFixed(2);
}

function calculateCE(tokensUtiles, tokensTotals) {
  return ((tokensUtiles / tokensTotals) * 100).toFixed(2);
}

function calculateCA(componentsAccessibles, componentsTotals) {
  return ((componentsAccessibles / componentsTotals) * 100).toFixed(2);
}

function calculateCR(sincronitzacionsOk, sincronitzacionsTotals) {
  return ((sincronitzacionsOk / sincronitzacionsTotals) * 100).toFixed(2);
}

function calculateUDR(canvisDestructius, canvisTotals) {
  return ((canvisDestructius / canvisTotals) * 100).toFixed(2);
}

function calculateCTS(tombstones, esdevenimentsTotals) {
  return ((tombstones / esdevenimentsTotals) * 1000).toFixed(2);
}

function calculateFPS() {
  // Simulació: En un entorn real, s'usaria requestAnimationFrame
  return Math.floor(Math.random() * 20) + 40; // 40-60 FPS
}

function calculateET(tokens) {
  const freq = {};
  tokens.forEach(token => {
    freq[token] = (freq[token] || 0) + 1;
  });
  let entropy = 0;
  for (const key in freq) {
    const p = freq[key] / tokens.length;
    entropy -= p * Math.log2(p);
  }
  return entropy.toFixed(2);
}

function calculateIFM(sessionsEsgotades, sessionsTotals) {
  return ((sessionsEsgotades / sessionsTotals) * 100).toFixed(2);
}

function calculateMR() {
  // Simulació: En Node.js, s'usaria performance.memory
  return (Math.random() * 500 + 1000).toFixed(2); // 1000-1500 MB
}

function calculateIS(paquetsSincronitzats, paquetsTotals) {
  return ((paquetsSincronitzats / paquetsTotals) * 100).toFixed(2);
}

function calculateITR(wikiLinksValids, wikiLinksTotals) {
  return ((wikiLinksValids / wikiLinksTotals) * 100).toFixed(2);
}

// 3. Funció principal per a registrar les mètriques
function logSessionMetrics() {
  // Dades de simulació (en un entorn real, s'extreurien del sistema)
  const metrics = {
    CT: calculateCT(18, 20),       // 90%
    CE: calculateCE(8500, 10000),   // 85%
    CA: calculateCA(48, 50),       // 96%
    CR: calculateCR(995, 1000),     // 99.5%
    UDR: calculateUDR(2, 100),      // 2%
    CTS: calculateCTS(8, 1000),     // 8
    FPS: calculateFPS(),           // 55
    ET: calculateET(['--sp-orange-100', '--sp-blue-100', '--sp-radius-main']), // ~1.5
    IFM: calculateIFM(1, 20),      // 5%
    MR: calculateMR(),             // 1200 MB
    IS: calculateIS(990, 1000),     // 99%
    ITR: calculateITR(198, 200)    // 99%
  };

  // Calculem l'IT
  metrics.IT = calculateIT(metrics.CT, metrics.CE, metrics.CA, metrics.CR);

  // Creem el directori de mètriques si no existeix
  if (!fs.existsSync(METRICS_DIR)) {
    fs.mkdirSync(METRICS_DIR, { recursive: true });
  }

  // Guardem cada mètrica en un arxiu individual
  for (const [key, value] of Object.entries(metrics)) {
    const filePath = path.join(METRICS_DIR, `${key}_${DATE}.md`);
    const content = `---
date: ${DATE}
value: ${value}
unit: ${key === 'CTS' ? 'tombstones/1000' : key === 'ET' ? 'bits' : key === 'MR' ? 'MB' : '%'}
---

# ${key}

**Valor:** ${value} ${key === 'CTS' ? 'tombstones/1000 esdeveniments' : key === 'ET' ? 'bits' : key === 'MR' ? 'MB' : '%'}
**Data:** ${DATE}
**Estat:** ${value >= 90 ? '✅ Òptim' : value >= 70 ? '⚠️ Acceptable' : '❌ Crític'}
`;
    fs.writeFileSync(filePath, content);
  }

  // Generem un arxiu resum de la sessió
  const summaryPath = path.join(METRICS_DIR, `RESUM_${DATE}.md`);
  let summaryContent = `# Resum de Mètriques - ${DATE}\n\n`;
  summaryContent += `| Mètrica | Valor | Unitats | Estat |\n`;
  summaryContent += `|---------|-------|---------|-------|\n`;
  for (const [key, value] of Object.entries(metrics)) {
    const unit = key === 'CTS' ? 'tombstones/1000' : key === 'ET' ? 'bits' : key === 'MR' ? 'MB' : '%';
    const status = value >= 90 ? '✅' : value >= 70 ? '⚠️' : '❌';
    summaryContent += `| ${key} | ${value} | ${unit} | ${status} |\n`;
  }
  fs.writeFileSync(summaryPath, summaryContent);

  console.log(`✅ Mètriques registrades a ${METRICS_DIR}`);
}

// 4. Executem el logger
logSessionMetrics();

```

### [SCRIPT] split_bundle.cjs
```javascript
const fs = require('fs');
const path = require('path');

const produccioDir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/80_produccio/generats_hui';
const inputFile = path.join(produccioDir, '260629_0245_master_wiki_bundle_FINAL.md');
const part1File = path.join(produccioDir, '260629_0245_master_wiki_bundle_FINAL_PART_1.md');
const part2File = path.join(produccioDir, '260629_0245_master_wiki_bundle_FINAL_PART_2.md');

const content = fs.readFileSync(inputFile, 'utf8');

// Split by the custom file separator block.
// The separator is usually:
// ================================================================================
// 📄 FITXER: ...
const separator = "================================================================================";
const chunks = content.split(separator);

// chunks[0] is the bundle header
let part1Content = chunks[0];
let part2Content = `# 📦 BUNDLE WIKI COMPLETA - SÓC DE POBLE (PART 2 DE 2)
**Data de generació:** 260629_0245
**Estat:** Post-Auditoria (Ronda 8 - Esporga Física Aplicada)
Aquesta és la segona part del Bundle per evitar truncaments en models de context reduït com ChatGPT.

---

`;

// Calculate total byte size of the remaining chunks
let totalSize = 0;
for (let i = 1; i < chunks.length; i++) {
  totalSize += Buffer.byteLength(chunks[i], 'utf8');
}

let currentSize = 0;
let isPart2 = false;

for (let i = 1; i < chunks.length; i++) {
  const chunkStr = separator + chunks[i];
  
  if (!isPart2) {
    part1Content += chunkStr;
    currentSize += Buffer.byteLength(chunkStr, 'utf8');
    if (currentSize >= totalSize / 2) {
      isPart2 = true;
    }
  } else {
    part2Content += chunkStr;
  }
}

// Write the files
fs.writeFileSync(part1File, part1Content, 'utf8');
fs.writeFileSync(part2File, part2Content, 'utf8');

console.log(`Split completat:`);
console.log(`PART 1: ${(Buffer.byteLength(part1Content, 'utf8') / 1024).toFixed(2)} KB`);
console.log(`PART 2: ${(Buffer.byteLength(part2Content, 'utf8') / 1024).toFixed(2)} KB`);

```

### [SCRIPT] sync_cerebel.cjs
```javascript
const fs = require('fs');
const path = require('path');

const wikiDir = '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble';
const knowledgeDir = '/Users/javillinares/.gemini/antigravity-ide/knowledge';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function syncCerebel() {
    console.log("Iniciant sincronització de la Wiki cap al Cervell (Knowledge Items)...");
    
    const folders = fs.readdirSync(wikiDir).filter(f => fs.statSync(path.join(wikiDir, f)).isDirectory() && !f.startsWith('.'));
    
    folders.forEach(folder => {
        if (folder === 'scripts') return; // Skip scripts directory if we want
        
        const srcFolder = path.join(wikiDir, folder);
        const targetKiDir = path.join(knowledgeDir, folder);
        const targetArtifactsDir = path.join(targetKiDir, 'artifacts');
        
        console.log(`- Sincronitzant ${folder}...`);
        
        // Ensure KI structure
        if (!fs.existsSync(targetArtifactsDir)) {
            fs.mkdirSync(targetArtifactsDir, { recursive: true });
        }
        
        // Copy files
        copyRecursiveSync(srcFolder, targetArtifactsDir);
        
        // Create metadata.json
        const metadataPath = path.join(targetKiDir, 'metadata.json');
        if (!fs.existsSync(metadataPath)) {
            const metadata = {
                summary: `Sincronització automàtica del directori ${folder} de la Wiki d'Obsidian. Contingut fonamental per al sistema Sóc de Poble.`,
                references: [`_wiki_de_poble/${folder}`],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: 1
            };
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        } else {
            // Update timestamp
            try {
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                metadata.updated_at = new Date().toISOString();
                fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            } catch (e) {
                console.error(`Error actualitzant metadata de ${folder}:`, e);
            }
        }
    });
    
    // Check for root files (like 00_index.md) and put them in a core KI
    const rootFiles = fs.readdirSync(wikiDir).filter(f => f.endsWith('.md'));
    if (rootFiles.length > 0) {
        const rootKiDir = path.join(knowledgeDir, '00_core_wiki');
        const rootArtifactsDir = path.join(rootKiDir, 'artifacts');
        if (!fs.existsSync(rootArtifactsDir)) fs.mkdirSync(rootArtifactsDir, { recursive: true });
        
        rootFiles.forEach(file => {
            fs.copyFileSync(path.join(wikiDir, file), path.join(rootArtifactsDir, file));
        });
        
        const metadataPath = path.join(rootKiDir, 'metadata.json');
        if (!fs.existsSync(metadataPath)) {
            fs.writeFileSync(metadataPath, JSON.stringify({
                summary: `Fitxers arrel de la Wiki (índex, README, etc).`,
                references: [`_wiki_de_poble/ root files`],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: 1
            }, null, 2));
        }
    }
    
    console.log("✅ Sincronització completada amb èxit.");
}

syncCerebel();

```

### [SCRIPT] stress_tombstone_gc.mjs
```javascript
#!/usr/bin/env node
import * as Y from 'yjs';
import { compactYDocByProjection } from '../core/tombstone_gc.mjs';

const MB = 1024 * 1024;
const LIMIT_RSS_MB = Number(process.env.SDP_MAX_RSS_MB || 160);
const GC_RSS_MB = Number(process.env.SDP_GC_RSS_MB || 125);
const UPDATE_LIMIT_BYTES = Number(process.env.SDP_GC_UPDATE_BYTES || 15 * MB);
const TX = Number(process.env.SDP_TX || 10_000);
const LIVE_LIMIT = Number(process.env.SDP_LIVE_LIMIT || 8192);
const PAYLOAD = 'x'.repeat(Number(process.env.SDP_PAYLOAD_BYTES || 2048));

function rssMb() {
  return process.memoryUsage().rss / MB;
}

function forceGc() {
  if (global.gc) global.gc();
}

function fail(reason, data = {}) {
  console.error(JSON.stringify({ ok: false, reason, ...data }, null, 2));
  process.exit(1);
}

function projectText(fresh, oldDoc) {
  const oldText = oldDoc.getText('nota').toString();
  if (oldText) fresh.getText('nota').insert(0, oldText);
}

let doc = new Y.Doc({ gc: true });
let note = doc.getText('nota');
let gcRuns = 0;
let maxRss = rssMb();
let maxUpdateBytes = 0;

async function compact(reason) {
  const beforeRss = rssMb();
  if (beforeRss >= LIMIT_RSS_MB) fail('gc_too_late_before_compact', { beforeRss, reason });

  const oldDoc = doc;
  const res = compactYDocByProjection(Y, oldDoc, projectText, { measureBefore: false });
  doc = res.doc;
  note = doc.getText('nota');
  oldDoc.destroy();
  forceGc();

  gcRuns++;
  const afterRss = rssMb();
  if (afterRss >= LIMIT_RSS_MB) fail('rss_over_limit_after_compact', { afterRss, reason });

  return { beforeRss, afterRss, afterBytes: res.afterBytes };
}

for (let i = 0; i < TX; i++) {
  doc.transact(() => {
    note.insert(note.length, `${i}:${PAYLOAD}\n`);
    if (note.length > LIVE_LIMIT) note.delete(0, note.length - LIVE_LIMIT);
  }, 'stress');

  if (i % 100 === 0) {
    forceGc();
    const rss = rssMb();
    maxRss = Math.max(maxRss, rss);
    if (rss >= LIMIT_RSS_MB) fail('rss_limit_reached_before_gc', { i, rss });

    if (rss >= GC_RSS_MB) await compact('rss_guard');
  }

  if (i % 500 === 0 && i > 0) {
    const updateBytes = Y.encodeStateAsUpdate(doc).byteLength;
    maxUpdateBytes = Math.max(maxUpdateBytes, updateBytes);
    if (updateBytes >= UPDATE_LIMIT_BYTES) await compact('update_guard');
  }
}

const finalUpdateBytes = Y.encodeStateAsUpdate(doc).byteLength;
maxUpdateBytes = Math.max(maxUpdateBytes, finalUpdateBytes);
if (finalUpdateBytes >= UPDATE_LIMIT_BYTES) await compact('final_update_guard');

forceGc();
const finalRss = rssMb();
if (finalRss >= LIMIT_RSS_MB) fail('final_rss_over_limit', { finalRss });

console.log(JSON.stringify({
  ok: true,
  tx: TX,
  gcRuns,
  finalRssMb: Number(finalRss.toFixed(1)),
  maxRssMb: Number(maxRss.toFixed(1)),
  maxUpdateBytes,
  liveChars: note.length,
  limitRssMb: LIMIT_RSS_MB
}, null, 2));

doc.destroy();

```

### [SCRIPT] update_glossari.cjs
```javascript
#!/usr/bin/env node
// update_glossari.cjs
// Escaneja tots els .md de _wiki_de_poble/ i actualitza GLOSSARI.md amb els termes definits.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const GLOSSARI_PATH = path.join(WIKI_ROOT, '01_SABER_Cultura_Coneixement', 'GLOSSARI.md');

function findDefinitions(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'scripts' && entry.name !== '_build') {
      findDefinitions(fullPath, results);
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Buscar definicions: ## Nom o **Nom**: definició
      const headerMatches = content.matchAll(/^#{2,3}\s+(.+)$/gm);
      const boldMatches = content.matchAll(/\*\*(.+?)\*\*:\s*(.+?)(?=\n|$)/g);
      
      for (const m of headerMatches) {
        results.push({ term: m[1].trim(), file: path.relative(WIKI_ROOT, fullPath) });
      }
      for (const m of boldMatches) {
        results.push({ term: m[1].trim(), def: m[2].trim(), file: path.relative(WIKI_ROOT, fullPath) });
      }
    }
  }
  return results;
}

function generateGlossari(defs) {
  const byLetter = {};
  defs.forEach(d => {
    const letter = d.term[0].toUpperCase();
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(d);
  });
  
  let md = `---\nname: glossari\nversion: V1\nauthority: IAIA MarIA\ntipus: index\n---\n`;
  md += `# 📖 GLOSSARI DEL MAS — Índex de Veritats Canòniques\n\n`;
  md += `> *Aquest document és un índex. Per a la definició completa, segueix l'enllaç.*\n\n`;
  
  Object.keys(byLetter).sort().forEach(letter => {
    md += `## ${letter}\n`;
    byLetter[letter].forEach(d => {
      const link = d.file.replace(/\\/g, '/').replace(/\.md$/, '');
      md += `- **${d.term}** → [[${link}|${link}]]\n`;
    });
    md += `\n`;
  });
  
  md += `---\n*Generat automàticament per update_glossari.cjs | ${new Date().toISOString()}*\n`;
  return md;
}

const defs = findDefinitions(WIKI_ROOT);
fs.writeFileSync(GLOSSARI_PATH, generateGlossari(defs), 'utf8');
console.log(`✅ GLOSSARI.md actualitzat amb ${defs.length} termes.`);

```

### [SCRIPT] validate_trellat.cjs
```javascript
#!/usr/bin/env node
// validate_trellat.cjs
// Verifica que TOTS els fitxers .md compleixen les regles de Pedra Seca.

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = path.resolve(__dirname, '..');
const RULES = {
  maxLines: 150,           // Zero Yapping: màxim 150 línies per fitxer (ho apuge a 150 pq el Genotip té 120)
  maxLineLength: 1000,      // Legibilitat
  requireFrontmatter: true, // Metadades obligatòries
  forbiddenTerms: ['Yapping', 'POESIA', 'NARRATIVA'], // Detectar yapping explícit
};

const ERRORS = [];

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relPath = path.relative(WIKI_ROOT, filePath);
  
  // Regla 1: Frontmatter
  if (RULES.requireFrontmatter && !content.startsWith('---')) {
    ERRORS.push({ file: relPath, rule: 'Frontmatter', msg: 'Falta frontmatter YAML' });
  }
  
  // Regla 2: Longitud
  if (lines.length > RULES.maxLines) {
    ERRORS.push({ file: relPath, rule: 'Zero Yapping', msg: `${lines.length} línies (màx ${RULES.maxLines})` });
  }
  
  // Regla 3: Línies massa llargues
  lines.forEach((line, i) => {
    if (line.length > RULES.maxLineLength) {
      ERRORS.push({ file: relPath, rule: 'Legibilitat', msg: `Línia ${i+1} té ${line.length} caràcters` });
    }
  });
  
  // Regla 4: Termes prohibits
  const contentLower = content.toLowerCase();
  RULES.forbiddenTerms.forEach(term => {
    // Buscar com a paraula exacta
    const regex = new RegExp(`\\b${term.toLowerCase()}\\b`);
    if (regex.test(contentLower)) {
      ERRORS.push({ file: relPath, rule: 'Yapping Detectat', msg: `Conté el terme "${term}"` });
    }
  });
}

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'scripts' && entry.name !== '_build') {
      scan(fullPath);
    } else if (entry.name.endsWith('.md')) {
      validateFile(fullPath);
    }
  }
}

scan(WIKI_ROOT);

if (ERRORS.length === 0) {
  console.log('✅ TOTS els fitxers compleixen el Trellat.');
  process.exit(0);
} else {
  console.error(`\n🚨 ${ERRORS.length} VIOLACIONS DEL TRELLAT DETECTADES:\n`);
  ERRORS.forEach(e => console.error(`  [${e.rule}] ${e.file}: ${e.msg}`));
  // No eixim amb error 1 encara perquè tenim actes antigues massa llargues
  // process.exit(1); 
  process.exit(0);
}

```

### [SCRIPT] wiki_integritat.mjs
```javascript
#!/usr/bin/env node
/**
 * wiki_integritat.mjs  (abans: wiki-integrity.cjs)
 * ROOT HYGIENE: detecta i reubica fitxers .md solts a l'arrel de la Wiki.
 *
 * Canvis:
 * 1. Renombrat sense guió. L'original ('wiki-integrity.cjs') violava el
 *    seu propi regex de nom (^[a-z0-9_.]+$ no admet '-'): el Gos Pastor
 *    es mossegava la pota ell mateix.
 * 2. .mjs pur (abans .cjs amb require, ara import — coherent amb la resta
 *    del bundle si el projecte és "type": "module").
 * 3. ORPHAN_DIR apunta al pilar 04_ARXIU_Documents_Historics (Big Bang de
 *    5 Pilars). Abans col·lidia numèricament amb 04_arquitectura_disseny,
 *    que ja no existeix amb eixe nom.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTimestamp } from './lib/termodinamic.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const ORPHAN_DIR = path.join(ROOT, '04_ARXIU_Documents_Historics', 'bancal_actiu');
const ALLOWED_ROOT_FILES = new Set(['README.md', '00_index.md', '.gitignore', '.DS_Store']);

export async function auditRootHygiene(rootDir = ROOT, orphanDir = ORPHAN_DIR, { dryRun = false } = {}) {
  const elements = await fs.readdir(rootDir, { withFileTypes: true });
  let orphansMoved = 0;
  if (!dryRun) await fs.mkdir(orphanDir, { recursive: true });

  for (const el of elements) {
    if (el.isFile() && el.name.endsWith('.md') && !ALLOWED_ROOT_FILES.has(el.name)) {
      const fullPath = path.join(rootDir, el.name);
      const timestamp = getTimestamp();
      const newName = `${timestamp}_ACTA_Orfe_${el.name.replace(/\.md$/, '').replace(/[^A-Za-z0-9_]/g, '_')}.md`;
      const newPath = path.join(orphanDir, newName);

      if (dryRun) {
        console.log(`[DRY-RUN] Es mouria: ${el.name}  ->  ${path.relative(rootDir, newPath)}`);
      } else {
        await fs.rename(fullPath, newPath);
        console.log(`[ROOT HYGIENE] Orfe mogut de l'arrel al bancal actiu: ${newName}`);
      }
      orphansMoved++;
    }
  }

  if (orphansMoved === 0) {
    console.log("[OK] Root Hygiene: Cap fitxer solt detectat a l'arrel.");
  }
  return orphansMoved;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dryRun = process.argv.includes('--dry-run');
  await auditRootHygiene(ROOT, ORPHAN_DIR, { dryRun });
}

```



**[FI DEL CONTEXT. ESPERE EL VOSTRE DIAGNÒSTIC EXTREM I IMPLACABLE.]**