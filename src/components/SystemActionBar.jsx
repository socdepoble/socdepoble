import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, MessageCircle, Share2, BookOpen } from 'lucide-react';
import TranslationModal from './TranslationModal';
import RoundButton from './ui/RoundButton';

const SystemActionBar = () => {
    const navigate = useNavigate();
    const [isTranslationOpen, setIsTranslationOpen] = useState(false);
    const [translating, setTranslating] = useState(false);

    return (
        <>
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 shadow-sm overflow-x-auto no-scrollbar transition-colors shrink-0">

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
