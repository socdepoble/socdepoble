---
estat: "esborrany"
tipus: "index"
description: "Índex Dataview de les notes operatives, ordenat per connectivitat i amb metadades de l'esquema v2."
---
# 📊 Taula Mestra de la Wiki (Vista 2D)
> **⚠️ REQUISIT:** Per veure aquesta taula renderitzada (a l'estil Notion o Excel), necessites tenir instal·lat i activat el plugin de la comunitat anomenat **Dataview** a Obsidian.

```dataview
TABLE WITHOUT ID
  file.link AS "Títol",
  estat AS "Estat",
  tipus AS "Tipus",
  description AS "Descripció",
  aliases AS "Àlies",
  revisat AS "Revisat",
  (length(file.inlinks) + length(file.outlinks)) AS "Connexions"
FROM "00_SER_Brain_Identitat"
  OR "01_SABER_Cultura_Coneixement"
  OR "02_ACTUAR_Maquina_Tecnica"
  OR "03_GOVERNAR_Normativa_Regles"
WHERE file.name != this.file.name
SORT (length(file.inlinks) + length(file.outlinks)) ASC
```


## Taxonomia
- **Categoria:** [[Identitat]]
- **Etiquetes:** [[Graf]]
