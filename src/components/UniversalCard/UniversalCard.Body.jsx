import React from 'react';
import { Button } from '../ui/Button/Button';
import { ChevronRight } from 'lucide-react';


const UniversalCardBody = React.memo(({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    handleCardClick,
    cardVariant,
    displayPrice
}) => {
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'line-clamp-2' : 'line-clamp-4';

    const isWikipedia = cardVariant === 'pobles';
    const watermarkText = isWikipedia 
        ? "© WIKIPEDIA / WIKIMEDIA COMMONS (CC BY-SA)"
        : "© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA";

    const handleReadMoreClick = React.useCallback((e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        
        if (handleCardClick) {
            return handleCardClick(e);
        }
        
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate, handleCardClick]);

    return (
        <div className="flex flex-col flex-1 min-h-0 relative z-10 p-0 overflow-hidden">
            <div 
                className="flex flex-col flex-1 min-h-0 px-4 pt-3 pb-4 overflow-hidden cursor-pointer group"
                onClick={handleReadMoreClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleReadMoreClick(e);
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}
            >
                <div className="flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity">
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <div className="text-[24px] md:text-[28px] leading-[1.1] font-black tracking-tight line-clamp-2 text-theme-text" itemProp="name headline">
                                <span>{displayTitle}</span>
                            </div>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && !item?.is_store_disabled && (
                            <div className="flex flex-col items-end shrink-0 gap-1 mt-1">
                                {displayPrice && <div className="whitespace-nowrap font-black text-[18px] text-[#F97316] leading-none"><span>{displayPrice}</span></div>}
                                {item?.stock_status && (
                                    <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full leading-none ${item.stock_status.toLowerCase() === 'esgotat' || item.stock_status.toLowerCase() === 'outofstock' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                        <span>{item.stock_status.toLowerCase() === 'outofstock' ? 'Esgotat' : item.stock_status}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {(() => {
                        const subtitleText = item?.post_subtitle || item?.subtitle || 
                            (cardVariant === 'pobles' && item?.comarca ? item.comarca : 
                            ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : ''));
                        
                        if (!subtitleText) return null;
                        
                        return (
                            <div className="flex flex-col gap-1.5 w-full">
                                {cardVariant === 'agent' ? (
                                    <h3 className="font-black text-[#F97316] text-[18px] md:text-[20px] leading-[1.3] w-full" itemProp="description">
                                        <span>{subtitleText}</span>
                                    </h3>
                                ) : (
                                    <div className="font-semibold text-[#F97316] text-[14px] leading-snug truncate w-full" itemProp="description">
                                        <span>{subtitleText}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                <div className="flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-2">
                    {displayExcerpt && (
                        cardVariant === 'pobles' ? (
                            <h3 className={`text-[17px] md:text-[19px] font-bold leading-[1.4] text-theme-text opacity-90 ${smartClampClass} whitespace-pre-line`}>
                                {displayExcerpt}
                            </h3>
                        ) : (
                            <div className={`text-[15px] font-normal leading-[1.6] text-theme-muted ${smartClampClass}`}>
                                <p className="whitespace-pre-line">{displayExcerpt}</p>
                            </div>
                        )
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {hasTags && (
                    <div className="w-full flex justify-start items-center gap-2 px-4 pb-4 pt-1 flex-wrap">
                         {item.tags.slice(0, 3).map((tag, index) => {
                             const cleanTagStr = tag.replace(/^#+/, '');
                             // Use different background colors based on index for a bit of variety if desired
                             const bgClasses = ['bg-[#169CF9]/10 text-[#169CF9]', 'bg-[#F97316]/10 text-[#F97316]', 'bg-black/5 dark:bg-white/10 text-theme-text'];
                             const colorClass = bgClasses[index % bgClasses.length];
                             return (
                                 <div key={cleanTagStr} className={`text-[12px] font-black tracking-wide px-3 py-1.5 rounded-full ${colorClass}`}>
                                     <span>{cleanTagStr}</span>
                                 </div>
                             )
                         })}
                         {item.tags.length > 3 && (
                             <div title={item.tags.slice(3).join(', ')} className="text-[12px] font-black tracking-wide bg-black/5 dark:bg-white/10 text-theme-text px-3 py-1.5 rounded-full cursor-default">
                                 <span>+{item.tags.length - 3}</span>
                             </div>
                         )}
                    </div>
                )}

                {displayExcerpt && (
                    <div className="w-full flex justify-center py-2 mb-2">
                        <button
                            className="flex items-center gap-1 font-black tracking-[0.1em] uppercase text-[#F97316] hover:opacity-80 transition-opacity"
                            aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                            onClick={handleReadMoreClick}
                        >
                            <span>Llegir més</span>
                            <ChevronRight size={16} strokeWidth={3} className="mt-[1px]" />
                        </button>
                    </div>
                )}

                <div className="w-full px-4 pb-1">
                    <p className="text-[10px] font-black tracking-widest text-theme-muted/50 uppercase select-none">
                        {watermarkText}
                    </p>
                </div>
            </div>
        </div>
    );
});

UniversalCardBody.displayName = 'UniversalCardBody';

export default UniversalCardBody;
