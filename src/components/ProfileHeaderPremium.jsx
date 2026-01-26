import React from 'react';
import { ArrowLeft, MapPin, Calendar, BadgeCheck, Info, Share2, Settings, Globe } from 'lucide-react';
import ShareHub from './ShareHub';
import { useNavigate } from 'react-router-dom';
import MediaViewerModal from './MediaViewerModal';
import './ProfileHeaderPremium.css';

/**
 * ProfileHeaderPremium - Un única capçalera per a governar-los a tots.
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
    onAction,
    actionIcon,
    isEditing = false,
    shareData = null, // { title, text, url }
    onTitleChange,
    onSubtitleChange,
    onTownChange,
    onBioChange,
    website,
    children
}) => {
    const navigate = useNavigate();
    const [viewerData, setViewerData] = React.useState({ isOpen: false, src: '', title: '' });

    const openViewer = (src, title) => {
        if (!src) return;
        setViewerData({ isOpen: true, src, title });
    };

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

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

                {/* Navigation Actions */}
                <div className="premium-nav-actions">
                    <button className="premium-btn-circle back" onClick={handleBack} title="Tornar">
                        <ArrowLeft size={24} />
                    </button>

                    {onAction && (
                        <button className="premium-btn-circle action" onClick={onAction} title="Configuració">
                            {actionIcon || <Settings size={24} />}
                        </button>
                    )}

                    {shareData && (
                        <div className="premium-share-wrapper">
                            <ShareHub
                                title={shareData.title}
                                text={shareData.text}
                                url={shareData.url}
                                className="premium-btn-circle share"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Identity Info Area */}
            <div className="premium-identity-card">
                <div className="premium-avatar-row">
                    <div className={`premium-avatar-wrapper ${avatarUrl ? 'clickable' : ''}`} onClick={() => openViewer(avatarUrl, title)}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={title} className="premium-avatar-img" />
                        ) : (
                            <div className="premium-avatar-placeholder">
                                {(title || '?').trim().charAt(0).toUpperCase()}
                            </div>
                        )}
                        {isLive && <span className="live-indicator-pulse" title="Actiu / Obert ara" />}
                    </div>

                    <div className="premium-main-text">
                        <div className="premium-title-row">
                            <h1 className="premium-title">{title}</h1>
                            {badges.map((badge, idx) => (
                                <span key={idx} className={`premium-badge ${badge.toLowerCase()}`}>
                                    {badge}
                                </span>
                            ))}
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
                                        <p className="premium-town-line">
                                            <MapPin size={14} />
                                            <span>{town}</span>
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
                    <textarea
                        className="premium-edit-textarea bio"
                        value={bio}
                        onChange={(e) => onBioChange?.(e.target.value)}
                        placeholder="Escriu la teua frase o lema de marca..."
                        rows={2}
                    />
                ) : (
                    bio && <p className="premium-bio">{bio}</p>
                )}

                {/* Slot for Stats Bar or other elements */}
                {children && (
                    <div className="premium-card-footer-slot">
                        {children}
                    </div>
                )}
            </div>

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
