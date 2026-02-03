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
    const { gloveMode, openViewer } = useUI();
    const { isSuperAdmin } = useAuth();

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
                            <div className="card-meta-row" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                                {collection && <span className="card-collection-tag" style={{ fontSize: '11px', background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontWeight: '700' }}>{collection}</span>}
                                {(subtitle || source) && <span className="card-subtitle" style={{ fontSize: '12px', color: 'inherit', opacity: 0.8 }}>{subtitle || source}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="header-right-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isSuperAdmin && (
                            <button
                                className="admin-rectify-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    alert("Protocol de Rectificació Master: L'edició del bategat estarà disponible al següent cicle.");
                                }}
                                style={{
                                    background: 'var(--color-terracotta-dark)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                                title="Super Admin: Rectificar Publicació"
                            >
                                <Edit size={16} />
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
            <div className="card-body">
                {excerpt && <p className="card-excerpt" style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.4', opacity: 0.9 }}>{excerpt}</p>}
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
