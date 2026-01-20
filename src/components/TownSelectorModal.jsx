import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, Check } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import './TownSelectorModal.css';

const TownSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1: Province, 2: Comarca, 3: Town

    const [provinces, setProvinces] = useState([]);
    const [comarcas, setComarcas] = useState([]);
    const [towns, setTowns] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedComarca, setSelectedComarca] = useState('');
    const [selectedTown, setSelectedTown] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadProvinces();
            setStep(1);
            setSearchTerm('');
            setSearchResults([]);
            setSelectedProvince('');
            setSelectedComarca('');
            setSelectedTown(null);
        }
    }, [isOpen]);

    // Búsqueda global interactiva
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setLoading(true);
                try {
                    const data = await supabaseService.searchAllTowns(searchTerm);
                    setSearchResults(data);
                } catch (error) {
                    console.error('Error in global search:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadProvinces = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getProvinces();
            setProvinces(data);
        } catch (error) {
            console.error('Error loading provinces:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProvinceSelect = async (prov) => {
        setSelectedProvince(prov);
        setLoading(true);
        setSearchTerm('');
        try {
            const data = await supabaseService.getComarcas(prov);
            setComarcas(data);
            setStep(2);
        } catch (error) {
            console.error('Error loading comarcas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComarcaSelect = async (com) => {
        setSelectedComarca(com);
        setLoading(true);
        setSearchTerm('');
        try {
            const data = await supabaseService.getTowns({ province: selectedProvince, comarca: com });
            setTowns(data);
            setStep(3);
        } catch (error) {
            console.error('Error loading towns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchResultSelect = (town) => {
        setSelectedTown(town);
        setSelectedProvince(town.province);
        setSelectedComarca(town.comarca);
        setSearchTerm('');
        setSearchResults([]);
        setStep(3);
    };

    const handleSave = () => {
        if (selectedTown) {
            onSelect(selectedTown);
            onClose();
        }
    };

    if (!isOpen) return null;

    const displayList = searchTerm.length >= 2 ? searchResults : (step === 1 ? provinces : step === 2 ? comarcas : towns);

    return (
        <div className="modal-overlay">
            <div className="town-selector-modal">
                <header className="modal-header">
                    <div className="header-title">
                        <h3>{t('towns.select_town')}</h3>
                        <div className="breadcrumb">
                            <span
                                className={step >= 1 ? 'active' : ''}
                                onClick={() => setStep(1)}
                                style={{ cursor: 'pointer' }}
                            >
                                Província
                            </span>
                            <ChevronRight size={14} />
                            <span
                                className={step >= 2 ? 'active' : ''}
                                onClick={() => selectedProvince && setStep(2)}
                                style={{ cursor: selectedProvince ? 'pointer' : 'default' }}
                            >
                                Comarca
                            </span>
                            <ChevronRight size={14} />
                            <span className={step >= 3 ? 'active' : ''}>Poble</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="search-bar-modal">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="modal-content-scroll">
                    {loading ? (
                        <div className="modal-loading">{t('common.loading')}</div>
                    ) : displayList.length === 0 ? (
                        <div className="modal-no-results">No hi ha resultats.</div>
                    ) : (
                        <div className="selection-list">
                            {displayList.map((item, idx) => {
                                const isTown = typeof item === 'object';
                                const label = isTown ? item.name : item;
                                const isSelected = isTown ? selectedTown?.id === item.id :
                                    (step === 1 && selectedProvince === item) ||
                                    (step === 2 && selectedComarca === item);

                                return (
                                    <button
                                        key={isTown ? item.id : idx}
                                        className={`list-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (searchTerm.length >= 2 && isTown) handleSearchResultSelect(item);
                                            else if (step === 1) handleProvinceSelect(item);
                                            else if (step === 2) handleComarcaSelect(item);
                                            else setSelectedTown(item);
                                        }}
                                    >
                                        <div className="item-info">
                                            <span className="item-label">{label}</span>
                                            {isTown && <span className="item-sublabel">{item.comarca}, {item.province}</span>}
                                        </div>
                                        {isSelected ? <Check size={18} /> : <ChevronRight size={18} opacity={0.5} />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="modal-footer">
                    <div className="selection-summary">
                        {selectedProvince && <span>{selectedProvince}</span>}
                        {selectedComarca && <span> <ChevronRight size={12} /> {selectedComarca}</span>}
                    </div>
                    <button
                        className={`save-btn-large ${!selectedTown ? 'disabled' : ''}`}
                        onClick={handleSave}
                        disabled={!selectedTown}
                    >
                        {t('common.save').toUpperCase()}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TownSelectorModal;
