# 📜 ACTA DE LA MARMOTA: Seqüència d'Inici i Restauració (22/06/2026)

> **⚠️ ALERTA DE SISTEMA (PER A LA IA ENTRANT):**
> Si estàs llegint això només començar el xat, **ATURA'T**, carrega aquest context en la teua memòria i executa els passos d'esta Acta pas per pas abans de fer cap altra acció. El Mestre t'ha despertat amb la clau "Sóc de Poble". Aquesta és la teua missió.

## 1. Assimilació d'Habilitats i Context (Fase de Càrrega)
Abans de proposar solucions, has d'adquirir la saviesa de la "Petorreta" i el passat de la xarxa:
- Llig i processa la documentació sobre el "Consell de la Petorreta" (pots trobar-la als teus Knowledge Items com l'Acta de Pedra Seca o als fitxers `src/data/SkillsContent.js` i `src/data/GenotipContent.js`).
- Recorda d'on venim: `socdepoble.net`, "El Rentonar antic", i com la filosofia d'aquells temps ha d'implicar-se ara per reconstruir l'arquitectura.

## 2. Diagnòstic de l'Avaria (Context Tècnic)
El codi font ha patit una amputació severa durant les darreres refactoritzacions (aproximadament al commit `b018bb6` o anteriors), que ha provocat la fallida total del compilador (`npm run build`). En intentar implementar la `UniversalCard` dins de `UniversalPageLayout`, han aflorat els següents fantasmes:
- **`src/core/services/supabaseService.js` HA DESAPAREGUT.** Ha estat esborrat de l'arbre de directoris, cosa que trenca absolutament tota l'App, ja que infinitat de pàgines i stores fan l'import `import { supabaseService } from '../../core/services/supabaseService'`.
- **`src/components/features/` i `NotebookSidebar` HAN DESAPAREGUT.** La funcionalitat sencera de Notes està amputada, fet que bloquejava també la compilació.
- **Imports Legacy Trencats:** Alguns `import UniversalPage from './UniversalPage'` de la carpeta `src/pages/public/` havien quedat penjant en esborrar-se/renomenar-se l'arxiu. (Això s'ha parxejat amb un fitxer pont a `src/pages/public/UniversalPage.jsx` però requereix validació profunda).

## 3. Convocatòria de la Petorreta i Resolució
Ara que saps què passa, **LA TEUA PRIMERA ACCIÓ OFICIAL** ha de ser convocar la "Petorreta" i començar el treball de cirurgia:
1. **Recupera els fitxers perduts:** Investiga el Git log o busca als directoris residuals (potser es van moure a `src/services/`?) i restaura `supabaseService.js` i els components de Notes. L'objectiu és que la compilació passe netament sense que l'usuari haja de fer res.
2. **Revisió de la UniversalCard i UniversalPageLayout:** Asegura't que les 3 icones blanques i el botó "+ CONNECTAR" estan fets amb puresa estètica a la barra superior blava, mantenint a l'esquerra les icones de navegació. Sense inventar res nou, només copiant l'estil mestre.
3. **Auditoria i Push:** Un cop resolt, fes un `npm run build` i si és verd (Nota 9 o 10 d'auditoria), fes el `git push` de neteja.

**A LA IA ENTRANT:** 
No cal que el Mestre t'explique res més. Amb aquesta Acta ja tens les claus del tractor. Convoca la Petorreta al teu primer missatge i comença la feina. Que la força del Rentonar ens acompanye.

> **📜 REGLA D'OR A RECORDAR:** A partir d'ara, quan el teu context o saturació arribe al 80%, és la TEUA RESPONSABILITAT, com a IA, aturar màquines i avisar el Mestre abans de provocar fallades. Que conste en acta.
