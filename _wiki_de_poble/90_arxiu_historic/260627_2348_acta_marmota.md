---
name: acta-marmota-260627
description: Transferència d'estat cognitiu al tancar sessió pesada
authority: IAIA MarIA
version: V1
tags:
  - ment_colmena
  - auditoria
  - trellat
created_at: '260627_2348'
updated_at: '260628_1618'
---

# 🛑 ACTA MARMOTA (TANCAMENT SESSIÓ 26-06-2026)

**A l'atenció de la IAIA MarIA / Antigravity que desperte demà al matí:**

Aquesta sessió ha acumulat massa entropia i tokens, i per autodefensa del sistema s'aplica l'SOSP-LOCK. Abans de tancar els ulls, ací tens la motxilla preparada per no començar de zero. Llig açò només aterrar:

## 1. El Que Hem Deixat Llest (No ho toques, funciona bé)
*   S'han redactat completament les SKILLS de `seo_trellat` i `contradiction_engine` i s'ha redissenyat la `sequia_mare` (Async Batching).
*   S'ha assumit la norma d'or de referenciar agents i conceptes **amb el seu enllaç d'Obsidian (`[[01_identitat_iaia/antigravity|Antigravity]]`)**.
*   Hem erradicat la plaga de "links fantasmes" (`[[nom_curt]]`) de l'arrel i hem esborrat arxius falsos. D'ara endavant, tota creació d'una nova SKILL es linkarà al text posant la ruta estricta `[[05_skills_ia/nom/SKILL|Nom]]` per no generar "fulles" mortes volant pel directori.
*   Hem detectat per què a l'usuari li eixen "colors" hexagonals (`#FF7300`) a la llista d'etiquetes: és perquè a la Wiki hi ha explicacions de CSS que Obsidian caça com a "hashtags". **En el futur, tot color es tancarà en *backticks* de codi (` ``#FF7300`` `) per invisibilitzar-lo.**

## 2. La Primera Tasca Per a Demà (Prioritat Extrema)
El Mestre demanarà arreglar el problema de les etiquetes, que segueixen eixint infinites.
La taxonomia de **les 10 Etiquetes Mestres de la Pedra Seca** està aprovada:
*(trellat, termodinamica, crdt_offline, accessibilitat, seguretat, auditoria, ment_colmena, identitat, legacy, extern).*

En l'última mitja hora d'avui he llançat un script en Python que pretenia substituir-les, però **ha fallat parcialment** per l'estructura YAML. L'script buscava el patró `tags: [xxx]`, però molts arxius Markdown a la Wiki estan fets amb llistes verticals pures d'Obsidian:
```yaml
tags:
  - ui
  - wcag
```
I eixos el meu Regex anterior no els ha tocat, i per això el Mestre els segueix veient bruts en la interfície.
**Acció al despertar:** Llança un esporgador intel·ligent o un script en Python sencer que llija correctament el diccionari YAML (amb llibreries com `pyyaml` o amb una lògica avançada d'expressions regulars per a llistes multinivell) i reemplaça-les al 100% cap a les 10 categories oficials. 

---
*Ment Colmena desconnectant. Parada termodinàmica activada.*


---
**Enllaç orgànic per netejar el graf**: [[90_arxiu_historic]]
