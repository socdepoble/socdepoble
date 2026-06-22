import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { supabaseService } from '../../core/services/supabaseService';
import '../../pages/auth/Auth.css';
import { authService } from '../../core/services/authService';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import TownSelectorModal from './TownSelectorModal';
import LanguageSelector from '../ui/LanguageSelector';
import { X, User, ImageIcon, Camera, MapPin, Plus, ShieldAlert, Beaker, Terminal } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { UniversalInput } from '../ui/Input/UniversalInput';

const ProfileSettingsModal = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate
}) => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [townSelector, setTownSelector] = useState({ isOpen: false, type: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [localProfile, setLocalProfile] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    cover_url: profile?.cover_url || '',
    town_uuid: profile?.town_uuid || null,
    town_name: profile?.town_name || null,
    secondary_towns: profile?.secondary_towns || [],
    secondary_towns_names: profile?.secondary_towns_names || [],
    cover_position_y: profile?.cover_position_y || 50
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const [coverPreview, setCoverPreview] = useState(profile?.cover_url || '');
  const [coverPositionY, setCoverPositionY] = useState(profile?.cover_position_y || 50);
  const modalRef = React.useRef(null);
  useModalFocusTrap(isOpen, onClose, modalRef);

  const townNamesCacheRef = React.useRef({});
  const saveRef = React.useRef(false);
  const [townNamesCache, setTownNamesCache] = useState({});

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

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
        cover_position_y: profile.cover_position_y || 50,
        iaia_settings: profile.iaia_settings || {}
      });
      setAvatarPreview(profile.avatar_url || '');
      setCoverPreview(profile.cover_url || '');
      setCoverPositionY(profile.cover_position_y || 50);
      setAvatarFile(null);
      setCoverFile(null);

      if (Object.keys(townNamesCacheRef.current).length === 0) {
        const loadTownNames = async () => {
          try {
            const allTowns = await supabaseService.getTowns();
            const cache = {};
            allTowns.forEach(t => { cache[t.uuid || t.id] = t.name; });
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

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
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
        cover_position_y: coverPositionY,
        iaia_settings: localProfile.iaia_settings
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
      if (onProfileUpdate) onProfileUpdate(updates);
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
      navigate('/', { replace: true });
    } catch (error) {
      console.error('[ProfileSettings] Error deleting account:', error);
      alert("S'ha produït un error al intentar eliminar el compte base.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const openTownSelector = type => {
    setTownSelector({ isOpen: true, type });
  };

  const handleTownSelect = async town => {
    setTownSelector({ isOpen: false, type: null });
    if (!town) return;
    if (townSelector.type === 'primary') {
      setLocalProfile(prev => ({ ...prev, town_uuid: town.id, town_name: town.name }));
    } else if (townSelector.type === 'secondary') {
      const currentSecondary = [...(localProfile.secondary_towns || [])];
      if (currentSecondary.length >= 2) {
        currentSecondary[1] = town.id;
      } else {
        currentSecondary.push(town.id);
      }
      setLocalProfile(prev => ({ ...prev, secondary_towns: currentSecondary }));
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    document.getElementById('avatar-input').click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div ref={modalRef} tabIndex="-1" className='bg-white border border-gray-200 rounded-[28px] w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh] outline-none'>
    
            <div role="region" aria-label="Capçalera de Secció" className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-xl font-black uppercase tracking-widest text-gray-900 m-0'>Configuració <span className="text-orange-500">(BETA)</span></h2>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8 bg-gray-50">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <User size={18} className='text-orange-500' />
                        <h3 className="font-bold uppercase tracking-wider text-sm m-0 text-gray-900">Identitat del Node</h3>
                    </div>

                    <div className="relative w-full h-32 rounded-2xl bg-gray-200 overflow-visible border border-gray-300 mb-10 mt-6 group/cover">
                        {coverPreview ? (
                            /* eslint-disable-next-line no-restricted-syntax */
                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover rounded-2xl" style={{ objectPosition: `50% ${coverPositionY}%` }} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center rounded-2xl cursor-pointer hover:bg-gray-300 transition-colors" onClick={() => document.getElementById('cover-input').click()}>
                                <ImageIcon size={32} className="text-gray-400" />
                            </div>
                        )}

                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity z-20">
                            <button className='bg-white p-2 rounded-full shadow-sm hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-colors' title="Penjar Nova Foto" onClick={() => document.getElementById('cover-input').click()}>
                                <Camera size={16} />
                            </button>
                        </div>
                        
                        {coverPreview && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity pointer-events-none">
                                <span className='bg-white/90 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-orange-500 shadow-sm backdrop-blur-sm border border-gray-200 mb-2'>Ajusta Alçada Paret</span>
                                <input type="range" min="0" max="100" value={coverPositionY} onChange={e => setCoverPositionY(e.target.value)} className='w-32 h-2 rounded-xl accent-orange-500 pointer-events-auto' title="Llisca per centrar la teua foto" />
                            </div>
                        )}

                        <input type="file" id="cover-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleCoverChange} />
                        
                        <div className="absolute -bottom-8 left-6 z-30" onClick={handleAvatarClick}>
                            <div className='relative w-24 h-24 rounded-[50%] border-4 border-white overflow-hidden bg-gray-100 group/avatar cursor-pointer shadow-sm isolate aspect-square flex items-center justify-center'>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-opacity rounded-[50%] block aspect-square" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <User size={32} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-gray-900 drop-shadow-sm" />
                                </div>
                                <input type="file" id="avatar-input" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleAvatarChange} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div>
                            <UniversalInput label="Nom / Denominació" type="text" value={localProfile.full_name || ''} onChange={e => setLocalProfile({ ...localProfile, full_name: e.target.value })} placeholder="Com et dius?" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">Presentació (Bio)</label>
                            <textarea value={localProfile.bio || ''} onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })} className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none h-24 text-sm' placeholder="Una breu descripció..." />
                        </div>
                    </div>
                </div>
                
                <div className="w-full">
                    <LanguageSelector variant="profile" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} className='text-orange-500' />
                        <h3 className="font-bold uppercase tracking-wider text-sm m-0 text-gray-900">Vinculació Territorial</h3>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 flex justify-between m-0">
                            Poble Principal
                            <span className='text-orange-500 font-bold'>CENSAT</span>
                        </p>
                        <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-all" onClick={() => openTownSelector('primary')}>
                            <span className="font-bold text-lg m-0">{localProfile.town_name || 'No especificat'}</span>
                            <span className='text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full uppercase font-black'>Canviar</span>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 m-0">
                            Pobles Secundaris / Vinculats (Max. 2)
                        </p>
                        <div className="space-y-2 mt-2">
                            {(localProfile.secondary_towns || []).map((tUUID, idx) => {
                                const townName = townNamesCache[tUUID] || `Poble ${idx + 2}`;
                                return (
                                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className='w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-black text-xs'>
                                                {idx + 2}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 m-0">{townName}</span>
                                        </div>
                                        <button onClick={() => {
                                            const newSec = [...localProfile.secondary_towns];
                                            newSec.splice(idx, 1);
                                            setLocalProfile(prev => ({ ...prev, secondary_towns: newSec }));
                                        }} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Desempatxar">
                                            <X size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                            {(localProfile.secondary_towns || []).length < 2 && (
                                <button onClick={() => openTownSelector('secondary')} className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all text-sm font-bold mt-2">
                                    <Plus size={18} />
                                    Vincular nou Poble
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className='space-y-4 pt-6 border-t border-gray-200'>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className='text-sm font-bold uppercase tracking-wider text-gray-900 mb-1 m-0'>Visibilitat del Perfil</h4>
                                <p className="text-xs text-gray-500 m-0">Si està ocult, no apareixeràs al Directori de Veïns, però podràs seguir publicant i escrivint. Els administradors sempre et podran vore.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                                <input type="checkbox" className="sr-only peer" checked={localProfile.iaia_settings?.is_public !== false} onChange={e => setLocalProfile(prev => ({
                                    ...prev,
                                    iaia_settings: {
                                        ...(prev.iaia_settings || {}),
                                        is_public: e.target.checked
                                    }
                                }))} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className='space-y-4 pt-6 border-t border-gray-200'>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert size={18} className="text-red-500" />
                        <h3 className="font-bold uppercase tracking-wider text-sm text-red-500 m-0">Zona de Perill</h3>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                        <p className="text-[11px] font-medium text-gray-600 mb-4 leading-relaxed m-0">
                            En virtut de la normativa de sobiranía digital (GDPR), pots eliminar el teu compte i totes les teues dades de forma completament permanent. <strong className="text-red-500">Aquesta acció NO es pot desfer ni recuperar.</strong>
                        </p>
                        {!showDeleteConfirm ? (
                            <Button variant="danger" fullWidth onClick={() => setShowDeleteConfirm(true)}>
                                Eliminar el meu compte
                            </Button>
                        ) : (
                            <div className="space-y-3 bg-white p-3 rounded-xl border border-red-200 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
                                <p className="text-sm font-black text-red-500 uppercase tracking-widest text-center mb-1 m-0">Doble Confirmació</p>
                                <div className="flex gap-2">
                                    <Button variant="danger" onClick={handleDeleteAccount} disabled={isDeletingAccount} fullWidth>
                                        SÍ, ESBORRAR
                                    </Button>
                                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isDeletingAccount} fullWidth>
                                        CANCEL·LAR
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isSuperAdmin && (
                    <>
                        <div className="h-px w-full bg-emerald-100 my-2"></div>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Beaker size={24} className="text-emerald-500" />
                                <h3 className="font-extrabold uppercase tracking-widest text-emerald-600 m-0">
                                    🧪 EL LLAVADOR (Laboratori)
                                </h3>
                            </div>
                            
                            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 relative overflow-hidden group">
                                <div className="flex items-start gap-3 mb-6">
                                    <ShieldAlert className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <p className="text-emerald-700 text-sm font-bold uppercase tracking-widest m-0">Controls del Rhizome</p>
                                        <p className="text-xs text-emerald-600/80 uppercase font-mono mt-1 m-0">Nivell de Seguretat: SUPER_ADMIN</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 relative z-10 w-full">
                                    <button onClick={e => { e.preventDefault(); onClose(); navigate('/admin'); }} className="w-full flex items-center justify-between gap-3 p-4 bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Terminal size={18} className="text-emerald-500" />
                                            <span className="text-sm text-emerald-900 font-bold uppercase tracking-wider m-0">Console: Administració Síncrona</span>
                                        </div>
                                        <span className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase font-black">
                                            ACTIU
                                        </span>
                                    </button>

                                    <button className="w-full flex items-center justify-between gap-3 p-4 bg-white border border-red-200 hover:border-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-80 hover:opacity-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert size={18} className="text-red-500" />
                                            <span className="text-sm text-red-700 font-bold uppercase tracking-wider m-0">Mode Forense (Logs)</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className='p-6 border-t border-gray-200 bg-white'>
                <Button intent="primary" size="large" fullWidth onClick={handleSave} isLoading={isSaving}>
                    Guardar Canvis
                </Button>
            </div>
        </div>

        <TownSelectorModal isOpen={townSelector.isOpen} onClose={() => setTownSelector({ isOpen: false, type: null })} onSelect={handleTownSelect} />
    </div>
  );
};

export default ProfileSettingsModal;