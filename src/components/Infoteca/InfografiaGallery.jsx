import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag, Share2, Download, Eye, ArrowLeft, X } from 'lucide-react';
import './InfografiaGallery.css';

/**
 * Infoteca del Mas [v1.1]
 * El santuari de l'art didàctic generat per Nano Banana.
 * ARA FUNCIONAL: Lightbox, Share, Download & SEO.
 */
const INFOGRAFES_DATA = [
        {
            id: 1,
            titol: 'Kit Digital: Tresor del Poble',
            sector: 'Digitalització',
            data: '15/02/2026',
            img: '/images/dossiers/infografia_kit_digital.png',
            context: 'Ajudes per a la modernització empresarial',
            desc: 'Infografia detallada sobre les ajudes del Kit Digital per a pimes i autònoms.'
        },
        {
            id: 2,
            titol: 'Projecte Rhizome: Resiliència Rural',
            sector: 'Territori',
            data: '15/02/2026',
            img: '/images/dossiers/territori.png',
            context: 'Innovació i sobirania tecnològica',
            desc: 'Visió estratègica del projecte Rhizome per a la regeneració del territori.'
        }
    ];

const InfografiaGallery = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('totes');
    const [selectedImg, setSelectedImg] = useState(null);

    const infografies = INFOGRAFES_DATA;

    // SEO [PROTOCOL CANÒNIC]
    useEffect(() => {
        const originalTitle = document.title;
        document.title = "Infoteca del Mas | Sóc de Poble";
        
        // Meta OG [SEO SHARE]
        const updateMeta = (name, content) => {
            let el = document.querySelector(`meta[property="${name}"]`) || document.querySelector(`meta[name="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                if (name.startsWith('og:')) el.setAttribute('property', name);
                else el.name = name;
                document.head.appendChild(el);
            }
            el.content = content;
        };

        updateMeta('og:title', 'Infoteca del Mas - Sóc de Poble');
        updateMeta('og:description', 'Recull visual de coneixement territorial i tecnològic.');
        updateMeta('og:image', window.location.origin + INFOGRAFES_DATA[0].img);
        updateMeta('twitter:card', 'summary_large_image');

        return () => { document.title = originalTitle; };
    }, []);

    const handleShare = async (inf) => {
        const shareData = {
            title: inf.titol,
            text: inf.context,
            url: window.location.href,
        };
        try {
            if (navigator.share) await navigator.share(shareData);
            else alert('Enllaç copiat al portaretalls: ' + window.location.href);
        } catch (err) { console.error('Error sharing:', err); }
    };

    const handleDownload = (inf) => {
        const link = document.createElement('a');
        link.href = inf.img;
        link.download = `${inf.titol.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filtered = filter === 'totes' 
        ? infografies 
        : infografies.filter(inf => inf.sector.toLowerCase() === filter.toLowerCase());

    return (
        <div className="infoteca-container animate-in">
            <header className="infoteca-header">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0"
                        title="Tornar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Infoteca del Mas</h1>
                        <p>El llegat visual de Nano Banana compartit amb tota la gent de bé.</p>
                    </div>
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
                        <div className="infografia-media group">
                            <img src={inf.img} alt={inf.titol} loading="lazy" />
                            <div className="infografia-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="btn-icon" onClick={() => setSelectedImg(inf)}><Eye size={20} /></button>
                                <button className="btn-icon" onClick={() => handleShare(inf)}><Share2 size={20} /></button>
                                <button className="btn-icon" onClick={() => handleDownload(inf)}><Download size={20} /></button>
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

            {/* LIGHTBOX [MODAL] */}
            {selectedImg && (
                <div 
                    className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedImg(null)}
                >
                    <button 
                        className="absolute top-6 right-6 p-4 text-white hover:bg-white/10 rounded-[28px] transition-colors z-50"
                        onClick={() => setSelectedImg(null)}
                    >
                        <X size={32} />
                    </button>
                    <div 
                        className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={selectedImg.img} 
                            alt={selectedImg.titol} 
                            className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-[20px]"
                        />
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">{selectedImg.titol}</h2>
                            <p className="text-gray-400 max-w-2xl">{selectedImg.desc}</p>
                            <div className="flex gap-4 justify-center pt-4">
                                <button className="flex items-center gap-2 px-6 py-2 bg-primary rounded-[28px] font-bold hover:bg-primary/80 transition-all" onClick={() => handleDownload(selectedImg)}>
                                    <Download size={18} /> DESCARREGAR
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-[28px] font-bold hover:bg-white/20 transition-all" onClick={() => handleShare(selectedImg)}>
                                    <Share2 size={18} /> COMPARTIR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfografiaGallery;

