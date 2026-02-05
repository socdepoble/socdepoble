import { MoreHorizontal, Heart, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles, Edit, Trash2, Plus, FileText, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import AttributionBadge from './AttributionBadge';
import ShareHub from './ShareHub';
import Carousel from './Carousel';
import ImageCarousel from './ImageCarousel';

/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM]
 * A standardized container for all list items (Posts, Towns, Products).
 * Enforces Terracotta Header, Glass Body, and squared Multimedia.
 */
const UniversalCard = ({
    item,
    title,
    subtitle,
    headerAction,
    image,
    onHeaderClick,
    avatarSrc,
    avatarRole,
    avatarName,
    children,
    footer,
    className = "",
    mode = "mur", // mur, mercat, pobles
    isBating = false,
    excerpt,
    images
}) => {
    const { gloveMode, openViewer } = useUI();
    const navigate = useNavigate();

    const TRUNCATE_LENGTH = 280;

    // MULTIMEDIA RESOLUTION
    const mediaList = images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null);
    const displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    const displayTitle = title || item?.title || "Sóc de Poble";
    const displayPrice = item?.price || (mode === 'mercat' ? (item?.price || "15.00€") : ""); // Mock price if missing in market
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const displayDate = item?.created_at ? new Date(item.created_at).toLocaleDateString() : (item?.date || "30/1/2026");

    // Lògica "Gent de..." MASTER GENESIS
    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        if (townName.includes("La Torre de les Maçanes")) return "Gent de La Torre";
        return `Gent de ${townName}`;
    };

    const handleCardClick = (e) => {
        if (mode === 'pobles') {
            const townId = item?.uuid || item?.id;
            // Redirecció a la pàgina de "Gent de Poble"
            navigate(`/gent/${townId}`);
        }
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        const authorId = item?.author_id || item?.user_id || item?.id;
        if (authorId) navigate(`/perfil/${authorId}`);
    };

    return (
        <article
            className={`universal-card card-mode-${mode} ${className} ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: mode === 'pobles' ? 'pointer' : 'default' }}
        >
            <div className="card-header-genesis" onClick={handleAuthorClick}>
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
                            {mode === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                        </h3>
                        <div className="location-text">
                            {displayTown}
                        </div>
                    </div>
                </div>
                <div className="header-right-meta">
                    <div className="header-date">
                        {displayDate}
                    </div>
                    {/* Espai per a futurs indicadors mestres */}
                </div>
            </div>

            {/* MULTIMÈDIA */}
            {mediaList && mediaList.length > 1 ? (
                <div className="card-carousel-wrapper">
                    <ImageCarousel images={mediaList} />
                </div>
            ) : displayImage && (
                <div
                    className="card-image-wrapper"
                    onClick={(e) => {
                        e.stopPropagation();
                        const src = typeof displayImage === 'string' ? displayImage : (Array.isArray(displayImage) ? displayImage[0] : '');
                        openViewer({ src, title: displayTitle, type: 'image' });
                    }}
                >
                    <img src={displayImage} alt={displayTitle} loading="lazy" />
                    {/* Overlay informatiu si cal */}
                    <div className="image-overlay-credits">
                        © SÓC DE POBLE (FET PER LA IAIA) / GRATIS (NO COMERCIAL)
                    </div>
                </div>
            )}

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

                {/* TAGS PILL STYLE */}
                <div className="card-tags-row">
                    {item?.tags?.map((tag, idx) => (
                        <span key={idx} className="genesis-tag-pill">{tag}</span>
                    ))}
                    {mode === 'mercat' && <span className="genesis-tag-pill roba">ROBA</span>}
                </div>

                {children}
            </div>

            {/* FOOTER ADAPTAT PER MODE */}
            <div className={`card-footer-master mode-${mode}`}>
                {mode === 'mur' && (
                    <>
                        <div className="footer-actions-mur">
                            <button className="master-action-btn" onClick={(e) => e.stopPropagation()}>
                                <UserPlus size={24} />
                                <span>Connectar</span>
                            </button>
                            <button className="master-action-btn" onClick={(e) => { e.stopPropagation(); navigate(`/post/${item.id}#comments`); }}>
                                <MessageCircle size={24} />
                                <span>Comentar</span>
                            </button>
                            <button className="master-action-btn" onClick={(e) => e.stopPropagation()}>
                                <Share2 size={24} />
                                <span>Compartir</span>
                            </button>
                        </div>
                        {/* Simulació d'acordió de comentaris del Xat */}
                        <div className="comments-preview-stub">
                            <div className="comment-line"><b>Vicent:</b> Xé, que bonica la foto!</div>
                            <button className="read-more-comments">Llegir 5 comentaris més...</button>
                        </div>
                    </>
                )}

                {mode === 'mercat' && (
                    <div className="footer-mercat-master">
                        <div className="mercat-price-bategat">{displayPrice}</div>
                        <button
                            className="btn-mercat-action"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/mercat/${item.id || 'item'}`);
                            }}
                        >
                            <span>INTERESSAT</span>
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                )}

                {mode === 'pobles' && (
                    <div className="pobles-container-master">
                        <div className="gent-de-notice">
                            💡 Això és "Gent de {displayTown}", un espai veïnal. No és la pàgina oficial de l'Ajuntament.
                        </div>
                        <div className="pobles-footer-info">
                            <span>VEURE PERFIL COMUNITARI</span>
                            <ChevronRight size={18} />
                        </div>
                    </div>
                )}

                {mode === 'alertes' && (
                    <div className="footer-alertes-master">
                        <button className="btn-alert-map" onClick={(e) => e.stopPropagation()}>
                            <span>VEURE MAPA D'AFECTACIÓ</span>
                            <FileText size={20} />
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
};

export default UniversalCard;
