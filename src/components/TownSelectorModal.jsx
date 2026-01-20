import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight, Check, MapPin } from 'lucide-react';
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
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            loadProvinces();
            setStep(1);
            setSearchTerm('');
            setSearchResults([]);
            setSelectedProvince('');
            setSelectedComarca('');
            setSelectedTown(null);

            // Focus search input on open
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Búsqueda global interactiva mejorada
    useEffect(() => {
        const timer = setTimeout(async () => {
            const cleanTerm = searchTerm.trim();
            if (cleanTerm.length >= 2) {
                setLoading(true);
                try {
                    const data = await supabaseService.searchAllTowns(cleanTerm);
                    setSearchResults(data);
                } catch (error) {
                    console.error('Error in global search:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 200); // Faster debounce

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
        setStep(3); // Result selection confirms the town
    };

    const handleSave = () => {
        if (selectedTown) {
            onSelect(selectedTown);
            onClose();
        }
    };

    if (!isOpen) return null;

    const isSearching = searchTerm.trim().length >= 2;
    const displayList = isSearching ? searchResults : (step === 1 ? provinces : step === 2 ? comarcas : towns);

    return (
        <div className="modal-overlay">
            <div className="town-selector-modal">
                <header className="modal-header">
                    <div className="header-title">
                        <h3>{t('towns.select_town')}</h3>
                        <div className="breadcrumb">
                            <span
                                className={step >= 1 ? 'active' : ''}
                                onClick={() => { setStep(1); setSearchTerm(''); }}
                                style={{ cursor: 'pointer' }}
                            >
                                {t('common.province').includes('.') ? 'Província' : t('common.province')}
                            </span>
                            <ChevronRight size={14} />
                            <span
                                className={step >= 2 ? 'active' : ''}
                                onClick={() => { if (selectedProvince) { setStep(2); setSearchTerm(''); } }}
                                style={{ cursor: selectedProvince ? 'pointer' : 'default' }}
                            >
                                {t('common.comarca').includes('.') ? 'Comarca' : t('common.comarca')}
                            </span>
                            <ChevronRight size={14} />
                            <span className={step >= 3 ? 'active' : ''}>{t('common.town').includes('.') ? 'Poble' : t('common.town')}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="search-bar-modal">
                    <Search size={18} className="search-icon" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={t('common.search_placeholder') || 'Cerca poble, comarca o província...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="modal-content-scroll">
                    {loading ? (
                        <div className="modal-loading">
                            <div className="spinner-small"></div>
                            <span>{t('common.loading')}</span>
                        </div>
                    ) : displayList.length === 0 ? (
                        <div className="modal-no-results">
                            <MapPin size={32} opacity={0.2} />
                            <p>{isSearching ? t('towns.no_results_search') || 'No hem trobat cap resultat per a la teua cerca.' : t('towns.no_results_list') || 'No hi ha elements disponibles.'}</p>
                            {isSearching && <button className="clear-link" onClick={() => setSearchTerm('')}>Veure tots els pobles</button>}
                        </div>
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
                                            if (isSearching && isTown) handleSearchResultSelect(item);
                                            else if (step === 1) handleProvinceSelect(item);
                                            else if (step === 2) handleComarcaSelect(item);
                                            else setSelectedTown(item);
                                        }}
                                    >
                                        <div className="item-info">
                                            <span className="item-label">{label}</span>
                                            {isTown && (
                                                <span className="item-sublabel">
                                                    {item.comarca} · {item.province}
                                                </span>
                                            )}
                                        </div>
                                        <div className="item-action">
                                            {isSelected ? <Check size={18} className="text-primary" /> : <ChevronRight size={18} opacity={0.3} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="modal-footer">
                    <div className="selection-summary">
                        {selectedProvince && (
                            <span className="summary-item">
                                {selectedProvince}
                                {selectedComarca && <ChevronRight size={12} />}
                                {selectedComarca && <span>{selectedComarca}</span>}
                            </span>
                        )}
                    </div>
                    <button
                        className={`save-btn-large ${!selectedTown ? 'disabled' : ''}`}
                        onClick={handleSave}
                        disabled={!selectedTown}
                    >
                        {t('common.save_selection') || 'GUARDAR POBLE'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TownSelectorModal;
