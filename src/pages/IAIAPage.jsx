import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sprout, Users, MessageCircle, Heart } from 'lucide-react';
import './IAIAPage.css';

const IAIAPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="iaia-page-container">
            <header className="iaia-page-header">
                <button onClick={() => navigate(-1)} className="back-btn-iaia">
                    <ArrowLeft size={24} />
                </button>
                <div className="iaia-header-hero">
                    <div className="iaia-avatar-huge">🤖</div>
                    <h1>{t('iaia_page.title')}</h1>
                    <p className="iaia-subtitle">{t('iaia_page.subtitle')}</p>
                </div>
            </header>

            <main className="iaia-page-content">
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
