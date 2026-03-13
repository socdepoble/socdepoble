import React from 'react';
import { ChevronRight } from 'lucide-react';

const UniversalCardBody = ({
    displayTitle,
    displayExcerpt,
    item,
    isOfficial,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    const TRUNCATE_LENGTH = 280;

    return (
        <div className="card-body">
            <div className="title-row flex justify-between items-start gap-4">
                <h2 className="genesis-title flex-1">{displayTitle}</h2>
                {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                    <span className="card-price whitespace-nowrap">{displayPrice}</span>
                )}
            </div>

            {displayExcerpt && (
                <div className="card-excerpt-container">
                    <p className="card-excerpt">
                        {displayExcerpt.length > 150
                            ? `${displayExcerpt.substring(0, 150)}...`
                            : displayExcerpt}
                    </p>
                    {displayExcerpt.length > 150 && (
                        <button
                            className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1 mt-2 mb-1 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/5"
                            onClick={(e) => {
                                e.stopPropagation();
                                const id = item?.uuid || item?.id;
                                if (id) navigate(`/post/${id}`);
                            }}
                        >
                            Continuar llegint... <ChevronRight size={16} className="mt-[1px]" />
                        </button>
                    )}
                </div>
            )}

            <div className="card-tags-row">
                {item?.tags?.map((tag, idx) => {
                    let badgeClass = '';
                    const cleanTag = tag.toLowerCase().replace('#', '');
                    if (cleanTag === 'km0') badgeClass = 'badge-km0';
                    else if (cleanTag === 'sostenible' || cleanTag === 'ecològic') badgeClass = 'badge-sostenible';
                    else if (cleanTag === 'artesania' || cleanTag === 'fetamà') badgeClass = 'badge-artesania';
                    else if (cleanTag === 'oferta') badgeClass = 'badge-oferta';
                    else if (isOfficial) badgeClass = 'badge-oficial';

                    return (
                        <span key={idx} className={`genesis-tag-pill ${badgeClass}`}>
                            {tag}
                        </span>
                    );
                })}
            </div>

            {children}
        </div>
    );
};

export default UniversalCardBody;
