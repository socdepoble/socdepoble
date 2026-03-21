import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useNavigation } from '../context/NavigationContext';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';


import { Calendar, Plus, ImageIcon } from 'lucide-react';
import Avatar from './Avatar';

import UniversalCardHeader from './UniversalCardHeader';
import UniversalCardMedia from './UniversalCardMedia';
import UniversalCardBody from './UniversalCardBody';
import UniversalCardFooter from './UniversalCardFooter';
import BlueprintOverlay from './BlueprintOverlay';
import './UniversalCard.css';


/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM] - REFACTORED
 * ---------------------------------------
 * DIRECTIVA SUPREMA: Aquest component és la unitat atòmica del Gènesi.
 * Estructura dividida en Base, Header, Media, Body, i Footer 
 * per complir el "Single Responsibility Principle".
 */
const UniversalCard = ({
    item,
    title,
    subtitle,
    image,
    avatarSrc,
    avatarRole,
    avatarName,
    children,
    className = "",
    mode = "post", 
    variant = "post",
    isBating = false,
    excerpt,
    images,
    isOfficial: forcedOfficial = false,
    forensicMode: forcedForensic = false,
    viewMode = "grid"
}) => {

    const cardVariant = variant || mode;
    const { openViewer } = useModal();
    const { forensicMode: contextForensic } = useNavigation();

    const { gloveMode } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const isMaster = isAdmin || user?.app_metadata?.role === 'master';

    // MULTIMEDIA RESOLUTION
    const mediaList = React.useMemo(() => images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null), [images, item?.images, item?.image_url, image]);
    const displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    const displayTitle = title || item?.title || "Sóc de Poble";
    const displayPrice = item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : "");
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const createdAtDate = item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null);
    const displayDate = createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda";
    const displayTime = createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || "");

    const isOfficial = React.useMemo(() => forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles', [forcedOfficial, item?.author_role, item?.type, item?.official, cardVariant]);
    const isAlert = React.useMemo(() => item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert || item?.category === 'Danger', [item?.category, item?.type, item?.is_alert]);
    const isSostenible = React.useMemo(() => item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'), [item?.category, item?.tags]);

    const handleCardClick = React.useCallback(() => {
        const id = item?.uuid || item?.id;
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const handleConnectClick = React.useCallback(async (e) => {
        e.stopPropagation();

        const postId = item?.uuid || item?.id;
        if (!postId) {
            console.error("No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        // [ESCAPARATE PATTERN DOCTRINE] All direct connection clicks on feeds must route to the item detail to avoid accidental inputs
        // The detailed view handles the actual connection/save/tagging
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${postId}?action=connect`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${postId}?action=connect`);
        } else {
            navigate(`/post/${postId}?action=connect`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const CardContent = (
        <article
            className={`universal-card card-variant-${cardVariant} view-mode-${viewMode} ${className} relative w-full rounded-[28px] overflow-hidden bg-theme-panel shadow-2xl border border-white/5 flex flex-col transition-all duration-500 hover:shadow-black/50 ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'category-danger alert-active' : ''} ${isSostenible ? 'category-sostenible' : ''} ${isForensic ? 'mode-forense-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: (cardVariant === 'pobles' || cardVariant === 'event' || cardVariant === 'mapa') ? 'pointer' : 'default' }}
        >
            {viewMode === 'list' ? (
                <div className="card-list-layout h-20 flex items-center px-4 gap-3">
                    <Avatar
                        src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                        name={displayAuthor}
                        role={avatarRole || item?.author_role}
                        size="sm"
                        className="flex-shrink-0"
                    />
                    
                    <div className="card-list-thumbnail flex-shrink-0 w-12 h-12 rounded-[28px] overflow-hidden bg-white/10 border border-white/5">
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <ImageIcon size={16} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <button 
                            className="btn-connect-canonic"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConnectClick(e);
                            }}
                        >
                            <Calendar size={18} className="opacity-80"/> CONNECTAR
                        </button>
                        <div className="flex items-center gap-2 text-[14px] font-bold text-gray-600 uppercase tracking-widest truncate mt-1">
                            <span>{displayAuthor}</span>
                            <span>•</span>
                            <span>{displayTown.replace("Poble Principal:", "").trim()}</span>
                        </div>
                    </div>
                    {displayPrice && (
                        <div className="text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-[28px] flex-shrink-0">
                            {displayPrice}
                        </div>
                    )}
                    <div className="flex items-center gap-1 flex-shrink-0">
                         <button className="p-2 text-white/40 hover:text-white" onClick={handleConnectClick}>
                            <Plus size={18} />
                         </button>
                    </div>
                </div>
            ) : (
                <>
                    <UniversalCardHeader 
                        item={item}
                        cardVariant={cardVariant}
                        displayTown={displayTown}
                        displayAuthor={displayAuthor}
                        avatarSrc={avatarSrc}
                        avatarRole={avatarRole}
                        isOfficial={isOfficial}
                        displayDate={displayDate}
                        displayTime={displayTime}
                    />

                    <UniversalCardMedia 
                        item={item}
                        cardVariant={cardVariant}
                        mediaList={mediaList}
                        displayImage={displayImage}
                        displayTitle={displayTitle}
                        openViewer={openViewer}
                        navigate={navigate}
                    />

                    <UniversalCardBody 
                        displayTitle={displayTitle}
                        displayExcerpt={displayExcerpt}
                        item={item}
                        isOfficial={isOfficial}
                        children={children}
                        navigate={navigate}
                        cardVariant={cardVariant}
                        displayPrice={displayPrice}
                    />

                    <UniversalCardFooter 
                        item={item}
                        cardVariant={cardVariant}
                        displayTitle={displayTitle}
                        displayExcerpt={displayExcerpt}
                        isMaster={isMaster}
                        navigate={navigate}
                        handleConnectClick={handleConnectClick}
                    />
                </>
            )}
        </article>
    );

    // Avoid useLocation hook to prevent re-renders when local routing changes (improves feed performance)
    const isChatRoute = typeof window !== 'undefined' ? window.location.pathname.startsWith('/chats') : false;

    const FinalCard = (
        <div className="min-w-0 w-full">
            {CardContent}
        </div>
    );

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${cardVariant.toUpperCase()} | R: 28PX`} color="cyan">
            {FinalCard}
        </BlueprintOverlay>
    ) : FinalCard;
};

const propsAreEqual = (prevProps, nextProps) => {
    return (
        prevProps.item?.uuid === nextProps.item?.uuid &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating
    );
};

export default React.memo(UniversalCard, propsAreEqual);
