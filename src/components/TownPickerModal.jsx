import React, { useState, useEffect } from 'react';
import { X, Search, Check, MapPin, Map, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import './TownPickerModal.css';

const TownPickerModal = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    selectedPrimary = null, 
    selectedSecondary = []
}) => {
    const [towns, setTowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selection, setSelection] = useState({ 
        primary: selectedPrimary, 
        secondary: selectedSecondary || [] 
    });

    useEffect(() => {
        if (isOpen) {
            fetchTowns();
            // Evitem actualitzacions innecessàries si els valors no han canviat realment
            setSelection(prev => {
                const hasPrimaryChanged = prev.primary?.uuid !== selectedPrimary?.uuid;
                const hasSecondaryChanged = JSON.stringify(prev.secondary) !== JSON.stringify(selectedSecondary || []);
                
                if (hasPrimaryChanged || hasSecondaryChanged) {
                    return { 
                        primary: selectedPrimary, 
                        secondary: selectedSecondary || [] 
                    };
                }
                return prev;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // Només reaccionem a l'obertura per a resetejar, o tractem els canvis de props amb cura

    const fetchTowns = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getTowns();
            setTowns(data || []);
        } catch (error) {
            console.error('Error fetching towns:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTowns = towns.filter(town => 
        town.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePrimary = (town) => {
        const isSelected = selection.primary?.uuid === town.uuid || selection.primary?.id === town.id;
        if (isSelected) {
            setSelection(prev => ({ ...prev, primary: null }));
        } else {
            setSelection(prev => ({ ...prev, primary: town }));
            // Remove from secondary if it was there
            setSelection(prev => ({
                ...prev,
                secondary: prev.secondary.filter(t => t.uuid !== town.uuid && t.id !== town.id)
            }));
        }
    };

    const toggleSecondary = (town) => {
        const isSelected = selection.secondary.some(t => t.uuid === town.uuid || t.id === town.id);
        const isPrimary = selection.primary?.uuid === town.uuid || selection.primary?.id === town.id;
        
        if (isPrimary) return; // Can't be secondary if it's primary

        if (isSelected) {
            setSelection(prev => ({
                ...prev,
                secondary: prev.secondary.filter(t => t.uuid !== town.uuid && t.id !== town.id)
            }));
        } else {
            setSelection(prev => ({
                ...prev,
                secondary: [...prev.secondary, town]
            }));
        }
    };

    const handleSave = () => {
        onSelect(selection);
    };

    if (!isOpen) return null;

    return (
        <div className="town-picker-overlay" onClick={onClose}>
            <div className="town-picker-modal animate-spectacular-in" onClick={e => e.stopPropagation()}>
                <header className="town-picker-header">
                    <div className="town-picker-header-top">
                        <div className="header-title">
                            <MapPin className="icon-batec" size={24} />
                            <h2>Tria el teu poble</h2>
                        </div>
                        <button className="btn-close-spectacular" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <p className="header-desc">
                        Connecta amb el teu origen i el teu solatge territorial.
                    </p>
                    <div className="town-search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cerca el teu poble..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </header>

                <div className="town-picker-body custom-scrollbar">
                    {loading ? (
                        <div className="picker-loading">
                            <Loader2 className="animate-spin" />
                            <span>Batejant la llista de pobles...</span>
                        </div>
                    ) : (
                        <div className="towns-list-v10">
                            {filteredTowns.map(town => {
                                const isPrimary = selection.primary?.uuid === town.uuid || selection.primary?.id === town.id;
                                const isSecondary = selection.secondary.some(t => t.uuid === town.uuid || t.id === town.id);
                                
                                return (
                                    <div 
                                        key={town.uuid || town.id} 
                                        className={`town-item-spectacular ${isPrimary ? 'is-primary' : ''} ${isSecondary ? 'is-secondary' : ''}`}
                                    >
                                        <div className="town-info" onClick={() => togglePrimary(town)}>
                                            <div className="town-avatar">
                                                {town.logo_url ? <img src={town.logo_url} alt="" /> : <Map size={20} />}
                                            </div>
                                            <div className="town-details">
                                                <span className="town-name">{town.name}</span>
                                                <span className="town-role">
                                                    {isPrimary ? 'EL TEU POBLE' : 'POBLE VEÍ'}
                                                </span>
                                            </div>
                                            <div className="town-check">
                                                {isPrimary && <Check size={20} />}
                                            </div>
                                        </div>
                                        
                                        {!isPrimary && (
                                            <button 
                                                className={`btn-secondary-toggle ${isSecondary ? 'active' : ''}`}
                                                onClick={() => toggleSecondary(town)}
                                                title="Afegir com a poble de solatge"
                                            >
                                                {isSecondary ? 'TREURE' : '+ SOLATGE'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="town-picker-footer">
                    <div className="footer-summary">
                        {selection.primary ? (
                            <span className="summary-primary">
                                <strong>Poble:</strong> {selection.primary.name}
                            </span>
                        ) : (
                            <span className="summary-none">Manca el poble principal</span>
                        )}
                        {selection.secondary.length > 0 && (
                            <span className="summary-secondary">
                                + {selection.secondary.length} pobles de solatge
                            </span>
                        )}
                    </div>
                    <button className="btn-save-spectacular" onClick={handleSave} disabled={!selection.primary}>
                        CONFIRMAR IDENTITAT
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TownPickerModal;
