import React, { forwardRef } from 'react';
import { Search, LayoutGrid, List, Square, X } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { toast } from '../utils/toast';
import './ContextualHeader.css';

const ContextualHeader = forwardRef(({ searchTerm, onSearchChange, viewMode, onViewModeChange, placeholder = "Cerca...", extraActions = null, backButton = null }, ref) => {
    const { hapticService, theme } = useDesign();
    const isDayMode = theme === 'light';

    const handleSearchClear = () => {
        onSearchChange('');
        if (hapticService) hapticService.trigger();
    };

    return (
        <div className={`contextual-header-container transition-colors duration-500 ${isDayMode ? '!bg-[#F97316]' : '!bg-[var(--sdp-blue)]'}`}>
            <div className="search-bar-wrapper h-14 flex items-center">
                {backButton}
                <Search size={22} className="search-icon" />
                <input
                    ref={ref}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder.toUpperCase()}
                    className="search-input text-lg font-black tracking-widest uppercase"
                />
                {searchTerm && (
                    <button onClick={handleSearchClear} className="clear-search-btn">
                        <X size={16} />
                    </button>
                )}
                {extraActions && (
                    <div className="extra-actions-wrapper ml-2 flex gap-2">
                        {extraActions}
                    </div>
                )}
            </div>

            <div className="flex items-center bg-black/10 dark:bg-black/30 p-1.5 rounded-2xl gap-1.5 ml-2 mr-1 sm:mr-4 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10 shrink-0">
                <button
                    onClick={() => { onViewModeChange('single'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 ${viewMode === 'single' ? 'bg-white text-[var(--theme-accent-primary)] shadow-md scale-105' : 'text-white/90 hover:bg-black/10 hover:text-white'}`}
                    title="Vista Completa (1 Columna)"
                >
                    <Square size={18} strokeWidth={viewMode === 'single' ? 2.5 : 2} />
                </button>
                <button
                    onClick={() => { 
                        if (window.innerWidth < 850) {
                            hapticService?.trigger();
                            toast.custom('L\'espai és massa estret (min. 850px) per no aixafar les targetes.', {
                                icon: '📏',
                                style: {
                                    borderRadius: '16px',
                                    background: '#111',
                                    color: '#fff',
                                    border: '1px solid #FF6D23',
                                    fontWeight: '900',
                                    fontSize: '14px'
                                },
                            });
                            return;
                        }
                        onViewModeChange('grid'); 
                        hapticService?.trigger(); 
                    }}
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-[var(--theme-accent-primary)] shadow-md scale-105' : 'text-white/90 hover:bg-black/10 hover:text-white'}`}
                    title="Vista Quadrícula"
                >
                    <LayoutGrid size={18} strokeWidth={viewMode === 'grid' ? 2.5 : 2} />
                </button>
                <button
                    onClick={() => { onViewModeChange('list'); hapticService?.trigger(); }}
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-[var(--theme-accent-primary)] shadow-md scale-105' : 'text-white/90 hover:bg-black/10 hover:text-white'}`}
                    title="Vista Llistat Compacte"
                >
                    <List size={18} strokeWidth={viewMode === 'list' ? 2.5 : 2} />
                </button>
            </div>
        </div>
    );
});

export default ContextualHeader;
