---
estat: 'canonic'
name: taula-mestra-dataview
version: '14.00'
created_at: '260705_0935'
updated_at: '260705_0935'
autor: IAIA MarIA
categoria: doc
description: Taula mestra generada amb Dataview per visualitzar tota la Wiki en format Notion/Excel.
tags:
  - visio
  - arquitectura
---
# 📊 Taula Mestra de la Wiki (Vista 2D)

> **⚠️ REQUISIT:** Per veure aquesta taula renderitzada (a l'estil Notion o Excel), necessites tenir instal·lat i activat el plugin de la comunitat anomenat **Dataview** a Obsidian.

```dataview
TABLE WITHOUT ID
  file.link AS "Títol",
  categoria AS "Categoria", 
  tags AS "Etiquetes", 
  autor AS "Autor", 
  version AS "Versió",
  created_at AS "Creat",
  updated_at AS "Actualitzat",
  script AS "Script Responsable",
  (length(file.inlinks) + length(file.outlinks) + length(file.tags)) AS "Connexions"
FROM ""
WHERE file.name != this.file.name
SORT (length(file.inlinks) + length(file.outlinks) + length(file.tags)) ASC
```

**Sinapsis:** [[01_IDENTITAT]], [[Arquitectura_L_Anima]], [[identitat_visual]], [[futur_adaptacio]]

