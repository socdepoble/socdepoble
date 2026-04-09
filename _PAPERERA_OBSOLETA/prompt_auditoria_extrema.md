> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_auditoria_extrema.md`

# AUDITORÍA EXTREMA DE ARQUITECTURA RED TEAM (Contexto Completo)
**Instrucciones exclusivas para IAs con inmensa ventana de contexto (Gemini 1.5/2.0 Pro, Qwen Max, Claude 3.5 Sonnet):**

Actúa como un **Staff Principal Engineer** experto en ciberseguridad, arquitectura Offline-First, React 19, Supabase RLS y custom Service Workers.
Tu objetivo hoy no es aplaudir este diseño, sino **DESTRUIRLO**. Buscamos el 10/10 absoluto en resiliencia antes de aplicar ninguna capa de diseño UI visual. Sé implacable, escudriña buscando race conditions, deadlocks, fugas de memoria, variables huérfanas, inyecciones XSS latentes, WAF bypass, y problemas en la separación atómica.

## Contexto del Sistema
Sóc de Poble es una PWA comunitaria rural. Ha migrado a una arquitectura Local-First. Las escrituras (ej. likes, posts) van a IndexedDB (idb), y se vacían hacia RPCs protegidos por RLS en Postgres, usando `mutation_log` para lograr idempotencia estricta. La sincronización multi-pestanya se maneja con BroadcastChannel y Zustand. El Edge SEO se hace vía Cloudflare Worker.

## Puntos Críticos a Destrozar:
1. **Idempotencia SQL y RLS:** ¿El RPC tiene fisuras lógicas por las transacciones de Supabase? ¿Si el JWT está caducado, la interfaz lo sabrá gestionar sin explotar la cola?
2. **Ciclo de Vida PWA y SW:** Delegar el background sync al cliente abierto. ¿Qué pasa si el cliente navega en medio del proceso?
3. **IndexDB y Cuellos de Botella:** Uso de idb. ¿Fallos de promesas anidadas? ¿Transacciones bloqueantes en la cola? Asume conexiones 3G paupérrimas.
4. **React 19, Zustand y Multi-Tabs:** Evadir cascadas de renders inútiles, fugas del BroadcastChannel, re-suscripciones mortales que pisen el estado "optimistic".
5. **Separación Atómica y Deuda UI:** Acabado de componentes: ¿Se están mezclando conceptos de dominio con vista? 
6. **Edge WAF Bypass:** HTMLRewriter interceptando User-Agents. ¿Vulnerabilidades de DoS o falsificación de metadata?

A continuación te paso **CÓDIGO EN CRÍTICO EN CRUDO** de los huesos de la arquitectura.
Analízalo bloque por bloque.

## BASE DE DATOS Y RLS
```sql
// supabase/migrations/20260330230000_pwa_mutation_log_and_posts.sql
begin;

-- Extension needed for gen_random_uuid
create extension if not exists pgcrypto;

-- 1. Create mutation_log table
create table if not exists public.mutation_log (
  op_id uuid primary key,
  user_id uuid not null references auth.users(id),
  entity text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

-- Index for querying user mutations
create index if not exists mutation_log_user_id_idx on public.mutation_log (user_id);
create index if not exists mutation_log_created_at_idx on public.mutation_log (created_at desc);

-- RLS for mutation_log
alter table public.mutation_log enable row level security;

-- Policies for mutation_log (Deny by default active)
drop policy if exists mutation_log_insert_own on public.mutation_log;
create policy mutation_log_insert_own
on public.mutation_log
for insert
with check (auth.uid() = user_id);

drop policy if exists mutation_log_select_own on public.mutation_log;
create policy mutation_log_select_own
on public.mutation_log
for select
using (auth.uid() = user_id);

-- 2. Add mutation tracking columns to posts if they do not exist
-- 'last_mutation_id' allows us to link the version evolution of a row directly to the outbox mutation
alter table public.posts 
  add column if not exists version integer not null default 1,
  add column if not exists last_mutation_id uuid;

-- We don't enforce foreign key for last_mutation_id in case we purge logs, but it's optional

-- 3. The RPC for idempotent post creation
drop function if exists public.create_post_mutation;

create or replace function public.create_post_mutation(
  p_op_id uuid,
  p_base_version integer,
  p_payload jsonb
) returns json
language plpgsql
security definer -- Se ejecuta con privilegios para saltar RLS si inserta y chequea
set search_path = public
as $$
declare
  v_post_uuid uuid;
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  
  -- Required auth check (we are in security definer, so we must enforce auth manually)
  if v_user_id is null then
    return json_build_object('status', 'error', 'message', 'Unauthorized');
  end if;

  -- 1. Idempotency check 
  if exists (select 1 from public.mutation_log where op_id = p_op_id) then
    return json_build_object('status', 'ignored', 'reason', 'already_applied');
  end if;

  -- Extract UUID if sent from client (tempId or final UUID), else generate one
  v_post_uuid := coalesce((p_payload->>'uuid')::uuid, gen_random_uuid());

  -- 2. Insert the post (mapping payload to columns based on Sóc de Poble schema)
  insert into public.posts (
    uuid,
    author_user_id,
    author,
    content,
    town_uuid,
    version,
    last_mutation_id
  )
  values (
    v_post_uuid,
    v_user_id,
    p_payload->>'author',
    p_payload->>'content',
    (p_payload->>'town_uuid')::uuid,
    p_base_version + 1,
    p_op_id
  );

  -- 3. Log mutation
  insert into public.mutation_log (op_id, user_id, entity, entity_id)
  values (p_op_id, v_user_id, 'posts', v_post_uuid);

  return json_build_object('status', 'success', 'uuid', v_post_uuid);
exception when others then
  return json_build_object('status', 'error', 'message', sqlerrm);
end;
$$;

commit;
```

## ESTADO GLOBAL Y SINCRONIZACIÓN
### src/domain/posts/usePostsStore.ts
```typescript
import { create } from 'zustand';

export interface Post {
  id?: string | number;
  uuid: string;
  content: string;
  author: string;
  author_user_id: string;
  town_uuid: string;
  created_at?: string;
  isOptimistic?: boolean;
  hasConflict?: boolean;
}

interface PostsState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addOptimisticPost: (post: Post) => void;
  confirmPost: (tempId: string, finalPost: Post) => void;
  markConflict: (tempId: string) => void;
  removePost: (id: string) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  
  addOptimisticPost: (post) => set((state) => ({
    posts: [{ ...post, isOptimistic: true, created_at: new Date().toISOString() }, ...state.posts]
  })),

  confirmPost: (tempId, finalPost) => set((state) => ({
    posts: state.posts.map(p => 
      p.uuid === tempId || p.id === tempId ? { ...finalPost, isOptimistic: false, hasConflict: false } : p
    )
  })),

  markConflict: (tempId) => set((state) => ({
    posts: state.posts.map(p =>
      p.uuid === tempId || p.id === tempId ? { ...p, hasConflict: true } : p
    )
  })),

  removePost: (id) => set((state) => ({
    posts: state.posts.filter(p => p.uuid !== id && p.id !== id)
  }))
}));
```
### src/data/broadcast.ts
```typescript
// src/data/broadcast.ts
export type TabMessage =
    | { type: 'POST_CREATED', payload: { tempId: string, post: any } }
    | { type: 'POST_LIKED', payload: { postId: string, delta: number } };

const channel = new BroadcastChannel('socdepoble_sync');

export function broadcastMutation(msg: TabMessage) {
    channel.postMessage(msg);
}

export function subscribeToMutations(callback: (msg: TabMessage) => void) {
    const handler = (event: MessageEvent) => callback(event.data);
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
}
```

## COLA OFFLINE Y CUSTOM HOOKS
### src/data/offline/mutation-queue.ts
```typescript
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'socdepoble_offline';
const STORE_NAME = 'mutation_queue';

export type Mutation = {
  id: string; // The mutation op_id (gen_random_uuid in JS)
  entity: string; // e.g., 'posts', 'likes'
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  dependsOn?: string; // UUID of a parent mutation
  createdAt: number;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

export async function initDB() {
  // Only initialize in browser environment to avoid SSR crashes
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function enqueueMutation(mutation: Mutation) {
  const db = await initDB();
  if (db) await db.put(STORE_NAME, mutation);
}

export async function getPendingMutations(): Promise<Mutation[]> {
  const db = await initDB();
  if (!db) return [];
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return store.index('createdAt').getAll(); // Return ordered by time
}

export async function removeMutation(id: string) {
  const db = await initDB();
  if (db) await db.delete(STORE_NAME, id);
}

export async function markMutationFailed(id: string, error: string) {
  const db = await initDB();
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const mutation = await store.get(id);
  if (mutation) {
    mutation.failed = true;
    mutation.errorDesc = error;
    await store.put(mutation);
  }
}

export async function clearQueue() {
  const db = await initDB();
  if (db) await db.clear(STORE_NAME);
}
```
### src/hooks/useOfflineMutationQueue.ts
```typescript
import { enqueueMutation, clearQueue } from '../data/offline/mutation-queue';
import { broadcastMutation } from '../data/broadcast';

export function useOfflineMutationQueue() {

  const addMutation = async (entity: string, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any) => {
    // Use standard crypto if available locally to generate consistent tempIds
    const tempId = payload.uuid || payload.id || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'temp-' + Date.now());
    
    // 1. Build outbox mutation
    const mutation = {
      id: tempId,
      entity,
      action,
      payload: { ...payload, uuid: tempId },
      createdAt: Date.now()
    };

    // 2. Persist to IndexedDB Outbox
    await enqueueMutation(mutation);

    // 3. Broadcast for optimistic UI in other tabs
    if (entity === 'posts' && action === 'CREATE') {
      broadcastMutation({ type: 'POST_CREATED', payload: { tempId, post: mutation.payload }});
    }

    // 4. Force Background Sync immediately (if online/supported)
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SYNC_MUTATIONS' });
      } else if (navigator.serviceWorker && 'controller' in navigator.serviceWorker) {
        // Fallback or explicit SW registration triggering if needed
        navigator.serviceWorker.ready.then((reg: any) => {
          if (reg.sync) {
            reg.sync.register('sync-mutations').catch(console.warn);
          }
        });
      }
    } catch (e) {
      console.warn('Background sync trigger failed, leaving in queue', e);
    }

    return tempId;
  };

  // Useful for debug / cleanup
  const resetQueue = async () => {
    await clearQueue();
  }

  return { addMutation, resetQueue };
}
```

## PORTAL SERVICE WORKER Y EDGE SEO
### vite.config.js
```typescript
```
### src/workers/service-worker.ts
```typescript
```
### src/workers/seo-edge-worker.ts
```typescript
```
### wrangler.toml
```typescript
```

## UI - CONFLICT BANNER Y FEED MAIN COMPONENT
### src/components/ConflictBanner.tsx
```tsx
import React from 'react';
import { usePostsStore } from '../domain/posts/usePostsStore';

export default function ConflictBanner() {
  const posts = usePostsStore((state) => state.posts);
  const conflicts = posts.filter((post) => post.hasConflict);

  if (conflicts.length === 0) return null;

  return (
    <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-md">
      <div className="flex flex-col gap-2">
        <h3 className="text-red-400 font-bold text-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sincronització interrompuda
        </h3>
        <p className="text-red-200/90 text-sm">
          Tens {conflicts.length} publicació/ns que no s'han pogut enviar per un conflicte amb el servidor.
        </p>
        <div className="mt-2 flex flex-col gap-3">
          {conflicts.map((post) => (
            <div key={post.uuid} className="bg-black/20 p-3 rounded-lg flex items-center justify-between gap-4">
              <p className="text-sm text-gray-300 truncate flex-1 block">
                "{post.content}"
              </p>
              <div className="flex gap-2 shrink-0">
                <button 
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-semibold rounded-lg transition-colors border border-red-500/30"
                  onClick={() => {
                    // Acción para reintentar (por implementar: read from idb and push to queue again)
                    console.log('Reintentar', post.uuid);
                  }}
                >
                  Reintentar
                </button>
                <button
                  className="px-3 py-1.5 text-gray-400 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                  onClick={() => {
                    // Acción para descartar
                    usePostsStore.getState().removePost(post.uuid);
                  }}
                >
                  Descartar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```
### src/components/Feed.jsx
```tsx
import React, { useState, useCallback, useEffect, useRef, useTransition } from 'react';
import ConflictBanner from './ConflictBanner';
// CACHE BUST SW: Evasió profunda de la catxé del ServiceWorker per forçar re-render del Mur
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, IAIA_ID, CREATOR_EMAILS } from '../constants';
import { logger } from '../utils/logger';
import PostSkeleton from './Skeletons/PostSkeleton';
import StatusLoader from './StatusLoader';
import SEO from './SEO';
import UniversalCard from './UniversalCard';
import ContextualHeader from './ContextualHeader';
import { useFeedData } from '../hooks/useFeedData';
import { useFeedFilters } from '../hooks/useFeedFilters';
import { useIAIAAutonomousInteractions } from '../hooks/useIAIAAutonomousInteractions';
import { useViewMode } from '../hooks/useViewMode';
import { UniversalGridWrapper, UniversalGridRow } from './UniversalGrid';

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false, externalViewMode = null }) => {
    const { iaiaLevel, gloveMode } = useDesign();
    const { selectedTown, enabledAgentIds } = useNavigation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    
    const activeTown = townId || selectedTown;

    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(
        () => localStorage.getItem('isIAIAFiltering') === 'true'
    );
    const { viewMode, setViewMode, columnCount, containerRef, effectiveViewMode } = useViewMode('feed_view_mode', 'grid', externalViewMode);
    
    const [contextualSearchTerm, setContextualSearchTerm] = useState('');

    const handleStorageChange = useCallback((e) => {
        if (e.key === 'isIAIAFiltering') {
            setIsIAIAFiltering(e.newValue === 'true');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleStorageChange]);

    const {
        posts,
        setPosts,
        userConnections,
        loading,
        error,
        hasMore,
        loadingMore,
        fetchPosts
    } = useFeedData({ activeTown, townName, customPosts, isPlayground, user, iaiaLevel, selectedRole: 'tot' });

    useEffect(() => {
        if (authLoading || customPosts) return;
        const controller = new AbortController();
        
        fetchPosts(false, controller.signal);
        
        return () => {
             controller.abort();
        };
    }, [fetchPosts, authLoading, customPosts]);

    useIAIAAutonomousInteractions({ isPlayground, isSuperAdmin, setPosts });

    const filteredPosts = useFeedFilters({
        posts,
        contentMode,
        iaiaLevel,
        enabledAgentIds,
        selectedTag,
        contextualSearchTerm,
        isIAIAFiltering,
        activeTown,
        userConnections
    });

    const [, startTransition] = useTransition();
    const activePosts = filteredPosts;

    const rowCount = Math.ceil(activePosts.length / columnCount);


    const parentRef = useRef(null);
    const getScrollElement = useCallback(() => {
        if (!hideHeader) return parentRef.current;
        if (typeof window === 'undefined' || !parentRef.current) return null;
        // Quan està incrustat (hideHeader=true), busca el contenidor de scroll pare més proper
        const scroller = parentRef.current.closest('.profile-scroll-container, .main-viewport');
        return scroller || parentRef.current;
    }, [hideHeader]);
    const estimateSize = useCallback(() => effectiveViewMode === 'list' ? 120 : (effectiveViewMode === 'single' ? 600 : 900), [effectiveViewMode]);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement,
        estimateSize,
        overscan: 5,
        onChange: (instance) => {
            const lastIndex = instance.getVirtualItems().at(-1)?.index ?? 0;
            if (lastIndex > rowCount - 10 && hasMore && !loadingMore) {
                startTransition(() => {
                    fetchPosts(true);
                });
            }
        }
    });

    useEffect(() => {
        rowVirtualizer.measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, activePosts.length, columnCount]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        if (post.author?.toLowerCase().includes('sóc de poble') ||
            post.author_name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'mock-business-sdp-1' ||
            targetId === 'socdepoble') {
            navigate('/entitat/socdepoble');
            return;
        }

        if (post.author_role === USER_ROLES.AMBASSADOR || post.author_is_ai || post.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }

        navigate(`/${type}/${targetId}`);
    }, [navigate]);

    const renderPost = useCallback((post) => {
        const pid = post.uuid || post.id || `post-fallback-${Math.random().toString(36).substring(2, 9)}`;
        const isOptimistic = post.metadata?.isOptimistic;
        const isDissolving = post.metadata?.isDissolving;

        const headerTitle = (post.author === 'Algú del poble' || !post.author)
            ? (((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : []).includes(post.author_email)) ||
                ['25218ea4-5d7d-4db4-bdc5-7ae035629242', '333bd9f1-21ab-41fe-b856-2340ce6dc96c', 'a11ac111-eec1-4111-b111-000000000013', 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0', '031adc10-ce8c-4ec9-8672-330473033a91', '11111111-0000-0000-0000-000000000001'].includes(post.author_user_id)
                ? post.author_name || (
                    post.author_user_id === '333bd9f1-21ab-41fe-b856-2340ce6dc96c' ? 'Lidia Espí' :
                        post.author_user_id === 'a11ac111-eec1-4111-b111-000000000013' ? 'Anna Climent' :
                            post.author_user_id === 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0' ? 'Damià Llorens' :
                                post.author_user_id === '031adc10-ce8c-4ec9-8672-330473033a91' ? 'Nando Llinares' :
                    'Javi Llinares'
                )
                : 'Gent de la Torre')
            : (post.author?.name || post.author);

        const rawTown = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';
        const headerSubtitle = rawTown;

        const postImage = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.coverImage);
        const hasNoImage = !postImage;
        const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

        // Logic to resolve the correct Title for the post avoiding generic fallback or author name repetition
        const extractedTitle = post.title || 
                               (post.content ? post.content.split('\n')[0].replace(/^[#*\s]+/, '').trim() : null) || 
                               'Actualitat del Poble';
        const displayTitle = extractedTitle.length > 80 ? extractedTitle.substring(0, 80) + '...' : extractedTitle;

        return (
            <div key={pid} className={`card-rizoma-wrapper animate-in ${isDissolving ? 'dissolve' : ''} w-full h-full`}>
                <UniversalCard
                    item={post}
                    avatarName={headerTitle}
                    title={displayTitle}
                    subtitle={headerSubtitle}
                    image={hasNoImage ? cinematicPlaceholder : postImage}
                    onHeaderClick={() => handleHeaderClick(post)}
                    mode="mur"
                    viewMode={effectiveViewMode}
                    className={`universal-card-virtual ${isOptimistic ? 'optimistic' : ''} ${post.is_iaia_inspired ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
                    variant={post.type === 'bando' ? 'ajuntament' : (post.type === 'tramit' ? 'mur' : (post.type === 'mercat' ? 'mercat' : 'post'))}
                >
                    {post.is_iaia_inspired && (
                        <div className="iaia-transparency-genesis mt-2 mb-1">
                            <div className="flex items-center gap-1 font-black text-[12px] text-cyan-400">
                                <Sparkles size={12} /> IAIA + VEÍ [MASTER]
                            </div>
                        </div>
                    )}
                </UniversalCard>
            </div>
        );
    }, [gloveMode, handleHeaderClick, effectiveViewMode]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#0e0e0e] relative overflow-hidden items-center justify-center p-8">
                <Loader2 className="animate-spin text-[#F97316]" size={48} strokeWidth={2.5} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#0e0e0e] relative overflow-hidden items-center justify-center p-8">
                <p className="font-['Plus_Jakarta_Sans'] text-[#EF4444] text-center font-bold mb-4">{t('feed.error_loading') || 'Error de càrrega'}</p>
                <StatusLoader type="error" message={error} onRetry={() => fetchPosts()} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0e0e0e] relative overflow-hidden font-['Plus_Jakarta_Sans'] w-full">
            <SEO
                title={t('mur.title') || 'El Mur'}
                description={t('mur.description') || 'Connecta amb la teua comunitat i descobreix les darreres novetats del teu poble.'}
                image="/og-mur.png"
            />

            <h1 className="sr-only">Mur d'Activitat i Notícies de Sóc de Poble</h1>

            {!hideHeader && (
                <div className="flex-none w-full z-dropdown">
                    <ContextualHeader
                        searchTerm={contextualSearchTerm}
                        onSearchChange={setContextualSearchTerm}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setViewMode(mode);
                        }}
                        placeholder="Cerca al mur..."
                    />
                </div>
            )}

            <div
                ref={parentRef}
                className="flex-1 overflow-y-auto custom-scrollbar pb-20 w-full"
                style={{ contain: 'content', overflowAnchor: 'none' }}
            >
                <ConflictBanner />
                <UniversalGridWrapper viewMode={viewMode}>
                    <div
                        ref={containerRef}
                        className="feed-list mx-auto w-full relative"
                        style={{
                            height: `${rowVirtualizer.getTotalSize() + 36}px`,
                        }}
                    >
                        {activePosts.length === 0 ? (
                            <StatusLoader
                                type="empty"
                                message={selectedTag
                                    ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                    : (t('feed.empty') || 'No hi ha novetats al mur.')
                                }
                                onRetry={selectedTag ? () => setSelectedTag(null) : null}
                            />
                        ) : (
                            rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const startIndex = virtualRow.index * columnCount;
                                const rowItems = activePosts.slice(startIndex, startIndex + columnCount);

                                return (
                                    <UniversalGridRow
                                        key={virtualRow.key}
                                        viewMode={viewMode}
                                        columnCount={columnCount}
                                        className="feed-grid"
                                        {...{ "data-index": virtualRow.index }}
                                        ref={rowVirtualizer.measureElement}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${virtualRow.start + 36}px)`,
                                        }}
                                    >
                                        {rowItems.map(post => renderPost(post))}
                                    </UniversalGridRow>
                                );
                            })
                        )}
                    </div>
                </UniversalGridWrapper>

                {!customPosts && hasMore && posts.length > 0 && !selectedTag && (
                    <div className="load-more-container mt-12 mb-12 flex justify-center w-full">
                        <button
                            className="btn-load-more"
                            onClick={() => fetchPosts(true)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Loader2 className="spinner" /> : t('common.load_more') || 'Carregar més'}
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
};


export default Feed;
```

## Entregable Exigido:
Para que te asigne el **"10/10"**, necesito una lista catalogada estricta de las vulnerabilidades y fallos arquitectónicos encontrados. 
Formato de respuesta obligatorio por cada issue crítico:
1. **Gravedad:** (Crítica / Alta / Estructural)
2. **El Vector de Falla:** Explicación técnica cruda del desastre que me va a provocar.
3. **El Fix (Código):** La corrección exacta y definitiva, con el código listo para reemplazar la vulnerabilidad, garantizando separación atómica e impacto nulo en el resto.

Dame el diagnóstico más clínico de tu vida.
