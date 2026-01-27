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
    LayoutGrid, Activity, ShieldCheck, Globe, Edit2, BookOpen, Share2
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

import './Profile.css';
import './ProfileDuality.css';

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { profile, setProfile, user, isPlayground, realProfile, isAdmin, isSuperAdmin, realUser } = useAuth();
    const { theme, toggleTheme } = useUI();
    const location = useLocation();

    // Identity Duality State
    // THE CREATOR RULE: Javi and Damià should see their real identity by default.
    const isCreator = CREATOR_EMAILS.includes(realUser?.email || user?.email);
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
        return <StatusLoader message="Verificant identitat de l'Arquitecte..." />;
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

    // Logic Hooks - Use finalProfile?.id to fetch stats safely
    const { stats, isLoading: isLoadingQueries } = useProfileQueries(finalProfile?.id || user?.id);
    const media = useProfileMedia(finalProfile || profile, setProfile);

    // Initial Data
    useEffect(() => {
        supabaseService.getTowns().then(setAllTowns);
    }, []);

    useEffect(() => {
        // Only update local values if we are NOT viewing the real identity 
        // OR if the identity being viewed matches the current profile.
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

            if (userTown) {
                if (userTown.uuid) {
                    updates.town_uuid = userTown.uuid;
                } else if (userTown.id) {
                    updates.town_id = userTown.id;
                    updates.town_uuid = null;
                }
            }

            const updated = await supabaseService.updateProfile(user.id, updates);
            setProfile(updated);
            setIsEditingCard(false);
        } catch (error) {
            logger.error('Error updating card info:', error);
            alert(`Error guardant: ${error.message}`);
        }
    };

    // LOADING STATE: Bypass if in playground to avoid infinite spinners with mock IDs
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

            {/* DUALITY FAB - thumb zone optimized */}
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
                            if (window.addHudLog) {
                                window.addHudLog('info', [
                                    `Identitat canviada a: ${newMode ? 'REAL' : 'PERSONATGE'}`,
                                    `Perfil: ${newMode ? (realProfile?.full_name || 'Javi') : (profile?.full_name || 'IAIA')}`
                                ]);
                            }
                        }}
                    >
                        {viewRealIdentity ? <ShieldCheck size={20} /> : <User size={20} />}
                        <span>{viewRealIdentity ? "Perfil Real" : "Personatge"}</span>
                    </button>
                </div>
            )}

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
            </nav>

            <div className="profile-tab-content">
                {renderTabContent()}
            </div>

            {/* MODALS */}
            <TownSelectorModal
                isOpen={isEditingTown}
                onClose={() => setIsEditingTown(false)}
                onSelect={handleTownChange}
                currentTownId={townEditMode === 'primary' ? (profile?.town_uuid || profile?.town_id) : null}
            />

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
