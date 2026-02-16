import React, { useState } from 'react';
import { Search, Tag, Share2, Download, Eye } from 'lucide-react';
import './InfografiaGallery.css';

/**
 * Infoteca del Mas [v1.0]
 * El santuari de l'art didàctic generat per Nano Banana.
 */
const InfografiaGallery = () => {
    const [filter, setFilter] = useState('totes');

    const infografies = [
        {
            id: 1,
            titol: 'Kit Digital: Tresor del Poble',
            sector: 'Digitalització',
            data: '15/02/2026',
            img: '/images/dossiers/infografia_kit_digital.png',
            context: 'Ajudes per a la modernització empresarial'
        },
        {
            id: 2,
            titol: 'Projecte Rhizome: Resiliència Rural',
            sector: 'Territori',
            data: '15/02/2026',
            img: '/images/dossiers/territori.png',
            context: 'Innovació i sobirania tecnològica'
        }
    ];

    const filtered = filter === 'totes' 
        ? infografies 
        : infografies.filter(inf => inf.sector.toLowerCase() === filter.toLowerCase());

    return (
        <div className="infoteca-container animate-in">
            <header className="infoteca-header">
                <div>
                    <h1>Infoteca del Mas</h1>
                    <p>El llegat visual de Nano Banana compartit amb tota la gent de bé.</p>
                </div>
                <div className="infoteca-filters">
                    {['totes', 'Digitalització', 'Territori'].map(f => (
                        <button 
                            key={f} 
                            className={`filter-chip ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
            </header>

            <div className="infoteca-grid">
                {filtered.map(inf => (
                    <div key={inf.id} className="infografia-card glass-master">
                        <div className="infografia-media">
                            <img src={inf.img} alt={inf.titol} />
                            <div className="infografia-overlay">
                                <button className="btn-icon"><Eye size={20} /></button>
                                <button className="btn-icon"><Share2 size={20} /></button>
                                <button className="btn-icon"><Download size={20} /></button>
                            </div>
                        </div>
                        <div className="infografia-info">
                            <h3>{inf.titol}</h3>
                            <div className="infografia-meta">
                                <span><Tag size={14} /> {inf.sector}</span>
                                <span>{inf.data}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfografiaGallery;
