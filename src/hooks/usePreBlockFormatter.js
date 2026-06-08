import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function usePreBlockFormatter(htmlContent) {
    const { t } = useTranslation();

    // En lloc de mutar el DOM amb document.createElement, transformem el HTML abans de renderitzar.
    // Això evita problemes de repintat i inconsistències al Virtual DOM de React.
    const formattedHtml = useMemo(() => {
        if (!htmlContent) return '';
        
        return htmlContent.replace(
            /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
            (match, attrs, innerContent) => {
                // Detectar llenguatge
                const langMatch = innerContent.match(/class="[^"]*language-(\w+)/);
                const lang = langMatch ? langMatch[1] : '';
                
                const langBadge = lang 
                    ? `<span class="pedra-code__lang text-xs uppercase font-bold text-[var(--sp-text-muted)]">${lang}</span>` 
                    : '';
                
                return `
                    <div class="pedra-code relative my-6 rounded-lg overflow-hidden border border-[var(--sp-border-master)] bg-[var(--sp-bg-panel)] shadow-sm">
                        <div class="pedra-code__header flex justify-between items-center px-4 py-2 bg-[var(--sp-bg-app)] border-b border-[var(--sp-border-master)]">
                            <span class="pedra-code__title text-sm font-semibold flex items-center gap-2">
                                💻 ${t('project.tech_format', 'Codi Font')}
                            </span>
                            <div class="pedra-code__actions flex items-center gap-3">
                                ${langBadge}
                                <button class="cms-copy-btn pedra-code__copy text-sm font-medium flex items-center gap-1.5 text-[var(--sp-accent-primary)] hover:opacity-80 transition-opacity" type="button">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2"/>
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                    </svg>
                                    ${t('project.copy', 'Copiar')}
                                </button>
                            </div>
                        </div>
                        <div class="pedra-code__body overflow-x-auto p-4 text-sm leading-relaxed custom-scrollbar">
                            <pre${attrs}>${innerContent}</pre>
                        </div>
                    </div>
                `;
            }
        );
    }, [htmlContent, t]);

    return formattedHtml;
}
