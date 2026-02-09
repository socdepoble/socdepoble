import { MoreHorizontal, Heart, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles, Edit, Trash2, Plus, FileText, ChevronRight, UserPlus, MapPin, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import AttributionBadge from './AttributionBadge';
import ShareHub from './ShareHub';
import Carousel from './Carousel';
import ImageCarousel from './ImageCarousel';
import './UniversalCard.css';

/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM]
 * A standardized container for all list items (Posts, Towns, Products).
 * Enforces Terracotta Header, Glass Body, and squared Multimedia.
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
    images
}) => {
    const cardVariant = variant || mode;
    const { gloveMode, openViewer } = useUI();
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

    // Lògica "Gent de..." MASTER GENESIS
    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        // Enforcing formal name as per Mestre's serious preference
        if (townName.includes("La Torre de les Maçanes")) return "Gent de La Torre de les Maçanes";
        return `Gent de ${townName}`;
    };

    const handleCardClick = () => {
        if (cardVariant === 'pobles') {
            const townId = item?.uuid || item?.id;
            navigate(`/gent/${townId}`);
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

    const isOfficial = item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system';
    const isAlert = item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert;

    return (
        <article
            className={`universal-card card-variant-${cardVariant} ${className} ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'alert-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: (cardVariant === 'pobles' || cardVariant === 'event' || cardVariant === 'mapa') ? 'pointer' : 'default' }}
        >
            {/* HEADER: BOINA TARONJA (NEXUS v6.0) */}
            <header 
                className="card-header-boina" 
                onClick={handleAuthorClick}
            >
                <div className="header-left">
                    <Avatar
                        src={avatarSrc || item?.author_avatar || item?.logo_url}
                        name={displayAuthor}
                        role={avatarRole || item?.author_role}
                        size="md"
                        className="genesis-avatar"
                    />
                    <div className="header-text">
                        <h3 className="master-author-name">
                            {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                            {isOfficial && <ShieldCheck size={14} className="official-blue-shield" />}
                        </h3>
                        <div className="location-text">
                            {displayTown}
                        </div>
                    </div>
                </div>
                <div className={`header-right-meta ${cardVariant === 'agenda' || cardVariant === 'event' ? 'agenda-highlight' : ''}`}>
                    <div className="header-date">
                        {displayDate}
                    </div>
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
                </div>
            </header>

            {/* MULTIMÈDIA (LLEI DEL MESTRE: OBJECT-FIT COVER) */}
            <div 
                className="card-media-wrapper"
                onClick={(e) => {
                    e.stopPropagation();
                    if (cardVariant === 'pobles') {
                        navigate('/gent-de-la-torre');
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
                    <>
                        <img 
                            src={displayImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop"} 
                            alt={displayTitle} 
                            className="universal-card-media" 
                            loading="lazy" 
                        />
                        <div className="image-overlay-credits">
                            © SÓC DE POBLE / IAIA GENERATED
                        </div>
                    </>
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
                    {item?.tags?.map((tag, idx) => (
                        <span key={idx} className="genesis-tag-pill">{tag}</span>
                    ))}
                </div>

                {children}
            </div>

            {/* FOOTER MASTER CMS v5.1 (LES 6 JOIES DEL PENTATLÓ) */}
            <div className={`card-footer-master variant-${cardVariant}`}>
                {/* 1. CARDINAL MUR (Social Flow) */}
                {(cardVariant === 'post' || cardVariant === 'mur') && (
                    <div className="footer-actions-mur">
                        <button className="master-action-btn connect-btn" onClick={(e) => { e.stopPropagation(); alert('Rhizome: Puzle Social'); }}>
                            <UserPlus size={22} />
                            <span>Connectar</span>
                        </button>
                        <div className="footer-touch-group">
                            <button className="btn-touch iaia-chat" onClick={(e) => { e.stopPropagation(); alert(`IAIA: Hola! Què opines de "${displayTitle}"?`); }}>
                                <MessageCircle size={22} />
                            </button>
                            <button className="btn-touch sharing-btn" onClick={(e) => { e.stopPropagation(); alert('Protocol Bategar'); }}>
                                <Share2 size={22} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. CARDINAL MERCAT (Price/E-commerce) */}
                {(cardVariant === 'mercat' || cardVariant === 'market') && (
                    <div className="footer-mercat-master">
                        <div className="mercat-actions-row">
                            <button className="master-action-btn connect-btn" onClick={(e) => { e.stopPropagation(); alert('Rhizome: Puzle Comercial'); }}>
                                <Zap size={22} />
                                <span>Interessat</span>
                            </button>
                            <button className="btn-touch iaia-chat" onClick={(e) => { e.stopPropagation(); alert(`IAIA: Hola! Què opines de aquest producte: "${displayTitle}"?`); }}>
                                <MessageCircle size={22} />
                            </button>
                        </div>
                        <button className="btn-mercat-buy" onClick={() => navigate(`/mercat/${item.id}`)}>
                            <span>COMPRAR-LO {displayPrice}</span>
                        </button>
                    </div>
                )}

                {/* 3. CARDINAL AGENDA (Cultural Event) */}
                {(cardVariant === 'agenda' || cardVariant === 'event') && (
                    <div className="footer-event-master">
                        <div className="event-info-notice">
                            <Zap size={14} className="flash-icon" />
                            <span>Esdeveniment destacat de la setmana</span>
                        </div>
                        <div className="event-actions-row">
                            <button className="master-action-btn connect-btn" onClick={(e) => { e.stopPropagation(); alert('Rhizome: Puzle Cultural'); }}>
                                <UserPlus size={22} />
                                <span>Assistiré</span>
                            </button>
                            <button className="btn-touch iaia-chat" onClick={(e) => { e.stopPropagation(); alert(`IAIA: Hola! Tens dubtes sobre l'esdeveniment "${displayTitle}"?`); }}>
                                <MessageCircle size={22} />
                            </button>
                            <button className="btn-event-action" onClick={() => navigate(`/agenda/${item.id}`)}>
                                <span>Obrir</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. CARDINAL POBLES (Community Gent de...) */}
                {cardVariant === 'pobles' && (
                    <div className="footer-pobles-master">
                        <button className="master-action-btn connect-btn" onClick={(e) => { e.stopPropagation(); alert('Rhizome: Puzle Comunitat'); }}>
                            <UserPlus size={22} />
                            <span>Connectar al Poble</span>
                        </button>
                        <div className="footer-touch-group">
                            <button className="btn-touch iaia-chat" onClick={(e) => { e.stopPropagation(); alert(`IAIA: Hola! Vols saber més sobre ${displayTown}?`); }}>
                                <MessageCircle size={22} />
                            </button>
                            <button className="btn-event-action visit-town" onClick={() => navigate('/gent-de-la-torre')}>
                                <span>VISITAR MUR</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. CARDINAL AJUNTAMENT (Official Institutional) */}
                {cardVariant === 'ajuntament' && (
                    <div className="footer-ajuntament-master">
                        <div className="official-notice-row">
                            <ShieldCheck size={14} className="blue-badge-icon" />
                            <span>Comunicat Oficial de l'Ajuntament</span>
                        </div>
                        <div className="event-actions-row">
                            <button className="master-action-btn connect-btn" onClick={(e) => { e.stopPropagation(); alert('Rhizome: Puzle Institucional'); }}>
                                <UserPlus size={22} />
                                <span>Connectar</span>
                            </button>
                            <button className="btn-touch iaia-chat" onClick={(e) => { e.stopPropagation(); alert(`IAIA: Hola! Tens alguna pregunta sobre el comunicat: "${displayTitle}"?`); }}>
                                <MessageCircle size={22} />
                            </button>
                            <button className="btn-event-action official-nav" onClick={() => navigate('/ajuntament')}>
                                <span>Obrir</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 6. CARDINAL RUTES / MAPA (Territorial Navigation) */}
                {(cardVariant === 'mapa' || cardVariant === 'ruta') && (
                    <div className="footer-mapa-master">
                        <div className="map-dist-notice">
                            <MapPin size={14} />
                            <span>A 2.4 km de tu</span>
                        </div>
                        <div className="event-actions-row">
                            <button className="master-action-btn connect-btn" onClick={(e) => { e.stopPropagation(); alert('Rhizome: Puzle Territorial'); }}>
                                <UserPlus size={22} />
                                <span>Connectar</span>
                            </button>
                            <button className="btn-touch iaia-chat" onClick={(e) => { e.stopPropagation(); alert(`IAIA: Hola! Vols consells sobre la ruta: "${displayTitle}"?`); }}>
                                <MessageCircle size={22} />
                            </button>
                            <button className="btn-event-action map-nav" onClick={() => navigate(`/pub/${item.id}`)}>
                                <span>VEURE MAPA</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
};

export default UniversalCard;
