import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Newspaper, Store, MapPin, Users, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './CreationHub.css';

const CreationHub = () => {
    const { t } = useTranslation();
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        openPostModal,
        setIsEventModalOpen,
        setIsMarketModalOpen
    } = useUI();
    const { isSuperAdmin } = useAuth();
    const navigate = useNavigate();

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
                        openPostModal();
                    }}>
                        <div className="option-icon mur">
                            <Newspaper size={28} />
                        </div>
                        <span>{t('nav.feed')}</span>
                    </button>

                    <button className="creation-option" onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsMarketModalOpen(true);
                    }}>
                        <div className="option-icon mercat">
                            <Store size={28} />
                        </div>
                        <span>{t('nav.market')}</span>
                    </button>

                    <button className="creation-option" onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsEventModalOpen(true);
                    }}>
                        <div className="option-icon pobles">
                            <Calendar size={28} />
                        </div>
                        <span>{t('nav.events') || 'Esdeveniments'}</span>
                    </button>

                    <button className="creation-option" onClick={() => {
                        setIsCreateModalOpen(false);
                        openPostModal({ isPrivate: true });
                    }}>
                        <div className="option-icon grups">
                            <Users size={28} />
                        </div>
                        <span>{t('nav.work_groups')}</span>
                    </button>

                    {isSuperAdmin && (
                        <button className="creation-option admin" onClick={() => {
                            setIsCreateModalOpen(false);
                            navigate('/admin');
                        }}>
                            <div className="option-icon admin">
                                <Shield size={28} />
                            </div>
                            <span>ADMIN</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreationHub;
