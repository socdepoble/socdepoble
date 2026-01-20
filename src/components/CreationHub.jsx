import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Newspaper, Store, MapPin, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CreationHub.css';

const CreationHub = () => {
    const { t } = useTranslation();
    const { isCreateModalOpen, setIsCreateModalOpen } = useAppContext();

    if (!isCreateModalOpen) return null;

    return (
        <div className="creation-hub-overlay" onClick={() => setIsCreateModalOpen(false)}>
            <div className="creation-hub-content" onClick={e => e.stopPropagation()}>
                <header className="creation-hub-header">
                    <h3>{t('common.create_new') || 'Què vols fer?'}</h3>
                    <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
                        <X size={24} />
                    </button>
                </header>

                <div className="creation-options">
                    <button className="creation-option" onClick={() => {
                        setIsCreateModalOpen(false);
                        // Trigger Feed modal - We'll need a way to trigger specific modals
                        window.dispatchEvent(new CustomEvent('open-create-post'));
                    }}>
                        <div className="option-icon mur">
                            <Newspaper size={28} />
                        </div>
                        <span>{t('nav.feed')}</span>
                    </button>

                    <button className="creation-option" onClick={() => {
                        setIsCreateModalOpen(false);
                        window.dispatchEvent(new CustomEvent('open-add-market-item'));
                    }}>
                        <div className="option-icon mercat">
                            <Store size={28} />
                        </div>
                        <span>{t('nav.market')}</span>
                    </button>

                    <button className="creation-option" onClick={() => setIsCreateModalOpen(false)}>
                        <div className="option-icon pobles">
                            <MapPin size={28} />
                        </div>
                        <span>{t('nav.towns')}</span>
                    </button>

                    <button className="creation-option" onClick={() => setIsCreateModalOpen(false)}>
                        <div className="option-icon grups">
                            <Users size={28} />
                        </div>
                        <span>{t('nav.groups') || 'Grups'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreationHub;
