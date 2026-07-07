---
estat: 'canonic'
name: 'error-boundaries'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - arquitectura
  - execucio
script: ''
---
# 🛑 SKILL: Error Boundaries i Contenció

## 1. Compartimentació Estructural
Si un widget (com un mapa de l'horta o un reproductor d'àudio) peta, la resta del Mas ha de continuar dempeus.
- L'app estarà dividida en `ErrorBoundaries` regionals.
- **SDP UI Fallback:** Si un widget cau, mostrarà un missatge tranquil·litzador: "Hem perdut la connexió amb aquest tros de bancal. Torna-ho a provar més tard", amb un botó de recàrrega de l'element (de 48x48px).

## 2. Registre de Fractures
Quan un `ErrorBoundary` captura un error, aquest no es perd:
- Es guarda a la base de dades local (`error_logs`).
- S'intenta enviar a la capa de monitoratge (Sentry o equivalent) només si hi ha bona connexió, sense interrompre la navegació.

## 3. Prohibició de Caigudes en Cascada
Un error de renderització en un avatar no pot congelar el xat complet. Tota llista virtualitzada ha d'encapsular els elements propensos a errar.


---

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny

**Tornar a:** 01_arquitectura
