import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users, Building2, Landmark, ExternalLink, Sparkles, BookOpen, Layers, MousePointer2 } from 'lucide-react';
import SEO from '../components/SEO';
import './DesignCanon.css';

const DesignCanon = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'usuari',
            title: 'Usuari (Agent)',
            description: 'Recursos centrats en la identitat personal i el disseny centrat en l\'humà.',
            icon: <User size={32} />,
            color: '#06B6D4', // Gem Cyan
            links: [
                { name: 'Material Design 3', url: 'https://m3.material.io', desc: 'Sistema de disseny de Google per a interfícies adaptables.' },
                { name: 'Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', desc: 'Estàndards de disseny d\'Apple per a experiències intuïtives.' }
            ]
        },
        {
            id: 'grup',
            title: 'Grup (Comunitat)',
            description: 'Recursos per al disseny social, col·laboratiu i la gestió de comunitats.',
            icon: <Users size={32} />,
            color: '#F97316', // Gem Orange
            links: [
                { name: 'Linear Method', url: 'https://linear.app/method', desc: 'Pràctiques per a construir productes moderns de forma eficient.' },
                { name: 'Radix UI', url: 'https://www.radix-ui.com/', desc: 'Components primitius per a construir xarxes socials accessibles.' }
            ]
        },
        {
            id: 'empresa',
            title: 'Empresa (Professional)',
            description: 'Recursos per al disseny comercial, professional i creixement econòmic rural.',
            icon: <Building2 size={32} />,
            color: '#81b29a',
            links: [
                { name: 'Shopify Polaris', url: 'https://polaris.shopify.com/', desc: 'Guia per a construir experiències de comerç excepcionals.' },
                { name: 'Stripe Design', url: 'https://stripe.com/design', desc: 'Excel·lència en disseny de productes financers.' }
            ]
        },
        {
            id: 'institucio',
            title: 'Institució (Públic)',
            description: 'Recursos per al disseny institucional, oficial i la sobirania de dades públiques.',
            icon: <Landmark size={32} />,
            color: '#f2cc81',
            links: [
                { name: 'NotebookLM', url: 'https://notebooklm.google.com/', desc: 'Intel·ligència per a sintetitzar coneixement institucional.' },
                { name: 'Raindrop.io', url: 'https://raindrop.io/', desc: 'Gestió de la memòria digital i recursos compartits.' }
            ]
        },
        {
            id: 'ia-interficies',
            title: 'Interfícies d\'IA (Modals)',
            description: 'Patrons de finestres emergents per a la simbiosi entre l\'humà i la màquina.',
            icon: <Sparkles size={32} />,
            color: '#FDE68A', // Gold/Yellow
            links: [
                { name: 'Patró Cronista', url: '#', desc: 'Modal en "Surface Old Lace" amb títol destacat i llistat narratiu.' },
                { name: 'Patró Tia Maria', url: '#', desc: 'Xat de proximitat amb bombolles asimètriques i tons taronges.' }
            ]
        }
    ];

    return (
        <div className="design-canon-page">
            <SEO
                title="Cànon de Disseny | Sóc de Poble"
                description="Recursos i principis de disseny per a l'evolució del món rural."
            />

            <header className="design-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-content">
                    <div className="design-badge">
                        <Sparkles size={16} />
                        <span>ESTÈTICA MESTRA</span>
                    </div>
                    <h1>Cànon GEM MODERN v2.0</h1>
                    <p>La síntesi de l'estètica clara (Llum i Vida) adaptada al bategat rural amb geometria bento (28px).</p>
                </div>
            </header>

            <main className="design-grid-container">
                {categories.map(cat => (
                    <section key={cat.id} className="design-category-card" style={{ '--accent-color': cat.color }}>
                        <div className="category-header">
                            <div className="category-icon">{cat.icon}</div>
                            <div className="category-title">
                                <h2>{cat.title}</h2>
                                <p>{cat.description}</p>
                            </div>
                        </div>

                        <div className="link-list">
                            {cat.links.map(link => (
                                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="design-link-item">
                                    <div className="link-info">
                                        <h3>{link.name}</h3>
                                        <p>{link.desc}</p>
                                    </div>
                                    <ExternalLink size={18} className="link-arrow" />
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            <section className="design-philosophy-footer">
                <div className="glass-card-premium">
                    <div className="section-header-mini">
                        <Layers size={20} color="var(--color-primary)" />
                        <h2>L'Ànima del Disseny [MASTER]</h2>
                    </div>
                    <p>
                        No busquem només funcionalitat, sinó una <strong>simbiosi</strong> mestre entre l'elegància clara i la resiliència del camp.
                        Basat en el cànon <strong>GEM MODERN</strong>: Claredat, Orgànica i Tech Rural.
                    </p>
                    <div className="design-stats-mini">
                        <div className="stat-pill">
                            <MousePointer2 size={14} />
                            <span>Tàctil-First</span>
                        </div>
                        <div className="stat-pill">
                            <BookOpen size={14} />
                            <span>Didàctic</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DesignCanon;
