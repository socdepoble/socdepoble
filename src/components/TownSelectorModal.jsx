import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight, Check, MapPin } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { logger } from '../utils/logger';
import StatusLoader from './StatusLoader';
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
                    logger.error('Error in global search:', error);
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
            logger.error('Error loading provinces:', error);
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
            logger.error('Error loading comarcas:', error);
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
            logger.error('Error loading towns:', error);
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
        <div className="fixed inset-0 z-[99999] bg-theme-base md:absolute md:inset-0 md:bg-theme-panel md:backdrop-blur-3xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 font-sans text-theme-text overflow-hidden">
            
            <header className="px-6 pt-12 pb-4 md:pt-8 flex flex-col gap-4 border-b border-[var(--border-master)] shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none drop-shadow-md">
                            {t('towns.select_town', 'SELECCIONAR POBLE')}
                        </h3>
                        <div className="flex items-center gap-2 mt-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                            <button className={`hover:text-theme-text transition-colors ${step >= 1 ? 'text-[var(--theme-accent-primary)]' : ''}`} onClick={() => { setStep(1); setSearchTerm(''); }}>
                                {selectedProvince || 'PROVÍNCIA'}
                            </button>
                            {selectedProvince && <ChevronRight size={14} className="opacity-50" />}
                            {selectedProvince && (
                                <button className={`hover:text-theme-text transition-colors ${step >= 2 ? 'text-[var(--theme-accent-primary)]' : ''}`} onClick={() => { setStep(2); setSearchTerm(''); }}>
                                    {selectedComarca || 'COMARCA'}
                                </button>
                            )}
                            {selectedComarca && <ChevronRight size={14} className="opacity-50" />}
                            {selectedComarca && (
                                <span className="text-gray-500">
                                    {selectedTown?.name || 'POBLE'}
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--hover-overlay)] hover:bg-[var(--border-master)] transition-colors active:scale-90" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="relative mt-2">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Cerca poble, comarca o província..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-black/5 dark:bg-white/5 border border-[var(--border-master)] focus:border-[var(--theme-accent-primary)] rounded-[20px] pl-12 pr-12 text-lg font-bold outline-none transition-all placeholder:text-gray-500 placeholder:font-normal"
                    />
                    {searchTerm && (
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-theme-text" onClick={() => setSearchTerm('')}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                        <div className="w-8 h-8 rounded-full border-4 border-t-[var(--theme-accent-primary)] border-gray-700 animate-spin"></div>
                        <span className="font-bold tracking-widest uppercase text-sm">Cercant...</span>
                    </div>
                ) : displayList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 text-center px-8">
                        <MapPin size={48} className="opacity-20 mb-2" />
                        <p className="font-medium text-lg">No s'han trobat resultats.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-[var(--theme-accent-primary)] font-bold uppercase tracking-widest text-sm hover:underline">
                            Netejar Cerca
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {displayList.map((item, idx) => {
                            const isTown = typeof item === 'object';
                            const label = isTown ? item.name : item;
                            const isSelected = isTown ? (selectedTown?.uuid === item.uuid || selectedTown?.id === item.id) :
                                (step === 1 && selectedProvince === item) ||
                                (step === 2 && selectedComarca === item);

                            return (
                                <button
                                    key={isTown ? (item.uuid || item.id) : idx}
                                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[20px] transition-all
                                        ${isSelected ? 'bg-[var(--theme-accent-primary-faint)] border border-[var(--theme-accent-primary)]' : 'bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5'}
                                    `}
                                    onClick={() => {
                                        if (isSearching && isTown) handleSearchResultSelect(item);
                                        else if (step === 1) handleProvinceSelect(item);
                                        else if (step === 2) handleComarcaSelect(item);
                                        else {
                                            setSelectedTown(item);
                                            // Auto-save when picking the final town to speed up flow
                                            setTimeout(() => {
                                                onSelect(item);
                                                onClose();
                                            }, 400);
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-start gap-1 text-left">
                                        <span className={`text-lg font-bold ${isSelected ? 'text-[var(--theme-accent-primary)]' : 'text-theme-text'}`}>
                                            {label}
                                        </span>
                                        {isTown && (
                                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                                {item.comarca} · {item.province}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        {isSelected ? <Check size={24} className="text-[var(--theme-accent-primary)]" strokeWidth={3} /> : <ChevronRight size={20} className="text-gray-400 opacity-50" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <footer className="p-6 border-t border-[var(--border-master)] bg-theme-panel shrink-0 pb-safe">
                <button
                    className={`w-full h-16 rounded-[24px] flex items-center justify-center text-white font-black uppercase tracking-widest text-lg transition-all
                        ${selectedTown ? 'bg-[var(--theme-accent-primary)] hover:opacity-90 shadow-[0_0_20px_rgba(255,107,0,0.4)] active:scale-[0.98]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50'}
                    `}
                    onClick={handleSave}
                    disabled={!selectedTown}
                >
                    {selectedTown ? 'GUARDAR POBLE ✨' : 'GUARDAR POBLE'}
                </button>
            </footer>
        </div>
    );
};

export default TownSelectorModal;
