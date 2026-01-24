import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sprout, Users, MessageCircle, Heart, Sparkles, User } from 'lucide-react';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO';
import './IAIAPage.css';

const IAIAPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { visionMode, setVisionMode } = useUI();

    return (
        <div className="iaia-page-container">
            <SEO
                title={t('iaia_page.title') || 'La IAIA'}
                description={t('iaia_page.subtitle') || 'Memòria viva i acció artificial al servici del poble.'}
                image="/og-image.png"
            />
            <header className="iaia-page-header">
                <button onClick={() => navigate(-1)} className="back-btn-iaia">
                    <ArrowLeft size={24} />
                </button>
                <div className="iaia-header-hero">
                    <div className="iaia-avatar-huge">👵✨</div>
                    <h1>{t('iaia_page.title')}</h1>
                    <p className="iaia-subtitle">{t('iaia_page.subtitle')}</p>
                </div>
            </header>

            <main className="iaia-page-content">
                <section className="vision-mode-selector-premium">
                    <div className="vision-selector-header">
                        <h2>Tria la teua experiència</h2>
                        <p>Com vols viure Sóc de Poble hui?</p>
                    </div>

                    <div className="vision-options-grid">
                        <button
                            className={`vision-option-card ${visionMode === 'hibrida' ? 'active' : ''}`}
                            onClick={() => setVisionMode('hibrida')}
                        >
                            <div className="option-icon"><Sparkles size={32} /></div>
                            <div className="option-info">
                                <h3>Mode Híbrid</h3>
                                <p>Viu la història del poble amb la IAIA i els seus personatges.</p>
                            </div>
                            <div className="status-indicator"></div>
                        </button>

                        <button
                            className={`vision-option-card ${visionMode === 'humana' ? 'active' : ''}`}
                            onClick={() => setVisionMode('humana')}
                        >
                            <div className="option-icon"><User size={32} /></div>
                            <div className="option-info">
                                <h3>Mode Humà</h3>
                                <p>Conecta només amb els teus veïns reals, sense ficció.</p>
                            </div>
                            <div className="status-indicator"></div>
                        </button>
                    </div>
                </section>
                <section className="iaia-section intro-card">
                    <div className="section-icon"><Heart size={32} color="var(--color-primary)" /></div>
                    <h2>{t('iaia_page.who_am_i')}</h2>
                    <p>{t('iaia_page.who_am_i_text')}</p>
                </section>

                <section className="iaia-section features-grid">
                    <h2>{t('iaia_page.what_do_i_do')}</h2>

                    <div className="feature-item">
                        <BookOpen size={28} />
                        <h3>{t('iaia_page.feature_1_title')}</h3>
                        <p>{t('iaia_page.feature_1_desc')}</p>
                    </div>

                    <div className="feature-item">
                        <Sprout size={28} />
                        <h3>{t('iaia_page.feature_2_title')}</h3>
                        <p>{t('iaia_page.feature_2_desc')}</p>
                    </div>

                    <div className="feature-item">
                        <Users size={28} />
                        <h3>{t('iaia_page.feature_3_title')}</h3>
                        <p>{t('iaia_page.feature_3_desc')}</p>
                    </div>
                </section>

                <div className="iaia-cta-box">
                    <button className="btn-primary rectangular" onClick={() => navigate('/chats')}>
                        <MessageCircle size={20} />
                        {t('iaia_page.cta_button')}
                    </button>
                </div>

                <footer className="iaia-page-footer">
                    <p>✨ {t('iaia_page.footer_text')}</p>
                </footer>
            </main>
        </div>
    );
};

export default IAIAPage;
