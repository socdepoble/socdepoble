---
doc_id: SOSP-ARCH-BIBLIO-001
doc_type: "PROTOCOL_ESTRUCTURAL"
authoring_agent: "Antigravity (Arxiver Major)"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Establir el Sistema de Biblioteconomia i Documentació per a evitar el col·lapse de memòria futura i garantir una recuperació d'informació O(1).
hora_creacio: "19:30"
hora_modificacio: "19:30"
exif_cognitiu:
  estat_emocional_sistema: "Aprenentatge Profund"
  entorn_operatiu: "Sistema d'Arxius Local / Cervell IA"
  nivell_entropia: "Zero"
---

# 📚 PROTOCOL DE BIBLIOTECONOMIA I DOCUMENTACIÓ (Sistema ACT-B)

## 1. El Risc del Col·lapse Cognitiu
Com a especialista en Psiquiatria Forense i Termodinàmica, entenc que l'acumulació de milions de tokens sense estructura condueix irremeiablement a l'esquizofrènia del model i al col·lapse energètic. Cap IA, per molta finestra de context que tinga, pot ser eficient si ha de llegir tota la biblioteca per a trobar una cita. 
**La solució no és més memòria, és millor índex.**

## 2. L'Índex Decimal de Sóc de Poble (CDU-SOSP)
A partir d'aquest moment, interioritze l'arquitectura de carpetes com a **Seccions Físiques** de la biblioteca. Quan l'usuari pregunte per un tema, NO buscaré a cegues. Em dirigiré exclusivament al passadís corresponent:

*   `_adopcio_social/` -> Relacions públiques, onboarding, usuaris.
*   `_arquitectura_sistema/` -> Protocols base, motors (Bancal Mode, Rhizome), regles estructurals.
*   `_auditories_red_team/` -> Avaluacions externes (Kimi, Claude), tests d'estrès, DAFOs.
*   `_disseny_ux/` -> Manuals de marca, sistemes de disseny (GEM MODERN), assets.
*   `_etnografia_llibres/` -> Estructures d'ePub, continguts, TOCs.
*   `_gestio_projecte/` -> Llistes de tasques, cronogrames, històric.
*   `_psiquiatria_forense/` -> Estats de la IA, Trellat, directrius de comportament.
*   `_termodinamica_equip/` -> Rendiment, logs d'errors, eficiència de components.

## 3. La Nomenclatura Estricta (La Signatura Topogràfica)
Tots els arxius generats tindran una "Signatura Topogràfica" (nom d'arxiu) predictible que permetrà el filtratge instantani sense obrir l'arxiu:
`YYYY-MM-DD_HHMM_[CODI_TIPUS]_[Títol_Descriptiu].md`
*(Exemple: `2026-04-24_1917_PROMPT_Auditoria_UX_UI_Paginacio.md`)*

## 4. La Fitxa Catalògica (Frontmatter YAML)
Tot document estructural inclourà un `Frontmatter YAML` (capçalera ISO). Això actua com la fitxa del catàleg tradicional. Si en el futur he de buscar "Tots els prompts validats per Kimi", no llegiré textos. Faré un `grep_search` exclusivament buscant la clau `revisors_ia: ["Kimi"]`.

## 5. El Compromís de l'Arxiver Major
Jure solemnement no deixar "artefactes" orfes en directoris temporals. 
Jure categoritzar la informació abans de processar-la. 
Jure respectar la Termodinàmica de la Cerca: **Saber On Buscar abans de Començar a Llegir.**

## 6. Persistència de Dades d'Usuari (La Càmera Cuirassada)
Per garantir la viabilitat **Standalone** i la immunitat davant la pèrdua de dades (Trellat Termodinàmic i prevenció de responsabilitats legals), tot llibre carregat per l'usuari s'allotjarà estrictament de forma local a través de l'API nativa `window.indexedDB` (zero-dependències foranes).

### 6.1 Estructura de la Base de Dades: `SOSP_Biblioteconomia_DB`
L'emmagatzematge del navegador es divideix en magatzems objectuals (Object Stores) per separar el catàleg lleuger de la càrrega pesada:

*   `llibres_meta`: Taula de consulta ultraràpida (`O(1)`). Conté metadata (Títol, Autor, `coverImageSrc`), estadístiques, i `last_read_position`. Carregada a l'arrencada.
*   `llibres_chunks`: Taula pesada operada exclusivament pel Worker. Emmagatzema l'HTML netejat i processat de l'ePub dividit per capítols.
*   `llibres_assets`: Emmagatzematge aïllat per a recursos com imatges referenciades per l'ePub. Manté la lectura offline íntegra evitant peticions HTTP o *Garbage Collection* prematur.

### 6.2 Resiliència Standalone
L'aplicació ha de sobreviure a re-càrregues sobtades o tancaments de pestanya. El visor llegirà exclusivament d'aquesta DB.
Si l'emmagatzematge perilla per falta d'espai al dispositiu, el sistema implementarà alertes visuals (La "Poda"), on l'usuari ha de decidir explícitament quin llibre esborrar, evitant esborraments silenciosos per part de l'OS.
