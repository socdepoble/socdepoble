---
doc_id: SOSP-ACTA-20260615-01
doc_type: "ACTA_SESSIO"
authoring_agent: "Antigravity (La IAIA)"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "03:28"
---

# 🌐 Acta de Sessió Tècnica: Reconstrucció del Mas a "Pedra Seca"

## Resum Executiu
Durant la sessió nocturna del 15 de juny de 2026, s'ha aplicat una guillotina topològica a l'arquitectura de l'App (versió anterior amb components MUI inflats i un SOSPStore que causava cicles infinits de renderitzat al `verifyEvent`). Hem aplanat el disseny fals i inestable, implementant la calca exterior "Pedra Seca" de la PWA que ja funcionava a `socdepoble.org`.

## Intervencions Tècniques Clau

### 1. Eliminació de Brossa (Guillotina)
- S'han esborrat arxius residuals innecessaris i estils `matrioixca.css` defectuosos.
- S'ha rectificat l'ús del `<dialog>` que interceptava tot l'HTML mitjançant un `display: flex !important` nociu. Ara els `<dialog>` natius s'amaguen correctament amb `dialog:not([open]) { display: none !important; }`.

### 2. Reconstrucció de `AppLayout.jsx` (L'Estructura de l'Edifici)
L'arquitectura visual de base s'ha redissenyat per oferir:
- **Escriptori:** Un Sidebar complet a l'esquerra (100dvh) que allotja el logotip, un botó "CONNECTAR" i els 14 enllaços corporatius (`/xat`, `/mur`, `/mercat`, etc.). A la seua dreta, una barra superior per a icones d'estat i finalment el contingut `<Outlet />` complet.
- **Flexibilitat (Lliure Albedrío):** S'ha decidit no "hardcodejar" finestres secundàries al layout base. Pàgines complexes com `/xats` utilitzaran l'espai per partil-lo en dos (Xat + Mapa), mentre que pàgines com `/mur` faran ús del 100% de l'espai dret per a mostrar la graella d'anuncis.
- **Mòbil:** Un Bottom Nav minimalista inferior fixat, on el botó central domina l'espai com d'habitud.

### 3. Connexió Supabase Simplificada
En `/mur` s'ha passat a invocar directament la llista de posts a la taula `posts` mitjançant el client estàndard de Supabase, eliminant la dependència de `SOSPStore` obsolets per recuperar publicacions reals i erradicant els bucles de "Date.now() vs performance.now()".

## Conclusions Tècniques
Hem restablit el punt zero, l'esquelet pur sense animacions ni components complexos. L'arquitectura actual permet injectar les noves "cards" i lògiques modulars (Atomics + Workers) assegurant que no hi ha cap defecte estructural que tapi els continguts de la UI.
El codi està preparat i és completament regalable per l'Escamot Asiàtic o qualsevol Mestre que ho necessite per la propera sessió.
