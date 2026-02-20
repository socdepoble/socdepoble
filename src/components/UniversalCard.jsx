import React, { useState } from 'react';
import { MoreHorizontal, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles, Edit, Trash2, Plus, FileText, ChevronRight, UserPlus, MapPin, Landmark, Image as ImageIcon, ScanLine, Ruler, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import AttributionBadge from './AttributionBadge';
import ShareHub from './ShareHub';
import Carousel from './Carousel';
import ImageCarousel from './ImageCarousel';
import BlueprintOverlay from './BlueprintOverlay';
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
    forensicMode: forcedForensic = false
}) => {
    const [hasImageError, setHasImageError] = useState(false);
    const cardVariant = variant || mode;
    const { t } = useTranslation();
    const { gloveMode, openViewer, forensicMode: contextForensic, setIsGuestInteractionModalOpen, openConnectionModal } = useUI();
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
    const displayDate = item?.created_at ? new Date(item.created_at).toLocaleDateString() : (item?.date || "30/1/2026");

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
            setIsGuestInteractionModalOpen(true);
            return;
        }

        // [PROTOCOL COMUNITAT OBERTA v11.3.0] Connexió de Proximitat
        openConnectionModal({
            postId: item.uuid || item.id,
            onUpdate: (tags) => {
                console.log(`[CONNECT] Connexió bategada amb etiquetes:`, tags);
            }
        });
    };

    const CardContent = (
        <article
            className={`universal-card card-variant-${cardVariant} ${className} ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'category-danger alert-active' : ''} ${isSostenible ? 'category-sostenible' : ''} ${isForensic ? 'mode-forense-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: (cardVariant === 'pobles' || cardVariant === 'event' || cardVariant === 'mapa') ? 'pointer' : 'default' }}
        >
            {/* HEADER: BOINA TARONJA (NEXUS v6.0) - FIXED 64px NAVIGATION */}
            <header 
                className={`card-header-boina h-16 ${isOfficial ? 'variant-official' : 'variant-standard'}`} 
                onClick={handleAuthorClick}
                style={{ cursor: 'pointer' }}
            >
                <div className="header-left">
                    <Avatar
                        src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                        name={displayAuthor}
                        role={avatarRole || item?.author_role}
                        size="md"
                        className="genesis-avatar"
                    />
                    <div className="header-text">
                        <div className="flex items-center gap-2">
                             <h3 className="master-author-name">
                                {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                            </h3>
                            {isOfficial && (
                                <span className="px-1.5 py-0.5 rounded-[28px] text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] uppercase tracking-wide shadow-sm flex items-center gap-1 border border-[#BAE6FD]">
                                    <ShieldCheck size={10} />
                                    Oficial
                                </span>
                            )}
                        </div>
                        <div className="location-text">
                            {displayTown.replace("Poble Principal:", "").trim()}
                        </div>
                    </div>
                </div>
                <div className="header-right-meta">
                    {/* [MASTER DYNAMIC HEADER] Price or Date according to cardinal mode */}
                    {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                        <div className="header-dynamic-data price-badge">
                            {displayPrice}
                        </div>
                    )}
                    {(cardVariant === 'agenda' || cardVariant === 'event') && (
                        <div className="header-dynamic-data date-badge">
                            {displayDate}
                        </div>
                    )}

                    {(item?.is_pinned || item?.metadata?.is_pinned) && (
                        <div className="pinned-indicator" title="Fixat pel Mestre">
                            <Zap size={16} fill="#00D2FF" color="#00D2FF" />
                        </div>
                    )}
                    {isMaster && (
                        <button
                            className="btn-master-rectify"
                            onClick={(e) => {
                                e.stopPropagation();
                                const id = item.uuid || item.id;
                                if (id) navigate(`/edit/${id}`);
                            }}
                            title="Rectificació Mestre"
                        >
                            🏺
                        </button>
                    )}
                    {isForensic && (
                        <div className="forensic-label">
                            {cardVariant === 'post' ? 'EG-WALKER: DAG SYNC' : 
                             cardVariant === 'mercat' ? 'RHIZOME: COMMERCE MESH' :
                             cardVariant === 'pobles' ? 'GENT DE... PROTOCOL' :
                             'LLEI BOINA TARONJA'} {'>'} PERFIL
                        </div>
                    )}
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
                    <ImageCarousel images={mediaList} />
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
                            <>
                                <img 
                                    src={displayImage} 
                                    alt={displayTitle} 
                                    className="universal-card-media" 
                                    loading="lazy" 
                                    onError={() => setHasImageError(true)}
                                />
                                <div className="image-overlay-credits">
                                    © SÓC DE POBLE / IAIA GENERATED
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* COS DE LA TARGETA */}
            <div className="card-body">
                <div className="title-price-row">
                    <h2 className="genesis-title">{displayTitle}</h2>
                    {displayPrice && (
                        <div className="card-price">
                            {displayPrice}
                        </div>
                    )}
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
                                    <span>CONNECTAR</span>
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
