import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, ChevronRight, Calculator, Landmark, Sprout, Home, Info, Search, Bot, Shield } from 'lucide-react';
import KitDigitalManager from '../components/KitDigitalManager';
import './OficiDocumentacio.css';

const OficiDocumentacio = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeProcedure, setActiveProcedure] = useState(id || null);

    const documentCategories = [
        {
            id: 'agricultura',
            title: 'Agricultura i Camp',
            icon: <Sprout className="cat-icon" />,
            color: '#22c55e',
            description: 'Ajudes de la PAC, Xylella, cremes i pous.',
            procedures: [
                { id: 'xylella-fastidiosa', title: 'Ayudes Xylella Fastidiosa (Seguiment)', status: 'active', official_code: '18932' },
                { id: 'crema-restes', title: 'Permís de Crema de Restes (Tramitar)', status: 'active', official_code: 'CRM-2026' },
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
        },
        {
            id: 'kit-digital',
            title: 'Kit Digital (Govern)',
            icon: <Bot className="cat-icon" />,
            color: '#FF6D23',
            description: 'Ajudes per a la digitalització (PIMES i Autònoms).',
            procedures: [
                { id: 'kit-digital-solicitud', title: 'Gestió de Documents Kit Digital', status: 'active', official_code: 'KD-2024' },
            ]
        }
    ];

    const filteredCategories = documentCategories.filter(cat =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.procedures.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (activeProcedure === 'kit-digital-solicitud' || activeProcedure === 'crema-restes' || activeProcedure === 'xylella-fastidiosa') {
        return (
            <div className="flex-1 bg-black text-white p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="w-32 h-32 rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center mb-8">
                    <Bot size={64} className="text-orange-500" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">PROCEDIMENT EN MARXA</h2>
                <p className="max-w-md text-gray-400 text-lg mb-8 italic">
                    "Mestre, estic connectant amb els servidors de la Generalitat per a gestionar el teu tràmit de {activeProcedure === 'crema-restes' ? 'Permís de Crema' : (activeProcedure === 'xylella-fastidiosa' ? 'Ajudes Xylella' : 'Kit Digital')}. Un momentet..."
                </p>
                <div className="flex gap-4">
                    <button onClick={() => setActiveProcedure(null)} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold uppercase tracking-widest text-xs transition-all border border-white/10">Tornar enrere</button>
                    <button className="px-8 py-3 bg-[#FF6B00] hover:bg-[#ff7b20] text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-900/40">Continuar amb la IAIA</button>
                </div>
            </div>
        );
    }

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
                                    onClick={() => proc.status === 'active' && setActiveProcedure(proc.id)}
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
