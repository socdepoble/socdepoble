---
estat: "arxivat"
tipus: "informe"
description: "La wiki no esta malament per falta d'idees. Esta patint per excés de vitalitat sense jurisdiccio. El problema central no es que 03GOVER..."
---
# Auditoria Estructural Destructiva de la Wiki "Soc de Poble"

## Veredicte executiu

La wiki no esta malament per falta d'idees. Esta patint per excés de vitalitat sense jurisdiccio. El problema central no es que `03_GOVERNAR` estiga buit: es que `03_GOVERNAR` esta escampat per tot arreu, sobretot dins de `02_ACTUAR`.

Distribucio detectada dins del bundle:

| Pilar | Fitxers al bundle | Diagnosi |
|---|---:|---|
| `00_SER_Brain_Identitat` | 5 | Correcte, pero conte registre i mapa que no son identitat pura. |
| `01_SABER_Cultura_Coneixement` | 5 | Net i curt, pero hauria d'absorbir mes cultura visual i llenguatge. |
| `02_ACTUAR_Maquina_Tecnica` | 52 | Calaix de sastre. Conte arquitectura, normes, plantilles, skills, governanca i historia. |
| `03_GOVERNAR_Normativa_Regles` | 1 | Esquelet constitucional sense cos. |
| `04_ARXIU_Documents_Historics` | 0 dins del bundle auditat | La memoria esta fora de lloc o no esta entrant al bundle com a pilar viu. |

Regla nova de classificacio:

| Si el document diu... | Ha de viure a... |
|---|---|
| Qui som, per que existim, quins actors som | `00_SER` |
| Paraules, cultura, marca, poble, narrativa | `01_SABER` |
| Com executar, compilar, automatitzar, plantilla operativa | `02_ACTUAR` |
| "Obligatori", "prohibit", veto, SDP-LOCK, GDPR, aprovacio, manament | `03_GOVERNAR` |
| Que va passar, auditoria, acta, historial, futur especulatiu | `04_REGISTRE` |

## FASE 3 - Reordenacio radical

| Fitxer / Skill | Ubicacio actual | Nova ubicacio proposada | Justificacio |
|---|---|---|---|
| `00_BIOS.md` | `00_SER` | `00_SER` + extracte a `03_GOVERNAR/CONSTITUCIO_BIOS.md` | El genotip es identitat, pero les lleis i tallafocs son constitucio executable. |
| `01_IDENTITAT.md` | `00_SER` | `00_SER` | Correcte: identitat, missio i protocols d'interaccio. |
| `02_FAMILIA.md` | `00_SER` | `00_SER` | Correcte: ecosistema d'IAs i identitat relacional. |
| `CORE_Registre_Automillora.md` | `00_SER` | `04_REGISTRE/CORE_Registre_Automillora.md` | Es un diari de canvis, no identitat. |
| `DOC_Taula_Mestra.md` | `00_SER` | `00_SER/DOC_Taula_Mestra.md` | Pot quedar com mapa d'entrada, pero ha de ser generat i no normatiu. |
| `00_GLOSSARI_CANONIC.md` | `01_SABER` | `01_SABER` | Correcte: llengua i compressio semantica. |
| `00_visio_i_pilars.md` | `01_SABER` | `00_SER/00_VISIO_I_PILARS.md` | La visio i missio son identitat troncal, no coneixement cultural. |
| `01_trellat.md` | `01_SABER` | `03_GOVERNAR/PRINCIPI_Trellat.md` + resum a `01_SABER` | Conté regles de ferro; el glossari pot conservar la definicio cultural. |
| `CULTURA_Narrativa_Historica.md` | `01_SABER` | `01_SABER` | Correcte. |
| `la_torre/fadrins_i_fadrines.md` | `01_SABER` | `01_SABER/la_torre/` | Correcte. |
| `00_arquitectura_tecnica_unificada.md` | `02_ACTUAR` | `02_ACTUAR/00_Arquitectura_Tecnica.md` | Es el tronc tecnic. Cal extraure veto, seguretat i politiques a `03`. |
| `01_arquitectura.md` | `02_ACTUAR` | Fusionar dins `00_Arquitectura_Tecnica.md` i eliminar | Duplicat reduit de l'arquitectura unificada. |
| `Arquitectura_Directives.md` | `02_ACTUAR/04_arquitectura_disseny` | `03_GOVERNAR/DIRECTIVES_IA.md` | Directives i protocols son governanca. |
| `Arquitectura_Disseny.md` | `02_ACTUAR/04_arquitectura_disseny` | `03_GOVERNAR/ESTANDARD_Disseny_UX.md` | Lleis visuals, accessibilitat i marca obligatoria. |
| `Arquitectura_Etnografia.md` | `02_ACTUAR/04_arquitectura_disseny` | `00_SER/Arquitectura_Etnografia.md` | ADN, filosofia i simbiosi: identitat profunda. |
| `Arquitectura_General.md` | `02_ACTUAR/04_arquitectura_disseny` | `04_REGISTRE/actes_arxivades/` | Acta historica mixta. Extraure sols els principis vius abans d'arxivar. |
| `Arquitectura_Gestio.md` | `02_ACTUAR/04_arquitectura_disseny` | `03_GOVERNAR/GESTIO_Projecte.md` | Cicle de treball, ISO i coordinacio son governanca. |
| `Arquitectura_L_Anima.md` | `02_ACTUAR/04_arquitectura_disseny` | `00_SER/Manifest_Anima.md` | Propòsit i genesis pertanyen a identitat. |
| `Arquitectura_La_Forja.md` | `02_ACTUAR/04_arquitectura_disseny` | `04_REGISTRE/actes_arxivades/` | Historic i contradictori: React/Vite/Tailwind xoquen amb Vanilla/zero overhead. |
| `Arquitectura_Protocol_Lazaro.md` | `02_ACTUAR/04_arquitectura_disseny` | `03_GOVERNAR/PROTOCOL_Lazaro.md` | Protocol d'emergencia i reconstruccio: norma de supervivencia. |
| `Arquitectura_Sistema_Nervios.md` | `02_ACTUAR/04_arquitectura_disseny` | `02_ACTUAR/CRDT_Sistema_Nervios.md` | Arquitectura tecnica clara. |
| `Arquitectura_Skills_Arrel.md` | `02_ACTUAR/04_arquitectura_disseny` | `03_GOVERNAR/REGLA_Skills_i_Arrel.md` | Regula quan crear skills i com mantindre l'arrel neta. |
| `connectors_mcp_disseny.md` | `02_ACTUAR/04_arquitectura_disseny` | `02_ACTUAR/connectors/Connectors_MCP_Disseny.md` | Eines operatives i integracions. |
| `identitat_visual.md` | `02_ACTUAR/04_arquitectura_disseny` | `01_SABER/Identitat_Visual.md` + regles a `03` | Manual de marca i llenguatge visual; les obligacions van a governanca. |
| `00_plantilles.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/00_INDEX.md` | Correcte com index d'eines. |
| `plantilla_acta_unica.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/plantilla_acta_unica.md` | Plantilla operativa, encara que genere documents de `04`. |
| `plantilla_brainstorming.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` | Eina d'execucio. |
| `plantilla_branding.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` | Eina d'execucio; font de marca a `01`. |
| `plantilla_creador_skills.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` + regla a `03` | La plantilla queda en `02`; criteris obligatoris a `03`. |
| `plantilla_doc_to_app.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` | Plantilla operativa. |
| `plantilla_modo_produccion.md` | `02_ACTUAR/07_plantilles` | `03_GOVERNAR/CHECKLIST_Produccio.md` | Produccio i checklist d'auditoria son porta de qualitat. |
| `plantilla_planificacio.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` | Plantilla operativa. |
| `plantilla_prompt_iso.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` | Plantilla de prompts, no skill. |
| `plantilla_skill_trellat.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/` | Plantilla. Fusionar amb la plantilla ISO de skill. |
| `skill_plantilla_suprema.md` | `02_ACTUAR/07_plantilles` | `02_ACTUAR/plantilles/plantilla_skill_suprema.md` | Esta mal categoritzada com `skill`; ha de ser `plantilla`. |
| `DOC_Consola_Termodinamica.md` | `02_ACTUAR` | `03_GOVERNAR/METRICA_Consola_Termodinamica.md` | Les metriques decideixen bloquejos i qualitat. |
| `DOC_Seguretat.md` | `02_ACTUAR` | `03_GOVERNAR/SEGURETAT_Perimetral.md` | Seguretat, signatures i circuit breaker son governanca. |
| `a11y_trellat.md` | `02_ACTUAR/skills` | `03_GOVERNAR/ESTANDARD_Accessibilitat.md` + skill fina a `02` | El contingut actual son normes obligatories. |
| `ESTANDARD_Pedra_Seca.md` | `02_ACTUAR/skills` | `03_GOVERNAR/ESTANDARD_Pedra_Seca.md` | Defineix estandard de maquetacio; resoldre contradiccio Tailwind. |
| `auditoria_semantica.md` | `02_ACTUAR/skills` | `02_ACTUAR/skills/auditoria_semantica.md` | Skill operativa valida, pero ha de dependre de regles a `03`. |
| `AUDITORIA_CANONICA.md` | `02_ACTUAR/skills` | Fusionar amb `AUDITORIA_CANONICA.md` | Duplicat funcional d'auditoria/integritat. |
| `backup_recovery.md` | `02_ACTUAR/skills` | `03_GOVERNAR/PROTOCOL_Backup_Recovery.md` + implementacio a `02` | Protocol de dades i recuperacio critica. |
| `cerebel_procedimental.md` | `02_ACTUAR/skills` | `00_SER/Cerebel_Procedimental.md` | Model cognitiu i memoria muscular de la IAIA. |
| `cingulat_anterior.md` | `02_ACTUAR/skills` | `03_GOVERNAR/VETO_Cingulat_Anterior.md` | Tribunal, UDR i quarantena son governanca. |
| `connexio_radical.md` | `02_ACTUAR/skills` | `03_GOVERNAR/PRINCIPI_Connexio_Radical.md` | Principi de producte i privacitat. |
| `consola_termodinamica.md` | `02_ACTUAR/skills` | Fusionar amb `DOC_Consola_Termodinamica.md` a `03` | Duplicat de metriques i bloquejos. |
| `AUDITORIA_CANONICA.md` | `02_ACTUAR/skills` | `02_ACTUAR/skills/AUDITORIA_CANONICA.md` | Mantindre com motor; les lleis de friccio a `03`. |
| `crdt_optimitzacio.md` | `02_ACTUAR/skills` | `02_ACTUAR/skills/crdt_optimitzacio.md` | Skill tecnica clara. |
| `error_boundaries.md` | `02_ACTUAR/skills` | `02_ACTUAR/skills/error_boundaries.md` | Skill tecnica clara. |
| `executiu_central.md` | `02_ACTUAR/skills` | `03_GOVERNAR/DECISIO_Executiu_Central.md` | Decisions a llarg termini i anti-hype son governanca. |
| `futur_adaptacio.md` | `02_ACTUAR/skills` | `04_REGISTRE/incubadora/Futur_Adaptacio.md` | Especulacio i roadmap, no skill activa. |
| `index_trellat.md` | `02_ACTUAR/skills` | `03_GOVERNAR/METRICA_Index_Trellat.md` | Formula de decisio i SDP-LOCK. |
| `plantilla_skill_iso.md` | `02_ACTUAR/skills` | `02_ACTUAR/plantilles/plantilla_skill_iso.md` | Es plantilla, no skill. |
| `sagramental_dels_morts.md` | `02_ACTUAR/skills` | `03_GOVERNAR/PROTOCOL_Successio.md` | Successio, ausencia i aprovacio dual. |
| `DOC_Seguretat.md` | `02_ACTUAR/skills` | `03_GOVERNAR/SEGURETAT_Dades_GDPR.md` | Legal, privacitat i dret a l'oblit. |
| `self_repair.md` | `02_ACTUAR/skills` | `03_GOVERNAR/PROTOCOL_SDP_Self_Repair.md` | SDP-LOCK i emergencia son normes de govern. |
| `seo_trellat.md` | `02_ACTUAR/skills` | `03_GOVERNAR/ESTANDARD_SEO.md` | Estàndard obligatori de publicacio. |
| `sequia_mare.md` | `02_ACTUAR/skills` | `02_ACTUAR/skills/sequia_mare.md` | Skill tecnica de sincronitzacio. |
| `service_worker_pwa.md` | `02_ACTUAR/skills` | `02_ACTUAR/skills/service_worker_pwa.md` | Skill tecnica clara. |
| `sincronitzacio_skills.md` | `02_ACTUAR/skills` | `03_GOVERNAR/REGLA_Veritat_Dual.md` | Jerarquia codi/wiki i aprovacio critica. |
| `skill_arrel.md` | `02_ACTUAR/skills` | `00_SER/Soci_Sollutia.md` | No es skill arrel; es relacio amb soci tecnologic. |
| `soci_sollutia.md` | `02_ACTUAR/skills` | Eliminar despres de fusionar amb `skill_arrel.md` | Duplicat del mateix `name: soci-sollutia`. |
| `DOC_Governanca.md` | `03_GOVERNAR` | `03_GOVERNAR/00_CONSTITUCIO.md` | Correcte, pero ha de passar de resum a font de veritat. |

Objectiu de repartiment despres de la purga:

| Pilar | Pes sa aproximat | Rol |
|---|---:|---|
| `00_SER` | 7-9 fitxers | Identitat, actors, missio, genotip cognitiu. |
| `01_SABER` | 6-8 fitxers | Cultura, glossari, marca, poble. |
| `02_ACTUAR` | 18-24 fitxers | Scripts, plantilles, motors i skills tecnicament executables. |
| `03_GOVERNAR` | 18-24 fitxers | Constitucio, veto, estandards, metriques, seguretat, legal. |
| `04_REGISTRE` | 8-15 fitxers | Actes, auditories, historics, incubadora i automillora. |

## FASE 1 - Skills i redundancies

### DAFO rapid

| Quadrant | Diagnosi |
|---|---|
| Fortaleses | Visio potent, llenguatge propi, local-first, iPad A10, accessibilitat, CRDT, cultura del poble, metriques com IT/UDR/SDP. |
| Debilitats | Massa skills amb forma de manifest; frontmatter inconsistent; duplicats; governanca soterrada en `02`; contradiccions React/Tailwind/Vanilla; categories trencades. |
| Amenaces | Una IA pot obeir el document equivocat; el tallafocs pot fallar per frase desactualitzada; una norma legal pot quedar enterrada com a "skill"; la wiki pot creure que esta governada quan sols esta narrada. |
| Oportunitats | Convertir 20 skills literaries en 7 families operatives; crear una constitucio real en `03`; fer que scripts i documents compartisquen un manifest unic. |

### Skills amb futur

Tenen futur si es compacten i se separa "llei" de "execucio":

- `auditoria_semantica`, `contradiction_engine`, `crdt_optimitzacio`, `sequia_mare`, `service_worker_pwa`, `error_boundaries`, `a11y_trellat`, `arquitectura_pedra_seca`, `seo_trellat`, `backup_recovery`, `self_repair`, `seguretat_dades`.

### Skills que no han de continuar com a skills

- `futur_adaptacio`: incubadora/roadmap, no skill activa.
- `plantilla_skill_iso` i `skill_plantilla_suprema`: plantilles, no skills.
- `soci_sollutia` i `skill_arrel`: identitat/relacio externa, no skill d'execucio.
- `cerebel_procedimental`, `executiu_central`, `cingulat_anterior`: son bones metafores cognitives, pero com a normes han de viure en `00` o `03`, no en el calaix tecnic.

### Duplicats i contradiccions que exigeixen fusio o eliminacio

| Grup | Accio exigida |
|---|---|
| `skill_arrel.md` + `soci_sollutia.md` | Fusionar en un sol document `00_SER/Soci_Sollutia.md`; eliminar el duplicat. |
| `DOC_Consola_Termodinamica.md` + `consola_termodinamica.md` + part de `index_trellat.md` | Unificar en `03_GOVERNAR/METRICA_Consola_Termodinamica_i_IT.md`. |
| `auditoria_semantica.md` + `AUDITORIA_CANONICA.md` + `AUDITORIA_CANONICA.md` | Un sol motor d'auditoria amb modes: estructura, semantica, contradiccio. |
| `plantilla_creador_skills.md` + `plantilla_skill_iso.md` + `plantilla_skill_trellat.md` + `skill_plantilla_suprema.md` | Unificar en una sola especificacio de skill i una sola plantilla. |
| `Arquitectura_Disseny.md` + `identitat_visual.md` + `ESTANDARD_Pedra_Seca.md` + `a11y_trellat.md` + `seo_trellat.md` | Separar en: marca (`01`), estandard UI (`03`), skill d'aplicacio (`02`). |
| `01_arquitectura.md` + `00_arquitectura_tecnica_unificada.md` | Fusionar i eliminar `01_arquitectura.md`. |

Contradiccions critiques:

1. `00_BIOS.md` diu que Tailwind esta completament prohibit; `ESTANDARD_Pedra_Seca.md` diu que Tailwind es obligatori per als ossos.
2. `00_BIOS.md` i `01_trellat.md` eleven Vanilla JS/CSS; `Arquitectura_La_Forja.md` consagra React, Vite i Tailwind com a motors.
3. `futur_adaptacio.md` diu que la wiki `.md` es dogma; `sincronitzacio_skills.md` diu que el codi homologat governa la wiki.
4. `DOC_Governanca.md` fixa jerarquia `Trellat > Constitucio > Codi > Wiki`, pero altres documents reparteixen manaments sense passar per la constitucio.
5. Hi ha `name: glossari` duplicat, `name: soci-sollutia` duplicat, `categoria: SKILL` en majuscules, `name:` com a llista o buit en algunes skills.

## FASE 2 - Scripts i maquinaria

He comprovat, fora del bundle, que hi ha una carpeta real de scripts a:

`_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/`

Conte 40 fitxers de script i 4.130 linies aproximades. Tambe hi ha una carpeta arrel `/scripts` amb molts scripts historics i alguns encara citats pel BIOS.

### Diagnosi dura

| Observacio | Impacte |
|---|---|
| Hi ha dos ecosistemes de scripts: `/scripts` i `_wiki_de_poble/02_ACTUAR.../scripts` | Doble cervell de control. Risc de divergencia. |
| `node scripts/tallafocs.cjs` falla ara mateix | El tallafocs antic bloqueja per "Consell de les 12 IAs" desincronitzat amb la BIOS actual. |
| `pre-commit.mjs --dry-run` passa, amb avisos | El tallafocs nou dona "OK" mentre l'antic falla: contradiccio operativa. |
| `pre-commit.mjs` imprimeix pas `[4/3]` | Bug menor, pero simbolic: el ritual no esta polit. |
| `package.json` apunta `log-session` a `_wiki_de_poble/scripts/session-logger.js`, carpeta que no existeix | Comanda documentada trencada o obsoleta. |
| Hi ha 3 generadors de bundle: `generate_bundle.cjs`, `generate_bundle_fixed.cjs`, `bundle_wiki.cjs`, mes `generate_slim_bundle.cjs` | Redundancia clara. Un sol generador amb flags. |
| Hi ha molts auditors: `audit_estructura`, `audit_integritat_estructural`, `semantic_auditor`, `wiki_integritat`, `contradiction_engine`, `auto_audit_skills`, `detect_duplicates` | Han de ser subcomandes d'un CLI unic. |
| Hi ha scripts de neteja forts: `neteja_total.js`, `kimi_purge.cjs`, `move_petorreta.cjs`, `migracio_v5.js` | Han d'exigir `--dry-run` per defecte i confirmacio explicita. |

### Unificacio recomanada

Crear un CLI unic: `sdp`.

| Subcomanda | Absorbeix |
|---|---|
| `sdp doctor` | `tallafocs`, `pre-commit`, `validate_trellat`, `wiki_integritat`, `audit_estructura`. |
| `sdp guard` | `guardrail_escriptura`, `escriptura-protegida`, `enforce_termodinamic`, `cerrojo_absoluto`. |
| `sdp audit` | `semantic_auditor`, `contradiction_engine`, `auto_audit_skills`, `detect_duplicates`, `audit_integritat_estructural`. |
| `sdp bundle` | `generate_bundle`, `generate_bundle_fixed`, `bundle_wiki`, `generate_slim_bundle`, `split_bundle`. |
| `sdp log` | `session-logger`, `build_incremental`, `generate_nano_prompt`. |
| `sdp sync` | `sync_brain`, `sync_brain_termodinamic`, `sync_cerebel`, `compiler/*`. |
| `sdp clean` | `neteja_termodinamica`, `neteja_total`, `kimi_purge`, `fix_graph_links`, `consolidar_etiquetes`, `update_glossari`. |

Regla final: cap document de `03_GOVERNAR` pot citar un script que no estiga registrat en `02_ACTUAR/scripts/README.md` amb estat: `actiu`, `legacy`, `substituit` o `perillos`.

## Nova arquitectura de governanca

Per omplir `03_GOVERNAR` sense convertir-lo en cementeri:

1. `03_GOVERNAR/00_CONSTITUCIO.md`: jerarquia de veritat, veto huma, relacio codi/wiki.
2. `03_GOVERNAR/01_MANAMENTS.md`: 9 lleis BIOS + 5 manaments, sense duplicar-los en 8 llocs.
3. `03_GOVERNAR/02_ESTANDARDS/`: Pedra Seca, Accessibilitat, SEO, Produccio, Nomenclatura.
4. `03_GOVERNAR/03_PROTOCOLS/`: SDP-LOCK, Backup, Successio, Lazaro, Seguretat, Veritat Dual.
5. `03_GOVERNAR/04_METRIQUES/`: IT, UDR, Consola Termodinamica, llindars.
6. `03_GOVERNAR/05_REGISTRE_DE_SCRIPTS.md`: scripts oficials, propietari, estat i ordre d'execucio.

La clau: `03` no ha de ser llarg per literatura. Ha de ser curt, dur i executable. Si una IA llig `03`, ha de saber que esta llegint llei, no inspiracio.

## Prioritats de purga

1. Resoldre la contradiccio Tailwind/Vanilla en un sol document de governanca.
2. Fer passar tots els scripts de seguretat per un manifest unic.
3. Fusionar `soci-sollutia` i eliminar el duplicat.
4. Moure `CORE_Registre_Automillora` a `04`.
5. Convertir les plantilles falsament marcades com skills en plantilles reals.
6. Arxivar `Arquitectura_La_Forja.md` com a historic si ja no representa la decisio tecnica actual.
7. Ampliar `DOC_Governanca.md` fins que siga la font de veritat, no un index ornamental.