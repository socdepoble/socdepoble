import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Cpu, Users, Globe, Database, ShieldCheck, TrendingUp, Mail, Briefcase, MessageCircle, Newspaper } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import NanoSplashScreen from '../components/NanoSplashScreen';
import MasterMediaGallery from '../components/MasterMediaGallery';
import { MASTER_ASSETS } from '../constants/masterAssets';
import { PROVERBS } from '../data/proverbs';
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

                <div className="pitch-media-vault" style={{ marginTop: '40px' }}>
                    <MasterMediaGallery
                        items={MASTER_ASSETS}
                        title="Actius i Memòria del Projecte"
                        showFilters={true}
                    />
                </div>

                <div className="proverbs-showcase" style={{ marginTop: '40px' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '20px' }}>La Saviesa del Poble (Cànon [MASTER])</h2>
                    <div className="proverbs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {PROVERBS.slice(0, 6).map((proverb, idx) => (
                            <div key={idx} className="proverb-card-presentation" style={{ background: 'var(--bg-surface-soft)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-divider)' }}>
                                <p style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>"{proverb.text}"</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{proverb.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="simbiosi-protocol-showcase" style={{ marginTop: '50px', padding: '30px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--color-primary-soft) 100%)', borderRadius: '24px', border: '1px solid var(--color-primary-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <ShieldCheck size={32} color="var(--color-primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Directiva Primària: Utilitat Social [GOD MODE] ⚖️</h2>
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '25px' }}>
                        Gravat en el cor del sistema: <strong>"Tot bategat ha de servir a la comunitat"</strong>. Sóc de Poble no és només codi, és una eina de canvi social per a que la tecnologia deixe de ser soroll i passe a ser bategat útil.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sobirania del Temps</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>+95% Eficiència</span>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Valor de la Col·laboració</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Simbiosi 50/50</span>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Destí del Temps</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Cuidar la Família</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '25px', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8 }}>
                        "La màquina s'encarrega de l'estructura; l'humà s'encarrega del batec." 🏺⚖️✨
                    </p>
                </div>

                <section className="pitch-section smart-villages" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="section-grid dense-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        <div className="text-col">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--color-primary-dark)' }}>
                                <Globe size={32} color="var(--color-primary)" />
                                Smart Villages: Acció Local 🇪🇺
                            </h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                Transformem la visió europea de les <strong>Viles Intel·ligents</strong> en una infraestructura vital per al Mas. Apliquem el rigor de l'IAIA en 5 lliçons fonamentals:
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                                {[
                                    "Impuls Local i Participatiu",
                                    "Solucions Digitals Realistes",
                                    "Innovació sobre Fortaleses Locals",
                                    "Convivència Equilibrada Analògic-Dig",
                                    "Sobirania y Governança de Dades"
                                ].map((step, i) => (
                                    <li key={i} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                                        <TrendingUp size={18} color="var(--color-primary)" /> {step}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex-buttons-didactic" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button
                                    className="btn-dafo-mini"
                                    onClick={() => navigate('/dafo/smart-villages')}
                                    style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                                >
                                    <Database size={18} /> ANÀLISI DAFO
                                </button>
                                <button
                                    className="btn-didactic-mini"
                                    onClick={() => navigate('/didactica/smart-villages-master-presentation')}
                                    style={{ background: 'var(--color-primary)', border: 'none', color: '#000', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1.5 }}
                                >
                                    <BookOpen size={18} /> VEURE DETALL DIDÀCTIC
                                </button>
                            </div>
                        </div>
                        <div className="card-col">
                            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid var(--color-primary-soft)' }}>
                                <img
                                    src="/assets/infographies/smart_villages_master.png"
                                    alt="Lliçons Smart Villages"
                                    style={{ width: '100%', display: 'block' }}
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', fontSize: '0.8rem', textAlign: 'center' }}>
                                    De la Visió Europea a l'Acció Local [MASTER]
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
                    <button className="action-btn-huge news-btn" onClick={() => navigate('/mur')} style={{ background: 'rgba(0, 242, 255, 0.1)', border: '1px solid var(--color-primary)' }}>
                        <Newspaper size={32} color="var(--color-primary)" />
                        <div>
                            <span className="btn-title">Últimes Novetats</span>
                            <span className="btn-desc">El bategat del dia a dia</span>
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

                <div className="dafo-cta-section" style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        className="btn-dafo-master"
                        onClick={() => navigate('/dafo/projecte')}
                        style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}
                    >
                        <ShieldCheck size={20} /> VEURE DAFO ESTRATÈGIC DEL PROJECTE
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
