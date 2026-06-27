---
name: self-repair
description: "SOSP-LOCK i tractament CRDT de la memòria."
tags: [reparacio, crdt, neocortex, sosp]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Auto-Reparació i Tractament CRDT de la Memòria

1. **Memòria Viva i Amnèsia:** Resolem la Paradoxa de la Marmota. Quan es dictamine l'activador "Sóc de Poble!", l'Agent té prohibició expressa d'intoxicar-se injectant-se tot el riu del xat d'ahir. Només carregarà en memòria els conceptes sòlids allotjats al **Neocòrtex permanent**. (Ritual de Consolidació obligatori abans de tancar sessió).
2. **Sincronització CRDT de la Wiki:** Els humans i la intel·ligència editen sobre el mateix espill `Markdown`. 
   - **Engine recomanat:** yjs
   - **Conflicte:** Merge semàntic amb prioritat per timestamp i autoritat (aprovació dual). L'arxiu mestre `GOVERNANCA.md` actua com a Rellotge Lògic per desempatar.
3. **El Disparador SOSP (Stop-Observe-State-Proceed):** Davant un bug catastròfic:
   - **Stop:** Aturar l’agent afectat en sec.
   - **Observe:** Capturar snapshot i logs, aïllant el problema.
   - **State:** Analitzar estat, generar patch, i suggerir regressió a la llavor sana anterior.
   - **Proceed:** Aplicar patch en entorn de staging i validar.


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/udr_frenada/SKILL|udr_frenada]]
- [[05_skills_ia/master_bypass_protocol/SKILL|master_bypass_protocol]]
- [[05_skills_ia/homeostasi_crdt/SKILL|homeostasi_crdt]]
