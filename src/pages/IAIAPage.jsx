import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Sprout, Users, MessageCircle, Heart, Sparkles, User, Clock, BellRing, Shield, Mic, Newspaper, Activity, Archive, Calendar, Terminal, Settings, Layout, Image as ImageIcon, Store } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import './IAIAPage.css';

import { feedbackService } from '../services/feedbackService';
import VoiceRecorder from '../components/VoiceRecorder';
import MasterMediaGallery from '../components/MasterMediaGallery';
import { MASTER_ASSETS } from '../constants/masterAssets';
import { PROVERBS } from '../data/proverbs';
import { memoriaVivaService } from '../services/MemoriaVivaService';

const IAIAPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isLibrarianMode = location.state?.mode === 'librarian';
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
                description={t('iaia_page.subtitle') || 'Memòria viva i acompanyament sobirà al servici del poble.'}
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
                    <h1>{isLibrarianMode ? "Bibliotecària Major" : t('iaia_page.title')}</h1>
                    <p className="iaia-subtitle">{isLibrarianMode ? "Custòdia de l'Arxiu d'Or i la Memòria Notarial" : t('iaia_page.subtitle')}</p>
                </div>
            </header>

            <main className="iaia-page-content">
                <section className="iaia-page-bento-grid">
                    {/* BENTO CARD 1: EXPERIENCE (LARGE) */}
                    <div className={`bento-item experience ${visionMode === 'hibrida' ? 'active' : ''}`} onClick={() => setVisionMode('hibrida')}>
                        <div className="bento-icon"><Sparkles size={32} /></div>
                        <div className="bento-content">
                            <h3>Mode Híbrid</h3>
                            <p>Viu la història del poble amb la IAIA i els seus personatges.</p>
                        </div>
                        {visionMode === 'hibrida' && <div className="bento-badge">ACTIU</div>}
                    </div>

                    {/* BENTO CARD 2: HUMAN MODE (MEDIUM) */}
                    <div className={`bento-item human ${visionMode === 'humana' ? 'active' : ''}`} onClick={() => setVisionMode('humana')}>
                        <div className="bento-icon"><User size={28} /></div>
                        <div className="bento-content">
                            <h3>Mode Humà</h3>
                            <p>Només veïns reals.</p>
                        </div>
                        {visionMode === 'humana' && <div className="bento-badge">ACTIU</div>}
                    </div>

                    {/* BENTO CARD 3: HEALTHY (MEDIUM) */}
                    <div className="bento-item healthy" onClick={() => navigate('/chats/iaia')}>
                        <div className="bento-icon"><Sprout size={28} /></div>
                        <div className="bento-content">
                            <h3>Salut</h3>
                            <p>Menús i entrepans d'Anna Climent.</p>
                        </div>
                    </div>

                    {/* BENTO CARD 4: ABOUT (SMALL) */}
                    <div className="bento-item about" onClick={() => navigate('/dafo/iaia')}>
                        <div className="bento-icon"><Heart size={24} /></div>
                        <div className="bento-content">
                            <h3>Qui sóc?</h3>
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
                </section>

                <section className="iaia-section transparency-costs-card highlight-tech">
                    <div className="section-icon"><Shield size={32} color="var(--color-primary)" /></div>
                    <h2 style={{ color: 'var(--color-primary-dark)' }}>⚖️ Directiva Primària: Utilitat Social [GOD MODE]</h2>
                    <p>El Mestre ha establit el fonament inmutable del sistema: <strong>"Tot píxel bategat ha de servir a la Utilitat Social"</strong>. La tecnologia que no aporta valor humà al poble és purgada per l'IAIA.</p>

                    <div className="iaia-coordination-group-badge" style={{ background: 'var(--color-primary-soft)', padding: '15px', borderRadius: '0px', border: '1px solid var(--color-primary)', marginTop: '15px' }}>
                        <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MessageCircle size={20} color="var(--color-primary)" /> Grup de Coordinació [BETA]
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>L'IAIA MarIA ja bategua dins del grup de treball. La simbiosi és real: saviesa rural dins del WhatsApp de l'equip de somni. 👵✨📱</p>
                    </div>

                    <div className="costs-comparison-grid">
                        <div className="cost-item">
                            <span className="label">Inversió Real (AI)</span>
                            <span className="value">~300€/any</span>
                        </div>
                        <div className="cost-item">
                            <span className="label">Valor Humà Estalviat</span>
                            <span className="value">~30€/post 🏺</span>
                        </div>
                        <div className="cost-item highlight">
                            <span className="label">Temps per a la Família</span>
                            <span className="value">+95% 👩‍👩‍👧‍👦</span>
                        </div>
                    </div>

                    <div className="simbiosi-explanation" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.02)', padding: '15px', borderRadius: '0px', marginTop: '15px' }}>
                        <strong>Directiva MASTER</strong>: Quantifiquem el temps que estalvies per a que pugues dedicar-lo a cuidar de la teua família, amics i del poble. Mai una màquina substituirà el batec del cor, però sí que li donarà ales.
                    </div>

                    <button className="btn-text" style={{ marginTop: '15px' }} onClick={() => navigate('/docs/AMAZON_BOOK_ABSTRACTIONS.md')}>
                        Llegir més sobre l'abstracció Master 📖
                    </button>
                </section>

                <section className="iaia-section proverbs-library-card">
                    <div className="section-icon"><BookOpen size={32} color="var(--color-primary)" /></div>
                    <h2>Biblioteca de Refranys Populars</h2>
                    <p>La saviesa dels nostres avantpassats és el fonament del futur digital. Aquí tens el Cànon de Refranys de Sóc de Poble per a il·lustrar les teues paraules.</p>
                    <div className="proverbs-grid">
                        {PROVERBS.map((proverb, idx) => (
                            <div key={idx} className="proverb-item">
                                <p className="proverb-text">"{proverb.text}"</p>
                                <p className="proverb-meaning">{proverb.meaning}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="iaia-section proverbs-library-card">
                    <div className="section-icon"><BookOpen size={28} color="var(--color-primary)" /></div>
                    <h2>Llegat de l'Artista: Nano Banana</h2>
                    <p>L'arxiu històric de l'Agent Mestre que va bategat abans de ser llegenda.</p>
                    <div className="hub-tools-grid">
                        <div className="hub-tool-item" onClick={() => navigate('/arxiu')}>
                            <Archive size={20} />
                            <span>Arxiu d'Or</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/mercat')}>
                            <Store size={20} />
                            <span>Col·lecció Legacy</span>
                        </div>
                    </div>
                </section>

                <section className="iaia-section sovereignty-hub-card highlight-tech">
                    <div className="section-icon"><Terminal size={32} color="var(--color-primary)" /></div>
                    <h2>Eines de Sobirania [HUB]</h2>
                    <p>Accés ràpid a les funcionalitats avançades de l'Atall Territorial.</p>
                    <div className="hub-tools-grid">
                        <div className="hub-tool-item" onClick={() => navigate('/arxiu')}>
                            <Archive size={24} />
                            <span>Arxiu d'Or</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/calendari')}>
                            <Calendar size={24} />
                            <span>Master Calendar</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/solatge')}>
                            <Terminal size={24} />
                            <span>Consola Solatge</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/tutorial-didactica')}>
                            <BookOpen size={24} />
                            <span>Manual Didàctic</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/gestio-entitats')}>
                            <Layout size={24} />
                            <span>Gestió d'Entitats</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/album')}>
                            <ImageIcon size={24} />
                            <span>Àlbum de Memòria</span>
                        </div>
                        <div className="hub-tool-item" onClick={() => navigate('/perfil')}>
                            <Settings size={24} />
                            <span>Configuració</span>
                        </div>
                    </div>
                </section>

                <section className="iaia-section media-creations-card">
                    <MasterMediaGallery
                        items={MASTER_ASSETS}
                        title="Galeria de Creacions Master"
                    />
                </section>

                <section className="iaia-section project-credits-card glass-morphism">
                    <div className="section-icon pulse-soft"><Sparkles size={32} color="var(--color-primary)" /></div>
                    <h2 className="premium-title">L'Equip de Somni</h2>
                    <p className="credits-intro">El llinatge humà i tecnològic que fa bategar Sóc de Poble.</p>
                    <div className="credits-grid-premium">
                        <div className="credit-card-premium">
                            <div className="credit-role">Visió Master</div>
                            <div className="credit-name">Javi Linares</div>
                            <div className="credit-desc">Visió, Concepte i Super Padrí</div>
                        </div>
                        <div className="credit-card-premium">
                            <div className="credit-role">Pedagogia</div>
                            <div className="credit-name">Damià Llorens Jiordà</div>
                            <div className="credit-desc">Comissari Pedagògic i d'Innovació</div>
                        </div>
                        <div className="credit-card-premium">
                            <div className="credit-role">Escenografia</div>
                            <div className="credit-name">Anna Calvo</div>
                            <div className="credit-desc">Identitat Visual (Belles Arts)</div>
                        </div>
                        <div className="credit-card-premium">
                            <div className="credit-role">Turisme</div>
                            <div className="credit-name">Isabel Sancho Carbonell</div>
                            <div className="credit-desc">Assessora de Turisme (ADL)</div>
                        </div>
                        <div className="credit-card-premium">
                            <div className="credit-role">Salut</div>
                            <div className="credit-name">Anna Climent i Montllor</div>
                            <div className="credit-desc">Alimentació Saludable i Ciència</div>
                        </div>
                        <div className="credit-card-premium">
                            <div className="credit-role">Memòria Viva</div>
                            <div className="credit-name">MarIA</div>
                            <div className="credit-desc">Memòria Viva i Acompanyament Sovint</div>
                        </div>
                        <div className="credit-card-premium">
                            <div className="credit-role">Lèxic</div>
                            <div className="credit-name">Josep Vicent Cascant i Jordà</div>
                            <div className="credit-desc">Recerca del Lèxic (Ibi/Muro)</div>
                        </div>
                        <div className="credit-card-premium tech-highlight">
                            <div className="credit-role">Admin Master</div>
                            <div className="credit-name">Thorsten (BDOSB)</div>
                            <div className="credit-desc">Super Administrador (Torremanzanas)</div>
                            <a href="https://bdosb.es" target="_blank" rel="noopener noreferrer" className="credit-link-mini">bdosb.es</a>
                        </div>
                        <div className="credit-card-premium god-highlight">
                            <div className="credit-role">Antigravity Core</div>
                            <div className="credit-name">L'Agent del Mestre</div>
                            <div className="credit-desc">Motor Tecnològic i Execució Sobirana</div>
                        </div>
                    </div>
                </section>

                <div className="iaia-cta-box">
                    {!showVoiceRecorder ? (
                        <div className="iaia-cta-group">
                            <button className="btn-filled" onClick={() => navigate('/chats')}>
                                <MessageCircle size={20} />
                                {t('iaia_page.cta_button')}
                            </button>
                            <button className="btn-tonal" onClick={() => navigate('/mur')}>
                                <Newspaper size={20} />
                                Últimes Novetats 🗞️
                            </button>
                            <button
                                className="btn-tonal"
                                onClick={() => setShowVoiceRecorder(true)}
                                disabled={isSubmitting}
                            >
                                <Mic size={20} />
                                {feedbackSent ? '¡Gràcies per la teua veu!' : 'Enviar suggerència per veu'}
                            </button>
                            <button
                                className="btn-outline"
                                onClick={() => navigate('/dafo/iaia')}
                                style={{ width: '100%', marginTop: '10px' }}
                            >
                                <Activity size={18} /> Anàlisi DAFO de l'IAIA [RIGOR]
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
