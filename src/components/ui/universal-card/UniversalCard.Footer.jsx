import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Share2, UserPlus, Landmark, Plus } from 'lucide-react';
import { hapticService } from '../../../core/services/hapticService';
import { useCart } from '../../../app/context/CartContext';
import { useModal } from '../../../app/context/ModalContext';
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
    const { t, i18n } = useTranslation();
    const { addToCart, setIsCartOpen } = useCart();
    const { openTranslationModal } = useModal();
    
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'comment' or 'connect'

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

    const handleTranslateClick = (e) => {
        if (e) e.stopPropagation();
        hapticService.playAtomicFeedback('action');
        const uniqueId = item?.id || item?.uuid || displayTitle;
        openTranslationModal({ postId: uniqueId, title: displayTitle || item?.title || 'Contingut' });
    };

    const handleCommentClick = (e) => {
        if (e) e.stopPropagation();
        hapticService.playAtomicFeedback('action');
        setPendingAction('comment');
        setIsSelectorOpen(true);
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

    let actionText = 'CONNECTAR';
    let actionFunction = handleMainActionClick; 

    const executeConnectAction = (e) => {
        if (e) e.stopPropagation();
        hapticService.playAtomicFeedback('success'); 
        if (handleConnectClick) {
            handleConnectClick(e);
        } else if (handleCardClick) {
            handleCardClick(e);
        } else {
            setPendingAction('connect');
            setIsSelectorOpen(true);
        }
    };

    if (isTramit) {
        actionText = item?.actionLabel || 'TRAMITAR';
        actionFunction = (e) => { e.stopPropagation(); navigate('/ofici'); };
    } else if (isMaster) {
        actionText = 'RECTIFICAR';
        actionFunction = (e) => { e.stopPropagation(); navigate(`/edit/${item?.id}`); };
    } else {
        actionText = 'CONNECTAR';
        actionFunction = executeConnectAction;
    }

    return (
        <>
            <div className="w-full bg-[#4F46E5] dark:bg-[#F97316] text-white flex justify-between items-center pl-4 pr-[10px] py-0 h-[56px] min-h-[56px] max-h-[56px] shrink-0 overflow-hidden">
                <div className="flex items-center gap-5">
                    <button className="hover:opacity-80 transition-opacity flex items-center justify-center p-1" aria-label="Traduir" onClick={handleTranslateClick}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Google Translate" className="w-[22px] h-[22px] object-contain drop-shadow-sm brightness-110" />
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
                        ariaLabel={actionText}
                        leftIcon={<Plus size={16} strokeWidth={3} />}
                    >
                        {actionText}
                    </UniversalCardActionButton>
                </div>
            </div>

            {isSelectorOpen && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" 
                    onClick={(e) => { e.stopPropagation(); setIsSelectorOpen(false); }}
                    role="presentation"
                >
                    <div 
                        className="bg-theme-base border border-theme-border p-6 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col gap-4" 
                        onClick={e => e.stopPropagation()}
                        role="dialog"
                        aria-label="Selector de connexió"
                    >
                        <h3 className="font-black text-xl text-center mb-2 uppercase text-theme-text">Amb qui vols {pendingAction === 'comment' ? 'parlar' : 'connectar'}?</h3>
                        
                        <button 
                            className="w-full bg-[#4F46E5] text-white p-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 shadow-[0_4px_14px_rgba(79,70,229,0.3)] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 dark:focus:ring-offset-[#111111]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSelectorOpen(false);
                                navigate(`/chats/${item?.town_id || 'socdepoble'}`);
                            }}
                        >
                            {(() => {
                                const townFallback = (item?.town_name || item?.town || 'Sóc de Poble').toLowerCase();
                                const isSocDePoble = townFallback === 'sóc de poble' || townFallback === 'soc de poble';
                                const entityAvatar = isSocDePoble ? '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg' : (item?.town_logo || item?.entity_avatar || item?.avatar_url);
                                
                                if (entityAvatar) {
                                    return <img src={entityAvatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0 border border-white/20 shadow-sm bg-white/10" />;
                                }
                                return (
                                    <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                        <Landmark size={22} className="opacity-90" />
                                    </div>
                                );
                            })()}
                            <div className="flex flex-col text-left">
                                <span className="text-lg leading-tight">{item?.town_name || item?.town || 'Sóc de Poble'}</span>
                                <span className="text-xs opacity-90 font-medium tracking-wider">
                                    {(() => {
                                        const townName = (item?.town_name || item?.town || 'Sóc de Poble').toLowerCase();
                                        if (townName === 'sóc de poble' || townName === 'soc de poble') return "Empresa";
                                        
                                        const tType = (item?.type || item?.entity_type || '').toLowerCase();
                                        const role = (item?.author_role || '').toLowerCase();
                                        
                                        if (tType.includes('ajuntament') || item?.is_official || role === 'official') return "Ajuntament";
                                        if (tType.includes('grup') || tType.includes('group') || tType.includes('entitat')) return "Grup";
                                        if (tType.includes('empresa') || tType.includes('market') || role === 'business') return "Empresa";
                                        return "Portal Oficial";
                                    })()}
                                </span>
                            </div>
                        </button>

                        <button 
                            className="w-full bg-[#F97316] text-white p-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSelectorOpen(false);
                                navigate(`/chats/${item?.author_id || item?.id || '0001'}`);
                            }}
                        >
                            {(() => {
                                const isJavi = item?.author_name === 'Sóc de Poble' || item?.author_name === 'Javi Llinares';
                                const avatarSrc = isJavi ? '/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg' : (item?.author_avatar || item?.avatar_url);
                                
                                if (avatarSrc) {
                                    return <img src={avatarSrc} alt="" className="w-11 h-11 rounded-full object-cover shrink-0 border border-white/20 shadow-sm bg-white/10" />;
                                }
                                return (
                                    <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                        <UserPlus size={22} className="opacity-90" />
                                    </div>
                                );
                            })()}
                            <div className="flex flex-col text-left">
                                <span className="text-lg leading-tight">
                                    {item?.author_name === 'Sóc de Poble' ? 'Javi Llinares' : (item?.author_name || item?.seller || 'Javi Llinares')}
                                </span>
                                <span className="text-xs opacity-90 font-medium">
                                    {(() => {
                                        let role = item?.author_function || (item?.author_role && item.author_role !== 'user' && item.author_role !== 'business' && item.author_role !== 'official' ? item.author_role.charAt(0).toUpperCase() + item.author_role.slice(1) : null);
                                        
                                        if (item?.author_name === 'Sóc de Poble' || item?.author_name === 'Javi Llinares') {
                                            return "Coordinador del projecte Sóc de Poble";
                                        }
                                        
                                        return role ? role : "Autor de la publicació";
                                    })()}
                                </span>
                            </div>
                        </button>

                        <button 
                            className="w-full mt-2 p-3 text-theme-text opacity-50 hover:opacity-100 font-bold uppercase tracking-widest text-sm transition-opacity"
                            onClick={(e) => { e.stopPropagation(); setIsSelectorOpen(false); }}
                        >
                            Cancel·lar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UniversalCardFooter;
