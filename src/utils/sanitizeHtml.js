import DOMPurify from 'dompurify';
export const SAFE_CONFIG = {
  USE_PROFILES: {
    html: true
  },
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: [
    'script',
    'iframe',
    'object',
    'embed',
    'style'
  ],
  FORBID_ATTR: [
    'style',
    'onerror',
    'onclick',
    'onload'
  ]
};

export const sanitizeHtml = html => {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, SAFE_CONFIG);
};