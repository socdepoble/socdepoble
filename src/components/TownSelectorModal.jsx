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
        }
    }, [isOpen]);

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

    const handleSave = () => {
        if (selectedTown) {
            onSelect(selectedTown);
            onClose();
        }
    };

    if (!isOpen) return null;

    const filteredItems = () => {
        const list = step === 1 ? provinces : step === 2 ? comarcas : towns;
        if (!searchTerm) return list;
        return list.filter(item => {
            const val = step === 3 ? item.name : item;
            return val.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    return (
        <div className="modal-overlay">
            <div className="town-selector-modal">
                <header className="modal-header">
                    <div className="header-title">
                        <h3>{t('towns.select_town') || 'Selecciona el teu poble'}</h3>
                        <div className="breadcrumb">
                            <span className={step >= 1 ? 'active' : ''}>Província</span>
                            <ChevronRight size={14} />
                            <span className={step >= 2 ? 'active' : ''}>Comarca</span>
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
                        placeholder={t('common.search') || 'Cerca...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="modal-content-scroll">
                    {loading ? (
                        <div className="modal-loading">Carregant dades...</div>
                    ) : (
                        <div className="selection-list">
                            {filteredItems().map((item, idx) => {
                                const isTown = step === 3;
                                const label = isTown ? item.name : item;
                                const isSelected = isTown ? selectedTown?.id === item.id : false;

                                return (
                                    <button
                                        key={isTown ? item.id : idx}
                                        className={`list-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (step === 1) handleProvinceSelect(item);
                                            else if (step === 2) handleComarcaSelect(item);
                                            else setSelectedTown(item);
                                        }}
                                    >
                                        <span>{label}</span>
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
                        {t('common.save') || 'GUARDAR POBLE'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TownSelectorModal;
