import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Users, Zap, TrendingUp, Award, Heart } from 'lucide-react';
import './MakingOf.css';

const MakingOf = () => {
    const navigate = useNavigate();

    return (
        <div className="making-of-container">
            <header className="making-of-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <h1>La Historia darrere de l'App</h1>
            </header>

            <div className="making-of-content">
                <section className="hero-section">
                    <div className="badge-container">
                        <img src="/assets/antigravity_badge.png" alt="Powered by Antigravity" className="antigravity-badge-large" />
                    </div>
                    <h2>El "Miracle" Tecnològic</h2>
                    <p className="intro-text">
                        Sóc de Poble no és una app normal. No l'ha fet una gran empresa de Silicon Valley amb 200 programadors.
                        <br /><br />
                        L'ha fet <strong>una sola persona</strong> (Javi) treballant colze a colze amb <strong>Antigravity</strong>, una Intel·ligència Artificial avançada.
                    </p>
                </section>

                <section className="impact-grid">
                    <div className="impact-card">
                        <Users className="card-icon" />
                        <h3>L'Equip "Impossible"</h3>
                        <ul className="team-list">
                            <li>
                                <strong>👱 Javi (El Visionari)</strong>
                                <span>Ideador, Catalitzador Rural i ànima del projecte.</span>
                            </li>
                            <li>
                                <strong>⚡ Flash/Antigravity (L'Arquitecte)</strong>
                                <span>Intel·ligència Agentica que entén el *context* i executa la visió.</span>
                            </li>
                            <li>
                                <strong>🍌 Nano Banana (L'Artista)</strong>
                                <span>Creador visual contextual. Capaç de capturar l'essència rural en píxels.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="impact-card highlight">
                        <TrendingUp className="card-icon" />
                        <h3>Full de Serveis (v1.0)</h3>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="stat-val">~60h</span>
                                <span className="stat-lbl">Temps de Creació</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">8</span>
                                <span className="stat-lbl">Dies de Treball</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">>5k</span>
                                <span className="stat-lbl">Línies de Codi</span>
                            </div>
                        </div>
                        <p className="stats-note">
                            El que abans costava mesos i equips sencers, ara és possible en una setmana quan tens l'eina adequada.
                        </p>
                    </div>
                </section>

                <section className="mission-section">
                    <div className="mission-content">
                        <Zap className="section-icon" />
                        <h3>El Potencial Real</h3>
                        <p>
                            Aquest projecte és la prova vivent del que passa quan una idea clara troba la tecnologia capaç d'entendre-la.
                        </p>
                        <p>
                            No hem programat només una app; hem traduït <strong>30 anys de context social</strong> a una plataforma digital viva. Gràcies a la capacitat contextual de l'IA (Flash & Nano Banana), la barrera entre "tindre una idea" i "fer-la realitat" ha desaparegut.
                        </p>
                    </div>
                </section>

                <section className="tech-stack-section">
                    <h3>Tecnologia de Vanguarda</h3>
                    <div className="tech-logos">
                        <div className="tech-item"><TrendingUp size={20} /> <span>Google Cloud</span></div>
                        <div className="tech-item"><Award size={20} /> <span>IA Generativa</span></div>
                        <div className="tech-item"><Heart size={20} /> <span>Supabase</span></div>
                    </div>
                </section>

                <footer className="making-of-footer">
                    <p>Feta amb ❤️ i 🤖 per al món rural.</p>
                </footer>
            </div>
        </div>
    );
};

export default MakingOf;
