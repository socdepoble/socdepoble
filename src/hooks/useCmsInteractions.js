import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function useCmsInteractions(contentRef, { onImageClick }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const contentDiv = contentRef.current;
        if (!contentDiv) return;

        const controller = new AbortController();

        // Event delegation únic per a tot el contenidor
        const handleClick = (e) => {
            // 1. Botó de copiar
            const copyBtn = e.target.closest('.cms-copy-btn');
            if (copyBtn) {
                e.preventDefault();
                const codeBlock = copyBtn.closest('.pedra-code')?.querySelector('pre');
                if (codeBlock) {
                    const codeText = codeBlock.querySelector('code')?.innerText || codeBlock.innerText;
                    navigator.clipboard.writeText(codeText).then(() => {
                        const original = copyBtn.innerHTML;
                        copyBtn.innerHTML = `✅ ${t('project.copied', 'Copiat!')}`;
                        setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
                    });
                }
                return;
            }

            // 2. Imatges
            if (e.target.tagName === 'IMG') {
                if (onImageClick) {
                    const allImages = Array.from(contentDiv.querySelectorAll('img')).map(img => img.src);
                    onImageClick(e.target.src, allImages);
                }
                return;
            }

            // 3. Enllaços interns
            const anchor = e.target.closest('a');
            if (anchor) {
                const href = anchor.getAttribute('href');
                if (!href) return;

                if (href.startsWith('#')) {
                    e.preventDefault();
                    let targetId = href.substring(1);
                    try { targetId = decodeURIComponent(targetId); } catch {}

                    let targetEl = document.getElementById(targetId);
                    if (!targetEl) {
                        const fallbackSlug = targetId.toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '');
                        targetEl = document.getElementById(fallbackSlug) || 
                                   document.querySelector(`[id^="${fallbackSlug}-"]`) ||
                                   document.querySelector(`[id^="${targetId}-"]`);
                    }
                    
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }
                } else if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.endsWith('.html')) {
                    e.preventDefault();
                    navigate(href);
                }
            }
        };

        contentDiv.addEventListener('click', handleClick, { signal: controller.signal });
        return () => controller.abort();
    }, [t, navigate, onImageClick, contentRef]);
}
