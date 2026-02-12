import React from 'react';
import { Shield, Zap, Globe, Users, TrendingUp, Award, ArrowRight, CheckCircle, Smartphone, Database, Server, Layers } from 'lucide-react';
import './DossierSocis.css';

/**
 * DOSSIER DE SOCIS: SOLLUTIA EDITION 🏺🚀
 * Una landing page d'alta fidelitat per a presentar el projecte a possibles socis estratègics.
 * Basat en l'arquitectura Eg-walker, Rhizome i el Model de Franquícia de Node.
 */
const DossierSocis = () => {
    return (
        <div className="dossier-container animate-fade-in">
            {/* HERO SECTION: LA VISIÓ SUPREMA */}
            <header className="dossier-hero">
                <div className="hero-content">
                    <div className="badge-cimera">CIMERA SOLLUTIA 2026</div>
                    <h1 className="hero-title">Sóc de Poble: <span className="text-gradient">L'Algorisme de la Terra</span></h1>
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

            {/* SECCIÓ 2: MODEL DE NEGOCI (LA SOSTENIBILITAT REAL) */}
            <section className="dossier-section dark-variant">
                <h2 className="section-title"><TrendingUp size={32} /> Model de Negoci Sostenible</h2>
                <div className="business-model-grid">
                    <div className="business-item">
                        <div className="item-header">
                            <Shield className="item-icon" />
                            <h3>SaaS "El Secretari"</h3>
                        </div>
                        <p>Subscripció per a municipis per a gestionar bandos oficials, tràmits i incidències amb control total de la privacitat dels seus veïns.</p>
                        <ul className="item-list">
                            <li><CheckCircle size={16} /> Comunicació directa blindada</li>
                            <li><CheckCircle size={16} /> Gestió territorial eficient</li>
                        </ul>
                    </div>
                    <div className="business-item">
                        <div className="item-header">
                            <Globe className="item-icon" />
                            <h3>La Botiga del Poble</h3>
                        </div>
                        <p>Marketplace de proximitat sense comissions abusives. Subscripció fixa per a productors per a vendre directament al consumidor final (Km 0).</p>
                        <ul className="item-list">
                            <li><CheckCircle size={16} /> Economia circular real</li>
                            <li><CheckCircle size={16} /> Visibilitat del producte local</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SECCIÓ 3: ESCALABILITAT (FRANQUÍCIA DE NODE) */}
            <section className="dossier-section">
                <h2 className="section-title"><Users size={32} /> Franquícia de Node</h2>
                <div className="scalability-content">
                    <div className="scalability-text">
                        <p>No creixem com una app centralitzada, sinó com un bosc. Cada poble és un <strong>Node Autònom</strong> que pot personalitzar la seua personalitat d'IA (IAIA) i les seues regles de convivència.</p>
                        <div className="quote-box">
                            "Inspirat en Ehud Shapiro: Grassroots Systems per a la sobirania digital."
                        </div>
                    </div>
                    <div className="scalability-map">
                        {/* Placeholder per a futura visualització de malla */}
                        <div className="node-mesh">
                            <div className="node pulse">Poble A</div>
                            <div className="node pulse delay-1">Poble B</div>
                            <div className="node pulse delay-2">Poble C</div>
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
