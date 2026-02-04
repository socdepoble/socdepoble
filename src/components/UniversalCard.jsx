import { MoreHorizontal, Heart, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles, Edit, Trash2, Plus, FileText, ChevronRight } from 'lucide-react';
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
    theme = "default", // default, orange, terracotta
    status = 'operative', // operative, beta, experimental
    isOfficial = false, // New: For Administrative vs Cultural distinction
    isVerifiedNeighbor = false, // New: Leaf icon for neighbors
    isLocalProducer = false,    // New: Basket icon for producers
    isBating = false,   // New: Visual feedback for active town
    excerpt,           // New: For Raindrop items
    source,            // New: Domain info
    collection,        // New: Category/Collection
    syncState,          // New: local, synced
    images              // New: For carousels
}) => {
    const { gloveMode, openViewer, openEditModal } = useUI();
    const { isSuperAdmin, isAdmin } = useAuth();
    const navigate = useNavigate();

    const TRUNCATE_LENGTH = 280;

    // Cinematic Placeholder for Tier GOD aesthetic
    const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

    // MULTIMEDIA RESOLUTION: Priority for arrays
    const mediaList = images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null);

    // IMAGE RECOVERY: Ensure we don't lose photos
    const displayImage = image || item?.image_url || item?.image || item?.url || (mediaList ? mediaList[0] : null) || (className?.includes('animate-bategat') ? cinematicPlaceholder : null);

    const displayTitle = title || item?.title || "Sóc de Poble Content";
    const displayPrice = item?.price || "";
    const displayAuthor = subtitle || item?.seller || item?.author_name || item?.author || "Veí de la Torre";
    const displayExcerpt = excerpt || item?.description || item?.content || "";

    return (
        <article className={`universal-card ${className} sync-${syncState} ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}>
            {/* 0. Header: Orange Section */}
            <div
                className="card-header-genesis"
                onClick={onHeaderClick}
            >
                <div className="header-left">
                    <Avatar
                        src={avatarSrc || item?.author_avatar}
                        name={avatarName || displayAuthor}
                        role={avatarRole || item?.author_role}
                        size="md"
                        className="genesis-avatar"
                    />
                    <div className="header-text">
                        <h3>{displayAuthor}</h3>
                        <div className="location-text">
                            {subtitle || item?.location?.town || 'La Torre de les Maçanes'}
                        </div>
                    </div>
                </div>

                {item?.created_at && (
                    <div className="header-date">
                        {new Date(item.created_at).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* 1. Multimèdia: Clean Image or Carousel */}
            {mediaList && mediaList.length > 1 ? (
                <div className="card-carousel-wrapper">
                    <ImageCarousel images={mediaList} />
                </div>
            ) : displayImage && (
                <div
                    className="card-image-wrapper"
                    onClick={() => {
                        const src = typeof displayImage === 'string' ? displayImage : (Array.isArray(displayImage) ? displayImage[0] : '');
                        const type = src.endsWith('.pdf') ? 'pdf' :
                            (src.endsWith('.mp4') || src.endsWith('.webm') ? 'video' : 'image');
                        openViewer({ src, title: displayTitle, type });
                    }}
                >
                    <img src={displayImage} alt={displayTitle} loading="lazy" />
                </div>
            )}

            {/* 2. Cos: Genesis Cream Content */}
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

                {children}

                <div className="card-primary-action">
                    <button
                        className="btn-interessat"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Plus size={22} strokeWidth={3} />
                        <span>INTERESSAT</span>
                    </button>

                    <div className="astro-tag">
                        <Zap size={14} fill="#FF6D00" />
                        <span>TELE-OLI (ASTRO)</span>
                    </div>
                </div>
            </div>

            {/* 3. Footer: Simple Actions */}
            <div className="card-footer-genesis">
                <button
                    className="share-btn"
                    title="Pedagogia Social"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/aula-rural');
                    }}
                >
                    <Share2 size={24} />
                </button>
                <div
                    className="edit-icon-box"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isAdmin) openEditModal({ postData: item });
                        else navigate('/aula-rural');
                    }}
                >
                    <FileText size={20} />
                </div>
            </div>
        </article>
    );
};

export default UniversalCard;
