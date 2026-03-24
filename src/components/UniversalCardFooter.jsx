import React from 'react';
import { Plus, Share2, MoreHorizontal, MessageCircle } from 'lucide-react';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick
}) => {
    // Determine the main button text
    let buttonText = "CONNECTAR";
    let icon = <Plus size={20} className="drop-shadow-sm" strokeWidth={2.5}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = "CONNECTAR";
    } else if (cardVariant === 'pobles') {
        buttonText = "VISITAR POBLE";
    } else if (item?.type === 'tramit') {
        buttonText = "TRAMITAR";
    }

    const handleShareClick = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: displayTitle || 'Sóc de Poble',
                text: 'Fes un cop d\'ull a això en Sóc de Poble!',
                url: window.location.href,
            }).catch((error) => console.log('Err sharing', error));
        }
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        // The user mentioned this sends them to the Chat of the author to talk about the product.
        // For now, we open the Post Detail View with a comment intent, or navigate to chat.
        const id = item?.uuid || item?.id;
        if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}?action=comment`);
        } else {
            navigate(`/post/${id}?action=comment`);
        }
    };

    return (
        <div className="card-footer-master mt-auto">
            <div className="footer-actions-mur">
                <button 
                    className="master-action-btn connect-btn w-full h-10 flex items-center justify-center gap-2 font-black tracking-widest text-[14px] rounded-full drop-shadow-md transition-all hover:scale-[1.02] hover:brightness-110"
                    style={{ backgroundColor: 'var(--theme-accent-primary)', color: 'var(--on-theme-accent-primary)', border: 'none' }}
                    onClick={handleConnectClick}
                >
                    {icon} {buttonText}
                </button>
                <div className="footer-touch-group">
                    <button className="btn-touch" onClick={handleCommentClick} aria-label="Comentar">
                        <MessageCircle size={22} strokeWidth={2.2} />
                    </button>
                    <button className="btn-touch" onClick={handleShareClick} aria-label="Compartir">
                        <Share2 size={22} strokeWidth={2.2} />
                    </button>
                    {isMaster && (
                        <button className="btn-touch" onClick={(e) => e.stopPropagation()} aria-label="Opcions">
                            <MoreHorizontal size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalCardFooter;
