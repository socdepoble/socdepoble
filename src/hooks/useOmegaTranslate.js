import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
export function useOmegaTranslate(routeSlug, htmlContent) {
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translating, setTranslating] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const handleTranslate = async e => {
      const {
        postId,
        targetLang
      } = e.detail;
      if (postId !== routeSlug && postId !== 'projecte') return;
      setTranslating(true);
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke('translation', {
          body: {
            campaignType: 'omega_translate_ondemand',
            htmlContent,
            targetLang
          }
        });
        if (!isMounted) return;
        if (error) throw error;
        if (data?.status === 'success') {
          setTranslatedContent(data.translatedHtml);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.warn('Omega Translate failed, fallback to Google:', err);
          const select = document.querySelector('.goog-te-combo');
          if (select) {
            select.value = targetLang;
            select.dispatchEvent(new Event('change'));
          }
        }
      } finally {
        if (isMounted) setTranslating(false);
      }
    };
    window.addEventListener('omega-translate-request', handleTranslate);
    return () => {
      isMounted = false;
      controller.abort();
      window.removeEventListener('omega-translate-request', handleTranslate);
    };
  }, [routeSlug, htmlContent]);
  return {
    translatedContent,
    translating,
    clearTranslation: () => setTranslatedContent(null)
  };
}