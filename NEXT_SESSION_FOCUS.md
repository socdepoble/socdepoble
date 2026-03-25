# NEXT SESSION FOCUS (Handoff)

## Estat Actual
### Fites Aconseguides:
1. **Estabilitat de Producció i CI**:
   - Reparació crítica del bucle infinit del Service Worker a `vite.config.js` excloent `coi-serviceworker.js`.
   - Neteja de Lint completada: s'han purgat els errors residuals a `scripts/wikipedia_town_enrichment.js`.
   - L'auditoria local (`npm run lint`) ara passa amb **0 errors**, assegurant la integració contínua sense fallades.

2. **Inici de la Integració NotebookLM**:
   - S'ha desplegat Chrome en mode depurador cap a `notebooklm.google.com` amb el port 9222 obert mitjançant MCP.
   - S'ha implementat l'argument `--disable-blink-features=AutomationControlled` per a eludir el mode de prova automatitzat tàcit de Chrome.

### Següent Prioritat (Sessió Següent):
- **Superar el Login de Google (NotebookLM)**:
  L'accés a NotebookLM actualment demana login. A la propera sessió, l'usuari haurà d'iniciar sessió presencialment en la instància depuradora (o en el seu Chrome habitual prèviament a enganxar el cable MCP) per a deixar el DOM del quadern preparat per a l'anàlisi automatitzada profunda.
