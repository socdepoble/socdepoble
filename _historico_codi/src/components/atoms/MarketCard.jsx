import React from "react";
import { useDesign } from "../../app/context/DesignContext";

// 🛡️ PROTOCOL ATÒMIC: MEMO PER A RENDEMENT
const MarketCard = React.memo(({ children, className = "", onClick }) => {
  const { accessibilityMode } = useDesign();

  return (
    <article
      onClick={onClick}
      className={`
        group
        w-full h-full 
        flex flex-col 
        bg-[var(--color-surface)] 
        border border-[var(--border-master)]
        rounded-[var(--radius-genesis)]
        overflow-hidden
        transition-all duration-300 ease-out
        hover:border-[var(--color-primary)]
        hover:shadow-[0_8px_32px_0_rgba(249,115,22,0.15)]
        active:scale-[0.98]
        ${accessibilityMode ? 'ring-2 ring-[var(--color-primary)]' : ''}
        ${className}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
    >
      {children}
    </article>
  );
});

// 🧩 SUB-COMPONENTS (COMPOSICIÓ INTERNA)
MarketCard.Image = ({ src, alt }) => (
  <div className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--color-surface-container)]">
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-[var(--color-primary)]">
        <Heart size={16} />
      </button>
      <button className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-[var(--color-primary)]">
        <Share2 size={16} />
      </button>
    </div>
  </div>
);

MarketCard.Content = ({ children, className = "" }) => (
  <div className={`flex-1 flex flex-col p-4 gap-2 ${className}`}>
    {children}
  </div>
);

MarketCard.Title = ({ children }) => (
  <h3 className="text-lg font-black text-[var(--text-main)] line-clamp-2 leading-tight">
    {children}
  </h3>
);

MarketCard.Price = ({ value, currency = "€" }) => (
  <div className="mt-auto pt-2 flex items-baseline gap-1">
    <span className="text-xl font-black text-[var(--color-primary)]">
      {value}
    </span>
    <span className="text-sm font-bold text-[var(--text-secondary)]">
      {currency}
    </span>
  </div>
);

MarketCard.Meta = ({ children }) => (
  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
    {children}
  </div>
);

export default MarketCard;
