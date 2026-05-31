import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, MapPin, Info, Pin } from 'lucide-react';
import Avatar from '../../ui/Avatar';
import { resolveImageUrl } from '../../../utils/urlHelper';
import UniversalCardActionButton from './UniversalCard.ActionButton';
import { Button } from '../Button/Button';

const UniversalCardHeader = ({ 
    item, 
    cardVariant, 
    displayTown, 
    displayAuthor, 
    avatarSrc, 
    avatarRole, 
    isOfficial, 
    displayDate, 
    displayTime,
    infoText,
    infoLink,
    isPageHeader,
    className
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isEventOrAgenda = cardVariant === 'event' || item?.type === 'agenda';
    const isPinned = item?.is_pinned || item?.pinned || item?.metadata?.is_pinned;
    const hasNotice = isEventOrAgenda || isPinned;

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        
        // 1. Pobles Rule: Clicking the header goes to the Town/Community page
        if (cardVariant === 'pobles') {
            const townId = item?.towns?.id || item?.town_id;
            if (townId) {
                navigate(`/pobles/${townId}`);
            } else {
                navigate('/pobles');
            }
            return;
        }

        // 2. Default Profile Routing
        const authorId = item?.author_user_id || item?.author_id || item?.user_id;
        const entityId = item?.author_entity_id;
        const authorName = item?.author_name || item?.author || displayAuthor;

        const normalizedName = authorName ? String(authorName).toLowerCase() : '';

        // CONSOLIDACIÓ D'IDENTITATS (Sóc de Poble i Javi Llinares)
        if (entityId === 'socdepoble' || entityId === 'soc-de-poble' || normalizedName.includes('soc de poble')) {
            navigate('/empresa/socdepoble');
            return;
        }

        if (authorId === 'javi-llinares' || authorId === 'javillinares' || normalizedName.includes('javi llinares')) {
            navigate('/gent/javillinares');
            return;
        }

        if (item?.type === 'ajuntament' || item?.author_type === 'ajuntament') {
            const townStr = item?.town_name || authorName.replace(/Ajuntament de /i, '') || '';
            const townSlug = townStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 'desconegut';
            navigate(`/ajuntament/${townSlug}`);
            return;
        }

        if (entityId) {
            navigate(`/empresa/${entityId}`);
        } else if (authorId) {
            navigate(`/gent/${authorId}`);
        } else if (authorName) {
            const authorType = item?.author_type || 'gent';
            const slug = item?.author_slug || authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            navigate(`/${authorType}/${slug}`);
        }
    };

    const handleInfoClick = (e) => {
        e.stopPropagation();
        if (infoLink) {
            navigate(infoLink);
        } else if (hasNotice) {
            navigate(isPinned ? '/destacats' : '/agenda');
        }
    };

    const finalAvatarSrc = resolveImageUrl(avatarSrc || item?.avatar_url || item?.author_avatar || item?.author?.avatar_url || item?.logo_url || item?.town_logo || item?.entity_avatar);
    const finalAvatarRole = avatarRole || item?.author_role;

    return (
        <div 
            className={`flex items-center justify-between px-4 py-2 h-[64px] min-h-[64px] max-h-[64px] shrink-0 bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white relative z-10 w-full transition-colors ${!isPageHeader ? 'rounded-t-[28px]' : ''} ${className || ''}`} 
            onClick={handleAuthorClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAuthorClick(e);
                }
            }}
        >
            <div className={`flex items-center gap-3 overflow-hidden min-w-0 ${hasNotice || infoText ? 'pr-[120px]' : 'pr-[72px]'}`}>
                <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-all duration-300 ease-out flex items-center justify-center bg-black/5 dark:bg-white/5"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (finalAvatarRole === 'master') {
                            navigate('/iaia');
                        } else {
                            handleAuthorClick(e);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (finalAvatarRole === 'master') {
                                navigate('/iaia');
                            } else {
                                handleAuthorClick(e);
                            }
                        }
                    }}
                    aria-label={`Veure perfil de ${displayAuthor}`}
                >
                    <Avatar 
                        name={displayAuthor} 
                        src={finalAvatarSrc} 
                        role={finalAvatarRole}
                        size="md"
                    />
                </div>
                
                <div className="flex flex-col min-w-0">
                    <div className="text-[#111111] dark:text-white text-[18px] font-black tracking-wide leading-tight flex items-center gap-1.5 min-w-0 cursor-pointer active:opacity-70 transition-opacity">
                        <div className="truncate"><span>{displayAuthor}</span></div>
                        {item?.is_iaia_inspired && (
                            <Sparkles size={14} className="text-[#111111] dark:text-[#F97316] shrink-0" fill="currentColor" />
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-0">
                        {((cardVariant === 'agent' ? item?.town_name : displayTown) && (cardVariant === 'agent' ? item?.town_name : displayTown) !== displayAuthor) && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold leading-none" title={((cardVariant === 'agent' ? item?.town_name : displayTown) || '').replace("Poble Principal:", "").trim()}>
                                {cardVariant !== 'pobles' && <MapPin size={12} className="shrink-0" />}
                                <div className="truncate"><span>{((cardVariant === 'agent' ? item?.town_name : displayTown) || '').replace("Poble Principal:", "").trim()}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute right-[10px] top-0 bottom-0 flex flex-row items-center justify-end gap-1.5 shrink-0 pointer-events-none">
                {(infoText || hasNotice) && (
                    <Button 
                        intent="ghost"
                        shape="pill"
                        size="touch"
                        className={`pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.25)] bg-[#111111]/10 dark:bg-white/10 hover:bg-[#111111]/20 dark:hover:bg-white/20 border-none !h-[40px] ${((hasNotice && isPinned) || (infoText && infoText.length <= 3)) ? 'px-0 w-[40px]' : 'px-4'}`} 
                        title="Més informació"
                        onClick={handleInfoClick}
                        aria-label="Més informació"
                    >
                        {hasNotice ? (
                            <div className="flex items-center gap-1">
                                {isPinned ? <Pin size={16} fill="currentColor" /> : isEventOrAgenda ? <Info size={14} className="text-[#F97316]" fill="currentColor" /> : null}
                                {!isPinned && <span className="text-[12px] font-black uppercase tracking-wider leading-none mt-0.5">{t('card.agenda_tag') || 'AGENDA'}</span>}
                            </div>
                        ) : (
                            <span className={`font-black uppercase tracking-wider leading-none ${infoText && infoText.length <= 3 ? 'text-[18px]' : 'text-[14px] mt-0.5'}`}>{infoText}</span>
                        )}
                    </Button>
                )}
                
                {/* Date / Time Block */}
                <UniversalCardActionButton 
                    variant="orange"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/calendari');
                    }}
                    title="Veure al calendari"
                    ariaLabel={`Veure al calendari ${displayTime || ''} ${displayDate || ''}`}
                    className="font-bold flex-col"
                >
                    {displayTime && <div className="text-[14px] leading-none mb-0.5"><span>{displayTime}</span></div>}
                    {displayDate && <div className="text-[12px] opacity-90 leading-none"><span>{displayDate}</span></div>}
                </UniversalCardActionButton>
            </div>
        </div>
    );
};

export default UniversalCardHeader;
