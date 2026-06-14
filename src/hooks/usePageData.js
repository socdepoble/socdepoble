import { useCallback, useRef, useEffect, useReducer, useMemo } from 'react';
import { get, set } from 'idb-keyval';
import { supabase } from '../supabaseClient';
import { resolvePageEntry } from '../data/pageRegistry';
import { extractPageMeta as extractMetaFunction } from '../utils/extractPageMeta';

// ─── Constants (Zero Re-renders) ────────────────────────────
const INITIAL_STATE = Object.freeze({
  htmlContent: '',
  title: '',
  subtitle: '',
  pageId: null,
  collaborators: [],
  pageAuthor: '',
  heroFormat: 'square',
  heroPosition: 'center',
  heroImage: '',
  logoLight: '',
  logoDark: '',
  isLoadingPage: true,
  error: null
});

// ─── Reducer (Estat consolidat i previsible) ────────────────
function pageDataReducer(state, action) {
  switch (action.type) {
    case 'INIT_FORCED':
      return {
        ...state,
        htmlContent: action.payload.html,
        title: action.payload.title || "Pàgina Sense Títol",
        subtitle: action.payload.subtitle || '',
        isLoadingPage: false,
        error: null
      };
    case 'FETCH_START':
      return { ...state, isLoadingPage: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, ...action.payload, isLoadingPage: false };
    case 'FETCH_ERROR':
      return { ...state, ...action.payload, isLoadingPage: false };
    default:
      return state;
  }
}

// ─── Helpers purs ───────────────────────────────────────────
const applyCache = (pageData, localCache) => {
  if (!localCache) return pageData;
  return { ...pageData, ...localCache };
};

const applyRegistry = async (pageData, slug) => {
  const registryEntry = resolvePageEntry(slug);
  if (!registryEntry) return { pageData, registryEntry: null };

  const htmlModule = registryEntry.htmlContent ? await registryEntry.htmlContent() : '';
  const { content: cleanHtml, meta } = extractMetaFunction(htmlModule);
  
  return {
    registryEntry,
    pageData: {
      ...pageData,
      htmlContent: cleanHtml,
      title: registryEntry.title || pageData.title,
      subtitle: registryEntry.subtitle || pageData.subtitle,
      heroFormat: meta.heroFormat || registryEntry.defaults?.heroFormat || 'square',
      heroPosition: meta.heroPosition || registryEntry.defaults?.heroPosition || 'center',
      heroImage: meta.heroImage || '',
      logoLight: meta.logoLight || registryEntry.defaults?.logoLight || '',
      logoDark: meta.logoDark || registryEntry.defaults?.logoDark || '',
      pageAuthor: 'Sóc de Poble'
    }
  };
};

const applySupabase = async (pageData, slug) => {
  if (!navigator.onLine) return pageData;
  
  const { data, error } = await supabase.from('cms_pages').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return pageData;

  const { content: cleanHtml, meta } = extractMetaFunction(data.html_content || '');
  
  return {
    ...pageData,
    htmlContent: cleanHtml || pageData.htmlContent,
    title: data.title || pageData.title,
    subtitle: data.subtitle || pageData.subtitle,
    pageId: data.id,
    collaborators: data.collaborators || [],
    pageAuthor: data.author || data.author_name || pageData.pageAuthor,
    heroFormat: meta.heroFormat || pageData.heroFormat,
    heroPosition: meta.heroPosition || pageData.heroPosition,
    heroImage: meta.heroImage || pageData.heroImage,
    logoLight: meta.logoLight || pageData.logoLight,
    logoDark: meta.logoDark || pageData.logoDark
  };
};

// ─── Hook Principal ─────────────────────────────────────────
export function usePageData(slug, forcedHtml, forcedTitle, forcedSubtitle) {
  const [state, dispatch] = useReducer(pageDataReducer, {
    ...INITIAL_STATE,
    htmlContent: forcedHtml || '',
    title: forcedTitle || '',
    subtitle: forcedSubtitle || '',
    isLoadingPage: !forcedHtml
  });

  // Utilitzem Refs per a trencar dependències cícliques
  const refs = useRef({ slug, forcedHtml, forcedTitle, forcedSubtitle, isLoadingPage: state.isLoadingPage });
  
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);
  
  // Sincronització segura (fora de renderitzat síncron)
  useEffect(() => {
    refs.current = { slug, forcedHtml, forcedTitle, forcedSubtitle, isLoadingPage: state.isLoadingPage };
  }, [slug, forcedHtml, forcedTitle, forcedSubtitle, state.isLoadingPage]);

  const lastFetchedSlug = useRef(null);

  const fetchPage = useCallback(async (targetSlug) => {
    if (!targetSlug) return;
    const { forcedHtml: fHtml, forcedTitle: fTitle, forcedSubtitle: fSub, isLoadingPage } = refs.current;

    // Evitar dobles càrregues
    if (lastFetchedSlug.current === targetSlug && !isLoadingPage) return;
    lastFetchedSlug.current = targetSlug;

    // 1. Dades forçades
    if (fHtml) {
      dispatch({ type: 'INIT_FORCED', payload: { html: fHtml, title: fTitle, subtitle: fSub } });
      return;
    }

    dispatch({ type: 'FETCH_START' });

    const cacheKey = `page_${targetSlug}_v3`;
    let localCache = null;
    let pageData = { ...INITIAL_STATE };

    try {
      // 2. Cache local
      localCache = await get(cacheKey);
      pageData = applyCache(pageData, localCache);

      // 3. Registre local (si no hi ha cache)
      const { pageData: regData, registryEntry } = localCache ? { pageData, registryEntry: null } : await applyRegistry(pageData, targetSlug);
      pageData = regData;

      // 4. Supabase (Xarxa)
      pageData = await applySupabase(pageData, targetSlug);

      // 5. Fallback 404
      if (!registryEntry && !localCache && !pageData.htmlContent) {
        pageData.htmlContent = "<p>Aquesta pàgina encara no té contingut. (Error 404 local)</p>";
        pageData.title = "Pàgina No Trobada";
      }

      // 6. Actualitzar cache si ha canviat
      const cacheChanged = !localCache || 
        localCache.htmlContent !== pageData.htmlContent || 
        localCache.subtitle !== pageData.subtitle || 
        localCache.title !== pageData.title || 
        localCache.heroImage !== pageData.heroImage;

      if (cacheChanged) {
        await set(cacheKey, { ...pageData, timestamp: Date.now() });
      }

      if (!isMountedRef.current) return;
      dispatch({ type: 'FETCH_SUCCESS', payload: pageData });

    } catch (err) {
      console.error('[Trellat] Error fetch:', err);
      if (!isMountedRef.current) return;
      dispatch({
        type: 'FETCH_ERROR',
        payload: {
          htmlContent: localCache ? localCache.htmlContent : "<p>Error carregant la pàgina.</p>",
          title: localCache ? localCache.title : "Error de connexió",
          error: err
        }
      });
    }
  }, []); // Cap dependència: la funció és immortal

  // Auto-fetch
  useEffect(() => {
    if (slug) fetchPage(slug);
  }, [slug, fetchPage]);

  // ALERTA SUTURADA: Evitem retornar un nou objecte a cada render
  return useMemo(() => ({
    ...state,
    fetchPageContent: fetchPage
  }), [state, fetchPage]);
}