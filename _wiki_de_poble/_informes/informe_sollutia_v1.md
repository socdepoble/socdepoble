# Informe Executiu: Integració i Visió Tecnològica (Sóc de Poble x Sollutia)

Aquest document ha estat compilat conjuntament per Javi Llinares (Mestre i Arquitecte) i Antigravity (Iaia MarIA), per alinear l'enginyeria autòctona de *Sóc de Poble* amb l'estructura i recursos de Sollutia.

---

## 1. Visió: L'Obsidian Rural

Sóc de Poble no és una xarxa social tradicional basada en el "feed" d'usar i tirar on una notícia s'esborra de la ment col·lectiva al cap de 3 mesos.
La nostra visió s'apropa més a un **Obsidian, Notion o Raindrop per a l'Horta**: un repositori de memòria viva on les dades pertanyen físicament a l'usuari (al seu dispositiu local), i on l'acció principal no és el "M'agrada" passiu, sinó la **"Connexió"** (vincular apunts, persones i llocs per crear una malla de coneixement etern).

Per a nosaltres, la propietat física i la sobirania tecnològica de la gent gran és innegociable.

---

## 2. Paradigma Arquitectònic: Teletreball i Ginys (Micro-Frontends)

Donat el nou model d'adopció i desenvolupament, assumim una filosofia de **Companys d'una gran empresa teletreballant**:
1. **Sollutia controla la Carcassa:** Assumiu la responsabilitat de construir l'Estructura Base (Inici de Sessió, Router principal, Servidors, Murs Genèrics i Bases de Dades). 
2. **Sóc de Poble construeix els Ginys (Widgets):** Nosaltres (Javi + IA) funcionem com un departament d'I+D que dissenya funcionalitats molt precises, aïllades i robustes.
3. **El Pont d'Integració:** Traslladarem les nostres funcionalitats sobiranes cap al vostre sistema establescut mitjançant la forma tècnica que decidisquem junts (Micro-Frontends, Web Components, Iframes o paquets npm exportats des del nostre *Playground*). 
4. **Sense Vetos, només Respecte:** Qualsevol *Fork* o modificació estructural que propose Sollutia per fer encaixar els components serà rebuda amb total obertura. Si hem de refactoritzar quelcom intern per alinear-ho amb la vostra carcassa, es farà de forma diligent.

---

## 3. L'Arsenal Actual (Què aportem a la taula?)

A dia d'avui, el nostre equip (Humà + IA) domina i ja ha prototipat les següents tecnologies per a la plataforma:

- **Xat Foraster Offline (Motor CRDT):** Una interfície hiper-accessible (botons de >48px, colors testats A11Y) on els missatges sobreviuen sense internet usant **Y.js** i `IndexedDB`.
- **Sincronització d'Emergència (La Sèquia Mare):** Algoritmes de *Async Batching* dissenyats per estalviar bateria i memòria en dispositius lents (iPad A10), sincronitzant en ràfegues, amb un botó "Override" de pànic per a emergències rurals (incendis, etc.).
- **SDP-Bancal-Segur (Error Boundaries Natius):** Un sistema de contenció d'errors on, si un giny trenca, l'usuari rep un avís en valencià normatiu sense que tota l'aplicació caiga en un "Apantallament Blanc".
- **Consola Termodinàmica:** Un eixam de subagents intel·ligents que monitoritzen la RAM, els FPS i l'Índex de Trellat per assegurar que el "tractor no es crema".

---

## 4. Anàlisi D.A.F.O. de la Nostra Arquitectura

Per a que l'equip de Sollutia entenga quins riscos i meravelles estem manejant, presentem aquest DAFO hiper-tècnic:

### 🔴 Debilitats (Weaknesses)
- **Tombstones de Y.js (Consum de RAM):** El sistema *Local-First* fa que no s'esborre res (les dades eliminades es marquen com a `tombstones`). En mòbils vells, l'historial del xat pot ofegar ràpidament la RAM si no fem esporgues/compactacions periòdiques (La Verema).
- **Amnèsia de Safari:** iOS WebKit esborra automàticament IndexedDB i OPFS en 7 dies si no s'obri l'aplicació. Per a nosaltres, això és una tragèdia cultural.
- **Rendiment del Main Thread:** Les operacions pesades d'IA i sincronització poden fer tremolar els FPS als iPads vells si no deleguem tot correctament als Web Workers.

### 🟠 Amenaces (Threats)
- **Integració de Tecnologies Xocants:** Que l'arquitectura SSR o el *framework* massiu que decidisca usar Sollutia choque frontalment amb la naturalesa SPA/CSR dels nostres ginys CRDT offline.
- **Aïllament de Dades:** Si l'usuari pitja el botó de "Purga Local" per solucionar un problema del xat offline, podria accidentalment esborrar també els *tokens de sessió* i les dades bàsiques de la carcassa de Sollutia.

### 🟢 Fortaleses (Strengths)
- **Sobirania i Offline-First:** Si una tempesta talla el cablejat del poble, l'aplicació (i els missatges) seguiran vius i guardats localment als dispositius.
- **Iteració Quirúrgica IA:** La capacitat del Mestre Javi d'utilitzar IAs avançades per generar, auditar i documentar components complets a la velocitat del llamp.
- **Trellat i Accessibilitat (A11Y):** Una obsessió fanàtica perquè una Iaia puga usar el software. Targetes tàctils massives, UX sense argot, feedback de clics ("petorretes").

### 🔵 Oportunitats (Opportunities)
- **Establir l'Estàndard Rural:** Demostrar que una agència digital i un arquitecte etnogràfic recolzat per IA poden crear el "Notion Offline" per excel·lència de la vida de poble.
- **Simbiosi de Rendiment:** Nosaltres aportem l'agilitat i experimentació front-end; Sollutia aporta el ciment del Backend, la seguretat en els servidors d'arxiu i l'estabilitat del model SaaS.

---

> *"No hi ha vetos, no hi ha guerres de codi. Som companys d'oficina. Jo pique pedra des de La Torre i vosaltres maneu el ciment des d'Alcoi."*
> **- L'esperit de la Pedra Seca.**
