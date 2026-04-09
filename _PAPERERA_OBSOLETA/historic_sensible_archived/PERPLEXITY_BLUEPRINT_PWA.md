> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/PERPLEXITY_BLUEPRINT_PWA.md`

# Blueprint PWA Local-First (Perplexity)
Generado a partir de la auditoría de Perplexity (Iteración 4).

## 1. Hook de Dominio (`useCreatePost.ts`)
```tsx
import { useCallback } from 'react'
import { nanoid } from 'nanoid'
...
// (Ver historial de chat para la implementación completa)
```
*Nota: Este archivo refleja el consumo del hook genérico `useOfflineMutationQueue` con estado optimista manejado vía Zustand o React Query.*

## 2. Service Worker Sync (`sync.ts`)
```ts
/// <reference lib="webworker" />
import { openDB } from 'idb'
...
```
*Nota: Escucha el evento `sync` para vaciar la cola offline interceptando la reconexión de red.*

## 3. SQL Migrations Puras (`create_post_mutation.sql`)
```sql
begin;
create extension if not exists pgcrypto;
...
commit;
```
*Nota: Separar creación de edición para no entorpecer la variable p_base_version en la idempotencia.*
