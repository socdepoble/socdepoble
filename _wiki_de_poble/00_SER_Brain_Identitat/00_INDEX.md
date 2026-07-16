---
estat: "canonic"
tipus: "index"
description: "Orienta la navegació pels quatre pilars operatius i les dues zones de cicle de vida de la Wiki."
---
# Índex de la Wiki

Entrada estàtica a la Wiki de Sóc de Poble.

## 4 pilars operatius

| Pilar | Funció | Enllaç |
|---|---|---|
| 00 SER | Identitat, genotip, visió, actors | [[01_IDENTITAT]] |
| 01 SABER | Cultura, glossari, llengua, memòria del poble | [[00_GLOSSARI_CANONIC]] |
| 02 ACTUAR | Màquina tècnica, skills, scripts, plantilles | [[00_arquitectura_tecnica_unificada]] |
| 03 GOVERNAR | Lleis, estàndards, protocols, veto | [[DOC_Governanca]] |

## 2 zones de cicle de vida

| Zona | Funció | Enllaç |
|---|---|---|
| 04 ARXIU | Memòria històrica curada i consultiva | [[04_ARXIU_Documents_Historics/actes_arxivades/90_arxiu_historic]] |
| 05 ESCRIPTORI | Treball editorial temporal, no autoritat | Buit en esta baseline; ruta `05_Escriptori_Soc_de_Poble/` |

## Escriptori de Sessió (L'Era)

Per mantenir la puresa de l'arrel, el treball actiu ("L'Era" o escriptori de treball) es realitza a **`05_Escriptori_Soc_de_Poble/`**. 
El treball editorial temporal pot passar per ací. En tancar-lo, el coneixement aprovat es promou de manera explícita; els bolcats massius van a `_arxiu_wiki_de_poble`, fora del vault. Res amb contingut s’esborra automàticament.

## Documents Troncals

- [[01_IDENTITAT]]
- [[02_GENOTIP]]
- [[el_projecte]]
- [[Soci_Sollutia]]
- [[01_trellat]]
- [[DOC_Governanca]]
- [[ESTANDARD_Pedra_Seca]]
- [[00_arquitectura_tecnica_unificada]]

`[[00_BIOS]]` és una redirecció històrica i `[[FORJA_TO_CORE]]` una proposta
futura; no són punts d'arrencada ni gates actius.

## Regla

Si no saps on va un document:

- identitat → `00_SER_Brain_Identitat`
- cultura → `01_SABER_Cultura_Coneixement`
- execució → `02_ACTUAR_Maquina_Tecnica`
- llei → `03_GOVERNAR_Normativa_Regles`
- memòria morta → `04_ARXIU_Documents_Historics`
- treball actiu → `05_Escriptori_Soc_de_Poble`

## Estat mecànic

L’estat del graf no es manté en una llista manual: el calcula l’Autoneteja v2. El criteri de salut és zero orfes, fantasmes i ambigüitats dins dels quatre pilars operatius; arxiu, mirrors i vendors es reporten per separat.


## Taxonomia
- **Categoria:** [[Identitat]]
- **Etiquetes:** [[Graf]]
