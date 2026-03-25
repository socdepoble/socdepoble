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
    const FALLBACK_NANO_IMAGES = [
        "/assets/brain/generations/nano_llibre_memoria.png",
        "/assets/brain/generations/nano_fibra_espart.png",
        "/assets/brain/generations/nano_dron_agricola.png",
        "/assets/brain/generations/nano_mercat_llavors.png",
        "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
        "/assets/brain/generations/nano_porta_masia_1774197069297.png",
        "/assets/brain/generations/nano_rentonar_arquitectura_1774196001924.png",
        "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"
    ];

    const mediaList = React.useMemo(() => images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null), [images, item?.images, item?.image_url, image]);
    let displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    if (!displayImage) {
        const strId = String(item?.id || item?.uuid || title || item?.name || '1');
        let hash = 0;
        for (let i = 0; i < strId.length; i++) {
            hash = strId.charCodeAt(i) + ((hash << 5) - hash);
        }
        displayImage = FALLBACK_NANO_IMAGES[Math.abs(hash) % FALLBACK_NANO_IMAGES.length];
    }

    const displayTitle = title || item?.title || item?.name || "Sóc de Poble";
    const displayPrice = item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : "");
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const createdAtDate = item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null);
    const displayDate = createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda";
    const displayTime = createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || "");

    const isOfficial = forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles';
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
            style={{ cursor: 'pointer' }}
        >
            {viewMode === 'list' ? (
                <div className="card-list-layout h-24 flex items-center px-4 md:px-6 gap-4 hover:bg-white/[0.02] transition-colors relative isolate">
                    <div className="card-list-thumbnail flex-shrink-0 w-16 h-16 rounded-[20px] shadow-inner overflow-hidden border border-white/10 relative z-10">
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="w-full h-full object-cover rounded-[20px] hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/20">
                                <ImageIcon size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4 z-10">
                        <h4 className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide">{displayTitle}</h4>
                        <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide truncate mt-1">
                            <span className="text-[var(--theme-accent-primary)]">{displayAuthor}</span>
                            <span>•</span>
                            <span className="opacity-70">{displayTown.replace("Poble Principal:", "").trim()}</span>
                        </div>
                    </div>
                    
                    {displayPrice && (
                        <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-[28px] flex-shrink-0 z-10">
                            {displayPrice}
                        </div>
                    )}
                    
                    <button 
                        className="btn-connect-canonic shrink-0 ml-2 flex h-10 px-6 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] border border-white/10 rounded-full items-center justify-center gap-2 font-black text-[12px] text-slate-900 bg-[#F97316] tracking-wide transition-all z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConnectClick(e);
                        }}
                    >
                        CONNECTAR
                    </button>
                    
                    {/* Ghost hit area to ensure the background takes the hover safely */}
                    <div className="absolute inset-0 z-0"></div>
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

const normalizeClass = (cls) => (cls || '').split(' ').filter(Boolean).sort().join(' ');

const propsAreEqual = (prevProps, nextProps) => {
    const prevId = prevProps.item?.uuid || prevProps.item?.id;
    const nextId = nextProps.item?.uuid || nextProps.item?.id;
    return (
        prevId === nextId &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.item?.connections_count === nextProps.item?.connections_count &&
        prevProps.item?.comments_count === nextProps.item?.comments_count &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating &&
        normalizeClass(prevProps.className) === normalizeClass(nextProps.className) &&
        prevProps.variant === nextProps.variant &&
        prevProps.mode === nextProps.mode
    );
};

export default React.memo(UniversalCard, propsAreEqual);
