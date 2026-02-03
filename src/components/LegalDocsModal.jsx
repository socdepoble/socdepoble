import React from 'react';
import { ShieldCheck, X, FileText, Download, Landmark, Globe } from 'lucide-react';
import './LegalDocsModal.css';

const LegalDocsModal = ({ isOpen, onClose, title, content, type = 'estatuts', authorName }) => {
    if (!isOpen) return null;

    const isProfessional = type === 'professional' || type === 'autonom';

    return (
        <div className="legal-modal-overlay animate-fade-in" onClick={onClose}>
            <div className={`legal-modal-content glass-ia ${isProfessional ? 'mode-professional' : ''}`} onClick={e => e.stopPropagation()}>
                <header className="legal-modal-header">
                    <div className="header-icon-badge">
                        {isProfessional ? <Landmark size={28} /> : <ShieldCheck size={28} />}
                    </div>
                    <div className="header-text">
                        <h2>{title || (isProfessional ? 'Dossier Professional' : 'Documentació Oficial')}</h2>
                        <span className="official-timestamp">
                            {isProfessional ? `Certificació de Competència • ${authorName || 'Professional'}` : `Verificat per la Xarxa Rhizome • ${new Date().toLocaleDateString()}`}
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="legal-document-body">
                    <div className="watermark-logo">SÓC DE POBLE</div>
                    <div className="doc-scroll-area">
                        {content ? (
                            <div className="legal-text-content">
                                {content.split('\n').map((line, idx) => {
                                    if (line.startsWith('# ')) return <h1 key={idx}>{line.replace('# ', '')}</h1>;
                                    if (line.startsWith('## ')) return <h2 key={idx}>{line.replace('## ', '')}</h2>;
                                    if (line.startsWith('### ')) return <h3 key={idx}>{line.replace('### ', '')}</h3>;
                                    if (line.startsWith('- ')) return <li key={idx}>{line.replace('- ', '')}</li>;
                                    if (line.trim() === '---') return <hr key={idx} />;
                                    if (line.includes('**')) {
                                        const parts = line.split('**');
                                        return (
                                            <p key={idx}>
                                                {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                                            </p>
                                        );
                                    }
                                    return <p key={idx}>{line}</p>;
                                })}
                            </div>
                        ) : (
                            <div className="no-content">
                                <FileText size={48} opacity={0.3} />
                                <p>No hi ha contingut disponible per a aquest document.</p>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="legal-modal-footer">
                    <div className="protection-badge">
                        <Landmark size={14} />
                        <span>{isProfessional ? 'PROFESSIONAL VERIFICAT' : 'ENTITAT SOBERANA'}</span>
                    </div>
                    <div className="footer-actions">
                        <button className="legal-utility-btn" onClick={() => window.print()}>
                            <Download size={18} /> {isProfessional ? 'DESCARREGAR DOSSIER' : 'DESCARREGAR PDF'}
                        </button>
                        <button className="legal-utility-btn secondary" onClick={() => window.open(isProfessional ? 'https://www.linkedin.com' : 'https://www.gva.es', '_blank')}>
                            <Globe size={18} /> {isProfessional ? 'PORTAFOLI' : 'GVA REGISTRE'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LegalDocsModal;
