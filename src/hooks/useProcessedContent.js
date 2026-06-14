import { useMemo } from 'react';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { resolveMedia } from '../utils/resolveMedia';
export function useProcessedContent(htmlContent, hasChildren) {
  return useMemo(() => {
    if (!htmlContent) return '';
    if (hasChildren) return '';

    // Eliminar H1 redundant
    const stripped = htmlContent.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, '');

    // Netejar URLs absolutes podrides
    const cleanedPaths = stripped.replace(/(?:https?:\/\/(?:www\.)?socdepoble\.(?:org|net))?\/Users\/javillinares\/[\w/.-]+\/([a-zA-Z0-9_-]+\.(?:jpg|png|jpeg|webp|gif))/gi, (match, filename) => resolveMedia(filename));
    return sanitizeHtml(cleanedPaths);
  }, [htmlContent, hasChildren]);
}