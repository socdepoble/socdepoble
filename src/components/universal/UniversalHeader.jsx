import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Book, Plus, MessageCircle, Share2, Globe } from 'lucide-react';
import { useModal } from '../../app/context/ModalContext';

const UniversalHeader = memo(({ 
    isIndexOpen, 
    onToggleIndex, 
    routeSlug, 
    title, 
    translating 
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { openTranslationModal } = useModal();

    return (
        <header className="w-full bg-[#4F46E5] text-white flex flex-col shrink-0 z-20 shadow-md relative">
            <div className="flex items-center justify-between min-h-[50px] sm:min-h-[56px] px-2 sm:px-4 flex-wrap relative">
                {/* Esquerra: Tornar i Llibre i Índex */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white font-bold" 
                        aria-label="Tornar"
                    >
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={onToggleIndex} 
                        className={`flex items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all font-bold ${isIndexOpen ? 'bg-white/20 text-white' : 'text-white'}`} 
                        title="Obrir Índex" 
                        aria-label="Obrir Índex"
                    >
                        <Book size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Dreta: Traductor, Comentar, Compartir, Connectar */}
                <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0">
                    <button 
                        onClick={() => openTranslationModal({ postId: routeSlug || 'projecte', title: title })} 
                        className={`flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all font-bold ${translating ? "animate-pulse" : ""}`}
                        aria-label="Traduir pàgina"
                    >
                        {translating ? (
                            <Globe size={20} className="animate-spin" />
                        ) : (
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" 
                                alt="Google Translate" 
                                className="w-[20px] h-[20px] drop-shadow-sm brightness-110" 
                            />
                        )}
                    </button>
                    <button 
                        onClick={() => navigate('/chats/socdepoble')} 
                        className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white" 
                        aria-label="Obrir xat"
                    >
                        <MessageCircle size={20} />
                    </button>
                    <button 
                        onClick={() => { if(navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href }) }} 
                        className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white" 
                        aria-label="Compartir pàgina"
                    >
                        <Share2 size={20} />
                    </button>
                    <button 
                        onClick={() => navigate('/connectar')} 
                        className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 rounded-full bg-white text-[#4F46E5] hover:bg-white/90 active:scale-95 transition-all font-black uppercase text-sm shadow-md ml-1"
                    >
                        <Plus size={20} strokeWidth={3} className="hidden sm:block" />
                        CONNECTAR
                    </button>
                </div>
            </div>
        </header>
    );
});

export default UniversalHeader;
