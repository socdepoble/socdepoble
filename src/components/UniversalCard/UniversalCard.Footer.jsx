import React from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, MoreHorizontal, MessageCircle, Globe, Plus } from 'lucide-react';
import RoundButton from '../ui/RoundButton';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick,
    itemCount,
    itemCountLabel,
    viewMode
}) => {
    const { t } = useTranslation();

    let titleText = t('card.connect', "Connectar");
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        titleText = t('card.connect', "Connectar");
    } else if (cardVariant === 'pobles') {
        titleText = t('card.connect', "Connectar");
    } else if (item?.type === 'tramit') {
        titleText = t('card.tramitar', "Tramitar");
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

    const isCalendar = cardVariant === 'calendar' || item?.type === 'calendar';

    return (
        <div className="flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 shadow-sm overflow-x-auto no-scrollbar transition-colors">

            {/* OPTIONAL ITEM COUNTER BADGE */}
            {itemCount !== undefined && (
                <div className="flex items-center justify-center bg-black/20 rounded-full px-3 py-1.5 shrink-0">
                    <div className="text-[11px] font-black tracking-widest text-white dark:text-[#111111] leading-none flex items-center">
                        <span>{itemCount}</span> <div className="text-white/70 dark:text-black/80 font-bold ml-1"><span>{itemCountLabel || 'ITEMS'}</span></div>
                    </div>
                </div>
            )}

            {/* ACTION BUTTONS (EDGE-TO-EDGE COMPACT) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-[11px] font-extrabold uppercase tracking-widest shrink-0">
                {!isCalendar && (
                    <button 
                        className="flex items-center gap-1 px-1.5 py-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" 
                        onClick={handleTranslateClick} 
                        aria-label={t('card.translate', "Traduir")}
                    >
                        <Globe size={16} strokeWidth={2.5} />
                        {viewMode !== 'grid' && <div className="hidden md:block"><span>{t('card.translate', "TRADUIR")}</span></div>}
                    </button>
                )}

                <button 
                    className="flex items-center gap-1 px-1.5 py-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" 
                    onClick={handleCommentClick} 
                    aria-label={t('card.comment', "Comentar")}
                >
                    <MessageCircle size={16} strokeWidth={2.5} />
                    {viewMode !== 'grid' && <div className="hidden sm:block"><span>{t('card.comment', "COMENTAR")}</span></div>}
                </button>

                <button 
                    className="flex items-center gap-1 px-1.5 py-1.5 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0"
                    onClick={handleShareClick} 
                    aria-label={t('card.share', "Compartir")}
                >
                    <Share2 size={16} strokeWidth={2.5} />
                    {viewMode !== 'grid' && <div className="hidden sm:block"><span>{t('card.share', "COMPARTIR")}</span></div>}
                </button>

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
                
                <RoundButton 
                    icon={Plus}
                    onClick={handleConnectClick}
                    title={titleText}
                    colorClass="bg-white/20 text-white hover:bg-white hover:text-[var(--theme-accent-primary)] border border-white/30"
                />
            </div>
        </div>
    );
};

export default UniversalCardFooter;
