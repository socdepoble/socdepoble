---
description: 'Recurs intern del sistema: 260626_1800_auditoria_informe_poda_9_divs'
created_at: '260626_1800'
updated_at: '260627_0240'
---
# 📜 Informe de Seguretat: Els 9 Divs Fantasma

Després d'aplicar la **Llei de Protecció Estructural** (filtrant qualsevol atribut com style, ref, onClick, aria, etc.), de 2.592 divs, només queden **9** completament inútils i segurs per esborrar.

Açò demostra que la inmensa majoria dels divs que semblaven inútils realment suportaven el sistema amb  de Pedra Seca.

## Llista dels 9 Absoluts

- **Contenidor de Text Pura** a `src/App.jsx` (Línia 232)
- **Contenidor de Text Pura** a `src/__tests__/accessibility/AppShell.test.jsx` (Línia 16)
- **Contenidor de Text Pura** a `src/__tests__/accessibility/AppShell.test.jsx` (Línia 27)
- **Contenidor de Text Pura** a `src/components/SpriteConsole.jsx` (Línia 52)
- **Contenidor de Text Pura** a `src/components/SpriteConsoleExtended.jsx` (Línia 143)
- **Wrapper HTML (<textarea>)** a `src/components/modals/CreateEventModal.jsx` (Línia 132)
- **Wrapper d'Expressió {}** a `src/components/modals/TownSelectorModal.jsx` (Línia 298)
- **Wrapper d'Expressió {}** a `src/pages/admin/ChatManager.jsx` (Línia 42)
- **Wrapper HTML (<button>)** a `src/pages/auth/Register.jsx` (Línia 542)

---
**Petició d'Acció:** Mestre, puc fulminar estos 9 divs residuals (a màquina o codemod) i donem l'arquitectura per depurada al 100%?


---
## 🔗 Veure també
- [[08_capacitats/auditoria|Auditoria]]
