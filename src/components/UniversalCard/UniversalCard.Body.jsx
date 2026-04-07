import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button';


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
        <div className="flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div 
                className="flex flex-col flex-1 min-h-0 px-5 pt-3 pb-4 overflow-hidden cursor-pointer group"
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
                            <div className="text-[24px] md:text-[28px] leading-[1.1] font-black tracking-tight line-clamp-2 text-theme-text">
                                <span>{displayTitle}</span>
                            </div>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <div className="whitespace-nowrap font-black text-[18px] text-[#F97316] shrink-0"><span>{displayPrice}</span></div>
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
                                    <h3 className="font-black text-[#F97316] text-[18px] md:text-[20px] leading-[1.3] w-full">
                                        <span>{subtitleText}</span>
                                    </h3>
                                ) : (
                                    <div className="font-semibold text-[#F97316] text-[14px] leading-snug truncate w-full">
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
                {displayExcerpt && (
                    <Button
                        intent="ghost"
                        fullWidth
                        className="py-2.5 font-bold uppercase tracking-widest text-[#F97316] hover:bg-[#F97316]/10 active:scale-100 rounded-none"
                        aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                        onClick={handleReadMoreClick}
                        rightIcon={<ChevronRight size={18} className="mt-[1px]" />}
                    >
                        Llegir més
                    </Button>
                )}

                {hasTags && (
                    <div className="w-full flex justify-start items-center gap-2 px-5 pb-4 pt-1 flex-wrap">
                         {item.tags.slice(0, 3).map((tag) => {
                             // Clean the tag text to remove # if it already has one, preventing ## duplicate
                             const cleanTagStr = tag.replace(/^#+/, '');
                             return (
                                 <div key={cleanTagStr} className="text-[12px] font-black uppercase tracking-wider text-theme-muted bg-theme-base px-2.5 py-1 rounded-[6px]">
                                     <span>#{cleanTagStr}</span>
                                 </div>
                             )
                         })}
                         {item.tags.length > 3 && (
                             <div title={item.tags.slice(3).join(', ')} className="text-[12px] font-black uppercase tracking-wider text-theme-muted/50 cursor-default">
                                 <span>+{item.tags.length - 3}</span>
                             </div>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
});

UniversalCardBody.displayName = 'UniversalCardBody';

export default UniversalCardBody;
