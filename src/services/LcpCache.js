// src/services/LcpCache.js
// Clau de lectura ràpida del primer post. Zero desxifrat necessari.
// Actualitzada cada vegada que el Y.Doc confirma un canvi al feed.

import { get, set } from 'idb-keyval';
// import { DB } from './RhizomeManager';  // assumim idb-keyval com a backend compartit
const DB = undefined; // Per a idb-keyval defecte s'utilitza undefined i es crea ell mateix

const LCP_KEY = 'lcp:first-5-posts';
const LCP_MAX = 5;
const LCP_FIELD = ['id', 'title', 'excerpt', 'author', 'author_avatar', 'town_name', 'created_at', 'type', 'tags'];

// Extreu únicament els camps necessaris per al render inicial
const projecció = post => LCP_FIELD.reduce((acc, f) => {
  if (post[f] !== undefined) acc[f] = post[f];
  return acc;
}, {});

// Crida quan el feed del Y.Doc canvia (subscripció Y.Array)
export async function actualitzarLcpCache(postsArray) {
  try {
    const primers = postsArray.slice(0, LCP_MAX).map(p => projecció(p.toJSON ? p.toJSON() : p));
    await set(LCP_KEY, {
      posts: primers,
      ts: Date.now()
    }, DB);
  } catch {
    // Silenciós: si falla, la pròxima sessió no tindrà fast-LCP
    // però la restauració completa seguirà funcionant
  }
}

// Retorna els primers posts en < 5ms (una sola operació IDB)
export async function llegirLcpCache() {
  try {
    const entry = await get(LCP_KEY, DB);
    // Invalida si té més de 24h d'antiguitat (pot estar molt desactualitzat)
    if (entry?.posts && Date.now() - entry.ts < 86_400_000) {
      return entry.posts;
    }
  } catch {/* */}
  return [];
}