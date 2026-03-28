import React from 'react';
import { Plus, Share2, MoreHorizontal, MessageCircle, Globe } from 'lucide-react';
import { Button } from '../../design-system/components/Button';

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

    const handleTranslateClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        // OMEGA-39: Lanzará un trigger hacia el gestor de IA cuando la infraestructura Vertex esté enchufada
        window.dispatchEvent(new CustomEvent('omega-translate-request', { detail: { postId: id, title: displayTitle } }));
        alert("🌐 Motor de Traducció A Demanda (Vertex AI) prompte disponible.");
    };

    return (
        <div className="card-footer-master mt-auto">
            <div className="footer-actions-mur">
                <button 
                    className="btn-touch translate-action-btn" 
                    onClick={handleTranslateClick} 
                    aria-label="Traduir Article"
                    title="Traduir Article"
                >
                    <Globe size={20} strokeWidth={2.5} />
                </button>
                <Button 
                    intent="primary"
                    shape="pill"
                    fullWidth
                    leftIcon={icon}
                    className="tracking-widest"
                    onClick={handleConnectClick}
                >
                    {buttonText}
                </Button>
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
