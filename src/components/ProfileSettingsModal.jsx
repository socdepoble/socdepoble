import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Globe, MapPin, Plus, Loader2, Camera, User, Image as ImageIcon, Beaker, ShieldAlert, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import TownSelectorModal from '../components/TownSelectorModal';
import LanguageSelector from '../components/LanguageSelector';
import '../pages/Auth.css'; // Reusing some base styles
import { authService } from '../services/authService';
import { useModalFocusTrap } from '../hooks/useModalFocusTrap';

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

    const modalRef = React.useRef(null);
    useModalFocusTrap(isOpen, onClose, modalRef);

    // Ensure state updates completely when modal opens or profile changes
    const townNamesCacheRef = React.useRef({});
    const saveRef = React.useRef(false);
    const [townNamesCache, setTownNamesCache] = useState({});
    
    // Cleanup of object URLs
    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
            if (coverPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, [avatarPreview, coverPreview]);

    // Body scroll lock is now handled natively by the hook. We can remove the redundant manual lock.

    // Body scroll lock is now handled natively by the hook. We can remove the redundant manual lock.

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
            if (Object.keys(townNamesCacheRef.current).length === 0) {
                const loadTownNames = async () => {
                    try {
                        const allTowns = await supabaseService.getTowns();
                        const cache = {};
                        allTowns.forEach(t => {
                            cache[t.uuid || t.id] = t.name;
                        });
                        townNamesCacheRef.current = cache;
                        setTownNamesCache(cache);
                    } catch (e) {
                        console.error("Failed loading towns cache for names:", e);
                    }
                };
                loadTownNames();
            }
        }
    }, [isOpen, profile]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (coverPreview && coverPreview.startsWith('blob:')) {
                URL.revokeObjectURL(coverPreview);
            }
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        if (isSaving || saveRef.current) return;
        saveRef.current = true;
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
            saveRef.current = false;
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
            <div 
                ref={modalRef}
                tabIndex="-1"
                className="bg-theme-panel border border-[var(--border-master)] rounded-[28px] w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh] outline-none"
            >
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
