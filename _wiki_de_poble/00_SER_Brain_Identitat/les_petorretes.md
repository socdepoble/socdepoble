---
estat: "esborrany"
tipus: "document"
description: "Defineix el Consell de les Petorretes, els rols d'auditoria i el seu protocol de convocatòria."
---
# El Consell de les Petorretes

Una Petorreta és una revisió externa o paral·lela amb una pregunta concreta, un rol delimitat i criteris d’acceptació. El Consell és una tècnica per reduir punts cecs; no és una autoritat superior ni obliga a convocar un nombre fix de models.

## Quan té sentit

- decisions d’arquitectura amb alternatives reals;
- auditories de seguretat, dades o accessibilitat;
- diagnòstics on dos revisors independents poden detectar biaixos diferents;
- síntesis en què l’humà vol comparar arguments abans de decidir.

Una tasca local, reversible i ben coberta per proves no necessita un eixam.

## Contracte de context

1. Selecciona només les fonts necessàries en un manifest amb `path`, `reason`, `classification` i `role`.
2. Calcula hashes i redacta secrets o dades personals abans d’enviar res fora.
3. No adjuntes el repositori, tota la Wiki ni una MEGA-Petorreta per defecte.
4. Distingix fets observats, inferències i propostes.
5. Conserva la decisió humana i les discrepàncies importants; no votes per majoria mecànica.

## Acte Reflex

Abans de crear context o modificar [[el_projecte|el projecte]], seguix `.agents/PROTOCOL_PETORRETA.md`:

1. `open` declara intenció, risc, scopes i operacions.
2. La Petorreta mecànica i el manifest són els dos únics fitxers del bootstrap reservat.
3. `seal` emet una lease vinculada als bytes, regles, Git i targets.
4. Cada script mutador valida el rebut; el hook Git és l’última barrera.

Les Petorretas editorials ordinàries poden passar per `05_Escriptori_Soc_de_Poble`; les massives i els feixos forenses viuen en `_arxiu_wiki_de_poble`, fora del vault.

## Selecció de revisors

Tria el model o professional per capacitat demostrada i disponibilitat actual. Els noms, versions i serveis canvien; per això este document no fixa una litúrgia d’onze proveïdors ni atribuïx necessitats emocionals als models.

## Captures i annexos

Una captura és evidència si aporta informació a la tasca. S’analitza, es classifica i només s’incorpora al manifest quan és rellevant i segura. No tota captura necessita una acta ni persistència permanent.

## Criteri d’èxit

El Consell ha funcionat quan deixa una decisió més verificable: supòsits visibles, riscos prioritzats, codi o pautes comprovables i una llista curta d’incerteses que encara requerixen l’humà.


## Taxonomia
- **Categoria:** [[Identitat]]
- **Etiquetes:** [[Graf]]
