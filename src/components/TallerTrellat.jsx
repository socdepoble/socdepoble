import React, { useState, useRef } from 'react';
import { X, Sparkles, Send, Bot, ScrollText, UtensilsCrossed, ChevronRight, Languages, Eye, Camera, Image as ImageIcon, Scale, History, Sprout, Music, Heart, BookOpen } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import hapticService from '../services/hapticService';
import './TallerTrellat.css';

/**
 * [MASTER] TallerTrellat - El Taller de Trellat (v1.11.0-AI-VISION) 🏺👁️✨
 * Interfície per a interactuar amb el Trellat Artificial Multimodal.
 */
const TallerTrellat = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('iaia'); // 'iaia', 'secretari', 'traductor', 'ull_del_mestre', 'remeis', 'oracle', 'diccionari'
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                if (mode !== 'ull_del_mestre') setMode('ull_del_mestre');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!input.trim() && !image && mode !== 'oracle') return;

        setLoading(true);
        hapticService.batec();

        try {
            const personaMap = {
                'iaia': 'IAIA',
                'secretari': 'ARXIVER',
                'traductor': 'ARXIVER',
                'ull_del_mestre': 'IAIA',
                'jutge_de_pau': 'CAPATAS',
                'cronista': 'ARXIVER',
                'hortola': 'AGRONOM',
                'versador': 'ELENA',
                'remeis': 'CARLA',
                'oracle': 'IAIA',
                'diccionari': 'ARXIVER'
            };
            const personaKey = personaMap[mode] || 'IAIA';
            const prompt = mode === 'oracle' ? "Dona'm un consell de vida basat en la saviesa popular valenciana. Una frase curta i amb caràcter d'IAIA." : input;
            
            let imageData = null;
            if (image) {
                const [prefix, data] = image.split(',');
                const mimeType = prefix.match(/:(.*?);/)[1];
                imageData = { mimeType, data };
            }

            const result = await geminiService.ask(personaKey, prompt, imageData);
            setResponse(result.text);
            hapticService.notifySuccess();
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('AI Error:', error);
            }
            setResponse('⚠️ Ai collons, s\'ha tallat la llum al cervell del Mas...');
        } finally {
            setLoading(false);
        }
    };

    const getPlaceholder = () => {
        if (mode === 'secretari') return "Ex: Tall d'aigua demà carrer major...";
        if (mode === 'iaia') return "Ex: Tinc tomates molles i pa dur...";
        if (mode === 'traductor') return "Ex: Hola buenos días, quería pedir un café con leche...";
        if (mode === 'ull_del_mestre') return "Identifica aquest objecte o pregunta sobre ell...";
        if (mode === 'jutge_de_pau') return "Explica el conflicte veïnal per a posar pau...";
        if (mode === 'cronista') return "Apega el xat o acte per a resumir...";
        if (mode === 'hortola') return "Pregunta sobre cultius o el calendari lunar...";
        if (mode === 'versador') return "Digues un tema per al teu vers o alba...";
        if (mode === 'remeis') return "Ex: Tinc tos i mal de pit...";
        if (mode === 'diccionari') return "Ex: Bitcoin, Influencer, Streaming...";
        if (mode === 'oracle') return "Clica el botó per rebre el consell de l'ollà...";
        return "Escriu aquí...";
    };

    if (!isOpen) return null;

    return (
        <div className="taller-overlay" onClick={onClose}>
            <div className="taller-modal" onClick={e => e.stopPropagation()}>
                <header className="taller-header">
                    <div className="taller-title">
                        <Sparkles size={18} className="sparkle-icon" />
                        <span>TALLER DE TRELLAT ARTIFICIAL</span>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </header>

                <div className="taller-selector scroll-x">
                    <button
                        className={`selector-btn ${mode === 'iaia' ? 'active' : ''}`}
                        onClick={() => { setMode('iaia'); setResponse(''); setImage(null); }}
                    >
                        <UtensilsCrossed size={18} />
                        <span>La Iaia</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'secretari' ? 'active' : ''}`}
                        onClick={() => { setMode('secretari'); setResponse(''); setImage(null); }}
                    >
                        <ScrollText size={18} />
                        <span>Secretari</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'traductor' ? 'active' : ''}`}
                        onClick={() => { setMode('traductor'); setResponse(''); setImage(null); }}
                    >
                        <Languages size={18} />
                        <span>Traductor</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'ull_del_mestre' ? 'active' : ''}`}
                        onClick={() => { setMode('ull_del_mestre'); setResponse(''); }}
                    >
                        <Eye size={18} />
                        <span>L'Ull</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'jutge_de_pau' ? 'active' : ''}`}
                        onClick={() => { setMode('jutge_de_pau'); setResponse(''); setImage(null); }}
                    >
                        <Scale size={18} />
                        <span>Jutge</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'cronista' ? 'active' : ''}`}
                        onClick={() => { setMode('cronista'); setResponse(''); setImage(null); }}
                    >
                        <History size={18} />
                        <span>Cronista</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'hortola' ? 'active' : ''}`}
                        onClick={() => { setMode('hortola'); setResponse(''); setImage(null); }}
                    >
                        <Sprout size={18} />
                        <span>Hortolà</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'versador' ? 'active' : ''}`}
                        onClick={() => { setMode('versador'); setResponse(''); setImage(null); }}
                    >
                        <Music size={18} />
                        <span>Versador</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'remeis' ? 'active' : ''}`}
                        onClick={() => { setMode('remeis'); setResponse(''); setImage(null); }}
                    >
                        <Heart size={18} />
                        <span>Remeis</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'oracle' ? 'active' : ''}`}
                        onClick={() => { setMode('oracle'); setResponse(''); setImage(null); }}
                    >
                        <Sparkles size={18} />
                        <span>Oracle</span>
                    </button>
                    <button
                        className={`selector-btn ${mode === 'diccionari' ? 'active' : ''}`}
                        onClick={() => { setMode('diccionari'); setResponse(''); setImage(null); }}
                    >
                        <BookOpen size={18} />
                        <span>Diccionari</span>
                    </button>
                </div>

                <div className="taller-body">
                    {mode === 'ull_del_mestre' && (
                        <div className="vision-upload-zone">
                            {image ? (
                                <div className="image-preview">
                                    <img src={image} alt="Preview" />
                                    <button className="remove-image" onClick={() => setImage(null)}><X size={16} /></button>
                                </div>
                            ) : (
                                <button className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                                    <Camera size={40} />
                                    <span>FES UNA FOTO O PUJA-LA</span>
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    )}

                    <div className="input-zone">
                        <textarea
                            placeholder={getPlaceholder()}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            className={`generate-btn ${loading ? 'loading' : ''}`}
                            onClick={handleGenerate}
                            disabled={loading || (!input.trim() && !image && mode !== 'oracle')}
                        >
                            {loading ? <div className="spinner" /> : <Sparkles size={20} />}
                        </button>
                    </div>

                    {response && (
                        <div className="response-zone animate-in">
                            <div className="response-header">
                                <Bot size={16} />
                                <span>{mode === 'ull_del_mestre' ? "EL MESTRE HI VEU:" : "TRELLAT ARTIFICIAL:"}</span>
                            </div>
                            <div className="response-content">
                                {response}
                            </div>
                            <button className="copy-btn" onClick={() => {
                                navigator.clipboard.writeText(response);
                                hapticService.notifyAIReady();
                            }}>
                                UTILITZAR AQUEST TEXT <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TallerTrellat;
