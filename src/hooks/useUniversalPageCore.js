import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_FEED } from '../data';

export function useUniversalPageCore(slug, forcedItem) {
  const location = useLocation();

  const routeSlug = useMemo(() => {
    const raw = slug || location.pathname;
    return raw.replace(/^\/+/, '');
  }, [slug, location.pathname]);

  const pageItem = useMemo(() => {
    return forcedItem || MOCK_FEED?.find(item => 
      item.slug === routeSlug || item.slug === slug || item.id === `post-socdepoble-${routeSlug}`
    );
  }, [forcedItem, routeSlug, slug]);

  // Microoptimització 1: Retornem l'objecte memoitzat per evitar recreacions (Suggeriment de Qwen)
  return useMemo(() => ({ routeSlug, pageItem }), [routeSlug, pageItem]);
}
