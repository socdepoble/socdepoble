import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { hapticService } from '../services/hapticService';
import {
    User, LogOut, Camera, Save, Building2, Store, Settings, Star, Home,
    Bell, Lock, HelpCircle, Info, ChevronRight, MapPin, MessageCircle,
    Plus, Moon, Sun, ArrowLeft, Loader2, Image as ImageIcon, Maximize,
    LayoutGrid, Activity, ShieldCheck, Globe, Edit2, BookOpen, Share2, Beaker, Calendar, Newspaper, Users, Archive, Landmark, Sparkles
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
import LabsTab from './Profile/tabs/LabsTab';

import { CREATOR_EMAILS } from '../constants';
import './Profile.css';
import './ProfileDuality.css';

const Profile = () => {
    const { t } = useTranslation();
    useEffect(() => {
        // [Profile] Bategant amb traduccions
    }, [t]);
    const navigate = useNavigate();
    const { profile, setProfile, user, isPlayground, realProfile, isAdmin, isSuperAdmin, realUser } = useAuth();
    const { setIsNotePadOpen, globalDesign, setGlobalDesign } = useUI();
    const location = useLocation();

    // Identity Duality State
    // [SAFETY SHIELD]: Evitem ReferenceError si el fitxer de constants no ha carregat bé en versions velles
    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : (window.CREATOR_EMAILS || []);
    const isCreator = masters.includes(realUser?.email || user?.email);
    const [viewRealIdentity, setViewRealIdentity] = useState(isCreator);

    // Tab & UI State
    const [activeTab, setActiveTab] = useState('batec');
    const [allTowns, setAllTowns] = useState([]);
    const [isEditingTown, setIsEditingTown] = useState(false);
    const [townEditMode, setTownEditMode] = useState('primary');
    const [editingSecondaryIdx, setEditingSecondaryIdx] = useState(null);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [oficiValue, setOficiValue] = useState('');
    const [bioValue, setBioValue] = useState('');
    const [secondaryTowns, setSecondaryTowns] = useState([]);

    // Derived State: Duality Engine
    const finalProfile = useMemo(() => 
        (viewRealIdentity) ? (realProfile || { full_name: 'Javi', id: user?.id }) : (profile || realProfile),
    [viewRealIdentity, realProfile, profile, user?.id]);

    // Calculem les medalles (badges) de forma dinàmica
    const badges = [];
    if (isSuperAdmin) badges.push('Super Padrino');
    if (finalProfile?.role === 'official' || finalProfile?.role === 'admin') badges.push('Oficial');
    if (finalProfile?.reputation_score > 80) badges.push('Verificat');
    if (isPlayground && !viewRealIdentity) badges.push('IAIA');

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
            setNameValue(targetData.full_name || '');
            setOficiValue(targetData.ofici || '');
            setBioValue(targetData.bio || '');
            setSecondaryTowns(targetData.secondary_towns || []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalProfile, isEditingCard]);

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

            if (!finalTownId && finalTownId !== 0) {
                logger.warn('[Profile] Ignorant identificador de poble invàlid:', townId);
                return;
            }

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
                full_name: nameValue,
                ofici: oficiValue,
                bio: bioValue,
                secondary_towns: secondaryTowns
            };

            const updated = await supabaseService.updateProfile(user.id, updates);
            setProfile(updated);
            setIsEditingCard(false);
            hapticService.notifySuccess();
        } catch (error) {
            logger.error('Error updating card info:', error);
            alert(`Error guardant: ${error.message} `);
        }
    };

    // Safety fallback for UI rendering
    if (!finalProfile && !user) {
        return <StatusLoader message="Verificant identitat..." />;
    }

    const displayProfileSafe = finalProfile || profile || {
        id: user?.id || realUser?.id,
        full_name: isCreator ? 'Javi Llinares' : (user?.email?.split('@')[0] || 'Veí de la Torre'),
        avatar_url: isCreator ? '/images/agents/javi_real.png' : (profile?.avatar_url || null),
        cover_url: isCreator ? '/assets/master/brand_cinematic.png' : (profile?.cover_url || 'https://images.unsplash.com/photo-1549412639-66172551000f?q=80&w=2070&auto=format&fit=crop'),
        ofici: isCreator ? 'Mestre de la Simbiosi' : (profile?.ofici || 'Veí de la Torre'),
        bio: isCreator ? 'Bategant amb peluca i ulleres de sol per la sobirania digital.' : (profile?.bio || null),
        town_id: null
    };

    // LOADING STATE
    const shouldShowLoader = isLoadingQueries && !isPlayground;
    if (shouldShowLoader) return <StatusLoader type="loading" />;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'solatge':
                return (
                    <div className="tab-pane-fade-in solatge-grid">
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
                            profile={profile}
                            handleTownChange={handleTownChange}
                        />
                    </div>
                );
            case 'batec':
                return (
                    <div className="tab-pane-fade-in batec-content">
                        <ActivityTab stats={stats} navigate={navigate} displayProfile={displayProfileSafe} />
                    </div>
                );
            case 'community':
                return (
                    <div className="tab-pane-fade-in community-content">
                        <CommunityTab userId={user?.id} navigate={navigate} />
                    </div>
                );
            case 'eines':
                return (
                    <div className="tab-pane-fade-in eines-grid-refined">
                        <section className="eines-menu-section">
                            <div className="action-cards-grid-v2">
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setActiveTab('calendar_view'); }}>
                                    <Calendar size={24} />
                                    <span>Calendari</span>
                                </div>
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setActiveTab('rebost_view'); }}>
                                    <Archive size={24} />
                                    <span>El Rebost</span>
                                </div>
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setActiveTab('manual_view'); }}>
                                    <BookOpen size={24} />
                                    <span>Guia</span>
                                </div>
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setActiveTab('hub_view'); }}>
                                    <Share2 size={24} />
                                    <span>Connexió</span>
                                </div>
                                {isAdmin && (
                                    <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setActiveTab('labs_view'); }}>
                                        <Beaker size={24} />
                                        <span>Labs</span>
                                    </div>
                                )}
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); navigate('/disseny'); }}>
                                    <Sparkles size={24} />
                                    <span>Disseny (Canons)</span>
                                </div>
                                {isSuperAdmin && (
                                    <div
                                        className={`mini-eina-card admin-special-premium ${globalDesign === 'consola' ? 'active-consola' : ''}`}
                                        onClick={() => {
                                            hapticService.bategat();
                                            setGlobalDesign(globalDesign === 'batega' ? 'consola' : 'batega');
                                        }}
                                    >
                                        <div className="consola-icon-glow">
                                            {globalDesign === 'consola' ? <Globe size={28} /> : <ShieldCheck size={28} />}
                                        </div>
                                        <span>{globalDesign === 'consola' ? 'MODE BATEGA' : 'ACTIVA HUD CORE'}</span>
                                    </div>
                                )}
                                {isSuperAdmin && (
                                    <div className="mini-eina-card admin-special-premium" onClick={() => { hapticService.bategat(); navigate('/admin'); }}>
                                        <ShieldCheck size={28} />
                                        <span>ADMINISTRACIÓ</span>
                                    </div>
                                )}
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setIsNotePadOpen(true); }}>
                                    <div style={{ fontSize: '24px', lineHeight: '1' }}>🏺</div>
                                    <span>Bloc de notes</span>
                                </div>
                                <div className="mini-eina-card" onClick={() => { hapticService.bategat(); setActiveTab('settings_view'); }}>
                                    <Settings size={24} />
                                    <span>Ajustos</span>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            // Vistes profundes d'eines
            case 'calendar_view': return <div className="tab-pane-fade-in"><MasterCalendar onClose={() => setActiveTab('eines')} /></div>;
            case 'rebost_view': return <div className="tab-pane-fade-in"><RebostVault onClose={() => setActiveTab('eines')} /></div>;
            case 'manual_view': return <div className="tab-pane-fade-in"><ManualTab onClose={() => setActiveTab('eines')} /></div>;
            case 'hub_view': return <div className="tab-pane-fade-in"><KnowledgeHub onClose={() => setActiveTab('eines')} /></div>;
            case 'labs_view': return <div className="tab-pane-fade-in"><LabsTab profile={profile} setProfile={setProfile} user={user} isPlayground={isPlayground} isAdmin={isAdmin} /></div>;
            case 'settings_view': return (
                <div className="tab-pane-fade-in">
                    <SettingsTab
                        navigate={navigate}
                        displayProfile={displayProfileSafe}
                        handleSocialPreferenceChange={handleSocialPreferenceChange}
                        user={user}
                        profile={profile}
                        setProfile={setProfile}
                    />
                </div>
            );
            default:
                return null;
        }
    };

    return (
        <div className="profile-container optimized-profile">
            <ProfileHeaderPremium
                type="person"
                title={isEditingCard ? nameValue : (viewRealIdentity ? displayProfileSafe.full_name : (displayProfileSafe.full_name || 'Veí de la Torre'))}
                subtitle={isEditingCard ? oficiValue : (viewRealIdentity ? (displayProfileSafe.ofici ? (displayProfileSafe.ofici.charAt(0).toUpperCase() + displayProfileSafe.ofici.slice(1)) : "EL PARE DE LA +IA") : (oficiValue ? (oficiValue.charAt(0).toUpperCase() + oficiValue.slice(1)) : 'Veí de la Torre'))}
                town={userTown?.name}
                bio={isEditingCard ? bioValue : (viewRealIdentity ? (displayProfileSafe.bio || "Creador de Sóc de Poble.") : bioValue)}
                avatarUrl={displayProfileSafe.avatar_url}
                coverUrl={displayProfileSafe.cover_url}
                badges={badges}
                website={viewRealIdentity ? "https://socdepoble.net/author/javi-llinares/" : displayProfileSafe.website}
                isEditing={isEditingCard}
                onBack={handleBack}
                showThemeToggle={true}
                onEditToggle={() => setIsEditingCard(true)}
                onEditSave={handleCardSubmit}
                onEditCancel={() => setIsEditingCard(false)}
                onTitleChange={setNameValue}
                onSubtitleChange={setOficiValue}
                onBioChange={setBioValue}
                onTownChange={() => { setTownEditMode('primary'); setIsEditingTown(true); }}
                shareData={{
                    title: displayProfileSafe.full_name,
                    text: bioValue || `Hola! Sóc d'aquí de tota la vida. Connecta amb mi a La +IA!`,
                    url: `${window.location.origin}/perfil/${displayProfileSafe?.id || user?.id}`
                }}
            >
                {/* Stats bar integrated into the header children */}
                <div className="profile-identity-strip">
                    <div
                        className="identity-badge-premium town-group"
                        onClick={() => {
                            const isTorre = (userTown?.name || '').toLowerCase().includes('torre');
                            const townId = profile?.town_uuid || (isTorre ? 'la-torre' : '');
                            navigate(townId ? `/pobles/${townId}` : '/pobles');
                        }}
                    >
                        <Users size={20} />
                        <span>Gent de {userTown?.name || 'la Torre'}</span>
                        <ChevronRight size={16} className="ml-auto opacity-40" />
                    </div>
                </div>

                <div className="profile-stats-bar">
                    <div className="stat-card clickable" onClick={() => navigate('/aula-rural')}>
                        <span className="stat-value">{stats.posts}</span>
                        <span className="stat-label">Bategats</span>
                    </div>
                    <div className="stat-card clickable" onClick={() => navigate('/aula-rural')}>
                        <span className="stat-value">{stats.connections}</span>
                        <span className="stat-label">Veïns</span>
                    </div>
                </div>

            </ProfileHeaderPremium >

            {/* DUALITY FAB */}
            {
                isPlayground && isAdmin && (
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
                )
            }

            <div className="profile-main-content">
                <nav className="profile-tabs-nav horizontal-scroll premium-tabs-v2">
                    <button className={activeTab === 'batec' ? 'active' : ''} onClick={() => setActiveTab('batec')}>
                        <Activity size={20} />
                        <span>Batec</span>
                    </button>
                    <button className={activeTab === 'solatge' ? 'active' : ''} onClick={() => setActiveTab('solatge')}>
                        <User size={20} />
                        <span>Solatge</span>
                    </button>
                    <button className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>
                        <Users size={20} />
                        <span>Comunitat</span>
                    </button>
                    <button className={activeTab === 'eines' ? 'active' : ''} onClick={() => setActiveTab('eines')}>
                        <LayoutGrid size={20} />
                        <span>Eines</span>
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
                profile={finalProfile || displayProfileSafe}
                isUploading={media.isUploading}
                uploadType={media.uploadType}
                onFileSelect={media.handleFileChange}
                onReposition={(type) => {
                    media.setIsStudioOpen(false);
                    media.handleReposition(type, finalProfile || displayProfileSafe);
                }}
                onAlbumSelect={(type) => {
                    media.setIsStudioOpen(false);
                    media.setPendingType(type);
                    media.setIsPickerOpen(true);
                }}
                onCaptureComplete={(captured, target) => {
                    media.setIsStudioOpen(false);
                    media.setPendingType(target);
                    media.setTempImageSrc(captured.url);
                    if (captured.blob) {
                        media.setPendingFile(new File([captured.blob], 'capture.jpg', { type: 'image/jpeg' }));
                    }
                    media.setIsReframerOpen(true);
                }}
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

            {
                media.isUploading && (
                    <div className="upload-overlay-global">
                        <Loader2 className="spin" size={40} />
                        <p>Pujant imatge...</p>
                    </div>
                )
            }
        </div >
    );
};

export default Profile;
