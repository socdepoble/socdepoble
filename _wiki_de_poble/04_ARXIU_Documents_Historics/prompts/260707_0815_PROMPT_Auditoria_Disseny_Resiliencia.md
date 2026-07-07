# 🛡️ SUPER PROMPT PER A CODEX (Fase de Resiliència i Disseny)

**OBJECTIU:** Anàlisi de robustesa, control d'errors i preparació per a la Fase de Disseny Visual de *Sóc de Poble*.
**CONTEXT:** Us he adjuntat prèviament el `BUNDLE_Wiki_Completa.md` amb tota l'arquitectura i scripts.

## INSTRUCCIONS PER A CODEX
Deixant de banda l'estructura general (que ja heu auditat), vull que us enfoqueu exclusivament en l'**ESTABILITAT** i el **DISSENY**:

1. **Gestió de Carpetes i Higiene:** Esteu segurs que tots els meus scripts guarden els fitxers on toca? Hi ha algun script que puga vomitar fitxers a l'arrel (`_wiki_de_poble/`) de forma incontrolada?
2. **Resiliència (Error Boundaries):** Tenen els scripts actuals els controls necessaris per no trencar-se? Què passa si un script falla a mitjan camí? Es corromp la Wiki? Quins *guardrails* falten per assegurar que res es trenca quan es produïsca un error imprevist?
3. **Preparació per al Disseny Visual:** Demà començarem amb el disseny visual (CSS, Web Components, Forja). L'arquitectura actual està realment preparada per suportar-ho sense trencar la regla del "Vanilla JS" i el "Pedra Seca"? Què ens falta contemplar per no caure en el parany de la sobre-enginyeria visual?
4. **Codi Proposat:** Doneu-me exactament els blocs de codi per afegir controls de seguretat (try/catch globals, validacions de rutes, rollbacks automàtics) a l'arquitectura del `core/`.

**[FI DE LES INSTRUCCIONS. Sigueu crítics, punitius i exhaustius.]**

---
**Connexions del Node:**
- [[00_INDEX]]
- [[00_BIOS]]
- [[CORE_Registre_Automillora]]
