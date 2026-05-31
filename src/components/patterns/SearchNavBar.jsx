import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { hapticService } from '../../core/services/hapticService';

const SearchNavBar = ({ 
    query, 
    setQuery, 
    placeholder = "BUSCA...", 
    onClear,
    onBack,
    customIcon
}) => {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleClear = () => {
        if (onClear) onClear();
        else if (setQuery) setQuery('');
        
        if (hapticService && hapticService.notifySuccess) {
            hapticService.notifySuccess();
        }
        
        inputRef.current?.focus();
    };

    const handleBack = () => {
        if (hapticService && hapticService.notifySuccess) {
            hapticService.notifySuccess();
        }
        
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="sticky top-0 z-[100] bg-[var(--theme-accent-primary)] w-full h-[env(safe-area-inset-top,0px)+56px] min-h-[56px] flex items-end justify-between px-3 transition-colors duration-500 shadow-md transform-gpu pb-2 pt-[env(safe-area-inset-top,0px)]">
            
            {/* BACK BUTTON */}
            <div className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center">
                <button 
                    onClick={handleBack}
                    aria-label="Torna enrere"
                    className="flex items-center gap-1 hover:text-white active:scale-95 transition-transform p-1 rounded-full hover:bg-white/20"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="flex items-center flex-1 h-[36px] bg-white rounded-[24px] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--theme-accent-primary)] transition-all group">
                <div className="flex items-center justify-center pl-4 pr-2 h-full">
                    {customIcon ? (
                        <div className="text-gray-400 group-focus-within:text-[var(--theme-accent-primary)] transition-colors flex items-center justify-center">
                            {customIcon}
                        </div>
                    ) : (
                        <Search
                            size={18}
                            strokeWidth={3}
                            className="text-gray-400 group-focus-within:text-[var(--theme-accent-primary)] transition-colors"
                        />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder.toUpperCase()}
                    value={query || ''}
                    onChange={(e) => setQuery && setQuery(e.target.value)}
                    className="font-sans flex-1 w-full h-full bg-transparent text-gray-900 pr-2 py-0 m-0 text-[14px] leading-none font-bold outline-none placeholder:text-gray-800 placeholder:font-bold"
                />
                
                {/* CLEAR SEARCH BUTTON */}
                {query && (
                    <button 
                        onClick={handleClear} 
                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-[var(--theme-accent-primary)] transition-colors shrink-0"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* KEEP RIGHT SPACING SO IT CENTERS LIKE CONTEXTUAL HEADER */}
            <div className="shrink-0 w-2" aria-hidden="true" />
        </div>
    );
};

export default SearchNavBar;
