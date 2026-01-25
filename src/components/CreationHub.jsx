import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Newspaper, Store, MapPin, Users, Shield, Calendar, Bot, Share2, Rocket, LogOut } from 'lucide-react';
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
    const { isSuperAdmin, isAdmin, logout } = useAuth();
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

                <div className="creation-hub-main-actions">
                    <button className="logout-hub-top-btn" onClick={() => {
                        setIsCreateModalOpen(false);
                        logout();
                        navigate('/login');
                    }}>
                        <LogOut size={24} />
                        <span>Eixir d'aquesta xarxa social</span>
                    </button>

                    <button className="share-full-frame" onClick={() => {
                        setIsCreateModalOpen(false);
                        const shareData = {
                            title: 'Sóc de Poble',
                            text: 'Connecta amb la teua comunitat. Notícies, mercat i esdeveniments al teu poble.',
                            url: window.location.origin
                        };
                        if (navigator.share) {
                            navigator.share(shareData);
                        } else {
                            navigator.clipboard.writeText(shareData.url);
                            alert('Enllaç del portal copiat!');
                        }
                    }}>
                        <Share2 size={24} />
                        <span>Compartir en altres xarxes socials</span>
                    </button>

                    {(isSuperAdmin || isAdmin) && (
                        <button className="share-full-frame admin-btn-styled" onClick={() => {
                            setIsCreateModalOpen(false);
                            navigate('/admin');
                        }}>
                            <Shield size={24} />
                            <span>ACCÉS ADMINISTRACIÓ</span>
                        </button>
                    )}

                    <button className="share-full-frame project-btn-styled" onClick={() => {
                        setIsCreateModalOpen(false);
                        navigate('/projecte');
                    }}>
                        <Rocket size={24} />
                        <span>SÓC DE POBLE: PROJECTE</span>
                    </button>
                </div>

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
                        navigate('/iaia');
                    }}>
                        <div className="option-icon iaia-accent">
                            <Bot size={28} />
                        </div>
                        <span>{t('iaia_page.title')}</span>
                    </button>
                </div>


            </div>
        </div>
    );
};

export default CreationHub;
