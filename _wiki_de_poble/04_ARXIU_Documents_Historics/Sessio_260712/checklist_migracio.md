---
estat: "arxivat"
tipus: "acta"
description: "Document sobre «CHECKLIST DE MIGRACIÓ (PEDRA SECA)»."
---
# CHECKLIST DE MIGRACIÓ (PEDRA SECA)

> **Regla d'or**: Mai portar res que no es puga explicar línia per línia. Zero residu.

## 1. Fase d'Extracció i Neteja
- [ ] **Dades aïllades**: Extreure contingut (textos, JSON, arrays) lliure de marcatge HTML antic.
- [ ] **Lògica aïllada**: Extreure funcions (cerques, filtres) assegurant que siguen pures (sense mutar el DOM ni utilitzar efectes secundaris innecessaris).
- [ ] **Brossa eliminada**: CSS antic, classes velles, event handlers heretats ignorats o destruïts.

## 2. Fase de Reconstrucció (La Vista)
- [ ] **Ús exclusiu de UniversalComponents**: Mapejar la UI només cap a `UniversalPage`, `UniversalCard`, `UniversalButton`.
- [ ] **Estils restringits**: Cap CSS heretat. Si cal disseny, usar variables globals de Pedra Seca (`#131313`, `#ffb68f`).

## 3. Duana d'Accessibilitat i Rendiment (WCAG 2.5.8 i iPad A10)
- [ ] **Mida de Diana (WCAG 2.5.8)**: Tota àrea interactiva (botons, targetes clicables) té un mínim de `48x48px` o `24x24px`.
- [ ] **Focus Visible**: Zero `outline: none`. Tots els interactius tenen focus visible de `2px solid #ffb68f` i responen a `Enter`/`Space`.
- [ ] **Prohibit Backdrop-Filter**: Sense `backdrop-filter` o `blur` (causa cracs a la GPU WebKit de l'iPad A10).
- [ ] **Prohibit Renders Innecessaris**: Profunditat de DOM ≤ 7. Sense `&&` per a condicionals; usar fragments `<>...</>`.
- [ ] **Proves d'Estrès**: Comprovació manual del teclat (`Tab` i `Enter`).

## 4. Ledger
- [ ] **Registre de la Funcionalitat**: Afegir línia a `MIGRACIO_LEDGER.md` (origen → destí, data, gates passats).