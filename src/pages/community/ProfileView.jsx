import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { supabaseService, isValidUUID } from '../../core/services/supabaseService';
import { Loader2, AlertCircle, ArrowUp } from 'lucide-react';
import SEO from '../../components/core/SEO';
import EntityProfile from '../../components/profile/EntityProfile';
import ChatDetail from '../../components/features/ChatDetail';
import ProfileStudioModal from '../../components/modals/ProfileStudioModal';
import ProfileSettingsModal from '../../components/modals/ProfileSettingsModal';
import { useTownProposals } from '../../hooks/useTownProposals';
import './ProfileView.css';

const generateUsernameFromName = name => {
  if (!name || typeof name !== 'string') return null;
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, ''); 
};

const ProfileView = () => {
  const { id, username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, profile: myProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { winningProposal } = useTownProposals(profile?.is_town ? profile?.raw_town_id : null);
  
  const displayProfile = React.useMemo(() => {
    if (!profile) return null;
    if (profile.is_town && winningProposal) {
      return {
        ...profile,
        header_image_url: winningProposal.image_url || profile.header_image_url,
        lema: winningProposal.lema || profile.lema,
        bio: winningProposal.description || profile.bio
      };
    }
    return profile;
  }, [profile, winningProposal]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollRef = React.useRef(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isStudioUploading, setIsStudioUploading] = useState(false);
  const [studioUploadType, setStudioUploadType] = useState(null);

  const handleScroll = e => {
    if (!e.target) return;
    setShowTopBtn(e.target.scrollTop > 600);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [id, username]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [agentsList, setAgentsList] = useState([]);

  useEffect(() => {
    import('../../app/config/agentsMap').then(({ AGENTS_MAP }) => {
      setAgentsList(Object.values(AGENTS_MAP));
    }).catch(err => console.error("Failed to load agents map", err));
  }, []);

  const isOwnProfile = React.useMemo(() => {
    return !id && !username || currentUser && id === currentUser.id;
  }, [id, username, currentUser]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const normalizedId = id ? id.toLowerCase() : '';
    const isSocDePoble = normalizedId === 'socdepoble' || normalizedId === 'soc-de-poble' || normalizedId === 'soc-de-poble_official';
    if (isSocDePoble && currentPath !== '/empresa/socdepoble') {
      navigate('/empresa/socdepoble', { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isOwnProfile && !id && myProfile?.id) {
      navigate(`/gent/${myProfile?.username || myProfile.id}`, { replace: true });
    }
  }, [isOwnProfile, id, myProfile, navigate]);

  useEffect(() => {
    if (isOwnProfile && !id && myProfile?.id) return; 

    const controller = new AbortController();
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        let targetProfile = null;
        if (isOwnProfile && myProfile) {
          targetProfile = myProfile;
        } else if (username) {
          targetProfile = await supabaseService.getUserByUsername(username);
        } else if (id) {
          if (id.startsWith('11111111-') || id.startsWith('SYSTEM_')) {
            const { AGENTS_MAP } = await import('../../app/config/agentsMap');
            const localAgent = Object.values(AGENTS_MAP).find(agent => agent.id === id);
            if (localAgent) {
              targetProfile = {
                id: localAgent.id,
                full_name: localAgent.name,
                username: localAgent.personaKey.toLowerCase(),
                avatar_url: localAgent.avatar_url,
                role: localAgent.role,
                town_name: localAgent.town_name,
                subtitle: localAgent.town_name,
                lema: localAgent.lema,
                bio: localAgent.short_bio || `Especialitat local: ${localAgent.specialization || localAgent.tag}\n\n*Directiva Bategant*: \n${localAgent.systemPrompt}`,
                tag: localAgent.tag,
                is_entity: false,
                header_image_url: localAgent.cover_url || localAgent.avatar_url,
                cover_position_y: parseInt(localStorage.getItem('bot_cover_position_' + localAgent.id) || '20', 10)
              };
            }
          }

          if (!targetProfile) {
            targetProfile = (await supabaseService.getPublicProfile(id)) || (await supabaseService.getPublicEntity(id));
          }

          if (!targetProfile) {
            const allTowns = await supabaseService.getTowns();
            const isUuid = id.includes('-');
            const sluggify = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const cleanId = id.replace(/^gent-de-/, ''); 

            const foundTown = allTowns.find(t => {
              if (isUuid && isValidUUID(id)) return t.uuid === id || t.id === id || String(t.id) === id;
              const sluggify = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
              const cleanTownName = t.name.replace("La Torre de les Maçanes", "La Torre");
              const townHandle = sluggify(cleanTownName);
              return sluggify(t.name) === sluggify(id) || sluggify(t.name).includes(sluggify(cleanId)) || townHandle === id.toLowerCase();
            });
            if (foundTown) {
              let bio = foundTown.description || `Espai comunitari de la Gent de ${foundTown.name}.`;
              const townHandle = sluggify(foundTown.name.replace("La Torre de les Maçanes", "La Torre"));
              const localImageUrl = `/assets/uploads/poble/${townHandle}/cover.jpg`;

              const extractedAvatar = foundTown.avatar_url && foundTown.avatar_url !== 'EMPTY' ? foundTown.avatar_url : localImageUrl;
              let extractedCover = foundTown.image_url || foundTown.cover_url || extractedAvatar;
              let wikiImage = extractedCover;
              let shieldImage = foundTown.escudo_url || '/assets/system/ui/logo-socdepoble-rect.svg';
              let ajuntamentHeaderImage = wikiImage;
              try {
                const WIKI_SUMMARIES = await import('../../data/wikipedia_summaries.json');
                const wikiSummary = WIKI_SUMMARIES.default[townHandle];
                if (wikiSummary) {
                  bio = wikiSummary;
                }
              } catch (e) {
                console.warn("Local summary fetch failed", e);
              }
              const cleanTownName = foundTown.name.replace("La Torre de les Maçanes", "La Torre");
              const startsWithVowel = ['a', 'e', 'i', 'o', 'u', 'h'].includes(foundTown.name.charAt(0).toLowerCase());
              const gentdeHandle = `gentd${startsWithVowel ? '' : 'e'}${cleanTownName}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
              const ajuntamentUsername = `ajuntamentd${startsWithVowel ? '' : 'e'}${cleanTownName}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
              const isAjuntamentPath = window.location.pathname.startsWith('/ajuntament');

              if (foundTown.name.includes("La Torre")) {
                if (isAjuntamentPath) {
                  ajuntamentHeaderImage = "/assets/uploads/poble/la-torre-de-les-macanes/toponim-la-torre-de-les-macanes-2048px.jpg";
                  shieldImage = "https://upload.wikimedia.org/wikipedia/commons/c/c5/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg";
                } else {
                  extractedCover = "/assets/uploads/poble/la-torre-de-les-macanes/DSC01197.JPG";
                }
              }
              if (isAjuntamentPath) {
                targetProfile = {
                  id: foundTown.id ? `ajuntament_${foundTown.id}` : `ajuntament_${gentdeHandle}`,
                  raw_town_id: foundTown.id,
                  full_name: `Ajuntament de ${foundTown.name}`,
                  username: ajuntamentUsername,
                  avatar_url: shieldImage,
                  header_image_url: ajuntamentHeaderImage || '/uploads/avatars/nano-banana-comic.png',
                  role: 'ajuntament',
                  bio: `Aquesta és una pàgina de prova per a ajuntaments. L'escut i les imatges s'han utilitzat exclusivament amb finalitats de demostració tècnica. Aquesta pàgina no té cap valor legal i romandrà inactiva fins que siga reclamada i administrada per un usuari autoritzat de l'Ajuntament.`,
                  town_name: foundTown.name || foundTown.title,
                  is_entity: true,
                  is_town: false,
                  cover_position_y: 50
                };
              } else {
                targetProfile = {
                  id: foundTown.id || `town_${foundTown.id}`,
                  raw_town_id: foundTown.id,
                  full_name: `Gent de ${cleanTownName}`,
                  username: gentdeHandle,
                  avatar_url: extractedAvatar || '/uploads/avatars/nano-banana-comic.png',
                  header_image_url: extractedCover || '/uploads/avatars/nano-banana-comic.png',
                  role: 'poble',
                  bio: bio,
                  town_name: foundTown.name || foundTown.title,
                  is_entity: false,
                  is_town: true,
                  cover_position_y: 50
                };
              }
            }
          }
        }
        if (!targetProfile && (id === 'socdepoble' || id === 'soc-de-poble' || id === 'soc-de-poble_official')) {
          targetProfile = {
            id: `socdepoble`,
            raw_id: id,
            full_name: "Sóc de Poble",
            username: "soc-de-poble",
            avatar_url: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
            header_image_url: '/assets/brand/antigravity-badge.png',
            role: 'empresa',
            bio: "L'arquitectura federada i sobirana per als pobles. Més que una aplicació, és una declaració d'independència digital.",
            is_entity: true,
            cover_position_y: 50
          };
        }
        if (!targetProfile) {
          if (id && !isValidUUID(id) && id !== 'undefined' && id !== 'null') {
            let cleanName = id.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(/Project Lead/ig, '').replace(/Project Mestre/ig, '').replace(/Iaia Maria/ig, 'IAIA MarIA').trim();
            targetProfile = {
              id: `mock_${id}`,
              raw_id: id,
              full_name: cleanName,
              username: id.toLowerCase().replace(/[^a-z0-9]/g, ''),
              avatar_url: '/uploads/avatars/nano-banana-comic.png',
              header_image_url: '/assets/brand/antigravity-badge.png',
              role: 'vei',
              bio: `Espai comunitari i publicacions de ${cleanName}. Connectant amb el territori a través d'Antigravity.`,
              is_entity: false,
              cover_position_y: 50
            };
          } else if (isOwnProfile && currentUser) {
            targetProfile = myProfile || currentUser;
          } else {
            throw new Error('Perfil no trobat');
          }
        }
        let effectiveName, effectiveUsername;
        if (isOwnProfile && currentUser) {
          const metaName = currentUser.user_metadata?.full_name || targetProfile.full_name;
          effectiveName = metaName || currentUser.email?.split('@')[0] || (currentUser.phone ? 'El Teu Perfil' : 'Veí del Poble');
          const generatedFromName = metaName ? generateUsernameFromName(metaName) : null;
          effectiveUsername = targetProfile.username || generatedFromName || currentUser.email?.split('@')[0] || (currentUser.phone ? `vei_${currentUser.phone.replace('+', '').slice(-4)}` : null) || `node_${currentUser.id?.substring(0, 6) || 'bategant'}`;
        } else {
          effectiveName = targetProfile.full_name || targetProfile.username || targetProfile.email?.split('@')[0] || 'Veí del Poble';
          const generatedFromName = targetProfile.full_name ? generateUsernameFromName(targetProfile.full_name) : null;
          effectiveUsername = targetProfile.username || generatedFromName || targetProfile.email?.split('@')[0] || `node_${targetProfile.id?.substring(0, 6) || 'bategant'}`;
        }
        const effectiveAvatar = targetProfile.avatar_url || '/uploads/avatars/nano-banana-comic.png';
        let effectiveCover = targetProfile.cover_url || targetProfile.header_image_url;

        if (!effectiveCover || effectiveCover.includes('hero_pattern.png') || effectiveCover === '/uploads/avatars/nano-banana-comic.png') {
          effectiveCover = effectiveAvatar;
        }
        const finalProfile = {
          ...targetProfile,
          full_name: effectiveName,
          username: effectiveUsername,
          avatar_url: effectiveAvatar,
          cover_url: effectiveCover,
          header_image_url: effectiveCover
        };
        if (controller.signal.aborted) return;
        setProfile(finalProfile);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchProfileData();
    return () => controller.abort();
  }, [id, username, isOwnProfile, currentUser, myProfile]);

  const handleStudioFileSelect = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file && !e.target.value) return;
    setIsStudioUploading(true);
    setStudioUploadType(type);
    try {
      let updates = {};
      if (e.target.value && typeof e.target.value === 'string' && e.target.value.startsWith('icon:')) {
        updates[`${type}_url`] = e.target.value;
      } else {
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        const { error: uploadError } = await supabaseService.supabase.storage.from('avatars').upload(filePath, file);
        if (uploadError) throw new Error("Error pujant imatge.");
        const { data } = supabaseService.supabase.storage.from('avatars').getPublicUrl(filePath);
        updates[`${type}_url`] = data.publicUrl;
      }
      const { error: dbError } = await supabaseService.supabase.from('users').update(updates).eq('id', profile.id);
      if (dbError) throw dbError;
      setProfile(p => ({ ...p, ...updates }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsStudioUploading(false);
      setStudioUploadType(null);
    }
  };

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.email === 'javi@sollutia.com';
  
  const handleStudioReposition = async value => {
    const numValue = parseInt(value, 10);
    setProfile(p => ({ ...p, cover_position_y: numValue }));
    if (!isOwnProfile && !(isSuperAdmin && profile?.role !== 'user')) {
      sessionStorage.setItem('guest_cover_position_' + profile?.id, numValue);
      return;
    }
    if (profile?.id.startsWith('11111111-') || profile?.id.startsWith('SYSTEM_')) {
      localStorage.setItem('bot_cover_position_' + profile?.id, numValue);
      return;
    }
    try {
      await supabaseService.supabase.from(profile?.is_entity ? 'entities' : 'users').update({
        cover_position_y: numValue
      }).eq('id', profile?.id);
    } catch (err) {
      console.error("Error setting reposition:", err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <span className="font-black uppercase tracking-[0.3em] text-xs">Cercant les dades al Mas...</span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
        <AlertCircle className="text-red-500 mb-6" size={64} />
        <h2 className="font-black text-2xl lg:text-3xl mb-4 text-center">EL RHIZOME NO TROBA AQUEST NODE</h2>
        <div className="text-gray-500 mb-8 uppercase text-xs tracking-widest text-center max-w-md"><p>{error}</p></div>
        <button className="bg-gray-900 text-white px-10 py-4 rounded-[28px] font-black uppercase tracking-widest hover:scale-105 transition-transform" onClick={() => navigate('/mur')}>
            Tornar al Mur
        </button>
    </div>
  );

  const mappedEntity = displayProfile ? {
    profile: {
      displayName: displayProfile.nom_comerç || displayProfile.full_name || displayProfile.name || username,
      avatarUrl: displayProfile.avatar_url,
      bannerUrl: displayProfile.cover_url || displayProfile.header_image_url || displayProfile.portada_url,
      bio: displayProfile.bio || displayProfile.descripcio || '',
      role: displayProfile.role,
      roleTitle: displayProfile.role ? displayProfile.role.toUpperCase() : 'VEÍ',
      badges: displayProfile.is_verified ? ['verified'] : [],
      handle: displayProfile.username ? `@${displayProfile.username}` : '@identitat_p2p'
    },
    state: {
      connectionsCount: agentsList?.length || 0,
      lastActive: displayProfile.last_seen || Date.now()
    },
    traits: {
      location: {
        address: typeof displayProfile.address === 'string' ? displayProfile.address : 'Sóc de Poble'
      },
      skills: displayProfile.skills || []
    },
    type: displayProfile.role === 'business' ? 'empresa' : displayProfile.role === 'official' ? 'institucio' : 'persona',
    id: displayProfile.id,
    raw_town_id: displayProfile.raw_town_id,
    is_town: displayProfile.is_town,
    town_name: displayProfile.town_name,
    is_real: displayProfile.is_real,
    contact_email: displayProfile.contact_email,
    contact_phone: displayProfile.contact_phone,
    contact_country_code: displayProfile.contact_country_code
  } : null;

  return (
    <div className="flex flex-col w-full h-screen bg-white overflow-hidden">
        <SEO title={mappedEntity?.profile?.displayName || profile?.full_name} description={mappedEntity?.profile?.bio || profile?.bio} image={mappedEntity?.profile?.bannerUrl || mappedEntity?.profile?.avatarUrl} type="profile" />
        
        <div ref={scrollRef} className="flex-1 w-full relative z-10 p-0 m-0 overflow-y-auto" onScroll={handleScroll}>
            {mappedEntity && <EntityProfile entity={mappedEntity} isOwner={isOwnProfile} onSettingsClick={() => setIsSettingsOpen(true)} />}
        </div>

        {isChatOpen && <ChatDetail isOverlay={true} overlayChatId={null} overlayContact={profile} onClose={() => setIsChatOpen(false)} themeColor="#FF6B00" />}

        {showTopBtn && (
          <button onClick={scrollToTop} className='fixed bottom-24 right-6 md:bottom-10 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md transition-all animate-in fade-in zoom-in z-overlay' title="Torna a dalt ràpidament">
              <ArrowUp size={24} strokeWidth={3} />
          </button>
        )}
        
        <ProfileStudioModal isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} profile={profile} isUploading={isStudioUploading} uploadType={studioUploadType} onFileSelect={handleStudioFileSelect} onReposition={handleStudioReposition} onCaptureComplete={(media, type) => {
            handleStudioFileSelect({ target: { files: [media] } }, type);
        }} />
        
        {isOwnProfile && profile && (
          <ProfileSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} profile={profile} onProfileUpdate={updates => setProfile(prev => ({ ...prev, ...updates }))} />
        )}
    </div>
  );
};
export default ProfileView;