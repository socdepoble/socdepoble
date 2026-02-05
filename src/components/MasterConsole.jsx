import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, Send, Sparkles, Shield, Trash2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { logger } from '../utils/logger';
import './MasterConsole.css';

const MasterConsole = ({ isOpen, onClose }) => {
    const { profile, user } = useAuth();
    const { t } = useTranslation();
    const { vibe, setVibe, asoMode, toggleAsoMode } = useUI();
    const [target, setTarget] = useState('iaia_brain');
    const [mode, setMode] = useState('refine'); // refine, audit, purify, chronicle
    const [content, setContent] = useState('');
    const [isTrastombat, setIsTrastombat] = useState(false);
    const [visibility, setVisibility] = useState('team'); // team, entities, public

    if (!isOpen) return null;

    const handleSend = () => {
        // Lògica d'enviament MASTER
        logger.log('[MASTER] Mode:', mode, 'Target:', target, 'Contingut:', content, 'Trastombat:', isTrastombat, 'Visibility:', visibility);

        // Simulació de processament
        const event = new CustomEvent('iaia-master-action', {
            detail: { mode, target, content, isTrastombat, visibility, timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);

        onClose();
    };

    return (
        <div className="master-console-overlay">
            <div className="master-console-window">
                <div className="master-header">
                    <div className="master-title">
                        <Shield size={18} color="#00f2ff" />
                        <span>IAIA MASTER CONSOLE v1.5.6 [BATEGA]</span>
                    </div>
                    <X className="clickable" onClick={onClose} />
                </div>

                <div className="master-body">
                    <div className="master-grid">
                        <div className="master-field">
                            <label>Objectiu de l'Acció</label>
                            <select value={target} onChange={(e) => setTarget(e.target.value)}>
                                <option value="iaia_brain">NUCLI IAIA (Cervell/Lògica)</option>
                                <option value="rhizome_db">DB RHIZOME (Supabase/Seguretat)</option>
                                <option value="village_ui">VILLAGE UI (Estètica/Interfície)</option>
                                <option value="master_docs">DOCS MASTER (Directives/Llibre)</option>
                            </select>
                        </div>

                        <div className="master-field">
                            <label>Mode de Processament</label>
                            <select value={mode} onChange={(e) => setMode(e.target.value)}>
                                <option value="refine">REFINAR (Estil/Llenguatge)</option>
                                <option value="audit">AUDITAR (Seguretat/Errors)</option>
                                <option value="purify">PURIFICAR (Nuke/Reset)</option>
                                <option value="chronicle">CRÒNICA (Registrar Sessió)</option>
                            </select>
                        </div>
                    </div>

                    <div className="master-field">
                        <label>Contingut de la Directiva</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Introdueix el codi, text o ordre MASTER..."
                            rows={8}
                        />
                    </div>

                    <div className="master-bottom-controls">
                        <div className="master-field">
                            <label>Visió Simbiòtica (Vibe)</label>
                            <select
                                value={vibe}
                                onChange={(e) => setVibe(e.target.value)}
                            >
                                <option value="genius">GENIUS (Cyber-Rural)</option>
                                <option value="artesa">ARTESÀ (Minimal Earth)</option>
                                <option value="natura">NATURA (Tech-Nature)</option>
                            </select>
                        </div>

                        <div className="console-field">
                            <label>Visibilitat de l'Esdeveniment</label>
                            <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                                <option value="team">NOMÉS EQUIP (Privat)</option>
                                <option value="entities">EQUIP + ENTITATS</option>
                                <option value="public">PÚBLIC (Mur/Poble)</option>
                            </select>
                        </div>

                        <label className="master-checkbox">
                            <input
                                type="checkbox"
                                checked={isTrastombat}
                                onChange={(e) => setIsTrastombat(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            <span>Trastomba a l'Arxiu [MASTER]</span>
                        </label>

                        <label className="master-checkbox">
                            <input
                                type="checkbox"
                                checked={asoMode}
                                onChange={() => toggleAsoMode()}
                            />
                            <span className="checkmark"></span>
                            <span style={{ color: '#FF6D23' }}>ACTIVA MODE ESTUDI ASO 👔</span>
                        </label>
                    </div>
                </div>

                <div className="master-footer">
                    <button className="btn-master-secondary" onClick={onClose}>
                        <Trash2 size={16} />
                        <span>NUL·LAR</span>
                    </button>
                    <button className="btn-master-primary" onClick={handleSend}>
                        <Sparkles size={16} />
                        <span>EXECUTAR PROTOCOL</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MasterConsole;
