import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import { Zap, MapPin, MoreHorizontal, Sparkles } from 'lucide-react';
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

    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        const cleanTown = townName.replace("Poble Principal:", "").trim();
        if (cleanTown.includes("La Torre")) return "Gent de La Torre";
        return `Gent de ${cleanTown}`;
    };

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
            className="flex items-center justify-between px-4 py-2 h-[64px] bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white relative z-10 w-full font-sans transition-colors" 
            onClick={handleAuthorClick}
            role="button"
            tabIndex={0}
            aria-label={`Obrir perfil de ${displayAuthor}`}
        >
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-border-master overflow-hidden bg-theme-panel cursor-pointer active:scale-95 transition-all duration-300 ease-out flex items-center justify-center"
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
                    <h3 className="text-[#111111] dark:text-white font-sans text-[18px] font-black m-0 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis leading-tight flex items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity">
                        <span className="truncate lowercase first-letter:uppercase">{cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}</span>
                        {item?.is_iaia_inspired && (
                            <Sparkles size={14} className="text-[#111111] dark:text-[#F97316] shrink-0" fill="currentColor" />
                        )}
                        {isOfficial && (
                            <Zap size={14} className="text-[#111111] dark:text-[#38BDF8] drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_4px_#38BDF8] shrink-0" fill="currentColor" />
                        )}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {cardVariant !== 'pobles' && (
                            <span className="text-[14px] text-black/80 dark:text-white/80 font-bold">
                                {displayTime} - {displayDate}
                            </span>
                        )}
                        {(displayTown && displayTown !== displayAuthor && cardVariant !== 'pobles') && (
                            <>
                                <span className="text-black/80 dark:text-white/80">•</span>
                                <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 truncate font-bold w-full" title={displayTown.replace("Poble Principal:", "").trim()}>
                                    <MapPin size={12} className="shrink-0" />
                                    <span className="truncate">{displayTown.replace("Poble Principal:", "").trim()}</span>
                                </div>
                            </>
                        )}
                        {cardVariant === 'pobles' && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 truncate font-bold w-full" title={`De part de: ${displayAuthor}`}>
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate lowercase first-letter:uppercase">De part de: {displayAuthor}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-2">
                {isEventOrAgenda && (
                    <div className="bg-theme-panel px-2.5 py-1 rounded-[8px] border border-[#F97316]/50 shadow-[0_0_10px_rgba(249,115,22,0.15)] flex flex-col items-center justify-center">
                         <span className="text-[11px] font-black text-[#F97316] uppercase tracking-wider">
                             {t('card.agenda_tag') || 'Agenda'}
                         </span>
                    </div>
                )}
                
                <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 duration-300 ease-out shrink-0"
                    aria-label="Més opcions"
                >
                    <MoreHorizontal size={20} className="text-[#111111] dark:text-white/80" />
                </button>
            </div>
        </header>
    );
};

export default UniversalCardHeader;
