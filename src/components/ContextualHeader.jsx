import React, { forwardRef } from 'react';
import { Search, LayoutGrid, List, Square, X } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import './ContextualHeader.css';

const ContextualHeader = forwardRef(({ searchTerm, onSearchChange, viewMode, onViewModeChange, placeholder = "Cerca...", extraActions = null, backButton = null }, ref) => {
    const { hapticService } = useDesign();

    const handleSearchClear = () => {
        onSearchChange('');
        if (hapticService) hapticService.trigger();
    };

    return (
        <div className="contextual-header-container">
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

            <div className="view-mode-toggles">
                <button
                    onClick={() => { onViewModeChange('single'); hapticService?.trigger(); }}
                    className={`view-toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
                >
                    <Square size={20} />
                </button>
                <button
                    onClick={() => { onViewModeChange('grid'); hapticService?.trigger(); }}
                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                    <LayoutGrid size={20} />
                </button>
                <button
                    onClick={() => { onViewModeChange('list'); hapticService?.trigger(); }}
                    className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                    <List size={20} />
                </button>
            </div>
        </div>
    );
});

export default ContextualHeader;
