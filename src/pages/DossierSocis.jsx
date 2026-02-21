import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Globe, Users, TrendingUp, Award, ArrowRight, CheckCircle, Smartphone, Database, Server, Layers, ArrowLeft } from 'lucide-react';
import './DossierSocis.css';

/**
 * DOSSIER DE SOCIS: SOLLUTIA EDITION 🏺🚀
 * Una landing page d'alta fidelitat per a presentar el projecte a possibles socis estratègics.
 * Basat en l'arquitectura Eg-walker, Rhizome i el Model de Franquícia de Node.
 */
const DossierSocis = () => {
    const navigate = useNavigate();

    return (
        <div className="dossier-container animate-fade-in relative">
            <button 
                onClick={() => navigate(-1)} 
                className="fixed top-6 left-6 z-[100] p-4 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 backdrop-blur-xl shadow-2xl hover:scale-110 active:scale-95 group"
                title="Tornar"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            {/* HERO SECTION: LA VISIÓ SUPREMA */}
            <header className="dossier-hero">
                <div className="hero-content">
                    <div className="badge-cimera">CIMERA SOLLUTIA 2026</div>
                    <div className="hero-logo-container">
                        <img src="/assets/master/logo_socdepoble_white_full.png" alt="Sóc de Poble" className="hero-logo-main" />
                        <span className="hero-subtitle-addon">L'Algorisme de la Terra</span>
                    </div>
                    <p className="hero-tagline">Refundant la identitat rural mitjançant sobirania digital i xarxes autònomes.</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">€0</span>
                            <span className="stat-label">Cost de Servidor</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">100%</span>
                            <span className="stat-label">Local-First</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">∞</span>
                            <span className="stat-label">Escalabilitat</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="amphora-glow">🏺</div>
                </div>
            </header>

            {/* SECCIÓ 1: ARQUITECTURA TÈCNICA (L'AVANTATGE EG-WALKER) */}
            <section className="dossier-section">
                <h2 className="section-title"><Database size={32} /> Arquitectura Revolucionària</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <Layers className="card-icon" />
                        <h3>Eg-walker CRDT</h3>
                        <p>Sincronització de graf d'esdeveniments (DAG) sense conflictes. Convergència determinista en local que elimina la necessitat de base de dades central per a la interacció social.</p>
                    </div>
                    <div className="feature-card">
                        <Zap className="card-icon" />
                        <h3>Xarxa Rhizome</h3>
                        <p>Protocol gossip basat en <strong>Plumtree</strong> i <strong>HyParView</strong>. Els telèfons dels veïns formen la malla de comunicació, reduint la dependència del núvol al mínim.</p>
                    </div>
                    <div className="feature-card">
                        <Smartphone className="card-icon" />
                        <h3>Local-First (No Spinners)</h3>
                        <p>L'usuari és el propietari de les seues dades. Càrrega instantània des de IndexedDB. L'app funciona al mig del camp sense cobertura i sincronitza al tornar a la civilització.</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓ 2: MODEL DE NEGOCI (PILARS DE SOSTENIBILITAT) */}
            <section className="dossier-section dark-variant">
                <h2 className="section-title"><TrendingUp size={32} /> Model de Negoci Híbrid</h2>
                <p className="section-intro">Un ecosistema de sostenibilitat basat en la utilitat administrativa, la dinamització econòmica i l'eficiència tecnològica extrema.</p>
                
                <div className="bento-grid">
                    {/* B2G: EL SECRETARI */}
                    <div className="bento-card large b2g-accent">
                        <div className="bento-header">
                            <Shield className="bento-icon" />
                            <span className="bento-label">Model B2G</span>
                        </div>
                        <h3>"El Secretari" (SaaS)</h3>
                        <p>Subscripció mestre per a Ajuntaments que automatitza la gestió pública rural.</p>
                        <ul className="bento-list">
                            <li><CheckCircle size={16} /> <strong>Automatització de Bàndols:</strong> Reducció del temps administratiu mitjançant IA.</li>
                            <li><CheckCircle size={16} /> <strong>Digitalització de Patrimoni:</strong> Inventari d'actius, rutes i catàleg municipal.</li>
                            <li><CheckCircle size={16} /> <strong>Canal Blindat:</strong> Comunicació sobirana sense dependre d'apps de tercers.</li>
                        </ul>
                    </div>

                    {/* B2B: ESSÈNCIES */}
                    <div className="bento-card b2b-accent">
                        <div className="bento-header">
                            <Globe className="bento-icon" />
                            <span className="bento-label">Model B2B</span>
                        </div>
                        <h3>"Essències" i La Botiga</h3>
                        <p>Monetització de l'economia local sense intermediaris (Km 0).</p>
                        <ul className="bento-list">
                            <li><strong>Subscripció Premium:</strong> Per a productors (oli, vi, artesania).</li>
                            <li><strong>Turisme Experiencial:</strong> Venda directa d'experiències al territori.</li>
                        </ul>
                    </div>

                    {/* COST SAVINGS */}
                    <div className="bento-card tech-accent">
                        <div className="bento-header">
                            <Zap className="bento-icon" />
                            <span className="bento-label">Marge Tècnic</span>
                        </div>
                        <h3>Estalvi Estructural</h3>
                        <p>Cost de servidor $\approx$ 0€. Gràcies a Rhizome, la xarxa es manté des dels dispositius dels veïns.</p>
                        <div className="cost-chart">
                            <div className="chart-bar cloud" title="SaaS Tradicional (Vendes Altament Costoses)">
                                <div className="bar-fill" style={{ height: '80%' }}><span>CLOUD AWS/GC</span></div>
                            </div>
                            <div className="chart-bar local" title="Sóc de Poble (Marge Net Maximitzat)">
                                <div className="bar-fill" style={{ height: '5%' }}><span>RHIZOME</span></div>
                            </div>
                        </div>
                    </div>

                    {/* EXPANSIONAL FEDERATION */}
                    <div className="bento-card node-accent">
                        <div className="bento-header">
                            <Users className="bento-icon" />
                            <span className="bento-label">Llicència de Node</span>
                        </div>
                        <h3>Franquícia Tecnològica</h3>
                        <p>Exportació de la infraestructura a altres territoris (White Label).</p>
                        <div className="bento-mini-stats">
                            <div className="mini-stat"><span>Set-up</span><strong>€€€</strong></div>
                            <div className="mini-stat"><span>Manteniment</span><strong>Quota fix</strong></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓ 3: LA VISIÓ FEDERADA */}
            <section className="dossier-section federated-vision">
                <div className="vision-grid">
                    <div className="vision-text">
                        <h2 className="vision-title">Franquícia de Node</h2>
                        <p>A diferència de les Big Tech, no busquem centralitzar dades, busquem federar sobirania. Cada regió opera el seu propi node amb la seua pròpia identitat d'IA, finançada localment.</p>
                        <div className="quote-box">
                            "Inspirat en Ehud Shapiro: Grassroots Systems per a la sobirania digital."
                        </div>
                    </div>
                    <div className="vision-visual">
                        <div className="rhizome-web">
                            {/* Animated SVG mapping node connections */}
                            <svg viewBox="0 0 400 300" className="rhizome-svg">
                                <circle cx="200" cy="150" r="10" className="center-node" />
                                <line x1="200" y1="150" x2="100" y2="100" className="link-line" />
                                <line x1="200" y1="150" x2="300" y2="100" className="link-line" />
                                <line x1="200" y1="150" x2="150" y2="250" className="link-line" />
                                <line x1="200" y1="150" x2="250" y2="250" className="link-line" />
                                <circle cx="100" cy="100" r="5" className="spoke-node" />
                                <circle cx="300" cy="100" r="5" className="spoke-node" />
                                <circle cx="150" cy="250" r="5" className="spoke-node" />
                                <circle cx="250" cy="250" r="5" className="spoke-node" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION: REUNIÓ AMB SOLLUTIA */}
            <footer className="dossier-cta">
                <div className="cta-box">
                    <h2>Preparats per a la refundació?</h2>
                    <p>Busquem socis que entenguen que el futur de la tecnologia no és el núvol, sinó la terra.</p>
                    <button className="btn-contact-master">
                        <span>Pactar Bategat</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div className="footer-credits">
                    SÓC DE POBLE © 2026 • ARQUITECTURA MASTER V5.16
                </div>
            </footer>
        </div>
    );
};

export default DossierSocis;
