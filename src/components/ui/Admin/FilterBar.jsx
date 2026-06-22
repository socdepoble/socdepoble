import React from 'react';
import PropTypes from 'prop-types';
import { Search, Filter } from 'lucide-react';
import { Button } from '../Button/Button';
import UniversalInput from '../Input/UniversalInput';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filterOptions,
  onApply
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[var(--theme-panel)] rounded-[20px] shadow-sm mb-6 border border-[var(--border-master)]">
      {/* Search Input */}
      <div className="flex-1 relative">
        <UniversalInput
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cercar al sistema..."
          className="pl-10 w-full"
          aria-label="Cercador del panell d'administració"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" aria-hidden="true" />
      </div>

      {/* Select Filter */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="relative">
          <select
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="appearance-none bg-white border border-[var(--border-master)] rounded-xl px-4 py-3 pl-10 text-sm font-bold uppercase tracking-wider text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-primary)] transition-all cursor-pointer h-11"
            aria-label="Filtre d'estat"
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" aria-hidden="true" />
        </div>
        
        {onApply && (
          <Button intent="primary" onClick={onApply} aria-label="Aplicar filtres">
            Aplicar
          </Button>
        )}
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onApply: PropTypes.func
};

export default FilterBar;
