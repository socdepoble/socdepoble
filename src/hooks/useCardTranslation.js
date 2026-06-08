import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useCardTranslation(cardId, baseTitle, baseExcerpt) {
    const [translatedTitle, setTranslatedTitle] = useState(null);
    const [translatedExcerpt, setTranslatedExcerpt] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const handleTranslateRequest = async (e) => {
            const { postId, targetLang } = e.detail;
            if (postId !== cardId && postId !== 'unknown') return;

            setIsTranslating(true);
            try {
                const { data, error } = await supabase.functions.invoke('translation', {
                    body: { 
                        text: `<h1>${baseTitle}</h1><p>${baseExcerpt}</p>`, 
                        targetLang: targetLang,
                        postId: cardId
                    }
                });
                if (!isMounted) return;

                if (data && data.status === 'success') {
                    const html = data.translatedHtml;
                    const h1Match = html.match(/<h1>(.*?)<\/h1>/si);
                    const pMatch = html.match(/<p>(.*?)<\/p>/si);
                    if (h1Match) setTranslatedTitle(h1Match[1]);
                    if (pMatch) setTranslatedExcerpt(pMatch[1]);
                } else {
                    throw new Error("Proxy returned non-success status");
                }
            } catch (error) {
                if (!isMounted || error.name === 'AbortError') return;
                console.warn("Card translation AI failed (likely CORS), falling back to Google Translate:", error);
                const select = document.querySelector('.goog-te-combo');
                if (select) {
                    select.value = targetLang;
                    select.dispatchEvent(new Event('change'));
                }
            } finally {
                if (isMounted) setIsTranslating(false);
            }
        };

        window.addEventListener('omega-translate-request', handleTranslateRequest);
        return () => {
            isMounted = false;
            controller.abort();
            window.removeEventListener('omega-translate-request', handleTranslateRequest);
        };
    }, [cardId, baseTitle, baseExcerpt]);

    return {
        translatedTitle,
        translatedExcerpt,
        isTranslating
    };
}
