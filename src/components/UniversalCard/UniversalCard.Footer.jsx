import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    // Determine the main button text
    let buttonText = t('card.connect', "CONNECTAR");
    let icon = <Plus size={20} className="drop-shadow-sm" strokeWidth={2.5}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = t('card.connect', "CONNECTAR");
    } else if (cardVariant === 'pobles') {
        buttonText = t('card.visit', "VISITAR POBLE");
    } else if (item?.type === 'tramit') {
        buttonText = t('card.tramitar', "TRAMITAR");
    }

    const handleShareClick = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: displayTitle || 'Sóc de Poble',
                text: t('card.shareText', "Fes un cop d'ull a això en Sóc de Poble!"),
                url: window.location.href,
            }).catch((error) => console.log('Err sharing', error));
        }
    }

    const handleCommentClick = (e) => {
        e.stopPropagation();
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
        alert(t('card.translateAlert', "🌐 Motor de Traducció A Demanda (Vertex AI) prompte disponible."));
    };

    return (
        <div className="card-footer-master mt-auto">
            <div className="footer-actions-mur">
                <Button 
                    intent="primary"
                    shape="pill"
                    fullWidth
                    leftIcon={icon}
                    className="tracking-widest flex-1 min-w-0"
                    onClick={handleConnectClick}
                >
                    <span className="truncate">{buttonText}</span>
                </Button>
                <div className="footer-touch-group">
                    <button 
                        className="btn-touch translate-action-btn" 
                        onClick={handleTranslateClick} 
                        aria-label={t('card.translate', "Traduir Article")}
                        title={t('card.translate', "Traduir Article")}
                    >
                        <Globe size={22} strokeWidth={2.2} />
                    </button>
                    <button className="btn-touch" onClick={handleCommentClick} aria-label={t('card.comment', "Comentar")}>
                        <MessageCircle size={22} strokeWidth={2.2} />
                    </button>
                    <button className="btn-touch" onClick={handleShareClick} aria-label={t('card.share', "Compartir")}>
                        <Share2 size={22} strokeWidth={2.2} />
                    </button>
                    {isMaster && (
                        <button className="btn-touch" onClick={(e) => e.stopPropagation()} aria-label={t('card.options', "Opcions")}>
                            <MoreHorizontal size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalCardFooter;
