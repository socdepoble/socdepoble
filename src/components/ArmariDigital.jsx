import React from 'react';
import { FileText, Download, ExternalLink, ShieldCheck, Landmark, Sparkles } from 'lucide-react';
import UniversalCard from './UniversalCard';
import './ArmariDigital.css';

const ArmariDigital = ({ townName, documents = [] }) => {
    // [PROTOCOL FLASH] Documents humanitzats i Smart Rural Hub
    const defaultDocs = [
        {
            id: 'ord-1',
            title: 'Ordenança de Protecció d\'Arbres d\'Interès Local',
            category: 'Natura i Paisatge',
            date: '2023-11-15',
            size: '1.2 MB',
            type: 'PDF',
            desc: 'Protegeix el nostre patrimoni viu. Coneix quins arbres no es poden tocar.'
        },
        {
            id: 'mod-1',
            title: 'Model d\'Instància General',
            category: 'Atenció al Veí',
            date: '2024-01-20',
            size: '450 KB',
            type: 'PDF',
            desc: 'Formulari bàsic per a qualsevol sol·licitud a l\'ajuntament.'
        },
        {
            id: 'pat-1',
            title: 'Protocol de Troballes Arqueològiques',
            category: 'Patrimoni Cultural',
            date: '2024-02-01',
            size: '890 KB',
            type: 'PDF',
            desc: 'Has trobat alguna cosa al bancal? Sabem com protegir-ho junts.'
        }
    ];

    const displayDocs = documents.length > 0 ? documents : defaultDocs;

    return (
        <div className="armari-digital-container animate-in">
            {/* SEU ELECTRÒNICA [PONT DE SOBIRANIA] */}
            <section className="seu-electronica-card">
                <div className="seu-header">
                    <Landmark size={24} className="icon-institution" />
                    <div className="seu-text">
                        <h3>Finestra Única Rural</h3>
                        <p>Accés directe a tràmits oficials, padró i impostos. Seguretat estatal al palmell de la mà.</p>
                    </div>
                </div>
                <button className="btn-seu-direct" onClick={() => window.open('https://sedeelectronica.gob.es/', '_blank')}>
                    <ShieldCheck size={18} />
                    SIGNAR AMB CERTIFICAT / CL@VE
                    <ExternalLink size={14} />
                </button>
            </section>

            {/* ARMARI DOCUMENTAL (REBOST) */}
            <div className="docs-grid">
                <h4 className="docs-title">Rebost Documental • {townName}</h4>
                {displayDocs.map(doc => (
                    <UniversalCard
                        key={doc.id}
                        title={doc.title}
                        subtitle={doc.category}
                        collection={doc.type}
                        theme="raindrop"
                        isOfficial={true}
                        className="doc-item-card"
                        footer={
                            <div className="doc-footer">
                                <span className="doc-size">{doc.size}</span>
                                <button className="btn-download-pdf">
                                    <Download size={16} />
                                    VUITÉ (PDF)
                                </button>
                            </div>
                        }
                    >
                        <div className="doc-item-body" style={{ padding: '4px 0' }}>
                            <p className="doc-desc" style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.4', marginBottom: '10px' }}>{doc.desc}</p>
                            <div className="doc-date-badge" style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase' }}>Actualitzat: {doc.date}</div>
                        </div>
                    </UniversalCard>
                ))}
            </div>

            {/* INCIDÈNCIES I SMART VILLAGE HUB */}
            <section className="smart-village-hub">
                <h4 className="hub-title">Smart Village Hub 🚜⚡️</h4>
                <div className="hub-tools">
                    <div className="hub-tool-card clickable">
                        <h5>Avisar d'una Incidència</h5>
                        <p>Fanal trencat? Sot al camí? Envia una foto i ho gestionem.</p>
                    </div>
                    <div className="hub-tool-card clickable">
                        <h5>Producte Local i DOPs</h5>
                        <p>Guia d'ajudes per a l'Oli, la Cirera i marques de qualitat.</p>
                    </div>
                    <div className="hub-tool-card clickable">
                        <h5>Contractació i Licitacions</h5>
                        <p>Compra pública simplificada per al negoci del poble.</p>
                    </div>
                    <div className="hub-tool-card clickable">
                        <h5>Formació Digital</h5>
                        <p>Aprendre a fer servir la Cl@ve i el Kit Digital.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArmariDigital;
