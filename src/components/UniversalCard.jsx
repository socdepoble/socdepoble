import React, { useState } from 'react';
import { MoreHorizontal, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles, Edit, Trash2, Plus, FileText, ChevronRight, UserPlus, MapPin, Landmark, Image as ImageIcon, ScanLine, Ruler, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModal } from '../context/ModalContext';
import { useNavigation } from '../context/NavigationContext';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import Avatar from './Avatar';
import AttributionBadge from './AttributionBadge';
import ShareHub from './ShareHub';
import ImageCarousel from './ImageCarousel';
import ContextualHeader from './ContextualHeader';
import BlueprintOverlay from './BlueprintOverlay';
import Watermark from './Watermark';
import './UniversalCard.css';

/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM]
 * ---------------------------------------
 * DIRECTIVA SUPREMA: Aquest component és la unitat atòmica del Gènesi.
 * L'estructura de la Boina Taronja (Header) i el Pentatló (Footer)
 * és SAGRADA i no pot ser alterada sense permís del Mestre Javi.
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
    mode = "post", // post, market, event, pobles, mapa, ajuntament, ruta
    variant = "post",
    isBating = false,
    excerpt,
    images,
    isOfficial: forcedOfficial = false,
    forensicMode: forcedForensic = false,
    viewMode = "grid"
}) => {
    const [hasImageError, setHasImageError] = useState(false);
    const cardVariant = variant || mode;
    const { openViewer, openConnectionModal } = useModal();
    const { forensicMode: contextForensic } = useNavigation();
    const { t } = useTranslation();
    const { gloveMode } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const isMaster = isAdmin || user?.id === 'd6325f44-7277-4d20-b020-166c010995ab';

    const TRUNCATE_LENGTH = 280;

    // MULTIMEDIA RESOLUTION
    const mediaList = images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null);
    const displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    const displayTitle = title || item?.title || "Sóc de Poble";
    const displayPrice = item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : "");
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const createdAtDate = item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null);
    const displayDate = createdAtDate ? createdAtDate.toLocaleDateString() : "30/1/2026";
    const displayTime = createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || "");

    // Lògica "Gent de..." MASTER GENESIS (Protocol Forense)
    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        const cleanTown = townName.replace("Poble Principal:", "").trim();
        if (cleanTown.includes("La Torre")) return "Gent de La Torre";
        return `Gent de ${cleanTown}`;
    };

    const handleCardClick = () => {
        if (cardVariant === 'pobles') {
            const townId = item?.uuid || item?.id;
            navigate(`/pobles/${townId}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        }
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        const authorId = item?.author_user_id || item?.author_id || item?.user_id;
        const entityId = item?.author_entity_id;

        if (entityId) {
            navigate(`/entitat/${entityId}`);
        } else if (authorId) {
            navigate(`/perfil/${authorId}`);
        }
    };

    const isOfficial = forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles';
    const isAlert = item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert || item?.category === 'Danger';
    const isSostenible = item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible');

    const handleConnectClick = (e) => {
        e.stopPropagation();

        // [PROTOCOL COMUNITAT OBERTA v11.2.0] Blindatge de Convidat
        if (user?.isAnonymous) {
            navigate('/registre?returnTo=' + encodeURIComponent(window.location.pathname));
            return;
        }

        // [PROTOCOL COMUNITAT OBERTA v11.3.0] Connexió de Proximitat
        openConnectionModal({
            postId: item.uuid || item.id,
            onUpdate: async (tags) => {
                await supabaseService.togglePostConnection(item.uuid || item.id, user.id, tags);
            }
        });
    };

    const CardContent = (
        <article
            className={`universal-card card-variant-${cardVariant} view-mode-${viewMode} ${className} ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'category-danger alert-active' : ''} ${isSostenible ? 'category-sostenible' : ''} ${isForensic ? 'mode-forense-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: (cardVariant === 'pobles' || cardVariant === 'event' || cardVariant === 'mapa') ? 'pointer' : 'default' }}
        >
            {viewMode === 'list' ? (
                /* LIST MODE: PROTOCOL DE PROXIMITAT COMPACTE */
                <div className="card-list-layout h-20 flex items-center px-4 gap-3">
                    <Avatar
                        src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                        name={displayAuthor}
                        role={avatarRole || item?.author_role}
                        size="sm"
                        className="flex-shrink-0"
                    />
                    
                    {/* PRODUCT THUMBNAIL (Llei del Mestre) */}
                    <div className="card-list-thumbnail flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/5">
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="w-full h-full object-cover"
                                onError={() => setHasImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <ImageIcon size={16} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <button className="btn-event-action visit-town font-black uppercase text-[11px] h-10 px-4 rounded-xl flex items-center gap-2 bg-[#ff6b00] text-black hover:brightness-110">
                            <Calendar size={14} className="opacity-80"/> CONNECTAR
                        </button>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">
                            <span>{displayAuthor}</span>
                            <span>•</span>
                            <span>{displayTown.replace("Poble Principal:", "").trim()}</span>
                        </div>
                    </div>
                    {displayPrice && (
                        <div className="text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-full flex-shrink-0">
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
                        <h3 className="master-author-name leading-tight">
                            {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                        </h3>
                        {/* [ANTI-FANTASME] Only show town if it's different and not official redundant */}
                        {!isOfficial && displayTown && displayTown !== displayAuthor && (
                            <div className="location-text">
                                {displayTown.replace("Poble Principal:", "").trim()}
                            </div>
                        )}
                        {isOfficial && (
                             <div className="location-text opacity-70">SÓC DE POBLE OFICIAL</div>
                        )}
                    </div>
                </div>

                <div className="header-right-meta flex items-center gap-2">
                    <div className="header-meta-details flex flex-col items-end justify-center leading-none">
                        {cardVariant !== 'pobles' && (
                            <div className="flex flex-col items-end">
                                <span className="header-date text-[10px] font-black opacity-80 uppercase tracking-tighter">{displayDate}</span>
                                <span className="header-time text-[10px] font-black uppercase text-white/90 tracking-tighter">{displayTime}</span>
                            </div>
                        )}
                        {(item?.is_pinned || item?.metadata?.is_pinned) && (
                            <Zap size={14} fill="currentColor" className="text-white mt-1 zap-celestial" />
                        )}
                    </div>
                </div>
            </header>

            {/* MULTIMÈDIA (LLEI DEL MESTRE: OBJECT-FIT COVER) */}
            <div 
                className="card-media-wrapper"
                onClick={(e) => {
                    e.stopPropagation();
                    if (cardVariant === 'pobles') {
                        const townId = item?.uuid || item?.id;
                        navigate(`/pobles/${townId || 'de-la-torre'}`);
                    } else if (mediaList && mediaList.length > 0) {
                        openViewer(mediaList, 0);
                    } else if (displayImage) {
                        openViewer({ src: displayImage, title: displayTitle, type: 'image' });
                    }
                }}
            >
                {mediaList && mediaList.length > 1 ? (
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                ) : (
                    <div className="w-full h-full relative group">
                        {(!displayImage || hasImageError) ? (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px', color: '#94a3b8' }}></div>
                                <div className="z-10 bg-white/10 backdrop-blur-sm p-4 rounded-full mb-2 group-hover:scale-110 transition-transform duration-500">
                                    <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 z-10">{t('common.image') || "Imatge"}</span>
                            </div>
                        ) : (
                            <Watermark 
                                variant={item?.theme === 'solemne' ? 'white' : 'white'} 
                                opacity={0.7}
                            >
                                <img 
                                    src={displayImage} 
                                    alt={displayTitle} 
                                    className="universal-card-media" 
                                    loading="lazy" 
                                    onClick={() => openViewer({ src: displayImage, title: displayTitle, type: 'image' })}
                                    style={{ cursor: 'zoom-in' }}
                                    onError={() => setHasImageError(true)}
                                />
                                <div className="image-overlay-credits">
                                    © SÓC DE POBLE / IAIA GENERATED
                                </div>
                            </Watermark>
                        )}
                    </div>
                )}
            </div>

            {/* COS DE LA TARGETA */}
            <div className="card-body">
                <div className="title-row">
                    <h2 className="genesis-title">{displayTitle}</h2>
                </div>

                {displayExcerpt && (
                    <div className="card-excerpt-container">
                        <p className="card-excerpt">
                            {displayExcerpt.length > TRUNCATE_LENGTH
                                ? `${displayExcerpt.substring(0, TRUNCATE_LENGTH)}...`
                                : displayExcerpt}
                        </p>
                        {displayExcerpt.length > TRUNCATE_LENGTH && (
                            <button
                                className="read-more-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const id = item.uuid || item.id;
                                    if (id) navigate(`/post/${id}`);
                                }}
                            >
                                Llegir més <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                )}

                <div className="card-tags-row">
                    {item?.tags?.map((tag, idx) => {
                        let badgeClass = '';
                        const cleanTag = tag.toLowerCase().replace('#', '');
                        if (cleanTag === 'km0') badgeClass = 'badge-km0';
                        else if (cleanTag === 'sostenible' || cleanTag === 'ecològic') badgeClass = 'badge-sostenible';
                        else if (cleanTag === 'artesania' || cleanTag === 'fetamà') badgeClass = 'badge-artesania';
                        else if (cleanTag === 'oferta') badgeClass = 'badge-oferta';
                        else if (isOfficial) badgeClass = 'badge-oficial';

                        return (
                            <span key={idx} className={`genesis-tag-pill ${badgeClass}`}>
                                {tag}
                            </span>
                        );
                    })}
                </div>

                {/* [MASTER] Price repositioned to bottom for balance v10.33.6 */}
                {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                    <div className="card-price-bottom mt-2 flex justify-end">
                        <span className="card-price">{displayPrice}</span>
                    </div>
                )}

                {children}
            </div>

            {/* FOOTER MASTER CMS v5.1 (LES 6 JOIES DEL PENTATLÓ) */}
            <div className={`card-footer-master variant-${cardVariant}`}>
                {/* 1. CARDINAL MUR (Social Flow) */}
                {(cardVariant === 'post' || cardVariant === 'mur') && (
                    <div className="footer-actions-mur">
                        {item?.type === 'tramit' ? (
                            <button className="master-action-btn connect-btn bg-[var(--sdp-terracotta)] text-white border-none w-full" onClick={(e) => { e.stopPropagation(); navigate('/documentacio'); }}>
                                <Landmark size={22} />
                                <span>{item.actionLabel || 'Tramitar'}</span>
                            </button>
                        ) : isMaster ? (
                            <button 
                                className="master-action-btn connect-btn master-button-canonic h-12 px-5 rounded-[24px] font-black tracking-widest bg-[var(--sdp-terracotta)] text-white"
                                onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.id}`); }}
                            >
                                <Edit size={22} />
                                <span>RECTIFICAR</span>
                            </button>
                        ) : (
                            <>
                                <button 
                                    className="w-full bg-black text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/20" 
                                    onClick={handleConnectClick}
                                >
                                    <UserPlus size={18} />
                                    <span className="font-black">CONNECTAR</span>
                                </button>
                                <div className="footer-touch-group">
                                    <button className="btn-touch iaia-chat" onClick={(e) => { 
                                        e.stopPropagation(); 
                                        navigate('/iaia');
                                    }}>
                                        <MessageCircle size={22} />
                                    </button>
                                    <ShareHub 
                                        title={displayTitle}
                                        text={displayExcerpt}
                                        url={item.uuid ? `/post/${item.uuid}` : (item.id ? `/post/${item.id}` : window.location.pathname)}
                                        customTrigger={
                                            <button className="btn-touch sharing-btn">
                                                <Share2 size={22} />
                                            </button>
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* 2. CARDINAL MERCAT (Price/E-commerce) */}
                {(cardVariant === 'mercat' || cardVariant === 'market') && (
                    <div className="footer-mercat-forense mt-4 p-0 flex gap-2">
                        <button 
                            className="flex-1 bg-black text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/20" 
                            onClick={handleConnectClick}
                        >
                            <Plus size={18} />
                            + INTERESSAT
                        </button>
                        <ShareHub 
                            title={displayTitle}
                            text={displayExcerpt}
                            url={item.uuid ? `/post/${item.uuid}` : (item.id ? `/post/${item.id}` : window.location.pathname)}
                            customTrigger={
                                <button className="btn-touch sharing-btn h-12 w-12 flex items-center justify-center bg-white/5 rounded-full border border-white/10 text-white hover:bg-white/10 transition-all">
                                    <Share2 size={22} />
                                </button>
                            }
                        />
                    </div>
                )}

                {/* 3. CARDINAL AGENDA (Cultural Event) */}
                {(cardVariant === 'agenda' || cardVariant === 'event') && (
                    <div className="footer-event-master p-4 pt-0">
                        <div className="event-info-notice mb-4">
                            <Zap size={14} className="flash-icon" />
                            <span>Esdeveniment destacat de la setmana</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                className="flex-1 bg-black text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/20" 
                                onClick={handleConnectClick}
                            >
                                <UserPlus size={18} />
                                CONNECTAR
                            </button>
                            <ShareHub 
                                title={displayTitle}
                                text={displayExcerpt}
                                url={item.uuid ? `/post/${item.uuid}` : (item.id ? `/post/${item.id}` : window.location.pathname)}
                                customTrigger={
                                    <button className="btn-touch sharing-btn h-12 w-12 flex items-center justify-center bg-white/5 rounded-full border border-white/10 text-white hover:bg-white/10 transition-all">
                                        <Share2 size={22} />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                )}

                {/* 4. CARDINAL POBLES (Community Gent de...) */}
                {cardVariant === 'pobles' && (
                    <div className="footer-pobles-master p-4 pt-0">
                        <button 
                            className="w-full bg-[#002B5B] text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#002B5B]/20" 
                            onClick={handleConnectClick}
                        >
                            <UserPlus size={18} />
                            CONNECTAR
                        </button>
                    </div>
                )}

                {/* 5. CARDINAL AJUNTAMENT (Official Institutional) */}
                {cardVariant === 'ajuntament' && (
                    <div className="footer-ajuntament-master p-4 pt-0">
                        <div className="official-notice-row mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-widest pl-2">
                            <ShieldCheck size={14} className="blue-badge-icon" />
                            <span>Comunicat Oficial de l'Ajuntament</span>
                        </div>
                        <button 
                            className="w-full bg-[#002B5B] text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#002B5B]/20" 
                            onClick={handleConnectClick}
                        >
                            <UserPlus size={18} />
                            CONNECTAR
                        </button>
                    </div>
                )}

                {/* 6. CARDINAL RUTES / MAPA (Territorial Navigation) */}
                {(cardVariant === 'mapa' || cardVariant === 'ruta') && (
                    <div className="footer-mapa-master p-4 pt-0">
                        <div className="map-dist-notice mb-4">
                            <MapPin size={14} />
                            <span>A 2.4 km de tu</span>
                        </div>
                        <button 
                            className="w-full bg-[#10B981] text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#10B981]/20" 
                            onClick={handleConnectClick}
                        >
                            <UserPlus size={18} />
                            CONNECTAR
                        </button>
                    </div>
                )}
            </div>
                </>
            )}
        </article>
    );

    const location = useLocation();
    const isChatRoute = location.pathname.startsWith('/chats');

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

export default UniversalCard;
