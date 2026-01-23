import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Camera, Save, Building2, Store, Settings, Star, Home, Bell, Lock, HelpCircle, Info, ChevronRight, MapPin, MessageCircle, Plus, Moon, Sun, ArrowLeft, Loader2, Image as ImageIcon, Maximize } from 'lucide-react';
import { logger } from '../utils/logger';
import TownSelectorModal from '../components/TownSelectorModal';
import MediaDeduplicationModal from '../components/MediaDeduplicationModal';
import ImageReframerModal from '../components/ImageReframerModal';
import ProfileStudioModal from '../components/ProfileStudioModal';
import MediaPickerModal from '../components/MediaPickerModal';
import UnifiedStatus from '../components/UnifiedStatus';
import { exportService } from '../services/exportService';
import './Profile.css';

const MyEntitiesList = ({ userId }) => {
    const [entities, setEntities] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            supabaseService.getUserEntities(userId).then(setEntities);
        }
    }, [userId]);

    if (entities.length === 0) {
        return <p className="empty-entities-message">{t('nav.empty_entities')}</p>;
    }

    return (
        <div className="entities-grid">
            {entities.map(ent => (
                <div key={ent.id} className="entity-card" onClick={() => navigate(`/entitat/${ent.id}`)}>
                    <div className={`entity-avatar ${ent.type}`}>
                        {ent.avatar_url ? (
                            <img src={ent.avatar_url} alt={ent.name} />
                        ) : (
                            ent.type === 'empresa' ? <Store size={20} /> : <Building2 size={20} />
                        )}
                    </div>
                    <div className="entity-info">
                        <h4>{ent.name}</h4>
                        <span className="entity-role">
                            {ent.type} • {ent.member_role}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { profile, setProfile, user, isPlayground, logout } = useAuth();
    const { theme, toggleTheme } = useUI();

    const [allTowns, setAllTowns] = useState([]);
    const [isEditingTown, setIsEditingTown] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadType, setUploadType] = useState(null); // 'avatar' or 'cover'

    // Deduplication state
    const [isDedupModalOpen, setIsDedupModalOpen] = useState(false);
    const [pendingAsset, setPendingAsset] = useState(null);
    const [pendingType, setPendingType] = useState(null);

    // Reframer state
    const [isReframerOpen, setIsReframerOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState(null);
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingParentId, setPendingParentId] = useState(null);

    // Studio state
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const avatarInputRef = useRef(null);

    useEffect(() => {
        supabaseService.getTowns().then(setAllTowns);
    }, []);

    const userTown = allTowns.find(t => t.uuid === profile?.town_uuid || t.id === profile?.town_id);
    const isLoading = !user && !profile;

    if (isLoading) return <UnifiedStatus type="loading" />;

    const displayProfile = profile || {
        full_name: user?.email?.split('@')[0] || 'Usuari',
        avatar_url: null,
        cover_url: null,
        town_id: null
    };

    const handleTownChange = async (townId) => {
        try {
            const isUuid = typeof townId === 'string' && townId.includes('-');
            const updatePayload = isUuid ? { town_uuid: townId } : { town_id: parseInt(townId) };

            if (isPlayground) {
                // For playground, we update the local profile state only or a specific ephemeral flag
                setProfile({ ...profile, ...updatePayload });
                logger.log('[Profile] Temporary town update for Playground:', updatePayload);
            } else {
                const updated = await supabaseService.updateProfile(user.id, updatePayload);
                setProfile(updated);
            }
            setIsEditingTown(false);
        } catch (error) {
            logger.error('Error updating town:', error);
        }
    };

    const handleReposition = async (type) => {
        const currentUrl = type === 'avatar' ? displayProfile.avatar_url : displayProfile.cover_url;
        if (!currentUrl) return;

        setIsUploading(true);
        try {
            // 1. Find the current asset
            const asset = await supabaseService.getMediaAssetByUrl(currentUrl);
            if (asset) {
                // 2. Try to find parent (original)
                const parent = await supabaseService.getParentAsset(asset.id);
                if (parent) {
                    setTempImageSrc(parent.url);
                    setPendingParentId(parent.id);
                } else {
                    // It is the original
                    setTempImageSrc(asset.url);
                    setPendingParentId(asset.id);
                }
            } else {
                // Fallback for untracked images
                setTempImageSrc(currentUrl);
                setPendingParentId(null);
            }

            setPendingFile(new File([], 'repositioning.jpg', { type: 'image/jpeg' }));
            setPendingType(type);
            setIsReframerOpen(true);
        } catch (error) {
            logger.error('Error in handleReposition:', error);
            // Non-critical fallback: use the current image as the source for re-framing
            setTempImageSrc(currentUrl);
            setPendingFile(new File([], 'repositioning.jpg', { type: 'image/jpeg' }));
            setPendingParentId(null);
            setPendingType(type);
            setIsReframerOpen(true);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        // Instead of immediate upload, open reframer
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempImageSrc(e.target.result);
            setPendingFile(file);
            setPendingType(type);
            setPendingParentId(null); // New file has no parent yet
            setIsReframerOpen(true);
        };
        reader.readAsDataURL(file);

        // Reset input
        event.target.value = '';
    };

    const handlePickerSelect = async (asset) => {
        setIsPickerOpen(false);
        setUploadType(pendingType);

        // Use the picked asset URL for re-framing
        setTempImageSrc(asset.url);

        // Check if THIS asset has a parent, or it IS a parent
        if (asset.parent_id) {
            setPendingParentId(asset.parent_id);
        } else {
            // It might be an original already
            setPendingParentId(asset.id);
        }

        // We don't have a new file, we are "repositioning" from the album asset
        setPendingFile(new File([], asset.url.split('/').pop() || 'image.jpg', { type: asset.mime_type }));
        setIsReframerOpen(true);
    };

    const handleReframerConfirm = async (croppedBlob) => {
        setIsReframerOpen(false);
        const type = pendingType;
        const originalFile = pendingFile;
        let parentId = pendingParentId;

        setIsUploading(true);
        setUploadType(type);

        try {
            // 1. If we have a NEW file (size > 0), upload it as RAW first to keep the original quality
            if (originalFile && originalFile.size > 0 && !parentId) {
                const rawResult = await supabaseService.processMediaUpload(
                    user.id,
                    originalFile,
                    'profiles', // Use the existing profiles bucket
                    'raw',
                    true
                );
                parentId = rawResult.asset.id;
            }

            // 2. Upload the crop linked to the parent
            const croppedFile = new File([croppedBlob], originalFile.name || 'cropped.jpg', { type: 'image/jpeg' });
            const result = await supabaseService.processMediaUpload(
                user.id,
                croppedFile,
                'profiles',
                type,
                true,
                parentId
            );

            // 3. Update profile
            const updatePayload = type === 'avatar'
                ? { avatar_url: result.url }
                : { cover_url: result.url };

            const updatedProfile = await supabaseService.updateProfile(user.id, updatePayload);
            setProfile(updatedProfile);

            logger.log(`[Profile] ${type} uploaded and linked to parent ${parentId}`);
        } catch (error) {
            logger.error(`[Profile] Error in ${type} flow:`, error);
            alert(`Error al processar la imatge: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadType(null);
            setPendingFile(null);
            setPendingParentId(null);
        }
    };

    const handleDedupConfirm = async () => {
        try {
            setIsDedupModalOpen(false);
            setIsUploading(true);
            setUploadType(pendingType);

            // Register usage of existing asset
            await supabaseService.registerMediaUsage(pendingAsset.id, user.id, pendingType);

            // Update profile with existing URL
            const updatePayload = pendingType === 'avatar'
                ? { avatar_url: pendingAsset.url }
                : { cover_url: pendingAsset.url };

            const updatedProfile = await supabaseService.updateProfile(user.id, updatePayload);
            setProfile(updatedProfile);

            logger.log(`[Profile] ${pendingType} deduplicated successfully`);
        } catch (error) {
            logger.error(`[Profile] Error in deduplication confirm:`, error);
        } finally {
            setIsUploading(false);
            setUploadType(null);
            setPendingAsset(null);
            setPendingType(null);
        }
    };

    const menuItems = [
        { icon: <ImageIcon size={20} />, label: t('nav.my_album') || 'El meu Àlbum', id: 'photos' },
        { icon: <User size={20} />, label: 'Veure el meu Mur Públic', id: 'public_profile' },
        { icon: <Settings size={20} />, label: 'Gestió de Categories i Etiquetes', id: 'categories' },
        { icon: <Building2 size={20} />, label: 'Crear o Gestionar Entitats', id: 'manage_entities' },
        { icon: <MessageCircle size={20} />, label: t('nav.my_posts'), id: 'posts' },
        { icon: <Store size={20} />, label: t('nav.my_products'), id: 'products' },
        { icon: theme === 'light' ? <Moon size={20} /> : <Sun size={20} />, label: theme === 'light' ? 'Modo nit' : 'Modo dia', id: 'theme' },
        { icon: <Star size={20} />, label: t('nav.saved'), id: 'saved' },
        { icon: <Home size={20} />, label: t('nav.my_towns'), id: 'towns' },
        { icon: <Bell size={20} />, label: t('nav.profile_notifications') || 'Notificacions', id: 'notifications' },
        { icon: <HelpCircle size={20} />, label: t('nav.support'), id: 'support' },
        { icon: <Info size={20} />, label: t('nav.about'), id: 'about' }
    ];

    const handleMenuClick = (id) => {
        if (id === 'theme') {
            toggleTheme();
        } else if (id === 'photos') {
            navigate('/fotos');
        } else if (id === 'public_profile') {
            navigate(`/perfil/${user.id}`);
        } else if (id === 'categories') {
            navigate('/admin?tab=categories');
        } else if (id === 'manage_entities') {
            navigate('/gestio-entitats');
        } else {
            logger.log('Clicked menu item:', id);
        }
    };

    return (
        <div className="profile-container">
            <header className="profile-dashboard-header">
                {/* Cover Image Area */}
                <div className="profile-cover-area">
                    {displayProfile.cover_url ? (
                        <img src={displayProfile.cover_url} alt="Cover" className="cover-image" />
                    ) : (
                        <div className="cover-placeholder" />
                    )}
                    <div className="cover-overlay" />

                    <div className="header-top-actions">
                        <button className="giga-back-button" onClick={() => navigate(-1)}>
                            <ArrowLeft size={24} />
                        </button>
                        <div className="header-right-actions">
                            <button
                                className="logout-trigger-btn prompt-btn"
                                onClick={logout}
                                title="Sortir"
                            >
                                <LogOut size={26} />
                            </button>
                            <button
                                className="studio-trigger-btn prompt-btn"
                                onClick={() => setIsStudioOpen(true)}
                                title="Estudi de perfil"
                            >
                                <Camera size={26} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Avatar and Info Overlay - NOW OUTSIDE to fix clipping */}
            <div className="profile-main-info">
                <div className="avatar-wrapper">
                    <div className="avatar-big">
                        {displayProfile.avatar_url ? (
                            <img src={displayProfile.avatar_url} alt="Profile" />
                        ) : (
                            <User size={50} color="#cbd5e1" />
                        )}
                    </div>
                    <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={(e) => handleFileChange(e, 'avatar')}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </div>
            </div>

            <div className="profile-name-section">
                <h2>{displayProfile.full_name || 'Usuari'}</h2>
                {user?.isDemo && (
                    <div className="demo-badge">
                        <span>🧪 Mode Demo: Volàtil</span>
                    </div>
                )}

                <div className="profile-town-management">
                    <button className="main-town-btn" onClick={() => setIsEditingTown(true)}>
                        <MapPin size={18} />
                        {userTown?.name || 'Selecciona poble'}
                    </button>
                    <p className="comarca-text">{userTown ? userTown.comarca : 'Sense poble assignat'}</p>

                    <div className="additional-towns-section">
                        {allTowns.length > 0 && !displayProfile.town_id && (
                            <button className="add-town-btn-inline" onClick={() => setIsEditingTown(true)}>
                                <Plus size={14} /> {t('nav.add_town') || 'Afegir poble'}
                            </button>
                        )}
                    </div>
                </div>

                <TownSelectorModal
                    isOpen={isEditingTown}
                    onClose={() => setIsEditingTown(false)}
                    onSelect={(town) => handleTownChange(town.uuid || town.id)}
                />
            </div>

            <div className="profile-stats-bar">
                <div className="stat-card">
                    <span className="stat-value">23</span>
                    <span className="stat-label">{t('nav.stats_posts')}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">5</span>
                    <span className="stat-label">{t('nav.stats_sales')}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">142</span>
                    <span className="stat-label">{t('nav.stats_connections')}</span>
                </div>
            </div>

            <div className="profile-menu">
                {menuItems.map(item => (
                    <button key={item.id} className="menu-item" onClick={() => handleMenuClick(item.id)}>
                        <div className="menu-item-left">
                            <span className={`menu-icon ${item.id}`}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="chevron" />
                    </button>
                ))}
            </div>

            <div className="profile-entities-box">
                <h3 className="section-subtitle">{t('nav.my_entities')}</h3>
                <MyEntitiesList userId={user?.id} />
            </div>

            <div className="sovereignty-box">
                <h3 className="section-subtitle">Sobirania de Dades (GDPR)</h3>
                <p className="section-description">Descarrega tota la teua activitat i contingut generat.</p>
                <div className="export-actions">
                    <button className="btn-export-secondary" onClick={() => exportService.downloadAsTXT(user.id, displayProfile.full_name)}>
                        Dades en TXT
                    </button>
                    <button className="btn-export-primary" onClick={() => exportService.downloadAsPDF(user.id, displayProfile.full_name)}>
                        Generar Informe PDF
                    </button>
                </div>
            </div>

            <div className="logout-wrapper">
                <button onClick={logout} className="btn-logout-minimal">
                    <LogOut size={18} />
                    {t('auth.logout')}
                </button>
                <div className="app-version">v1.1.4</div>
            </div>

            <MediaDeduplicationModal
                isOpen={isDedupModalOpen}
                onClose={() => setIsDedupModalOpen(false)}
                onConfirm={handleDedupConfirm}
                pendingFile={pendingAsset ? { type: pendingAsset.mime_type } : null}
            />

            <ProfileStudioModal
                isOpen={isStudioOpen}
                onClose={() => setIsStudioOpen(false)}
                profile={displayProfile}
                isUploading={isUploading}
                uploadType={uploadType}
                onFileSelect={handleFileChange}
                onReposition={handleReposition}
                onAlbumSelect={(type) => { setPendingType(type); setIsPickerOpen(true); }}
            />

            <MediaPickerModal
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={handlePickerSelect}
            />

            <ImageReframerModal
                isOpen={isReframerOpen}
                imageSrc={tempImageSrc}
                aspectRatio={pendingType === 'avatar' ? 1 : 16 / 9}
                onConfirm={handleReframerConfirm}
                onClose={() => setIsReframerOpen(false)}
            />
        </div>
    );
};

export default Profile;
