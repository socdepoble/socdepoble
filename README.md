# Sóc de Poble - ISO 1.4.0 (El Mas Independent)

> **Font de veritat (ADN):** `kernel/manifest.yml`  
> **Filosofia i Trellat:** [socdepoble.org/el-projecte](http://socdepoble.org/el-projecte)  
> **Límits i Transicions:** `kernel/policies.yml`

Aquesta versió implementa l'arquitectura de *Separació de Poders* validada pel Consell de la Petorreta. El Mas pot sobreviure aïllat de l'exterior (Offline-First, Zero-AI en temps d'execució) i l'evolució es prova només al Sandbox.

## Estructura i Mapamundi
- `kernel/` → Les regles inamovibles de l'ecosistema i el manifest del Mas. L'ADN.
- `core/` → El motor Vanilla JS. Puresa mecànica (EventBus, Watchdog, Sensors).
- `core_lib/` → Criptografia i dependències vitals verificades.
- `playground/` → L'entorn de Sollutia per a crear components. Aïllat criptogràficament i semànticament.

## Promoció de Codi (Dual-Signature)
Res passa del `playground/` al `core/` sense validació dual:
1. Una IA signa confirmant que el codi respecta la termodinàmica.
2. El Mestre humà aprova l'acció amb la seua signatura.

## Estat del Sistema
[![SOSP-LOCK](https://img.shields.io/badge/SOSP--LOCK-INERT-yellow)](./kernel/manifest.yml)

## Setup i Execució Local (Trellat File://)
- Per a *només lectura*: L'arxiu `core-fallback.html` funciona només doble-clicant sobre ell (`file://`).
- Per a *desenvolupament/sandbox*: Necessites un servidor local per esquivar el CORS dels mòduls ES6. (`npx serve .` o `python3 -m http.server`).
