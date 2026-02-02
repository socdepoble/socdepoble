import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import {
    User, LogOut, Camera, Save, Building2, Store, Settings, Star, Home,
    Bell, Lock, HelpCircle, Info, ChevronRight, MapPin, MessageCircle,
    Plus, Moon, Sun, ArrowLeft, Loader2, Image as ImageIcon, Maximize,
    LayoutGrid, Activity, ShieldCheck, Globe, Edit2, BookOpen, Share2, Beaker, Calendar, Newspaper, Users, Archive
} from 'lucide-react';
import { logger } from '../utils/logger';

// Modals & Components
import TownSelectorModal from '../components/TownSelectorModal';
import MediaDeduplicationModal from '../components/MediaDeduplicationModal';
import ImageReframerModal from '../components/ImageReframerModal';
import ProfileStudioModal from '../components/ProfileStudioModal';
import MediaPickerModal from '../components/MediaPickerModal';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import StatusLoader from '../components/StatusLoader';

// Hooks & Tabs
import { useProfileQueries } from './Profile/hooks/useProfileQueries';
import { useProfileMedia } from './Profile/hooks/useProfileMedia';
import InfoTab from './Profile/tabs/InfoTab';
import ActivityTab from './Profile/tabs/ActivityTab';
import CommunityTab from './Profile/tabs/CommunityTab';
import SettingsTab from './Profile/tabs/SettingsTab';
import ManualTab from './Profile/tabs/ManualTab';
import KnowledgeHub from '../components/KnowledgeHub';
import MasterCalendar from '../pages/MasterCalendar';
import RebostVault from '../components/RebostVault';

import { CREATOR_EMAILS } from '../constants';
import './Profile.css';
import './ProfileDuality.css';

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { profile, setProfile, user, isPlayground, realProfile, isAdmin, isSuperAdmin, realUser } = useAuth();
    const { theme, toggleTheme } = useUI();
    const location = useLocation();

    // Identity Duality State
    // [SAFETY SHIELD]: Evitem ReferenceError si el fitxer de constants no ha carregat bé en versions velles
    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : (window.CREATOR_EMAILS || []);
    const isCreator = masters.includes(realUser?.email || user?.email);
    const [viewRealIdentity, setViewRealIdentity] = useState(isCreator);

    // Derived State: Duality Engine
    const finalProfile = (viewRealIdentity) ? (realProfile || { full_name: 'Javi', id: user?.id }) : (profile || realProfile);

    // Calculem les medalles (badges) de forma dinàmica
    const badges = [];
    if (isSuperAdmin) badges.push('Super Padrino');
    if (finalProfile?.role === 'official' || finalProfile?.role === 'admin') badges.push('Oficial');
    if (finalProfile?.reputation_score > 80) badges.push('Verificat');
    if (isPlayground && !viewRealIdentity) badges.push('IAIA');

    // Safety fallback for UI rendering
    if (!finalProfile && !user) {
        return <StatusLoader message="Verificant identitat..." />;
    }

    const displayProfileSafe = finalProfile || {
        full_name: isCreator ? (realUser?.email?.split('@')[0] || 'Creador') : ((realUser?.email || user?.email)?.split('@')[0] || 'Usuari'),
        avatar_url: null,
        cover_url: null,
        town_id: null
    };

    // Tab & UI State
    const [activeTab, setActiveTab] = useState('info');
    const [allTowns, setAllTowns] = useState([]);
    const [isEditingTown, setIsEditingTown] = useState(false);
    const [townEditMode, setTownEditMode] = useState('primary');
    const [editingSecondaryIdx, setEditingSecondaryIdx] = useState(null);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [oficiValue, setOficiValue] = useState('');
    const [bioValue, setBioValue] = useState('');
    const [secondaryTowns, setSecondaryTowns] = useState([]);

    // Logic Hooks
    const { stats, isLoading: isLoadingQueries } = useProfileQueries(finalProfile?.id || user?.id);
    const media = useProfileMedia(finalProfile || profile, setProfile);

    // Initial Data
    useEffect(() => {
        supabaseService.getTowns().then(setAllTowns);
    }, []);

    useEffect(() => {
        const targetData = finalProfile || profile;
        if (targetData && !isEditingCard) {
            setOficiValue(targetData.ofici || '');
            setBioValue(targetData.bio || '');
            setSecondaryTowns(targetData.secondary_towns || []);
        }
    }, [finalProfile, profile, isEditingCard]);

    const userTown = allTowns.find(t => t.uuid === profile?.town_uuid || t.id === profile?.town_id);

    // Handlers
    const handleBack = () => {
        if (location.state?.fromProfile) {
            navigate(-2);
        } else {
            navigate(-1);
        }
    };

    const handleTownChange = async (townId) => {
        try {
            const isUuid = typeof townId === 'string' && townId.includes('-');
            const finalTownId = isUuid ? townId : parseInt(townId);

            if (townEditMode === 'primary') {
                const updatePayload = isUuid ? { town_uuid: finalTownId } : { town_id: finalTownId };
                if (isPlayground) {
                    setProfile({ ...profile, ...updatePayload });
                } else {
                    const updated = await supabaseService.updateProfile(user.id, updatePayload);
                    setProfile(updated);
                }
            } else {
                let updatedSecondary = [...secondaryTowns];
                if (editingSecondaryIdx !== null) {
                    updatedSecondary[editingSecondaryIdx] = finalTownId;
                } else {
                    updatedSecondary.push(finalTownId);
                }
                setSecondaryTowns(updatedSecondary);

                if (!isPlayground) {
                    const updated = await supabaseService.updateProfile(user.id, { secondary_towns: updatedSecondary });
                    setProfile(updated);
                }
            }
            setIsEditingTown(false);
            setEditingSecondaryIdx(null);
        } catch (error) {
            logger.error('Error updating town:', error);
        }
    };

    const handleSocialPreferenceChange = async (preference) => {
        try {
            const updated = await supabaseService.updateProfile(user.id, {
                social_image_preference: preference
            });
            setProfile(updated);
        } catch (error) {
            logger.error('Error updating social preference:', error);
        }
    };

    const handleCardSubmit = async () => {
        try {
            const updates = {
                ofici: oficiValue,
                bio: bioValue,
                secondary_towns: secondaryTowns
            };

            const updated = await supabaseService.updateProfile(user.id, updates);
            setProfile(updated);
            setIsEditingCard(false);
        } catch (error) {
            logger.error('Error updating card info:', error);
            alert(`Error guardant: ${error.message}`);
        }
    };

    // LOADING STATE
    const shouldShowLoader = isLoadingQueries && !isPlayground;
    if ((!user && !profile) || shouldShowLoader) return <StatusLoader type="loading" />;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <InfoTab
                        isEditingCard={isEditingCard}
                        setIsEditingCard={setIsEditingCard}
                        oficiValue={oficiValue}
                        setOficiValue={setOficiValue}
                        userTown={userTown}
                        setTownEditMode={setTownEditMode}
                        setIsEditingTown={setIsEditingTown}
                        secondaryTowns={secondaryTowns}
                        setSecondaryTowns={setSecondaryTowns}
                        allTowns={allTowns}
                        setEditingSecondaryIdx={setEditingSecondaryIdx}
                        bioValue={bioValue}
                        setBioValue={setBioValue}
                        handleCardSubmit={handleCardSubmit}
                        userId={viewRealIdentity ? (realUser?.id || user?.id) : user?.id}
                        navigate={navigate}
                    />
                );
            case 'activity':
                return <ActivityTab stats={stats} navigate={navigate} />;
            case 'community':
                return <CommunityTab userId={user?.id} navigate={navigate} />;
            case 'settings':
                return (
                    <SettingsTab
                        theme={theme}
                        toggleTheme={toggleTheme}
                        navigate={navigate}
                        displayProfile={displayProfileSafe}
                        handleSocialPreferenceChange={handleSocialPreferenceChange}
                        user={user}
                        profile={profile}
                        setProfile={setProfile}
                    />
                );
            case 'manual':
                return <ManualTab />;
            case 'hub':
                return <KnowledgeHub />;
            case 'calendari':
                return <MasterCalendar />;
            case 'rebost':
                return <RebostVault />;
            default:
                return null;
        }
    };

    return (
        <div className="profile-container optimized-profile">
            <ProfileHeaderPremium
                type="person"
                title={displayProfileSafe.full_name}
                subtitle={viewRealIdentity ? (displayProfileSafe.ofici ? (displayProfileSafe.ofici.charAt(0).toUpperCase() + displayProfileSafe.ofici.slice(1)) : "EL PARE DE LA +IA") : (oficiValue ? (oficiValue.charAt(0).toUpperCase() + oficiValue.slice(1)) : 'Veí')}
                town={userTown?.name}
                bio={viewRealIdentity ? (displayProfileSafe.bio || "Creador de Sóc de Poble.") : bioValue}
                avatarUrl={displayProfileSafe.avatar_url}
                coverUrl={displayProfileSafe.cover_url}
                badges={badges}
                website={viewRealIdentity ? "https://socdepoble.net/author/javi-llinares/" : displayProfileSafe.website}
                isEditing={false}
                onBack={handleBack}
                onAction={() => media.setIsStudioOpen(true)}
                actionIcon={<Camera size={22} />}
                shareData={{
                    title: displayProfileSafe.full_name,
                    text: bioValue || `Hola! Sóc d'aquí de tota la vida. Connecta amb mi a La +IA!`,
                    url: `${window.location.origin}/perfil/${displayProfileSafe?.id || user?.id}`
                }}
            >
                {/* Stats bar integrated into the header children */}
                <div className="profile-stats-bar">
                    <div className="stat-card">
                        <span className="stat-value">{stats.posts}</span>
                        <span className="stat-label">Mur</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.items}</span>
                        <span className="stat-label">Venda</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.connections}</span>
                        <span className="stat-label">Veïns</span>
                    </div>
                </div>
            </ProfileHeaderPremium>

            {/* DUALITY FAB */}
            {isPlayground && isAdmin && (
                <div className="identity-duality-fab">
                    <div className="duality-status-tag">
                        {viewRealIdentity ? "JAVI: PERFIL REAL" : `SIMULACIÓ: ${profile?.full_name?.toUpperCase()}`}
                    </div>
                    <button
                        className={`duality-fab-btn ${viewRealIdentity ? 'active' : ''}`}
                        onClick={() => {
                            const newMode = !viewRealIdentity;
                            setViewRealIdentity(newMode);
                        }}
                    >
                        {viewRealIdentity ? <ShieldCheck size={20} /> : <User size={20} />}
                        <span>{viewRealIdentity ? "Perfil Real" : "Personatge"}</span>
                    </button>
                </div>
            )}

            <div className="profile-main-content">
                {/* Beta Tester Section - Visible in Settings or main profile? Let's put it here for prominence as requested */}
                <div className="profile-section-card beta-tester-card">
                    <div className="section-header">
                        <div className="section-icon-bg beta">
                            <Beaker size={20} />
                        </div>
                        <div className="section-title-stack">
                            <h3>Vols ser Beta Tester?</h3>
                            <p>Ajuda'ns a bategar el poble!</p>
                        </div>
                        <div className="section-action">
                            <label className="switch">
                                <input
                                    id="beta-tester-toggle"
                                    name="beta-tester-toggle"
                                    type="checkbox"
                                    checked={profile?.is_beta_tester || false}
                                    onChange={async (e) => {
                                        const val = e.target.checked;
                                        setProfile(prev => ({ ...prev, is_beta_tester: val }));
                                        if (!isPlayground) {
                                            await supabaseService.updateProfile(user.id, { is_beta_tester: val });
                                        }
                                    }}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="profile-identity-card" style={{ background: 'var(--hud-bg)', border: '1px solid var(--hud-border)', borderRadius: '24px', padding: '24px', marginTop: '20px', position: 'relative', overflow: 'hidden' }}>
                        <div className="federation-badge" style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 242, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid #00f2ff', cursor: 'pointer' }} onClick={() => {
                            const node = prompt('A quin Node de la Federació vols connectar-te? (ex: Benifallim, Penàguila, La Torre)', 'La Torre');
                            if (node) alert(`Sincronitzant amb el Node ${node.toUpperCase()}...`);
                        }}>
                            <Globe size={12} color="#00f2ff" />
                            <span style={{ fontSize: '10px', color: '#00f2ff', fontWeight: 'bold', letterSpacing: '0.05em' }}>NODE LA TORRE (PILOT) ▾</span>
                        </div>

                        <div className="profile-main-content">
                            <div className="profile-avatar-stack">
                                <div className="profile-avatar-ring">
                                    <img
                                        src={user?.avatar_url || '/assets/master/javi_avatar_cinematic.png'}
                                        alt="Avatar"
                                        className="profile-avatar-img"
                                    />
                                </div>
                                <div className="status-indicator online"></div>
                            </div>
                            <div className="profile-naming">
                                <h2>{user?.full_name || 'Ciutadà de La Torre'}</h2>
                                <p className="profile-handle">@{user?.username || 'vei_sobirà'}</p>
                                <div className="profile-badges">
                                    <span className="profile-badge-pill role-official">
                                        <ShieldCheck size={12} /> {user?.role || 'Veí'}
                                    </span>
                                    <span className="profile-badge-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid #10B981' }}>
                                        <Lock size={12} /> Rhizome Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="coopyleft-notice" style={{ marginTop: '16px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ fontSize: '14px' }}>🛡️</div>
                            <div style={{ fontSize: '9px', opacity: 0.7 }}>
                                <strong>Llicència CoopyLeft (CC BY-NC-SA 4.0):</strong> Dades protegides per la comunitat. Lliure per al poble, prohibit per a l'extractivisme.
                            </div>
                        </div>
                    </div>

                    <div className="beta-explanation">
                        <p>Com a <strong>Beta Tester</strong>, ajudes a bategar el poble trobant errors i proposant millores directament a l'equip tècnic.</p>
                    </div>
                    <button
                        className="btn-news-vitamin"
                        onClick={() => navigate('/mur')}
                        style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(0, 242, 255, 0.1)', border: '1px solid var(--hud-accent)', color: 'var(--hud-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <Newspaper size={18} /> Últimes Novetats Vitaminades 🐭💊
                    </button>
                </div>

                {/* CÀPSULA DEL TEMPS [PILLAR 5] */}
                <div className="profile-section-card time-capsule-card" style={{ marginTop: '16px', border: '1px solid #FFD700', background: 'rgba(255, 215, 0, 0.05)' }}>
                    <div className="section-header">
                        <div className="section-icon-bg" style={{ background: '#FFD700' }}>
                            <Lock size={20} color="black" />
                        </div>
                        <div className="section-title-stack">
                            <h3>Càpsula del Temps</h3>
                            <p style={{ color: '#B45309' }}>Protocol Long Now (Sobirania Total)</p>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ background: '#000', color: '#FFD700', fontSize: '12px', padding: '8px 16px' }}
                            onClick={() => {
                                import('../services/rhizomeManager').then(({ rhizomeManager }) => {
                                    rhizomeManager.generateTimeCapsule();
                                    alert('🏺¡Càpsula bategada! El teu historial i identitats estan segellats en un fitxer sobirà al teu dispositiu.');
                                });
                            }}
                        >
                            BATEGAR EXPORTACIÓ
                        </button>
                    </div>
                    <div className="beta-explanation" style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}>
                        Exporta tota la teua activitat en un format lliure que podràs obrir d'ací a 50 anys, fins i tot si el núvol desapareix. Tu ets l'amo.
                    </div>
                </div>

                {/* CUSTÒDIA SOCIAL [PILLAR 3] */}
                <div className="profile-section-card social-custody-card" style={{ marginTop: '16px', border: '1px solid #10B981', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <div className="section-header">
                        <div className="section-icon-bg" style={{ background: '#10B981' }}>
                            <Users size={20} color="white" />
                        </div>
                        <div className="section-title-stack">
                            <h3>Custòdia Social (Padrins)</h3>
                            <p style={{ color: '#047857' }}>La teua xarxa de seguretat humana</p>
                        </div>
                    </div>

                    {/* PENDING RECOVERY REQUEST BANNER (SIMULATION) */}
                    {(() => {
                        const request = JSON.parse(localStorage.getItem('sp_recovery_request'));
                        if (request && request.status === 'pending_social_validation') {
                            return (
                                <div className="recovery-signature-banner" style={{ marginTop: '12px', padding: '12px', background: '#000', borderRadius: '12px', border: '1px solid #10B981' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 'bold', fontSize: '13px' }}>
                                        <Zap size={16} fill="currentColor" />
                                        <span>PETICIÓ DE RECUPERACIÓ ACTIVA</span>
                                    </div>
                                    <p style={{ color: 'white', fontSize: '11px', marginTop: '4px' }}>
                                        L'usuari <strong>{request.user_id}</strong> ha perdut el mòbil i demana la teua signatura social.
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>Signatures: {request.current_signatures} / {request.required_signatures}</span>
                                        <button
                                            className="btn-primary"
                                            style={{ background: '#10B981', color: 'black', fontSize: '10px', padding: '6px 12px', fontWeight: '900' }}
                                            onClick={() => {
                                                import('../services/identityService').then(({ identityService }) => {
                                                    identityService.signRecoveryRequest('padrin-local', Date.now()).then(res => {
                                                        if (res.success) {
                                                            alert(`⚖️ ¡Signatura bategada! Has validat la identitat del teu veí. (${res.current}/${request.required_signatures})`);
                                                            window.location.reload();
                                                        }
                                                    });
                                                });
                                            }}
                                        >
                                            SIGNAR CONTRACTE SOCIAL
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                        if (request && request.status === 'validated_by_social_contract') {
                            return (
                                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', textAlign: 'center', color: '#047857', fontSize: '11px', fontWeight: 'bold' }}>
                                    ✅ ¡IDENTITAT RESTAURADA! El Contracte Social s'ha executat amb èxit.
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <div className="padrins-list" style={{ marginTop: '15px' }}>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                            <button
                                className="add-padrin-btn"
                                style={{ minWidth: '100px', height: '100px', borderRadius: '15px', border: '2px dashed #10B981', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981', padding: '10px' }}
                                onClick={() => {
                                    const name = prompt('Nom del Padrin/a:');
                                    if (name) {
                                        import('../services/paymentService').then(({ paymentService }) => {
                                            paymentService.addPadrin({ name, role: 'Padrí Confiança' });
                                            window.location.reload(); // Refresh to show
                                        });
                                    }
                                }}
                            >
                                <Plus size={24} />
                                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>AFEGIR PADRÍ</span>
                            </button>
                            {/* Render existing padrins - simplify for now */}
                            {(() => {
                                const padrins = JSON.parse(localStorage.getItem('sp_padrins') || '[]');
                                return padrins.map(p => (
                                    <div key={p.id} style={{ minWidth: '100px', height: '100px', borderRadius: '15px', background: 'white', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{p.name[0]}</div>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>{p.name}</span>
                                        <span style={{ fontSize: '9px', opacity: 0.6 }}>SEGURAT</span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                    <div className="beta-explanation" style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}>
                        Si perds el dispositiu, els teus Padrins poden bategar la restauració del teu <strong>xlog</strong> (llibre de comptes). La teua comunitat és la teua millor còpia de seguretat.
                    </div>
                </div>

                <nav className="profile-tabs-nav horizontal-scroll">
                    <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>
                        <User size={18} />
                        <span>Perfil</span>
                    </button>
                    <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>
                        <Activity size={18} />
                        <span>Activitat</span>
                    </button>
                    <button className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>
                        <Building2 size={18} />
                        <span>Comunitat</span>
                    </button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                        <Settings size={18} />
                        <span>Ajustos</span>
                    </button>
                    <button className={activeTab === 'manual' ? 'active' : ''} onClick={() => setActiveTab('manual')}>
                        <BookOpen size={18} />
                        <span>Guia</span>
                    </button>
                    <button className={activeTab === 'hub' ? 'active' : ''} onClick={() => setActiveTab('hub')}>
                        <Share2 size={18} />
                        <span>Connexió</span>
                    </button>
                    <button className={activeTab === 'calendari' ? 'active' : ''} onClick={() => setActiveTab('calendari')}>
                        <Calendar size={18} />
                        <span>Calendari</span>
                    </button>
                    <button className={activeTab === 'rebost' ? 'active' : ''} onClick={() => setActiveTab('rebost')}>
                        <Archive size={18} />
                        <span>El Rebost</span>
                    </button>
                </nav>

                <div className="profile-tab-content">
                    {renderTabContent()}
                </div>
            </div>

            {/* MODALS */}
            <TownSelectorModal
                isOpen={isEditingTown}
                onClose={() => setIsEditingTown(false)}
                onSelect={handleTownChange}
                currentTownId={townEditMode === 'primary' ? (profile?.town_uuid || profile?.town_id) : null}
            />

            {/* Thumb-Zone Strategy: Floating Action Button (FAB) */}
            <button
                className="profile-fab-premium"
                onClick={() => media.setIsStudioOpen(true)}
                title="Obrir Estudi de Perfil"
            >
                <Camera size={24} />
            </button>

            <ProfileStudioModal
                isOpen={media.isStudioOpen}
                onClose={() => media.setIsStudioOpen(false)}
                onSelectType={(type) => {
                    media.setIsStudioOpen(false);
                    media.setPendingType(type);
                    media.setIsPickerOpen(true);
                }}
                onUpload={(type) => {
                    media.setIsStudioOpen(false);
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => media.handleFileChange(e, type);
                    input.click();
                }}
                onReposition={(type) => {
                    media.setIsStudioOpen(false);
                    media.handleReposition(type, finalProfile || displayProfileSafe);
                }}
                hasAvatar={!!finalProfile?.avatar_url}
                hasCover={!!finalProfile?.cover_url}
            />

            <MediaPickerModal
                isOpen={media.isPickerOpen}
                onClose={() => media.setIsPickerOpen(false)}
                onSelect={media.handlePickerSelect}
                userId={user?.id}
                type="profile"
            />

            <ImageReframerModal
                isOpen={media.isReframerOpen}
                imageSrc={media.tempImageSrc}
                aspect={media.pendingType === 'avatar' ? 1 : 16 / 9}
                onConfirm={media.handleReframerConfirm}
                onCancel={() => media.setIsReframerOpen(false)}
            />

            <MediaDeduplicationModal
                isOpen={media.isDedupModalOpen}
                onClose={() => media.setIsDedupModalOpen(false)}
                onConfirm={media.handleDedupConfirm}
                asset={media.pendingAsset}
                type={media.pendingType}
            />

            {media.isUploading && (
                <div className="upload-overlay-global">
                    <Loader2 className="spin" size={40} />
                    <p>Pujant imatge...</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
