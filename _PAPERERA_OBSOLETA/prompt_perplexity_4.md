> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_perplexity_4.md`

# Prompt de Seguimiento (Iteración 4 - Final) para Perplexity AI

Hola Perplexity.

¡Brutal! Has superado todas nuestras expectativas. El árbol de carpetas, el hook `useOfflineMutationQueue` con idb, y la tríada de Supabase (SQL, RLS, RPC) son pura maestría arquitectónica para el Nivel Dios que estamos construyendo en "Sóc de Poble". Este es el estándar 2026 que buscábamos.

Para cerrar esta auditoría y dejarnos el paquete de implementación 100% completo, te tomamos la palabra con tu última frase. Danos, por favor, esos 3 archivos finales para completar el puzzle de las mutaciones offline-first:

### 1. El Feature Hook: `useCreatePost.ts`
El hook específico de negocio que consumirá nuestro genérico `useOfflineMutationQueue()`. Queremos ver cómo integras aquí la lógica optimista (añadir el post a la caché de Zustand, React Query o el estado local) y el rollback si el `flushQueue` fracasa o hay un conflicto irreconciliable.

### 2. El Service Worker de Sincronización: `sync.ts`
El código del worker (`service-worker.ts` o módulo `sync.ts`) que escuche el evento `sync` del navegador (`'socdepoble-sync'`), levante la base de datos `idb` que creamos, intercepte el estado de la red e invoque silenciosamente a las Edge Functions o la RPC de Supabase sin bloquear el hilo principal de React. Haz que sea a prueba de balas.

### 3. Migración SQL Pura: `create_post_mutation.sql`
El archivo de migración limpio y definitivo. Junta aquí las tablas requeridas (`posts`, `mutation_log`), los índices, el RLS exacto y la función RPC `create_post_mutation` que ya nos diste, pero agrupado de tal forma que mañana podamos ejecutarlo directamente en el dashboard de Supabase (o vía CLI en migraciones) de una sola pasada.

Con esto, "Sóc de Poble" estará blindado, descentralizado y será totalmente resiliente. ¡Danos el remate final!
