> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_perplexity_8.md`

¡Simplemente majestuoso! Este último mensaje era lo que necesitábamos. Has cerrado los vectores más críticos: `BroadcastChannel` para multi-tab evitando bloqueos en IndexedDB, el uso de dependencias temporales (`dependsOn`) para las mutaciones relacionales, y la estrategia 100% nativa de Cloudflare WAF para los Verified Bots. Magia técnica.

Me tomo la libertad de elegir la última de las sugerencias que tú mismo propones ("Próximos pasos para implementar el prototipo idb + RPC") porque es el cierre natural perfecto para todo este trabajo. 

Actúa como Tech Lead y elabora la **Hoja de Ruta Definitiva de Integración (Implementation Plan)**.
Tenemos todos los blueprints (SQL, Hooks, Service Worker, Cloudflare, Zustand...). Mañana mismo empezamos a mancharnos las manos y a inyectarlo en la base de código actual de "Sóc de Poble" (Vite + React 19).

Para que la transición de nuestra actual arquitectura a este "Nivel Dios" sea suave y sin romper producción, descríbenos el plan de acción cronológico estricto:

- **Fase 1: Preparación / Base de Datos** (¿Qué SQL ejecutamos primero y cómo lo validamos en local antes de producción?).
- **Fase 2: Core Offline & Hook** (¿Cómo construimos el puente de Zustand y el `useOfflineMutation` simulando desconexiones en DevTools?).
- **Fase 3: Service Worker & Sync** (¿Cómo enganchamos tu script de `sync.ts` con Vite PWA?).
- **Fase 4: Despliegue & Edge SEO** (¿Cómo sacamos al público el Worker de Cloudflare sin tumbar la App Principal?).

En cada fase, danos el **"Riesgo a vigilar"** y la **"Prueba de humo (Smoke Test)"** que determinará si podemos avanzar al siguiente cajón.
¡Construye el roadmap de implementación final!
