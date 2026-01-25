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
                        <h3>Equip Tradicional</h3>
                        <p>Normalment caldrien:</p>
                        <ul>
                            <li>👨‍💻 2 Programadors</li>
                            <li>🎨 1 Dissenyador</li>
                            <li>☁️ 1 Expert en Núvol</li>
                        </ul>
                        <span className="cost-tag">Cost: ~50.000€</span>
                    </div>

                    <div className="impact-card highlight">
                        <Cpu className="card-icon" />
                        <h3>Equip Sóc de Poble</h3>
                        <p>Hem necessitat:</p>
                        <ul>
                            <li>👱 Javi (Ideas + Direcció)</li>
                            <li>🤖 Antigravity (Codi + IA)</li>
                        </ul>
                        <span className="cost-tag savings">Cost: 10x Menys</span>
                    </div>
                </section>

                <section className="mission-section">
                    <div className="mission-content">
                        <Zap className="section-icon" />
                        <h3>Democratitzant la Tecnologia</h3>
                        <p>
                            Aquest projecte demostra que <strong>els pobles menuts</strong> poden tenir la mateixa tecnologia que les grans capitals.
                        </p>
                        <p>
                            No necessitem pressupostos milionaris. Necessitem bones idees i la tecnologia adequada per fer-les realitat.
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
