import React, { useState, useEffect, useRef } from 'react';
import { 
    X, 
    Download, 
    Bookmark, 
    Share2, 
    FileText, 
    ChevronLeft,
    Check,
    Tag,
    Shield,
    Send,
    MessageCircle
} from 'lucide-react';
import { hapticService } from '../services/hapticService';
import { geminiService } from '../services/geminiService';
import './DocumentViewer.css';

/**
 * DocumentViewer [MASTER v14.1.0]
 * Espai sobirà per a la previsualització i gestió de relíquies documentals.
 * Inclou Llegibilitat de Sant Grial i Xat de l'Arxiver.
 */
const DocumentViewer = ({ document: doc, onClose, onSave }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: `Soc l'Arxiver del Mas. He bategat aquest document sobre "${doc.title}". Vols que t'explique algun detall o que et diga com t'afecta al teu tros?` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!doc) return null;

    const handleSave = () => {
        hapticService.notifySuccess();
        onSave?.(doc);
    };

    const handleDownload = () => {
        hapticService.batec();
        const blob = new Blob([doc.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${doc.title.replace(/\s+/g, '_')}_socdepoble.txt`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1000);
    };

    /**
     * Motor de Maquetació Bategada del Mas (v1.5)
     * Transforma text pla en HTML didàctic i jerarquitzat per a la lectura ràpida.
     */
    const formatContent = (text) => {
        if (!text) return '';
        
        let formatted = text
            // 1. Detecció de Subtítols (Neteja total de guions i caràcters de separació)
            .replace(/^([IVX]+\..+)$/gm, (match) => {
                const clean = match.replace(/^[^a-zA-ZÀ-ÿ0-9]*/, '').replace(/[^a-zA-ZÀ-ÿ0-9]*$/, '').trim();
                return `<div class="subtitol-bategat">${clean}</div>`;
            })
            .replace(/^={3,}(.+?)={3,}$/gm, '<div class="subtitol-bategat">$1</div>')
            .replace(/^-{3,}(.+?)-{3,}$/gm, '<div class="subtitol-bategat">$1</div>')
            .replace(/^([A-ZÀ-Ÿ\s]{5,})$/gm, '<div class="subtitol-bategat">$1</div>') // Títols en majúscules sols
            
            // 2. Neteja de "morca" visual (Guions de separació que ja no calen)
            .replace(/^-{3,}$/gm, '')
            .replace(/^={3,}$/gm, '')
            
            // 3. Negretes de Lectura Ràpida (Emphasized Bategat)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[PROTOCOL (\d+)\]/g, '<span class="protocol-tag">PROTOCOL $1</span>');

        return { __html: formatted };
    };

    const handleAsk = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputValue('');
        setIsThinking(true);
        hapticService.batec();

        try {
            const context = `CONTEXT DOCUMENTAL:\n${doc.content}\n\nL'usuari pregunta: ${userMsg}`;
            const response = await geminiService.ask('ARXIVER', context);
            
            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: response.error ? "Ai fill, s'ha tallat el bategat del banc. Torna-ho a provar." : response.text 
            }]);
        } catch (error) {
            console.error("[DocumentViewer] Error al xat de l'Arxiver:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "L'Arxiver s'ha embullat amb els papers. Prova de nou, mestre." }]);
        } finally {
            setIsThinking(false);
            hapticService.notifySuccess();
        }
    };

    return (
        <div className="document-viewer-overlay animate-in" onClick={onClose}>
            <div className="document-viewer-container glass-master" onClick={e => e.stopPropagation()}>
                {/* Header d'Accions Navitals */}
                <header className="viewer-header">
                    <button className="btn-viewer-close tactile-target" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <div className="viewer-id-sec">
                        <Shield size={14} className="text-accent-orange" />
                        <span>SANT GRIAL DE LA LLEGIBILITAT [v14.1]</span>
                    </div>
                </header>

                <div className="viewer-main-layout">
                    {/* Cos del Document (Esquerra) */}
                    <main className="viewer-content-wrapper no-scrollbar">
                        {/* PÀGINA 1: PORTADA D'ART DIDÀCTIC */}
                        <article className="document-sheet cover-page">
                            <div className="sheet-header-meta">
                                <span>{new Date().toLocaleDateString('ca-ES')} | {new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="page-number">PÀGINA 1 DE 2</span>
                            </div>

                            <img 
                                src={`/images/dossiers/${doc.sector?.toLowerCase().includes('digital') ? 'infografia_kit_digital' : 'territori'}.png`} 
                                alt="Portada Infogràfica Nano Banana" 
                                className="dossier-nano-infography"
                            />

                            <header className="sheet-header" style={{ border: 'none', paddingLeft: 0, textAlign: 'center' }}>
                                <h1 style={{ fontSize: '3.5rem' }}>{doc.title}</h1>
                                <div className="sheet-meta" style={{ justifyContent: 'center' }}>
                                    <span><Tag size={16} /> {doc.sector}</span>
                                    <span><Shield size={16} /> RELÍQUIA DEL MAS</span>
                                </div>
                                {/* SEGELL DEL MAS GRAVAT A FOC */}
                                <div className="infography-footer-seal" style={{ marginTop: '30px', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <img src="/assets/master/logo_socdepoble_black_sketch.png" alt="" style={{ height: '16px' }} />
                                    <span style={{ fontWeight: 800, fontSize: '10pt', color: '#000' }}>socdepoble.org</span>
                                </div>
                            </header>
                        </article>

                        {/* PÀGINA 2: COS DEL TEXT (AMB RECTIFICACIÓ 14PT) */}
                        <article className="document-sheet">
                            <div className="sheet-watermark">SÓC DE POBLE</div>
                            <div className="sheet-header-meta">
                                <img src="/assets/master/logo_socdepoble_black_sketch.png" alt="Logo Canònic" style={{ height: '24px', opacity: 0.8 }} />
                                <span className="page-number">PÀGINA 2 DE 2</span>
                            </div>
                            
                            <div className="sheet-body" style={{ flex: 1, marginTop: '10mm' }}>
                                <div 
                                    className="content-raw" 
                                    dangerouslySetInnerHTML={formatContent(doc.content)} 
                                />
                            </div>

                            <footer className="sheet-footer">
                                <div className="footer-logos">
                                    <img src="/assets/master/logo_socdepoble_black_sketch.png" alt="Sóc de Poble" style={{ height: '20px' }} />
                                    <span style={{ fontWeight: 800, color: '#333' }}>socdepoble.org</span>
                                </div>
                                <p>Llegibilitat Sant Grial v3 (18pt Condensed) | Protocol 1911/2024</p>
                                <span className="page-number">SÓC DE POBLE!</span>
                            </footer>
                        </article>
                    </main>

                    {/* Xat de l'Arxiver (Dreta) */}
                    <aside className="viewer-chat-sidebar">
                        <div className="chat-header">
                            <MessageCircle size={20} className="text-accent-orange" />
                            <h3>Preguntar a l'Arxiver</h3>
                        </div>
                        
                        <div className="chat-messages no-scrollbar" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={`msg ${m.role}`}>
                                    {m.text}
                                </div>
                            ))}
                            {isThinking && <div className="msg ai">Regirant els papers... ✨</div>}
                        </div>

                        <div className="chat-input-sec">
                            <input 
                                type="text" 
                                placeholder="Escriu aquí el teu dubte..." 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                            />
                            <button className="btn-send" onClick={handleAsk}>
                                <Send size={20} />
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Footer de Comandament Sobirà */}
                <footer className="viewer-actions-bar">
                    <button className="btn-action-secondary" onClick={handleDownload}>
                        <Download size={24} />
                        <span>Baixar</span>
                    </button>
                    
                    <button className="btn-action-primary master-button-canonic" onClick={handleSave}>
                        <Bookmark size={24} />
                        <span>CORONAR AL PERFIL</span>
                    </button>

                    <button className="btn-action-secondary">
                        <Share2 size={24} />
                        <span>Nexe</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DocumentViewer;
