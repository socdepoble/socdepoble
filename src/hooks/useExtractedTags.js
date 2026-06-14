import { useMemo } from 'react';

export function useExtractedTags(pageItem) {
  return useMemo(() => {
    if (!pageItem) return [];
    const rawDesc = pageItem.content || pageItem.subtitle || '';
    const extracted = (rawDesc.match(/#[a-zA-Z0-9_À-ÿ]+/g) || []).map(t => t.replace(/^#+/, ''));
    const combined = [...new Set([...(pageItem.tags || []), ...extracted])];
    return combined;
  }, [pageItem?.tags, pageItem?.content, pageItem?.subtitle]);
}
