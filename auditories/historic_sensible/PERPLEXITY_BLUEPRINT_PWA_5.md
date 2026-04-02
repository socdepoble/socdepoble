# Blueprint PWA Local-First Edge & UX (Perplexity)
Generado a partir de la auditoría de Perplexity (Iteración 5).

## 1. Cloudflare Edge Worker SEO (`worker.ts`)
```ts
export interface Env {
  ORIGIN: string
}
// Usa HTMLRewriter para interceptar a los bots e inyectar JSON-LD
// LocalBusiness con datos obtenidos al vuelo.
```
*Nota: Sirve únicamente para interceptar Googlebot/Redes Sociales y entregarles HTML riquísimo en SEO sin latencia ni prerender pesado.*

## 2. Background Sync Resiliente (`sync.ts`)
```ts
// Se afina el postMessage al flush de IndexDB.
// Importantísimo: No depende del Token dentro del Worker, lo deriva a la App 
// o reintento de front cuando no lo tiene disponible.
```

## 3. UI Resolution Component (`ConflictBanner.tsx`)
```tsx
export function ConflictBanner(...) {
  // Manejo de 'localDraft', 'serverVersion', y 'baseVersion'
}
```
*Nota: Magnífico diseño donde los conflictos dejan de ser errores asíncronos invisibles y se materializan en UI donde el usuario elige: [Fusionar] [Forzar mi versión] [Conservar Servidor].*
