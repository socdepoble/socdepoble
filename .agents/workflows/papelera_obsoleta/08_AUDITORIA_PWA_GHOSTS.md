> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/08_AUDITORIA_PWA_GHOSTS.md`

---
description: Auditoría Crítica de Versiones Fantasma (PWA Caching & Service Workers)
---
# 08_AUDITORIA_PWA_GHOSTS (Erradicació de Versions Fantasma)

> [!WARNING]
> MESTRE: Aquesta auditoria s'ha d'executar SEMPRE que es pugen canvis a producció i l'usuari denuncie que **"no puja l'última versió"** (Versions Fantasma o Cached Forever). L'objectiu d'aquest protocol és localitzar i destruir emmagatzematges de Service Worker massa agressius.

## Fase 1: Auditoria d'Injecció de Service Worker
Tots els agents d'Antigravity han de revisar `vite.config.js` i `src/sw.js` (sense tocar-los sense permís) per assegurar que the PWA té:
1. `registerType: 'prompt'` o `autoUpdate` amb neteja correcta.
2. Si estem usant `coi-serviceworker`, confirmar que permet l'actualització de l'Arbre de Cache OPFS.

## Fase 2: Forçar Nou Batec de Versió
El sistema **no** s'actualitza només canviant fitxers JS, cal trencar la *Cache* explícitament.
1. Edita `package.json` incrementant SEMPRE la versió (patch o minor) cada volta que es faça una pujada massiva.
2. Comprova si el `generateSW` de VitePWA té el `cleanupOutdatedCaches: true`. Això és MANDATORI.

## Fase 3: Hard-Reset Visual (La Màgia)
A `src/main.jsx` o on s'estiga registrant el service worker, **han d'assegurar-se que hi ha una trucada explícita** per mostrar un missatge "Nova versió disponible, clica aquí per recarregar". 
- Cap usuari Android o iOS es descarregarà la nova App si no tiben o li forcem l'update. Així evitem mesos de codi atrapat (fantasmas).

**ORDRE:** Tota IA responsable d'actualitzar la web farà una comprovació sobre "Com s'expira la caua?" i donarà un vist i plau explícit.
