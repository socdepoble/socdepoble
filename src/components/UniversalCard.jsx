import { MoreHorizontal, Heart, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles, Edit, Trash2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import AttributionBadge from './AttributionBadge';
import ShareHub from './ShareHub';
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
    syncState          // New: local, synced
}) => {
    const { gloveMode, openViewer, openEditModal } = useUI();
    const { isSuperAdmin, isAdmin } = useAuth();

    // Cinematic Placeholder for Tier GOD aesthetic
    const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";
    const displayImage = image || (className?.includes('animate-bategat') ? cinematicPlaceholder : null);
    // Determine badge based on item content or explicit prop
    const currentStatus = item?.is_experimental ? 'experimental' : (item?.is_beta ? 'beta' : status);

    const renderBadge = () => {
        if (isOfficial) return <span className="card-badge official" style={{ background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', fontSize: '10px', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700', marginLeft: '8px', letterSpacing: '0.5px' }}>INSTITUCIÓ OFICIAL</span>;
        if (className?.includes('town-card')) return <span className="card-badge community" style={{ background: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', fontSize: '10px', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700', marginLeft: '8px' }}>Poble</span>;
        if (currentStatus === 'experimental') return <span className="card-badge exp" style={{ background: 'var(--md-sys-color-tertiary-container)', color: 'var(--md-sys-color-on-tertiary-container)', fontSize: '10px', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 'bold', marginLeft: '8px' }}>LABS</span>;
        return null;
    };

    const renderSyncIndicator = () => {
        if (!syncState) return null;
        const color = syncState === 'synced' ? '#2E7D32' : '#FF6D00';
        return <div className="sync-indicator" style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, marginLeft: '8px' }} title={syncState} />;
    };

    return (
        <article className={`universal-card ${className} theme-${theme} sync-${syncState} ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}>
            {/* 1. Capçalera (Header): Fons --color-terracotta. Text blanc. Clicable. */}
            {(title || avatarSrc || collection) && (
                <div className={`card-header ${theme}`} onClick={onHeaderClick}>
                    <div className="header-left">
                        {avatarSrc && <Avatar src={avatarSrc} role={avatarRole} name={avatarName} size={44} />}
                        <div className="header-text">
                            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {title}
                                {isVerifiedNeighbor && <span className="credential-icon neighbor" title="Veí Verificat" style={{ color: '#2E7D32', fontSize: '14px' }}>🌿</span>}
                                {isLocalProducer && <span className="credential-icon producer" title="Productor Local" style={{ color: '#D84315', fontSize: '14px' }}>🧺</span>}
                                {renderBadge()}
                                {renderSyncIndicator()}
                            </h3>
                            <div className="card-meta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {collection && <span className="card-collection-tag" style={{ fontSize: '11px', background: 'rgba(0,0,0,0.1)', color: '#000000', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontWeight: '800' }}>{collection}</span>}
                                    {(subtitle || source) && <span className="card-subtitle" style={{ fontSize: '12px', color: 'inherit', opacity: 0.9 }}>{subtitle || source}</span>}
                                </div>
                                {item?.created_at && (
                                    <span className="card-date" style={{ fontSize: '12px', fontWeight: '800', opacity: 0.9 }}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="header-right-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isAdmin && (
                            <button
                                className="admin-rectify-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal({ postData: item || { title, subtitle, content: excerpt, image_url: image } });
                                }}
                                style={{
                                    background: 'var(--accent)',
                                    color: 'var(--bg-canvas)',
                                    border: '2px solid #000',
                                    borderRadius: '0',
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '4px 4px 0px rgba(0,0,0,1)',
                                    fontSize: '20px',
                                    transition: 'all 0.1s active'
                                }}
                                title="Admin: Rectificar Amb Trellat (🏺)"
                            >
                                🏺
                            </button>
                        )}
                        <ShareHub
                            title={title}
                            text={excerpt || subtitle || title}
                            image={displayImage}
                            url={item?.url || `${window.location.origin}${window.location.pathname}`}
                        />
                        {headerAction && <div className="header-right">{headerAction}</div>}
                    </div>
                </div>
            )}

            {/* 2. Multimèdia: [MASTER] Acció Multimèdia (Funció Plena) */}
            {displayImage && (
                <div
                    className="card-image-wrapper"
                    onClick={() => {
                        const type = displayImage.endsWith('.pdf') ? 'pdf' :
                            (displayImage.endsWith('.mp4') || displayImage.endsWith('.webm') ? 'video' : 'image');
                        openViewer({ src: displayImage, title, type });
                    }}
                    style={{ cursor: 'zoom-in' }}
                >
                    <img src={displayImage} alt={title || "Shared content"} loading="lazy" />

                    {/* MASTER WATERMARK [GENESIS 4.0] */}
                    <div className="card-watermark">
                        <div className="watermark-content">
                            <span className="watermark-logo">🏺 Sóc de Poble</span>
                            <span className="watermark-author">
                                {item?.author_is_ai || avatarRole === 'ambassador'
                                    ? "Generat per l'IAIA"
                                    : `Compartida per ${avatarName || 'Veí'}`}
                            </span>
                        </div>
                    </div>

                    <AttributionBadge
                        filename={displayImage}
                        sourceType={item?.source_type}
                        sourceLabel={item?.source_label}
                        sourceUrl={item?.source_url}
                    />
                </div>
            )}

            {/* 3. Cos: Glassmorphism effect. */}
            <div className="card-body" style={{ background: '#FFFFFF', color: '#000000', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#000000', margin: 0, flex: 1 }}>{title}</h2>
                    {item?.price && <span style={{ fontSize: '24px', fontWeight: '900', color: '#000000' }}>{item.price}€</span>}
                </div>
                {excerpt && <p className="card-excerpt" style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '500', lineHeight: '1.4', color: '#333333' }}>{excerpt}</p>}
                {children}
            </div>

            {/* 4. Accions / Footer */}
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </article>
    );
};

export default UniversalCard;
