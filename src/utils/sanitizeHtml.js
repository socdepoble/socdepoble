import DOMPurify from 'dompurify';
export const sanitizeHtml = html => {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'br', 'hr', 'a', 'span', 'div', 'img', 'blockquote', 'section', 'article', 'main', 'button', 'pre', 'code', 'video', 'source', 'details', 'summary', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    // [TRELLAT]: HEM FULMINAT L''onclick' i 'style' PER A BLINDAR CONTRA ATACS XSS.
    ALLOWED_ATTR: ['href', 'title', 'target', 'src', 'alt', 'class', 'id', 'width', 'height', 'loading', 'autoplay', 'loop', 'muted', 'playsinline', 'controls', 'open'],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    // Evita que el parser natiu del navegador talli per nesting invàlid
    FORCE_BODY: true
  });
};