---
description: Sincronització Automàtica de Diccionaris (Motor Omega Translate)
---
# Sincronització Automàtica de Diccionaris (Motor Omega Translate)

Aquest workflow o protocol permet llançar l'IA (Gemini) per igualar totes les traduccions del projecte usant **`va.json` com a Font de la Veritat (Source of Truth)**.

### Per què utilitzar-lo?
Cada vegada que afegim noves claus (keys) o modifiquem text a l'aplicació, només caldrà canviar-ho al valencià (`va.json`). Després d'executar aquest motor, els arxius de la resta d'idiomes detectaran automàticament les claus faltants i les traduiran sense trencar variables ni l'estructura.

## Requisits
Tens dos opcions per donar-li poder al script:
1. Posar la variable `VITE_GEMINI_API_KEY=AIzaSy...` a l'arxiu `.env` principal.
2. Si la tens a la consola però no a `.env`, pots executar la comanda així: `VITE_GEMINI_API_KEY="AIzaSy..." npm run sync:locales`

## Execució (A Demanda / CRON)

Simplement executa l'script desglossador:

```bash
// turbo
npm run sync:locales
```

L'script s'encarregarà de:
1. Llegir l'arbre sencer de `va.json`.
2. Repassar `es.json`, `en.json`, `gl.json`, i `eu.json`.
3. Fer peticions batch (en blocs de 40) a l'API de Gemini per traduir les diferències exactes mantenint el sentit orgànic (Trellat, Sóc de Poble, Bategats, etc.).
4. Inserir les claus i guardar els fitxers.

> **Avís:** És normal que en cas de mala connexió done un error per Rate Limit, per això l'script té auto-reentrants incorporats.
