import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Calculator, Landmark, Sprout, Home, Info, Search, Bot, Shield } from 'lucide-react';
import './OficiDocumentacio.css';

const OficiDocumentacio = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const documentCategories = [
        {
            id: 'agricultura',
            title: 'Agricultura i Camp',
            icon: <Sprout className="cat-icon" />,
            color: '#22c55e',
            description: 'Ajudes de la PAC, Xylella, cremes i pous.',
            procedures: [
                { id: 'xylella-fastidiosa', title: 'Ayudes Xylella Fastidiosa', status: 'active', official_code: '18932' },
                { id: 'crema-restes', title: 'Permís de Crema de Restes', status: 'available' },
            ]
        },
        {
            id: 'vivenda',
            title: 'Venda i Urbanisme',
            icon: <Home className="cat-icon" />,
            color: '#3b82f6',
            description: 'Certificats, llicències d\'obra i IBI.',
            procedures: [
                { id: 'cedula-vivienda', title: 'Cèdula d\'Habitabilitat', status: 'coming-soon' },
            ]
        },
        {
            id: 'bancari',
            title: 'Banc i Hisenda',
            icon: <Landmark className="cat-icon" />,
            color: '#f59e0b',
            description: 'Domiciliacions, impostos i tràmits bancaris.',
            procedures: [
                { id: 'domiciliacio-bancaria', title: 'Model de Domiciliació Bancària', status: 'active' },
            ]
        }
    ];

    const filteredCategories = documentCategories.filter(cat =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.procedures.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="ofici-page animate-in">
            <header className="ofici-header">
                <div className="ofici-logo">
                    <div className="ofici-icon-wrapper">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h1>Ofici de Documentació</h1>
                        <p>Gestió sobirana de tràmits oficials</p>
                    </div>
                </div>

                <div className="ofici-iaia-card">
                    <Bot size={20} className="iaia-blink" />
                    <p>"Mestre, si vols ajuda amb el paperam de la Xylella, soc ací per a tu."</p>
                </div>
            </header>

            <div className="ofici-search-bar">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Què vols gestionar hui? (ej. Xylella, Hisenda...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <section className="ofici-main-grid">
                {filteredCategories.map(category => (
                    <div key={category.id} className="document-category-card">
                        <div className="cat-header" style={{ '--cat-color': category.color }}>
                            {category.icon}
                            <h3>{category.title}</h3>
                        </div>
                        <p className="cat-desc">{category.description}</p>

                        <div className="procedure-list">
                            {category.procedures.map(proc => (
                                <button
                                    key={proc.id}
                                    className={`procedure-item ${proc.status}`}
                                    onClick={() => proc.status === 'active' && navigate(`/ofici/${proc.id}`)}
                                >
                                    <div className="proc-info">
                                        <span className="proc-title">{proc.title}</span>
                                        {proc.official_code && <span className="proc-code">Codi: {proc.official_code}</span>}
                                    </div>
                                    {proc.status === 'active' ? <ChevronRight size={18} /> : <span className="status-label">{proc.status === 'coming-soon' ? 'Pròximament' : 'Diponible'}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <footer className="ofici-info-footer">
                <div className="info-badge">
                    <Shield size={14} />
                    <span>Dades gestionades localment (Protocol Rhizome)</span>
                </div>
                <button className="btn-ofici-manual" onClick={() => navigate('/manual')}>
                    <Info size={16} />
                    Guia de Tràmits Oficials
                </button>
            </footer>
        </div>
    );
};

export default OficiDocumentacio;
