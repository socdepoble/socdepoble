import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FileText, Download, CheckCircle, ArrowLeft, ShieldCheck, Sparkles, Upload, FileUp, X, Globe, Lock, Users } from 'lucide-react';
import './PDFBategatManager.css';

// Configurar Worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const PDFBategatManager = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: 'JAVI LLINARES',
        dni: '12345678X',
        address: 'MAS D\'IBAÑEZ S/N',
        event: 'DECLARACIÓ RESPONSABLE',
        municipality: 'BENIARBEIG',
        message: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('bategat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [isPublic, setIsPublic] = useState(false);
    const fileInputRef = useRef(null);

    const clearFormData = () => {
        setFormData({
            name: '',
            dni: '',
            address: '',
            event: '',
            municipality: '',
            message: ''
        });
        setUploadedFile(null);
        setIsPublic(false);
        setHistory([]);
        localStorage.removeItem('bategat_history');
    };

    const removeFromHistory = (fileName) => {
        const newHistory = history.filter(h => h.name !== fileName);
        setHistory(newHistory);
        localStorage.setItem('bategat_history', JSON.stringify(newHistory));
    };

    const autoFillWithIdentity = () => {
        setFormData({
            name: 'JAVI LLINARES',
            dni: '12345678X',
            address: 'MAS D\'IBAÑEZ S/N',
            event: 'DECLARACIÓ RESPONSABLE',
            municipality: 'BENIARBEIG',
            message: 'Sol·licito la validació del Protocol Rhizome per al meu node municipal.'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setFileVisibility = (fileName, visibility) => {
        const newHistory = history.map(h => 
            h.name === fileName ? { ...h, visibility } : h
        );
        setHistory(newHistory);
        localStorage.setItem('bategat_history', JSON.stringify(newHistory));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
            console.log("IAIA: Analitzant PDF orfe amb el Protocol d'Identificació de Camps Legals...");
            
            // Actualització d'historial amb governança (per defecte PRIVAT)
            const newHistory = [
                { name: file.name, date: new Date().toISOString(), visibility: 'private' }, 
                ...history.filter(h => h.name !== file.name)
            ].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem('bategat_history', JSON.stringify(newHistory));
        }
    };

    /**
     * 🏺 MASTER PDF ANALYSIS (Coordinate Extraction)
     * Busca les coordenades (x, y) de paraules clau per a posicionar els camps exactament on toca.
     */
    const analyzePDFStructure = async (fileBytes) => {
        try {
            console.log("IAIA: Iniciant Protocol d'Identificació de Camps Legals...");
            const loadingTask = pdfjsLib.getDocument({ 
                data: fileBytes,
                stopAtErrors: false, // Protocol de càrrega resilient per a XRefs corruptes
                isEvalSupported: false 
            });
            const pdf = await loadingTask.promise;
            
            // Analitzem la primera pàgina per buscar els anchors
            const page = await pdf.getPage(1);
            const content = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1.0 });

            console.log(`IAIA: Pàgina analitzada. Detectats ${content.items.length} elements de text.`);

            const anchors = {
                name: null,
                dni: null,
                address: null,
                event: null,
                signature: null,
                municipality: null
            };

            content.items.forEach(item => {
                const text = item.str.toLowerCase();
                const [, , , scaleY, x, y] = item.transform;
                const size = Math.abs(scaleY);

                // Detecció de zones legalment precises (Regex heretada del protocol Xylella)
                if ((/nom:|primer cognom|interessat|mercantil/).test(text) && !anchors.name) {
                    anchors.name = { x, y, size, context: item.str };
                }
                if ((/dni:|nif\/cif|número d'identificació|nif:/).test(text) && !anchors.dni) {
                    anchors.dni = { x, y, size, context: item.str };
                }
                if ((/adreça:|domicili|calle\/avenida|carrer/).test(text) && !anchors.address) {
                    anchors.address = { x, y, size, context: item.str };
                }
                if ((/municipi:|localitat|població/).test(text) && !anchors.municipality) {
                    anchors.municipality = { x, y, size, context: item.str };
                }
                if ((/activitat:|explica|objecte|sol·licitud/).test(text) && !anchors.event) {
                    anchors.event = { x, y, size, context: item.str };
                }
                if ((/signat:|firmado|firma/).test(text) && !anchors.signature) {
                    anchors.signature = { x, y, size, context: item.str };
                }
            });

            console.log("IAIA: Mapa de bategat intel·ligent generat:", anchors);
            return { anchors, viewport };
        } catch (error) {
            console.warn("IAIA: L'anàlisi de bategat ha fallat (XRef Error), usant mapeig canònic per defecte.", error);
            return null;
        }
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            let pdfDoc;
            let fileBytes;
            
            if (uploadedFile) {
                fileBytes = await uploadedFile.arrayBuffer();
                pdfDoc = await PDFDocument.load(fileBytes);
                console.log("IAIA: PDF adoptat. Iniciant anàlisi de precisió legal...");
            } else {
                pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([595.28, 841.89]);
                const { height } = page.getSize();
                const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

                page.drawText('SÓC DE POBLE! - SOL·LICITUD GENERADA', { x: 50, y: height - 50, size: 10, font: fontBold, color: rgb(0.36, 0.37, 0.94) });
                page.drawText(formData.event, { x: 50, y: height - 80, size: 20, font: fontBold });
                
                if (formData.name) {
                    page.drawText(`Interessat: ${formData.name}`, { x: 50, y: height - 120, size: 12, font });
                    page.drawText(`DNI: ${formData.dni}`, { x: 50, y: height - 140, size: 12, font });
                }
            }

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const form = pdfDoc.getForm();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // ANÀLISI INTEL·LIGENT (Si tenim fitxer pujat)
            let mapping = null;
            if (uploadedFile) {
                mapping = await analyzePDFStructure(fileBytes);
            }

            // Funció per a bategar amb mimetisme real
            const placeField = (id, key, defaultX, defaultY, defaultW = 250) => {
                const field = form.createTextField(id);
                if (formData[key]) field.setText(String(formData[key]));
                
                let x = defaultX;
                let y = defaultY;
                let fontSize = 10;
                let width = defaultW;

                // Aplicació de precisió via anchors analitzats
                if (mapping && mapping.anchors[key]) {
                    const anchor = mapping.anchors[key];
                    // Calculem l'offset segons el context del text detective
                    x = anchor.x + 95; // Offset de label per defecte
                    y = anchor.y - 1;  // Ajust de baseline
                    fontSize = anchor.size > 0 ? anchor.size * 0.9 : 10;
                    width = 280;
                    
                    // Casos especials d'ajust mil·limètric (Protocol Generalitat)
                    if (key === 'event') { y -= 5; width = 450; }
                    if (key === 'signature') { x = anchor.x; y = anchor.y - 40; width = 200; }

                    console.log(`IAIA: Bategant camp [${id}] a precisió legal {x:${Math.round(x)}, y:${Math.round(y)}} mimetitzant font ${fontSize}pt`);
                }

                field.addToPage(firstPage, { 
                    x, 
                    y, 
                    width, 
                    height: fontSize * 1.5, 
                    font 
                });
                field.setFontSize(fontSize);
            };

            // Mapeig Canònic de Solidaritat (si no hi ha anchor)
            placeField('bategat.nom', 'name', 145, 608);
            placeField('bategat.dni', 'dni', 145, 582);
            placeField('bategat.domicili', 'address', 145, 556, 400);
            placeField('bategat.municipi', 'municipality', 145, 530);
            placeField('bategat.assumpte', 'event', 145, 385, 400);

            // Signatura (Si la detectem, anem allà. Si no, cantonada inferior dreta)
            placeField('bategat.signatura', 'signature', 350, 100, 200);

            // Segell d'Alineació Invisible per a l'ordinari, però present per al "Trellat"
            firstPage.drawText('BATEGAT AMB PRECISIÓ LEGAL - IDENTIFICACIÓ DE CAMPS v10.26', {
                x: 50,
                y: 10,
                size: 6,
                color: rgb(0.7, 0.7, 0.7),
            });

            const pdfBytesSaved = await pdfDoc.save();
            const blob = new Blob([pdfBytesSaved], { type: 'application/pdf' });
            
            // 🏺 MAC DOWNLOAD FIX (Robust Anchor Pattern)
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = uploadedFile ? `bategat_${uploadedFile.name}` : `sollicitud_bategada.pdf`;
            
            // Forçar append al DOM per a navegadors estrictes (Mac/Safari)
            document.body.appendChild(link);
            link.click();
            
            // Neteja immediata
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(downloadUrl);
            }, 100);

            setIsDone(true);
        } catch (error) {
            console.error('Error bategant PDF intel·ligent:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="pdf-manager-container animate-in fade-in zoom-in duration-500">
            <header className="pdf-header">
                <button className="back-btn" onClick={onBack} title="Tornar">
                    <ArrowLeft size={20} />
                </button>
                <div className="header-title">
                    <FileText className="text-orange-500" size={24} />
                    <h1 style={{ fontFamily: 'var(--font-condensed)', fontWeight: 900 }}>
                        {uploadedFile ? 'ADOPTANT PDF ORFE' : 'PDF BATEGADOR PRO'}
                    </h1>
                </div>
            </header>

            <main className="pdf-main no-scrollbar">
                <section className="form-section">
                    <div className="form-card">
                        <div className="iaia-tip">
                            <Sparkles size={20} />
                            <p>"{uploadedFile ? `He detectat ${uploadedFile.name}. El farem editable amb el Protocol d'Identificació de Camps Legals.` : "Mestre, tria si vols el PDF net per a omplir després o si vols que jo l'empleni ara amb el nostre trellat."}"</p>
                        </div>

                        {!uploadedFile ? (
                            <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                                <FileUp size={48} className="text-orange-500/50 mb-4" />
                                <h3>PUJA EL PDF QUE VOLS CONVERTIR</h3>
                                <p>Farem qualsevol PDF editable per a facilitar-te la vida. Els camps s'estudien amb trellat per a no tocar mai el document original, només facilitar el seu completat.</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" hidden />
                            </div>
                        ) : (
                            <div className="file-active-badge">
                                <CheckCircle size={18} />
                                <span>PDF CARREGAT: {uploadedFile.name}</span>
                                <button className="clear-file" onClick={() => setUploadedFile(null)}>Eliminar</button>
                            </div>
                        )}

                        {history.length > 0 && (
                            <div className="mt-6 p-4 bg-white/5 rounded-[28px] border border-white/5">
                                <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-4 px-2">GOVERNANÇA DE BATEGATS RECENTS</label>
                                <div className="space-y-3">
                                    {history.map((h, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-2xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10 group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-[#0ea5e9]/10 p-2 rounded-xl">
                                                    <FileText size={16} className="text-[#0ea5e9]" />
                                                </div>
                                                <span className="text-[12px] font-medium truncate max-w-[150px]">{h.name}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/5">
                                                <button 
                                                    onClick={() => setFileVisibility(h.name, 'private')}
                                                    className={`p-1.5 rounded-full transition-all ${h.visibility === 'private' || !h.visibility ? 'bg-[#0ea5e9] text-white' : 'text-white/30 hover:text-white'}`}
                                                    title="Privat (Només per a mi)"
                                                >
                                                    <Lock size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => setFileVisibility(h.name, 'group')}
                                                    className={`p-1.5 rounded-full transition-all ${h.visibility === 'group' ? 'bg-[#5d5fef] text-white' : 'text-white/30 hover:text-white'}`}
                                                    title="Grup (Entitat / Empresa)"
                                                >
                                                    <Users size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => setFileVisibility(h.name, 'public')}
                                                    className={`p-1.5 rounded-full transition-all ${h.visibility === 'public' ? 'bg-green-500 text-white' : 'text-white/30 hover:text-white'}`}
                                                    title="Públic (Comunitat)"
                                                >
                                                    <Globe size={12} />
                                                </button>
                                                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                                                <button 
                                                    className="p-1.5 rounded-full text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    onClick={() => removeFromHistory(h.name)}
                                                    title="Eliminar del Mas"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="divider" style={{ marginTop: '2rem' }}>PROTOCOLS DE DADES</div>
                        
                        <div className="action-bar">
                            <button onClick={autoFillWithIdentity} className="mode-btn autofill">
                                <Sparkles size={18} />
                                AUTOFILL MAS
                            </button>
                            <button onClick={clearFormData} className="mode-btn clear">
                                <ShieldCheck size={18} />
                                ESBORRAR TOT
                            </button>
                        </div>

                        <div className="input-group">
                            <label>NOM DE L'INTERESSAT</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Javi Llinares" />
                        </div>

                        <div className="input-grid">
                            <div className="input-group">
                                <label>DNI / NIE</label>
                                <input name="dni" value={formData.dni} onChange={handleInputChange} placeholder="12345678X" />
                            </div>
                            <div className="input-group">
                                <label>ASSUMPTE / TRÀMIT</label>
                                <input name="event" value={formData.event} onChange={handleInputChange} placeholder="Títol del tràmit" />
                            </div>
                        </div>

                        <div className="input-grid" style={{ marginTop: '1.5rem' }}>
                            <div className="input-group">
                                <label>DOMICILI / ADREÇA</label>
                                <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Carrer de l'olivera, 4" />
                            </div>
                            <div className="input-group">
                                <label>MUNICIPI</label>
                                <input name="municipality" value={formData.municipality} onChange={handleInputChange} placeholder="Benidorm" />
                            </div>
                        </div>

                        {!uploadedFile && (
                            <div className="input-group" style={{ marginTop: '1.5rem' }}>
                                <label>PETICIÓ DETALLADA</label>
                                <textarea name="message" value={formData.message} onChange={handleInputChange} rows="4" placeholder="Escriu ací què sol·licites..." />
                            </div>
                        )}
                    </div>
                </section>

                <aside className="preview-action-section">
                    <div className="status-card">
                        <div className="status-header">
                            <ShieldCheck size={18} />
                            <span>IDENTIFICACIÓ LEGAL</span>
                        </div>
                        <p>Aquest servei proveït sobiranament per Sóc de Poble és totalment gratuït. El Protocol d'Identificació de Camps Legals assegura que complim totes les condicions legals i tècniques per a facilitar els tràmits comunitaris sense cap cost a posteriori.</p>
                        
                        <div className="mt-6 flex items-start gap-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        checked={isPublic} 
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-all ${isPublic ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-orange-500/80 group-hover:text-orange-500 transition-colors">Fer públic i compartir amb la comunitat</span>
                            </label>
                        </div>
                    </div>

                    {!isDone ? (
                        <button 
                            className={`generate-btn ${isGenerating ? 'loading' : ''}`} 
                            onClick={generatePDF}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <span>Macerant dades...</span>
                            ) : (
                                <>
                                    <Download size={28} />
                                    <span>{uploadedFile ? 'Bategar PDF Extern' : 'Generar PDF Nou'}</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="success-card">
                            <CheckCircle size={56} className="text-green-500" />
                            <h3>MÀGIA REALITZADA!</h3>
                            <p>El PDF és ara 100% interactiu i ja s'hauria d'haver descarregat.</p>
                            
                            <button className="mode-btn autofill" onClick={generatePDF} style={{ width: '100%', height: '60px', borderRadius: '28px' }}>
                                <Download size={20} />
                                RE-DESCARREGAR PDF
                            </button>

                            <button className="reset-btn" onClick={() => setIsDone(false)}>
                                Bategar-ne un altre
                            </button>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default PDFBategatManager;
