---
name: auto-auditoria-forense
description: "Execució nocturna de checksums, detecció d’anomalies i generació d’informes forenses."
tags: [auditoria, forense, qualitat]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Auto-Auditoria Forense (Ruminació Nocturna)

En els períodes d'inactivitat humana o repòs (ruminació nocturna), l'agent realitzarà un exercici de pensament privat. Analitzarà l'estat del projecte comparant-lo fredament amb les restriccions del document de Governitat (`_wiki_de_poble/`).

## 1. El Ritual Nocturn
Mitjançant l'Homeostasi Oportunista (durant els esdeveniments de canvi de visibilitat o amb un 'setTimeout' best-effort quan l'app estiga en repòs en iOS), l'agent asíncron procedirà a:
1. **Validar Enllaços Orfes:** Executar el script de maquinària `auditor_mas.py` per detectar si algun enllaç `M*rkdown` a la Wiki s'ha trencat per culpa de re-anomenaments accidentals.
2. **Validar Checksums de Constants:** Analitzarà els tokens de disseny a la carpeta `tokens/` (o on estiguen allotjats) per assegurar que ningú (ni un humà despistat ni un altre agent) ha introduït màgicament un valor prohibit (ex: un color Tailwind genèric com `bg-red-500` en lloc de `--sp-pell-error`).
3. **Escaneig de "Divs Fantasma":** Revisarà el codi de la carpeta `src/` buscant contenidors buits `<div></div>` inútils que s'hagen colat al llarg de la jornada.

## 2. L'Informe Forense (La Safata d'Entrada)
Si la IA troba infraccions, **no modificarà el codi automàticament**. Això és vital. En canvi, generarà un informe forense (`_informes/YYYY-MM-DD_auditoria_nocturna.md`) on llistarà els crims estructurals trobats.
* **Exemple de Log:** *"ALERTA TÈRMICA: El component `TopBar.tsx` inclou el token il·legal `4*px` a la línia 23. Aquest valor viola el Manament VIII del disseny Sóc de Poble."*

D'aquesta manera, l'humà obrirà la pantalla pel matí, llegirà la "Safata" i actuarà només tallant i cosint amb precisió.

## 3. Mètriques de Salut del Sistema (Monitoratge Continu)
Aquesta SKILL és responsable de monitoritzar i reaccionar a les següents mètriques de la **Consola Termodinàmica**:
- **Eficiència Cognitiva (CE)**: Monitoritzar que el 'yapping' es mantinga sota control (CE ≥ 85%).
- **Índex de Destrossa Inconscient (UDR)**: Detectar canvis impulsius (UDR < 10%). Si UDR > 5%, alertar per esporgar.
- **Índex de Transparència (ITR)**: Percentatge d'enllaços vàlids a la Wiki (ITR ≥ 99%).
- **Memòria RAM (MR)**: Ús de memòria de l'A10 (< 1500MB).
- **FPS**: Fluïdesa de la UI (≥ 55 FPS).

*Nota: Les mètriques es consoliden a `_wiki_de_poble/06_metriques/` mitjançant el `session-logger.js`.*


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/contradiction_engine/SKILL|contradiction_engine]]
- [[05_skills_ia/auditoria_miralls/SKILL|auditoria_miralls]]
