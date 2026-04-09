> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/PERPLEXITY_ROADMAP_FINAL.md`

# Blueprint PWA Roadmap de Implementación (Perplexity)
Generado a partir de la auditoría de Perplexity (Iteración 8).

## Fase 1: Preparación / Base de Datos
- **Misión:** Migraciones SQL de `mutation_log` y RLS blindado para los posts.
- **Validación:** Comprobar la función RPC que maneje idempotencia sin romper la app.

## Fase 2: Core Offline & Hook (Zustand + idb)
- **Misión:** Crear `mutation-queue.ts` con idb nativo y el canal multi-tab `BroadcastChannel`.
- **Validación:** Comprobar modo offline puros y actualizaciones entre pestañas.

## Fase 3: Service Worker & Sync
- **Misión:** Acoplar `vite-plugin-pwa` para interceptar background sync.
- **Validación:** Comprobar que cerrar el navegador reintenta el flush de `idb`.

## Fase 4: Despliegue & Edge SEO
- **Misión:** Cloudflare Worker de interceptación de bots (`HTMLRewriter`).
- **Validación:** Validar simulación de googlebot y tráfico puro humano.

## Fase 5: Iteración UX
- **Misión:** Poner en producción en `Sóc de Poble` el `ConflictBanner` visual.
