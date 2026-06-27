---
name: monitoritzacio-rendiment
description: "Alertes automàtiques de RAM i Core Web Vitals per mantindre la termodinàmica del sistema en valors òptims."
authority: "Consell de les 11 IAs"
version: "V21"
---
# ⏱️ SKILL: Monitorització de Rendiment

## 1. Monitorització de RAM (Especial iPad A10)
A causa de l'arquitectura CRDT i la història de tombstones, l'ús de la memòria ha de ser agressivament vigilat.
- Es farà un polling suau usant `performance.memory` (si està disponible) o mètriques delegades.
- **Límit d'Advertència:** 1.2GB. S'activa SOSP-LOCK Nivell 1 i es purguen les estructures UI no essencials.
- **Límit Crític:** 1.5GB. S'atura la sincronització (SOSP-LOCK Nivell 3) per evitar que Safari tanque la pestanya.

## 2. Core Web Vitals (La Fluïdesa del Mas)
- **LCP (Largest Contentful Paint):** La càrrega inicial del mur ha de ser < 2.5 segons.
- **INP (Interaction to Next Paint):** Les pulsacions dels botons (Àrees de 48px) han de tindre un *feedback* visual (com un canvi d'ombra o color) en menys de 200ms, inclús si la xarxa està bloquejada.

## 3. Registre de Sessió Termodinàmica
En finalitzar l'ús de l'app (o per `pagehide`), es guardarà un resum local de l'Entropia dels Tokens i FPS per generar estadístiques setmanals.
