import React, { useState, useEffect } from 'react';
import { StickyNote, X, Save, Trash2, Copy, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useUI } from '../context/UIContext';
import './NotePad.css';

const NotePad = () => {
    const { isNotePadOpen: isOpen, setIsNotePadOpen: setIsOpen } = useUI();
    const [note, setNote] = useState(localStorage.getItem('sdp_master_note') || '');
    const [copied, setCopied] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        localStorage.setItem('sdp_master_note', note);
    }, [note]);

    const handleCopy = () => {
        navigator.clipboard.writeText(note);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (window.confirm('Vols esborrar tota la llibreta?')) {
            setNote('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`notepad-container ${isMinimized ? 'minimized' : ''}`}>
            <div className="notepad-header">
                <div className="flex items-center gap-2">
                    <StickyNote size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Llibreta Master</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="btn-icon-mini">
                        {isMinimized ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="btn-icon-mini">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <textarea
                        className="notepad-textarea"
                        placeholder="Escriu, enganxa o bategua les teues idees ací... (Auto-guardat)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="notepad-footer">
                        <button className="notepad-action-btn" onClick={handleCopy}>
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            <span>{copied ? 'COPIAT' : 'COPIAR'}</span>
                        </button>
                        <button className="notepad-action-btn delete" onClick={handleClear}>
                            <Trash2 size={14} />
                            <span>NETEJAR</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotePad;
