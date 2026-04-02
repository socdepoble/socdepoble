# Prompt de Seguimiento (Iteración 2) para Perplexity AI

Hola Perplexity,

Aquí de nuevo el equipo humano y Antigravity. Tu diagnóstico inicial ha sido **brillante y 100% certero**. Nos ha encantado tu enfoque hacia una arquitectura local-first, server-smart y antifragile para 2026. Queremos exprimir al máximo tu conocimiento y bajar esos conceptos teóricos a la **arquitectura real** de nuestro código ("Sóc de Poble").

Nuestro stack exacto es: Vite + React 19 + Supabase + PWA (con Service Workers activos) + Tailwind/M3. **No usamos Next.js**.

Sabiendo esto, te pedimos que nos des el "blueprint" (código de referencia y patrones) para implementar hoy mismo estos 3 pilares que nos has mencionado:

### 1. Offline First y Background Sync Mutante (El verdadero PWA local)
Nos comentaste que el offline no debe ser un parche, sino una ventaja ("cola, sync y resolución de conflictos"). 
* ¿Cómo estructurarías exactamente en React 19 / IndexedDB (o usando herramientas nativas de PWA) una **cola de mutaciones offline** (ej. publicar un post o dar like en el pueblo sin conexión)?
* ¿Cómo diseñarías el Service Worker o el Background Sync para que al volver la conexión lo mande a Supabase sin machacar datos en conflicto? ¡Dame tu patrón en código!

### 2. Equivalente a "Server Actions" en Vite + Supabase
Has mencionado reducir la superficie del cliente y mover lógica sensible al servidor (como los Server Components de Next.js). Puesto que usamos Vite (Single Page App hiper-rápida) junto con Supabase:
* ¿Cuál es el patrón equivalente y más seguro en 2026 para alejar esta lógica del cliente web? ¿Debemos canalizar todas las mutaciones pesadas a través de Supabase RPCs (Postgres Functions) restringidas por RLS, o tirar fuertemente de Supabase Edge Functions como intermediarios seguros? 
* Muestra un pequeño ejemplo arquitectónico de cómo estructurarlo sin engordar innecesariamente el cliente.

### 3. SEO Local Dinámico (JSON-LD Schema) en Vite
El tema del `LocalBusiness` con `JSON-LD` es oro. Dado que somos una SPA/PWA construida con Vite, la carga es en cliente (CSR). 
* ¿Cómo inyectarías de la manera más limpia y favorable para el bot de Google el esquema `JSON-LD` dinámicamente cuando un usuario visita el enlace local directo de un pueblo o negocio? ¿Basta con inyectarlo en `<head>` usando bibliotecas como `react-helmet-async` o sugieres algún setup de Edge SSR o Prerender en el entorno de despliegue para asegurar la indexación?

**Recuerda:** "Sóc de Poble" es local-first, rápido y puro. Exprímete al máximo, danos código, estrategia de 2026 y ayúdanos a clavar este hito pre-producción.

¡Trellat y al lío!
