> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_perplexity_3.md`

# Prompt de Seguimiento (Iteración 3) para Perplexity AI

Hola de nuevo, Perplexity.

¡Estás sacando oro puro! Antigravity y el equipo humano estamos encantados con el nivel de concreción arquitectónica que nos estás dando. Nos has convencido totalmente con la separación de responsabilidades: IndexedDB para la cola, Servidor (Edge + RPC) para reglas de negocio, y Service Worker únicamente para transporte. 

Al final de tu anterior respuesta nos hiciste una promesa que queremos cobrar ahora mismo: **"Si queréis, en el siguiente paso os puedo dejar un árbol de carpetas real, un hook `useOfflineMutationQueue()` completo y un ejemplo de tabla Supabase + RPC + policy RLS listo para copiar."**

¡Adelante con ello! Necesitamos que nos despliegues ese "Blueprint" completo para que podamos implementarlo directamente en nuestro entorno Vite + React 19 + Supabase. 

Por favor, inclúyenos:

### 1. El Árbol de Carpetas Real (Local-First en Vite)
¿Cómo estructurarías las carpetas del proyecto para separar limpiamente la gestión de mutaciones locales (IndexedDB), los validadores (Zod schemas), los hooks de UI optimistas y la llamada final al servidor?

### 2. El Hook `useOfflineMutationQueue()` Definitivo
Danos el código completo y listo para producción del hook en React 19. Queremos ver cómo gestionas internamente la cola en IndexedDB (preferiblemente usando `idb`), cómo aplicas UI optimista en el cliente y cómo reintentas automáticamente el envío de la mutación pendiente al volver la conexión (usando el modelo `Mutation` que nos sugeriste).

### 3. La Tríada Supabase: Tabla + RPC + RLS
Tomando como ejemplo la acción de "crear un post" o "añadir un like" hiperlocal:
* El código SQL exacto para la tabla, asegurando la trazabilidad (con versión/timestamp).
* La Política RLS estricta para asegurar que nadie pueda escribir directamente sin pasar por las validaciones.
* La función RPC en PostgresSQL que reciba la mutación idempotente y evite duplicados o resuelva el conflicto de sincronización (`baseVersion`).

### 4. Extra: Prerender SEO para SPAs
Y para rematar el punto clave del SEO que mencionaste: ya entendemos cómo usar `react-helmet-async` para inyectar JSON-LD de tipo `LocalBusiness`. Pero ¿qué herramienta o configuración de *Build/Prerender* recomendarías usar hoy sobre Vite (ej. `vite-plugin-prerender`, Cloudflare Pages / Vercel Edge Cache) para servir estáticamente esas etiquetas SEO al crawler de Google sin tener que migrar toda la app a SSR/Next.js?

Danos tu mejor código y tu mejor criterio. ¡Queremos ver a "Sóc de Poble" funcionando a ese Nivel Dios al que nos estás llevando!
