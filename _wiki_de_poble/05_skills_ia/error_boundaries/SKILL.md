---
name: error-boundaries
description: >-
  Contenció d'errors a la UI mitjançant Web Components natius (<sdp-bancal-segur>) per evitar
  l'apantallament blanc de la mort. Eradicació de React Error Boundaries.
authority: Consell de les 11 IAs
version: V21
created_at: '260628_0525'
updated_at: '260628_1618'
---
# 🛑 SKILL: Error Boundaries i Contenció

## 1. Compartimentació Estructural
Si un widget (com un mapa de l'horta o un reproductor d'àudio) peta, la resta del Mas ha de continuar dempeus.
- L'app estarà dividida en Web Components regionals natius (`<sdp-bancal-segur>`). Està estrictament prohibit usar *React Error Boundaries*.
- **SDP UI Fallback:** Si un widget cau, mostrarà un missatge tranquil·litzador: "Hem perdut la connexió amb aquest tros de bancal. Torna-ho a provar més tard", amb un botó de recàrrega de l'element (de 48x48px).

## 2. Registre de Fractures
Quan un `<sdp-bancal-segur>` captura un error, aquest no es perd:
- Es guarda a la base de dades local (`error_logs`).
- S'intenta enviar a la capa de monitoratge (Sentry o equivalent) només si hi ha bona connexió, sense interrompre la navegació.

## 3. Prohibició de Caigudes en Cascada
Un error de renderització en un avatar no pot congelar el xat complet. Tota llista virtualitzada ha d'encapsular els elements propensos a errar.

- [[00_index|Índex Central]]
