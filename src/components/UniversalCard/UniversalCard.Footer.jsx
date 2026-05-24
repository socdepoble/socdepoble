import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, MessageCircle, Share2, UserPlus, Edit, Landmark, Zap, Info, Languages, Plus } from 'lucide-react';
import { hapticService } from '../../core/services/hapticService';
import { useCart } from '../../app/context/CartContext';
import UniversalCardActionButton from './UniversalCard.ActionButton';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick,
    handleCardClick,
    itemCount,
    itemCountLabel,
    viewMode
}) => {
    const { t } = useTranslation();
    const { addToCart, setIsCartOpen } = useCart();

    const isMarket = cardVariant === 'mercat' || cardVariant === 'market' || item?.type === 'market_item' || item?.type === 'market';
    const isTramit = item?.type === 'tramit';
    const isCalendar = cardVariant === 'agenda' || cardVariant === 'event' || cardVariant === 'calendar' || item?.type === 'calendar';

    const handleShareClick = (e) => {
        if (e) e.stopPropagation();
        hapticService.playAtomicFeedback('action');
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
        hapticService.playAtomicFeedback('action');
        const id = item?.uuid || item?.id;
        if (isMarket) {
            navigate(`/mercat/${id}?action=comment`);
        } else {
            navigate(`/post/${id}?action=comment`);
        }
    };

    const handleMainActionClick = (e) => {
        if (e) e.stopPropagation();
        hapticService.playAtomicFeedback('success'); 
        
        if (isMarket) {
            addToCart(item, 1);
            setIsCartOpen(true);
        } else if (handleConnectClick) {
            handleConnectClick(e);
        } else if (handleCardClick) {
            handleCardClick(e);
        }
    };

    // Determine the main action button text and function based on context
    let actionText = 'CONNECTAR';
    let actionFunction = handleMainActionClick; // By default, this checks isMarket but let's override

    // Override the main action click for market items to trigger connect instead of add to cart if requested
    const executeConnectAction = (e) => {
        if (e) e.stopPropagation();
        hapticService.playAtomicFeedback('success'); 
        if (handleConnectClick) {
            handleConnectClick(e);
        } else if (handleCardClick) {
            handleCardClick(e);
        } else {
            // Default connection routing
            const id = item?.uuid || item?.id;
            navigate(`/perfil/${item?.author_id || 'socdepoble'}?action=connect`);
        }
    };

    if (isTramit) {
        actionText = item?.actionLabel || 'TRAMITAR';
        actionFunction = (e) => { e.stopPropagation(); navigate('/ofici'); };
    } else if (isMaster) {
        actionText = 'RECTIFICAR';
        actionFunction = (e) => { e.stopPropagation(); navigate(`/edit/${item?.id}`); };
    } else {
        // ALWAYS use CONNECTAR for cards at this level (including Market)
        actionText = 'CONNECTAR';
        actionFunction = executeConnectAction;
    }

    return (
        <div className="w-full bg-[#4F46E5] dark:bg-[#F97316] text-white flex justify-between items-center pl-4 pr-[10px] py-0 h-[64px] min-h-[64px] max-h-[64px] shrink-0 rounded-b-[28px] overflow-hidden">
            {/* Left side: Icons */}
            <div className="flex items-center gap-5">
                <button className="hover:opacity-80 transition-opacity flex items-center justify-center p-1" aria-label="Traduir" onClick={(e) => { e.stopPropagation(); hapticService.playAtomicFeedback('action'); }}>
                    <Languages size={22} color="white" strokeWidth={1.5} />
                </button>
                <button className="hover:opacity-80 transition-opacity flex items-center justify-center p-1" onClick={handleCommentClick} aria-label={t('card.comment', 'Comentar')}>
                    <MessageCircle size={22} color="white" />
                </button>
                <button className="hover:opacity-80 transition-opacity flex items-center justify-center p-1" onClick={handleShareClick} aria-label={t('card.share', 'Compartir')}>
                    <Share2 size={22} color="white" />
                </button>
            </div>

            <div className="flex-shrink-0 ml-4">
                <UniversalCardActionButton 
                    variant="blue"
                    onClick={actionFunction}
                    className="font-black tracking-widest text-[13px] uppercase"
                >
                    <div className="flex flex-row items-center gap-1.5">
                        <span>{actionText}</span> <Plus size={16} strokeWidth={3} />
                    </div>
                </UniversalCardActionButton>
            </div>
        </div>
    );
};

export default UniversalCardFooter;
