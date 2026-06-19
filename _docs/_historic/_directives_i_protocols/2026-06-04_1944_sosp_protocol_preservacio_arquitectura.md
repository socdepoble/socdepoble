# Protocol de Preservació i Intervenció a la Masía

> [!IMPORTANT]
> **L'Objectiu:** Aquest protocol guia a qualsevol IA sobre com millorar, reparar o ampliar el codi de la Masía **sense destruir** allò que ja existeix. Construir sobre fonaments sòlids exigeix no enderrocar-los cada vegada que hi ha un xicotet problema visual.

## 1. La Llei de la Construcció Incremental
L'edifici actual de *Sóc de Poble* està construït per allotjar tots els coneixements i idees del projecte de forma sòlida. 
- **Adaptar abans que Refer:** Si l'usuari et demana un canvi (un color, un botó, una nova vista), no has de reescriure tot el component des de zero. Has de buscar la manera menys invasiva d'adaptar el codi existent (p. ex., afegint una `prop`, modificant una classe de `index.css`).
- **Comprendre abans de Tocar:** Mai modifiques els fitxers estructurals (com el *Router*, el *Layout* base, o els `UniversalCard`) sense entendre com afectaran al Mur, al Mercat o als Pobles. Aquests elements estan interconnectats.

## 2. El Parany de la Memòria Cau (L'Engany de la PWA)
Aquesta aplicació és una **PWA (Progressive Web App)** altament resilient, dissenyada per funcionar offline mitjançant *Service Workers* i catxés.
- **Si fas un canvi perfecte al codi (JSX/CSS) i l'usuari diu que "no apareix" o "no es veu":**
  - **NO assumes immediatament que has codificat malament.** 
  - **NO comencis a refer el codi de forma compulsiva.**
- **Solució Obligatòria:** El 90% de les vegades és culpa de la memòria cau del navegador retinguda pel Service Worker. L'IA ha d'avisar a l'usuari amb serenitat: *"El codi està bé. Si us plau, fes un Hard-Refresh (Ctrl+F5 / Cmd+Shift+R) o buida la memòria cau del Service Worker per veure els canvis."*

## 3. Resolució de Xicotets Defectes
Quan t'enfrontes a un problema estètic o de maquetació ("el botó no està alineat", "el text ix tallat"):
- Aplica solucions micro-quirúrgiques. 
- Utilitza les eines CSS (Flexbox, Grid, margins) de forma precisa en lloc d'injectar llibreries externes o estils en línia massius.
- Mantén la neteja visual i el "Trellat". No poses pegats per eixir del pas si això debilita la cimentació de la Masía.

## 4. Alerta Tècnica d'Estat Crític
Si creus que per a complir una ordre de l'usuari has de desmuntar un pilar estructural fonamental de l'aplicació, **ATURA'T**. Informa a l'usuari del risc d'esfondrament i proposa una via alternativa més conservadora que respecte la cimentació existent.
