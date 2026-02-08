import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Rocket, Cpu, Users, Globe, Database, ShieldCheck, TrendingUp, Mail, Briefcase, MessageCircle, Newspaper, BookOpen, Smartphone, UserCheck, Sparkles, Volume2, Headphones, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { speechService } from '../services/speechService';
import { notebookService } from '../services/notebookService';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import NanoSplashScreen from '../components/NanoSplashScreen';
import MasterMediaGallery from '../components/MasterMediaGallery';
import { MASTER_ASSETS } from '../constants/masterAssets';
import { PROVERBS } from '../data/proverbs';
import { logger } from '../utils/logger';
import './ProjectPresentation.css';

const ProjectPresentation = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const jumpToPage = location.state?.jumpToPage;
    const { user } = useAuth();
    const [showIntro, setShowIntro] = useState(true);
    const [techReport, setTechReport] = useState(null);
    const [reportLang, setReportLang] = useState(i18n.language === 'es' ? 'es' : 'ca');
    const shareUrl = `${window.location.origin}/projecte`;

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const suffix = reportLang === 'es' ? '_ES' : '';
                const response = await fetch(`/TECHNICAL_REPORT_VIVO${suffix}.md`);
                const text = await response.text();
                setTechReport(text);
            } catch (error) {
                logger.error('Error fetching tech report:', error);
            }
        };
        fetchReport();
    }, [reportLang]);

    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const handleAudioOverview = async () => {
        if (isPlayingAudio) {
            window.speechSynthesis.cancel();
            setIsPlayingAudio(false);
            return;
        }

        setIsPlayingAudio(true);
        const script = await notebookService.generateAudioOverview("Sóc de Poble");
        speechService.speak(script, i18n.language === 'es' ? 'es' : 'va');

        // Simple timeout for UI feedback since TTS doesn't provide easy 'end' event here
        setTimeout(() => setIsPlayingAudio(false), 20000);
    };

    useEffect(() => {
        if (jumpToPage && techReport) {
            // Esperar un moment a que el DOM s'actualitze
            setTimeout(() => {
                const pageId = `page-${jumpToPage}`;
                const element = document.getElementById(pageId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-flash');
                }
            }, 500);
        }
    }, [jumpToPage, techReport]);

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

            <header className="pitch-hero cinematic-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('/rural_tech_future_valencia.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="hero-content">
                    <div className="hero-badge-premium">
                        <Rocket size={16} />
                        <span>SOBIRANIA DIGITAL & MEMÒRIA VIVA</span>
                    </div>
                    <div className="sovereign-seal animate-float">
                        <img src="/socdepoble_map_pattern_v1.png" alt="Soberania" className="green-square-logo" />
                    </div>
                    <h1>Connectant l'Essència Rural<br />amb el Futur Digital</h1>
                    <p className="hero-subtitle">
                        La plataforma que revitalitza el teixit social i econòmic dels nostres pobles mitjançant el control sobirà de les dades.
                    </p>
                    <div className="hero-stats premium-stats">
                        <div className="stat-item-glass">
                            <span className="stat-number">Local-First</span>
                            <span className="stat-label">Arquitectura</span>
                        </div>
                        <div className="stat-item-glass">
                            <span className="stat-number">Byzantine</span>
                            <span className="stat-label">Resiliència</span>
                        </div>
                        <div className="stat-item-glass">
                            <span className="stat-number">Atum</span>
                            <span className="stat-label">Protocol</span>
                        </div>
                    </div>
                    <div className="hero-actions-sovereign">
                        <button
                            className={`btn-audio-overview ${isPlayingAudio ? 'playing' : ''}`}
                            onClick={handleAudioOverview}
                        >
                            {isPlayingAudio ? <Headphones size={20} /> : <Volume2 size={20} />}
                            <span>{isPlayingAudio ? "Escoltant Resum..." : "Audio Overview (IAIA & Avi)"}</span>
                        </button>
                        <button
                            className="btn-design-canon"
                            onClick={() => navigate('/disseny')}
                        >
                            <Palette size={20} />
                            <span>Cànon de Disseny</span>
                        </button>
                        <button
                            className="btn-genesis-viewer"
                            onClick={() => navigate('/visor')}
                        >
                            <Sparkles size={20} />
                            <span>Visor del Gènesi</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ROBUST ARCHITECTURE SECTION - FEEDBACK INTEGRATION */}
            <section className="pitch-section stability-section animate-fade-in">
                <div className="glass-card-premium architecture-integrity-card">
                    <div className="section-header-mini">
                        <ShieldCheck size={20} color="var(--color-primary)" />
                        <h2>Arquitectura de Ferro: Referències Immutables</h2>
                    </div>
                    <p className="architecture-intro">
                        Per garantir que el <strong>Rebost Digital</strong> siga robust, Sóc de Poble utilitza una estratègia de preservació històrica ("The Long Now").
                    </p>
                    <div className="tech-pills-grid">
                        <div className="tech-pill-item">
                            <h3>DIDs (DNI Digital)</h3>
                            <p>Els enllaços no apunten a carpetes, sinó a l'<b>ànima del document</b>. Si el contingut es mou, la cita es mou amb ell.</p>
                        </div>
                        <div className="tech-pill-item">
                            <h3>Ancoratge Semàntic</h3>
                            <p>Utilitzem <b>Peritext</b> per a que les cites viatgen amb el text. Encara que el document s'edite, la referència mai es perd.</p>
                        </div>
                        <div className="tech-pill-item">
                            <h3>Visions del Passat</h3>
                            <p>Immutabilitat per defecte. Cada versió es preserva en un graf (DAG), evitant el <b>Link Rot</b> o la pèrdua de memòria.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HUMAN FACTOR SECTION - Javi's Contact */}
            <section className="pitch-section human-factor-section animate-fade-in">
                <div className="glass-card-premium contact-card-sovereign">
                    <div className="card-header-status">
                        <div className="status-dot-pulse"></div>
                        <span>LÍNIA DIRECTA AMB L'ARQUITECTE</span>
                    </div>
                    <div className="profile-contact-row">
                        <div className="avatar-frame-gold">
                            <img src="/images/demo/avatar_man_1.png" alt="Javi Llinares" className="avatar-img-premium" />
                        </div>
                        <div className="contact-info-text">
                            <h3>Javi Llinares</h3>
                            <p className="role-badge">Arquitecte del Sistema & Coordinador</p>
                            <p className="manifesto-quote">"La tecnologia serveix a les persones; les persones parlen amb persones. Parlem de tu a tu."</p>
                        </div>
                    </div>
                    <div className="contact-actions-premium">
                        <div className="direct-phone">686 12 93 05</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--color-primary)' }}>🏺 Bategant per la sobirania digital</p>
                    </div>
                </div>
            </section>

            <div className="section-grid dense-grid">
                <div className="text-col">
                    <h2>El Cor del Projecte: Pepet i la Rosa</h2>
                    <p className="roots-desc">
                        No es tracta de codi, es tracta de <strong>temps</strong>.
                    </p>
                    <div className="narrative-box" style={{ background: 'rgba(204, 85, 0, 0.1)', padding: '24px', borderRadius: '0px', borderLeft: '4px solid var(--color-terracotta)', marginTop: '20px' }}>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', fontStyle: 'italic', color: 'var(--color-terracotta-light)' }}>
                            "Pepet ja no puja al mercat amb el seu cabàs de tomates, li fan mal els genolls. La Rosa vol comprar tomates de veritat, però només troba les de plàstic del supermercat. Sóc de Poble és el bategat que torna a unir el cabàs del Pepet amb la cuina de la Rosa."
                        </p>
                    </div>
                </div>
            </div>

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
                            <div key={idx} className="proverb-card-presentation" style={{ background: 'var(--bg-surface-soft)', padding: '20px', borderRadius: '0px', border: '1px solid var(--color-divider)' }}>
                                <p style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>"{proverb.text}"</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{proverb.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="simbiosi-protocol-showcase" style={{ marginTop: '50px', padding: '30px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--color-primary-soft) 100%)', borderRadius: '0px', border: '1px solid var(--color-primary-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <ShieldCheck size={32} color="var(--color-primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Directiva Primària: Utilitat Social [GOD MODE] ⚖️</h2>
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '25px' }}>
                        Gravat en el cor del sistema: <strong>"Tot bategat ha de servir a la comunitat"</strong>. Sóc de Poble no és només codi, és una eina de canvi social per a que la tecnologia deixe de ser soroll i passe a ser bategat útil.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sobirania del Temps</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>+95% Eficiència</span>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Valor de la Col·laboració</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Simbiosi 50/50</span>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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
                                    style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '12px 24px', borderRadius: '0px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                                >
                                    <Database size={18} /> ANÀLISI DAFO
                                </button>
                                <button
                                    className="btn-didactic-mini"
                                    onClick={() => navigate('/didactica/smart-villages-master-presentation')}
                                    style={{ background: 'var(--color-primary)', border: 'none', color: '#000', padding: '12px 24px', borderRadius: '0px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1.5 }}
                                >
                                    <BookOpen size={18} /> VEURE DETALL DIDÀCTIC
                                </button>
                            </div>
                        </div>
                        <div className="card-col">
                            <div style={{ position: 'relative', borderRadius: '0px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid var(--color-primary-soft)' }}>
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

                <section className="pitch-section iaia-librarian-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="glass-card-premium iaia-librarian-card">
                        <div className="iaia-avatar-badge">
                            <img src="/iaia_digital_matriarch.png" alt="IAIA" />
                            <div className="badge-glow"></div>
                        </div>
                        <div className="iaia-content">
                            <h2>Pregunta a la Guia Major (IAIA)</h2>
                            <p>Tens dubtes sobre el manifest o vols saber com recuperem la Memòria Viva? La nostra secretària notarial té totes les dades bategades.</p>
                            <button className="btn-iaia-librarian" onClick={() => navigate('/iaia', { state: { mode: 'librarian' } })}>
                                <Sparkles size={20} />
                                <span>Invocar la Bibliotecària</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* LIVING WHITEPAPER SECTION [MASTER ARCHITECTURE] */}
                <section className="pitch-section tech-deep-dive-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="glass-card-premium tech-report-card-horizontal" style={{ background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.1) 0%, rgba(204, 85, 0, 0.05) 100%)', border: '1px solid var(--color-primary-soft)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                            <Cpu size={40} color="var(--color-primary)" />
                            <div>
                                <h2 style={{ margin: 0 }}>Technical Deep Dive: The Living Whitepaper</h2>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Protocol Local-First & Rhizome DB</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '1.1rem', marginBottom: '25px', color: 'var(--text-main)' }}>
                            Explora l'enginyeria darrera de Sóc de Poble: Sincronització CRDT (Eg-walker), Identitat Sobirana (DIDs) i ergonomia "Bancal-Ready".
                        </p>
                        <div className="tech-cta-row" style={{ display: 'flex', gap: '15px' }}>
                            <a href="/docs/tech-report/index.md" target="_blank" className="btn-pitch-cta primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--color-primary)', color: '#000', borderRadius: '0px', fontWeight: 800, textDecoration: 'none' }}>
                                <BookOpen size={20} /> LLEGIR WHITEPAPER
                            </a>
                            <button onClick={() => navigate('/docs/tech-report/roadmap')} className="btn-pitch-cta secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px', fontWeight: 800 }}>
                                <TrendingUp size={20} /> VEURE ROADMAP
                            </button>
                        </div>
                    </div>
                </section>

                <section className="pitch-section tech-report-section" style={{ marginTop: '60px', borderTop: '1px solid var(--color-divider)', paddingTop: '40px' }}>
                    <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Database size={32} color="var(--color-primary)" />
                            <h2 style={{ margin: 0 }}>{reportLang === 'es' ? 'Informe Técnico Vivido' : 'Informe Tècnic Vivid'}</h2>
                        </div>
                        <div className="report-controls" style={{ display: 'flex', gap: '10px' }}>
                            <div className="lang-toggle-minimal">
                                <button className={reportLang === 'ca' ? 'active' : ''} onClick={() => setReportLang('ca')}>CA</button>
                                <button className={reportLang === 'es' ? 'active' : ''} onClick={() => setReportLang('es')}>ES</button>
                            </div>
                            <button className="btn-print-report" onClick={() => window.print()}>
                                <ShieldCheck size={16} /> {reportLang === 'es' ? 'Imprimir / PDF' : 'Imprimir / PDF'}
                            </button>
                        </div>
                    </div>

                    <div className="tech-report-web-view" style={{ background: 'var(--bg-surface-soft)', padding: '40px', borderRadius: '0px', border: '1px solid var(--color-divider)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div className="report-markdown-content" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-main)', maxWidth: '800px', margin: '0 auto' }}>
                            {techReport ? (
                                <div className="report-text" dangerouslySetInnerHTML={{
                                    __html: techReport
                                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/^- (.*$)/gim, '<li>$1</li>')
                                        .split('\n').map((line, index) => {
                                            // Simulem pàgines cada 5 paràgrafs per a la demo
                                            const pageNum = Math.floor(index / 5) + 1;
                                            const idAttr = line.trim() ? `id="page-${pageNum}"` : '';
                                            return line.startsWith('<li>') ? line : `<p ${idAttr}>${line}</p>`;
                                        }).join('')
                                }} />
                            ) : (
                                <p className="pulse-slow">{reportLang === 'es' ? 'Sincronizando informe...' : 'Sincronitzant informe...'}</p>
                            )}
                        </div>
                        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid var(--color-divider)', paddingTop: '20px' }}>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                {reportLang === 'es' ? 'Este documento es autoactualizable y refleja el estado real del sistema.' : 'Aquest document és autoactualitzable i reflecteix l\'estat real del sistema.'}
                            </span>
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
                        style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '15px 30px', borderRadius: '0px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}
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
