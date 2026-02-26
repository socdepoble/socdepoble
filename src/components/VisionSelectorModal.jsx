import React from 'react';
import { X, User, Zap, Shield, Info, Sparkles } from 'lucide-react';
import './VisionSelectorModal.css';

const VisionSelectorModal = ({ isOpen, onClose, currentMode, onSelect }) => {
    if (!isOpen) return null;

    const modes = [
        {
            id: 'humana',
            title: 'MODO HUMÀ',
            desc: 'Contingut pur de veïns reals. Sense personatges ni ficció.',
            icon: <User size={32} />,
            color: '#4CAF50'
        },
        {
            id: 'iaia',
            title: 'JOC DE ROL (HÍBRID)',
            desc: 'Personatges, llegendes i lore del poble activat.',
            icon: <Zap size={32} />,
            color: '#00D2FF'
        },
        {
            id: 'immersiva',
            title: 'VISIÓ IMMERSIVA',
            desc: 'Tota la colla: Gall, Nano, Mixa, Flash... Vida total.',
            icon: <Sparkles size={32} />,
            color: 'var(--theme-accent-primary)'
        }
    ];

    return (
        <div className="vision-modal-overlay" onClick={onClose}>
            <div className="vision-modal-content" onClick={e => e.stopPropagation()}>
                <header className="vision-modal-header">
                    <div className="vision-modal-title">
                        <Shield size={20} />
                        <span>PROTOCOL DE VISIÓ</span>
                    </div>
                    <button className="vision-modal-close" onClick={onClose}><X size={24} /></button>
                </header>

                <div className="vision-modal-body">
                    <p className="vision-modal-intro">Tria com vols interactuar amb el batec del poble:</p>
                    
                    <div className="vision-modes-list">
                        {modes.map(m => (
                            <button 
                                key={m.id}
                                className={`vision-mode-item ${currentMode === m.id ? 'active' : ''}`}
                                onClick={() => {
                                    onSelect(m.id);
                                    onClose();
                                }}
                            >
                                <div className="vision-mode-icon" style={{ color: m.color }}>
                                    {m.icon}
                                </div>
                                <div className="vision-mode-text">
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                                {currentMode === m.id && <div className="active-indicator" />}
                            </button>
                        ))}
                    </div>

                    <div className="vision-modal-footer">
                        <Info size={16} />
                        <span>Pots canviar això en qualsevol moment des del perfil de l'IAIA.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionSelectorModal;
