import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import { Zap, MapPin, MoreHorizontal, Sparkles, BadgeCheck, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UniversalCardHeader = ({ 
    item, 
    cardVariant, 
    displayTown, 
    displayAuthor, 
    avatarSrc, 
    avatarRole, 
    isOfficial, 
    displayDate, 
    displayTime 
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

    const finalAvatarSrc = avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url;
    const finalAvatarRole = avatarRole || item?.author_role;

    return (
        <header 
            className="flex items-center justify-between px-4 py-2 h-[64px] bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white relative z-10 w-full transition-colors" 
            onClick={handleAuthorClick}
            role="button"
            tabIndex={0}
            aria-label={`Obrir perfil de ${displayAuthor}`}
        >
            <div className="flex items-center gap-3 overflow-hidden min-w-0 pr-[72px]">
                <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-theme-panel cursor-pointer active:scale-95 transition-all duration-300 ease-out flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (finalAvatarRole === 'master') {
                            navigate('/iaia');
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
                        {isOfficial && (
                            <BadgeCheck size={16} className="text-[#111111] dark:text-[#38BDF8] drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_4px_#38BDF8] shrink-0" fill="currentColor" />
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5 min-w-0">
                        {((cardVariant === 'agent' ? item?.town_name : displayTown) && (cardVariant === 'agent' ? item?.town_name : displayTown) !== displayAuthor && cardVariant !== 'pobles') && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold" title={((cardVariant === 'agent' ? item?.town_name : displayTown) || '').replace("Poble Principal:", "").trim()}>
                                <MapPin size={12} className="shrink-0" />
                                <div className="truncate"><span>{((cardVariant === 'agent' ? item?.town_name : displayTown) || '').replace("Poble Principal:", "").trim()}</span></div>
                            </div>
                        )}
                        {cardVariant === 'pobles' && displayAuthor && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold" title={displayAuthor}>
                                <div className="truncate lowercase first-letter:uppercase"><span>{displayAuthor}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`absolute right-4 top-2 bottom-1.5 flex flex-col ${hasNotice ? 'justify-between' : 'justify-center'} items-end shrink-0 pointer-events-none`}>
                {hasNotice && (
                    <div className="pointer-events-auto flex items-center justify-end gap-1 w-full text-[11px] font-black text-[#F97316] uppercase tracking-wider leading-none mt-0.5">
                        {isPinned ? (
                            <Zap size={11} fill="currentColor" />
                        ) : isEventOrAgenda ? (
                            <Info size={11} fill="currentColor" />
                        ) : null}
                        <span>{isPinned ? 'DESTACAT' : (t('card.agenda_tag') || 'AGENDA')}</span>
                    </div>
                )}
                
                <div className={`flex flex-col items-end text-right font-bold pointer-events-auto ${hasNotice ? 'mt-auto justify-end' : ''}`}>
                    <div className="text-[13px] text-black dark:text-white leading-none mb-0.5"><span>{displayTime}</span></div>
                    <div className="text-[11px] text-black/70 dark:text-white/70 leading-none"><span>{displayDate}</span></div>
                </div>
            </div>
        </header>
    );
};

export default UniversalCardHeader;
