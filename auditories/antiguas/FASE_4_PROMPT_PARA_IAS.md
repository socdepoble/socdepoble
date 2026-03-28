# 🏺 SÓC DE POBLE - FASE 4: AUDITORIA DE PERFIL, VOLTES I CARDS UNIVERSALS

Hola de nou, equip!

Iniciem la **Fase 4** en este entorn totalment net i amb un focus molt precís. Hem aconseguit estabilitzar el xat i la memòria general de l'app en les fases anteriors. Ara ens endinsem en el **nucli de la Identitat i l'Ecosistema**: Els components de Perfil (ProfileHeaderPremium, ProfileSettingsModal, PersonalVault) i l'element visual més omnipotent de tota la plataforma: el **UniversalCard**.

**CONTEXT DEL SISTEMA (Sóc de Poble):**
- Aplicació React + Supabase (Mobile-first, PWA).
- Protocol gràfic pur: *Genesis Radius*, interaccions tàctils prèmium (botons taronja, haptic feedback).
- Entorn de Llistes Virtualitzades: Components com l'UniversalCard es poden arribar a muntar i desmuntar milers de voltes, l'eficiència ací és vida o mort.

**OBJECTIUS DE LA FASE 4:**
Vull que faces una auditoria extrema d'estos components clau cercant i solucionant:
1. **Casos de "Re-render" Tòxic i Fuites:** Sobretot en la càrrega d'imatges/avatars, subscripcions a estats que no toquen, o l'ús d'estats locals que es perden ('Virtuoso').
2. **Components Sobre-alimentats:** UniversalCard és enorme. Hi ha forma de memoitzar estructures internes o simplificar com rep els props sense trencar res?
3. **Seguretat de Modals (ProfileSettingsModal, etc):** Bloqueig de scroll al obrir, restauració neta, sortida via Escape, i prevenció d'enviaments múltiples.
4. **Purga Tècnica:** Strings hardcodejats (i18n), constants perdudes, console.logs fantasma o `setTimeout` bruts bloquejadors del main thread.

A continuació et passe el codi exacte dels components afectats. 
Llig-los, comprèn la seua arquitectura, fes-me un diagnòstic despietat (i precís) dels problemes sistèmics observats, i dóna'm les solucions.

Fes servir blocs `// ❌ ABANS` i `// ✅ DESPRÉS` per als pegats, i si el component requerix cirurgia major, dóna-me'lencer. 

Més Avant! 🚜


----------------------------
ARCHIVOS ALIMENTADOS EN ESTA AUDITORIA FASE 4:


=====================================
FILE: src/components/ProfileHeaderPremium.jsx
=====================================

import React from 'react';
import { 
    ArrowLeft, MapPin, Calendar, BadgeCheck, Info, Share2, MoreVertical, 
    Globe, UserPlus, UserMinus, Loader2, Tag, Shield, Plus, Sun, Moon, Check, X, MessageCircle, Zap, Sparkles,
    Camera, History, ChevronDown, Settings
} from 'lucide-react';
import ShareHub from './ShareHub';
import { useNavigate } from 'react-router-dom';
import MediaViewerModal from './MediaViewerModal';
import { useTheme } from '../context/ThemeContext';
import { trustService } from '../services/trustService';
import './ProfileHeaderPremium.css';

/**
 * UniversalTotem (ex-ProfileHeaderPremium) - El tòtem d'identitat suprema v10.33.2-CANÒNIC.
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
    nif,
    duns,
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
                                        <div className="identity-official-badges flex gap-2 mt-2 px-4">
                                            {nif && (
                                                <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">NIF: {nif}</span>
                                            )}
                                            {duns && (
                                                <span className="text-[10px] font-bold text-blue-400 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">DUNS: {duns}</span>
                                            )}
                                        </div>
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
                                <img src="/assets/master/logo-socdepoble-rect.svg" alt="Sóc de Poble" className="pulse-logo" />
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
                        
                        {showConnect && (
                            <div className="flex justify-center mt-6">
                                <button 
                                    className={`premium-connect-pill ${isConnected ? 'connected' : ''} master-button-canonic w-full max-w-sm`}
                                    onClick={handleConnectClick}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            <span>{isConnected ? 'CONEGUIT' : 'CONNECTAR'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="premium-ai-profile-tools mt-8">
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
                            {['Gent', 'Amic', 'Treball', 'Comerç', 'Oficial', 'Cultura'].map(tag => (
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
                            <button className="rhizome-btn-skip" onClick={() => confirmConnection('Gent')}>
                                Omplir com a "Gent"
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



=====================================
FILE: src/components/ProfileSettingsModal.jsx
=====================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Globe, MapPin, Plus, Loader2, Camera, User, Image as ImageIcon, Beaker, ShieldAlert, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import TownSelectorModal from '../components/TownSelectorModal';
import LanguageSelector from '../components/LanguageSelector';
import '../pages/Auth.css'; // Reusing some base styles
import { authService } from '../services/authService';

const ProfileSettingsModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const isSuperAdmin = currentUser?.role === 'super_admin';
    const navigate = useNavigate();
    
    const [isSaving, setIsSaving] = useState(false);
    const [townSelector, setTownSelector] = useState({ isOpen: false, type: null });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    // Local state for optimistic UI updates before saving
    const [localProfile, setLocalProfile] = useState({
        full_name: profile?.full_name || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        cover_url: profile?.cover_url || '',
        town_uuid: profile?.town_uuid || null,
        town_name: profile?.town_name || null,
        secondary_towns: profile?.secondary_towns || [],
        secondary_towns_names: profile?.secondary_towns_names || [], // Assuming we need names
        cover_position_y: profile?.cover_position_y || 50 // Default to 50%
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
    const [coverPreview, setCoverPreview] = useState(profile?.cover_url || '');
    const [coverPositionY, setCoverPositionY] = useState(profile?.cover_position_y || 50);

    // Ensure state updates completely when modal opens or profile changes
    const [townNamesCache, setTownNamesCache] = useState({});

    useEffect(() => {
        if (isOpen && profile) {
            setLocalProfile({
                full_name: profile.full_name || '',
                bio: profile.bio || '',
                avatar_url: profile.avatar_url || '',
                cover_url: profile.cover_url || '',
                town_uuid: profile.town_uuid || null,
                town_name: profile.town_name || null,
                secondary_towns: profile.secondary_towns || [],
                cover_position_y: profile.cover_position_y || 50
            });
            setAvatarPreview(profile.avatar_url || '');
            setCoverPreview(profile.cover_url || '');
            setCoverPositionY(profile.cover_position_y || 50);
            setAvatarFile(null);
            setCoverFile(null);

            // Fetch town names for secondary towns if needed
            const loadTownNames = async () => {
                try {
                    const allTowns = await supabaseService.getTowns();
                    const cache = {};
                    allTowns.forEach(t => {
                        cache[t.uuid || t.id] = t.name;
                    });
                    setTownNamesCache(cache);
                } catch (e) {
                    console.error("Failed loading towns cache for names:", e);
                }
            };
            loadTownNames();
        }
    }, [isOpen, profile]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates = {
                full_name: localProfile.full_name,
                bio: localProfile.bio,
                town_uuid: localProfile.town_uuid,
                town_name: localProfile.town_name,
                secondary_towns: localProfile.secondary_towns || [],
                cover_position_y: coverPositionY // Add cover position to updates
            };

            if (avatarFile) {
                const uploadRes = await supabaseService.uploadAvatar(profile.id, avatarFile);
                updates.avatar_url = uploadRes.url || uploadRes.publicUrl;
            }
            if (coverFile) {
                const uploadRes = await supabaseService.uploadCover(profile.id, coverFile);
                updates.cover_url = uploadRes.url || uploadRes.publicUrl;
            }

            const { error } = await supabaseService.updateProfile(profile.id, updates);
            if (error) throw error;

            if (onProfileUpdate) {
                onProfileUpdate(updates);
            }
            onClose();
        } catch (error) {
            console.error('[ProfileSettings] Error updating profile:', error);
            alert("Error al desar la configuració.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            await authService.deleteCurrentUser();
            onClose();
            // Redirigir a l'inici / login
            navigate('/', { replace: true });
        } catch (error) {
            console.error('[ProfileSettings] Error deleting account:', error);
            alert("S'ha produït un error al intentar eliminar el compte base. Contacta amb suport si el problema persistix.");
            setShowDeleteConfirm(false);
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const openTownSelector = (type) => { // 'primary', 'secondary1', 'secondary2'
        setTownSelector({ isOpen: true, type });
    };

    const handleTownSelect = async (town) => {
        setTownSelector({ isOpen: false, type: null });
        if (!town) return;

        if (townSelector.type === 'primary') {
            setLocalProfile(prev => ({
                ...prev,
                town_uuid: town.uuid || town.id,
                town_name: town.name
            }));
        } else if (townSelector.type === 'secondary') {
            const currentSecondary = [...(localProfile.secondary_towns || [])];
            // Replace if 2 exist, else append
            if (currentSecondary.length >= 2) {
                currentSecondary[1] = town.uuid || town.id;
            } else {
                currentSecondary.push(town.uuid || town.id);
            }
            
            setLocalProfile(prev => ({
                ...prev,
                secondary_towns: currentSecondary
            }));
        }
    };

    // Helper to get town name by ID (needs to fetch if just ID)
    // For simplicity we might just show ID if name is unknown, or fetch it.
    // In a real scenario we'd query the DB for the names of secondary_towns.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-theme-panel border border-[var(--border-master)] rounded-[28px] w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-6 border-b border-[var(--border-master)]">
                    <h2 className="text-xl font-black uppercase tracking-widest text-[var(--theme-accent-primary)]">Configuració (BETA)</h2>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User size={18} className="text-[var(--theme-accent-primary)]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Identitat del Node</h3>
                        </div>

                        {/* Covers & Avatars */}
                        <div className="relative w-full h-32 rounded-2xl bg-black/40 overflow-visible border border-white/10 mb-10 mt-6 group/cover">
                            {coverPreview ? (
                                <img 
                                    src={coverPreview} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover opacity-60 rounded-2xl" 
                                    style={{ objectPosition: `50% ${coverPositionY}%` }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center rounded-2xl cursor-pointer" onClick={() => document.getElementById('cover-input').click()}>
                                    <ImageIcon size={32} className="text-white/20" />
                                </div>
                            )}

                            {/* Editing Controls for Cover */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity z-20">
                                <button className="bg-black/80 p-2 rounded-full shadow-xl hover:bg-[var(--theme-accent-primary)] transition-colors" title="Penjar Nova Foto" onClick={() => document.getElementById('cover-input').click()}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            
                            {/* Hover Adjust Hint */}
                            {coverPreview && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="bg-black/80 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--theme-accent-primary)] shadow-xl backdrop-blur-sm border border-white/20 mb-2">Ajusta Alçada Paret</span>
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        value={coverPositionY} 
                                        onChange={(e) => setCoverPositionY(e.target.value)}
                                        className="w-32 h-2 rounded-xl accent-[var(--theme-accent-primary)] pointer-events-auto"
                                        title="Llisca per centrar la teva foto"
                                    />
                                </div>
                            )}

                            <input type="file" id="cover-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCoverChange} />
                            
                            {/* Avatar */}
                            <div className="absolute -bottom-8 left-6 z-30" onClick={(e) => { e.stopPropagation(); document.getElementById('avatar-input').click(); }}>
                                <div className="relative w-24 h-24 rounded-[50%] border-[3px] border-solid border-[var(--bg-master)] overflow-hidden bg-gray-900 group/avatar cursor-pointer shadow-xl isolate aspect-square flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-opacity rounded-[50%] block aspect-square" style={{ borderRadius: '50%' }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <User size={32} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-white drop-shadow-md" />
                                    </div>
                                    <input type="file" id="avatar-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleAvatarChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Nom / Denominació</label>
                                <input 
                                    type="text" 
                                    value={localProfile.full_name || ''} 
                                    onChange={(e) => setLocalProfile({...localProfile, full_name: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--theme-accent-primary)]/50 focus:ring-1 focus:ring-[var(--theme-accent-primary)]/50 transition-all font-bold"
                                    placeholder="Com et dius?"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Presentació (Bio)</label>
                                <textarea 
                                    value={localProfile.bio || ''} 
                                    onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--theme-accent-primary)]/50 focus:ring-1 focus:ring-[var(--theme-accent-primary)]/50 transition-all resize-none h-24 text-sm"
                                    placeholder="Una breu descripció..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-px w-full bg-white/5 my-0"></div>
                    {/* Language Section via Universal Component */}
                    <div className="w-full">
                        <LanguageSelector variant="profile" />
                    </div>

                    {/* Towns Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} className="text-[var(--theme-accent-primary)]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Vinculació Territorial</h3>
                        </div>

                        {/* Primary Town */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                                <span>Poble Principal</span>
                                <span className="text-[var(--theme-accent-primary)]">CENSAT</span>
                            </p>
                            <div 
                                className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
                                onClick={() => openTownSelector('primary')}
                            >
                                <span className="font-bold text-lg">{localProfile.town_name || 'No especificat'}</span>
                                <span className="text-xs bg-[var(--theme-accent-primary)]/20 text-[var(--theme-accent-primary)] px-2 py-1 rounded-full uppercase font-black">Canviar</span>
                            </div>
                        </div>

                        {/* Secondary Towns */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                                Pobles Secundaris / Vinculats (Max. 2)
                            </p>
                            <div className="space-y-2">
                                {(localProfile.secondary_towns || []).map((tUUID, idx) => {
                                    const townName = townNamesCache[tUUID] || `Poble ${idx + 2}`;
                                    return (
                                        <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] flex items-center justify-center font-black text-xs">
                                                    {idx + 2}
                                                </div>
                                                <span className="text-sm font-bold text-theme-text">{townName}</span>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newSec = [...localProfile.secondary_towns];
                                                    newSec.splice(idx, 1);
                                                    setLocalProfile(prev => ({...prev, secondary_towns: newSec}));
                                                }}
                                                className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                                title="Desempatxar"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {(localProfile.secondary_towns || []).length < 2 && (
                                    <button 
                                        onClick={() => openTownSelector('secondary')}
                                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 transition-all text-sm font-bold hover:bg-white/5 mt-2"
                                    >
                                        <Plus size={18} />
                                        Vincular nou Poble
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zona de Perill */}
                    <div className="space-y-4 pt-6 border-t border-[var(--border-master)]">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert size={18} className="text-red-500" />
                            <h3 className="font-bold uppercase tracking-wider text-sm text-red-500">Zona de Perill</h3>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                            <p className="text-[11px] font-medium text-gray-300 mb-4 leading-relaxed">
                                En virtut de la normativa de sobiranía digital (GDPR), pots eliminar el teu compte i totes les teues dades de forma completament permanent. <strong className="text-red-400">Aquesta acció NO es pot desfer ni recuperar.</strong>
                            </p>
                            {!showDeleteConfirm ? (
                                <button 
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full py-3 bg-black/60 border border-red-500/30 text-red-500 font-bold uppercase tracking-wider rounded-xl hover:bg-red-500/20 transition-all text-sm"
                                >
                                    Eliminar el meu compte
                                </button>
                            ) : (
                                <div className="space-y-3 bg-red-950/40 p-3 rounded-xl border border-red-500/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm font-black text-red-400 uppercase tracking-widest text-center mb-1">Doble Confirmació</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleDeleteAccount}
                                            disabled={isDeletingAccount}
                                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 text-xs h-12"
                                        >
                                            {isDeletingAccount ? <Loader2 size={16} className="animate-spin" /> : 'SÍ, ESBORRAR'}
                                        </button>
                                        <button 
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={isDeletingAccount}
                                            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider rounded-lg transition-all text-xs h-12"
                                        >
                                            CANCEL·LAR
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {isSuperAdmin && (
                        <>
                            <div className="h-px w-full bg-emerald-500/20 my-2"></div>
                            {/* Nivell 3: El Llavador (Laboratori de Mestres) */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Beaker size={24} className="text-emerald-400" />
                                    <h3 className="font-extrabold uppercase tracking-widest text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                                        🧪 EL LLAVADOR (Laboratori)
                                    </h3>
                                </div>
                                
                                <div className="bg-[#052e16]/40 border border-[#10b981]/30 rounded-3xl p-6 relative overflow-hidden group">
                                    {/* Visual hacker/glitch artifact overlay */}
                                    <div className="absolute inset-0 bg-[url('/assets/patterns/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                                    <div className="absolute -inset-x-full top-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
                                    
                                    <div className="flex items-start gap-3 mb-6">
                                        <ShieldAlert className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Controls del Rhizome</p>
                                            <p className="text-xs text-emerald-600/80 uppercase font-mono mt-1">Nivell de Seguretat: SUPER_ADMIN</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 relative z-10 w-full">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onClose();
                                                navigate('/admin');
                                            }}
                                            className="w-full flex items-center justify-between gap-3 p-4 bg-black/60 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/40 rounded-2xl transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Terminal size={18} className="text-emerald-500" />
                                                <span className="text-sm text-emerald-100 font-bold uppercase tracking-wider">Console: Administració Síncrona</span>
                                            </div>
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase font-black animate-pulse">
                                                ACTIU
                                            </span>
                                        </button>

                                        <button className="w-full flex items-center justify-between gap-3 p-4 bg-black/60 border border-red-500/20 hover:border-red-500/50 hover:bg-red-950/40 rounded-2xl transition-all opacity-80 hover:opacity-100">
                                            <div className="flex items-center gap-3">
                                                <ShieldAlert size={18} className="text-red-500" />
                                                <span className="text-sm text-red-100 font-bold uppercase tracking-wider">Mode Forense (Logs)</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-[var(--border-master)] bg-black/40">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-[#F97316] hover:opacity-90 text-white font-black uppercase tracking-widest py-4 rounded-[20px] transition-all flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : 'Guardar Canvis'}
                    </button>
                </div>
            </div>

            {/* Town Selector Modal */}
            <TownSelectorModal 
                isOpen={townSelector.isOpen} 
                onClose={() => setTownSelector({ isOpen: false, type: null })}
                onSelect={handleTownSelect}
            />
        </div>
    );
};

export default ProfileSettingsModal;



=====================================
FILE: src/components/ProfilePowerMenu.jsx
=====================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    X, User, MessageSquare, Briefcase, Settings, Database, 
    Users, Calendar, Image as ImageIcon, LogOut, ChevronRight,
    Shield, Sparkles, Brain, Map as MapIcon, Wrench, LayoutGrid,
    Store, MapPin, Zap, FileText, ShieldCheck, Cpu
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import './ProfilePowerMenu.css';

const PILARS_SAGRATS = [
  { id: "perfil", label: "Perfil Sobirà", icon: User, to: "/perfil", featured: true },
  { id: "chats", label: "Xat i Consells", icon: MessageSquare, to: "/chats" },
  { id: "mur", label: "Mur del Poble", icon: LayoutGrid, to: "/mur" },
  { id: "mercat", label: "Mercat Rural", icon: Store, to: "/mercat" },
  { id: "pobles", label: "Pobles i Gent", icon: MapPin, to: "/pobles" },
  { id: "nexus", label: "Nexus Flash", icon: Zap, to: "/nexus" },
  { id: "mapa", label: "Mapa Tàctic", icon: MapIcon, to: "/mapa" },
];

const RECURSOS_IDENTITAT = [
  { id: "notes", label: "Bloc de Notes", icon: Settings, to: "/notes" },
  { id: "arxiu", label: "Relíquies (Arxiu)", icon: Database, to: "/arxiu" },
  { id: "calendari", label: "Agenda del Mas", icon: Calendar, to: "/calendari" },
  { id: "infoteca", label: "Infoteca Gallery", icon: ImageIcon, to: "/infoteca" },
  { id: "genesis", label: "Gènesi Viewer", icon: Database, to: "/genesis" },
  { id: "solatge", label: "Solatge Console", icon: Database, to: "/solatge" },
];

const OFICI_GESTIO = [
  { id: "ofici", label: "Ofici de Doc.", icon: FileText, to: "/ofici" },
  { id: "ajudes", label: "Buscador d'Ajudes", icon: ShieldCheck, to: "/ajudes" },
  { id: "dossier", label: "Dossier de Socis", icon: Briefcase, to: "/dossier" },
  { id: "directori", label: "Directori de Gent", icon: Users, to: "/directori" },
  { id: "iaia_hub", label: "La IAIA Hub", icon: Sparkles, to: "/iaia" },
];

const TECNIC_MESTRE = [
  { id: "chrome145", label: "Informe Chrome 145", icon: Cpu, to: "/chrome-145" },
  { id: "utilitats", label: "Utilitats Master", icon: Wrench, to: "/utilitats" },
  { id: "accessibilitat", label: "Accessibilitat", icon: Shield, to: "/accessibilitat" },
];

const ProfilePowerMenu = () => {
    const { isProfileMenuOpen, closeProfileMenu } = useNavigation();
    const { user, profile, signOut, isSuperAdmin, isAdmin } = useAuth();

    if (!isProfileMenuOpen) return null;

    return (
        <div className="profile-power-menu-overlay" onClick={closeProfileMenu}>
            <div className="power-menu-container animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                {/* HEADER: IDENTITY */}
                <header className="power-header">
                    <div className="user-info-large">
                        <div className="avatar-huge">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="User" />
                            ) : (
                                <span>{profile?.full_name?.substring(0, 1) || user?.email?.substring(0, 1).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="u-text">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">{profile?.full_name || user?.email?.split('@')[0] || 'Sóc de Poble'}</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{user?.email}</p>
                        </div>
                    </div>
                    <button className="close-power-btn" onClick={closeProfileMenu}>
                        <X size={24} />
                    </button>
                </header>

                <div className="power-grid">
                    {/* SECTION: PILARS DEL MAS */}
                    <div className="power-section">
                        <h3 className="section-title">Pilars del Mas</h3>
                        <div className="pg-items">
                            {PILARS_SAGRATS.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className={`pg-item ${item.featured ? 'pg-item-featured' : ''}`}
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    {item.featured && <span className="ml-auto text-[10px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-[28px] uppercase tracking-widest">Obrir</span>}
                                    {!item.featured && <ChevronRight size={14} className="ml-auto opacity-20" />}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: IDENTITAT i RECURSOS */}
                    <div className="power-section">
                        <h3 className="section-title">Identitat i Recursos</h3>
                        <div className="pg-items">
                            {RECURSOS_IDENTITAT.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: OFICI i GESTIÓ */}
                    <div className="power-section">
                        <h3 className="section-title">Ofici i Gestió</h3>
                        <div className="pg-items">
                            {OFICI_GESTIO.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: TÈCNIC & MESTRE */}
                    <div className="power-section">
                        <h3 className="section-title">Tècnic & Mestre</h3>
                        <div className="pg-items">
                            {TECNIC_MESTRE.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                            
                            {/* ADMIN PANEL: NOMÉS MESTRE */}
                            {(isSuperAdmin || isAdmin) && (
                                <NavLink 
                                    to="/admin" 
                                    className="pg-item bg-orange-500/5 group" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon text-orange-500"><Shield size={20} /></div>
                                    <span className="pg-label text-orange-500 font-black">Panell d'Admin</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* SECTION: AJUSTES & SOBIRANIA */}
                    <div className="power-section">
                        <h3 className="section-title">Sobirania</h3>
                        <div className="pg-items">
                             <div className="pg-item disabled opacity-50">
                                <div className="pg-icon"><Shield size={20} /></div>
                                <span className="pg-label">Privacitat Rhizome</span>
                             </div>
                             <div className="pg-item" onClick={() => { signOut(); closeProfileMenu(); }}>
                                <div className="pg-icon text-red-500"><LogOut size={20} /></div>
                                <span className="pg-label text-red-500">Tancar Sessió</span>
                             </div>
                        </div>
                    </div>
                </div>

                <footer className="power-footer">
                    <div className="footer-v">v10.33.3-CANÒNIC</div>
                    <div className="archon-status flex items-center gap-2">
                        <Brain size={12} className="text-fuchsia-500" />
                        <span>ARCHON CONNECTED</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ProfilePowerMenu;



=====================================
FILE: src/components/PersonalVault.jsx
=====================================

import React, { useState, useMemo } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { docExtractionService } from '../services/docExtractionService';
import { logger } from '../utils/logger';
import './PersonalVault.css';

/**
 * PersonalVault [PRIVATE DOCUMENT VAULT]
 * Gestiona el processament de documents personals contra requeriments de tràmits.
 */
const PersonalVault = ({ onDataExtracted, procedureId }) => {
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Requeriments derivats (sense estat per evitar renders en cascada)
    const requirements = useMemo(() => {
        return procedureId ? docExtractionService.getRequirements(procedureId) : [];
    }, [procedureId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await docExtractionService.processDocument(file, requirements);
            const newDoc = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                size: file.size,
                extractedData: result,
                timestamp: new Date().toISOString()
            };
            
            setDocuments(prev => [...prev, newDoc]);
            if (onDataExtracted) onDataExtracted(result);
            logger.log('[PersonalVault] Document processed:', file.name);
        } catch (err) {
            logger.error('[PersonalVault] Error processing document:', err);
            alert('Error processant el document: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeDocument = (id) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    return (
        <div className="personal-vault-container p-6 bg-[#0a0a0c] rounded-[28px] border border-white/5 shadow-2xl">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/10 text-blue-400 rounded-[28px]">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white leading-none mb-1">El Meu Rebost de Documents</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Processament Segur</p>
                    </div>
                </div>
                <div className="upload-zone">
                    <input 
                        type="file" 
                        id="vault-upload" 
                        className="hidden" 
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <label 
                        htmlFor="vault-upload"
                        className={`flex items-center gap-2 px-6 h-12 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all cursor-pointer ${
                            isUploading ? 'bg-gray-800 text-gray-500' : 'bg-[var(--theme-accent-primary)] text-white hover:bg-orange-600 shadow-lg active:scale-95'
                        }`}
                    >
                        <Upload size={18} />
                        <span>{isUploading ? 'Processant...' : 'Pujar Document'}</span>
                    </label>
                </div>
            </header>

            {requirements && requirements.length > 0 && (
                <div className="mb-8 p-4 bg-white/5 rounded-[28px] border border-white/5">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Requeriments del Tràmit</h4>
                    <div className="flex flex-wrap gap-2">
                        {requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-[28px] border border-white/5">
                                <span className="text-xs text-gray-300">{req}</span>
                                <CheckCircle size={14} className="text-emerald-500 opacity-40" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="documents-list space-y-4">
                {documents.length > 0 ? documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-[28px] border border-white/5 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-orange-500/10 text-blue-400 rounded-[28px]">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{doc.name}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
                                    {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/10">
                                <CheckCircle size={12} />
                                <span>Verificat</span>
                            </div>
                            <button 
                                onClick={() => removeDocument(doc.id)}
                                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-[28px] transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-12 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-[28px]">
                        <AlertCircle size={48} className="mb-4 text-gray-600" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">No hi ha documents</p>
                    </div>
                )}
            </div>
            
            <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    Seguretat de Ferro • DID-SP Encrypt
                </div>
                <button 
                    onClick={() => setDocuments([])}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                    <X size={14} />
                    <span>Netejar Todo</span>
                </button>
            </footer>
        </div>
    );
};

export default PersonalVault;



=====================================
FILE: src/components/RebostVault.jsx
=====================================

import React, { useState, useEffect, useRef } from 'react';
import { 
    Upload, Plus, Search, Archive, AlertCircle, Share2, 
    CheckCircle2, ShieldCheck, HardDrive 
} from 'lucide-react';
import { migrationService } from '../services/MigrationService';
import { notionService } from '../services/notionService';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import ResourceCard from './ResourceCard';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import './RebostVault.css';

import { historicalRecoveryService } from '../services/HistoricalRecoveryService';

/**
 * RebostVault [PRIVATE VAULT]
 * Magatzem sobirà per a recursos personals i importacions de Raindrop.
 */
const RebostVault = ({ onClose }) => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [importStats, setImportStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchResources = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Prioritat 1: Supabase (Dades Sobiranes)
            const { data, error } = await supabaseService.supabase
                .from('resources')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') throw error; 

            let finalResources = data || [];

            // Prioritat 2: Injecció de Mocks si està buit (Raindrop/Notion Virtual)
            if (finalResources.length === 0) {
                try {
                    const { raindropService } = await import('../services/raindropService');
                    const raindropMocks = await raindropService.getCollection();
                    const notionMocks = notionService.getMockVolume(5);
                    finalResources = [...raindropMocks, ...notionMocks];
                } catch (mockErr) {
                    logger.warn('[Rebost] Error carregant serveis de mock:', mockErr);
                }
            }

            setResources(finalResources);
        } catch (err) {
            logger.warn('[Rebost] Error obtenint recursos, entrant en mode resilient:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        setImportStats(null);

        try {
            const text = await file.text();
            let items = [];

            if (file.name.endsWith('.html')) {
                items = migrationService.parseRaindropHTML(text);
            } else if (file.name.endsWith('.json')) {
                const rawItems = migrationService.parseNotionJSON(text);
                items = rawItems.map(item => notionService.mapToResource(item));
            } else if (file.name.endsWith('.xml')) {
                if (text.includes('xmlns:wp="http://wordpress.org/export/')) {
                    items = historicalRecoveryService.parseWordPressXML(text);
                } else if (text.includes('type="text/html"') && text.includes('<entry>')) {
                    items = historicalRecoveryService.parseBloggerXML(text);
                } else {
                    throw new Error('Format XML no reconegut.');
                }
            } else {
                alert('Format no suportat.');
                setIsImporting(false);
                return;
            }

            if (items.length === 0) {
                alert('No s\'han trobat dades vàlides.');
                setIsImporting(false);
                return;
            }

            const result = await migrationService.importToRebost(items, user.id);
            
            // Sensació de processament intel·ligent (Refinament MArIA)
            setTimeout(() => {
                setImportStats(result);
                setIsImporting(false);
                fetchResources();
            }, 1200);

        } catch (err) {
            logger.error('[Rebost] Error importació:', err);
            alert('Error: ' + err.message);
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        if (resources.length === 0) return;
        await migrationService.exportRebostData(resources);
    };

    const handleShare = async (resource) => {
        const confirmShare = window.confirm(`Vols "trastombar" ${resource.title} al poble?`);
        if (!confirmShare) return;

        try {
            const { error } = await supabaseService.supabase
                .from('resources')
                .update({ is_public: true, scope: 'public' })
                .eq('id', resource.id);

            if (error) throw error;
            fetchResources();
        } catch (err) {
            logger.error('[Rebost] Error compartint:', err);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading && resources.length === 0) return <StatusLoader message="Preparant el Rebost..." />;

    return (
        <div className="rebost-vault animate-in p-6 bg-[#0a0a0c] min-h-full">
            <header className="rebost-header flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="rebost-title-section flex items-center gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-white/5 hover:bg-white/10 transition-all" onClick={onClose}>
                        <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-[28px]">
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white leading-none mb-1">El Rebost Sobirà</h2>
                        <p className="text-sm text-gray-500 uppercase font-black tracking-widest opacity-60">Magatzem Privat</p>
                    </div>
                </div>

                <div className="rebost-actions flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <ShieldCheck size={14} />
                        <span>Veritat de Ferro</span>
                    </div>
                    <button className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-[28px] transition-all" onClick={handleExport} title="Exporta Memòria">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-6 h-12 bg-[var(--theme-accent-primary)] text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-950/20 active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} />
                        <span>Importar</span>
                    </button>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".html,.json,.xml" onChange={handleFileSelect} />
                </div>
            </header>

            {importStats && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] flex items-center justify-between text-emerald-400 text-sm font-bold">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} />
                        <span>¡Bategat! S'han afegit {importStats.successful} recursos.</span>
                    </div>
                    <button onClick={() => setImportStats(null)} className="hover:rotate-90 transition-transform">×</button>
                </div>
            )}

            <div className="rebost-tools flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Busca al teu rebost..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/5 rounded-[24px] pl-12 pr-6 text-white text-sm focus:outline-none focus:border-[var(--theme-accent-primary)]/40 transition-all font-medium"
                    />
                </div>
                <div className="px-4 flex items-center bg-white/5 rounded-[24px] text-[11px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                    {resources.length} Recursos
                </div>
            </div>

            {isImporting ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-60">
                    <StatusLoader type="loading" message="Refinant dades amb MArIA..." />
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard
                            key={resource.id || resource.uuid}
                            resource={resource}
                            onShare={handleShare}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 opacity-20 text-center">
                    <AlertCircle size={64} className="mb-6 text-gray-600" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Rebost Buit</h3>
                    <p className="text-sm text-gray-500 font-bold">Importa la teua memòria digital.</p>
                </div>
            )}
        </div>
    );
};

export default RebostVault;



=====================================
FILE: src/components/UniversalCard.jsx
=====================================

import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useNavigation } from '../context/NavigationContext';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';


import { Calendar, Plus, ImageIcon } from 'lucide-react';
import Avatar from './Avatar';

import UniversalCardHeader from './UniversalCardHeader';
import UniversalCardMedia from './UniversalCardMedia';
import UniversalCardBody from './UniversalCardBody';
import UniversalCardFooter from './UniversalCardFooter';
import BlueprintOverlay from './BlueprintOverlay';
import './UniversalCard.css';


/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM] - REFACTORED
 * ---------------------------------------
 * DIRECTIVA SUPREMA: Aquest component és la unitat atòmica del Gènesi.
 * Estructura dividida en Base, Header, Media, Body, i Footer 
 * per complir el "Single Responsibility Principle".
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
    mode = "post", 
    variant = "post",
    isBating = false,
    excerpt,
    images,
    isOfficial: forcedOfficial = false,
    forensicMode: forcedForensic = false,
    viewMode = "grid"
}) => {

    const cardVariant = variant || mode;
    const { openViewer } = useModal();
    const { forensicMode: contextForensic } = useNavigation();

    const { gloveMode, seniorMode, hapticService } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const isMaster = isAdmin || user?.app_metadata?.role === 'master';

    // MULTIMEDIA RESOLUTION
    const FALLBACK_NANO_IMAGES = [
        "/assets/brain/generations/nano_llibre_memoria.png",
        "/assets/brain/generations/nano_fibra_espart.png",
        "/assets/brain/generations/nano_dron_agricola.png",
        "/assets/brain/generations/nano_mercat_llavors.png",
        "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
        "/assets/brain/generations/nano_porta_masia_1774197069297.png",
        "/assets/brain/generations/nano_rentonar_arquitectura_1774196001924.png",
        "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"
    ];

    const mediaList = React.useMemo(() => images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null), [images, item?.images, item?.image_url, image]);
    let displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    if (!displayImage) {
        const strId = String(item?.id || item?.uuid || title || item?.name || '1');
        let hash = 0;
        for (let i = 0; i < strId.length; i++) {
            hash = strId.charCodeAt(i) + ((hash << 5) - hash);
        }
        displayImage = FALLBACK_NANO_IMAGES[Math.abs(hash) % FALLBACK_NANO_IMAGES.length];
    }

    const displayTitle = title || item?.title || item?.name || "Sóc de Poble";
    const displayPrice = item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : "");
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const createdAtDate = item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null);
    const displayDate = createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda";
    const displayTime = createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || "");

    const isOfficial = forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles';
    const isAlert = React.useMemo(() => item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert || item?.category === 'Danger', [item?.category, item?.type, item?.is_alert]);
    const isSostenible = React.useMemo(() => item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'), [item?.category, item?.tags]);

    const handleCardClick = React.useCallback(() => {
        if (seniorMode && hapticService?.trigger) {
            hapticService.trigger('medium');
        }
        const id = item?.uuid || item?.id;
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate, seniorMode, hapticService]);

    const handleConnectClick = React.useCallback(async (e) => {
        e.stopPropagation();

        const postId = item?.uuid || item?.id;
        if (!postId) {
            console.error("No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        // [ESCAPARATE PATTERN DOCTRINE] All direct connection clicks on feeds must route to the item detail to avoid accidental inputs
        // The detailed view handles the actual connection/save/tagging
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${postId}?action=connect`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${postId}?action=connect`);
        } else {
            navigate(`/post/${postId}?action=connect`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const CardContent = (
        <article
            className={`universal-card card-variant-${cardVariant} view-mode-${viewMode} ${className} relative w-full rounded-[28px] overflow-hidden bg-theme-panel shadow-2xl border border-white/5 flex flex-col transition-all duration-500 hover:shadow-black/50 ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${seniorMode ? 'senior-mode' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'category-danger alert-active' : ''} ${isSostenible ? 'category-sostenible' : ''} ${isForensic ? 'mode-forense-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {viewMode === 'list' ? (
                <div className="card-list-layout h-24 flex items-center px-4 md:px-6 gap-4 hover:bg-white/[0.02] transition-colors relative isolate">
                    <div className="card-list-thumbnail flex-shrink-0 w-16 h-16 rounded-[20px] shadow-inner overflow-hidden border border-white/10 relative z-10">
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="w-full h-full object-cover rounded-[20px] hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/20">
                                <ImageIcon size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4 z-10">
                        <h4 className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide">{displayTitle}</h4>
                        <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide truncate mt-1">
                            <span className="text-[var(--theme-accent-primary)]">{displayAuthor}</span>
                            <span>•</span>
                            <span className="opacity-70">{displayTown.replace("Poble Principal:", "").trim()}</span>
                        </div>
                    </div>
                    
                    {displayPrice && (
                        <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-[28px] flex-shrink-0 z-10">
                            {displayPrice}
                        </div>
                    )}
                    
                    <button 
                        className="btn-connect-canonic shrink-0 ml-2 flex h-10 px-6 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] border border-white/10 rounded-full items-center justify-center gap-2 font-black text-[12px] text-slate-900 bg-[#F97316] tracking-wide transition-all z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConnectClick(e);
                        }}
                    >
                        CONNECTAR
                    </button>
                    
                    {/* Ghost hit area to ensure the background takes the hover safely */}
                    <div className="absolute inset-0 z-0"></div>
                </div>
            ) : (
                <>
                    <UniversalCardHeader 
                        item={item}
                        cardVariant={cardVariant}
                        displayTown={displayTown}
                        displayAuthor={displayAuthor}
                        avatarSrc={avatarSrc}
                        avatarRole={avatarRole}
                        isOfficial={isOfficial}
                        displayDate={displayDate}
                        displayTime={displayTime}
                    />

                    <UniversalCardMedia 
                        item={item}
                        cardVariant={cardVariant}
                        mediaList={mediaList}
                        displayImage={displayImage}
                        displayTitle={displayTitle}
                        openViewer={openViewer}
                        navigate={navigate}
                    />

                    <Suspense fallback={<div className="h-16 mt-2 rounded bg-surface-var/30 animate-pulse w-full max-w-sm"></div>}>
                        <UniversalCardBody 
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            item={item}
                            isOfficial={isOfficial}
                            children={children}
                            navigate={navigate}
                            cardVariant={cardVariant}
                            displayPrice={displayPrice}
                        />
                    </Suspense>

                    <Suspense fallback={<div className="h-10 mt-4 rounded bg-surface-var/30 animate-pulse w-[80%]"></div>}>
                        <UniversalCardFooter 
                            item={item}
                            cardVariant={cardVariant}
                            displayTitle={displayTitle}
                            displayExcerpt={displayExcerpt}
                            isMaster={isMaster}
                            navigate={navigate}
                            handleConnectClick={handleConnectClick}
                        />
                    </Suspense>
                </>
            )}
        </article>
    );

    // Avoid useLocation hook to prevent re-renders when local routing changes (improves feed performance)
    const isChatRoute = typeof window !== 'undefined' ? window.location.pathname.startsWith('/chats') : false;

    const FinalCard = (
        <div className="min-w-0 w-full">
            {CardContent}
        </div>
    );

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${cardVariant.toUpperCase()} | R: 28PX`} color="cyan">
            {FinalCard}
        </BlueprintOverlay>
    ) : FinalCard;
};

const normalizeClass = (cls) => (cls || '').split(' ').filter(Boolean).sort().join(' ');

const propsAreEqual = (prevProps, nextProps) => {
    const prevId = prevProps.item?.uuid || prevProps.item?.id;
    const nextId = nextProps.item?.uuid || nextProps.item?.id;
    return (
        prevId === nextId &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.item?.connections_count === nextProps.item?.connections_count &&
        prevProps.item?.comments_count === nextProps.item?.comments_count &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating &&
        normalizeClass(prevProps.className) === normalizeClass(nextProps.className) &&
        prevProps.variant === nextProps.variant &&
        prevProps.mode === nextProps.mode
    );
};

export default React.memo(UniversalCard, propsAreEqual);



=====================================
FILE: src/components/UniversalCardBody.jsx
=====================================

import React from 'react';
import { ChevronRight } from 'lucide-react';

const UniversalCardBody = ({
    displayTitle,
    displayExcerpt,
    item,
    children,
    navigate,
    cardVariant,
    displayPrice
}) => {
    const TRUNCATE_LENGTH = 280;
    
    // Algorisme de densitat de Flex per a targetes de 824px absoluts
    const hasTags = item?.tags && item.tags.length > 0;
    
    // Determinar quina estratègia matematica CSS utilitzar
    let smartClampClass = hasTags ? 'smart-clamp-tags' : 'smart-clamp-notags';

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        if (!id) return;
        
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div className="card-body flex flex-col flex-1 min-h-0 relative z-10 p-0">
            <div 
                className="flex flex-col flex-1 min-h-0 px-5 pt-5 pb-6 overflow-hidden cursor-pointer group"
                onClick={handleReadMoreClick}
                role="button"
                tabIndex={0}
                aria-label={`Obrir la pàgina per a llegir: ${displayTitle}`}
            >
                <div className="title-row flex flex-col items-start gap-1 pb-1 shrink-0 group-hover:opacity-80 transition-opacity">
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[1.3rem] sm:text-[1.5rem] font-black text-theme-text leading-tight line-clamp-2 tracking-tight min-h-[3.75rem]">
                                {displayTitle}
                            </h2>
                        </div>
                        {(cardVariant === 'mercat' || cardVariant === 'market') && displayPrice && (
                            <span className="card-price whitespace-nowrap">{displayPrice}</span>
                        )}
                    </div>
                    <h3 className="text-[1rem] sm:text-[1.1rem] font-bold text-[var(--theme-accent-primary)] leading-snug line-clamp-1 truncate min-h-[1.51rem] w-full">
                        {item?.post_subtitle || item?.subtitle || (cardVariant === 'pobles' && item?.comarca ? item.comarca : ((cardVariant === 'mercat' || cardVariant === 'market') ? (item?.seller || item?.author) : '')) || ' '}
                    </h3>
                </div>

                <div className="card-excerpt-container flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity mt-1">
                    {displayExcerpt && (
                        <p className={`card-excerpt text-slate-900 dark:text-slate-100 font-medium text-[15px] m-0 p-0 ${smartClampClass}`} style={{ lineHeight: '24px' }}>
                            {displayExcerpt}
                        </p>
                    )}
                </div>

                {children}
            </div>

            <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
                {displayExcerpt && displayExcerpt.length > 130 && (
                    <button
                        className="w-full outline-none border-none text-[14px] font-black text-white uppercase tracking-wide py-2.5 flex items-center justify-center gap-1 hover:brightness-110 transition-all"
                        style={{ backgroundColor: 'var(--theme-accent-primary)' }}
                        aria-label={`Llegir més sobre ${item.title || "aquest post"}`}
                        onClick={handleReadMoreClick}
                    >
                        Llegir més <ChevronRight size={18} className="mt-[1px]" />
                    </button>
                )}

                {item?.tags && item.tags.length > 0 && (
                    <div 
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-blue-500/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                        {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[14px] font-bold uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                        {item.tags.length > 3 && (
                            <span title={item.tags.slice(3).join(', ')} className="text-[14px] font-bold uppercase tracking-wide opacity-80 cursor-default">
                                +{item.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversalCardBody;



=====================================
FILE: src/components/UniversalCardHeader.jsx
=====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { Zap } from 'lucide-react';

const UniversalCardHeader = ({ 
    item, 
    cardVariant, 
    displayTown, 
    displayAuthor, 
    avatarSrc, 
    avatarRole, 
    isOfficial, 
    displayDate, 
    displayTime 
}) => {
    const navigate = useNavigate();

    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        const cleanTown = townName.replace("Poble Principal:", "").trim();
        if (cleanTown.includes("La Torre")) return "Gent de La Torre";
        return `Gent de ${cleanTown}`;
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        
        // 1. Pobles Rule: Clicking the header goes to the Town/Community page
        if (cardVariant === 'pobles') {
            const townId = item?.towns?.id || item?.town_id;
            if (townId) {
                navigate(`/pobles/${townId}`);
            } else {
                navigate('/pobles');
            }
            return;
        }

        // 2. Default Profile Routing
        const authorId = item?.author_user_id || item?.author_id || item?.user_id;
        const entityId = item?.author_entity_id;
        const authorName = item?.author_name || item?.author || displayAuthor;

        if (entityId) {
            navigate(`/entitat/${entityId}`);
        } else if (authorId) {
            navigate(`/perfil/${authorId}`);
        } else if (authorName) {
            const slug = authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            navigate(`/perfil/${slug}`);
        }
    };

    return (
        <header 
            className={`card-header-boina h-16 ${isOfficial ? 'variant-official' : 'variant-standard'}`} 
            onClick={handleAuthorClick}
        >
            <div className="header-left flex items-center gap-3 flex-1 min-w-0 pr-2">
                <Avatar
                    src={avatarSrc || item?.author_avatar || item?.logo_url || item?.author?.avatar_url}
                    name={displayAuthor}
                    role={avatarRole || item?.author_role}
                    size="md"
                    className="genesis-avatar shrink-0"
                />
                <div className="header-text flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="master-author-name leading-tight text-on-accent mb-1 truncate w-full" title={cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}>
                        {cardVariant === 'pobles' ? getGentDePage(displayTown) : displayAuthor}
                    </h3>
                    
                    {cardVariant === 'pobles' ? (
                        <div className="location-text mt-0.5 truncate w-full" title={`De part de: ${displayAuthor}`}>
                            De part de: {displayAuthor}
                        </div>
                    ) : (
                        displayTown && displayTown !== displayAuthor && (
                            <div className="location-text mt-0.5 truncate w-full" title={displayTown.replace("Poble Principal:", "").trim()}>
                                {displayTown.replace("Poble Principal:", "").trim()}
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="header-right-meta flex items-center gap-2">
                <div className="header-meta-details flex flex-col items-end justify-center leading-none">
                    {cardVariant !== 'pobles' && (
                        <div className="flex flex-col items-start mr-1">
                            <span className="header-time text-[11px] font-black text-on-accent-muted tracking-tighter mb-0.5">{displayTime}</span>
                            <span className="header-date text-on-accent text-[12px] font-black">{displayDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UniversalCardHeader;



=====================================
FILE: src/components/UniversalCardMedia.jsx
=====================================

import React, { useState } from 'react';
import { Image as ImageIcon, Zap } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import Watermark from './Watermark';

const UniversalCardMedia = ({ 
    item, 
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer 
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        
        // Regla Dorada: Imatge sempre obri el visor en gran.
        if (mediaList && mediaList.length > 0) {
            openViewer(mediaList, 0);
        } else if (displayImage) {
            openViewer([{ src: displayImage, title: displayTitle, type: 'image' }], 0);
        }
    };

    return (
        <div className="card-media-wrapper relative" onClick={handleMediaClick}>
            {(item?.is_pinned || item?.metadata?.is_pinned) && (
                <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-full p-2 text-[var(--theme-accent-primary)] shadow-xl border border-white/20 select-none pointer-events-none">
                    <Zap size={16} fill="currentColor" className="zap-celestial" />
                </div>
            )}
            {mediaList && mediaList.length > 1 ? (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                    <div 
                        className="image-overlay-credits absolute right-2 z-10 pointer-events-none drop-shadow-md pb-1" 
                        style={{ fontSize: '11px', bottom: '4px', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                        © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    {(!displayImage || hasImageError) ? (
                        <Watermark variant="white" opacity={0.5}>
                            <img 
                                src="/assets/brain/generations/nano_relleu_notext_1774284617988.png"
                                alt="Paisatge Solarpunk genèric"
                                className="universal-card-media filter brightness-75 contrast-125 saturate-50"
                                loading="lazy"
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA (FALLBACK)
                            </div>
                        </Watermark>
                    ) : (
                        <Watermark variant="white" opacity={0.7}>
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="universal-card-media" 
                                loading="lazy" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openViewer({ src: displayImage, title: displayTitle, type: 'image' });
                                }}
                                style={{ cursor: 'zoom-in' }}
                                onError={() => setHasImageError(true)}
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                            </div>
                        </Watermark>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalCardMedia;



=====================================
FILE: src/components/UniversalCardFooter.jsx
=====================================

import React from 'react';
import { Plus, Share2, MoreHorizontal, MessageCircle, Globe } from 'lucide-react';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    isMaster,
    navigate,
    handleConnectClick
}) => {
    // Determine the main button text
    let buttonText = "CONNECTAR";
    let icon = <Plus size={20} className="drop-shadow-sm" strokeWidth={2.5}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = "CONNECTAR";
    } else if (cardVariant === 'pobles') {
        buttonText = "VISITAR POBLE";
    } else if (item?.type === 'tramit') {
        buttonText = "TRAMITAR";
    }

    const handleShareClick = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: displayTitle || 'Sóc de Poble',
                text: 'Fes un cop d\'ull a això en Sóc de Poble!',
                url: window.location.href,
            }).catch((error) => console.log('Err sharing', error));
        }
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        // The user mentioned this sends them to the Chat of the author to talk about the product.
        // For now, we open the Post Detail View with a comment intent, or navigate to chat.
        const id = item?.uuid || item?.id;
        if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}?action=comment`);
        } else {
            navigate(`/post/${id}?action=comment`);
        }
    };

    const handleTranslateClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        // OMEGA-39: Lanzará un trigger hacia el gestor de IA cuando la infraestructura Vertex esté enchufada
        window.dispatchEvent(new CustomEvent('omega-translate-request', { detail: { postId: id, title: displayTitle } }));
        alert("🌐 Motor de Traducció A Demanda (Vertex AI) prompte disponible.");
    };

    return (
        <div className="card-footer-master mt-auto">
            <div className="footer-actions-mur">
                <button 
                    className="btn-touch translate-btn" 
                    onClick={handleTranslateClick} 
                    aria-label="Traduir Article"
                    title="Traduir Article"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--theme-accent-primary)', marginRight: '8px' }}
                >
                    <Globe size={20} strokeWidth={2.5} />
                </button>
                <button 
                    className="master-action-btn connect-btn w-full h-10 flex items-center justify-center gap-2 font-black tracking-widest text-[14px] rounded-full drop-shadow-md transition-all hover:scale-[1.02] hover:brightness-110"
                    style={{ backgroundColor: 'var(--theme-accent-primary)', color: 'var(--on-theme-accent-primary)', border: 'none' }}
                    onClick={handleConnectClick}
                >
                    {icon} {buttonText}
                </button>
                <div className="footer-touch-group">
                    <button className="btn-touch" onClick={handleCommentClick} aria-label="Comentar">
                        <MessageCircle size={22} strokeWidth={2.2} />
                    </button>
                    <button className="btn-touch" onClick={handleShareClick} aria-label="Compartir">
                        <Share2 size={22} strokeWidth={2.2} />
                    </button>
                    {isMaster && (
                        <button className="btn-touch" onClick={(e) => e.stopPropagation()} aria-label="Opcions">
                            <MoreHorizontal size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalCardFooter;


