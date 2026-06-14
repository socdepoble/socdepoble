/**
 * Sóc de Poble - Escut XSS Natiu (Pedra Seca Edition)
 * Sanitització atòmica O(N) mitjançant el motor natiu C++ del navegador.
 * Zero DOMPurify. Zero Overhead.
 */

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function isSafeUrl(href) {
  if (!href || typeof href !== 'string') return false;
  const trimmed = href.trim();
  if (/^\s*javascript:/i.test(trimmed)) return false;
  
  if (/^\s*data:/i.test(trimmed)) {
    // Permet només imatges raster. Deny-by-default per data:image/svg+xml i la resta.
    return /^\s*data:image\/(png|jpeg|jpg|webp|gif|avif);/i.test(trimmed);
  }
  
  try {
    const u = new URL(trimmed, location.origin);
    return SAFE_PROTOCOLS.has(u.protocol);
  } catch (e) {
    return false;
  }
}

export const sanitizeTemplate = (template) => {
  if (!template || !template.content) return template;
  
  const fragment = template.content;

  // 1. Destrucció d'etiquetes executores i perilloses (O(1) via selectors natius)
  // 🛡️ S'han afegit 'svg', 'math', 'frame', 'frameset', 'template', 'noscript' per recomanació de ChatGPT, Kimi i Claude.
  const toxins = fragment.querySelectorAll('script, object, embed, applet, base, link, style, iframe, form, button, input, textarea, svg, math, meta, frame, frameset, template, noscript');
  for (let i = 0; i < toxins.length; i++) {
    toxins[i].remove();
  }

  // 2. Neteja quirúrgica d'atributs
  const nodes = fragment.querySelectorAll('*');
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const attrs = node.attributes;
    
    for (let j = attrs.length - 1; j >= 0; j--) {
      const attrName = attrs[j].name.toLowerCase();
      const attrVal = attrs[j].value;
      
      // Bloqueig d'events natius
      if (attrName.startsWith('on')) {
        node.removeAttribute(attrs[j].name);
        continue;
      }

      // 🛡️ Prevenir fuga d'atributs srcdoc (Auditoria Kimi)
      if (attrName === 'srcdoc') {
        node.removeAttribute(attrs[j].name);
        continue;
      }
      
      // 🛡️ Netejar CSS inline perillós (Auditoria Vibe)
      if (attrName === 'style') {
        const cleanStyle = attrVal
          .replace(/url\(['"]?javascript:[^'"]*['"]?\)/gi, '')
          .replace(/expression\([^)]*\)/gi, '')
          .replace(/behaviour:[^;]+/gi, '');
        if (cleanStyle !== attrVal) {
          node.setAttribute('style', cleanStyle);
        }
      }
      
      // 🛡️ Llista blanca estricta de protocols per a href, src, formaction, etc.
      if (attrName === 'href' || attrName === 'src' || attrName === 'xlink:href' || attrName === 'formaction') {
        if (!isSafeUrl(attrVal)) {
          node.removeAttribute(attrs[j].name);
        }
      }
    }
  }

  return template;
};
