import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
// CACHE BUST SW: Evasió profunda de la catxé per a targeta indestructible.
import { useNavigate, useLocation } from 'react-router-dom';
import { useModal } from '../../../app/context/ModalContext';
import { useNavigation } from '../../../app/context/NavigationContext';
import { useDesign } from '../../../app/context/DesignContext';
import { useAuth } from '../../../app/context/AuthContext';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardMedia from './UniversalCard.Media';
import UniversalCardBody from './UniversalCard.Body';
import UniversalCardFooter from './UniversalCard.Footer';
import BlueprintOverlay from '../../ui/BlueprintOverlay';

import PedraPanel from '../PedraPanel';
import { normalizePostData } from '../../../normalizers/post.normalizer';
import { resolveImageUrl } from '../../../utils/urlHelper';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cardVariants } from './UniversalCard.variants';
import { useCardTranslation } from '../../../hooks/useCardTranslation';
import './UniversalCard.css';



const FALLBACK_NANO_IMAGES = [
    "/uploads/avatars/nano_llibre_memoria.png",
    "/uploads/avatars/nano_fibra_espart.png",
    "/uploads/avatars/nano_dron_agricola.png",
    "/assets/events/nano_mercat_llavors.png",
    "/uploads/places/nano_palau_comtal_1774195484197.png",
    "/uploads/places/nano_porta_masia_1774197069297.png",
    "/uploads/brain/generations/nano_rentonar_arquitectura_1774196001928.png",
    "/assets/events/nano_socis_tecnologics_1774235328704.png"
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

const UniversalCardInner = ({
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
    onNavigate,
    // Injectat des de Wrapper para evitar Context Cascades
    gloveMode = false,
    seniorMode = false,
    hapticService,
    contextForensic = false,
    isAdmin = false,
    user,
    openViewer, // del ModalContext
    infoText, // Permetre infoText explícit
    aspectMode = 'auto', // Default a 'auto' para respetar imágenes horizontales por defecto
    forceEditOption = false
}) => {
    const cardVariant = (variant === "post" && mode && mode !== "post") ? mode : (variant || mode);
    const isForensic = forcedForensic || contextForensic;
    const navigate = useNavigate();
    const isMaster = isAdmin || user?.app_metadata?.role === 'master' || forceEditOption;
    const isChatRoute = useIsChatRoute();
    const isMarket = cardVariant === 'market' || cardVariant === 'mercat' || cardVariant === 'product';
    const computedAspectMode = 'square';
    
    // MEMOITZACIÓ DE DADES DERIVADES
    const mediaList = useMemo(() => {
        let list = images || item?.images || 
                   (Array.isArray(item?.image_url) ? item.image_url : null) || 
                   (Array.isArray(image) ? image : null);
                   
        if (!list) {
            const singleImg = image || item?.image_url || item?.image || item?.seo_image || item?.header_image_url || item?.logo_url || item?.avatar_url;
            if (typeof singleImg === 'string' && singleImg.trim() !== '') list = [singleImg];
        }

        if (Array.isArray(list)) {
            // Eliminar duplicats (Set no manté l'ordre a vegades, pero aci amb strings és segur)
            const uniqueList = [...new Set(list)];
            // Resoldre cada url de la llista usant urlHelper
            return uniqueList.map(img => resolveImageUrl(img));
        }
        return null;
    }, [images, item, image]);

    // INFO TEXT I ICONES (suport per a emojis, pin, alertes...)
    const finalInfoText = infoText || item?.info_text || item?.infoText;

    const displayImage = useMemo(() => {
        const rawUrl = (mediaList && mediaList.length > 0) ? mediaList[0] : getFallbackImage(item?.id || item?.uuid || title);
        return resolveImageUrl(rawUrl);
    }, [mediaList, item?.id, item?.uuid, title]);

    const baseTitle = useMemo(() => 
        title || item?.title || item?.name || "Sóc de Poble",
        [title, item?.title, item?.name]
    );

    const isAjuntament = item?.type === 'ajuntament' || item?.author_type === 'ajuntament';

    // Logica Isolada: Absorbeix si un poble o negoci és oficial en lloc de fer-ho pel cap de la UI.
    const isOfficial = useMemo(() => {
        const normalized = normalizePostData(item, { forcedOfficial });
        return normalized ? normalized.isOfficial : false;
    }, [item, forcedOfficial]);

    const displayAuthor = useMemo(() => {
        let author = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
        if (isAjuntament) {
            if (!author.toLowerCase().includes('ajuntament')) {
                return `Ajuntament de ${item?.town_name || 'Desconegut'}`;
            }
            return author;
        }
        if (isOfficial && author !== "Sóc de Poble" && author !== "Javi Llinares" && author !== "Javi Llinares (Sóc de Poble)") return "El Cronista";
        if (isBating) return "Batecs del Poble";
        return author;
    }, [isOfficial, isBating, avatarName, item?.author_name, item?.author, item?.seller, isAjuntament, item?.town_name]);

    const baseExcerpt = useMemo(() => 
        excerpt || item?.description || item?.content || "",
        [excerpt, item?.description, item?.content]
    );

    const cardId = item?.id || item?.uuid || baseTitle;
    const { translatedTitle, translatedExcerpt, isTranslating } = useCardTranslation(cardId, baseTitle, baseExcerpt);

    const displayTitle = translatedTitle || baseTitle;
    const displayExcerpt = translatedExcerpt || baseExcerpt;

    const displayTown = useMemo(() => {
        if (isAjuntament) {
            return item?.comarca || "L'Alacantí";
        }
        return subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    }, [subtitle, item?.location?.town, item?.town_name, isAjuntament, item?.comarca]);

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

        const id = item?.uuid || item?.id;
        if (item?.type === 'page' && item?.slug) {
            if (['el-projecte', 'manual', 'arxiu', 'projecte', 'manifest', 'skills'].includes(item.slug)) {
                navigate(`/${item.slug}`);
            } else {
                navigate(`/page/${item.slug}`);
            }
        } else if (cardVariant === 'pobles') {
            if (onNavigate) {
                onNavigate();
            } else {
                navigate(`/pobles/${id}`);
            }
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
        const id = item?.uuid || item?.id;
        if (id) {
            navigate(`/connectar?item_id=${id}&variant=${cardVariant}`);
        } else {
            handleCardClick(e);
        }
    }, [item, cardVariant, navigate, handleCardClick]);

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

    const itemTypeUrl = useMemo(() => {
        switch (cardVariant) {
            case 'mercat':
            case 'market':
                return 'https://schema.org/Product';
            case 'agent':
            case 'user':
                return 'https://schema.org/Person';
            case 'pobles':
                return 'https://schema.org/Place';
            case 'post':
            default:
                return 'https://schema.org/SocialMediaPosting';
        }
    }, [cardVariant]);

    const CardContent = (
        <PedraPanel 
            className={`${cardClasses} h-full universal-card-wrapper cursor-pointer relative group`}
            aria-label={displayTitle}
            itemScope
            itemType={itemTypeUrl}
            data-post-id={item?.id || item?.uuid || baseTitle}
        >
            <div className="w-full h-full flex-auto relative flex flex-col">
            {viewMode === 'list' ? (
                <div className="flex flex-col w-full flex-auto">
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
                        infoText={finalInfoText}
                    />
                    <div className="flex items-stretch gap-4 p-4 w-full flex-grow">
                        <div className="flex-shrink-0">
                            {displayImage ? (
                                <img
                                    src={displayImage}
                                    alt={displayTitle}
                                    className={`w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-[length:var(--sp-radius-mestre,28px)] hover:scale-110 transition-transform duration-500 ${cardVariant === 'agent' ? 'object-contain bg-white p-2' : 'object-cover'}`}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] flex items-center justify-center rounded-[length:var(--sp-radius-mestre,28px)] bg-white/5">
                                    <ImageIcon size={32} className="text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 z-10 -m-4 flex flex-col">
                            <UniversalCardBody 
                                displayTitle={displayTitle}
                                displayExcerpt={displayExcerpt}
                                item={item}
                                isOfficial={isOfficial}
                                children={children}
                                navigate={navigate}
                                handleCardClick={handleCardClick}
                                cardVariant={cardVariant}
                                displayPrice={displayPrice}
                                viewMode={viewMode}
                            />
                        </div>
                        <div className="absolute inset-0 z-0" aria-hidden="true"></div>
                    </div>
                    <div className="mt-auto">
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                            handleCardClick={handleCardClick}
                            viewMode={viewMode}
                        />
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
                        infoText={finalInfoText}
                    />
                    <div className="-mt-[1px]">
                        <UniversalCardMedia 
                            item={item}
                            cardVariant={cardVariant}
                            mediaList={mediaList}
                            displayImage={displayImage}
                            displayTitle={displayTitle}
                            openViewer={openViewer}
                            navigate={navigate}
                            aspectMode={computedAspectMode}
                        />
                    </div>
                    <div className="flex flex-col w-full flex-auto relative z-30">
                        <UniversalCardBody 
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            item={item}
                            isOfficial={isOfficial}
                            children={children}
                            navigate={navigate}
                            handleCardClick={handleCardClick}
                            cardVariant={cardVariant}
                            displayPrice={displayPrice}
                            viewMode={viewMode}
                        />
                    </div>
                    <div className="relative z-40 mt-auto">
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                            handleCardClick={handleCardClick}
                            viewMode={viewMode}
                        />
                    </div>
                </>
            )}
            </div>
        </PedraPanel>
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
        prevProps.forensicMode === nextProps.forensicMode &&
        prevProps.gloveMode === nextProps.gloveMode &&
        prevProps.seniorMode === nextProps.seniorMode &&
        prevProps.isAdmin === nextProps.isAdmin &&
        prevProps.forceEditOption === nextProps.forceEditOption
    );
};

const MemoizedCardInner = React.memo(UniversalCardInner, propsAreEqual);

const UniversalCardParamsWrapper = (props) => {
    const { openViewer } = useModal();
    const { forensicMode: contextForensic } = useNavigation();
    const { gloveMode, seniorMode, hapticService } = useDesign();
    const { isAdmin, user } = useAuth();

    const isEcommerceEnabled = localStorage.getItem('GLOBAL_ECOMMERCE_ENABLED') !== 'false';
    const itemWithEcommerceState = React.useMemo(() => {
        if (!props.item) return props.item;
        return {
            ...props.item,
            is_store_disabled: props.item.is_store_disabled || !isEcommerceEnabled
        };
    }, [props.item, isEcommerceEnabled]);

    return (
        <MemoizedCardInner 
            {...props} 
            item={itemWithEcommerceState}
            openViewer={openViewer}
            contextForensic={contextForensic}
            gloveMode={gloveMode}
            seniorMode={seniorMode}
            hapticService={hapticService}
            isAdmin={isAdmin}
            user={user}
            forceEditOption={props.forceEditOption}
        />
    );
};

UniversalCardParamsWrapper.Header = UniversalCardHeader;
UniversalCardParamsWrapper.Media = UniversalCardMedia;
UniversalCardParamsWrapper.Body = UniversalCardBody;
UniversalCardParamsWrapper.Footer = UniversalCardFooter;

export default UniversalCardParamsWrapper;
