import React, { useState } from 'react';
import { X, Globe, MapPin, Plus, Loader2, Camera, User, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import TownSelectorModal from '../components/TownSelectorModal';
import '../pages/Auth.css'; // Reusing some base styles

const ProfileSettingsModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
    const { language, setLanguage } = useI18n();
    const [isSaving, setIsSaving] = useState(false);
    const [townSelector, setTownSelector] = useState({ isOpen: false, type: null });

    // Local state for optimistic UI updates before saving
    const [localProfile, setLocalProfile] = useState({
        full_name: profile?.full_name || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        cover_url: profile?.cover_url || '',
        town_uuid: profile?.town_uuid || null,
        town_name: profile?.town_name || null,
        secondary_towns: profile?.secondary_towns || [],
        secondary_towns_names: profile?.secondary_towns_names || [] // Assuming we need names
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
    const [coverPreview, setCoverPreview] = useState(profile?.cover_url || '');

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

    const languages = [
        { code: 'va', label: 'Valencià' },
        { code: 'es', label: 'Castellano' },
        { code: 'en', label: 'English' },
        { code: 'eu', label: 'Euskera' },
        { code: 'fr', label: 'Français' },
    ];

    const handleLanguageChange = (code) => {
        setLanguage(code);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates = {
                full_name: localProfile.full_name,
                bio: localProfile.bio,
                town_uuid: localProfile.town_uuid,
                town_name: localProfile.town_name,
                secondary_towns: localProfile.secondary_towns || []
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
                    <h2 className="text-xl font-black uppercase tracking-widest text-[#F97316]">Configuració (BETA)</h2>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User size={18} className="text-[#F97316]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Identitat del Node</h3>
                        </div>

                        {/* Covers & Avatars */}
                        <div className="relative w-full h-32 rounded-2xl bg-black/40 overflow-visible border border-white/10 mb-10 group cursor-pointer" onClick={() => document.getElementById('cover-input').click()}>
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity rounded-2xl" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center rounded-2xl">
                                    <ImageIcon size={32} className="text-white/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/80 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-xl backdrop-blur-sm border border-white/20">Canviar Portada</span>
                            </div>
                            <input type="file" id="cover-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCoverChange} />
                            
                            {/* Avatar */}
                            <div className="absolute -bottom-8 left-6 z-10" onClick={(e) => { e.stopPropagation(); document.getElementById('avatar-input').click(); }}>
                                <div className="relative w-24 h-24 rounded-full border-4 border-solid border-[var(--bg-master)] overflow-hidden bg-gray-900 group/avatar cursor-pointer shadow-xl">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-opacity" />
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
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F97316]/50 focus:ring-1 focus:ring-[#F97316]/50 transition-all font-bold"
                                    placeholder="Com et dius?"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Presentació (Bio)</label>
                                <textarea 
                                    value={localProfile.bio || ''} 
                                    onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F97316]/50 focus:ring-1 focus:ring-[#F97316]/50 transition-all resize-none h-24 text-sm"
                                    placeholder="Una breu descripció..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-px w-full bg-white/5 my-0"></div>
                    {/* Language Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={18} className="text-[#F97316]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Idioma del Sistema</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                                        language === lang.code 
                                        ? 'bg-[#F97316] text-white border-[#F97316]' 
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Towns Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} className="text-[#F97316]" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Vinculació Territorial</h3>
                        </div>

                        {/* Primary Town */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                                <span>Poble Principal</span>
                                <span className="text-[#F97316]">CENSAT</span>
                            </p>
                            <div 
                                className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
                                onClick={() => openTownSelector('primary')}
                            >
                                <span className="font-bold text-lg">{localProfile.town_name || 'No especificat'}</span>
                                <span className="text-xs bg-[#F97316]/20 text-[#F97316] px-2 py-1 rounded-full uppercase font-black">Canviar</span>
                            </div>
                        </div>

                        {/* Secondary Towns */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                                Pobles Secundaris / Vinculats (Max. 2)
                            </p>
                            <div className="space-y-2">
                                {(localProfile.secondary_towns || []).map((tUUID, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-xl">
                                        <span className="text-sm font-medium">{tUUID}</span>
                                        <button 
                                            onClick={() => {
                                                const newSec = [...localProfile.secondary_towns];
                                                newSec.splice(idx, 1);
                                                setLocalProfile(prev => ({...prev, secondary_towns: newSec}));
                                            }}
                                            className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {(localProfile.secondary_towns || []).length < 2 && (
                                    <button 
                                        onClick={() => openTownSelector('secondary')}
                                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 transition-all text-sm font-medium"
                                    >
                                        <Plus size={16} />
                                        Afegir poble secundari
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[var(--border-master)] bg-black/40">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-black uppercase tracking-widest py-4 rounded-[20px] transition-all flex items-center justify-center gap-2"
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
