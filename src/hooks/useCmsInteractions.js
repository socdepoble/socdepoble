import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// ─── Helpers purs (Fora del component per zero overhead) ─────
const extractCodeBlockText = (copyBtn) => {
  const codeBlock = copyBtn.closest('.pedra-code')?.querySelector('pre');
  if (!codeBlock) return null;
  return codeBlock.querySelector('code')?.innerText || codeBlock.innerText;
};

const handleAnchorNavigation = (anchor, navigate) => {
  const href = anchor.getAttribute('href');
  if (!href) return false;

  if (href.startsWith('#')) {
    let targetId = href.substring(1);
    try { targetId = decodeURIComponent(targetId); } catch (e) { /* ignore */ }
    
    let targetEl = document.getElementById(targetId);
    if (!targetEl) {
      const fallbackSlug = targetId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      targetEl = document.getElementById(fallbackSlug) || 
                 document.querySelector(`[id^="${fallbackSlug}-"]`) || 
                 document.querySelector(`[id^="${targetId}-"]`);
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
    return true; // Prevent default handled
  }

  if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.endsWith('.html')) {
    navigate(href);
    return true; // Prevent default handled
  }

  return false;
};

// ─── Hook Principal ─────────────────────────────────────────
export function useCmsInteractions(contentRef, { onImageClick }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Guardem els callbacks en refs per evitar recrear l'event listener
  const callbacksRef = useRef({ onImageClick, navigate, t });
  useEffect(() => { callbacksRef.current = { onImageClick, navigate, t }; });

  useEffect(() => {
    const contentDiv = contentRef.current;
    if (!contentDiv) return;

    // Utilitzem Event Delegation de forma aïllada
    const handleClick = (e) => {
      const { onImageClick: clickHandler, navigate: nav, t: trans } = callbacksRef.current;

      // 1. Botó de copiar codi
      const copyBtn = e.target.closest('.cms-copy-btn');
      if (copyBtn) {
        e.preventDefault();
        const codeText = extractCodeBlockText(copyBtn);
        if (codeText) {
          navigator.clipboard.writeText(codeText).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = `✅ ${trans('project.copied', 'Copiat!')}`;
            setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
          });
        }
        return;
      }

      // 2. Imatges
      if (e.target.tagName === 'IMG') {
        if (clickHandler) {
          const allImages = Array.from(contentDiv.querySelectorAll('img')).map(img => img.src);
          clickHandler(e.target.src, allImages);
        }
        return;
      }

      // 3. Enllaços interns
      const anchor = e.target.closest('a');
      if (anchor) {
        const handled = handleAnchorNavigation(anchor, nav);
        if (handled) e.preventDefault();
      }
    };

    contentDiv.addEventListener('click', handleClick);
    return () => contentDiv.removeEventListener('click', handleClick);
  }, [contentRef]); // L'efecte només s'executa si canvia el div. Els callbacks són estables per ref.
}