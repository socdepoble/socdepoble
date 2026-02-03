import React from 'react';
import { Users, Tractor, Brain, HardDrive, Package, Info, ChevronRight, Sparkles } from 'lucide-react';
import './DidacticManual.css';

/**
 * DidacticManual: Centre de Documentació Tècnica "Sóc de Poble" [V1.6]
 * Segueix el Google Developer Documentation Style Guide i el Protocol Flash.
 */
const DidacticManual = () => {
    const sections = [
        {
            id: 'vida-publica',
            title: '1. VIDA PÚBLICA (La Plaça)',
            icon: <Users size={24} />,
            description: 'Espais de comunicació i difusió per a la comunitat.',
            items: [
                { name: 'El Mur (Feed Masonry)', status: 'OPERATIU', tech: 'CSS Grid Masonry + Lazy Loading' },
                { name: "Sistema d'Alertes (Bàndol)", status: 'BETA', tech: 'Web Push + HyParView' },
                { name: 'Missatgeria Sobirana', status: 'BETA', tech: 'MLS Protocol (P2P)' }
            ]
        },
        {
            id: 'gestio',
            title: '2. EINES DE GESTIÓ (El Taller)',
            icon: <Tractor size={24} />,
            description: 'Eines transaccionals i de registre per al dia a dia.',
            items: [
                { name: 'Editor de Recursos', status: 'OPERATIU', tech: 'Formularis Dinàmics + SQLite' },
                { name: 'Calendari del Territori', status: 'BETA', tech: 'Cicles Naturals + Terminis DOP' },
                { name: 'Mercat d\'Excedents', status: 'PENDENT', tech: 'Astro BRB Payments' }
            ]
        },
        {
            id: 'intel·ligencia',
            title: '3. INTEL·LIGÈNCIA (La Memòria)',
            icon: <Brain size={24} />,
            description: 'Processament de dades i assistència avançada.',
            items: [
                { name: 'Consultori IAIA (Gemini)', status: 'BETA', tech: 'API Gemini + Rural Lexicon' },
                { name: 'Rhizome DB', status: 'IN PROGRÉS', tech: 'Eg-walker Sync Algorithm' },
                { name: 'Anàlisi de Plagues', status: 'EXPERIMENTAL', tech: 'Visió per Computador (Idea)' }
            ]
        },
        {
            id: 'infraestructura',
            title: '4. INFRAESTRUCTURA (El Soterrani)',
            icon: <HardDrive size={24} />,
            description: 'Capa tècnica que garanteix la sobirania i el funcionament offline.',
            items: [
                { name: 'Sincronització (Sync Engine)', status: 'OPERATIU', tech: 'Event Graph Walking' },
                { name: 'Design System (Google Pagès)', status: 'OPERATIU', tech: 'MD3 + Zero Radius + Solar CSS' },
                { name: 'Seguretat (Local-First)', status: 'OPERATIU', tech: 'Client-Side Encryption' }
            ]
        }
    ];

    return (
        <div className="manual-container animate-bategat">
            <header className="manual-header">
                <BookOpen size={32} className="header-icon" />
                <div className="header-text">
                    <h1>Manual Didàctic</h1>
                    <p className="subtitle">L'estat de la Cristal·lització [v1.6-BATEGA]</p>
                </div>
            </header>

            <section className="iaia-note glass-ia">
                <div className="note-header">
                    <Sparkles size={20} className="llumeta" />
                    <h3>Nota per a la Iaia: L'ordre del taller</h3>
                </div>
                <p>
                    "Hola iaia, hem penjat totes les eines a la paret amb la seua etiqueta,
                    com fan a les ferreteries grans. Ara tot està net, clar i a la vista.
                    Com a tu t'agrada."
                </p>
            </section>

            <div className="manual-content">
                {sections.map(section => (
                    <div key={section.id} className="manual-section card-rizoma">
                        <div className="section-title">
                            {section.icon}
                            <h2>{section.title}</h2>
                        </div>
                        <p className="section-desc">{section.description}</p>

                        <div className="section-table-wrapper">
                            <table className="manual-table">
                                <thead>
                                    <tr>
                                        <th>Funcionalitat</th>
                                        <th>Estat</th>
                                        <th>Tecnologia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="item-name">{item.name}</td>
                                            <td>
                                                <span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="tech-name">{item.tech}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                <div className="manual-section card-rizoma unclassified">
                    <div className="section-title">
                        <Package size={24} />
                        <h2>Calaix de Sastre (Sandbox)</h2>
                    </div>
                    <p className="section-desc">Idees i prototips pendents de classificació final.</p>
                    <ul className="unclassified-list">
                        <li><ChevronRight size={16} /> Mode "La Fresca" (OLED Night Mode)</li>
                        <li><ChevronRight size={16} /> Arxiu Històric (Digitalització de fotos de la Torre)</li>
                        <li><ChevronRight size={16} /> Detector de perills (Avisos de l'òbila)</li>
                    </ul>
                </div>
            </div>

            <footer className="manual-footer">
                <Info size={16} />
                <span>Google Developer Style Guide Compliant | Flash Protocol v2.5</span>
            </footer>
        </div>
    );
};

export default DidacticManual;
