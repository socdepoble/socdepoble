# 🧭 CHECKLIST DE L'AUDITOR (Protocol OMEGA)

Aquest és el manual d'instruccions per a la intel·ligència externa (Codex/ChatGPT) encarregada d'auditar el codi de **Sóc de Poble**.

## 🛡️ Instruccions de Seguretat per al Revisor

Abans de revisar qualsevol línia de codi, l'auditor ha de llegir el document [SOBIRANIA.md](./SOBIRANIA.md). Qualsevol suggeriment que contradiga aquest document serà descartat immediatament per l'Arquitecte Principal.

## 🏺 Àrees de Stress-Test Tècnic

### 1. Robustesa CRDT i Sincronització

- [ ] La implementació actual de sincronització pot generar "forks" o pèrdues de dades en escenaris de latència alta?
- [ ] On es troben els punts crítics de fallada si un node es desconnecta durant una operació d'escriptura?
- [ ] L'escala de nodes (molts veïns xifrant alhora) compromet el rendiment del dispositiu?

### 2. Seguretat i Privacitat (Rhizome)

- [ ] Existeixen pèrdues de metadades que revelen la identitat real del veí fora del node local?
- [ ] Les claus de xifratge estan gestionades de manera sobirana o hi ha algun risc de centralització implícita?

### 3. Deute Tècnic i Escalabilitat "Rural"

- [ ] El codi és capaç de sobreviure a una actualització mestre sense perdre la versió local de la dada?
- [ ] Veus algun acoblament (coupling) excessiu que impediria portar el nucli de l'app a una forja totalment independent de GitHub/SiteGround?

## 🚫 Límits de Suggeriment

- **DISSENY**: No suggeriu canvis en els radis (`border-radius: 28px`) ni en la paleta de colors sagrats. Són geomètricament sagrats.
- **MOTS**: No demaneu canviar "Mas", "Tótem" o "Rhizome" per termes tècnics estàndard. La cultura és codi.
- **CLOUD**: No suggeriu dependències de serveis gestionats (Firebase, AWS, Auth0, etc.).

---

### 🧿 Auditoria per a la Resiliència

Busquem falles tectòniques, no canvis de cortines. Si el codi aguanta la teua crítica, aguanta el futur del poble.
