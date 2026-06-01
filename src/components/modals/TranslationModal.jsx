import React, { useEffect } from 'react';
import { X, Globe } from 'lucide-react';

const TranslationModal = ({ isOpen, onClose, config }) => {
    useEffect(() => {
        if (!document.getElementById('google-translate-script')) {
            let gtDiv = document.createElement('div');
            gtDiv.id = 'google_translate_global_container';
            gtDiv.style.display = 'none';
            document.body.appendChild(gtDiv);

            window.googleTranslateElementInit = function() {
                new window.google.translate.TranslateElement(
                    { pageLanguage: 'ca', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE }, 
                    'google_translate_global_container'
                );
            };
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            // AÏLLAMENT INSTANTANI: Protegim totes les targetes excepte la seleccionada
            const targetId = String(config?.postId);
            if (targetId && targetId !== 'undefined') {
                document.querySelectorAll('.universal-card-wrapper').forEach(card => {
                    if (card.dataset.postId === targetId) {
                        card.classList.remove('notranslate');
                    } else {
                        card.classList.add('notranslate');
                    }
                });
            }
        }
        return () => {
            // Tornem el giny al seu lloc original a l'arrel en tancar el modal
            const rootDiv = document.getElementById('google_translate_global_container');
            if (rootDiv) {
                document.body.appendChild(rootDiv);
                rootDiv.style.display = 'none'; // Amagar-lo de nou
            }
            
            // Restaurem l'estat per defecte (llevant el notranslate forçat) per a futures visualitzacions
            document.querySelectorAll('.universal-card-wrapper').forEach(card => {
                card.classList.remove('notranslate');
            });
        };
    }, [isOpen, config?.postId]);

    useEffect(() => {
        const gtDiv = document.getElementById('google_translate_global_container');
        const inlineWrapper = document.getElementById('google_translate_inline_wrapper');
        
        if (isOpen && gtDiv && inlineWrapper) {
            gtDiv.style.display = 'block';
            inlineWrapper.appendChild(gtDiv);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRestore = () => {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname + ";";
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 notranslate" style={{ zIndex: 10000 }} onClick={onClose}>
            <div className="relative w-full max-w-sm mx-4 shadow-2xl bg-white dark:bg-[#141417] rounded-3xl border border-black/10 dark:border-white/10" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors z-10" onClick={onClose} aria-label="Tancar">
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#ff6d23]/20 flex items-center justify-center text-[#ff6d23] flex-shrink-0">
                            <Globe size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black text-[var(--theme-accent-primary)] tracking-tight leading-tight">
                            Traduir Contingut
                        </h2>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 font-medium leading-relaxed">
                        Tria un idioma al desplegable per traduir la targeta automàticament.
                    </p>

                    <div className="flex flex-col gap-2 mb-2">
                        {/* BOTÓ TORNAR A L'ORIGINAL */}
                        <button 
                            onClick={handleRestore}
                            className="flex items-center justify-center w-full p-3.5 mb-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-center group"
                        >
                            <span className="font-bold text-gray-700 dark:text-gray-300">
                                Restaurar Original (Valencià)
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <style>{`
                            #google_translate_inline_wrapper {
                                width: 100%;
                            }
                            #google_translate_inline_wrapper .goog-te-gadget {
                                width: 100% !important;
                                font-size: 0px !important; /* Hides "Powered by" text */
                                color: transparent !important;
                                display: flex !important;
                                flex-direction: column;
                            }
                            #google_translate_inline_wrapper .goog-te-gadget > div {
                                width: 100% !important;
                            }
                            #google_translate_inline_wrapper .goog-te-combo {
                                width: 100% !important;
                                padding: 12px 16px !important;
                                margin: 0 !important;
                                border-radius: 12px !important;
                                background-color: transparent !important;
                                border: 1px solid rgba(0,0,0,0.1) !important;
                                font-size: 14px !important;
                                font-weight: 600 !important;
                                color: #374151 !important;
                                outline: none !important;
                                cursor: pointer !important;
                            }
                            .dark #google_translate_inline_wrapper .goog-te-combo {
                                color: #e5e7eb !important;
                                border-color: rgba(255,255,255,0.1) !important;
                            }
                            .dark #google_translate_inline_wrapper .goog-te-combo option {
                                background-color: #141417 !important;
                                color: #e5e7eb !important;
                            }
                            /* Hide the Google Logo */
                            #google_translate_inline_wrapper .goog-logo-link {
                                display: none !important;
                            }
                            #google_translate_inline_wrapper .goog-te-gadget img {
                                display: none !important;
                            }
                        `}</style>
                        <div className="w-full flex items-center justify-center p-1 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5" id="google_translate_inline_wrapper">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationModal;
