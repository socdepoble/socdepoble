import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, BadgeCheck, MapPin, Zap, Info } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { resolveImageUrl } from '../../utils/urlHelper';
import UniversalCardActionButton from './UniversalCard.ActionButton';

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
    isPageHeader
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

        if (entityId) {
            navigate(`/entitat/${entityId}`);
        } else if (authorId) {
            navigate(`/perfil/${authorId}`);
        } else if (authorName) {
            const slug = authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            navigate(`/perfil/${slug}`);
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

    const finalAvatarSrc = resolveImageUrl(avatarSrc || item?.avatar_url || item?.author_avatar || item?.author?.avatar_url || item?.logo_url);
    const finalAvatarRole = avatarRole || item?.author_role;

    return (
        <header 
            className={`flex items-center justify-between px-4 py-2 h-[64px] min-h-[64px] max-h-[64px] shrink-0 bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white relative z-10 w-full transition-colors ${!isPageHeader ? 'rounded-t-[28px]' : ''}`} 
            onClick={handleAuthorClick}
            role="button"
            tabIndex={0}
            aria-label={`Obrir perfil de ${displayAuthor}`}
        >
            <div className="flex items-center gap-3 overflow-hidden min-w-0 pr-[72px]">
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
                        <div className={`truncate ${cardVariant === 'pobles' ? 'lowercase first-letter:uppercase' : ''}`}><span>{cardVariant === 'pobles' ? displayTown : displayAuthor}</span></div>
                        {item?.is_iaia_inspired && (
                            <Sparkles size={14} className="text-[#111111] dark:text-[#F97316] shrink-0" fill="currentColor" />
                        )}
                        {/* IA-only identifier could go here if needed */}
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-0">
                        {((cardVariant === 'agent' ? item?.town_name : displayTown) && (cardVariant === 'agent' ? item?.town_name : displayTown) !== displayAuthor && cardVariant !== 'pobles') && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold leading-none" title={((cardVariant === 'agent' ? item?.town_name : displayTown) || '').replace("Poble Principal:", "").trim()}>
                                <MapPin size={12} className="shrink-0" />
                                <div className="truncate"><span>{((cardVariant === 'agent' ? item?.town_name : displayTown) || '').replace("Poble Principal:", "").trim()}</span></div>
                            </div>
                        )}
                        {cardVariant === 'pobles' && displayAuthor && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold leading-none" title={displayAuthor}>
                                <div className="truncate lowercase first-letter:uppercase"><span>{displayAuthor}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute right-[10px] top-0 bottom-0 flex flex-row items-center justify-end gap-1.5 shrink-0 pointer-events-none">
                {/* Notice / Action Button Block - NOMÉS a la Pàgina, mai a la Card per no trencar l'ISO */}
                {isPageHeader && (infoText || hasNotice) && (
                    <div 
                        className="pointer-events-auto bg-[#111111]/10 dark:bg-white/10 hover:bg-[#111111]/20 dark:hover:bg-white/20 transition-colors px-2 py-1 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm border border-[#111111]/5 dark:border-white/5 min-h-[34px]" 
                        title="Més informació"
                        onClick={handleInfoClick}
                    >
                        {hasNotice ? (
                            <>
                                {isPinned ? <Zap size={14} className="text-[#F97316]" fill="currentColor" /> : isEventOrAgenda ? <Info size={14} className="text-[#F97316]" fill="currentColor" /> : null}
                                <span className="text-[12px] font-black text-[#111111] dark:text-white uppercase tracking-wider leading-none mt-0.5">{isPinned ? 'DESTACAT' : (t('card.agenda_tag') || 'AGENDA')}</span>
                            </>
                        ) : (
                            <span className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-wider leading-none mt-0.5">{infoText}</span>
                        )}
                    </div>
                )}
                
                {/* Date / Time Block */}
                <UniversalCardActionButton 
                    variant="orange"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/calendari');
                    }}
                    title="Veure al calendari"
                    className="font-bold"
                >
                    {displayTime && <div className="text-[14px] leading-none mb-0.5"><span>{displayTime}</span></div>}
                    {displayDate && <div className="text-[12px] opacity-90 leading-none"><span>{displayDate}</span></div>}
                </UniversalCardActionButton>
            </div>
        </header>
    );
};

export default UniversalCardHeader;
