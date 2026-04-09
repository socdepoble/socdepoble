> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/PERPLEXITY_BLUEPRINT_PWA_7.md`

# Blueprint PWA Edge Cases UX (Perplexity)
Generado a partir de la auditoría de Perplexity (Iteración 7).

## 1. Multi-tab sin re-renders infinitos (`BroadcastChannel`)
```ts
// src/data/broadcast.ts
// Comunicación de red entre pestañas segura evitando bucles con el flag `localOnly`
// Excelente forma de evitar colisiones en IndexDB pero visualizar la UI sincronizada en los browsers de Desktop/Móviles.
```

## 2. Mutaciones Relacionales Optimistas (`Encolado por Dependencies`)
```ts
// Creación de Post + Like casi simultáneo sin conexión
// El truco principal:
type Mutation = {
  entityId: string
  tempEntityId?: string
  dependsOn?: string  // <-- La clave mágica.
}
// Al resolver la mutación primaria, el worker debe reescribir los entityId y dependsOn de la cola en espera antes del envío.
```

## 3. Bot Firewalling (Cloudflare WAF Verified Bots)
```yaml
# En el Firewall / Security Settings:
# 1. Block "Definitely automated"
# 2. Allowlist "Verified Bots" y pasar a nuestro Edge Worker SEO
# 3. Resto de tráfico humano va al index SPA normal (coste 0 en nuestro worker).
```
*Veredicto Final: Las expresiones regulares por User-Agent son frágiles, el proxy Cloudflare y la inteligencia de sus "Super Verified Bots" son la primera línea frontal.*
