import React from 'react';
import { ArrowLeft, MapPin, Calendar, BadgeCheck, Info, Share2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    children
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    return (
        <div className={`profile-premium-header-container ${type}`}>
            {/* Cover Area with Glassmorphism Overlay */}
            <div className="premium-cover-section">
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
                </div>
            </div>

            {/* Identity Info Area */}
            <div className="premium-identity-card">
                <div className="premium-avatar-row">
                    <div className="premium-avatar-wrapper">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={title} className="premium-avatar-img" />
                        ) : (
                            <div className="premium-avatar-placeholder">
                                {title?.charAt(0) || '?'}
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
                            {subtitle && <p className="premium-subtitle">{subtitle}</p>}
                            {town && (
                                <p className="premium-town-line">
                                    <MapPin size={14} />
                                    <span>{town}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {bio && <p className="premium-bio">{bio}</p>}

                {/* Slot for Stats Bar or other elements */}
                {children && (
                    <div className="premium-card-footer-slot">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeaderPremium;
