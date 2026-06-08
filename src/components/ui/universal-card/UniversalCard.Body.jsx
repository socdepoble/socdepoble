import React from 'react';
import { Link } from 'react-router-dom';

const humanizeTag = (tag) => {
    let str = tag.replace(/^#+/, '');
    str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0-\xDF])/g, '$1 $2');
    str = str.replace(/[_-]/g, ' ');
    str = str.replace(/\s+/g, ' ').trim();
    if (str.length > 0) {
        str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
};


const UniversalCardBody = React.memo(({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    handleCardClick,
    cardVariant,
    displayPrice,
    viewMode
}) => {
    const isWikipedia = cardVariant === 'pobles';
    const watermarkText = isWikipedia 
        ? "© WIKIPEDIA / WIKIMEDIA COMMONS (CC BY-SA)"
        : "© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA";

    const extractedTags = displayExcerpt ? (displayExcerpt.match(/#[a-zA-Z0-9_À-ÿ]+/g) || []).map(t => t.replace(/^#+/, '')) : [];
    const allTags = [...new Set([...(item?.tags || []), ...extractedTags])];
    const hasTags = allTags.length > 0;

    const subtitleText = item?.post_subtitle || item?.subtitle || 
        (cardVariant === 'pobles' && item?.comarca ? item.comarca : 
        ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : ''));

    const titleLines = (displayTitle && displayTitle.length > 28) ? 2 : 1;
    const subtitleLines = subtitleText ? (subtitleText.length > 38 ? 2 : 1) : 0;
    const headerLines = titleLines + subtitleLines;
    
    const maxTotalSlots = hasTags ? 8 : 9;
    const allowedParagraphLines = maxTotalSlots - headerLines;
    const clampedLines = Math.max(3, Math.min(allowedParagraphLines, 7));
    
    let smartClampClass = clampedLines === 7 ? 'line-clamp-[7]' : `line-clamp-${clampedLines}`;

    const cleanedExcerpt = displayExcerpt ? displayExcerpt.replace(/#[a-zA-Z0-9_À-ÿ]+/g, '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() : '';

    const handleReadMoreClick = React.useCallback((e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        
        if (handleCardClick) {
            return handleCardClick(e);
        }
        
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const cleanTownName = item?.name ? item.name.replace("La Torre de les Maçanes", "La Torre") : id;
            const townHandle = sluggify(cleanTownName);
            navigate(`/pobles/${townHandle}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    }, [item, cardVariant, navigate, handleCardClick]);

    const id = item?.uuid || item?.id;
    let computedUrl = id ? `/post/${id}` : '#';
    if (item?.type === 'page' && item?.slug) {
        if (['el-projecte', 'manual', 'arxiu', 'projecte', 'manifest', 'disseny', 'ruta', 'skills', 'iaies-mundials'].includes(item.slug)) {
            computedUrl = `/${item.slug}`;
        } else {
            computedUrl = `/page/${item.slug}`;
        }
    } else if (cardVariant === 'pobles') {
        const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const cleanTownName = item?.name ? item.name.replace("La Torre de les Maçanes", "La Torre") : id;
        const townHandle = sluggify(cleanTownName);
        computedUrl = `/pobles/${townHandle}`;
    } else if (cardVariant === 'mercat' || cardVariant === 'market') {
        computedUrl = `/mercat/${id}`;
    }

    return (
        <div className="flex flex-col flex-auto relative z-10 p-0">
            <Link 
                to={computedUrl}
                className="flex flex-col flex-auto px-4 pt-3 pb-0 cursor-pointer group after:absolute after:inset-0 after:z-0"
                onClick={handleReadMoreClick}
            >
                <div className="flex flex-col items-start gap-2 pb-1 shrink-0 group-hover:opacity-80 transition-opacity">
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <div className="text-[24px] md:text-[28px] leading-[1.1] font-black tracking-tight line-clamp-2 text-theme-text" itemProp="name headline">
                                <span>{displayTitle}</span>
                            </div>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && !item?.is_store_disabled && (
                            <div className="flex flex-col items-end shrink-0 gap-1 mt-1">
                                {displayPrice && <div className="whitespace-nowrap font-black text-[22px] md:text-[24px] text-[#B43D0C] dark:text-[#F97316] leading-none"><span>{displayPrice}</span></div>}
                                {item?.stock_status && (
                                    <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full leading-none ${item.stock_status.toLowerCase() === 'esgotat' || item.stock_status.toLowerCase() === 'outofstock' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                        <span>{item.stock_status.toLowerCase() === 'outofstock' ? 'Esgotat' : item.stock_status}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {(() => {
                        if (!subtitleText) return null;
                        
                        return (
                            <div className="flex flex-col gap-1.5 w-full">
                                {cardVariant === 'agent' ? (
                                    <h3 className="font-semibold text-[#0369A1] dark:text-[#F97316] text-[18px] md:text-[20px] leading-[1.3] w-full" itemProp="description">
                                        <span>{subtitleText}</span>
                                    </h3>
                                ) : (
                                    <div className="font-semibold text-[#0369A1] dark:text-[#F97316] text-[20px] md:text-[22px] leading-snug line-clamp-2 w-full" itemProp="description">
                                        <span>{subtitleText}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                <div className="flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-0">
                    {cleanedExcerpt && (
                        <div 
                            className={`text-[18px] md:text-[19px] font-normal leading-[1.45] text-theme-muted [&_strong]:font-bold [&_strong]:text-theme-text [&_b]:font-bold [&_b]:text-theme-text ${smartClampClass}`}
                            dangerouslySetInnerHTML={{ __html: cleanedExcerpt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />
                    )}
                </div>
            </Link>
            
            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {children && (
                    <div className="z-20 relative px-4 mt-2 mb-2 w-full flex justify-center">
                        {children}
                    </div>
                )}

                {viewMode === 'list' ? (
                    <div className="w-full flex items-center justify-between gap-2 px-4 pb-[5px] pt-1 flex-wrap">
                        {hasTags && (
                            <div className="flex items-center gap-1.5 flex-wrap flex-1">
                                {allTags.slice(0, 3).map((tag, index) => {
                                     const cleanTagStr = tag.replace(/^#+/, '');
                                     const displayTagStr = humanizeTag(tag);
                                     const bgClasses = ['bg-[#0369A1]/10 text-[#0369A1]', 'bg-[#F97316]/10 text-[#F97316]', 'bg-black/5 dark:bg-white/10 text-theme-text'];
                                     const colorClass = bgClasses[index % bgClasses.length];
                                     return (
                                         <div key={cleanTagStr} className={`text-[13px] md:text-[14px] font-black tracking-wide px-3 py-1.5 rounded-full ${colorClass}`}>
                                             <span>{displayTagStr}</span>
                                         </div>
                                     )
                                 })}
                                 {allTags.length > 3 && (
                                     <div title={allTags.slice(3).join(', ')} className="text-[13px] md:text-[14px] font-black tracking-wide bg-black/5 dark:bg-white/10 text-theme-text px-3 py-1.5 rounded-full cursor-default">
                                         <span>+{allTags.length - 3}</span>
                                     </div>
                                 )}
                            </div>
                        )}
                        {cleanedExcerpt && (
                            <Link
                                autoFocus={false}
                                to={computedUrl}
                                className="flex items-center gap-1 font-black tracking-[0.1em] uppercase text-[#B43D0C] dark:text-[#F97316] hover:opacity-80 transition-opacity whitespace-nowrap ml-auto text-sm"
                                aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                                onClick={handleReadMoreClick}
                            >
                                <span>Llegir més</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {cleanedExcerpt && (
                            <div className="w-full flex justify-center py-1 mb-0">
                                <Link
                                    autoFocus={false}
                                    to={computedUrl}
                                    className="flex items-center gap-1 font-black tracking-[0.1em] uppercase text-[#B43D0C] dark:text-[#F97316] hover:opacity-80 transition-opacity"
                                    aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                                    onClick={handleReadMoreClick}
                                >
                                    <span>Llegir més</span>
                                </Link>
                            </div>
                        )}
        
                        {hasTags && (
                            <div className="w-full flex justify-center items-center gap-2 px-4 pb-[15px] flex-wrap">
                                 {allTags.slice(0, 3).map((tag, index) => {
                                     const cleanTagStr = tag.replace(/^#+/, '');
                                     const displayTagStr = humanizeTag(tag);
                                     const bgClasses = ['bg-[#0369A1]/10 text-[#0369A1]', 'bg-[#F97316]/10 text-[#F97316]', 'bg-black/5 dark:bg-white/10 text-theme-text'];
                                     const colorClass = bgClasses[index % bgClasses.length];
                                     return (
                                         <div key={cleanTagStr} className={`text-[13px] md:text-[14px] font-black tracking-wide px-3 py-1.5 rounded-full ${colorClass}`}>
                                             <span>{displayTagStr}</span>
                                         </div>
                                     )
                                 })}
                                 {allTags.length > 3 && (
                                     <div title={allTags.slice(3).join(', ')} className="text-[13px] md:text-[14px] font-black tracking-wide bg-black/5 dark:bg-white/10 text-theme-text px-3 py-1.5 rounded-full cursor-default">
                                         <span>+{allTags.length - 3}</span>
                                     </div>
                                 )}
                            </div>
                        )}
                    </>
                )}

                <div className="w-full px-4 pb-1 flex justify-center">
                    <p className="text-[10px] font-black tracking-widest text-theme-muted/50 uppercase select-none text-center m-0 p-0 leading-none">
                        {watermarkText}
                    </p>
                </div>
            </div>
        </div>
    );
});

UniversalCardBody.displayName = 'UniversalCardBody';

export default UniversalCardBody;
