import { useEffect, useRef, useState, useCallback } from 'react';

/* ---------- Config ---------- */
const DB_NAME = 'unified-editor-db';
const DB_VERSION = 1;
const ASSET_STORE = 'assets';
const MAX_CONCURRENT = 3; // limit parallel IDB reads to avoid blocking CPU/IO

/* ---------- IndexedDB helper (reads only) ---------- */
export function openBancalDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ASSET_STORE)) {
        db.createObjectStore(ASSET_STORE, { keyPath: 'cid' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAssetBlobByCid(cid) {
  const db = await openBancalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE, 'readonly');
    const store = tx.objectStore(ASSET_STORE);
    const req = store.get(cid);
    req.onsuccess = () => {
      const rec = req.result;
      if (!rec) return resolve(null);
      // Expect record.blob to be a Blob
      resolve(rec.blob || null);
    };
    req.onerror = () => reject(req.error);
  });
}

/* ---------- Utility: find all cid tokens in markdown text ---------- */
export const CID_REGEX = /!\[([^\]]*?)\]\(\s*cid:([a-zA-Z0-9\-_:.]+)\s*\)/g;
// Matches Markdown image syntax with cid: e.g. ![alt](cid:img-abc123)

export function extractCidsFromText(text) {
  const set = new Set();
  if (!text) return set;
  let m;
  while ((m = CID_REGEX.exec(text)) !== null) {
    const cid = m[2];
    if (cid) set.add(cid);
  }
  return set;
}

/* ---------- Hook implementation ---------- */
export default function useCIDRenderer(markdownText) {
  const [resolvedText, setResolvedText] = useState(markdownText || '');
  const [loading, setLoading] = useState(false);

  // cacheRef: cid -> { url, lastUsedAt }
  const cacheRef = useRef(new Map());
  // activeFetches: cid -> Promise
  const fetchRef = useRef(new Map());
  // track currently used cids for cleanup
  const usedCidsRef = useRef(new Set());

  // revoke helper
  const revokeUrl = (url) => {
    try {
      if (url) URL.revokeObjectURL(url);
    } catch (e) {
      // ignore
    }
  };

  // create object URL from blob, with small yield to avoid blocking
  const blobToObjectUrl = useCallback(async (blob) => {
    if (!blob) return null;
    // yield to event loop / idle if available
    await new Promise((res) => {
      if (typeof requestIdleCallback !== 'undefined') {
        (window.requestIdleCallback || function(cb) { setTimeout(() => cb({ timeRemaining: () => 50 }), 1) })(() => res(), { timeout: 200 });
      } else {
        setTimeout(res, 30);
      }
    });
    return URL.createObjectURL(blob);
  }, []);

  // fetch or reuse objectURL for a cid
  const ensureCidUrl = useCallback(async (cid) => {
    // reuse cached url if present
    const cache = cacheRef.current;
    if (cache.has(cid)) {
      const entry = cache.get(cid);
      entry.lastUsedAt = Date.now();
      return entry.url;
    }

    // if already fetching, return same promise
    if (fetchRef.current.has(cid)) {
      return fetchRef.current.get(cid);
    }

    // create a promise and store in fetchRef
    const p = (async () => {
      try {
        const blob = await getAssetBlobByCid(cid);
        if (!blob) return null;
        const url = await blobToObjectUrl(blob);
        // store in cache
        cache.set(cid, { url, lastUsedAt: Date.now() });
        return url;
      } finally {
        // remove from fetchRef after completion
        fetchRef.current.delete(cid);
      }
    })();

    fetchRef.current.set(cid, p);
    return p;
  }, [blobToObjectUrl]);

  // concurrency-limited resolver for a list of cids
  const resolveCidsWithLimit = useCallback(async (cids) => {
    const cidArray = Array.from(cids);
    const results = {};
    let idx = 0;

    async function worker() {
      while (idx < cidArray.length) {
        const i = idx++;
        const cid = cidArray[i];
        try {
          const url = await ensureCidUrl(cid);
          results[cid] = url || null;
        } catch (e) {
          results[cid] = null;
        }
      }
    }

    const workers = [];
    const concurrency = Math.max(1, Math.min(MAX_CONCURRENT, cidArray.length));
    for (let i = 0; i < concurrency; i++) workers.push(worker());
    await Promise.all(workers);
    return results;
  }, [ensureCidUrl]);

  // main effect: when markdownText changes, resolve cids and produce resolvedText
  useEffect(() => {
    let mounted = true;
    const prevUsed = new Set(usedCidsRef.current); // snapshot for cleanup later
    const newCids = extractCidsFromText(markdownText || '');
    // update usedCidsRef immediately
    usedCidsRef.current = new Set(newCids);

    if (!newCids.size) {
      // no cids: revoke previous urls and clear used set
      // revoke only those that were used previously and are not reused
      for (const cid of prevUsed) {
        if (!newCids.has(cid)) {
          const entry = cacheRef.current.get(cid);
          if (entry) {
            revokeUrl(entry.url);
            cacheRef.current.delete(cid);
          }
        }
      }
      setResolvedText(markdownText || '');
      setLoading(false);
      return () => { mounted = false; };
    }

    setLoading(true);

    (async () => {
      try {
        // Resolve all cids (concurrency-limited)
        const mapping = await resolveCidsWithLimit(newCids);

        if (!mounted) {
          // if unmounted, revoke any newly created urls
          for (const cid of Object.keys(mapping)) {
            const url = mapping[cid];
            if (url) {
              // if it was just created and not in previous used set, revoke
              if (!prevUsed.has(cid)) revokeUrl(url);
            }
          }
          return;
        }

        // Build resolved text by replacing cid tokens with object URLs
        // Use a single pass replace with regex and callback
        const replaced = (markdownText || '').replace(CID_REGEX, (match, alt, cid) => {
          const url = mapping[cid] || (cacheRef.current.get(cid) && cacheRef.current.get(cid).url) || null;
          if (url) {
            // mark lastUsedAt
            const entry = cacheRef.current.get(cid);
            if (entry) entry.lastUsedAt = Date.now();
            return `![${alt}](${url})`;
          }
          // fallback: keep original token if not found
          return match;
        });

        // Revoke any previously used cids that are no longer present
        for (const cid of prevUsed) {
          if (!newCids.has(cid)) {
            const entry = cacheRef.current.get(cid);
            if (entry) {
              revokeUrl(entry.url);
              cacheRef.current.delete(cid);
            }
          }
        }

        setResolvedText(replaced);
      } catch (err) {
        // on error, fallback to original text
        setResolvedText(markdownText || '');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      // Note: do not revoke here — we revoke on next effect run or unmount below to avoid thrashing.
    };
  }, [markdownText, resolveCidsWithLimit]);

  // cleanup on unmount: revoke all object URLs and clear caches
  useEffect(() => {
    const currentCache = cacheRef.current;
    const currentFetch = fetchRef.current;
    const currentUsedCids = usedCidsRef.current;
    return () => {
      // revoke all cached urls
      for (const [cid, entry] of currentCache.entries()) {
        try { revokeUrl(entry.url); } catch (e) { /* ignore error during cleanup */ }
      }
      currentCache.clear();
      // clear any pending fetch promises map
      currentFetch.clear();
      currentUsedCids.clear();
    };
  }, []);

  // Periodic maintenance: optional small GC to revoke least recently used URLs if cache grows
  // This effect runs rarely and yields to idle to avoid CPU spikes.
  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      if (!mounted) return;
      try {
        const cache = cacheRef.current;
        const MAX_CACHE = 30; // keep small for A10
        if (cache.size <= MAX_CACHE) return;
        // sort by lastUsedAt ascending and revoke oldest until under limit
        const entries = Array.from(cache.entries()).sort((a, b) => (a[1].lastUsedAt || 0) - (b[1].lastUsedAt || 0));
        const toRemove = entries.slice(0, cache.size - MAX_CACHE);
        for (const [cid, entry] of toRemove) {
          revokeUrl(entry.url);
          cache.delete(cid);
        }
      } catch (e) {
        // ignore
      }
    }, 30_000); // every 30s
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return [resolvedText, loading];
}
