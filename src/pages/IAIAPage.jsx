import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sprout, Users, MessageCircle, Heart, Sparkles, User, Clock, BellRing, Shield, Mic } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import './IAIAPage.css';

import { feedbackService } from '../services/feedbackService';
import VoiceRecorder from '../components/VoiceRecorder';

const IAIAPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { visionMode, setVisionMode } = useUI();
    const [showVoiceRecorder, setShowVoiceRecorder] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [feedbackSent, setFeedbackSent] = React.useState(false);
    const shareUrl = `${window.location.origin}/iaia`;

    const handleVoiceSend = async (audioBlob, duration, transcript) => {
        setIsSubmitting(true);
        const result = await feedbackService.sendVoiceFeedback(audioBlob, duration, transcript, {
            context: 'IAIAPage Sugestió',
            visionMode
        });

        if (result.success) {
            setFeedbackSent(true);
            setTimeout(() => setFeedbackSent(false), 3000);
        }
        setShowVoiceRecorder(false);
        setIsSubmitting(false);
    };

    return (
        <div className="iaia-page-container">
            <SEO
                title={t('iaia_page.title') || 'La IAIA'}
                description={t('iaia_page.subtitle') || 'Memòria viva i acció artificial al servici del poble.'}
                image="/og-image.png"
                url="/iaia"
            />
            <header className="iaia-page-header">
                <button onClick={() => navigate(-1)} className="back-btn-iaia">
                    <ArrowLeft size={24} />
                </button>
                <div className="iaia-share-btn-wrapper">
                    <ShareHub
                        title="La IAIA - Sóc de Poble"
                        text="Coneix a la IAIA, la memòria viva i digital del nostre poble. 👵✨"
                        url={shareUrl}
                    />
                </div>
                <div className="iaia-header-hero">
                    <div className="iaia-avatar-container">
                        <img
                            src="/iaia_digital_matriarch.png"
                            alt="La IAIA - Sóc de Poble"
                            className="iaia-premium-portrait"
                        />
                    </div>
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

                <section className="iaia-section healthy-menus-preview">
                    <div className="section-icon"><Sprout size={32} color="var(--color-primary)" /></div>
                    <h2>Propostes Saludables d'Anna Climent</h2>
                    <p>En col·laboració amb Anna, hem preparat una selecció de menús i entrepans que cuiden de la teua salut i de la tradició del poble.</p>
                    <div className="healthy-menus-grid">
                        <div className="menu-card">
                            <h3>Entrepans de bar</h3>
                            <ul>
                                <li>Pà integral amb calamars i bajoca</li>
                                <li>Esgarraret premium amb oli d'oliva</li>
                                <li>Sèpia a la planxa amb tomaca</li>
                            </ul>
                            <button className="btn-text" onClick={() => navigate('/chats/iaia')}>
                                Demana'm la recepta completa 👵✨
                            </button>
                        </div>
                    </div>
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

                    <div className="feature-item highlight">
                        <Clock size={28} />
                        <h3>{t('iaia_page.tamagotchi_title')}</h3>
                        <p>{t('iaia_page.tamagotchi_desc')}</p>
                    </div>

                    <div className="feature-item highlight">
                        <BellRing size={28} />
                        <h3>{t('iaia_page.push_notif_title')}</h3>
                        <p>{t('iaia_page.push_notif_desc')}</p>
                    </div>

                    <div className="feature-item highlight">
                        <Shield size={28} />
                        <h3>{t('iaia_page.transparency_title')}</h3>
                        <p>{t('iaia_page.transparency_desc')}</p>
                    </div>
                </section>

                <section className="iaia-section project-credits-card">
                    <div className="section-icon"><Shield size={32} color="var(--color-primary)" /></div>
                    <h2>Crèdits i Equip de Somni</h2>
                    <div className="credits-list">
                        <div className="credit-item">
                            <strong>Javi Linares</strong>
                            <span>Visió, Concepte i Super Padrí</span>
                        </div>
                        <div className="credit-item">
                            <strong>Damià Llorens Jiordà</strong>
                            <span>Comissari Pedagògic i d'Innovació (CEFIRE Alcoi)</span>
                        </div>
                        <div className="credit-item">
                            <strong>Anna Calvo</strong>
                            <span>Directora d'Escenografia i Identitat Visual (Belles Arts)</span>
                        </div>
                        <div className="credit-item">
                            <strong>Isabel Sancho Carbonell</strong>
                            <span>Assessora de Turisme (ADL Cocentaina)</span>
                        </div>
                        <div className="credit-item">
                            <strong>Anna Climent i Montllor</strong>
                            <span>Responsable Científica i d'Alimentació Saludable</span>
                        </div>
                        <div className="credit-item">
                            <strong>MArIA</strong>
                            <span>Memòria Artificial i Acció</span>
                        </div>
                        <div className="credit-item">
                            <strong>Josep Vicent Cascant i Jordà</strong>
                            <span>Professor de Literatura i Recerca del Lèxic (Ibi/Muro)</span>
                        </div>
                        <div className="credit-item highlight-tech">
                            <strong>Thorsten (BDOSB)</strong>
                            <span>Asesor Tecnològic i Super Administrador (Torremanzanas)</span>
                            <a href="https://bdosb.es" target="_blank" rel="noopener noreferrer" className="credit-link-mini">bdosb.es</a>
                        </div>
                        <div className="credit-item highlight-tech">
                            <strong>Antigravity Core</strong>
                            <span>Motor Tecnològic i Execució</span>
                        </div>
                    </div>
                </section>

                <div className="iaia-cta-box">
                    {!showVoiceRecorder ? (
                        <div className="iaia-cta-group">
                            <button className="btn-primary rectangular" onClick={() => navigate('/chats')}>
                                <MessageCircle size={20} />
                                {t('iaia_page.cta_button')}
                            </button>
                            <button
                                className="btn-secondary-iaia-voice"
                                onClick={() => setShowVoiceRecorder(true)}
                                disabled={isSubmitting}
                            >
                                <Mic size={20} />
                                {feedbackSent ? '¡Gràcies per la teua veu!' : 'Enviar suggerència per veu'}
                            </button>
                        </div>
                    ) : (
                        <div className="iaia-voice-recorder-wrapper">
                            <p className="voice-recorder-hint">Escoltant la teua visió per al poble...</p>
                            <VoiceRecorder
                                onSend={handleVoiceSend}
                                onCancel={() => setShowVoiceRecorder(false)}
                                lang={i18n.language}
                            />
                        </div>
                    )}
                </div>

                <footer className="iaia-page-footer">
                    <p>✨ {t('iaia_page.footer_text')}</p>
                </footer>
            </main>
        </div>
    );
};

export default IAIAPage;
