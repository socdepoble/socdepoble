# 🛡️ ESTAT ACTUAL: IAIA VOICE & CONSOLE CLEANUP & ROLLBACK CRÍTIC

## Estat de Consciència i Projecció
- **Ultim Handoff:** Bategat completat i sistema protegit.
- **🚨 EMERGÈNCIA ACTUAL:** Durant una intervenció agressiva s'ha esborrat accidentalment el contingut fresc i estable de `ProjectPresentation.jsx` amb la funcionalitat genèsica completa (capítols i editor Tiptap) abans de fer un commit en Git. Es va trencar per complet el sistema de rutes en intentar arreglar col·lisions d'UI. S'ha intentat fer enginyeria inversa des de producció usant mapes font (Sourcemaps) per desminificar el codi, però SiteGround (Vite) no els està publicant per motius de seguretat (torna l'index.html com a fallback).

## ACCIÓ IMMEDIATA REQUERIDA (NOMÉS EL MESTRE POT FER-HO)
**ABANS DE FER RES EN LA NOU SESSIÓ MÚLTIPLE AMB QWEN/DEEPSEEK:**
El Mestre (SuperAdmin) ha d'obrir VS Code i utilitzar la funció **"Timeline"** (Historial Local) per recuperar l'estat original (al volant de 1 o 2 hores abans del desastre) d'aquests arxius:
1. `src/pages/ProjectPresentation.jsx`
2. `src/components/AppLayout.jsx` (si escau)
Una vegada restaurats, feu un `git commit` inmediat i verifiqueu que tot torna a compilar (`npm run dev`). Només aleshores podran entrar els agents auditors.

---

## 2. EL PLA DE BATALLA ORIGINAL (DESPRÉS DEL ROLLBACK):

### A. Neteja Profunda (Console Cleanup)
- [ ] Eliminar els warnings del Service Worker.
- [ ] Ocultar o solucionar els errors de xarxa en els scripts auto-generats.
- [ ] Refinar els logs del `geminiService`.

### B. Reparació del `gemini-proxy` (Accés Universal Controlat)
- [ ] Modificar `gemini-proxy/index.ts` per tolerar usuaris anònims controlats sense petar al `getUser()`.

### C. Protocol "Walkie-Talkie" (Audio Natiu)
- [ ] Convertir el `voiceData.blob` a Base64 en ChatDetail i enviar-ho inline a Gemini.
- [ ] Integrar Text-To-Speech en la IAIA per llegir respostes.

## 🗓️ AGENDA DE MANTENIMIENTO I NOVES FUNCIONALITATS (ANTIGRAVITY)
- [ ] **ESTUDI URGENT DE BACKUPS:** Estudiar i preparar la implementació d'una funció de *Backups* en el Tauler del SuperAdministrador (per previndre desastres com l'actual si passa en producció). 
  - *Investigació pendent:* Comprovar el sistema de còpies diàries natives de SiteGround i explorar com connectar-nos-hi o replicar aquella salvació que oferia a WordPress, incloent múltiples vies de còpia de seguretat redundants (Base de Dades Supabase + Assets de Siteground).
- [ ] **26 de Junio de 2026 (aprox):** Renovar el `GITHUB_PERSONAL_ACCESS_TOKEN` en la configuración de MCP.

**SÓC DE POBLE. LA TÈCNICA AL SERVEI DE LA TERRA.**
