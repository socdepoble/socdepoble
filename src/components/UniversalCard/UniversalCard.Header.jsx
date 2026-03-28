import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import { Zap } from 'lucide-react';
import { Text } from '../../design-system/components/Typography/Text';

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

    return (
        <header 
            className={`card-header-boina h-16 ${isOfficial ? 'variant-official' : 'variant-standard'}`} 
            onClick={handleAuthorClick}
        >
            <div className="header-left flex items-center gap-3 flex-1 min-w-0 pr-2">
                <Avatar
                    src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                    name={displayAuthor}
                    role={avatarRole || item?.author_role}
                    size="md"
                    className="genesis-avatar shrink-0"
                />
                <div className="header-text flex flex-col justify-center flex-1 min-w-0 [&>*:last-child]:!mb-0 [&>*:first-child]:!mt-0">
                    <Text variant="secondary" as="h3" className="master-author-name leading-tight !text-on-accent !mb-1 truncate w-full" title={cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}>
                        {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                    </Text>
                    
                    {cardVariant === 'pobles' ? (
                        <Text variant="caption" className="location-text !font-normal !normal-case !tracking-normal !mt-0.5 truncate w-full" title={`De part de: ${displayAuthor}`}>
                            De part de: {displayAuthor}
                        </Text>
                    ) : (
                        displayTown && displayTown !== displayAuthor && (
                            <Text variant="caption" className="location-text !font-normal !normal-case !tracking-normal !mt-0.5 truncate w-full" title={displayTown.replace("Poble Principal:", "").trim()}>
                                {displayTown.replace("Poble Principal:", "").trim()}
                            </Text>
                        )
                    )}
                </div>
            </div>

            <div className="header-right-meta flex items-center gap-2">
                <div className="header-meta-details flex flex-col items-end justify-center leading-none">
                    {cardVariant !== 'pobles' && (
                        <div className="flex flex-col items-start mr-1">
                            <Text variant="caption" className="header-time !text-[11px] font-black !text-on-accent-muted tracking-tighter !mb-0.5">{displayTime}</Text>
                            <Text variant="caption" className="header-date !text-on-accent !text-[12px] font-black uppercase tracking-widest">{displayDate}</Text>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UniversalCardHeader;
