import React, { Suspense, useCallback, useMemo } from 'react';
// CACHE BUST SW: Evasió profunda de la catxé per a targeta indestructible.
import { useNavigate, useLocation } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useNavigation } from '../../context/NavigationContext';
import { useDesign } from '../../context/DesignContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, ImageIcon } from 'lucide-react';
import Avatar from '../Avatar';
import { Button } from '../../design-system/components/Button';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardMedia from './UniversalCard.Media';
import UniversalCardBody from './UniversalCard.Body';
import UniversalCardFooter from './UniversalCard.Footer';
import BlueprintOverlay from '../BlueprintOverlay';
import { logger } from '../../utils/logger';

import { normalizePostData } from '../../normalizers/post.normalizer';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cardVariants } from './UniversalCard.variants';
import './UniversalCard.css';



const FALLBACK_NANO_IMAGES = [
    "/assets/brain/generations/nano_llibre_memoria.png",
    "/assets/brain/generations/nano_fibra_espart.png",
    "/assets/brain/generations/nano_dron_agricola.png",
    "/assets/brain/generations/nano_mercat_llavors.png",
    "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
    "/assets/brain/generations/nano_porta_masia_1774197069297.png",
    "/assets/brain/generations/nano_rentonar_arquitectura_1774196001928.png",
    "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"
];

// Hook reactiu i net per a detectar ruta de xat
const useIsChatRoute = () => {
    const location = useLocation();
    return location.pathname.startsWith('/chats');
};

// Funció memoitzada i purament determinista per a imatges fallback
const getFallbackImage = (id) => {
    const strId = String(id || '1');
    let hash = 0;
    for (let i = 0; i < strId.length; i++) {
        hash = strId.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Usant exclusivament l'array local sense duplicacions fallides.
    const baseModulo = FALLBACK_NANO_IMAGES.length;
    const safeIndex = Math.abs(hash) % baseModulo;
    return FALLBACK_NANO_IMAGES[safeIndex];
};

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
    viewMode = "grid",
    onNavigate // DeepSeek Audit: Allow decoupled routing
}) => {
    const cardVariant = (variant === "post" && mode && mode !== "post") ? mode : (variant || mode);
    const { openViewer, openConnectionModal } = useModal();
    const { forensicMode: contextForensic } = useNavigation();
    const { gloveMode, seniorMode, hapticService } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const isMaster = isAdmin || user?.app_metadata?.role === 'master';
    const isChatRoute = useIsChatRoute();
    
    // MEMOITZACIÓ DE DADES DERIVADES
    const mediaList = useMemo(() => 
        images || item?.images || 
        (Array.isArray(item?.image_url) ? item.image_url : null) || 
        (Array.isArray(image) ? image : null),
        [images, item?.images, item?.image_url, image]
    );

    const displayImage = useMemo(() => {
        return image || item?.image_url || item?.image || 
               (mediaList ? mediaList[0] : null) ||
               getFallbackImage(item?.id || item?.uuid || title);
    }, [image, item?.image_url, item?.image, mediaList, item?.id, item?.uuid, title]);

    const displayTitle = useMemo(() => 
        title || item?.title || item?.name || "Sóc de Poble",
        [title, item?.title, item?.name]
    );

    const displayAuthor = useMemo(() => 
        avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble",
        [avatarName, item?.author_name, item?.author, item?.seller]
    );

    const displayExcerpt = useMemo(() => 
        excerpt || item?.description || item?.content || "",
        [excerpt, item?.description, item?.content]
    );

    const displayTown = useMemo(() => 
        subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes',
        [subtitle, item?.location?.town, item?.town_name]
    );

    const createdAtDate = useMemo(() => 
        item?.created_at ? new Date(item.created_at) : 
        (item?.date ? new Date(item.date) : null),
        [item]
    );

    const displayDate = useMemo(() => 
        createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda",
        [createdAtDate]
    );

    const displayTime = useMemo(() => 
        createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        (item?.metadata?.bategat_time || ""),
        [createdAtDate, item?.metadata?.bategat_time]
    );
    // Logica Isolada: Absorbeix si un poble o negoci és oficial en lloc de fer-ho pel cap de la UI.
    const isOfficial = useMemo(() => {
        const normalized = normalizePostData(item, { forcedOfficial });
        return normalized ? normalized.isOfficial : false;
    }, [item, forcedOfficial]);

    const isAlert = useMemo(() => 
        item?.category === 'Alert' || item?.type === 'alert' || 
        item?.is_alert || item?.category === 'Danger',
        [item?.category, item?.type, item?.is_alert]
    );

    const isSostenible = useMemo(() => 
        item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'),
        [item?.category, item?.tags]
    );

    const displayPrice = useMemo(() => 
        item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : ""),
        [item?.price, cardVariant]
    );

    // HANDLERS MEMOITZATS
    const handleCardClick = useCallback(() => {
        if (seniorMode && hapticService?.trigger) {
            hapticService.trigger('medium');
        }
        
        // DeepSeek Audit: Decoupled navigation priority
        if (onNavigate) {
            return onNavigate(item);
        }

        const id = item?.uuid || item?.id;
        if (item?.type === 'page' && item?.slug) {
            navigate(`/${item.slug}`);
        } else if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item, cardVariant, navigate, seniorMode, hapticService, onNavigate]);

    const handleConnectClick = useCallback(async (e) => {
        e.stopPropagation();
        const postId = item?.uuid || item?.id;
        if (!postId) {
            logger.error("[UniversalCard] No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        openConnectionModal({ 
            postId, 
            currentTags: item?.tags || [] 
        });
    }, [item?.uuid, item?.id, item?.tags, openConnectionModal]);

    const cardClasses = useMemo(() => {
        let activeVariant = 'post';
        if (isAlert) activeVariant = 'alert';
        else if (isOfficial) activeVariant = 'official';
        else if (isSostenible) activeVariant = 'sostenible';
        else activeVariant = cardVariant;

        return twMerge(
            clsx(
                cardVariants({
                    variant: activeVariant,
                    viewMode,
                    interactive: true,
                    seniorMode,
                    forensicMode: isForensic,
                    gloveMode,
                    isBating
                }),
                className,
                "universal-card" // Preserving identifier for backward compatibility with UniversalCard.css
            )
        );
    }, [cardVariant, viewMode, className, isBating, gloveMode, seniorMode, isOfficial, isAlert, isSostenible, isForensic]);

    const CardContent = (
        <article
            className={`${cardClasses} cursor-pointer`}
            onClick={handleCardClick}
            role="article"
            aria-label={displayTitle}
        >
            {viewMode === 'list' ? (
                <div className="flex flex-col w-full h-full">
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
                    <div className="flex items-center gap-4 p-4 w-full flex-grow">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={displayTitle}
                                className="w-24 h-24 object-cover rounded-[28px] hover:scale-110 transition-transform duration-500 flex-shrink-0"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-24 h-24 flex items-center justify-center rounded-[28px] bg-white/5 flex-shrink-0">
                                <ImageIcon size={20} className="text-gray-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0 pr-4 z-10">
                            <div className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide"><h4>{displayTitle}</h4></div>
                            <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide min-w-0 mt-1">
                                <div className="text-[var(--theme-accent-primary)] truncate"><span>{displayAuthor}</span></div>
                                <span className="shrink-0">•</span>
                                <div className="opacity-70 truncate"><span>{displayTown.replace("Poble Principal: ", "").trim()}</span></div>
                            </div>
                        </div>
                        {displayPrice && (
                            <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 rounded-[28px] flex-shrink-0 z-10">
                                <span>{displayPrice}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 z-0" aria-hidden="true"></div>
                    </div>
                    <div className="mt-auto">
                        <Suspense fallback={<div className="h-10 rounded bg-surface-var/30 animate-pulse w-full" role="status"><div className="sr-only"><span>Carregant peu...</span></div></div>}>
                            <UniversalCardFooter 
                                item={item}
                                cardVariant={cardVariant}
                                displayTitle={displayTitle}
                                isMaster={isMaster}
                                navigate={navigate}
                                handleConnectClick={handleConnectClick}
                                viewMode={viewMode}
                            />
                        </Suspense>
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
                    <Suspense fallback={<div className="h-16 mt-2 rounded bg-surface-var/30 animate-pulse w-full max-w-sm" role="status"><div className="sr-only"><span>Carregant contingut...</span></div></div>}>
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
                    </Suspense>
                    <Suspense fallback={<div className="h-10 mt-4 rounded bg-surface-var/30 animate-pulse w-[80%]" role="status"><div className="sr-only"><span>Carregant peu...</span></div></div>}>
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                            viewMode={viewMode}
                        />
                    </Suspense>
                </>
            )}
        </article>
    );

    const FinalCard = CardContent;

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${(cardVariant || 'POST').toUpperCase()} | R: 28PX`} color="cyan">
            {FinalCard}
        </BlueprintOverlay>
    ) : FinalCard;
};



const propsAreEqual = (prevProps, nextProps) => {
    const prevId = prevProps.item?.uuid || prevProps.item?.id;
    const nextId = nextProps.item?.uuid || nextProps.item?.id;
    
    return (
        prevId === nextId &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.item?.connections_count === nextProps.item?.connections_count &&
        prevProps.item?.comments_count === nextProps.item?.comments_count &&
        prevProps.onNavigate === nextProps.onNavigate &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating &&
        prevProps.className === nextProps.className &&
        prevProps.variant === nextProps.variant &&
        prevProps.mode === nextProps.mode &&
        prevProps.avatarSrc === nextProps.avatarSrc &&
        prevProps.image === nextProps.image &&
        prevProps.title === nextProps.title &&
        prevProps.subtitle === nextProps.subtitle &&
        prevProps.isOfficial === nextProps.isOfficial &&
        prevProps.forensicMode === nextProps.forensicMode
    );
};

const MemoizedCard = React.memo(UniversalCard, propsAreEqual);

MemoizedCard.Header = UniversalCardHeader;
MemoizedCard.Media = UniversalCardMedia;
MemoizedCard.Body = UniversalCardBody;
MemoizedCard.Footer = UniversalCardFooter;

export default MemoizedCard;
