// src/hooks/useSeoTrellat.js
import { useEffect } from 'react';

/**
 * useSeoTrellat - Hook Vanilla JS pur per a injectar meta-etiquetes SEO dinàmiques
 * sense necessitat de dependències pesades com react-helmet-async.
 * S'assegura que Googlebot i altres rastejadors tinguen la informació correcta 
 * en cada pàgina i evita contingut duplicat.
 */
export function useSeoTrellat({ titol, descripcio, urlCanonica, ogImatge, tipus = 'website' }) {
  useEffect(() => {
    const base = 'Sóc de Poble';
    
    // 1. Mutació asèptica del títol
    document.title = titol ? `${titol} | ${base}` : base;
    
    // 2. Injecció o modificació de meta etiquetes base
    setMeta('name', 'description', descripcio || 'Connecta amb la teua comunitat i recupera el trellat del territori.');
    
    // 3. Open Graph (Social)
    setMeta('property', 'og:title', titol ? `${titol} | ${base}` : base);
    setMeta('property', 'og:description', descripcio || '');
    setMeta('property', 'og:type', tipus);
    if (ogImatge) setMeta('property', 'og:image', ogImatge);
    if (urlCanonica) setMeta('property', 'og:url', `https://socdepoble.org${urlCanonica}`);
    
    // 4. Twitter Cards
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', titol ? `${titol} | ${base}` : base);
    setMeta('name', 'twitter:description', descripcio || '');
    if (ogImatge) setMeta('name', 'twitter:image', ogImatge);

    // 5. L'Etiqueta Canonical (Segell innegociable per a rutes de SPA)
    if (urlCanonica) {
      setLink('canonical', `https://socdepoble.org${urlCanonica}`);
    }
  }, [titol, descripcio, urlCanonica, ogImatge, tipus]);
}

// Funció auxiliar per meta etiquetes
function setMeta(attr, name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

// Funció auxiliar per links
function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}
