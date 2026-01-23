import React from 'react';
import { ArrowLeft, MapPin, Users, Calendar, BadgeCheck, Info } from 'lucide-react';
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
    bio,
    avatarUrl,
    coverUrl,
    stats = [], // [{ label: 'Veïns', value: '1,2k', icon: <Users /> }]
    badges = [], // ['IAIA', 'Oficial', 'Verificat']
    isLive = false, // Per a "Obert ara" en negocis
    onBack
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
                    <button className="premium-back-btn" onClick={handleBack}>
                        <ArrowLeft size={24} />
                    </button>
                    {/* Placeholder for future context actions like share or report */}
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
                        {subtitle && <p className="premium-subtitle">{subtitle}</p>}
                    </div>
                </div>

                {bio && <p className="premium-bio">{bio}</p>}

                {/* Dynamic Stats Row */}
                {stats.length > 0 && (
                    <div className="premium-stats-grid">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="premium-stat-pill">
                                {stat.icon}
                                <div className="premium-stat-data">
                                    <span className="premium-stat-value">{stat.value}</span>
                                    <span className="premium-stat-label">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeaderPremium;
