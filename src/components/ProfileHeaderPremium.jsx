import React from 'react';
import { 
    ArrowLeft, MapPin, Calendar, BadgeCheck, Info, Share2, MoreVertical, 
    Globe, UserPlus, UserMinus, Loader2, Tag, Shield, Plus, Sun, Moon, Check, X, MessageCircle, Zap, Sparkles,
    Camera, History, ChevronDown
} from 'lucide-react';
import ShareHub from './ShareHub';
import { useNavigate } from 'react-router-dom';
import MediaViewerModal from './MediaViewerModal';
import { useTheme } from '../context/ThemeContext';
import { trustService } from '../services/trustService';
import './ProfileHeaderPremium.css';

/**
 * UniversalTotem (ex-ProfileHeaderPremium) - El tòtem d'identitat suprema v1.25.0-MASTER-GOLDEN.
 * Suporta perfils de: Persones, Grups, Empreses, Entitats Oficials i Pobles.
 */
const ProfileHeaderPremium = ({
    type = 'person', // person, group, business, official, town
    title,
    subtitle,
    town,
    bio,
    avatarUrl,
    coverUrl,
    badges = [], // ['IAIA', 'Oficial', 'Verificat']
    isLive = false, // Per a "Obert ara" en negocis
    onBack,
    isEditing = false,
    shareData = null, // { title, text, url }
    onShare, // High priority if provided
    onTitleChange,
    onSubtitleChange,
    onTownChange,
    onBioChange,
    website,
    // Connect Props
    isConnected = false,
    isConnecting = false,
    onConnect, // Function to handle connection flow
    showConnect = true, // Force visibility by default as per Protocol OMEGA
    showThemeToggle = false,
    onEditToggle,
    onEditSave,
    onEditCancel,
    children
}) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [viewerData, setViewerData] = React.useState({ isOpen: false, src: '', title: '' });
    const [isRhizomeOpen, setIsRhizomeOpen] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const openViewer = (src, title) => {
        if (!src) return;
        setViewerData({ isOpen: true, src, title });
    };

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const handleConnectClick = () => {
        if (isConnected) {
            onConnect?.({ disconnect: true });
        } else {
            setIsRhizomeOpen(true);
        }
    };

    const confirmConnection = async (tag) => {
        // [WEB OF TRUST] Emetem el vot de confiança en local
        const targetId = title || 'unknown'; // Idealment s'usaria un DID real
        await trustService.emitTrustVote(targetId, 1.0);
        
        onConnect?.({ tag });
        setIsRhizomeOpen(false);
    };

    // Estil de reputació (Trellat)
    const [trustLevel, setTrustLevel] = React.useState(null);
    React.useEffect(() => {
        if (title) {
            trustService.getProximityReputation(title).then(setTrustLevel);
        }
    }, [title]);

    return (
        <div className={`profile-premium-header-container ${type} ${isEditing ? 'edit-mode-active' : ''}`}>
            {/* Cover Area with Glassmorphism Overlay */}
            <div className={`premium-cover-section ${coverUrl ? 'clickable' : ''}`} onClick={() => openViewer(coverUrl, 'Imatge de portada')}>
                {coverUrl ? (
                    <img src={coverUrl} alt="" className="premium-cover-img" />
                ) : (
                    <div className="premium-cover-placeholder" />
                )}
                <div className="premium-cover-overlay" />
                
                {isEditing && (
                    <div className="premium-cover-edit-prompt" onClick={(e) => { e.stopPropagation(); alert('IAIA: Puja una foto de la teua terra!'); }}>
                        <Camera size={32} />
                        <span>CANVIAR PORTADA</span>
                    </div>
                )}

                {/* Navigation Actions */}
                <div className="premium-nav-actions">
                    <div className="nav-actions-left flex items-center gap-4">
                        <button className="premium-btn-circle back" onClick={handleBack} title="Tornar">
                            <ArrowLeft size={24} />
                        </button>
                        
                        {showConnect && (
                            <button 
                                className={`premium-connect-pill ${isConnected ? 'connected' : ''} master-button-canonic`}
                                onClick={handleConnectClick}
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : isConnected ? (
                                    <>
                                        <UserMinus size={18} />
                                        <span>DESCONNECTAR</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        <span>🤝 CONNECTAR</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="nav-actions-right">
                        {(shareData || onShare) && (
                            <div className="premium-share-wrapper">
                                {onShare ? (
                                    <button className="premium-btn-circle share" onClick={onShare} title="Compartir">
                                        <Share2 size={24} />
                                    </button>
                                ) : (
                                    <ShareHub
                                        title={shareData.title}
                                        text={shareData.text}
                                        url={shareData.url}
                                        customTrigger={
                                            <button className="premium-btn-circle share" title="Compartir">
                                                <Share2 size={24} />
                                            </button>
                                        }
                                    />
                                )}
                            </div>
                        )}

                        {showThemeToggle && (
                            <button 
                                className="premium-btn-circle theme-toggle" 
                                onClick={toggleTheme}
                                title={theme === 'dark' ? 'Canviar a Llum de Dia' : 'Canviar a Nit Digital'}
                                style={{ width: '48px', height: '48px' }}
                            >
                                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                            </button>
                        )}

                        {isEditing ? (
                            <div className="edit-actions-group">
                                <button className="premium-btn-circle save" onClick={onEditSave} title="Guardar Canvis" style={{ width: '48px', height: '48px' }}>
                                    <Check size={24} />
                                </button>
                                <button className="premium-btn-circle cancel" onClick={onEditCancel} title="Cancel·lar" style={{ width: '48px', height: '48px' }}>
                                    <X size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="premium-management-menu-wrapper">
                                <button 
                                    className={`premium-btn-circle manage ${isMenuOpen ? 'active' : ''}`} 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                    title="Gestió"
                                    style={{ width: '48px', height: '48px' }}
                                >
                                    <MoreVertical size={24} />
                                </button>
                                
                                {isMenuOpen && (
                                    <div className="premium-dropdown-menu animate-in">
                                        <button className="dropdown-item" onClick={() => { onEditToggle?.(); setIsMenuOpen(false); }}>
                                            <Settings size={18} />
                                            <span>EDITAR PERFIL</span>
                                        </button>
                                        <button className="dropdown-item" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>
                                            <Zap size={18} />
                                            <span>ESCRIPTORI PRIVAT</span>
                                        </button>
                                        <button className="dropdown-item" onClick={() => { navigate('/archive'); setIsMenuOpen(false); }}>
                                            <History size={18} />
                                            <span>ARXIU DE RECURSOS</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Identity Info Area */}
            <div className="premium-identity-card">
                <div className="premium-avatar-row">
                    <div className={`premium-avatar-wrapper ${avatarUrl ? 'clickable' : ''}`} onClick={() => !isEditing && openViewer(avatarUrl, title)}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={title} className="premium-avatar-img" />
                        ) : (
                            <div className="premium-avatar-placeholder-pulse">
                                <img src="/assets/master/logo_socdepoble_white_full.png" alt="Sóc de Poble" className="pulse-logo" />
                            </div>
                        )}
                        {isLive && !isEditing && <span className="live-indicator-pulse" title="Actiu / Obert ara" />}
                        
                        {isEditing && (
                            <div className="premium-avatar-edit-overlay" onClick={(e) => { e.stopPropagation(); alert('IAIA: Tria la millor cara!'); }}>
                                <Camera size={24} />
                            </div>
                        )}
                    </div>

                    <div className="premium-main-text">
                        <div className="premium-title-row">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="premium-edit-input title"
                                    value={title}
                                    onChange={(e) => onTitleChange?.(e.target.value)}
                                    placeholder="Nom"
                                />
                            ) : (
                                <h1 className="premium-title">{title}</h1>
                            )}
                            <div className="premium-badges-row">
                                {badges.map((badge, idx) => (
                                    <span key={idx} className={`premium-badge ${badge.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {badge}
                                    </span>
                                ))}
                                {trustLevel && trustLevel.level !== 'desconegut' && (
                                    <span className="premium-badge trust-score" title={trustLevel.direct ? 'Confiança Directa' : `Confiança via ${trustLevel.witness}`}>
                                        🏺 {trustLevel.level === 'alta' ? 'FIABLE' : 'CONEGUT'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="premium-meta-stack">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        className="premium-edit-input subtitle"
                                        value={subtitle}
                                        onChange={(e) => onSubtitleChange?.(e.target.value)}
                                        placeholder="Quin és el teu ofici?"
                                    />
                                    <div className="premium-town-line editable" onClick={() => onTownChange?.()}>
                                        <MapPin size={14} />
                                        <span>{town || 'Selecciona poble'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {subtitle && <p className="premium-subtitle">{subtitle}</p>}
                                    {town && (
                                        <p className="premium-town-line clickable" onClick={() => onTownChange?.()}>
                                            <MapPin size={14} />
                                            <span>{town}</span>
                                            <ChevronDown size={14} className="chevron-indicator" />
                                        </p>
                                    )}
                                    {website && (
                                        <a href={website} target="_blank" rel="noopener noreferrer" className="premium-town-line website-link">
                                            <Globe size={14} />
                                            <span>{website.replace('https://', '').replace(/\/$/, '')}</span>
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {isEditing ? (
                    <div className="premium-edit-textarea-wrapper">
                        <textarea
                            className="premium-edit-textarea bio"
                            value={bio}
                            onChange={(e) => onBioChange?.(e.target.value)}
                            placeholder="Escriu la teua frase o lema de marca..."
                            rows={2}
                        />
                        <button className="btn-ai-magic-bio" title="Bio Màgica (AI)" onClick={() => alert('IAIA: Redactant una bio que faça goig...')}>
                            {Sparkles ? <Sparkles size={16} /> : '✨'}
                            <span>Bio Màgica</span>
                        </button>
                    </div>
                ) : (
                    <div className="premium-bio-container">
                        {bio && <p className="premium-bio">{bio}</p>}
                        <div className="premium-ai-profile-tools">
                            <button className="btn-ai-greeting" title="Redactor de Salutacions (AI)" onClick={() => alert('IAIA: Preparant salutacions personalitzades...')}>
                                <MessageCircle size={16} />
                                <span>Salutacions</span>
                            </button>
                            <button className="btn-ai-rumors" title="La Veu del Poble (IAIA)" onClick={() => alert('IAIA: Xe! He sentit a dir que...')}>
                                {Zap ? <Zap size={16} /> : '⚡'}
                                <span>Veu del Poble</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Slot for Stats Bar or other elements */}
                {children && (
                    <div className="premium-card-footer-slot">
                        {children}
                    </div>
                )}
            </div>

            {/* Rhizome Connection Modal (Internal) */}
            {isRhizomeOpen && (
                <div className="rhizome-connection-overlay" onClick={() => setIsRhizomeOpen(false)}>
                    <div className="rhizome-modal" onClick={e => e.stopPropagation()}>
                        <div className="rhizome-header">
                            <div className="rhizome-icon-glow">
                                <UserPlus size={32} />
                            </div>
                            <h3>Connexió Rhizome</h3>
                            <p>Etiqueta aquesta connexió per a organitzar el teu mur privat.</p>
                        </div>
                        
                        <div className="rhizome-tags-grid">
                            {['Veí', 'Amic', 'Treball', 'Comerç', 'Oficial', 'Cultura'].map(tag => (
                                <button key={tag} className="rhizome-tag-btn" onClick={() => confirmConnection(tag)}>
                                    <Tag size={16} />
                                    <span>{tag}</span>
                                </button>
                            ))}
                        </div>

                        <div className="rhizome-footer">
                            <div className="shield-hint">
                                <Shield size={14} />
                                <span>Aquesta etiqueta només la veus tu.</span>
                            </div>
                            <button className="rhizome-btn-skip" onClick={() => confirmConnection('Veí')}>
                                Omplir com a "Veí"
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MediaViewerModal
                isOpen={viewerData.isOpen}
                onClose={() => setViewerData({ ...viewerData, isOpen: false })}
                src={viewerData.src}
                title={viewerData.title}
            />
        </div>
    );
};

export default ProfileHeaderPremium;
