import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button';
import { Text } from '../../design-system/components/Typography/Text';

const UniversalCardBody = React.memo(({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'line-clamp-2' : 'line-clamp-4';

    const handleReadMoreClick = React.useCallback((e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

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
                <div className="flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                    <div className="flex justify-between items-start gap-4 w-full [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                        <div className="flex-1 min-w-0">
                            <span className="font-sans text-xl md:text-[22px] leading-tight font-black tracking-tight line-clamp-2 text-theme-text">
                                {displayTitle}
                            </span>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <span className="whitespace-nowrap font-black text-[18px] text-[#F97316]">{displayPrice}</span>
                        )}
                    </div>
                    {(() => {
                        const subtitleText = item?.post_subtitle || item?.subtitle || 
                            (cardVariant === 'pobles' && item?.comarca ? item.comarca : 
                            ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : ''));
                        
                        if (!subtitleText) return null;
                        
                        return (
                            <span className="font-sans font-semibold text-[#F97316] text-[14px] leading-snug line-clamp-1 truncate w-full">
                                {subtitleText}
                            </span>
                        );
                    })()}
                </div>

                <div className="flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-2">
                    {displayExcerpt && (
                        <p className={`font-sans text-[15px] font-normal leading-[1.6] text-theme-muted ${smartClampClass}`}>
                            {displayExcerpt}
                        </p>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && (
                    <Button
                        intent="ghost"
                        fullWidth
                        className="py-2.5 font-bold uppercase tracking-widest text-[#F97316] hover:bg-[#F97316]/10 active:scale-100 rounded-none border-t border-border-master"
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
                                 <span key={cleanTagStr} className="text-[12px] font-black uppercase tracking-wider text-theme-muted bg-theme-base px-2.5 py-1 rounded-[6px] border border-border-master">
                                     #{cleanTagStr}
                                 </span>
                             )
                         })}
                         {item.tags.length > 3 && (
                             <span title={item.tags.slice(3).join(', ')} className="text-[12px] font-black uppercase tracking-wider text-theme-muted/50 cursor-default">
                                 +{item.tags.length - 3}
                             </span>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
});

UniversalCardBody.displayName = 'UniversalCardBody';

export default UniversalCardBody;
