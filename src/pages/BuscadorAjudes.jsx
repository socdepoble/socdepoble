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

    const sectors = ['tots', ...new Set(MOCK_SUBSIDIES.map(s => s.sector))];

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
            const query = `Analitza aquesta ajuda per a mi: "${sub.title}". Descripció: ${sub.description}. Requisits: ${sub.requirements.join(', ')}. Com ens pot ajudar al projecte Sóc de Poble?`;
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
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Llistat d'Ajudes */}
            <main className="sub-grid">
                {filteredSubsidies.map(sub => (
                    <article key={sub.id} className="sub-card glass-premium animate-in">
                        <header className="card-header">
                            <span className={`status-tag ${sub.status}`}>{sub.status.toUpperCase()}</span>
                            <span className="sector-tag">{sub.sector}</span>
                        </header>
                        
                        <div className="card-body">
                            <h3>{sub.title}</h3>
                            <div className="amount-highlight">{sub.amount}</div>
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
            {(isAnalyzing || aiAdvice) && (
                <div className="modal-overlay" onClick={() => setAiAdvice(null)}>
                    <div className="modal-content glass-premium animate-in" onClick={e => e.stopPropagation()}>
                        <header className="modal-header">
                            <Bot className="text-iaia" />
                            <h2>Analitzant amb l'Arxiver</h2>
                            <button className="btn-close" onClick={() => setAiAdvice(null)}>×</button>
                        </header>
                        
                        <div className="modal-body">
                            {isAnalyzing ? (
                                <div className="loading-iaia">
                                    <Sparkles className="animate-spin" />
                                    <p>L'Arxiver està regirant els papers del calaix...</p>
                                </div>
                            ) : (
                                <div className="advice-box">
                                    <p className="advice-text italic">"{aiAdvice}"</p>
                                    
                                    <div className="export-section">
                                        <h4>Gestió del Dossier</h4>
                                        <div className="export-grid">
                                            <button className="btn-view-doc master-button-canonic bg-accent-orange text-black font-black" onClick={() => {
                                                const content = `
================================================================
🏛️ DOSSIER DE SOBIRANIA I TRELLAT: ${selectedSub.title.toUpperCase()}
================================================================
Referència: [BATEGAT-MASTER-v14.1]
Data d'Auto-Custòdia: ${new Date().toLocaleDateString('ca-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Pilar de Desenvolupament: ${selectedSub.sector}

I. EL PERQUÈ D'AQUESTA OPORTUNITAT (PEDAGOGIA DEL MAS)
----------------------------------------------------------------
Mestre, escolta bé: aquesta ajuda de ${selectedSub.amount} no és regalada, és fruit d'una necessitat del territori per a modernitzar-se sense perdre l'ànima. 

L'Arxiver ha analitzat les dades i veu clarament que per a un projecte com el nostre, aquest bategat financer ens permetrà blindar el bosc de dades i assegurar que el nostre llegat no es perda en els servidors de Silicon Valley. Estem parlant de sobirania real, de la que es toca amb les mans.

II. ANÀLISI DETALLAT I DISSÈCCIÓ DE L'AJUDA
----------------------------------------------------------------
${selectedSub.description}

DIDÀCTICA DE L'ARXIVER:
Imagineu-vos que estem plantant una olivera. Aquesta subvenció és l'aigua que l'ajudarà a arrelar fort. Però compte, que si reguem massa (si demanem massa sense trellat), les arrels es podreixen. Cal demanar el que és just i necessari per a fer créixer la nostra idea de poble verd/digital.

III. LES CLAUS SAGRADES DE L'ÈXIT (REQUISITS)
----------------------------------------------------------------
Per a coronar amb èxit aquesta petició, necessites blindar aquests punts:

${selectedSub.requirements.map((r, idx) => `${idx + 1}. [PROTOCOL ${1911 + idx}] 🔹 ${r}`).join('\n')}

L'Arxiver recorda: "Papers en mà, cama en terra". Si no tenim el CSV de burocràcia ben net, no podrem creuar el portal del banc.

IV. LA VEU DE LA IAIA MARÍA (EL CONSELL DE L'EXPERIÈNCIA)
----------------------------------------------------------------
"${aiAdvice || selectedSub.iaia_advice}"

Diu l'IAIA que antigament les coses es feien amb una encaixada de mans, però ara tot són "claus" i "tokens". No t'atabalis. Si no entens un mot, pregunta-li al xat que tens al costat. L'Arxiver regirarà els calaixos per a explicar-t'ho com si fórem a la plaça del poble.

V. CRÒNICA DE NAVEGACIÓ SOBIRANA (TRANSPARÈNCIA ARCHON)
----------------------------------------------------------------
A sol·licitud del Mestre, l'Arxiver fa transparent el protocol executat. L'IAIA ha navegat pels següents nodes:

[ACCÉS] Node de Subvencions Públiques (MOCK_DATA).
Enllaç: https://ajudes.gva.es/procediment/${selectedSub.id}
Acció: Extracció de requisits i terminis per a l'ajuda "${selectedSub.title}".

[ANÀLISI] Motor Gemini bategant en mode LLM-Archon.
Acció: Dissecció de la lletra petita per a trobar el trellat del Mas.

VI. QUÈ ET QUEDA PER FER AL MESTRE? (PASSIÓ I SOBIRANIA)
----------------------------------------------------------------
L'IAIA t'ha preparat el terreny, però la llavor la plantes tu:

1. [SIGNATURA] Has d'entrar a la Seu Electrònica (${selectedSub.official_link}) i signar la sol·licitud amb el teu certificat. L'IAIA no pot signar per tu, és la teua sobirania.
2. [CUSTÒDIA] Guarda aquest dossier a la teua carpeta de Notes per a tenir els requisits a mà durant la tramitació.

VII. NOTES DE SEGURETAT I CUSTÒDIA
----------------------------------------------------------------
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
                            )}
                        </div>
                    </div>
                </div>
            )}

            {viewingDoc && (
                <DocumentViewer 
                    document={viewingDoc} 
                    onClose={() => setViewingDoc(null)}
                    onSave={(doc) => {
                        console.log("[SAVED] Document coronat al perfil:", doc.title);
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
