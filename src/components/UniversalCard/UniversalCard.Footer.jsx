import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Share2, MoreHorizontal, MessageCircle, Globe, BookOpen } from 'lucide-react';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick,
    itemCount,
    itemCountLabel
}) => {
    const { t } = useTranslation();

    // Determine the main button text
    let buttonText = t('card.connect', "CONNECTAR");
    let icon = <Plus size={14} className="drop-shadow-sm" strokeWidth={3}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = t('card.connect', "CONNECTAR");
    } else if (cardVariant === 'pobles') {
        buttonText = t('card.visit', "VISITAR");
    } else if (item?.type === 'tramit') {
        buttonText = t('card.tramitar', "TRAMITAR");
    }

    const handleShareClick = (e) => {
        if (e) e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: displayTitle || 'Sóc de Poble',
                text: t('card.shareText', "Fes un cop d'ull a això en Sóc de Poble!"),
                url: window.location.href,
            }).catch((error) => console.log('Err sharing', error));
        }
    }

    const handleCommentClick = (e) => {
        if (e) e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}?action=comment`);
        } else {
            navigate(`/post/${id}?action=comment`);
        }
    };

    const handleTranslateClick = (e) => {
        if (e) e.stopPropagation();
        const id = item?.uuid || item?.id;
        window.dispatchEvent(new CustomEvent('omega-translate-request', { detail: { postId: id, title: displayTitle } }));
        alert(t('card.translateAlert', "🌐 Motor de Traducció A Demanda (Vertex AI) prompte disponible."));
    };

    const handleEbookClick = (e) => {
        if (e) e.stopPropagation();
        alert(t('card.ebookAlert', "📘 Generació d'E-Book properament."));
    };

    const isCalendar = cardVariant === 'calendar' || item?.type === 'calendar';

    return (
        <div className="flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 shadow-sm overflow-x-auto no-scrollbar transition-colors">
            {/* COMPACT CONNECT BUTTON */}
            <button 
                className="flex items-center justify-center gap-1.5 rounded-full bg-[#F97316] text-white dark:bg-[#4F46E5] dark:text-white px-4 py-1.5 font-sans text-xs font-bold tracking-wide transition-opacity active:scale-95 touch-manipulation whitespace-nowrap shrink-0 shadow-md"
                onClick={handleConnectClick}
            >
                {icon}
                <span className="truncate">{buttonText}</span>
            </button>

            {/* OPTIONAL ITEM COUNTER BADGE */}
            {itemCount !== undefined && (
                <div className="flex items-center justify-center bg-black/20 rounded-full px-3 py-1.5 shrink-0">
                    <span className="text-[11px] font-black tracking-widest text-white dark:text-[#111111] leading-none">
                        {itemCount} <span className="text-white/70 dark:text-black/80 font-bold ml-1">{itemCountLabel || 'ITEMS'}</span>
                    </span>
                </div>
            )}

            {/* ACTION BUTTONS (EDGE-TO-EDGE COMPACT) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-extrabold uppercase tracking-widest shrink-0">
                {!isCalendar && (
                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" 
                        onClick={handleTranslateClick} 
                        aria-label={t('card.translate', "Traduir")}
                    >
                        <Globe size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{t('card.translate', "TRADUIR")}</span>
                    </button>
                )}

                <button 
                    className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" 
                    onClick={handleCommentClick} 
                    aria-label={t('card.comment', "Comentar")}
                >
                    <MessageCircle size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t('card.comment', "COMENTAR")}</span>
                </button>

                <button 
                    className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                    onClick={handleShareClick} 
                    aria-label={t('card.share', "Compartir")}
                >
                    <Share2 size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t('card.share', "COMPARTIR")}</span>
                </button>

                {!isCalendar && (
                    <button 
                        className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                        onClick={handleEbookClick} 
                        aria-label={t('card.ebook', "E-Book")}
                    >
                        <BookOpen size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{t('card.ebook', "E-BOOK")}</span>
                    </button>
                )}

                {isMaster && (
                    <button 
                        className="flex items-center justify-center px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 shrink-0" 
                        onClick={(e) => {
                            if (e) e.stopPropagation();
                        }} 
                        aria-label={t('card.options', "Opcions")}
                    >
                        <MoreHorizontal size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default UniversalCardFooter;
