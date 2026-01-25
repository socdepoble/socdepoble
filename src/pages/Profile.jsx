import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import {
    User, LogOut, Camera, Save, Building2, Store, Settings, Star, Home,
    Bell, Lock, HelpCircle, Info, ChevronRight, MapPin, MessageCircle,
    Plus, Moon, Sun, ArrowLeft, Loader2, Image as ImageIcon, Maximize,
    LayoutGrid, Activity, ShieldCheck, Globe, Edit2
} from 'lucide-react';
import { logger } from '../utils/logger';
import TownSelectorModal from '../components/TownSelectorModal';
import MediaDeduplicationModal from '../components/MediaDeduplicationModal';
import ImageReframerModal from '../components/ImageReframerModal';
import ProfileStudioModal from '../components/ProfileStudioModal';
import MediaPickerModal from '../components/MediaPickerModal';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import StatusLoader from '../components/StatusLoader';
import { exportService } from '../services/exportService';
import IAIATamagotchiSettings from '../components/IAIATamagotchiSettings';
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

    return (
        <div className="entities-scroll-container">
            {/* Create New Card (Always First) */}
            <div className="entity-card-create" onClick={() => navigate('/gestio-entitats')}>
                <div className="create-icon-area">
                    <Plus size={24} />
                </div>
                <div className="entity-info">
                    <h4>Nova Entitat</h4>
                    <span className="entity-role">Empresa o Grup</span>
                </div>
            </div>

            {/* Existing Entities */}
            {entities.map(ent => (
                <div key={ent.id} className="entity-card-modern" onClick={() => navigate(`/entitat/${ent.id}`)}>
                    <div className={`entity-avatar-modern ${ent.type}`}>
                        {ent.avatar_url ? (
                            <img src={ent.avatar_url} alt={ent.name} />
                        ) : (
                            ent.type === 'empresa' ? <Store size={22} /> : <Building2 size={22} />
                        )}
                        <span className="manage-badge"><Settings size={12} /></span>
                    </div>
                    <div className="entity-info">
                        <h4>{ent.name}</h4>
                        <span className="entity-role">
                            {ent.type === 'empresa' ? 'Negoci Local' : 'Associació'}
                        </span>
                        <div className="entity-meta">
                            <span className={`role-pill ${ent.member_role}`}>
                                {ent.member_role === 'admin' ? 'Administrador' : 'Membre'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { profile, setProfile, user, isPlayground } = useAuth();
    const { theme, toggleTheme } = useUI();
    const location = useLocation();

    // Tab state
    const [activeTab, setActiveTab] = useState('info'); // info, activity, community, settings

    // [CRITICAL FIX] Define derived state variables EARLY to avoid TDZ (Temporal Dead Zone) in hooks
    const displayProfile = profile || {
        full_name: user?.email?.split('@')[0] || 'Usuari',
        avatar_url: null,
        cover_url: null,
        town_id: null
    };

    // allTowns is state, so this recalculates on render. Safe.
    const userTown = allTowns.find(t => t.uuid === profile?.town_uuid || t.id === profile?.town_id);

    const handleBack = () => {
        if (location.state?.fromProfile) {
            navigate(-2);
        } else {
            navigate(-1);
        }
    };

    const [allTowns, setAllTowns] = useState([]);
    const [isEditingTown, setIsEditingTown] = useState(false);
    const [townEditMode, setTownEditMode] = useState('primary'); // 'primary' or 'secondary'
    const [editingSecondaryIdx, setEditingSecondaryIdx] = useState(null);
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

    // Editing state for text fields
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [oficiValue, setOficiValue] = useState('');
    const [bioValue, setBioValue] = useState('');
    const [secondaryTowns, setSecondaryTowns] = useState([]);

    // Stats State
    const [stats, setStats] = useState({ posts: 0, items: 0, connections: 0 });

    useEffect(() => {
        // Només actualitzar valors si NO estem editant per evitar sobreescriure canvis actius
        if (profile && !isEditingCard) {
            setOficiValue(profile.ofici || '');
            setBioValue(profile.bio || '');
            setSecondaryTowns(profile.secondary_towns || []);
        }

        if (user?.id) {
            Promise.all([
                supabaseService.getUserPosts(user.id),
                supabaseService.getUserMarketItems(user.id),
                supabaseService.getFollowers(user.id)
            ]).then(([posts, items, followers]) => {
                setStats({
                    posts: posts?.length || 0,
                    items: items?.length || 0,
                    connections: followers?.length || 0
                });
            }).catch(err => {
                logger.error('Error fetching profile stats:', err);
                // Safe defaults on error
                setStats({ posts: 0, items: 0, connections: 0 });
            });
        }
    }, [profile, user, isEditingCard]);

    const [renderError, setRenderError] = useState(null);

    // Error catching effect (MOVED UP to avoid conditional hook violation)
    useEffect(() => {
        try {
            // Self-check critical variables
            if (!navigate) throw new Error("Navigation not available");
        } catch (e) {
            setRenderError(e);
        }
    }, [navigate]);

    useEffect(() => {
        supabaseService.getTowns().then(setAllTowns);
    }, []);

    // --- HOOKS & HANDLERS (Must be unconditional) ---

    // Define all callbacks first
    const handleTownChange = useCallback(async (townId) => {
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
                // Secondary town logic
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
    }, [user?.id, profile, isPlayground, townEditMode, secondaryTowns, editingSecondaryIdx]);

    const handleSocialPreferenceChange = useCallback(async (preference) => {
        try {
            const updated = await supabaseService.updateProfile(user.id, {
                social_image_preference: preference
            });
            setProfile(updated);
            logger.log('[Profile] Social share preference updated:', preference);
        } catch (error) {
            logger.error('Error updating social preference:', error);
        }
    }, [user?.id]);

    const handleCardSubmit = useCallback(async () => {
        try {
            const updates = {
                ofici: oficiValue,
                bio: bioValue,
                secondary_towns: secondaryTowns
            };

            // Si s'ha seleccionat un poble, afegir-lo
            if (userTown) {
                if (userTown.uuid) {
                    updates.town_uuid = userTown.uuid;
                } else if (userTown.id) {
                    // Legacy support
                    updates.town_id = userTown.id;
                    updates.town_uuid = null; // Clear UUID if switching to legacy ID (optional, but cleaner)
                }
            }

            const updated = await supabaseService.updateProfile(user.id, updates);
            setProfile(updated);
            setIsEditingCard(false);
            logger.log('[Profile] Card info updated:', updates);
        } catch (error) {
            logger.error('Error updating card info:', error);
            alert(`Error guardant: ${error.message}`);
        }
    }, [user?.id, oficiValue, bioValue, userTown, secondaryTowns]);

    const handleReframerConfirm = useCallback(async (croppedBlob) => {
        setIsReframerOpen(false);
        const type = pendingType;
        const originalFile = pendingFile;
        let parentId = pendingParentId;

        setIsUploading(true);
        setUploadType(type);

        try {
            if (originalFile && originalFile.size > 0 && !parentId) {
                const rawResult = await supabaseService.processMediaUpload(
                    user.id,
                    originalFile,
                    'profiles',
                    'raw',
                    true
                );
                parentId = rawResult.asset.id;
            }

            const croppedFile = new File([croppedBlob], originalFile.name || 'cropped.jpg', { type: 'image/jpeg' });
            const result = await supabaseService.processMediaUpload(
                user.id,
                croppedFile,
                'profiles',
                type,
                true,
                parentId
            );

            const updatePayload = type === 'avatar'
                ? { avatar_url: result.url }
                : { cover_url: result.url };

            // Update profile
            await supabaseService.updateProfile(user.id, updatePayload);

            // CRITICAL: Force refresh from DB to ensure we get the complete profile
            // updateProfile might return incomplete data due to optimistic fallback
            const freshProfile = await supabaseService.getProfile(user.id);
            setProfile(freshProfile);

            logger.log(`[Profile] ${type} updated successfully:`, result.url);
        } catch (error) {
            logger.error(`[Profile] Error in ${type} flow:`, error);
            alert(`Error al processar la imatge: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadType(null);
            setPendingFile(null);
            setPendingParentId(null);
        }
    }, [user?.id, pendingType, pendingFile, pendingParentId]);

    const handleDedupConfirm = useCallback(async () => {
        try {
            setIsDedupModalOpen(false);
            setIsUploading(true);
            setUploadType(pendingType);

            await supabaseService.registerMediaUsage(pendingAsset.id, user.id, pendingType);

            const updatePayload = pendingType === 'avatar'
                ? { avatar_url: pendingAsset.url }
                : { cover_url: pendingAsset.url };

            await supabaseService.updateProfile(user.id, updatePayload);

            // Force refresh to get complete profile
            const freshProfile = await supabaseService.getProfile(user.id);
            setProfile(freshProfile);

            logger.log(`[Profile] ${pendingType} updated (dedup):`, pendingAsset.url);
        } catch (error) {
            logger.error(`[Profile] Error in deduplication confirm:`, error);
        } finally {
            setIsUploading(false);
            setUploadType(null);
            setPendingAsset(null);
            setPendingType(null);
        }
    }, [user?.id, pendingType, pendingAsset]);

    // Regular functions (not hooks, but used in render)
    const handleReposition = async (type) => {
        const currentUrl = type === 'avatar' ? displayProfile.avatar_url : displayProfile.cover_url;
        if (!currentUrl) return;

        setIsUploading(true);
        try {
            const asset = await supabaseService.getMediaAssetByUrl(currentUrl);
            if (asset) {
                const parent = await supabaseService.getParentAsset(asset.id);
                if (parent) {
                    setTempImageSrc(parent.url);
                    setPendingParentId(parent.id);
                } else {
                    setTempImageSrc(asset.url);
                    setPendingParentId(asset.id);
                }
            } else {
                setTempImageSrc(currentUrl);
                setPendingParentId(null);
            }

            setPendingFile(new File([], 'repositioning.jpg', { type: 'image/jpeg' }));
            setPendingType(type);
            setIsReframerOpen(true);
        } catch (error) {
            logger.error('Error in handleReposition:', error);
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

        const reader = new FileReader();
        reader.onload = (e) => {
            setTempImageSrc(e.target.result);
            setPendingFile(file);
            setPendingType(type);
            setPendingParentId(null);
            setIsReframerOpen(true);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handlePickerSelect = async (asset) => {
        setIsPickerOpen(false);
        setUploadType(pendingType);
        setTempImageSrc(asset.url);
        if (asset.parent_id) {
            setPendingParentId(asset.parent_id);
        } else {
            setPendingParentId(asset.id);
        }
        setPendingFile(new File([], asset.url.split('/').pop() || 'image.jpg', { type: asset.mime_type }));
        setIsReframerOpen(true);
    };

    const isLoading = !user && !profile;

    if (isLoading) return <StatusLoader type="loading" />;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="tab-pane-fade-in info-pane">
                        <section className="profile-edit-section">
                            <div className="section-header-compact">
                                <h3>Dades de Veí</h3>
                                <button className="btn-icon-sm" onClick={() => setIsEditingCard(!isEditingCard)}>
                                    {isEditingCard ? <Save size={18} /> : <Edit2 size={18} />}
                                </button>
                            </div>

                            <div className="edit-grid">
                                <div className="field-group">
                                    <label htmlFor="ofici-input">Ofici</label>
                                    <input
                                        id="ofici-input"
                                        name="ofici"
                                        type="text"
                                        value={oficiValue}
                                        onChange={(e) => setOficiValue(e.target.value)}
                                        disabled={!isEditingCard}
                                        placeholder="Estudiant, Fuster, Farmacèutica..."
                                    />
                                </div>
                                <div className="field-group">
                                    <span className="form-label">Poble Principal</span>
                                    <button
                                        className={`town-picker-btn ${isEditingCard ? 'active' : ''}`}
                                        onClick={() => {
                                            if (isEditingCard) {
                                                setTownEditMode('primary');
                                                setIsEditingTown(true);
                                            }
                                        }}
                                        disabled={!isEditingCard}
                                    >
                                        <MapPin size={16} />
                                        <span>{userTown?.name || 'Selecciona el teu poble'}</span>
                                    </button>
                                </div>
                                <div className="field-group full-width">
                                    <span className="form-label">Pobles de Cor (Secundaris)</span>
                                    <div className="secondary-towns-grid">
                                        {secondaryTowns.map((tUuid, idx) => {
                                            const t = allTowns.find(town => town.uuid === tUuid || town.id === tUuid);
                                            return (
                                                <div key={tUuid} className="secondary-town-chip">
                                                    <span>{t?.name || 'Carregant...'}</span>
                                                    {isEditingCard && (
                                                        <button className="remove-secondary" onClick={() => {
                                                            const updated = secondaryTowns.filter((_, i) => i !== idx);
                                                            setSecondaryTowns(updated);
                                                        }}>
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {isEditingCard && secondaryTowns.length < 3 && (
                                            <button className="add-secondary-btn" onClick={() => {
                                                setTownEditMode('secondary');
                                                setEditingSecondaryIdx(null);
                                                setIsEditingTown(true);
                                            }}>
                                                <Plus size={16} /> Afegir Poble
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="field-group full-width">
                                    <label htmlFor="bio-input">Frase / Bio</label>
                                    <textarea
                                        id="bio-input"
                                        name="bio"
                                        value={bioValue}
                                        onChange={(e) => setBioValue(e.target.value)}
                                        disabled={!isEditingCard}
                                        placeholder="Una frase que et identifique al poble..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                            {isEditingCard && (
                                <button className="btn-primary full-width mt-md" onClick={handleCardSubmit}>
                                    Guardar Canvis
                                </button>
                            )}
                        </section>

                        {/* SECCIÓ ENTITATS (Moved here for better visibility) */}
                        <section className="entities-preview-section" style={{ padding: '0 20px 20px' }}>
                            <div className="section-header-compact">
                                <h3>Les meues Empreses i Grups</h3>
                            </div>
                            <MyEntitiesList userId={user?.id} />
                        </section>

                        <section className="action-cards-grid">
                            <div className="action-card-mini" onClick={() => navigate(`/perfil/${user.id}`)}>
                                <div className="card-icon blue"><Globe size={24} /></div>
                                <div className="card-text">
                                    <h4>Veure Mur Públic</h4>
                                    <p>Com et veuen els altres veïns</p>
                                </div>
                                <ChevronRight size={18} />
                            </div>
                        </section>
                    </div>
                );
            case 'activity':
                return (
                    <div className="tab-pane-fade-in activity-pane">
                        <div className="activity-grid">
                            <div className="activity-card" onClick={() => navigate('/fotos')}>
                                <div className="card-header">
                                    <div className="icon-box"><ImageIcon size={20} /></div>
                                    <h4>El meu Àlbum</h4>
                                </div>
                                <p>Totes les fotos i vídeos que has pujat al portal.</p>
                                <div className="card-footer">Veure Fotos <ChevronRight size={14} /></div>
                            </div>

                            <div className="activity-card" onClick={() => navigate('/perfil?tab=posts')}>
                                <div className="card-header">
                                    <div className="icon-box"><MessageCircle size={20} /></div>
                                    <h4>Les meues Publicacions</h4>
                                </div>
                                <p>Historial de tot el que has compartit al mur.</p>
                                <div className="card-footer">Veure Mur <ChevronRight size={14} /></div>
                            </div>

                            <div className="activity-card" onClick={() => navigate('/perfil?tab=products')}>
                                <div className="card-header">
                                    <div className="icon-box"><Store size={20} /></div>
                                    <h4>Els meus Productes</h4>
                                </div>
                                <p>Gestiona els articles que tens a la venda al mercat.</p>
                                <div className="card-footer">Gestionar Mercat <ChevronRight size={14} /></div>
                            </div>

                            <div className="activity-card" onClick={() => navigate('/admin?tab=categories')}>
                                <div className="card-header">
                                    <div className="icon-box"><Settings size={20} /></div>
                                    <h4>Etiquetes i Categories</h4>
                                </div>
                                <p>Organitza les teues preferències i subscripcions.</p>
                                <div className="card-footer">Configurar <ChevronRight size={14} /></div>
                            </div>
                        </div>

                        {(stats.posts === 0 || stats.items === 0) && (
                            <div className="onboarding-suggestion mt-xl">
                                <h3>Encara no has compartit res?</h3>
                                <p>Fes que el teu poble conega les teues històries o productes!</p>
                                <div className="btn-group-center">
                                    <button className="btn-primary-sm" onClick={() => navigate('/mur')}>
                                        <Plus size={16} /> Publicar al Mur
                                    </button>
                                    <button className="btn-secondary-sm" onClick={() => navigate('/mercat')}>
                                        <Plus size={16} /> Vendre al Mercat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'community':
                return (
                    <div className="tab-pane-fade-in community-pane">
                        <section className="entities-section">
                            <h3 className="section-title">Les meues Entitats</h3>
                            <MyEntitiesList userId={user?.id} />
                        </section>

                        <section className="community-quick-links">
                            <div className="menu-item-compact" onClick={() => navigate('/pobles')}>
                                <Home size={18} /> Els meus pobles
                                <ChevronRight size={16} />
                            </div>
                            <div className="menu-item-compact" onClick={() => navigate('/favorits')}>
                                <Star size={18} /> Continguts guardats
                                <ChevronRight size={16} />
                            </div>
                        </section>
                    </div>
                );
            case 'settings':
                return (
                    <div className="tab-pane-fade-in settings-pane">
                        <section className="settings-section">
                            <h3 className="section-title">Preferències de la App</h3>

                            <div className="setting-row" onClick={toggleTheme}>
                                <div className="setting-info">
                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                    <span>{theme === 'light' ? 'Activar Mode Nit' : 'Activar Mode Dia'}</span>
                                </div>
                                <div className="toggle-switch">
                                    <div className={`switch-knob ${theme === 'dark' ? 'on' : 'off'}`} />
                                </div>
                            </div>

                            <div className="setting-row" onClick={() => navigate('/notificacions')}>
                                <div className="setting-info">
                                    <Bell size={18} />
                                    <span>Notificacions</span>
                                </div>
                                <ChevronRight size={18} />
                            </div>
                        </section>

                        <section className="settings-section">
                            <h3 className="section-title">Privadesa i Seguretat</h3>

                            <div className="social-sharing-compact">
                                <p>Miniatura per a xarxes socials:</p>
                                <div className="toggle-group-mini">
                                    <button
                                        className={displayProfile.social_image_preference === 'avatar' ? 'active' : ''}
                                        onClick={() => handleSocialPreferenceChange('avatar')}
                                    >Avatar</button>
                                    <button
                                        className={displayProfile.social_image_preference === 'cover' ? 'active' : ''}
                                        onClick={() => handleSocialPreferenceChange('cover')}
                                    >Portada</button>
                                    <button
                                        className={(!displayProfile.social_image_preference || displayProfile.social_image_preference === 'none') ? 'active' : ''}
                                        onClick={() => handleSocialPreferenceChange('none')}
                                    >Logo</button>
                                </div>
                            </div>

                            <div className="privacy-toggle-row" onClick={async () => {
                                const currentSettings = displayProfile.privacy_settings || { show_read_receipts: true };
                                const startValue = currentSettings.show_read_receipts !== false; // Default true
                                const newSettings = { ...currentSettings, show_read_receipts: !startValue };

                                try {
                                    const updated = await supabaseService.updateProfile(user.id, { privacy_settings: newSettings });
                                    setProfile(updated);
                                    // Feedback visual
                                    const action = !startValue ? 'activada' : 'desactivada';
                                    alert(`Confirmació de lectura ${action}.`);
                                } catch (err) {
                                    logger.error('Error updating privacy:', err);
                                }
                            }}>
                                <div className="setting-info">
                                    <ShieldCheck size={18} />
                                    <div className="setting-text-stack">
                                        <span>Confirmació de Lectura</span>
                                        <small>Si ho desactives, no veuràs quan els altres et llegeixen ni ells quan tu ho fas.</small>
                                    </div>
                                </div>
                                <div className="toggle-switch">
                                    <div className={`switch-knob ${(displayProfile.privacy_settings?.show_read_receipts !== false) ? 'on' : 'off'}`} />
                                </div>
                            </div>

                            <div className="gdpr-actions">
                                <h4>Sobirania de Dades</h4>
                                <div className="btn-group-sm">
                                    <button onClick={() => exportService.downloadAsTXT(user.id, displayProfile.full_name)}>TXT</button>
                                    <button onClick={() => exportService.downloadAsPDF(user.id, displayProfile.full_name)}>PDF</button>
                                </div>
                            </div>
                        </section>

                        <section className="settings-section">
                            <h3 className="section-title">El teu Tamagotchi Rural</h3>
                            <IAIATamagotchiSettings
                                userId={user?.id}
                                profile={profile}
                                onUpdate={(updated) => setProfile(updated)}
                            />
                        </section>



                        <div className="settings-section logout-section" style={{ marginTop: '24px', marginBottom: '40px' }}>
                            <button
                                className="btn-logout-danger full-width"
                                onClick={async () => {
                                    if (window.confirm('Segur que vols tancar la sessió?')) {
                                        await supabaseService.signOut();
                                        window.location.href = '/login';
                                    }
                                }}
                                style={{
                                    background: '#fee2e2',
                                    color: '#ef4444',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    fontSize: '1rem'
                                }}
                            >
                                <LogOut size={20} />
                                Tancar Sessió
                            </button>
                        </div>

                        <div className="app-footer">
                            <HelpCircle size={14} /> Ajuda i Suport • v1.3.1
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Hooks moved to top


    if (renderError) {
        return (
            <div className="profile-container optimized-profile">
                <div style={{ padding: 40, textAlign: 'center' }}>
                    <h3>Error al carregar perfil</h3>
                    <p>{renderError.message}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">Recarregar</button>
                    <button onClick={() => navigate('/chats')} className="btn-secondary-sm mt-md">Tornar a Xats</button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container optimized-profile">
            <ProfileHeaderPremium
                type="person"
                title={displayProfile.full_name}
                subtitle={oficiValue}
                town={userTown?.name}
                bio={bioValue}
                avatarUrl={displayProfile.avatar_url}
                coverUrl={displayProfile.cover_url}
                isEditing={false}
                onBack={handleBack}
                onAction={() => setIsStudioOpen(true)}
                actionIcon={<Camera size={22} />}
                shareData={{
                    title: displayProfile.full_name,
                    text: bioValue || `Hola! Sóc d'aquí de tota la vida. Connecta amb mi a Sóc de Poble!`,
                    url: `${window.location.origin}/perfil/${user?.id}`
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

            <nav className="profile-tabs-nav">
                <button
                    className={activeTab === 'info' ? 'active' : ''}
                    onClick={() => setActiveTab('info')}
                >
                    <User size={20} />
                    <span>Perfil</span>
                </button>
                <button
                    className={activeTab === 'activity' ? 'active' : ''}
                    onClick={() => setActiveTab('activity')}
                >
                    <Activity size={20} />
                    <span>Activitat</span>
                </button>
                <button
                    className={activeTab === 'community' ? 'active' : ''}
                    onClick={() => setActiveTab('community')}
                >
                    <LayoutGrid size={20} />
                    <span>Veïns</span>
                </button>
                <button
                    className={activeTab === 'settings' ? 'active' : ''}
                    onClick={() => setActiveTab('settings')}
                >
                    <Settings size={20} />
                    <span>Ajustos</span>
                </button>
            </nav>

            <main className="profile-tab-content">
                {renderTabContent()}
            </main>

            <TownSelectorModal
                isOpen={isEditingTown}
                onClose={() => setIsEditingTown(false)}
                onSelect={(town) => handleTownChange(town.uuid || town.id)}
            />

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
        </div >
    );
};

export default Profile;
