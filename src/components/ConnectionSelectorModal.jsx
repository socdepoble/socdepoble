import React from 'react';
import { X, Sparkles, Tag, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TagSelector from './TagSelector';
import './ConnectionSelectorModal.css';

/**
 * ConnectionSelectorModal [VOS]
 * Permet a l'usuari etiquetar una connexió i bategar amb el seu diccionari privat.
 */
const ConnectionSelectorModal = ({ isOpen, onClose, postId, currentTags = [], onUpdate }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-in" onClick={onClose}>
            <div className="connection-modal-content glass-morphism" onClick={e => e.stopPropagation()}>
                <header className="connection-modal-header">
                    <div className="header-icon">
                        <Sparkles size={18} />
                    </div>
                    <div className="header-title">
                        <h2>{t('feed.connect_title') || 'Connectar bategat'}</h2>
                        <p>{t('feed.connect_subtitle') || 'Afegeix etiquetes per a la teua llibreta privada'}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="connection-modal-body">
                    <TagSelector
                        currentTags={currentTags}
                        onTagsChange={onUpdate}
                    />
                </div>

                <footer className="connection-modal-footer">
                    <button className="confirm-btn" onClick={onClose}>
                        <Check size={18} />
                        <span>{t('common.done') || 'Fet'}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ConnectionSelectorModal;
