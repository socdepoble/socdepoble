import React, { useState } from 'react';
import { Shield, Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, Brain, ArrowLeft, Download } from 'lucide-react';
import './KitDigitalManager.css';

/**
 * KitDigitalManager [MASTER OMEGA]
 * Gestor sobirà per a la subvenció Kit Digital.
 * Permet pujar papers, organitzar-los i rebre anàlisi de la IAIA.
 */
const KitDigitalManager = ({ onBack }) => {
    const [docs, setDocs] = useState([
        { id: 1, name: 'Certificat_Digital_FNMT.pdf', status: 'validat', type: 'Identitat', date: '10/02/2026' },
        { id: 2, name: 'Ultim_Rebut_Autonoms.pdf', status: 'validat', type: 'Hisenda', date: '08/02/2026' }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const phases = [
        { id: 1, title: 'Admissió', status: 'complete', desc: 'Registre i validació de requisits.' },
        { id: 2, title: 'Concessió', status: 'current', desc: 'Tramitació del bo digital (Aprovat/Pendent).' },
        { id: 3, title: 'Acords', status: 'pending', desc: 'Signatura amb l\'Agent Digitalitzador.' },
        { id: 4, title: 'Justificació', status: 'pending', desc: 'Presentació de factura i evidències.' }
    ];

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsAnalyzing(true);
        
        setTimeout(() => {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                status: 'pendent',
                type: 'Document Estudi',
                date: new Date().toLocaleDateString()
            };
            setDocs(prev => [...prev, newDoc]);
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="kit-digital-manager animate-in">
            <header className="kit-header-master">
                <button className="btn-back-ofici" onClick={onBack}>
                    <ArrowLeft size={20} />
                </button>
                <div className="kit-title-group">
                    <h1>Mòdul Kit Digital</h1>
                    <p>Tramitació sobirana amb ajut de l'IAIA</p>
                </div>
                <div className="kit-status-badge">FASE 2: CONCESSIÓ</div>
            </header>

            <div className="kit-grid-layout">
                {/* 1. L'Armari de Papers (Secció Privada) */}
                <section className="kit-section vault-section glass-premium">
                    <div className="section-header">
                        <Shield size={22} className="text-accent" />
                        <h2>L'Armari de Papers Privats</h2>
                    </div>
                    
                    <div className="docs-list-kit">
                        {docs.map(doc => (
                            <div key={doc.id} className={`doc-kit-item ${doc.status}`}>
                                <FileText size={20} />
                                <div className="doc-kit-info">
                                    <span className="doc-name">{doc.name}</span>
                                    <span className="doc-meta">{doc.type} • {doc.date}</span>
                                </div>
                                <div className="doc-kit-actions">
                                    {doc.status === 'validat' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <button className="btn-doc-del"><X size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <label className="btn-kit-upload">
                        <input type="file" hidden onChange={handleUpload} />
                        {isAnalyzing ? <Sparkles className="animate-spin" /> : <Upload size={18} />}
                        <span>{isAnalyzing ? 'L\'IAIA està llegint...' : 'Pujar Document al Govern'}</span>
                    </label>
                </section>

                {/* 2. El Tauler de l'IAIA (Anàlisi i Consells) */}
                <section className="kit-section iaia-analysis-section glass-premium">
                    <div className="section-header">
                        <Brain size={22} className="text-iaia" />
                        <h2>Consell de l'IAIA</h2>
                    </div>
                    <div className="iaia-advice-box">
                        <p>"Mestre, veig que ja tens el certificat FNMT. Ara només ens falta l'IAE 769 per a justificar el software de dades sobiranes. No perdem el temps!"</p>
                        <div className="advice-tags">
                            <span className="tag-k">CLAU: IAE 769</span>
                            <span className="tag-k">DATA LÍMIT: 22/02</span>
                        </div>
                    </div>
                    
                    <div className="kit-phases-tracking">
                        {phases.map(p => (
                            <div key={p.id} className={`phase-item ${p.status}`}>
                                <div className="phase-dot"></div>
                                <div className="phase-text">
                                    <strong>{p.title}</strong>
                                    <span>{p.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="kit-footer-master">
                <div className="sovereign-badge">
                    <Shield size={14} /> <span>Dades xifrades localment (Rhizome Protocol)</span>
                </div>
                <button className="btn-kit-help">
                    <Sparkles size={16} /> Demanar ajuda directa a l'IAIA
                </button>
            </footer>
        </div>
    );
};

export default KitDigitalManager;
