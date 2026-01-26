import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Cpu, Users, Globe, Database, ShieldCheck, TrendingUp, Mail, Briefcase, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import NanoSplashScreen from '../components/NanoSplashScreen';
import './ProjectPresentation.css';

const ProjectPresentation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showIntro, setShowIntro] = useState(true);
    const shareUrl = `${window.location.origin}/projecte`;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (showIntro) {
        return <NanoSplashScreen onComplete={() => setShowIntro(false)} />;
    }

    return (
        <div className="project-pitch-container">
            <SEO
                title="Sóc de Poble: El Projecte"
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda. Visió, Tecnologia i Futur."
                image="/og-project.png"
                url="/projecte"
            />

            <nav className="pitch-nav compact-nav">
                <button className="nav-btn-large primary" onClick={() => navigate('/chats')}>
                    <MessageCircle size={24} />
                    <span>Anar al Xat</span>
                </button>
                <div className="pitch-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/logo.png" alt="Sóc de Poble" style={{ height: '32px', filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.4))' }} />
                </div>
                <div className="nav-actions-right">
                    <ShareHub
                        title="Sóc de Poble: El Projecte"
                        text="Descobreix com estem connectant l'essència rural amb el futur digital. 🚀"
                        url={shareUrl}
                    />
                    <button className="nav-btn-large secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                        <span>Tornar</span>
                    </button>
                </div>
            </nav>

            <header className="pitch-hero compact-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/rural_tech_future_valencia.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="hero-content">
                    <div className="hero-badge">
                        <Rocket size={14} />
                        <span>TECH FOR RURAL IMPACT</span>
                    </div>
                    <h1>Connectant l'Essència Rural<br />amb el Futur Digital</h1>
                    <p className="hero-subtitle">
                        La plataforma que revitalitza el teixit social i econòmic dels nostres pobles.
                    </p>
                    <div className="hero-stats compact-stats">
                        <div className="stat-item">
                            <span className="stat-number">React 19</span>
                            <span className="stat-label">Core</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">IAIA</span>
                            <span className="stat-label">Agentic</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">PWA</span>
                            <span className="stat-label">Mobile</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="pitch-section roots compact-section">
                <div className="section-grid dense-grid">
                    <div className="text-col">
                        <h2>Arrels i Legitimitat</h2>
                        <p className="roots-desc">
                            Més de <strong>30 anys d'activisme rural</strong> convertits en codi.
                        </p>
                        <div className="legal-backers compact-backers">
                            <div className="backer-item">
                                <ShieldCheck className="backer-icon" size={20} />
                                <div>
                                    <strong>Associació Cultural El Rentonar</strong>
                                    <span>Padrinos de Memòria i Patrimoni</span>
                                </div>
                            </div>
                            <div className="backer-item">
                                <Users className="backer-icon" size={20} />
                                <div>
                                    <strong>Comunitat de Pobles Connectats</strong>
                                    <span>Padrinos de Xarxa i Territori</span>
                                </div>
                            </div>
                            <div className="backer-item">
                                <Rocket className="backer-icon" size={20} />
                                <div>
                                    <strong>Antigravity Core</strong>
                                    <span>Padrinos de Tecnologia i Futur</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-col activism-card-col">
                        <div className="activism-card compact-card">
                            <h3>De la Pancarta al Pixel</h3>
                            <p>
                                Defensem la nostra <strong>sobirania digital</strong> amb la mateixa força que el territori.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pitch-section problem-solution compact-section">
                <div className="section-grid dense-grid">
                    <div className="text-col">
                        <h2>El Repte</h2>
                        <p>
                            La "Espanya Buidada" necessita connexions digitals reals, no xarxes globals que ignoren el barri.
                        </p>
                    </div>
                    <div className="card-col horizontal-cards">
                        <div className="feature-card compact-card">
                            <Globe size={24} className="card-icon" />
                            <div>
                                <h3>Hiperlocalitat</h3>
                                <p>Geo-Fenced per prioritzar el teu entorn.</p>
                            </div>
                        </div>
                        <div className="feature-card compact-card">
                            <Users size={24} className="card-icon" />
                            <div>
                                <h3>Teixit Social</h3>
                                <p>Eines per a Ajuntaments i Comerç.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pitch-footer compact-footer">
                <h2>Uneix-te a la Revolució</h2>

                <div className="navigation-actions full-width">
                    <button className="action-btn-huge primary" onClick={() => navigate('/chats')}>
                        <MessageCircle size={32} />
                        <div>
                            <span className="btn-title">Obrir Xat de Treball</span>
                            <span className="btn-desc">Grup de Coordinació</span>
                        </div>
                    </button>
                    <button className="action-btn-huge secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={32} />
                        <div>
                            <span className="btn-title">Tornar Enrere</span>
                            <span className="btn-desc">Seguir navegant</span>
                        </div>
                    </button>
                </div>

                <div className="contact-options-grid hidden">
                    {/* Hidden for Beta Focus */}
                </div>
                <div className="footer-credits">
                    Developed with ❤️ by Antigravity & DeepMind
                </div>
                <div style={{ marginTop: '16px' }}>
                    <button
                        onClick={() => navigate('/legal')}
                        style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        Avís Legal i Privacitat
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProjectPresentation;
