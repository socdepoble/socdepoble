import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { Zap } from 'lucide-react';

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

        if (entityId) {
            navigate(`/entitat/${entityId}`);
        } else if (authorId) {
            navigate(`/perfil/${authorId}`);
        }
    };

    return (
        <header 
            className={`card-header-boina h-16 ${isOfficial ? 'variant-official' : 'variant-standard'}`} 
            onClick={handleAuthorClick}
        >
            <div className="header-left flex items-center gap-3">
                <Avatar
                    src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                    name={displayAuthor}
                    role={avatarRole || item?.author_role}
                    size="md"
                    className="genesis-avatar"
                />
                <div className="header-text flex flex-col justify-center">
                    <h3 className="master-author-name leading-tight text-on-accent">
                        {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                    </h3>
                    
                    {cardVariant === 'pobles' ? (
                        <div className="location-text text-on-accent-muted mt-0.5">
                            De part de: {displayAuthor}
                        </div>
                    ) : (
                        !isOfficial && displayTown && displayTown !== displayAuthor && (
                            <div className="location-text text-on-accent-muted">
                                {displayTown.replace("Poble Principal:", "").trim()}
                            </div>
                        )
                    )}
                    
                    {isOfficial && (
                         <div className="location-text text-on-accent-muted">SÓC DE POBLE OFICIAL</div>
                    )}
                </div>
            </div>

            <div className="header-right-meta flex items-center gap-2">
                <div className="header-meta-details flex flex-col items-end justify-center leading-none">
                    {cardVariant !== 'pobles' && (
                        <div className="flex flex-col items-end">
                            <span className="header-date text-on-accent text-[12px] font-black">{displayDate}</span>
                            <span className="header-time text-[11px] font-black uppercase text-on-accent-muted tracking-tighter">{displayTime}</span>
                        </div>
                    )}
                    {(item?.is_pinned || item?.metadata?.is_pinned) && (
                        <Zap size={14} fill="currentColor" className="text-white mt-1 zap-celestial" />
                    )}
                </div>
            </div>
        </header>
    );
};

export default UniversalCardHeader;
