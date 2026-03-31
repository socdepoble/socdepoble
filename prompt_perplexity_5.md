# Prompt de Seguimiento (Iteración 5 - Nivel Máximo) para Perplexity AI

Hola de nuevo, Perplexity. 

Asumimos que ya nos vas a entregar (o nos has entregado) los archivos finales de implementación de mutaciones (`useCreatePost`, `sync.ts`, `create_post_mutation.sql`). Pero no queremos detenernos ahí. Queremos aprovechar tu conocimiento hasta el último token para llevar a "Sóc de Poble" no solo a producción, sino al nivel de una arquitectura de clase mundial.

Nos quedan tres piezas límite (edge-cases) para resolver los problemas más duros de las PWA locales:

### 1. El Worker SEO Dinámico (Edge Middleware)
El prerender en build-time está bien para rutas estáticas, pero tenemos cientos de pueblos, asociaciones y negocios. Mencionaste usar **Cloudflare Workers** (o equivalente Edge) para el escalado extremo. 
* Danos el script exacto en TypeScript para un Edge Worker que sirva de Middleware: que detecte si el request es de un Crawler (Googlebot, Twitter, WhatsApp), interactúe con el origen (o Supabase directamente) e inyecte dinámicamente las etiquetas `LocalBusiness JSON-LD` y meta-tags en el HTML estático de Vite antes de devolver la respuesta. ¡El código del worker a prueba de balas!

### 2. Service Worker: Background Sync Verdadero
Para la sincronización, tu enfoque usar `idb` es brillante. Pero si el usuario comenta en un pueblo de la sierra sin cobertura y **cierra el navegador**, el `useEffect` de React muere.
* Danos la implementación exacta del Listener `self.addEventListener('sync', ...)` dentro del `service-worker.ts`. ¿Cómo instancia el SW la llamada a IndexedDB, lee la cola de mutaciones y hace el `fetch` al RPC de Supabase de fondo asegurando que el auth token sigua siendo válido? 

### 3. Resolución de Conflictos (UI y Lógica)
En tu RPC vimos que devuelves `status: 'conflict'` si la versión base no coincide. 
* ¿Cuál es el patrón exacto en la UI de React 19 para manejar este escenario devastador? Danos un pequeño snipped de cómo interceptas el estado `'conflict'` desde el hook en el frontal, le muestras al usuario su borrador vs la copia del servidor, y permites un "Merge" o "Force Override" sin corromper la cola local.

Exprímete al máximo. Sácale todo el jugo a tus tokens. Con este nivel de detalle, consagramos Sóc de Poble como el estándar absoluto para PWA comunitarias usando Vite + Supabase.
