import { MoreHorizontal, Heart, MessageCircle, Share2, Tag, Zap, ShieldCheck, Beaker, Sparkles } from 'lucide-react';
import { useUI } from '../context/UIContext';
import Avatar from './Avatar';
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
    const { gloveMode } = useUI();

    // Cinematic Placeholder for Tier GOD aesthetic
    const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";
    const displayImage = image || (className?.includes('animate-bategat') ? cinematicPlaceholder : null);
    // Determine badge based on item content or explicit prop
    const currentStatus = item?.is_experimental ? 'experimental' : (item?.is_beta ? 'beta' : status);

    const renderBadge = () => {
        if (isOfficial) return <span className="card-badge official" style={{ background: 'var(--color-primary)', color: 'black', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '900', marginLeft: '8px', letterSpacing: '0.5px' }}>INSTITUCIÓ OFICIAL</span>;
        if (className?.includes('town-card')) return <span className="card-badge community" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginLeft: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>COMUNITAT VEÏNAL</span>;
        if (currentStatus === 'experimental') return <span className="card-badge exp" style={{ background: '#7C3AED', color: 'white', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', marginLeft: '8px' }}>LABS</span>;
        if (currentStatus === 'beta') return <span className="card-badge beta" style={{ background: '#F59E0B', color: 'white', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', marginLeft: '8px' }}>BETA</span>;
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
                            <div className="card-meta-row" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                                {collection && <span className="card-collection-tag" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '2px', fontWeight: '800' }}>{collection}</span>}
                                {(subtitle || source) && <span className="card-subtitle">{subtitle || source}</span>}
                            </div>
                        </div>
                    </div>
                    {headerAction && <div className="header-right">{headerAction}</div>}
                </div>
            )}

            {/* 2. Multimèdia: Imatges amb border-radius: 0px. */}
            {displayImage && (
                <div className="card-image-wrapper" style={{ borderRadius: '0px !important' }}>
                    <img src={displayImage} alt={title || "Shared content"} loading="lazy" style={{ borderRadius: '0px !important' }} />
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
