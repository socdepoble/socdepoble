> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/auditories_antigues_abril_2026/SUPER_PROMPT_AUDITORIA_UNIVERSALCARD.md`

---
title: SUPER PROMPT - Auditoría Extrema UniversalCard (Nivel Dios M3)
description: Prompt diseñado para alimentar a DeepSeek o Qwen con toda la arquitectura atómica de UniversalCard para buscar código fantasma, ineficiencias del DOM e inconsistencias del Design System M3 GEM Modern.
version: 1.0 (Post-Purga de Textos)
---

# INSTRUCCIONES PARA EL MODELO (DeepSeek / Qwen)

Actúa como un **Arquitecto de Sistemas Frontend de Nivel Dios** y **Experto Pericial en DOM/CSS**. 
Te presento el núcleo visual de nuestra plataforma "Sóc de Poble", llamado la suite `UniversalCard`. 

Acabamos de realizar una **purga atómica masiva**. La regla inquebrantable que rige este código ahora mismo (el "M3 GEM Modern CSS Policy") es:
1. **Clean Text DOM**: Las etiquetas semánticas de texto (`h1`-`h6`, `p`, `span`) **jamás** deben tener clases utilitarias de fuentes, pesos o tracking (ni `font-sans`, ni `text-xl`, ni `font-bold`).
2. **Delegación Estructural**: Todo el diseño, tipografías y `line-clamps` debe aplicarse a `div` contenedores o botones padre (que actúan como envolturas). El DOM resultante separa la semántica del layout.
3. **No Ghosts**: Cero contenedores `div` inútiles que no aporten estructura visual (`flex`, `grid`, `block`) lógica. Cero utilidades de Tailwind combinadas erróneamente (por ejemplo, meter un contenedor flex truncado sin gestionar el viewport interno apropiadamente).

## TU MISIÓN EXTREMA:
Quiero que analices el código que te adjunto a continuación **con la mentalidad de quien busca microrroturas en el chasis de un cohete espacial**. 
1. **Caza de Fantasmas:** Busca clases redundantes en los `className` de Tailwind (`!mt-0` innecesarios, superposiciones matemáticas de flexbox, min-widths huérfanos, divs sin ninguna función real escalable, clases en `UniversalCard.css` que ya no se usan en el JSX).
2. **Optimización Estructural:** Dime si hay formas de reducir la profundidad del DOM (DOM Tree Depth) sin romper la regla del "Clean Text DOM".
3. **Accesibilidad (a11y) y Reactividad:** Localiza cuellos de botella semánticos o eventos de clic ciegos / propagaciones mal aisladas.

Cero halagos. Si encuentras basura, dímelo directo. Sé quirúrgico y brutal con tu auditoría.

---

### [ARCHIVO: UniversalCard.variants.js]
```javascript
import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  `
    group flex flex-col w-full min-w-0 h-full relative
    rounded-[28px] overflow-hidden
    bg-[#000000] border-[1px] border-[#169CF9] text-[#FFFFFF]
    transition-colors duration-300 ease-in-out
    [.theme-light_&]:bg-[#FFFFFF] [.theme-light_&]:border-[#0e0e0e] [.theme-light_&]:text-[#0e0e0e]
  `,
  {
    variants: {
      viewMode: {
        grid: 'max-w-[480px] mx-auto md:mx-0 min-h-[500px]',
        list: 'max-w-full !rounded-[28px] border-b border-white/5 bg-transparent shadow-none hover:bg-white/5',
        masonry: 'inline-block w-full mb-6 break-inside-avoid',
        single: 'max-w-3xl border-none',
        compact: 'w-[140px] md:w-[180px] shrink-0',
      },
      variant: {
        post: '',
        mercat: 'border-[2px] border-[#F97316]',
        alert: 'border-red-500',
        official: 'border-[#169CF9]',
        sostenible: 'border-emerald-500'
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'select-text',
      },
      seniorMode: {
        true: 'border-[3px] text-lg',
        false: '',
      },
      forensicMode: {
        true: 'outline-2 outline-dashed outline-cyan-400',
        false: '',
      },
      gloveMode: {
        true: '',
        false: '',
      },
      isBating: {
        true: 'animate-bategat',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'post',
      viewMode: 'grid',
      interactive: true,
      seniorMode: false,
      gloveMode: false,
      forensicMode: false,
      isBating: false
    },
  }
);
```

### [ARCHIVO: UniversalCard/index.jsx]
```jsx
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

const useIsChatRoute = () => {
    const location = useLocation();
    return location.pathname.startsWith('/chats');
};

const getFallbackImage = (id) => {
    const strId = String(id || '1');
    let hash = 0;
    for (let i = 0; i < strId.length; i++) {
        hash = strId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const baseModulo = FALLBACK_NANO_IMAGES.length;
    const safeIndex = Math.abs(hash) % baseModulo;
    return FALLBACK_NANO_IMAGES[safeIndex];
};

const UniversalCard = ({
    item, title, subtitle, image, avatarSrc, avatarRole, avatarName, children, className = "",
    mode = "post", variant = "post", isBating = false, excerpt, images,
    isOfficial: forcedOfficial = false, forensicMode: forcedForensic = false, viewMode = "grid", onNavigate
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
    
    const mediaList = useMemo(() => images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null), [images, item?.images, item?.image_url, image]);
    const displayImage = useMemo(() => image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null) || getFallbackImage(item?.id || item?.uuid || title), [image, item?.image_url, item?.image, mediaList, item?.id, item?.uuid, title]);
    const displayTitle = useMemo(() => title || item?.title || item?.name || "Sóc de Poble", [title, item?.title, item?.name]);
    const displayAuthor = useMemo(() => avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble", [avatarName, item?.author_name, item?.author, item?.seller]);
    const displayExcerpt = useMemo(() => excerpt || item?.description || item?.content || "", [excerpt, item?.description, item?.content]);
    const displayTown = useMemo(() => subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes', [subtitle, item?.location?.town, item?.town_name]);
    
    const createdAtDate = useMemo(() => item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null), [item]);
    const displayDate = useMemo(() => createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda", [createdAtDate]);
    const displayTime = useMemo(() => createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || ""), [createdAtDate, item?.metadata?.bategat_time]);
    
    const isOfficial = useMemo(() => {
        const normalized = normalizePostData(item, { forcedOfficial });
        return normalized ? normalized.isOfficial : false;
    }, [item, forcedOfficial]);

    const isAlert = useMemo(() => item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert || item?.category === 'Danger', [item?.category, item?.type, item?.is_alert]);
    const isSostenible = useMemo(() => item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'), [item?.category, item?.tags]);
    const displayPrice = useMemo(() => item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : ""), [item?.price, cardVariant]);

    const handleCardClick = useCallback(() => {
        if (seniorMode && hapticService?.trigger) hapticService.trigger('medium');
        if (onNavigate) return onNavigate(item);
        const id = item?.uuid || item?.id;
        if (item?.type === 'page' && item?.slug) navigate(`/${item.slug}`);
        else if (cardVariant === 'pobles') navigate(`/pobles/${id}`);
        else if (cardVariant === 'mapa') navigate('/mapa');
        else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) navigate(`/mercat/${id}`);
        else if (id) navigate(`/post/${id}`);
    }, [item, cardVariant, navigate, seniorMode, hapticService, onNavigate]);

    const handleConnectClick = useCallback(async (e) => {
        e.stopPropagation();
        const postId = item?.uuid || item?.id;
        if (!postId) {
            logger.error("[UniversalCard] No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }
        openConnectionModal({ postId, currentTags: item?.tags || [] });
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
                    variant: activeVariant, viewMode, interactive: true, seniorMode, forensicMode: isForensic, gloveMode, isBating
                }),
                className,
                "universal-card" 
            )
        );
    }, [cardVariant, viewMode, className, isBating, gloveMode, seniorMode, isOfficial, isAlert, isSostenible, isForensic]);

    const CardContent = (
        <article className={`${cardClasses} cursor-pointer`} onClick={handleCardClick} role="article" aria-label={displayTitle}>
            {viewMode === 'list' ? (
                <div className="flex items-center gap-4 p-4 w-full">
                    {displayImage ? (
                        <img src={displayImage} alt={displayTitle} className="w-24 h-24 object-cover rounded-[28px] hover:scale-110 transition-transform duration-500 flex-shrink-0" loading="lazy" />
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
                        <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-[28px] flex-shrink-0 z-10">
                            <span>{displayPrice}</span>
                        </div>
                    )}
                    <Button intent="canonic" shape="pill" size="sm" className="shrink-0 ml-2 z-10" onClick={(e) => { e.stopPropagation(); handleConnectClick(e); }} aria-label="Connectar">
                        CONNECTAR
                    </Button>
                    <div className="absolute inset-0 z-0" aria-hidden="true"></div>
                </div>
            ) : (
                <>
                    <UniversalCardHeader item={item} cardVariant={cardVariant} displayTown={displayTown} displayAuthor={displayAuthor} avatarSrc={avatarSrc} avatarRole={avatarRole} isOfficial={isOfficial} displayDate={displayDate} displayTime={displayTime} />
                    <UniversalCardMedia item={item} cardVariant={cardVariant} mediaList={mediaList} displayImage={displayImage} displayTitle={displayTitle} openViewer={openViewer} navigate={navigate} />
                    <Suspense fallback={<div className="h-16 mt-2 rounded bg-surface-var/30 animate-pulse w-full max-w-sm" role="status"><div className="sr-only"><span>Carregant contingut...</span></div></div>}>
                        <UniversalCardBody displayTitle={displayTitle} displayExcerpt={displayExcerpt} item={item} isOfficial={isOfficial} children={children} navigate={navigate} cardVariant={cardVariant} displayPrice={displayPrice} />
                    </Suspense>
                    <Suspense fallback={<div className="h-10 mt-4 rounded bg-surface-var/30 animate-pulse w-[80%]" role="status"><div className="sr-only"><span>Carregant peu...</span></div></div>}>
                        <UniversalCardFooter item={item} cardVariant={cardVariant} displayTitle={displayTitle} displayExcerpt={displayExcerpt} isMaster={isMaster} navigate={navigate} handleConnectClick={handleConnectClick} />
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

const propsAreEqual = (prevProps, nextProps) => { /* Comparativa Memo extensa */ return true; }; // Simplificado para ahorrar tokens
const MemoizedCard = React.memo(UniversalCard, propsAreEqual);
MemoizedCard.Header = UniversalCardHeader;
MemoizedCard.Media = UniversalCardMedia;
MemoizedCard.Body = UniversalCardBody;
MemoizedCard.Footer = UniversalCardFooter;
export default MemoizedCard;
```

### [ARCHIVO: UniversalCard.Header.jsx]
```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import { Zap, MapPin, MoreHorizontal, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UniversalCardHeader = ({ item, cardVariant, displayTown, displayAuthor, avatarSrc, avatarRole, isOfficial, displayDate, displayTime }) => {
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
        if (cardVariant === 'pobles') {
            const townId = item?.towns?.id || item?.town_id;
            if (townId) navigate(`/pobles/${townId}`); else navigate('/pobles');
            return;
        }
        const authorId = item?.author_user_id || item?.author_id || item?.user_id;
        const entityId = item?.author_entity_id;
        const authorName = item?.author_name || item?.author || displayAuthor;

        if (entityId) navigate(`/entitat/${entityId}`);
        else if (authorId) navigate(`/perfil/${authorId}`);
        else if (authorName) {
            const slug = authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            navigate(`/perfil/${slug}`);
        }
    };

    const finalAvatarSrc = avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url;
    const finalAvatarRole = avatarRole || item?.author_role;

    return (
        <header className="flex items-center justify-between px-4 py-2 h-[64px] bg-[#F97316] text-[#111111] dark:bg-[#4F46E5] dark:text-white relative z-10 w-full transition-colors" onClick={handleAuthorClick} role="button" tabIndex={0} aria-label={`Obrir perfil de ${displayAuthor}`}>
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border-master overflow-hidden bg-theme-panel cursor-pointer active:scale-95 transition-all duration-300 ease-out flex items-center justify-center" onClick={(e) => { e.stopPropagation(); if (finalAvatarRole === 'master') navigate('/iaia'); }}>
                    <Avatar name={displayAuthor} src={finalAvatarSrc} role={finalAvatarRole} size="md" />
                </div>
                
                <div className="flex flex-col min-w-0">
                    <div className="text-[#111111] dark:text-white text-[18px] font-black tracking-wide leading-tight flex items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity">
                        <div className="truncate lowercase first-letter:uppercase"><span>{cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}</span></div>
                        {item?.is_iaia_inspired && <Sparkles size={14} className="text-[#111111] dark:text-[#F97316] shrink-0" fill="currentColor" />}
                        {isOfficial && <Zap size={14} className="text-[#111111] dark:text-[#38BDF8] drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_4px_#38BDF8] shrink-0" fill="currentColor" />}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5 min-w-0">
                        {cardVariant !== 'pobles' && (
                            <div className="text-[14px] text-black/80 dark:text-white/80 font-bold">
                                <span>{displayTime} - {displayDate}</span>
                            </div>
                        )}
                        {(displayTown && displayTown !== displayAuthor && cardVariant !== 'pobles') && (
                            <>
                                <div className="text-black/80 dark:text-white/80 shrink-0"><span>•</span></div>
                                <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold" title={displayTown.replace("Poble Principal:", "").trim()}>
                                    <MapPin size={12} className="shrink-0" />
                                    <div className="truncate"><span>{displayTown.replace("Poble Principal:", "").trim()}</span></div>
                                </div>
                            </>
                        )}
                        {cardVariant === 'pobles' && (
                            <div className="flex items-center gap-1 text-[14px] text-black/80 dark:text-white/80 min-w-0 font-bold" title={`De part de: ${displayAuthor}`}>
                                <MapPin size={12} className="shrink-0" />
                                <div className="truncate lowercase first-letter:uppercase"><span>De part de: {displayAuthor}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-2">
                {isEventOrAgenda && (
                    <div className="bg-theme-panel px-2.5 py-1 rounded-[8px] border border-[#F97316]/50 shadow-[0_0_10px_rgba(249,115,22,0.15)] flex flex-col items-center justify-center">
                         <div className="text-[11px] font-black text-[#F97316] uppercase tracking-wider">
                             <span>{t('card.agenda_tag') || 'Agenda'}</span>
                         </div>
                    </div>
                )}
                
                <button onClick={(e) => e.stopPropagation()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 duration-300 ease-out shrink-0" aria-label="Més opcions">
                    <MoreHorizontal size={20} className="text-[#111111] dark:text-white/80" />
                </button>
            </div>
        </header>
    );
};
export default UniversalCardHeader;
```

### [ARCHIVO: UniversalCard.Body.jsx]
```jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button';

const UniversalCardBody = React.memo(({ displayTitle, displayExcerpt, item, children, navigate, cardVariant, displayPrice }) => {
    const hasTags = item?.tags && item.tags.length > 0;
    let smartClampClass = hasTags ? 'line-clamp-2' : 'line-clamp-4';

    const handleReadMoreClick = React.useCallback((e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') navigate(`/pobles/${id}`);
        else if (cardVariant === 'mercat' || cardVariant === 'market') navigate(`/mercat/${id}`);
        else navigate(`/post/${id}`);
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    return (
        <div className="flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div className="flex flex-col flex-1 min-h-0 px-5 pt-3 pb-4 overflow-hidden cursor-pointer group" onClick={handleReadMoreClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleReadMoreClick(e); } }} role="button" tabIndex={0} aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}>
                <div className="flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity">
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <div className="text-xl md:text-[22px] leading-tight font-black tracking-tight line-clamp-2 text-theme-text">
                                <span>{displayTitle}</span>
                            </div>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <div className="whitespace-nowrap font-black text-[18px] text-[#F97316] shrink-0"><span>{displayPrice}</span></div>
                        )}
                    </div>
                    {(() => {
                        const subtitleText = item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : ''));
                        if (!subtitleText) return null;
                        return (
                            <div className="font-semibold text-[#F97316] text-[14px] leading-snug truncate w-full">
                                <span>{subtitleText}</span>
                            </div>
                        );
                    })()}
                </div>

                <div className="flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-2">
                    {displayExcerpt && (
                        <div className={`text-[15px] font-normal leading-[1.6] text-theme-muted ${smartClampClass}`}>
                            <p>{displayExcerpt}</p>
                        </div>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && (
                    <Button intent="ghost" fullWidth className="py-2.5 font-bold uppercase tracking-widest text-[#F97316] hover:bg-[#F97316]/10 active:scale-100 rounded-none border-t border-border-master" aria-label={`Llegir més sobre ${item.title || "aquest post"}`} onClick={handleReadMoreClick} rightIcon={<ChevronRight size={18} className="mt-[1px]" />}>
                        Llegir més
                    </Button>
                )}
                {hasTags && (
                    <div className="w-full flex justify-start items-center gap-2 px-5 pb-4 pt-1 flex-wrap">
                         {item.tags.slice(0, 3).map((tag) => {
                             const cleanTagStr = tag.replace(/^#+/, '');
                             return (
                                 <div key={cleanTagStr} className="text-[12px] font-black uppercase tracking-wider text-theme-muted bg-theme-base px-2.5 py-1 rounded-[6px] border border-border-master">
                                     <span>#{cleanTagStr}</span>
                                 </div>
                             )
                         })}
                         {item.tags.length > 3 && (
                             <div title={item.tags.slice(3).join(', ')} className="text-[12px] font-black uppercase tracking-wider text-theme-muted/50 cursor-default">
                                 <span>+{item.tags.length - 3}</span>
                             </div>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
});
UniversalCardBody.displayName = 'UniversalCardBody';
export default UniversalCardBody;
```

### [ARCHIVO: UniversalCard.Footer.jsx]
```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Share2, MoreHorizontal, MessageCircle, Globe, BookOpen } from 'lucide-react';

const UniversalCardFooter = ({ item, cardVariant, displayTitle, isMaster, navigate, handleConnectClick, itemCount, itemCountLabel }) => {
    const { t } = useTranslation();

    let buttonText = t('card.connect', "CONNECTAR");
    let icon = <Plus size={14} className="drop-shadow-sm" strokeWidth={3}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') buttonText = t('card.connect', "CONNECTAR");
    else if (cardVariant === 'pobles') buttonText = t('card.visit', "VISITAR");
    else if (item?.type === 'tramit') buttonText = t('card.tramitar', "TRAMITAR");

    const handleShareClick = (e) => {
        if (e) e.stopPropagation();
        if (navigator.share) {
            navigator.share({ title: displayTitle || 'Sóc de Poble', text: t('card.shareText', "Fes un cop d'ull a això!"), url: window.location.href })
            .catch((error) => console.log('Err sharing', error));
        }
    }

    const handleCommentClick = (e) => {
        if (e) e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (cardVariant === 'mercat' || cardVariant === 'market') navigate(`/mercat/${id}?action=comment`);
        else navigate(`/post/${id}?action=comment`);
    };

    const handleTranslateClick = (e) => {
        if (e) e.stopPropagation();
        const id = item?.uuid || item?.id;
        window.dispatchEvent(new CustomEvent('omega-translate-request', { detail: { postId: id, title: displayTitle } }));
        alert(t('card.translateAlert', "🌐 Motor de Traducció A Demanda prompte disponible."));
    };

    const isCalendar = cardVariant === 'calendar' || item?.type === 'calendar';

    return (
        <div className="flex items-center justify-center gap-3 sm:gap-6 w-full min-h-[48px] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] px-4 shadow-sm overflow-x-auto no-scrollbar transition-colors">
            <button className="flex items-center justify-center gap-1.5 rounded-full bg-[#F97316] text-white dark:bg-[#4F46E5] dark:text-white px-4 py-1.5 text-xs font-bold tracking-wide transition-opacity active:scale-95 touch-manipulation whitespace-nowrap shrink-0 shadow-md" onClick={handleConnectClick}>
                {icon}
                <div className="truncate"><span>{buttonText}</span></div>
            </button>

            {itemCount !== undefined && (
                <div className="flex items-center justify-center bg-black/20 rounded-full px-3 py-1.5 shrink-0">
                    <div className="text-[11px] font-black tracking-widest text-white dark:text-[#111111] leading-none flex items-center">
                        <span>{itemCount}</span> <div className="text-white/70 dark:text-black/80 font-bold ml-1"><span>{itemCountLabel || 'ITEMS'}</span></div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-extrabold uppercase tracking-widest shrink-0">
                {!isCalendar && (
                    <button className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" onClick={handleTranslateClick} aria-label={t('card.translate', "Traduir")}>
                        <Globe size={16} strokeWidth={2.5} />
                        <div className="hidden sm:block"><span>{t('card.translate', "TRADUIR")}</span></div>
                    </button>
                )}
                <button className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" onClick={handleCommentClick} aria-label={t('card.comment', "Comentar")}>
                    <MessageCircle size={16} strokeWidth={2.5} />
                    <div className="hidden sm:block"><span>{t('card.comment', "COMENTAR")}</span></div>
                </button>
                <button className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/20 dark:hover:bg-black/10 rounded transition-colors active:scale-95 whitespace-nowrap shrink-0" onClick={handleShareClick} aria-label={t('card.share', "Compartir")}>
                    <Share2 size={16} strokeWidth={2.5} />
                    <div className="hidden sm:block"><span>{t('card.share', "COMPARTIR")}</span></div>
                </button>
            </div>
        </div>
    );
};
export default UniversalCardFooter;
```

### [ARCHIVO: UniversalCard.Media.jsx]
```jsx
// (Código base Media con soporte watermark e imagen Skeleton omitido por brevedad en la auditoría, 
// pero enfocado primariamente en contenedores Absolute/Relative)
```

### [ARCHIVO: UniversalCard.css] (¡ATENCIÓN: CÓDIGO VIEJO!)
```css
/* Este archivo CSS contiene utilidades antiguas de la versión V11 que probamente sean BASURA RESIDUAL. 
   Identifica si hay selectores aquí (.card-header-boina, .genesis-title) que ya no se usan en el código React e instruye su eliminación */
/* TALLA I ESTRUCTURA BÀSICA */
.card-header-boina { display: flex; align-items: center; justify-content: space-between; min-height: 64px; }
.header-text { display: flex; flex-direction: column; min-width: 0; }
.master-author-name { font-family: var(--font-primary), monospace; font-size: 16px; margin: 0; }
.genesis-title { font-family: var(--font-display), sans-serif; font-size: 20px; font-weight: 950; margin: 0; }
.card-excerpt { font-size: 15px; margin: 0; opacity: 0.85; }
```


## SALIDA ESPERADA:
Devuélveme un informe brutal punto por punto. Si todo está nivel Dios, confírmalo. Si encuentras un `div` anidado que sobrecarga el árbol DOM innecesariamente, o una clase de CSS que pueda romper la responsividad, o estilos huérfanos en `UniversalCard.css`, ordéname cómo aniquilarlos.
