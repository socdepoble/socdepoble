import React from 'react';
import { Search, LayoutGrid, List, Square, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import './ContextualHeader.css';

const ContextualHeader = ({ searchTerm, onSearchChange, viewMode, onViewModeChange, placeholder = "Cerca..." }) => {
    const { hapticService } = useUI();

    const handleSearchClear = () => {
        onSearchChange('');
        if (hapticService) hapticService.bategat();
    };

    return (
        <div className="contextual-header-container">
            <div className="search-bar-wrapper">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                />
                {searchTerm && (
                    <button onClick={handleSearchClear} className="clear-search-btn">
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="view-mode-toggles">
                <button
                    onClick={() => { onViewModeChange('single'); hapticService?.bategat(); }}
                    className={`view-toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
                >
                    <Square size={20} />
                </button>
                <button
                    onClick={() => { onViewModeChange('grid'); hapticService?.bategat(); }}
                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                    <LayoutGrid size={20} />
                </button>
                <button
                    onClick={() => { onViewModeChange('list'); hapticService?.bategat(); }}
                    className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                    <List size={20} />
                </button>
            </div>
        </div>
    );
};

export default ContextualHeader;
