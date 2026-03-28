import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Maximize2, Minimize2, FileText, Image as ImageIcon, Music, Type, Download, Share2, ZoomIn, ZoomOut, ShieldCheck, MessageSquarePlus, History, Sparkles } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { logger } from '../utils/logger';
import './OmniscientViewer.css';

/**
 * OmniscientViewer: El "Escritorio del Investigador".
 * Ahora con Capa de Solatge (Memoria Viva) para metadatos manuales.
 */
const OmniscientViewer = () => {
    const { isViewerOpen, viewerConfig, closeViewer, openViewer, openPostModal } = useModal();
    const [isExpanded, setIsExpanded] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [content, setContent] = useState(null);
    const [manualNote, setManualNote] = useState("");
    const [savedNotes, setSavedNotes] = useState({
        'did:soc:img-carrasca-zurca': { text: "El tio Batiste deia que ací s'amagaven els maquis durant la postguerra.", type: 'CULTURE' },
        'did:soc:img-carrasca-foia': { text: "Aquesta carrasca encara fa unes bellotes molt dolces.", type: 'CULTURE' },
        'did:soc:img-carrasca-zurca#page-1': { text: "Estat 2024: Ha rebrotat parcialment.", type: 'STATUS' }
    });
    const [selectedText, setSelectedText] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const toolbarRef = useRef(null);
    
    const audioBarHeights = React.useMemo(() => [
        45, 78, 23, 56, 89, 34, 67, 90, 21, 54, 87, 32, 65, 98, 43, 76, 29, 62, 95, 28, 51, 84, 37, 70, 93, 26, 59, 82, 35, 68
    ], []);

    const handleTextSelection = useCallback((e) => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        const toolbar = toolbarRef.current;

        if (text && toolbar) {
            setSelectedText(text);
            toolbar.style.display = 'flex';
            toolbar.style.top = `${e.clientY - 40}px`;
            toolbar.style.left = `${e.clientX}px`;
        } else if (toolbar) {
            toolbar.style.display = 'none';
        }
    }, []);

    const handleDragToQuote = useCallback(() => {
        if (!selectedText) return;
        logger.info(`[Librarian] Drag-to-Quote: "${selectedText}"`);
        // En una app real, aquí enviaríamos el mensaje al xat activo
        alert(`Citat al xat: "${selectedText}"`);
        const toolbar = toolbarRef.current;
        if (toolbar) toolbar.style.display = 'none';
        window.getSelection().removeAllRanges();
    }, [selectedText]);

    const handleAddNote = useCallback(() => {
        const pageId = viewerConfig.anchor || 'page-1';
        const typeStr = prompt("Tria tipus (S: Salut, C: Cultura, F: Fe d'errades):", "S").toUpperCase();
        const type = typeStr === 'C' ? 'CULTURE' : typeStr === 'F' ? 'CORRECTION' : 'STATUS';
        const text = prompt("Afegeix una nota de solatge:", "");

        if (text) {
            setIsSyncing(true);
            setTimeout(() => {
                setSavedNotes(prev => ({
                    ...prev,
                    [`${viewerConfig.did}#${pageId}`]: { text, type, author: 'Mestre Javi' }
                }));
                setIsSyncing(false);
            }, 1000);
        }
        const toolbar = toolbarRef.current;
        if (toolbar) toolbar.style.display = 'none';
    }, [viewerConfig]);

    const handleLaunchDebate = useCallback(() => {
        const pageId = viewerConfig.anchor || 'page-1';
        const contextData = {
            did: viewerConfig.did,
            anchor: pageId,
            selectedText: selectedText,
            sourceTitle: viewerConfig.label || 'Arxiu Municipal',
            imageUrl: viewerConfig.type === 'IMAGE' ? viewerConfig.did : null
        };

        openPostModal({
            isPrivate: false,
            initialContext: contextData,
            postType: 'archive_debate'
        });

        const toolbar = toolbarRef.current;
        if (toolbar) toolbar.style.display = 'none';
        setSelectedText("");
    }, [viewerConfig, selectedText, openPostModal]);

    const fetchContent = useCallback(async (url) => {
        try {
            const resp = await fetch(url);
            const text = await resp.text();
            setContent(text);
        } catch (e) {
            logger.error('[Viewer] Error carregant contingut:', e);
        }
    }, []);

    useEffect(() => {
        if (isViewerOpen && viewerConfig) {
            logger.info(`[Viewer] Carregant contingut per a DID: ${viewerConfig.did}`);
            // Simulació de càrrega de contingut segons tipus
            if (viewerConfig.type === 'PDF') {
                // Deferred to next tick to avoid synchronous setState inside effect warning
                const timer = setTimeout(() => {
                    fetchContent('/TECHNICAL_REPORT_VIVO.md'); // Mock PDF source
                }, 0);
                return () => clearTimeout(timer);
            }
        }
    }, [isViewerOpen, viewerConfig, fetchContent]);


    const getImageMetadata = () => {
        if (!viewerConfig || viewerConfig.type !== 'IMAGE') return null;

        // Mock de metadades del Catàleg d'Arbres 2020
        if (viewerConfig.did.includes('carrasca-foia')) {
            return {
                species: "Quercus rotundifolia (Carrasca)",
                dimensions: "Alçada: 10m | Perímetre tronc: 243 cm",
                location: "La Foia Blanca | Polígon 5, Parcel·la 10",
                status: "Sana",
                source: "Catàleg d'Arbres de 2020, p. 25"
            };
        }
        if (viewerConfig.did.includes('carrasca-zurca')) {
            return {
                species: "Quercus rotundifolia (Carrasca)",
                dimensions: "Alçada: 7.5m | Estat: Envellit/Moribund",
                location: "Mas de la Zurca (Relleu) | 885m",
                status: "Crítica",
                source: "Catàleg d'Arbres de 2020, p. 33"
            };
        }
        if (viewerConfig.did.includes('pi-pipa')) {
            return {
                species: "Pinus halepensis (Pi blanc)",
                dimensions: "Perímetre: 427cm | Capçada: 23m",
                location: "Ctra. Abió (1.5km) | Mas de Pipa",
                status: "Senescent",
                source: "Catàleg d'Arbres de 2007, p. 19"
            };
        }
        if (viewerConfig.did.includes('carrasca-nofre')) {
            return {
                species: "Quercus rotundifolia (Carrasca)",
                dimensions: "Perímetre: 288cm | Capçada: 18m",
                location: "Barranc de la Zurca | Ctra. Relleu",
                status: "Sana",
                source: "Catàleg d'Arbres de 2007, p. 7",
                utm: "X: 725181, Y: 4275887"
            };
        }
        if (viewerConfig.did.includes('pi-arrendaors')) {
            return {
                species: "Pinus halepensis (Pi blanc)",
                dimensions: "Perímetre 2020: 582cm | Alçada: 16m",
                location: "Partida del Pla | Propietat Privada",
                status: "Monumental",
                source: "Catàleg d'Arbres de 2020, p. 75",
                biometrics: { delta: "+12cm (2007-2020)", age: "Est. 250 anys" },
                coords: { lat: 38.6015, lon: -0.4123 }
            };
        }
        return null;
    };

    const getAuditData = () => {
        if (!viewerConfig || viewerConfig.type !== 'COMPARISON') return null;

        // Mock d'Auditoria Temporal: Pi de la Foia Boix
        if (viewerConfig.did.includes('pi-foia-boix')) {
            return {
                label: "Pi de la Foia Boix",
                data2007: { height: "19m", perimeter: "5m", status: "Senescent", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "19m (Estable)", perimeter: "5.2m", status: "Alerta Crítica", image: "/rural_tech_future_valencia.png" },
                observation: "L'IAIA detecta pèrdua de massa forestal en la branca de llevant des de 2007."
            };
        }
        // Comparativa Pi de Pipa vs Carrasca de Nofre
        if (viewerConfig.did.includes('audit-trees')) {
            return {
                label: "Auditoria Diferencial: Pi vs Carrasca",
                data2007: { height: "13m (Pi)", perimeter: "427cm", status: "Cicatriu/Risc", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "13m (Carrasca)", perimeter: "288cm", status: "Sana", image: "/rural_tech_future_valencia.png" },
                observation: "El Pi de Pipa requereix apuntalament estructural per pèrdua de fust antic."
            };
        }

        // Protocol Espill del Temps: Xiprers del Cementeri
        if (viewerConfig.did.includes('xiprers-cementeri')) {
            return {
                label: "Xiprers del Cementeri",
                data2007: { height: "15m", perimeter: "180cm", protection: "Mur original", status: "Sana", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "16.5m", perimeter: "195cm", protection: "Ampliació mur", status: "Senescència", image: "/rural_tech_future_valencia.png" },
                delta: { growth: "+1.5m", health: "⚠️ Degradació lenta" },
                observation: "L'ampliació del cementeri ha canviat l'entorn de les arrels. L'IAIA demana verificar si hi ha noves clarianes al fullatge."
            };
        }

        // Protocol Espill del Temps: Pi del Mas de Pipa
        if (viewerConfig.did.includes('pi-pipa')) {
            return {
                label: "Pi del Mas de Pipa",
                data2007: { height: "13m", perimeter: "427cm", protection: "Risc esgarrar", status: "Cicatriu/Risc", image: "/rural_tech_future_valencia.png" },
                data2020: { height: "13m", perimeter: "427cm", protection: "Apuntalat", status: "Manteniment", image: "/rural_tech_future_valencia.png" },
                delta: { growth: "0cm", health: "✅ Estabilitzat" },
                observation: "L'apuntalamiento recomanat en 2007 sembla haver estabilitzat l'estructura del gegant."
            };
        }
        return null;
    };

    const handleSaveNote = useCallback(() => {
        if (!manualNote.trim()) return;
        const newNotes = { ...savedNotes, [viewerConfig.did]: manualNote };
        setSavedNotes(newNotes);
        setManualNote("");
        logger.info(`[Solatge] Nota guardada per a ${viewerConfig.did}`);
        // En una app real, aquí persistiríamos en la DB local (Rhizome)
    }, [manualNote, savedNotes, viewerConfig]);

    if (!isViewerOpen || !viewerConfig) return null;

    const renderContent = () => {
        switch (viewerConfig.type) {
            case 'PDF': {
                return (
                    <div className="viewer-pdf-container">
                        <div ref={toolbarRef} className="pdf-selection-toolbar animate-in" id="pdf-quote-tool" style={{ display: 'none' }}>
                            <button className="btn-quote" onClick={handleDragToQuote}>
                                <MessageSquarePlus size={14} /> CITAR
                            </button>
                            <button className="btn-postit" onClick={handleAddNote}>
                                <FileText size={14} /> ANOTAR
                            </button>
                            <button className="btn-guant" onClick={handleLaunchDebate}>
                                <Sparkles size={14} /> LLANÇAR EL GUANT
                            </button>
                        </div>
                        <div
                            className="viewer-pdf-mock"
                            style={{ transform: `scale(${zoom})` }}
                            onMouseUp={handleTextSelection}
                        >
                            <div className="pdf-page-container">
                                <div className="report-markdown-view" dangerouslySetInnerHTML={{
                                    __html: content ? content
                                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                        .replace(/^## (.*$)/gim, '<h2>$2</h2>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/^- (.*$)/gim, '<li>$1</li>')
                                        .split('\n').map((line, i) => {
                                            const pageNum = Math.floor(i / 10) + 1;
                                            const anchorId = `page-${pageNum}`;
                                            const isTarget = viewerConfig.anchor === anchorId;
                                            const pageNote = savedNotes[`${viewerConfig.did}#${anchorId}`];

                                            return `<p id="v-page-${pageNum}" class="pdf-line ${isTarget ? 'highlight-flash' : ''}">
                                                <span class="page-marker">${pageNum}</span> 
                                                ${line}
                                                ${isTarget ? '<span class="grounding-pin-spot">📍</span>' : ''}
                                                ${pageNote ? `<span class="solatge-pin" title="${pageNote}">📜</span>` : ''}
                                            </p>`;
                                        }).join('') : 'Cargando documento soberano...'
                                }} />
                            </div>
                        </div>
                    </div>
                );
            }
            case 'IMAGE': {
                const meta = getImageMetadata();
                return (
                    <div className="viewer-image-container">
                        <img
                            src={viewerConfig.did.includes('carrasca') ? '/rural_tech_future_valencia.png' : '/logo.png'}
                            alt={viewerConfig.label}
                            style={{ transform: `scale(${zoom})` }}
                            className="omni-image"
                        />
                        {meta && (
                            <div className="image-metadata-card animate-in">
                                <div className="meta-context">CAPA BASE: VERITAT DE FERRO (DADES OFICIALS)</div>
                                <div className="meta-row main">
                                    <strong>{meta.species}</strong>
                                    <span className={`status-tag ${meta.status.toLowerCase()}`}>{meta.status}</span>
                                </div>
                                <div className="meta-row">
                                    <span>📏 {meta.dimensions}</span>
                                </div>
                                <div className="meta-row">
                                    <span>📍 {meta.location}</span>
                                </div>
                                {meta.biometrics && (
                                    <div className="biometric-delta-badge">
                                        <History size={14} /> EVOLUCIÓ: {meta.biometrics.delta} ({meta.biometrics.age})
                                    </div>
                                )}
                                {meta.coords && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${meta.coords.lat},${meta.coords.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="coordinate-link"
                                    >
                                        🌐 NAVEGACIÓ SOBIRANA: {meta.coords.lat}, {meta.coords.lon}
                                    </a>
                                )}
                                {meta.utm && (
                                    <div className="utm-badge">UTM: {meta.utm}</div>
                                )}
                                <div className="meta-footer">
                                    <span>Font ocupada: {meta.source}</span>
                                </div>
                            </div>
                        )}

                        <div className="solatge-layer animate-in">
                            <div className="meta-context solatge">CAPA DE SOLATGE: MEMÒRIA VIVA (METADADES MANUALS)</div>
                            <div className="solatge-content">
                                {savedNotes[viewerConfig.did] ? (
                                    <div className={`saved-note type-${savedNotes[viewerConfig.did].type}`}>
                                        <History size={16} />
                                        <p><strong>{savedNotes[viewerConfig.did].type}:</strong> {savedNotes[viewerConfig.did].text}</p>
                                        <button className="btn-edit-note" onClick={() => setManualNote(savedNotes[viewerConfig.did].text)}>Editar</button>
                                    </div>
                                ) : (
                                    <div className="solatge-input-group">
                                        <textarea
                                            placeholder="Afegir història oral, correcció o observació actual..."
                                            value={manualNote}
                                            onChange={(e) => setManualNote(e.target.value)}
                                        />
                                        <button onClick={handleSaveNote} disabled={!manualNote.trim()}>
                                            <MessageSquarePlus size={16} /> ENRIQUIR
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="btn-jump-source" onClick={() => openViewer({ ...viewerConfig, type: 'PDF', anchor: 'page=25' })}>
                            <FileText size={16} /> Veure al document original
                        </button>
                    </div>
                );
            }
            case 'AUDIO': {
                const timestamp = viewerConfig.anchor.split('=')[1] || '0:00';
                return (
                    <div className="viewer-audio-container">
                        <div className="audio-hero">
                            <div className="audio-visualizer-bars">
                                {audioBarHeights.map((height, i) => (
                                    <div key={i} className="v-bar animate-pulse-fast" style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                            <div className="audio-time-badge">{timestamp}</div>
                        </div>

                        <div className="karaoke-transcription">
                            <p className={timestamp === '04:23' ? 'active-line' : ''}>
                                "...perquè el millor moment per a podar, com deia mon pare, <strong>és la lluna vella del gener</strong>."
                            </p>
                            <p>
                                "Si ho fas en lluna nova, la fusta es podreix i el fruit no ix amb força."
                            </p>
                            <p>
                                "Això ho hem sabut tota la vida a la Torre, i qui no ho fa així, és que no té trellat."
                            </p>
                        </div>

                        <div className="audio-identity-card">
                            <Music size={24} className="text-primary" />
                            <div className="id-stack">
                                <strong>Entrevista a Batiste</strong>
                                <span>Gravació: 12/01/2026</span>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'TEXT': {
                return (
                    <div className="viewer-text-node">
                        <div className="text-peritext-view">
                            <div className="peritext-header">
                                <Type size={16} /> Bloc de Memòria Semàntic
                            </div>
                            <div className="peritext-body">
                                <p className={viewerConfig.anchor.includes('block_aq_45') ? 'highlight-flash' : ''}>
                                    {content || "Carregant memòria del poble..."}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'COMPARISON': {
                const audit = getAuditData();
                if (!audit) return <div className="viewer-fallback">Dades d'auditoria no trobades.</div>;
                return (
                    <div className="viewer-comparison-container">
                        <div className="comparison-header">
                            <History size={20} className="text-primary" />
                            <h3>L'ESPILL DEL TEMPS: {audit.label}</h3>
                        </div>

                        <div className="comparison-images-row three-slots">
                            <div className="comp-image-box">
                                <div className="comp-label">2007 (Origen)</div>
                                <img src={audit.data2007.image} alt="2007" />
                            </div>
                            <div className="comp-separator">→</div>
                            <div className="comp-image-box">
                                <div className="comp-label">2020 (Resistència)</div>
                                <img src={audit.data2020.image} alt="2020" />
                            </div>
                            <div className="comp-separator">→</div>
                            <div className="comp-image-box placeholder-2024">
                                <div className="comp-label">2024 (Ara)</div>
                                <div className="empty-slot-msg">Pendent d'Auditoria</div>
                                <button className="btn-add-today"><Maximize2 size={12} /> PUJAR FOTO</button>
                            </div>
                        </div>

                        <div className="comparison-table-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>PARÀMETRE</th>
                                        <th>2007</th>
                                        <th>2020</th>
                                        <th>DELTA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Alçada</td>
                                        <td>{audit.data2007.height}</td>
                                        <td className="updated">{audit.data2020.height}</td>
                                        <td className="delta-val">{audit.delta?.growth || '--'}</td>
                                    </tr>
                                    <tr>
                                        <td>Perímetre</td>
                                        <td>{audit.data2007.perimeter}</td>
                                        <td className="updated">{audit.data2020.perimeter}</td>
                                        <td className="delta-val">{audit.delta?.perimeter || '--'}</td>
                                    </tr>
                                    <tr>
                                        <td>Protecció</td>
                                        <td>{audit.data2007.protection || '--'}</td>
                                        <td className="updated">{audit.data2020.protection || '--'}</td>
                                        <td className="delta-val">✅</td>
                                    </tr>
                                    <tr>
                                        <td>Salut</td>
                                        <td>{audit.data2007.status}</td>
                                        <td className={`status-val ${audit.delta?.health?.includes('⚠️') ? 'status-alert' : 'status-ok'}`}>
                                            {audit.data2020.status}
                                        </td>
                                        <td className="delta-val">{audit.delta?.health || '--'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="iaia-observation-card">
                            <ShieldCheck size={18} />
                            <p><strong>AUDITORIA IAIA:</strong> {audit.observation}</p>
                            <button className="btn-confirm-life">VALIDAR ESTAT ACTUAL (2024)</button>
                        </div>
                    </div>
                );
            }
            default: {
                return <div className="viewer-fallback">Cargando fuente de datos...</div>;
            }
        }
    };

    return (
        <aside className={`omniscient-viewer ${isExpanded ? 'expanded' : ''} animate-slide-in`}>
            <header className="viewer-header">
                <div className="viewer-header-premium">
                    <div className="title-row">
                        <h2>Omniscient Viewer [MASTER]</h2>
                        <div className={`sync-status ${isSyncing ? 'syncing' : ''}`}>
                            <div className="sync-dot"></div>
                            <span>{isSyncing ? 'Sincronitzant Solatge...' : 'Local-First Active'}</span>
                        </div>
                    </div>
                </div>
                <div className="viewer-meta">
                    <ShieldCheck size={18} className="text-primary" />
                    <span className="did-label">{viewerConfig.did}</span>
                </div>
                <div className="viewer-actions">
                    <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))} title="Zoom In"><ZoomIn size={18} /></button>
                    <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} title="Zoom Out"><ZoomOut size={18} /></button>
                    <button onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Contraer" : "Expandir"}>
                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button onClick={closeViewer} className="btn-close-viewer"><X size={18} /></button>
                </div>
            </header>

            <div className="viewer-body">
                <div className="viewer-status-bar">
                    <div className="status-item">
                        {viewerConfig.type === 'PDF' && <FileText size={14} />}
                        {viewerConfig.type === 'IMAGE' && <ImageIcon size={14} />}
                        {viewerConfig.type === 'AUDIO' && <Music size={14} />}
                        <span>{viewerConfig.label}</span>
                    </div>
                    <div className="status-item anchor">
                        <Type size={14} />
                        <span>{viewerConfig.anchor}</span>
                    </div>
                </div>

                <div className="viewer-content">
                    {renderContent()}
                </div>
            </div>

            <footer className="viewer-footer">
                <button className="btn-footer-action"><Download size={16} /> Descargar</button>
                <button className="btn-footer-action"><Share2 size={16} /> Compartir</button>
                <div className="iron-seal">VERITAT DE FERRO</div>
            </footer>
        </aside>
    );
};

export default React.memo(OmniscientViewer);
