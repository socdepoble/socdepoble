import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, MessageCircle, Share2, BookOpen, FileText } from 'lucide-react';
import TranslationModal from './TranslationModal';
import { toast } from 'react-hot-toast';

const SystemActionBar = () => {
    const navigate = useNavigate();
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [bookStats, setBookStats] = useState({ isBook: false, a4: 0, amazon: 0, words: 0 });

    useEffect(() => {
        const updateStats = () => {
            // Check if there is structure (H2, H3, etc.) indicating a book
            const hasStructure = document.querySelector('h1, h2, h3');
            if (hasStructure) {
                // Approximate word count from the main content area or the body
                const contentArea = document.querySelector('main, article, .ProseMirror') || document.body;
                const text = contentArea.innerText || "";
                const words = text.split(/\s+/).filter(w => w.length > 0).length;
                
                // Conversions
                // A4: ~450 words/page
                // Amazon 6x9" (Paperback Trade): ~250 words/page
                setBookStats({
                    isBook: true,
                    a4: Math.max(1, Math.ceil(words / 450)),
                    amazon: Math.max(1, Math.ceil(words / 250)),
                    words: words
                });
            } else {
                setBookStats({ isBook: false, a4: 0, amazon: 0, words: 0 });
            }
        };

        updateStats();
        // Update stats every 3 seconds to be responsive
        const interval = setInterval(updateStats, 3000);
        return () => clearInterval(interval);
    }, []);

    const handlePageCountClick = () => {
        toast(() => (
            <div className="flex flex-col gap-2">
                <div className="font-bold border-b pb-1 dark:border-gray-700">Audit de Pàgines</div>
                <div className="text-sm">Format <b>A4</b>: {bookStats.a4} pàgines</div>
                <div className="text-sm">Format <b>Amazon (6x9")</b>: {bookStats.amazon} pàgines</div>
                <div className="text-xs text-gray-500 italic mt-1">Límit tècnic (Amazon KDP Paper Blanc): màx. 828 pàgines.</div>
                <div className="text-xs text-gray-500 italic">Mida actual: {bookStats.words} paraules.</div>
            </div>
        ), { duration: 5000 });
    };

    return (
        <>
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full h-[56px] min-h-[56px] max-h-[56px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 overflow-x-auto no-scrollbar transition-colors shrink-0">

                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-extrabold uppercase tracking-widest shrink-0">
                    <button 
                        className={`flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0 ${translating ? "text-[#ff6d23] dark:text-white animate-pulse" : ""}`}
                        title="Traduir Pàgina"
                        onClick={() => setIsTranslationOpen(true)}
                        disabled={translating}
                    >
                        <Globe size={16} strokeWidth={2.5} className={translating ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">{translating ? "TRADUINT..." : "TRADUIR"}</span>
                    </button>

                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Comentar al Xat"
                        onClick={() => navigate('/chats/socdepoble')}
                    >
                        <MessageCircle size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">COMENTAR</span>
                    </button>
                    
                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Compartir aquesta pàgina"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: 'Sóc de Poble', text: 'Descobreix la Xarxa Rural de Pobles Connectats', url: window.location.href }).catch(console.error);
                            }
                        }}
                    >
                        <Share2 size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">COMPARTIR</span>
                    </button>

                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        title="Llegir Llibre"
                        onClick={() => navigate('/llibre')}
                    >
                        <BookOpen size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">E-BOOK</span>
                    </button>

                    {bookStats.isBook && (
                        <button 
                            className="flex items-center gap-1.5 px-2 py-2 bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                            title="Auditar Pàgines"
                            onClick={handlePageCountClick}
                        >
                            <FileText size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">PÀGINES</span>
                            <span className="bg-[#ff6d23] dark:bg-black text-white dark:text-[#ff6d23] px-1.5 py-0.5 rounded-full text-[10px] ml-1">
                                {bookStats.amazon}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <TranslationModal 
                isOpen={isTranslationOpen} 
                onClose={() => setIsTranslationOpen(false)} 
                onTranslate={() => {
                    setIsTranslationOpen(false);
                    setTranslating(true);
                    setTimeout(() => setTranslating(false), 2000);
                }}
            />
        </>
    );
};

export default SystemActionBar;
