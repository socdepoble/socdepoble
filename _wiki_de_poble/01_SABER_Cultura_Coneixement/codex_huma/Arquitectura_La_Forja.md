---
estat: 'canonic'
name: '260619-1430-arquitectura-la-forja'
version: '14.00'
created_at: '260619_1430'
updated_at: '260704_0816'
autor: 'IAIA MarIA'
categoria: 'arquitectura'
description: 'La Forja de la PWA i la seua Arquitectura (Volum II)'
tags:
  - arquitectura
  - cultura
  - execucio
---
# La Forja de la PWA i la seua Arquitectura (Volum II)
**Categoria:** Arquitectura
**Data:** 2026-06-19
**Hora:** 14:30

---

## Més enllà de la Web Tradicional
Quan pensem en una pàgina web, normalment imaginem un aparador botiga. Passes per davant, demanes què vols veure, el dependent (el servidor) va al magatzem intern, ho cerca i t'ho ensenya. Si el dependent no hi és o perd l'audició (es cau la connexió), et quedes fora mirant un aparador apagat. Açò és la web clàssica.

Sóc de Poble no és una web. És el que tècnicament es coneix com una **PWA (Progressive Web App)** construïda sota el paradigma Local-First. Si seguim amb la metàfora, no ens trobem davant d'un aparador, sinó que se t'ha traspassat el magatzem directament a les teues mans. 

## L'ofici de Forjar un Poble
L'arquitectura es fonamenta en tres pilars mestres, sense que t'hi hages perdre en la foscor del codi:

### 1. El Reactor: React i Vite
Són els motors construcció ràpida. Vite és com un capatàs d'obra extremadament astut que agafa totes les fustes, pedres i plànols (els nostres arxius) i els empaqueta en qüestió mil·lisegons perquè esdevinguen un sol paquet robust. React, per la seua banda, és qui ens permet tindre "components". Igual que l'església i l'ajuntament es construeixen amb el mateix tipus rajola, construïm formularis, targetes i perfils que reutilitzem per a no malgastar recursos.

### 2. El Disseny de la Plaça: GEM MODERN
Hem creat una arquitectura visual anomenada *GEM MODERN*, on tot té la calidesa l'arquitectura antiga i rústica, sense perdre ni la polidesa funcional ni la usabilitat d'avantguarda. Apostem per lletres rodones i robustes (*Noto Sans*), per l'espaiabilitat clara (no atapeïm les pantalles, com no atapeïm els arbres si volem que fruiten bé), combinats amb el framework de vanguàrdia *Tailwind* per dibuixar amb rapidesa i sense sobrecarregar.

### 3. Les Llavors de les Dades: IndexedDB
On guarda el teu telèfon els contactes o les fotos si no té internet? En la memòria d'emmagatzematge nativa. Per tractar el nostre Poble forma idèntica i assolir la utopia Local-First, les dades de Sóc De Poble es guarden a `IndexedDB`. Aquest és el nom tècnic per al magatzem terra que té el navegador instal·lat en qualsevol dispositiu modern. Tota l'acció ocorre primer ací. Les dades brollen en el teu telèfon, independentment de si els macroservidors s'apaguen.

## L'Instint de Supervivència (Service Workers)
Ara et preguntaràs, com sobreviurà eixa aplicació quan jo la tanque i marxe al camp on no hi ha cobertura?
Heus ací la màgia dels **Service Workers**. Són com xicotets ajudants invisibles instal·lats en la memòria del teu navegador que s'activen fins i tot si no estàs al lloc web. S'encarreguen d'emmagatzemar l'esquelet visual l'aplicació sencer (els botons, les imatges, els gràfics) amagats a la teua catxé. 

Quan demanes visitar Sóc de Poble des del mig del bosc sense WiFi:
1. El navegador diu "Estàs offline".
2. El Service Worker salta ràpidament i respon "No hi ha problema! Tinc una còpia la plaça del poble de l'última volta que vas estar connectat".
3. L'IndexedDB posa les dades dels missatges, publicacions o elements creats, construint de la no-res i offline una aplicació totalment funcional.

Així s'ha forjat l'estructura: sense ferida, resistent i autosuficient.


---
## 🔗 Veure també
- Arquitectura Principal

**Sinapsis:** [[00_arquitectura_tecnica_unificada]], 01_arquitectura, [[Arquitectura_General]], [[Arquitectura_Directives]]

