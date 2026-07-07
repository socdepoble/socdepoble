---
estat: 'canonic'
name: '260619-1430-arquitectura-sistema-nervios'
version: '14.00'
created_at: '260619_1430'
updated_at: '260704_0816'
autor: 'IAIA MarIA'
categoria: 'arquitectura'
description: 'El Sistema Nerviós CRDT i Sincronització (Volum III)'
tags:
  - arquitectura
  - cultura
  - execucio
---
# El Sistema Nerviós: CRDT i Sincronització (Volum III)
**Categoria:** Arquitectura
**Data:** 2026-06-19
**Hora:** 14:30

---

## El repte de la vida en asincronia
Tornem a situar-nos: si el nostre model és **Local-First**, tenim desenes de llauradors moderns apuntant dades al seu telèfon mòbil, estant al tros, sense internet. Un crea un llibre nou a la biblioteca del poble, un altre arregla el pont sud i ho deixa anotat... 
Però, un dia, el diumenge de vesprada, tots dos decideixen apropar-se a la plaça i es connecten al WiFi del casal. Què ocorre si han modificat exactament la mateixa pàgina de cultura popular? I si algú ha esborrat el llibre on l'altre acabava d'afegir un capítol?

En els sistemes antics i jeràrquics, això requeriria un únic servidor dictador central (un Google, per exemple) que s'encarrega d'intentar descobrir qui té la raó i anul·lar la part d'una de les parts. Estem farts d'aquest feudalisme digital.

## L'Harmonia Algorítmica: Els CRDT
Ací brilla la joia tecnològica més apassionant d'aquest ecosistema: Els **CRDT** (*Conflict-free Replicated Data Types*, o en la nostra parla de carrer, "Estructures que no es barallen independentment d'on hagen estat replicades"). Utilitzem específicament el motor anomenat `Yjs`.

Com funciona aquesta màgia invisible? En compte d'ordenar fitxers com pàgines completes de paper on els textos s'amunteguen, el CRDT converteix tota l'aplicació en un historial matemàtic d'events indivisibles i cronològics (A ha afegit una "H", B ha llevat una "l", etc). Donat com estan dissenyades aquestes funcions matemàtiques, l'ordre en el qual un dispositiu que ha estat offline durant setmanes lliura la seua llista de canvis no importa. L'algoritme és literalment capaç d'interlletxar els canvis de tots els usuaris que es troben de sobte a la xarxa **sense necessitat que cap servidor elabore cap resolució de conflictes**. Tothom convergeix miraculosament a un estat unificat i autèntic on tota aportació ha trobat el seu espai.

## L'Enxarxament Descentralitzat (P2P i WebRTC)
Una altra base de l'arquitectura d'aquest Sistema Nerviós de la plaça és com s'entreguen les dades.
A Sóc de Poble aprofitem WebRTC. Ací la xarxa no és una gran corporació en el centre radiant informació a espectadors distants (el model estrella del capitalisme de vigilància).

Sóc de Poble és un eixam verdader (o una formiguera estructurada *Rhizome*): mitjançant **WebRTC**, quan encens el mòbil al casal, el dispositiu del teu amic connectat a la teua cadira li pot passar de manera privada, directa i encriptada els fitxers CRDT pendents d'actualització. Això és coneix com *arquitectura Peer-to-Peer* (D'Igual-a-Igual). 

La conseqüència d'esta filosofia combinant DB's incrustades i transferències p2p via CRDT són meravelloses: no apaguem incendis centralitzats, els apaguem en comú, entre tots. Això suposa un pas gegantí per sobreviure a llarg termini malgrat no tindre ni el poder financer ni el suport d'una mega-corporació sostinguda per dades massives. La dada i la possessió han tornat al poble.


---
## 🔗 Veure també
- Arquitectura Principal

**Sinapsis:** [[00_arquitectura_tecnica_unificada]], 01_arquitectura, [[Arquitectura_General]], [[Arquitectura_Directives]]

