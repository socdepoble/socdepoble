import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MAIN_LANGS = [
    { code: 'va', label: 'Valencià' },
    { code: 'es', label: 'Castellà' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' }
];

const TranslationModal = ({ isOpen, onClose, config }) => {
    const { i18n } = useTranslation();
    
    // Recuperar l'últim idioma utilitzat
    const lastLangCode = localStorage.getItem('sdp_last_translation_lang');

    if (!isOpen) return null;

    const handleTranslate = (langCode) => {
        // Guardem l'última elecció per facilitar el protocol de 2 tocs
        localStorage.setItem('sdp_last_translation_lang', langCode);
        
        // Dispatch global event for the main system (OMEGA-39) to handle the AI translation request
        window.dispatchEvent(new CustomEvent('omega-translate-request', { 
            detail: { 
                postId: config?.postId, 
                title: config?.title,
                targetLang: langCode 
            } 
        }));
        
        onClose();
    };

    // Obtener idioma base
    const currentAppLang = i18n.language || 'va';

    // Construcció de llistes
    const lastUsedLang = lastLangCode ? MAIN_LANGS.find(l => l.code === lastLangCode) : null;
    
    // Filtrem la resta d'idiomes excloent l'últim triat i l'actual
    const availableMainLangs = MAIN_LANGS.filter(l => l.code !== currentAppLang && l.code !== lastLangCode);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 10000 }} onClick={onClose}>
            <div className="modal-content w-full max-w-sm mx-4 shadow-2xl bg-white dark:bg-[#141417] rounded-3xl border border-black/10 dark:border-white/10" onClick={e => e.stopPropagation()}>
                <button className="modal-close z-10" onClick={onClose} aria-label="Tancar">
                    <X size={24} />
                </button>
                
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#ff6d23]/20 flex items-center justify-center text-[#ff6d23] flex-shrink-0">
                            <Globe size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-[var(--theme-accent-primary)] tracking-tight leading-tight">
                            Traduir Article
                        </h2>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 font-medium leading-relaxed">
                        Tria un idioma per traduir aquest contingut al moment mitjançant la malla neural OMEGA-39.
                    </p>

                    <div className="flex flex-col gap-2 mb-2">
                        {/* 1. L'IDIOMA RECORDAT (Destacat dalt) */}
                        {lastUsedLang && (
                            <div className="mb-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-[#ff6d23] opacity-80 mb-1 ml-1 block">Última elecció</span>
                                <button 
                                    onClick={() => handleTranslate(lastUsedLang.code)}
                                    className="flex items-center justify-between w-full p-4 rounded-xl bg-[#ff6d23]/10 border border-[#ff6d23]/50 hover:bg-[#ff6d23]/20 hover:shadow-[0_0_15px_rgba(255,109,35,0.3)] transition-all text-left group"
                                >
                                    <span className="font-black text-[#ff6d23]">
                                        {lastUsedLang.label}
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* 2. LA RESTA D'IDIOMES PRINCIPALS */}
                        {availableMainLangs.map(lang => (
                            <button 
                                key={lang.code}
                                onClick={() => handleTranslate(lang.code)}
                                className="flex items-center justify-between w-full p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15 hover:border-[#ff6d23]/50 hover:shadow-[0_0_15px_rgba(255,109,35,0.2)] transition-all text-left group"
                            >
                                <span className="font-bold text-[var(--text-main)] group-hover:text-[#ff6d23] transition-colors">
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                        
                        {/* 3. QUALSEVOL ALTRE IDIOMA (Google) */}
                        <button 
                            onClick={() => {
                                onClose();
                                const root = document.getElementById('google_translate_element');
                                if (!root) {
                                    const gtwrap = document.createElement('div');
                                    gtwrap.id = 'google_translate_element';
                                    gtwrap.style.position = 'fixed';
                                    gtwrap.style.bottom = '80px';
                                    gtwrap.style.right = '20px';
                                    gtwrap.style.zIndex = '99999';
                                    document.body.appendChild(gtwrap);

                                    window.googleTranslateElementInit = function() {
                                        new window.google.translate.TranslateElement(
                                            { pageLanguage: 'ca', autoDisplay: false }, 
                                            'google_translate_element'
                                        );
                                    };
                                    
                                    const script = document.createElement('script');
                                    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                                    document.body.appendChild(script);
                                } else {
                                    root.style.display = 'block';
                                }
                            }}
                            className="flex items-center justify-center gap-2 w-full p-3 mt-1 rounded-xl border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-all text-sm font-bold bg-transparent"
                        >
                            <Globe size={16} /> Google Translate / Més idiomes...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationModal;
