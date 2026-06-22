import { useState, useEffect, useRef } from 'react';
import { supabaseService } from '../../core/services/supabaseService';
import { useTranslation } from 'react-i18next';
import { logger } from '../../utils/logger';
import { ChevronRight, X, Search, MapPin, Check } from 'lucide-react';
import './TownSelectorModal.css';

const TownSelectorModal = ({ isOpen, onClose, onSelect }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [provinces, setProvinces] = useState([]);
  const [comarcas, setComarcas] = useState([]);
  const [towns, setTowns] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedComarca, setSelectedComarca] = useState('');
  const [selectedTown, setSelectedTown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pioneerTown, setPioneerTown] = useState('');
  const [pioneerProvince, setPioneerProvince] = useState('');
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

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
    }, 200);

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

  const handleProvinceSelect = async prov => {
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

  const handleComarcaSelect = async com => {
    setSelectedComarca(com);
    setLoading(true);
    setSearchTerm('');
    try {
      const data = await supabaseService.getTowns({
        province: selectedProvince,
        comarca: com
      });
      setTowns(data);
      setStep(3);
    } catch (error) {
      logger.error('Error loading towns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResultSelect = town => {
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

  const handleCreatePioneer = async () => {
    if (!pioneerTown || !pioneerProvince) return;
    setLoading(true);
    try {
      const newTown = await supabaseService.createPioneerTown({
        name: pioneerTown,
        province: pioneerProvince,
        comarca: 'Poble Pioner'
      });
      setSelectedTown(newTown);
      setTimeout(() => {
        onSelect(newTown);
        onClose();
      }, 600);
    } catch (error) {
      logger.error('Error funding new town:', error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isSearching = searchTerm.trim().length >= 2 && step !== 4;
  const displayList = isSearching ? searchResults : step === 1 ? provinces : step === 2 ? comarcas : towns;

  return (
    <div className="fixed inset-0 z-modal bg-white md:absolute md:inset-0 md:bg-white md:backdrop-blur-3xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 font-sans text-gray-900 overflow-hidden">
        <div role="region" aria-label="Capçalera de Secció" className='px-6 pt-12 pb-4 md:pt-8 flex flex-col gap-4 border-b border-gray-200 shrink-0 bg-white'>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none drop-shadow-sm text-gray-900 m-0">
                        {t('towns.select_town', 'SELECCIONAR POBLE')}
                    </h3>
                    <div className="flex items-center gap-2 mt-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                        <button className={`hover:text-gray-900 transition-colors ${step >= 1 ? 'text-orange-500' : ''}`} onClick={() => {
                            setStep(1);
                            setSearchTerm('');
                        }}>
                            {selectedProvince || 'PROVÍNCIA'}
                        </button>
                        {selectedProvince && <ChevronRight size={14} className="opacity-50" />}
                        {selectedProvince && <button className={`hover:text-gray-900 transition-colors ${step >= 2 ? 'text-orange-500' : ''}`} onClick={() => {
                            setStep(2);
                            setSearchTerm('');
                        }}>
                            {selectedComarca || 'COMARCA'}
                        </button>}
                        {selectedComarca && <ChevronRight size={14} className="opacity-50" />}
                        {selectedComarca && step !== 4 && <span className="text-gray-500">
                            {selectedTown?.name || 'POBLE'}
                        </span>}
                        {step === 4 && <span className='text-orange-500'>PIONER ✨</span>}
                    </div>
                </div>
                <button className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors active:scale-90 text-gray-500' onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {step !== 4 && (
                <div className="relative mt-2">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input ref={searchInputRef} type="text" placeholder="Cerca poble, comarca o província..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='w-full h-14 bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-[20px] pl-12 pr-12 text-lg font-bold outline-none transition-all placeholder:text-gray-400 placeholder:font-normal text-gray-900' />
                    
                    {searchTerm && (
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900" onClick={() => setSearchTerm('')}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-white">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                    <div className='w-8 h-8 rounded-full border-4 border-t-orange-500 border-gray-200 animate-spin'></div>
                    <span className="font-bold tracking-widest uppercase text-sm m-0">Cercant...</span>
                </div>
            ) : step === 4 ? (
                <div className="flex flex-col h-full items-center p-6 gap-6 text-center animate-in fade-in duration-500">
                    <div className='w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2'>
                        <MapPin size={32} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black uppercase italic drop-shadow-sm mb-2 text-gray-900 m-0">{pioneerTown}</h4>
                        <p className="text-gray-500 text-sm m-0 mt-2">Seràs la primera persona en fundar aquest poble a la xarxa Sóc de Poble.</p>
                    </div>
                    
                    <div className="w-full max-w-sm flex flex-col gap-4 mt-4">
                        <input type="text" placeholder="Escriu la teua Província (Ex: Cáceres, Madrid, Balears)" value={pioneerProvince} onChange={e => setPioneerProvince(e.target.value)} className='w-full h-14 bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-[16px] px-4 text-center font-bold outline-none transition-all placeholder:text-gray-400 placeholder:font-normal text-gray-900' />
                        
                        <button onClick={handleCreatePioneer} disabled={!pioneerProvince.trim()} className={`h-14 rounded-[16px] font-black uppercase tracking-widest transition-all ${pioneerProvince.trim() ? 'bg-orange-500 text-white hover:scale-[1.02]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            Reclamar el Poble ✨
                        </button>
                        <button onClick={() => { setStep(1); setSearchTerm(''); }} className="mt-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                            Cancel·lar
                        </button>
                    </div>
                </div>
            ) : displayList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 text-center px-8">
                    <MapPin size={48} className="opacity-20 mb-2" />
                    <p className="font-medium text-lg m-0">No s'han trobat resultats.</p>
                    {isSearching && (
                        <div className='mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-200 text-center w-full max-w-sm transform hover:scale-[1.02] transition-transform'>
                            <p className="text-sm mb-4 font-medium text-gray-900 opacity-90 m-0">Vols ser la primera persona del teu poble a Sóc de Poble?</p>
                            <button onClick={() => { setStep(4); setPioneerTown(searchTerm); setSearchTerm(''); }} className='w-full py-3 bg-orange-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl'>
                                Fundar Poble Nou ✨
                            </button>
                        </div>
                    )}
                    <button onClick={() => setSearchTerm('')} className='mt-4 text-gray-400 hover:text-orange-500 font-bold uppercase tracking-widest text-sm transition-colors'>
                        Netejar Cerca
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {displayList.map((item, idx) => {
                        const isTown = typeof item === 'object';
                        const label = isTown ? item.name : item;
                        const isSelected = isTown ? selectedTown?.uuid === item.uuid || selectedTown?.id === item.id : step === 1 && selectedProvince === item || step === 2 && selectedComarca === item;
                        
                        return (
                            <button key={isTown ? item.uuid || item.id : idx} className={`w-full flex items-center justify-between px-6 py-5 rounded-[20px] transition-all ${isSelected ? 'bg-orange-50 border border-orange-200' : 'bg-transparent border border-transparent hover:bg-gray-50'}`} onClick={() => {
                                if (isSearching && isTown) handleSearchResultSelect(item);
                                else if (step === 1) handleProvinceSelect(item);
                                else if (step === 2) handleComarcaSelect(item);
                                else {
                                    setSelectedTown(item);
                                    setTimeout(() => { onSelect(item); onClose(); }, 400);
                                }
                            }}>
                                <div className="flex flex-col items-start gap-1 text-left">
                                    <span className={`text-lg font-bold m-0 ${isSelected ? 'text-orange-500' : 'text-gray-900'}`}>
                                        {label}
                                    </span>
                                    {isTown && (
                                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500 m-0">
                                            {item.comarca} · {item.province}
                                        </span>
                                    )}
                                </div>
                                {isSelected ? <Check size={24} className='text-orange-500' strokeWidth={3} /> : <ChevronRight size={20} className="text-gray-400 opacity-50" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        <footer className='p-6 border-t border-gray-200 bg-white shrink-0 pb-safe'>
            <button className={`w-full h-16 rounded-[24px] flex items-center justify-center text-white font-black uppercase tracking-widest text-lg transition-all ${selectedTown ? 'bg-orange-500 hover:bg-orange-600 active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} onClick={handleSave} disabled={!selectedTown}>
                {selectedTown ? 'GUARDAR POBLE ✨' : 'GUARDAR POBLE'}
            </button>
        </footer>
    </div>
  );
};
export default TownSelectorModal;