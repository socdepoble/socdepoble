import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 
            'details', 'summary', 'span', 'div', 'br', 'strong', 'em', 'blockquote'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'id', 'target', 'rel', 'title'],
        ADD_TAGS: ['details', 'summary'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'style', 'class']
    });
};
