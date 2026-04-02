import React, { forwardRef, useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Square, X } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import './ContextualHeader.css';

const ContextualHeader = forwardRef(({ searchTerm, onSearchChange, viewMode, onViewModeChange, placeholder = "Cerca...", extraActions = null, backButton = null }, ref) => {
    const { hapticService } = useDesign();
    const [localSearch, setLocalSearch] = useState(searchTerm);

    // Sync from parent if needed
    useEffect(() => {
        setLocalSearch(searchTerm);
    }, [searchTerm]);

    // Debounce to parent
    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearch !== searchTerm) {
                onSearchChange(localSearch);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [localSearch, searchTerm, onSearchChange]);

    const handleSearchClear = () => {
        setLocalSearch('');
        onSearchChange('');
        if (hapticService) hapticService.trigger();
    };

    return (
        <div className="relative z-10 bg-[#F97316] dark:bg-[#4F46E5] w-full h-[64px] min-h-[64px] max-h-[64px] flex items-center justify-between px-3 transition-colors duration-500 shadow-md">
            
            {/* BACK BUTTON */}
            {backButton && (
                <div className="shrink-0 mr-3 text-white/90 hover:text-white transition-colors flex items-center justify-center">
                    {backButton}
                </div>
            )}

            {/* SEARCH BAR (TECH-HUERTA V12 CANÒNICA) */}
            <div className="flex items-center flex-1 h-[36px] bg-white rounded-[24px] overflow-hidden focus-within:ring-2 focus-within:ring-[#169CF9] transition-all group">
                <div className="flex items-center justify-center pl-4 pr-2 h-full">
                    <Search
                        size={18}
                        strokeWidth={3}
                        className="text-gray-400 group-focus-within:text-[#F97316] dark:group-focus-within:text-[#4F46E5] transition-colors"
                    />
                </div>
                <input
                    ref={ref}
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder={placeholder.toUpperCase()}
                    className="font-sans flex-1 w-full h-full bg-transparent text-gray-900 pr-2 py-0 m-0 text-[14px] leading-none font-bold outline-none placeholder:text-gray-800 placeholder:font-bold"
                />
                
                {/* EXTRA ACTIONS */}
                {extraActions && (
                    <div className="flex items-center pr-2 gap-2 shrink-0">
                        {extraActions}
                    </div>
                )}

                {/* CLEAR SEARCH BUTTON */}
                {localSearch && (
                    <button 
                        onClick={handleSearchClear} 
                        className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-[#F97316] transition-colors shrink-0"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* VIEW MODE SWITCH */}
            {onViewModeChange && (
            <div className="hidden sm:flex items-center bg-black/20 dark:bg-white/10 p-1 rounded-full gap-1 ml-3 shrink-0">
                <button
                    onClick={() => { onViewModeChange('single'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'single' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Completa (1 Columna)"
                >
                    <Square size={16} strokeWidth={viewMode === 'single' ? 3 : 2} />
                </button>
                <button
                    onClick={() => { 
                        onViewModeChange('grid'); 
                        if (hapticService) hapticService.trigger(); 
                    }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'grid' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Quadrícula"
                >
                    <LayoutGrid size={16} strokeWidth={viewMode === 'grid' ? 3 : 2} />
                </button>
                <button
                    onClick={() => { onViewModeChange('list'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-out active:scale-95 ${viewMode === 'list' ? 'bg-white text-[#F97316] shadow-md' : 'text-white/70 hover:bg-white/20 hover:text-white'}`}
                    title="Vista Llistat Compacte"
                >
                    <List size={16} strokeWidth={viewMode === 'list' ? 3 : 2} />
                </button>
            </div>
            )}
        </div>
    );
});

export default ContextualHeader;
