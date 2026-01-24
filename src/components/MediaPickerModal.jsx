import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import './MediaPickerModal.css';

const MediaPickerModal = ({ isOpen, onClose, onSelect }) => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isOpen && user) {
            loadAssets();
        }
    }, [isOpen, user]);

    const loadAssets = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getUserMediaAssets(user.id);
            setAssets(data);
        } catch (error) {
            logger.error('Error loading assets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredAssets = assets.filter(asset =>
        asset.url?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="picker-overlay">
            <div className="picker-content">
                <header className="picker-header">
                    <div className="header-left">
                        <ImageIcon size={20} className="header-icon" />
                        <h3>El meu álbum</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="picker-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar fotos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="picker-body">
                    {loading ? (
                        <div className="picker-status">
                            <Loader2 className="animate-spin" size={32} />
                            <p>Carregant fotos...</p>
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="picker-status">
                            <ImageIcon size={48} opacity={0.2} />
                            <p>No hem trobat cap foto</p>
                        </div>
                    ) : (
                        <div className="picker-grid">
                            {filteredAssets.map(asset => (
                                <div
                                    key={asset.id}
                                    className="picker-item"
                                    onClick={() => onSelect(asset)}
                                >
                                    <img src={asset.url} alt="Media" loading="lazy" />
                                    <div className="item-overlay">
                                        <span>Seleccionar</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className="picker-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancelar</button>
                </footer>
            </div>
        </div>
    );
};

export default MediaPickerModal;
