> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/PERPLEXITY_BLUEPRINT_PWA_6.md`

# Blueprint PWA Edge & Cloudflare (Perplexity)
Generado a partir de la auditoría de Perplexity (Iteración 6).

## 1. Configuración de Despliegue Cloudflare (`wrangler.toml`)
```toml
name = "socdepoble-seo"
main = "src/worker.ts"
compatibility_date = "2026-03-30"

routes = [
  { pattern = "socdepoble.com/*", zone_name = "socdepoble.com" }
]

[vars]
ORIGIN = "https://app.socdepoble.com" # Tráfico real
SEO_API = "https://api.socdepoble.com" # Metadata
```

## 2. Worker Avanzado de Protección
```ts
// Se optimiza haciendo un bypass completo (return originRes) si no es Bot ni texto HTML,
// garantizando coste CERO en latencia para la app SPA.
```

## 3. Estado de Conflictos UI (`usePostsStore` en Zustand)
```ts
// Separación maestro de "optimisticPosts" y "conflicts".
// - Si hay conflicto, la mutación se "congela" en el store de conflicts.
// - La cola idb SIGUE VIVA para el resto de acciones de la app.
// Esto evita el efecto embudo.
```

## 4. Forced Updates RPC
```ts
async function forceOverride(conflict: Conflict) {
  // Dispara RPC `force_update_post_mutation` (requiere p_force = true)
  // Al volver sin error, limpia el listado conflict.
}
```

## Veredicto Arquitectónico Final
**idb nativo + RPC** es la decisión definitiva. RxDB añade demasiado bundle y complejidad para el modelo de mutaciones optimistas que manejamos en Sóc de Poble (Server-Smart). El control artesanal sobre `idb` nos da agilidad total.
