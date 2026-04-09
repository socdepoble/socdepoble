> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/SEED_MANIFEST.md`

# 🌰 SEED MANIFEST (Sóc de Poble)
*El Codi Genètic per a l'Auto-replicació dels Pobles*

Aquest manifest és la llavor fundacional dissenyada perquè qualsevol poble, barri o col·lectiu pugui instanciar el seu propi "Sóc de Poble". No és només codi, és el "Trellat" paquetitzat per a la sobirania tecnològica.

## 🧬 1. L'Objectiu de la Llavor
Sóc de Poble neix com a plataforma open-source, offline-first i hyper-local. La Llavors ha de garantir:
- **Resiliència:** Funcionar 100% autònom sense internet (PWA, Service Workers, indexedDB).
- **Sobirania:** Dades xifrades en local i P2P.
- **Accessibilitat:** Arquitectura Nivel Dios, UI tàctil, alt contrast, geometria M3 (28px de ràdio).
- **No-Mercantilització:** Lliure d'algoritmes d'atenció, publicitat i trackers.

## 🧱 2. Arquitectura Base (Tech-Huerta V12/V14)
- **Frontend Core:** React + Vite PWA + Tailwind CSS.
- **Motor de Dades (Rhizome):** Sincronització CRDT local-first (RxDB o Yjs equivalent).
- **Xarxa:** P2P, WebRTC o relays minimalistes quan hi ha internet.
- **Capes de Vistes:** Vistes "Ghost-free", zero *Layout Thrashing*, ús estricte de `flex-1 min-h-0` i `padding-safe-area`.
- **Integració de IAIA:** Capes lògiques amb models locals i d'inferència de suport (Llama/Mistral compactes) per preservar la identitat local.

## 🎨 3. Còdex Visual (GEM MODERN)
El manifest disseny i branding és modular.
- **Colors Base:**
  - Plom, Sutge, Blanc Neus.
  - El "Accent Primary" (`var(--theme-accent-primary)`) ha de ser adaptable per cada poble (per defecte: `Boina Taronja #F97316`).
- **Tipografia:** `Noto Sans` forçat per evitar contaminacions Serif als web-views d'Android/iOS. UI sans-serif estricte.
- **Geometria:** Tot l'arc interfície respira "poble" però amb tecnologia estel·lar (`border-radius: 28px/24px`).

## 🌱 4. Procés de Desplegament d'un Nou Poble
1. **Fork del Mas Digital:** Clonar i personalitzar variables d'entorn d'identitat (`VITE_POBLE_NAME`, `VITE_POBLE_COLOR`).
2. **Generació d'Assets:** Iconografia adaptativa autogenerada per manifest PWA en mode local-first.
3. **Instanciació Zero-Config:** Execució d'un `npm run seed:init` que autoconfigura el PWA, xifrats TLS locals i Service Workers.
4. **Desplegament i Lliurament:** L'App es pot distribuir com a APK lleuger, per domini descentralitzat, IPFS, o PWA "Add to Homescreen" via codis QR a l'Ajuntament.

> *La força no resideix en tindre molts usuaris a un sol servidor, sinó en tenir milers de servidors (les persones) que comparteixen el mateix batec.*
