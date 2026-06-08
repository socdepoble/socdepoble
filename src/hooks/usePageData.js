import { useState, useCallback, useRef, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { supabase } from '../supabaseClient';
import { resolvePageEntry } from '../data/pageRegistry';
import { extractPageMeta as extractMetaFunction } from '../utils/extractPageMeta';

export function usePageData(slug, forcedHtml, forcedTitle, forcedSubtitle) {
    const [state, setState] = useState({
        htmlContent: forcedHtml || '',
        title: forcedTitle || '',
        subtitle: forcedSubtitle || '',
        pageId: null,
        collaborators: [],
        pageAuthor: '',
        heroFormat: 'square',
        heroPosition: 'center',
        heroImage: '',
        logoLight: '',
        logoDark: '',
        isLoadingPage: !forcedHtml, // Si hi ha forcedHtml, no carreguem res
        error: null,
    });

    // CAIXA FORTA (Refs per a props inestables)
    const volatilsRef = useRef({ forcedHtml, forcedTitle, forcedSubtitle });
    // Actualitzem la caixa forta a cada render (síncronament)
    volatilsRef.current = { forcedHtml, forcedTitle, forcedSubtitle };

    const lastFetchedSlug = useRef(null);

    const fetchPage = useCallback(async (_slug) => {
        if (!_slug) return;
        
        // Evitar recàrregues redundants per al mateix slug
        if (lastFetchedSlug.current === _slug && !state.isLoadingPage) return;
        lastFetchedSlug.current = _slug;

        const { forcedHtml: fHtml, forcedTitle: fTitle, forcedSubtitle: fSub } = volatilsRef.current;

        if (fHtml) {
            setState(prev => ({
                ...prev,
                htmlContent: fHtml,
                title: fTitle || "Pàgina Sense Títol",
                subtitle: fSub || '',
                isLoadingPage: false,
            }));
            return;
        }

        setState(prev => ({ ...prev, isLoadingPage: true, error: null }));

        const cacheKey = `page_${_slug}_v3`;
        let localCache = null;
        let pageData = {
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
        };

        try {
            // 1. Intentar cache local
            localCache = await get(cacheKey);

            if (localCache) {
                pageData = { ...pageData, ...localCache };
            }

            // 2. Si és hardcoded i no té cache, carregar del registre
            const registryEntry = resolvePageEntry(_slug);

            if (registryEntry && !localCache) {
                const htmlModule = registryEntry.htmlContent
                    ? await registryEntry.htmlContent()
                    : '';

                const { content: cleanHtml, meta } = extractMetaFunction(htmlModule);

                pageData.htmlContent = cleanHtml;
                pageData.title = registryEntry.title || pageData.title;
                pageData.subtitle = registryEntry.subtitle || pageData.subtitle;
                pageData.heroFormat = meta.heroFormat || registryEntry.defaults?.heroFormat || 'horizontal';
                pageData.heroPosition = meta.heroPosition || registryEntry.defaults?.heroPosition || 'center';
                pageData.heroImage = meta.heroImage || '';
                pageData.logoLight = meta.logoLight || registryEntry.defaults?.logoLight || '';
                pageData.logoDark = meta.logoDark || registryEntry.defaults?.logoDark || '';

                pageData.pageAuthor = 'Sóc de Poble';
            }

            // 3. Fetch de Supabase
            if (navigator.onLine) {
                const { data, error } = await supabase
                    .from('cms_pages')
                    .select('*')
                    .eq('slug', _slug)
                    .maybeSingle();

                if (!error && data) {
                    const { content: cleanHtml, meta } = extractMetaFunction(data.html_content || '');

                    pageData.htmlContent = cleanHtml || pageData.htmlContent;
                    pageData.title = data.title || pageData.title;
                    pageData.subtitle = data.subtitle || pageData.subtitle;
                    pageData.pageId = data.id;
                    pageData.collaborators = data.collaborators || [];
                    pageData.pageAuthor = data.author || data.author_name || pageData.pageAuthor;

                    pageData.heroFormat = meta.heroFormat || pageData.heroFormat;
                    pageData.heroPosition = meta.heroPosition || pageData.heroPosition;
                    pageData.heroImage = meta.heroImage || pageData.heroImage;
                    pageData.logoLight = meta.logoLight || pageData.logoLight;
                    pageData.logoDark = meta.logoDark || pageData.logoDark;
                }
            }
            
            if (!registryEntry && !localCache && !pageData.htmlContent) {
                pageData.htmlContent = "<p>Aquesta pàgina encara no té contingut. (Error 404 local)</p>";
                pageData.title = "Pàgina No Trobada";
                pageData.subtitle = "";
            }

            // 4. Persistir a cache si ha canviat
            const cachePayload = { ...pageData, timestamp: Date.now() };

            const cacheChanged = !localCache ||
                JSON.stringify(localCache.html) !== JSON.stringify(pageData.htmlContent) ||
                localCache.subtitle !== pageData.subtitle ||
                localCache.title !== pageData.title ||
                localCache.heroImage !== pageData.heroImage;

            if (cacheChanged) {
                await set(cacheKey, cachePayload);
            }

            setState(prev => ({
                ...prev,
                ...pageData,
                isLoadingPage: false,
            }));

        } catch (err) {
            console.error('[Trellat] Error fetch:', err);
            if (!localCache) {
                setState(prev => ({
                    ...prev,
                    htmlContent: "<p>Error carregant la pàgina.</p>",
                    title: "Error de connexió",
                    isLoadingPage: false,
                    error: err,
                }));
            } else {
                setState(prev => ({ ...prev, isLoadingPage: false, error: err }));
            }
        }
    }, [state.isLoadingPage]);

    // Fetch automàtic quan canvia el slug
    useEffect(() => {
        if (slug) {
            fetchPage(slug);
        }
    }, [slug, fetchPage]);

    return { ...state, fetchPageContent: fetchPage };
}
