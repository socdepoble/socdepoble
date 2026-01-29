import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, Send, Sparkles, Shield, Trash2 } from 'lucide-react';
import './MasterConsole.css';

const MasterConsole = ({ isOpen, onClose }) => {
    const { profile, user } = useAuth();
    const { t } = useTranslation();
    const [target, setTarget] = useState('iaia');
    const [content, setContent] = useState('');
    const [isTrastombat, setIsTrastombat] = useState(false);

    if (!isOpen) return null;

    const handleSend = () => {
        // Lògica d'enviament MASTER
        console.log('[MASTER] Enviant a:', target, 'Contingut:', content, 'Trastombat:', isTrastombat);
        onClose();
    };

    return (
        <div className="master-console-overlay">
            <div className="master-console-window">
                <div className="master-header">
                    <div className="master-title">
                        <Shield size={18} color="#00f2ff" />
                        <span>CONTROLADOR DE POBLE v1.5.4</span>
                    </div>
                    <X className="clickable" onClick={onClose} />
                </div>

                <div className="master-body">
                    <div className="master-field">
                        <label>Destinatari MASTER</label>
                        <select value={target} onChange={(e) => setTarget(e.target.value)}>
                            <option value="iaia">IAIA CORE (Intel·ligència Artificial i Acció)</option>
                            <option value="vecinos">Veïns del Poble (Mur Global)</option>
                            <option value="testers">Equip de Beta Testers</option>
                        </select>
                    </div>

                    <div className="master-field">
                        <label>Redacció de Missatge (Refinat LanguageTool)</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escriu ací les teues directives o missatge..."
                        />
                    </div>

                    <div className="master-options">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={isTrastombat}
                                onChange={(e) => setIsTrastombat(e.target.checked)}
                            />
                            <span>Trastomba a l'Arxiu [MASTER]</span>
                        </label>
                    </div>
                </div>

                <div className="master-footer">
                    <button className="btn-master-refine">
                        <Sparkles size={16} />
                        <span>Refinar Estil</span>
                    </button>
                    <button className="btn-master-send" onClick={handleSend}>
                        <Send size={16} />
                        <span>Executar Ordre</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MasterConsole;
