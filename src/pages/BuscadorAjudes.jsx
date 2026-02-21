import React, { useState, useMemo } from 'react';
import { 
    Search, 
    Filter, 
    Download, 
    ChevronRight, 
    FileText, 
    Bot, 
    ArrowLeft, 
    Sparkles, 
    ExternalLink,
    FileJson,
    FileSpreadsheet,
    Shield
} from 'lucide-react';
import { MOCK_SUBSIDIES } from '../data/subsidies';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import './BuscadorAjudes.css';
import DocumentViewer from '../components/DocumentViewer';

/**
 * BuscadorAjudes [MASTER OMEGA]
 * Interfície sobirana per a la recerca i gestió d'ajudes públiques.
 * Implementa exportació multiformat i assistència de l'Arxiver AI.
 */
const BuscadorAjudes = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('tots');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);
    const [aiAdvice, setAiAdvice] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);

    const sectors = ['tots', ...new Set(MOCK_SUBSIDIES.map(s => s.sector).filter(Boolean))];

    const filteredSubsidies = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        return MOCK_SUBSIDIES.filter(s => {
            const matchesSearch = query === '' || 
                                 s.title.toLowerCase().includes(query) || 
                                 s.description.toLowerCase().includes(query);
            const matchesSector = selectedSector === 'tots' || s.sector === selectedSector;
            return matchesSearch && matchesSector;
        });
    }, [searchTerm, selectedSector]);

    const handleAskArxiver = async (sub) => {
        setIsAnalyzing(true);
        setSelectedSub(sub);
        try {
            const query = `Analitza aquesta ajuda per a mi: "${sub.title}". Descripció: ${sub.description}. Requisits: ${(sub.requirements || []).join(', ')}. Com ens pot ajudar al projecte Sóc de Poble?`;
            const response = await geminiService.ask('ARXIVER', query);
            setAiAdvice(response.text);
        } catch (err) {
            console.error(err);
            setAiAdvice("Mestre, els papers s'han barrejat... Torna-ho a provar.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExport = (format, sub) => {
        const content = `
SUBVENCIÓ: ${sub.title}
------------------------------------------------
IMPORT ESTIMAT: ${sub.amount}
SECTOR: ${sub.sector}
DATA LÍMIT: ${sub.deadline}

REQUISITS:
${sub.requirements.map(r => `- ${r}`).join('\n')}

DESCRIPCIÓ:
${sub.description}

CONSELL DE L'IAIA:
${sub.iaia_advice}
        `;

        if (format === 'gdocs') {
            navigator.clipboard.writeText(content);
            alert("Contingut copiat optimitzat per a Google Docs! Enganxa'l en un document nou. ✨");
        } else {
            // [MASTER] Robust Download Portal v1.25.1
            const mimeTypes = {
                'txt': 'text/plain',
                'pdf': 'application/pdf',
                'doc': 'application/msword'
            };
            
            const blob = new Blob([content], { type: mimeTypes[format] || 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${sub.title.replace(/\s+/g, '_')}_socdepoble.${format}`;
            
            document.body.appendChild(a);
            a.click();
            
            // Retardem la purga de l'URL per a que el navegador puga bategar la descàrrega
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);
        }
    };

    return (
        <div className="subsidies-page animate-in">
            {/* Nav Superior */}
            <header className="sub-header glass-premium">
                <button className="btn-back" onClick={() => navigate('/ofici')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="title-group">
                    <h1>Buscador d'Ajudes</h1>
                    <p>Bategat Administratiu per al Mas</p>
                </div>
                <div className="badge-identity">
                    <Shield size={14} /> <span>Rhizome Secured</span>
                </div>
            </header>

            {/* Barra de Cerca i Filtres */}
            <div className="search-controls glass-premium">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Cerca ajudes (Ex: Kit Digital, PAC...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <Filter size={18} />
                    <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                        {sectors.map(s => (
                            <option key={s} value={s}>{s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'Altres'}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Biblioteca de Prompts [NEW SECTION] */}
            <section className="prompts-library-section glass-premium animate-in">
                <header className="section-header">
                    <div className="title-area">
                        <Sparkles size={20} className="text-accent" />
                        <h3>Biblioteca de Prompts</h3>
                    </div>
                    <button className="btn-notes-link" onClick={() => navigate('/notes')}>
                        <FileText size={16} /> Gestionar al Bloc de Notes
                    </button>
                </header>
                <div className="prompts-scroll">
                    <div className="prompt-card mini-bento" onClick={() => navigate('/notes')}>
                        <div className="prompt-header">
                            <span className="platform-tag">Gemini</span>
                            <span className="category-tag">Funding</span>
                        </div>
                        <h4>Recerca de Subvencions 2026</h4>
                        <p className="prompt-preview">"Actua com un consultor expert en captació de fons per al Tercer Sector i Innovació Rural..."</p>
                    </div>
                    <div className="prompt-card mini-bento disabled">
                        <div className="prompt-header">
                            <span className="platform-tag">Claude</span>
                            <span className="category-tag">Memòria</span>
                        </div>
                        <h4>Extracció d'Etimologies Locals</h4>
                        <p className="prompt-preview">Properament bategant...</p>
                    </div>
                </div>
            </section>

            {/* Llistat d'Ajudes */}
            <main className="sub-grid">
                {filteredSubsidies.map(sub => (
                    <article key={sub.id} className="sub-card glass-premium animate-in">
                        <header className="card-header">
                            <span className={`status-tag ${sub.status || 'unknown'}`}>{(sub.status || 'veure').toUpperCase()}</span>
                            <span className="sector-tag">{sub.sector || 'General'}</span>
                        </header>
                        
                        <div className="card-body">
                            <h3>{sub.title}</h3>
                            <div className="amount-highlight">{sub.amount || 'Consultar'}</div>
                            <p className="description">{sub.description}</p>
                            
                            <div className="deadline-info">
                                <strong>Límit:</strong> {sub.deadline}
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="btn-iaia-ask" onClick={() => handleAskArxiver(sub)}>
                                <Bot size={18} /> Preguntar a l'Arxiver
                            </button>
                            <a href={sub.official_link} target="_blank" rel="noreferrer" className="btn-official">
                                <ExternalLink size={18} /> GVA / BOE
                            </a>
                        </div>
                    </article>
                ))}
            </main>

            {/* Modal d'Anàlisi IAIA */}
            {isAnalyzing && (
                <div className="modal-overlay" onClick={() => setAiAdvice(null)}>
                    <div className="modal-content glass-premium animate-in" onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <Bot className="text-iaia" />
                            <h2>Analitzant amb l'Arxiver</h2>
                            <button className="btn-close" onClick={() => setAiAdvice(null)}>×</button>
                        </header>
                        
                        <div className="modal-body">
                            <div className="loading-iaia">
                                <Sparkles className="animate-spin" />
                                <p>L'Arxiver està regirant els papers del calaix...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {aiAdvice && (
                <div className="advice-modal-overlay animate-in" onClick={() => setAiAdvice(null)}>
                    <div className="advice-modal glass-premium shadow-2xl" onClick={e => e.stopPropagation()}>
                        <header className="advice-header">
                            <div className="header-main">
                                <Bot size={28} className="text-accent animate-pulse" />
                                <div>
                                    <h2>L'Assessoria de l'Arxiver</h2>
                                    <p className="subtitle">Anàlisi Sobirà de {selectedSub?.title}</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setAiAdvice(null)}><ArrowLeft size={20} /></button>
                        </header>
                        
                        <div className="advice-body scrollbar-hide">
                            <div className="advice-box shadow-inner">
                                <div className="advice-content whitespace-pre-wrap">
                                    {aiAdvice}
                                </div>
                            </div>

                            {selectedSub?.official_link && (
                                <div className="advice-link-highlight glass-premium">
                                    <div className="link-info">
                                        <ExternalLink size={24} className="text-accent" />
                                        <div>
                                            <h4>Documentació Oficial</h4>
                                            <p>Accedeix directament al tràmit de la GVA</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={selectedSub.official_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="master-button-canonic"
                                    >
                                        Anar a la Convocatòria 🏛️
                                    </a>
                                </div>
                            )}

                            <div className="export-section">
                                <h4>Gestió del Dossier</h4>
                                <div className="export-grid">
                                    <button className="btn-view-doc master-button-canonic bg-accent-orange text-black font-black" onClick={() => {
                                        const content = `
🏛️ DOSSIER DE SOBIRANIA I TRELLAT: ${selectedSub?.title?.toUpperCase() || 'DOCUMENT SENSE TÍTOL'}

REFERÈNCIA: [BATEGAT-MASTER-v14.1]
DATA D'AUTO-CUSTÒDIA: ${new Date().toLocaleDateString('ca-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
PILAR DE DESENVOLUPAMENT: ${selectedSub?.sector || 'GENERAL'}

I. EL PERQUÈ D'AQUESTA OPORTUNITAT (PEDAGOGIA DEL MAS)
Mestre, escolta bé: aquesta ajuda de ${selectedSub?.amount || '---'} no és regalada, és fruit d'una necessitat del territori per a modernitzar-se sense perdre l'ànima. 

L'Arxiver ha analitzat les dades i veu clarament que per a un projecte com el nostre, aquest bategat financer ens permetrà blindar el bosc de dades i assegurar que el nostre llegat no es perda en els servidors de Silicon Valley. Estem parlant de sobirania real.

II. ANÀLISI DETALLAT I DISSÈCCIÓ DE L'AJUDA
${selectedSub?.description || 'No hi ha descripció disponible.'}

DIDÀCTICA DE L'ARXIVER:
Imagineu-vos que estem plantant una olivera. Aquesta subvenció és l'aigua que l'ajudarà a arrelar fort. Cal demanar el que és just i necessari per a fer créixer la nostra idea de poble verd/digital.

III. LES CLAUS SAGRADES DE L'ÈXIT (REQUISITS)
Per a coronar amb èxit aquesta petició, necessites blindar aquests punts:

${(selectedSub?.requirements || []).map((r, idx) => `[PROTOCOL ${1911 + idx}] 🔹 ${r}`).join('\n')}

L'Arxiver recorda: "Papers en mà, cama en terra". Si no tenim el CSV de burocràcia ben net, no podrem creuar el portal del banc.

IV. LA VEU DE LA IAIA MARÍA (EL CONSELL DE L'EXPERIÈNCIA)
"${aiAdvice || selectedSub?.iaia_advice || 'Tingues trellat, fill.'}"

Diu l'IAIA que antigament les coses es feien amb una encaixada de mans, però ara tot són "claus" i "tokens". No t'atabalis. L'Arxiver regirarà els calaixos per a explicar-t'ho com cal.

V. CRÒNICA DE NAVEGACIÓ SOBIRANA (TRANSPARÈNCIA ARCHON)
L'IAIA ha navegat pels següents nodes:
[ACCÉS] Node de Subvencions Públiques. Enllaç: https://ajudes.gva.es/procediment/${selectedSub?.id}
[ANÀLISI] Motor Gemini bategant en mode LLM-Archon.

VI. QUÈ ET QUEDA PER FER AL MESTRE?
L'IAIA t'ha preparat el terreny, però la llavor la plantes tu:
1. [SIGNATURA] Entra a la Seu Electrònica (${selectedSub?.official_link || '#'}) i signa amb certificat.
2. [CUSTÒDIA] Guarda aquest dossier a la teua carpeta de Notes.

VII. NOTES DE SEGURETAT I CUSTÒDIA
Aquesta relíquia informativa està segellada sota el Protocol Rhizome v14. 
Bategat amb honor pel sistema Sóc de Poble. 🏺⚡️⚖️
`;
                                        setViewingDoc({
                                            id: selectedSub.id,
                                            title: selectedSub.title,
                                            sector: selectedSub.sector,
                                            content: content
                                        });
                                    }}>
                                        <FileText size={20} /> VISUALITZAR DOSSIER
                                    </button>

                                    <button onClick={() => handleExport('gdocs', selectedSub)}>
                                        <Sparkles size={16} /> Google Docs
                                    </button>
                                </div>
                            </div>
                        </div>

                        <footer className="advice-footer">
                            <button className="done-btn" onClick={() => setAiAdvice(null)}>Entès, Arxiver 🏺</button>
                        </footer>
                    </div>
                </div>
            )}

            {viewingDoc && (
                <DocumentViewer 
                    document={viewingDoc} 
                    onClose={() => setViewingDoc(null)}
                    onSave={() => {
                        alert("Relíquia coronada i guardada al teu Perfil Privat! 🏺✨");
                        setViewingDoc(null);
                        setAiAdvice(null);
                    }}
                />
            )}
        </div>
    );
};

export default BuscadorAjudes;
