import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button';
import { Text } from '../../design-system/components/Typography/Text';

const UniversalCardBody = ({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    const TRUNCATE_LENGTH = 280;
    
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'smart-clamp-tags' : 'smart-clamp-notags';

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div className="card-body flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div 
                className="flex flex-col flex-1 min-h-0 px-5 pt-5 pb-6 overflow-hidden cursor-pointer group"
                onClick={handleReadMoreClick}
                role="button"
                tabIndex={0}
                aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}
            >
                <div className="title-row flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                    <div className="flex justify-between items-start gap-4 w-full [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                        <div className="flex-1 min-w-0">
                            <Text variant="h3" as="h2" className="!tracking-tight !leading-tight line-clamp-2 min-h-[3.75rem] text-theme-text font-black">
                                {displayTitle}
                            </Text>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <span className="card-price whitespace-nowrap">{displayPrice}</span>
                        )}
                    </div>
                    <Text variant="secondary" as="h3" className="font-bold text-[var(--theme-accent-primary)] leading-snug line-clamp-1 truncate min-h-[1.51rem] w-full !mb-0">
                        {item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : '')) || ' '}
                    </Text>
                </div>

                <div className="card-excerpt-container flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-1">
                    {displayExcerpt && (
                        <Text variant="paragraph" className={`card-excerpt m-0 p-0 !mb-0 font-medium ${smartClampClass}`} style={{ lineHeight: '24px' }}>
                            {displayExcerpt}
                        </Text>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && displayExcerpt.length > 130 && (
                    <Button
                        intent="primary"
                        fullWidth
                        className="py-2.5 uppercase tracking-wide rounded-none"
                        aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                        onClick={handleReadMoreClick}
                        rightIcon={<ChevronRight size={18} className="mt-[1px]" />}
                    >
                        Llegir més
                    </Button>
                )}

                {item?.tags && item.tags.length > 0 && (
                    <div 
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-blue-500/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                        {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[14px] font-bold uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                        {item.tags.length > 3 && (
                            <span title={item.tags.slice(3).join(', ')} className="text-[14px] font-bold uppercase tracking-wide opacity-80 cursor-default">
                                +{item.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalCardBody;
