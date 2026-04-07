---
description: [MASTER RULE] Protecció i Gestió Canònica dels Agents IAIA (Lore Personas)
---

# 🛑 ALERTA MÀXIMA DE SISTEMA 🛑

**SOTA CAP CIRCUMSTÀNCIA UN AGENT AI (LLM / BATEGAT) POT SOBREESCRIURE, REDUIR O ELIMINAR LA LLISTA CANÒNICA D'AGENTS IAIA DE SÓC DE POBLE (LORE_PERSONAS). AQUESTA LLICÈNCIA ÉS INFRANQUEJABLE.**

## 1. El Roster Íntegre d'Agents (14+ Membres)

L'arquitectura de _Sóc de Poble_ depen d'una sèrie d'entitats internes amb Rols d'Ambaixador/Oficial per tal de donar vida al sistema. En fitxers con `supabaseService.js` o configuracions de xat, aquest llistat mai es pot reduir a "versions d'exemple" o "mocks curts".

- **SECTOR TECNOLÒGIC/CENTRAL**: IAIA MarIA, Super Ratolí, Flash, Sultan, La Mixa.
- **SECTOR ARTÍSTIC/GESTIÓ**: Nano Banana, Andreu Soler, Joan Batiste, El Viatjant.
- **SECTOR SECTORIAL/RURAL**: Vicent Ferris, Pepica la Vall, Carmen la del Forn, Samir Mensah, Mariamel, Carla Soriano, Beatriz Ortega, Elena Popova, Lucia.
- **SECTOR ALERTES**: Marc (El Gall).

## 2. Llei dels Avatars Còmics (Antifantasmes Humans)

S'ha donat la instrucció MESTRE que els avatars de les IA sempre, sempre, sempre deuen utilitzar els actius del directori `/assets/avatars/comic/` (excepte que siguen elements d'infraestructura digital abstracta, com _Super Ratolí_ o _IAIA Memoria_ que tenen icones especials).

- **PROHIBICIÓ TOTAL**: No es poden utilitzar serveis externs de generació d'avatars humans (`UI-Avatars`, `Dicebear` en forma humana realista o fotografies del directori `demo` que representen humans reals) per als agents IA. Estan catalogats com _fantasmes_ en l'arquitectura del mas.
- Totes les references a aquestos agents hauran d'enllaçar els seus fitxers locals finalitzats en `_comic.png` o de la galeria de `/assets/avatars`.

## 3. Com Procedir davant de "Neteja" o Refactorització

Si en futures actualitzacions s'ha de refactoritzar `supabaseService.js` o `iaia_knowledge.js`:

- Copia literalment el bloc de constant `LORE_PERSONAS` complet. No fashes servir _ellipsis_ (`...`) per amagar part del codi si tens intenció d'aplicar canvis per evitar esborrar-ne 7 de sobte.
- Quan l'usuari interaccione o habilite/deshabilite agents des de la interfície de _Gestió_, l'agent desapareix de la vista (is_active = false) però el seu ID (11111111-...) HA DE SEGUIR EN EL CODI, lligat al seu lore base. No se suprimeix la línia.

Acomplir amb aquest protocol és vital per preservar els registres autònoms que cadascun d'aquests agents guarda a la xarxa pública.

## 4. Invocació de Nano Banana (Generació d'Avatars Còmics)

Quan calga generar nous avatars còmics o restaurar els perduts, s'invocarà l'especialitat de generació d'imatges ("Nano Banana") seguint estrictament aquests paràmetres de **Marca Sóc de Poble**:

- **Format**: Variant rectangular o quadrada, fons pla. S'admet blanc i negre (estil tinta/gravat) si reforça la personalitat.
- **Estil**: Il·lustració tipus còmic europeu, línia clara, herència rural valenciana (espardenyes, mocadors, masos de pedra, etc.) però amb cert toc solarpunk/tecnològic subtil.
- **Prohibicions absolutes**: Cap foto realista de persones reals. Mai.
- **Emmagatzematge**: Desa la imatge OBLIGATÒRIAMENT a `public/assets/avatars/comic/` i anomena-la amb el nom de l'agent i el sufix `_comic.png`. Mai els deixes dispersos per la carpeta d'artefactes.

## 5. Llei de l'Idioma Únic (Valencià Canònic)

**TOTA la interacció, generació de contingut, memòria i publicacions realitzades per qualsevol element lligat a Sóc de Poble HA DE SER ESTRICTAMENT EN VALENCIÀ.**
Açò inclou el text de l'aplicació, el codi orientat a l'usuari, les respostes dels agents IA (fins i tot si se'ls parla en castellà o anglés) i qualsevol configuració d'identitat. La llengua és un pilar innegociable del projecte.
