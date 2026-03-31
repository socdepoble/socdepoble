import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Settings, Loader2, AlertCircle, 
    Sparkles, Grid, Share2, ArrowLeft, Camera, UserCheck, MessageCircle, MapPin,
    ShieldCheck, HeartHandshake, ArrowUp, Maximize,
    Linkedin, Facebook, Instagram
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { useModalDispatch } from '../context/ModalContext';
import { supabaseService, isValidUUID } from '../services/supabaseService';
import SEO from '../components/SEO';
import Feed from '../components/Feed';
import ShareHub from '../components/ShareHub';
import ProfileStudioModal from '../components/ProfileStudioModal';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import ContextualHeader from '../components/ContextualHeader';
import StatusLoader from '../components/StatusLoader'; // FIX: Evita el Crash en perfils sense publicacions
import LanguageSelector from '../components/LanguageSelector';
import { useViewMode } from '../hooks/useViewMode';
import ChatDetail from '../components/ChatDetail';
import './ProfileView.css';

const ProfileView = () => {
    const { theme } = useDesign();
    const isDayMode = theme === 'light';
    const [searchParams] = useSearchParams();
    const activeRoleFilter = searchParams.get('role') || 'tot';
    
    // Theme Colors - Reactive to isDayMode as requested
    const bgColor = isDayMode ? 'bg-[#FDF5E6]' : 'bg-[#0a0a0a] md:bg-[#111]';
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const textMuted = isDayMode ? 'text-black/60' : 'text-white/60';
    const cardBgColor = isDayMode ? 'bg-white' : 'bg-[#141414] border border-white/5';
    const borderColor = isDayMode ? 'border-orange-500/20' : 'border-white/10';

    const { id, username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, profile: myProfile } = useAuth();
    const { openConnectionModal } = useModalDispatch();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('mur');
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
    const [userPosts, setUserPosts] = useState([]);
    const [userEntities, setUserEntities] = useState([]);
    
    // Modals
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { viewMode, setViewMode } = useViewMode('feed_view_mode', 'grid');

    const scrollRef = React.useRef(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    
    // Studio Upload Logics
    const [isStudioUploading, setIsStudioUploading] = useState(false);
    const [studioUploadType, setStudioUploadType] = useState(null);

    const handleScroll = (e) => {
        if (!e.target) return;
        setShowTopBtn(e.target.scrollTop > 600);
    };

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fix for in-page navigation (e.g. Agent to Agent routing) not resetting scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, [id, username]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    
    // IAIA Mesh State
    const [agentsList, setAgentsList] = useState([]);

    useEffect(() => {
        // Load agents map once
        import('../config/agentsMap').then(({ AGENTS_MAP }) => {
            setAgentsList(Object.values(AGENTS_MAP));
        }).catch(err => console.error("Failed to load agents map", err));
    }, []);
    const [isRepositioning, setIsRepositioning] = useState(false);

    const isOwnProfile = React.useMemo(() => {
        return (!id && !username) || (currentUser && id === currentUser.id);
    }, [id, username, currentUser]);


    // Redirection effect separated from data fetching
    useEffect(() => {
        if (isOwnProfile && !id && myProfile?.id) {
            navigate(`/perfil/${myProfile.id}`, { replace: true });
        }
    }, [isOwnProfile, id, myProfile, navigate]);

    useEffect(() => {
        if (isOwnProfile && !id && myProfile?.id) return; // Block fetch if we are about to redirect

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
                    // Check if the UUID is one of our System Agents
                    if (id.startsWith('11111111-') || id.startsWith('SYSTEM_')) {
                        const { AGENTS_MAP } = await import('../config/agentsMap');
                        const localAgent = Object.values(AGENTS_MAP).find(agent => agent.id === id);
                        if (localAgent) {
                            targetProfile = {
                                id: localAgent.id,
                                full_name: localAgent.name,
                                username: localAgent.personaKey.toLowerCase(),
                                avatar_url: localAgent.avatar_url,
                                role: localAgent.role,
                                bio: `Especialitat local: ${localAgent.specialization || localAgent.tag}\n\n*Directiva Bategant*: \n${localAgent.systemPrompt}`,
                                tag: localAgent.tag,
                                is_entity: false,
                                header_image_url: localAgent.cover_url || localAgent.avatar_url,
                                cover_position_y: parseInt(localStorage.getItem('bot_cover_position_' + localAgent.id) || '20', 10)
                            };
                        }
                    }
                    
                    // Fallback to Supabase if not found locally
                    if (!targetProfile) {
                        targetProfile = await supabaseService.getPublicProfile(id) || await supabaseService.getPublicEntity(id);
                    }
                    
                    // Fallback to Towns if still not found
                    if (!targetProfile) {
                        const allTowns = await supabaseService.getTowns();
                        const isUuid = id.includes('-');
                        const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                        const cleanId = id.replace(/^gent-de-/, ''); // Removes the hardcoded gent-de from map
                        
                        const foundTown = allTowns.find(t => {
                            if (isUuid && isValidUUID(id)) return t.uuid === id || t.id === id || String(t.id) === id;
                            return sluggify(t.name) === sluggify(id) || sluggify(t.name).includes(sluggify(cleanId));
                        });

                        if (foundTown) {
                            let bio = foundTown.description || `Espai comunitari de la Gent de ${foundTown.name}.`;
                            try {
                                const { wikipediaService } = await import('../services/wikipediaService');
                                const wiki = await wikipediaService.getTownSummary(foundTown.name);
                                if (wiki && wiki.extract) {
                                    bio = wiki.extract.substring(0, 250) + '... (Font: Wikipedia)';
                                }
                            } catch(e) {
                                console.warn("Wiki fetch failed", e);
                            }

                            targetProfile = {
                                id: foundTown.uuid || foundTown.id || `town_${foundTown.id}`,
                                raw_town_id: foundTown.uuid || foundTown.id,
                                full_name: `Gent de ${foundTown.name.replace("La Torre de les Maçanes", "La Torre")}`,
                                username: sluggify(foundTown.name),
                                avatar_url: foundTown.image_url || '/default-avatar.png',
                                header_image_url: foundTown.image_url,
                                role: 'poble',
                                bio: bio,
                                town_name: foundTown.name,
                                is_entity: false,
                                is_town: true,
                                cover_position_y: 50
                            };
                        }
                    }
                }

                if (!targetProfile) {
                    if (id && !isValidUUID(id) && id !== 'undefined' && id !== 'null') {
                        const cleanName = id.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                            .replace(/Project Lead/ig, '')
                            .replace(/Project Mestre/ig, '')
                            .replace(/Iaia Maria/ig, 'IAIA MarIA')
                            .trim();
                            
                        targetProfile = {
                            id: `mock_${id}`,
                            raw_id: id,
                            full_name: cleanName,
                            username: id.toLowerCase().replace(/[^a-z0-9]/g, ''),
                            avatar_url: '/default-avatar.png',
                            header_image_url: '/assets/patterns/hero_pattern.png',
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

                // Final sanity check for identity
                let effectiveName = targetProfile.full_name || targetProfile.username || targetProfile.email?.split('@')[0] || 'Veí del Poble';
                let effectiveUsername = targetProfile.username || targetProfile.email?.split('@')[0] || `node_${targetProfile.id?.substring(0,6) || 'bategant'}`;
                
                if (isOwnProfile && currentUser) {
                    effectiveName = targetProfile.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || (currentUser.phone ? 'El Teu Perfil' : 'Veí del Poble');
                    const phoneSuffix = currentUser.phone ? currentUser.phone.replace('+', '').slice(-4) : '';
                    effectiveUsername = targetProfile.username || currentUser.email?.split('@')[0] || (phoneSuffix ? `vei_${phoneSuffix}` : `node_${currentUser.id?.substring(0,6)}`);
                }

                // Fix explícit d'identitat sobirana Javi Llinares
                if (effectiveName.includes('Javi Llinares') || targetProfile.id === '25218ea4-5d7d-4db4-bdc5-7ae035629242') {
                    effectiveUsername = 'JaviLlinares';
                }

                const effectiveAvatar = targetProfile.avatar_url || '/default-avatar.png';

                const finalProfile = {
                    ...targetProfile,
                    full_name: effectiveName,
                    username: effectiveUsername,
                    avatar_url: effectiveAvatar
                };

                if (controller.signal.aborted) return;
                setProfile(finalProfile);

                if (isValidUUID(finalProfile.id) || finalProfile.id) {
                    // React 18 batches these state updates automatically
                    const [followers, following, posts, postsData, entitiesData] = await Promise.all([
                        supabaseService.getFollowers(finalProfile.id),
                        supabaseService.getFollowing(finalProfile.id),
                        finalProfile.is_town ? Promise.resolve(0) : supabaseService.getUserPostsCount(finalProfile.id),
                        finalProfile.is_town ? Promise.resolve([]) : supabaseService.getUserPosts(finalProfile.id),
                        supabaseService.getUserEntities(finalProfile.id)
                    ]);

                    if (controller.signal.aborted) return;

                    setStats({
                        followers: followers?.length || 0,
                        following: following?.length || 0,
                        posts: posts || 0
                    });
                    
                    if (postsData && Array.isArray(postsData)) {
                        setUserPosts(postsData);
                    }
                    if (entitiesData && Array.isArray(entitiesData)) {
                        setUserEntities(entitiesData);
                    }

                    if (currentUser && finalProfile.id !== currentUser.id) {
                        const followingStatus = await supabaseService.isFollowing(currentUser.id, finalProfile.id);
                        setIsConnected(followingStatus);
                    }
                } else if (finalProfile.id.startsWith('mock_')) {
                    // Càrrega de publicacions globals de dades mock per als visitants
                    try {
                        const { MOCK_FEED, MOCK_TOWNS, MOCK_MARKET_ITEMS } = await import('../data.js');
                        const allMocks = [...(MOCK_FEED||[]), ...(MOCK_TOWNS||[]), ...(MOCK_MARKET_ITEMS||[])];
                        const cleanMatch = finalProfile.full_name.toLowerCase();
                        
                        const myMocks = allMocks.filter(p => 
                            (p.author_name && p.author_name.toLowerCase().includes(cleanMatch)) ||
                            (p.author && p.author.toLowerCase().includes(cleanMatch))
                        );
                        
                        if (myMocks.length > 0) {
                            setUserPosts(myMocks);
                            setStats(s => ({ ...s, posts: myMocks.length }));
                        }
                    } catch(e) {
                        console.warn('Silent fail loading mock posts for synthesized profile', e);
                    }
                }
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchProfileData();
        return () => controller.abort();
    }, [id, username, isOwnProfile, currentUser, myProfile]);

    // LÒGICA D'APUJADA VERTICAL "ESTUDI DE PERFIL"
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
                
                const { error: uploadError } = await supabaseService.supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (uploadError) throw new Error("Error pujant imatge.");
                const { data } = supabaseService.supabase.storage.from('avatars').getPublicUrl(filePath);
                updates[`${type}_url`] = data.publicUrl;
            }

            const { error: dbError } = await supabaseService.supabase
                .from('users')
                .update(updates)
                .eq('id', profile.id);

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

    const handleStudioReposition = async (value) => {
        const numValue = parseInt(value, 10);
        // Optimistic UI Update
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
             await supabaseService.supabase
                .from(profile?.is_entity ? 'entities' : 'users')
                .update({ cover_position_y: numValue })
                .eq('id', profile?.id);
        } catch (err) {
            console.error("Error setting reposition:", err);
        }
    };
    
    // Oberta per defecte a tot el món (demostrativa en guests)
    const canAdminHero = true;

    if (loading) return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor}`}>
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Cercant les dades al Mas...</span>
        </div>
    );

    if (error) return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor} p-6`}>
            <AlertCircle className="text-red-500 mb-6" size={64} />
            <h2 className="font-black text-2xl lg:text-3xl mb-4 text-center">EL RHIZOME NO TROBA AQUEST NODE</h2>
            <p className={`${textMuted} mb-8 uppercase text-xs tracking-widest text-center max-w-md`}>{error}</p>
            <button className={`${isDayMode ? 'bg-black text-white' : 'bg-white text-black'} px-10 py-4 rounded-[28px] font-black uppercase tracking-widest hover:scale-105 transition-transform`} onClick={() => navigate('/mur')}>
                Tornar al Mur
            </button>
        </div>
    );

    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-hidden">
            <SEO title={profile?.full_name} description={profile?.bio} />
            
            {/* Contextual Header Fixed Top */}
            <div className="flex-none w-full z-dropdown shadow-sm bg-theme-base">
                <ContextualHeader
                    searchTerm=""
                    onSearchChange={() => {}}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    placeholder="Cerca publicacions al perfil..."
                />
            </div>

            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className={`flex-1 profile-scroll-container w-full ${bgColor} flex flex-col items-center ${textColor} font-sans overflow-x-hidden overflow-y-auto transition-colors duration-500 custom-scrollbar relative pb-24`}
            >            {/* 1. IMMERSIVE COVER IMAGE WITH FADE TO BASE */}
            <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden shrink-0">
                <div 
                    className="absolute inset-0 bg-cover transition-all duration-1000 origin-bottom" 
                    style={{ 
                        backgroundImage: `url('${profile?.cover_url || profile?.header_image_url || profile?.avatar_url || "/assets/patterns/hero_pattern.png"}')`,
                        backgroundPosition: `50% ${profile?.cover_position_y ?? 50}%`,
                        transform: 'scale(1.02)'
                    }}
                />
                {/* Stunning bottom fade matching ambient background color perfectly */}
                <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[${bgColor.match(/bg-\[([^\]]+)\]/)?.[1] || '#111'}] to-transparent z-10`} />
                {/* Top TopBar */}
                <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        {canAdminHero && !isRepositioning && (
                            <button 
                                onClick={() => setIsRepositioning(true)}
                                className="w-12 h-12 rounded-full bg-[#F97316]/80 backdrop-blur-md flex items-center justify-center text-white border border-[#F97316]/50 hover:bg-[#F97316] shadow-xl transition-all hover:scale-110 active:scale-95"
                                title="Ajustar Enquadrament de Portada"
                            >
                                <Maximize size={20} />
                            </button>
                        )}
                        <ShareHub 
                            title={profile?.full_name}
                            text={profile?.bio}
                            url={window.location.href}
                            customTrigger={
                                <button className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95">
                                    <Share2 size={20} className="-ml-0.5" />
                                </button>
                            }
                        />
                        {/* {isOwnProfile && (
                            <button 
                                onClick={() => setIsSettingsOpen(true)}
                                className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-95"
                            >
                                <Settings size={20} />
                            </button>
                        )} */}
                    </div>
                </div>

                {isRepositioning && (
                    <div className="absolute inset-x-0 bottom-12 z-50 flex justify-center animate-in fade-in zoom-in duration-300">
                        <div className="bg-black/80 backdrop-blur-xl px-6 py-4 rounded-[28px] border border-white/20 flex flex-col items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
                            <span className="text-[10px] font-black tracking-[0.25em] text-[#F97316] uppercase">Enquadrament Càmera</span>
                            <div className="flex items-center gap-3">
                                <span className="text-white/50 text-xs font-bold uppercase">Cap</span>
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={profile?.cover_position_y ?? 50} 
                                    onChange={(e) => handleStudioReposition(e.target.value)}
                                    className="w-48 h-2 rounded-xl accent-[#F97316]"
                                />
                                <span className="text-white/50 text-xs font-bold uppercase">Peus</span>
                            </div>
                            <button 
                                onClick={() => setIsRepositioning(false)} 
                                className="mt-2 text-xs text-white bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 uppercase font-black tracking-widest transition-colors"
                            >
                                Guardar {(!isOwnProfile && !(isSuperAdmin && profile?.role !== 'user')) && "(Visitant)"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. PROFILE CONTENT (Asymmetrical Hero Layout) */}
            <main className="w-full max-w-4xl px-4 md:px-8 relative z-30 -mt-20 sm:-mt-28 pb-40">
                
                {/* Hero Group - Avatar Left, Actions Right */}
                <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out-expo">
                    
                    {/* Top Row: Avatar & Actions */}
                    <div className="flex justify-between items-end mb-6 w-full px-2">
                        {/* LEFT: Glowing Avatar Sphere */}
                        <div
                            className={`relative rounded-full p-1 group ${isOwnProfile ? 'cursor-pointer' : ''}`}
                            onClick={() => isOwnProfile && setIsStudioOpen(true)}
                        >
                            {/* Glow Behind */}
                            <div className={`absolute inset-0 rounded-full bg-[#0ea5e9] opacity-40 blur-[20px] group-hover:opacity-70 transition-opacity duration-700`}></div>

                            <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-[50%] overflow-hidden border-[4px] border-[#0ea5e9]/50 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-[var(--sdp-blue)] isolate aspect-square flex items-center justify-center`}>
                                <img
                                    src={profile?.avatar_url}
                                    alt={profile?.full_name}
                                    className="w-full h-full object-cover rounded-[50%] transition-transform duration-1000 ease-out-expo group-hover:scale-110 aspect-square block"
                                    style={{ borderRadius: '50%' }}
                                />
                                {isOwnProfile && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm rounded-[50%]">
                                        <Camera size={32} className="text-white mb-2" />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Imatge</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* VIP Node Badge */}
                            {(profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.is_master) && (
                                <div className={`absolute bottom-1 right-1 p-2 sm:p-3 rounded-full bg-[var(--theme-accent-primary)] text-white shadow-[0_0_15px_var(--theme-accent-primary)] border-[3px] ${isDayMode ? 'border-white' : 'border-[#0a0a0a]'} animate-bounce-slow`}>
                                    <Sparkles size={16} className="fill-white" />
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Action Buttons Stack */}
                        <div className="flex flex-col items-end gap-2 mb-2 sm:mb-4">
                            {/* Top row actions */}
                            <div className="flex items-center gap-2 sm:gap-3">
                            {/* Settings / Gear Button (Visible to admins or owners) */}
                            {(isOwnProfile || isSuperAdmin) && (
                                <button 
                                    onClick={() => isOwnProfile ? setIsSettingsOpen(true) : setIsStudioOpen(true)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl ${isDayMode ? 'bg-black/5 border-black/10 text-black hover:bg-black/10' : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-[var(--theme-accent-primary)]'} shadow-xl hover:scale-110 active:scale-95 transition-all`}
                                    title={isOwnProfile ? 'Configuració del Perfil' : 'Administrar Engranatge'}
                                >
                                    <Settings size={22} className={isOwnProfile ? '' : 'animate-spin-slow text-[var(--theme-accent-primary)]'} />
                                </button>
                            )}

                            {/* Connect Button */}
                            {!isOwnProfile && (
                                <div className="flex">
                                    {!currentUser || currentUser.isAnonymous ? (
                                        <button
                                            onClick={() => navigate('/registre')}
                                            className="h-12 px-6 sm:px-8 bg-[#F97316] text-white rounded-full flex items-center justify-center gap-2 font-black text-[11px] sm:text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <HeartHandshake size={20} />
                                            <span className="hidden sm:inline">CONNECTAR</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openConnectionModal({ targetId: profile?.id })}
                                            className="h-12 px-6 sm:px-8 bg-[#F97316] text-white rounded-full flex items-center justify-center gap-2 font-black text-[11px] sm:text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:bg-[#ff8533] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {isConnected ? <MessageCircle size={20} /> : <HeartHandshake size={20} />}
                                            <span className="hidden sm:inline">{isConnected ? 'MISSATGE' : 'CONNECTAR'}</span>
                                        </button>
                                    )}
                                </div>
                            )}
                            </div>
                            
                            {/* Secondary Action: Direct Chat Open */}
                            {!isOwnProfile && (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="h-10 px-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <MessageCircle size={14} className="opacity-80" />
                                    OBRIR XAT
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Metadata Row: Left Aligned */}
                    <div className="flex flex-col items-start text-left mb-10 w-full px-2 sm:px-4">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] ${textColor} drop-shadow-sm`}>
                                {profile?.full_name}
                            </h1>
                            {profile?.role === 'vei' && (
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDayMode ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20' : 'bg-white/10 text-[#F97316] border border-white/5'}`}>
                                    Sóc de Poble
                                </div>
                            )}
                        </div>
                        
                        <div 
                            onClick={() => !isOwnProfile ? setIsChatOpen(true) : null}
                            className={`flex block items-center gap-1 text-base sm:text-lg font-bold uppercase tracking-[0.2em] text-[var(--theme-accent-primary)] mb-6 opacity-90 ${!isOwnProfile ? 'cursor-pointer hover:opacity-100 hover:text-white transition-colors' : ''}`}
                            title="Obrir Xat Privat"
                        >
                            <span className="text-[var(--theme-accent-primary)] opacity-50">@</span>
                            {profile?.username}
                        </div>

                        <p className={`text-[1.1rem] sm:text-[1.15rem] leading-[1.6] max-w-2xl ${textMuted} font-medium mb-8`}>
                            {profile?.bio || 'Connectant amb el territori a través d\'Antigravity.'}
                        </p>

                        {/* Metadata Tags (Town & Role) */}
                        <div className="flex flex-wrap justify-start gap-3 w-full">
                            {profile?.town_name && (
                                <div className={`flex items-center gap-2 px-5 py-3 rounded-full ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md`}>
                                    <MapPin size={18} className="text-[var(--theme-accent-primary)]" />
                                    <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${textMuted}`}>{profile.town_name}</span>
                                </div>
                            )}
                            <div className={`flex items-center gap-2 px-5 py-3 rounded-full ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md`}>
                                <UserCheck size={18} className="text-[var(--theme-accent-primary)]" />
                                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${textMuted}`}>
                                    {profile?.role === 'vei' ? 'SÓC DE POBLE' : (profile?.role?.replace('_', ' ') || 'NODE')}
                                </span>
                            </div>
                        </div>

                        {/* SOCIAL MEDIA LINKS */}
                        <div className="flex flex-wrap gap-3 mt-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                            {/* LinkedIn */}
                            {(profile?.social_linkedin || profile?.username === 'JaviLlinares') && (
                                <a 
                                    href={profile?.social_linkedin || (profile?.username === 'JaviLlinares' ? 'https://www.linkedin.com/in/javi-llinares/' : '#')} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md hover:scale-105 transition-transform hover:border-[var(--theme-accent-primary)] group`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Linkedin size={18} className="text-[#0e76a8] group-hover:scale-110 transition-transform" />
                                    <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${textMuted} group-hover:text-black dark:group-hover:text-white transition-colors`}>LinkedIn</span>
                                </a>
                            )}
                            
                            {/* Facebook */}
                            {profile?.social_facebook && (
                                <a 
                                    href={profile.social_facebook} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md hover:scale-105 transition-transform hover:border-[var(--theme-accent-primary)] group`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Facebook size={18} className="text-[#1877F2] group-hover:scale-110 transition-transform" />
                                    <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${textMuted} group-hover:text-black dark:group-hover:text-white transition-colors`}>Facebook</span>
                                </a>
                            )}
                            
                            {/* Instagram */}
                            {profile?.social_instagram && (
                                <a 
                                    href={profile.social_instagram} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${cardBgColor} border ${borderColor} shadow-sm backdrop-blur-md hover:scale-105 transition-transform hover:border-[var(--theme-accent-primary)] group`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Instagram size={18} className="text-[var(--theme-accent-primary)] group-hover:scale-110 transition-transform" />
                                    <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${textMuted} group-hover:text-black dark:group-hover:text-white transition-colors`}>Instagram</span>
                                </a>
                            )}
                        </div>
                        
                        {/* LANGUAGE SELECTOR FOR PROFILE OWNER (MOBILE ACCESSIBILITY) */}
                        {isOwnProfile && (
                            <div className="w-full mt-2 animate-in fade-in slide-in-from-top-4 duration-500 ease-out z-dropdown relative">
                                <LanguageSelector variant="profile" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 4.5. PÀGINES I ENTITATS DEL NODE (Javi's creations) */}
                {userEntities && userEntities.length > 0 && (
                    <div className="w-full max-w-3xl relative mb-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 ease-out-expo z-80">
                        <h3 className={`text-sm font-black uppercase tracking-widest ${textMuted} mb-4 ml-6 sm:ml-8`}>
                            {isOwnProfile ? 'Pàgines Administrades' : 'Entitats Gestades'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-4">
                            {userEntities.map(entity => (
                                <div 
                                    key={entity.id} 
                                    onClick={() => navigate(`/entitat/${entity.id}`)}
                                    className={`flex items-center gap-4 p-4 rounded-3xl ${cardBgColor} border ${borderColor} shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95 transition-all w-full`}
                                >
                                    {entity.avatar_url ? (
                                        <img 
                                            src={entity.avatar_url} 
                                            alt={entity.name || entity.full_name} 
                                            className="w-14 h-14 rounded-full object-cover bg-black/5 flex-shrink-0 border border-white/5 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F97316]/20 text-[#F97316] flex-shrink-0 border border-[#F97316]/30">
                                            <Share2 size={24} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-lg leading-tight truncate text-theme-text">{entity.name || entity.full_name}</h4>
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--theme-accent-primary)] mt-1 drop-shadow-sm">{entity.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* 4. STATS BOARD (Premium Glassmorphism) */}
                <div className="w-full max-w-3xl relative mb-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 ease-out-expo">
                    {/* Glowing Aura underneath the stats panel */}
                    <div className={`absolute -inset-4 rounded-[60px] bg-[var(--theme-accent-primary)] opacity-10 blur-3xl z-0 pointer-events-none`}></div>

                    <div className={`relative z-10 grid grid-cols-3 p-6 md:p-8 rounded-[48px] ${cardBgColor} backdrop-blur-3xl border ${borderColor} shadow-2xl overflow-hidden`}>
                        {/* Shimmer reflection inner */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex flex-col items-center justify-center text-center py-4 relative group cursor-default">
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500 ease-out-back text-theme-text">{stats.followers}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Connectats</span>
                        </div>
                        <div className={`flex flex-col items-center justify-center text-center py-4 border-x ${borderColor} relative group cursor-default`}>
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter text-[var(--theme-accent-primary)] group-hover:scale-110 transition-transform duration-500 ease-out-back drop-shadow-sm">{stats.posts}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Publicacions</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center py-4 relative group cursor-default">
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500 ease-out-back text-theme-text">{stats.following}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Contactes</span>
                        </div>
                    </div>
                </div>

                {/* 5. TABS & CONTENT SYSTEM */}
                <div className={`w-full pt-12 relative min-h-[50vh] ${viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-4xl'} mx-auto transition-all duration-500`}>
                    {/* Premium Oversized Tab Switcher (STICKY & GLASSMORPHISM) */}
                    <div className="sticky top-[60px] md:top-[80px] z-90 flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 py-4 px-2 rounded-[28px] backdrop-blur-3xl bg-white/10 border border-white/5 shadow-2xl mx-auto w-[calc(100%-1rem)] sm:w-max">
                        <button
                            onClick={() => setActiveTab('mur')}
                            className={`px-6 sm:px-8 py-3 rounded-[28px] font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase backdrop-blur-md ${activeTab === 'mur' ? 'bg-[#F97316] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : `bg-transparent ${isDayMode ? 'text-black/40 hover:bg-black/5 hover:text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}`}
                        >
                            EL MEU MUR
                        </button>
                        <button 
                            onClick={() => setActiveTab('network')} 
                            className={`px-6 sm:px-8 py-3 rounded-[28px] font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase backdrop-blur-md ${activeTab === 'network' ? 'bg-[#F97316] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : `bg-transparent ${isDayMode ? 'text-black/40 hover:bg-black/5 hover:text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}`}
                        >
                            CONTACTES
                        </button>
                        {/* THE THIRD TAB PROPOSED BY NOTEBOOK LM: BOTIGA (Only visible if business/entity) */}
                        {(profile?.role === 'freelance' || profile?.role === 'business' || profile?.role === 'company' || profile?.role === 'official') && (
                            <button
                                onClick={() => setActiveTab('botiga')}
                                className={`px-6 sm:px-8 py-3 rounded-[28px] font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase backdrop-blur-md ${activeTab === 'botiga' ? 'bg-[#F97316] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : `bg-transparent ${isDayMode ? 'text-black/40 hover:bg-black/5 hover:text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}`}
                            >
                                MERCAT LOCAL
                            </button>
                        )}
                    </div>

                    <div className={`min-h-[40vh] w-full mx-auto pb-32 transition-all duration-500 ${viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-3xl'}`}>
                        {activeTab === 'mur' ? (
                            <div className="w-full flex flex-col gap-6">
                                {(()=>{
                                    // React computation inner block for extreme performance
                                    const processedPosts = (() => {
                                        const deduped = [];
                                        const seen = new Set();
                                        for (const p of userPosts) {
                                            const key = (p.title || p.content || '').substring(0, 100).trim();
                                            if (key && seen.has(key)) continue;
                                            if (key) seen.add(key);
                                            deduped.push(p);
                                        }

                                        if (activeRoleFilter === 'tot') return deduped;
                                        
                                        return deduped.filter(post => {
                                            const r = post.author_role || 'user';
                                            const type = post.type;
                                            switch (activeRoleFilter) {
                                                case 'personal': return r === 'user';
                                                case 'autonom': return r === 'freelance' || r === 'student' || r === 'business';
                                                case 'empresa': return r === 'company' || type === 'mercat' || r === 'business';
                                                case 'grup': return r === 'group' || r === 'ambassador';
                                                case 'entitat': return r === 'official' || type === 'ajuntament';
                                                default: return true;
                                            }
                                        });
                                    })();

                                    if (profile?.is_town) {
                                        return <Feed hideHeader={true} townId={profile.raw_town_id} externalViewMode={viewMode} />;
                                    }

                                    return processedPosts.length > 0 ? (
                                        <Feed hideHeader={true} customPosts={processedPosts} externalViewMode={viewMode} />
                                    ) : (
                                        <StatusLoader type="empty" message={isOwnProfile ? "Encara no has compartit res amb esta identitat." : "Cap novetat sota este rol."} />
                                    );
                                })()}
                            </div>
                        ) : activeTab === 'network' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
                                <div className={`p-12 rounded-[56px] ${cardBgColor} border ${borderColor} shadow-lg backdrop-blur-2xl relative overflow-hidden`}>
                                    {/* Subtly animated glow */}
                                    <div className="absolute -inset-10 bg-gradient-to-r from-[var(--theme-accent-primary)]/[0.05] via-transparent to-transparent opacity-50 animate-[shimmer_3s_infinite] pointer-events-none"></div>
                                    
                                    <div className="relative z-10 flex items-center">
                                        <div className="p-4 rounded-full bg-[var(--theme-accent-primary)]/10 border border-[var(--theme-accent-primary)]/20 shadow-inner">
                                            <UserCheck size={32} strokeWidth={2.5} className="text-[var(--theme-accent-primary)]" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className={`text-base font-black uppercase tracking-widest ${textColor} mb-1 flex items-center gap-2`}>
                                                <HeartHandshake className="text-[#0ea5e9]" size={18} />
                                                Xarxa de Confiança
                                            </h3>
                                            <p className={`text-xs ${textMuted} leading-relaxed font-medium`}>
                                                Llista de nodes i contactes verificats amb aquest perfil al llarg del xat.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                
                                {(()=>{
                                    const MOCK_FRIENDS = [
                                        { id: "afa145cd-2df7-4977-bc67-ab1e4c278fb9", name: "Marc (El Gall)", role: "vei", bio: "Hortolà 2.0. Si el gall canta clar, aigua al bancal.", avatar_url: "/assets/avatars/comic/avatar_marc_comic.png" },
                                        { id: "11111111-0000-0000-0000-000000000109", name: "Elena Popova", role: "vei", bio: "Nouvinguda feliç. Tinc un hortet xicotet prop del riu i vull aprendre.", avatar_url: "/assets/avatars/comic/elena_popova_comic.png" },
                                        { id: "11111111-0000-0000-0000-000000000110", name: "Rafa \"El Fuster\"", role: "vei", bio: "Fuster de mans dures i cor gran. Restauro al poble.", avatar_url: "/images/demo/avatar_man_old.png" },
                                        { id: "11111111-0000-0000-0000-000000000111", name: "Teresa \"La de les Flors\"", role: "vei", bio: "Guardiana dels jardins del poble.", avatar_url: "/images/demo/avatar_woman_old.png" },
                                        { id: "11111111-0000-0000-0000-000000000112", name: "Ximo Carbonell", role: "vei", bio: "Emprenedor rural. Innovació al respecte de la terra.", avatar_url: "/images/demo/avatar_man_1.png" },
                                        { id: "11111111-0000-0000-0000-000000000113", name: "Beatriz Ortega", role: "vei", bio: "Guia turística. Històries que amaguen les pedres.", avatar_url: "/images/demo/avatar_woman_1.png" },
                                        { id: "11111111-0000-0000-0000-000000000114", name: "Salva Jordà", role: "vei", bio: "Expert en herbes medicinals i remeis tradicionals.", avatar_url: "/images/demo/avatar_man_old.png" },
                                        { id: "fa82eb62-4a83-4ff7-b2d6-8849673fc3b0", name: "Damià Llorens", role: "perit", bio: "Fundador. La connexió de tota la xarxa.", avatar_url: "/assets/avatars/comic/damia_agutzil_comic.png"}
                                    ];

                                    if (profile?.id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || isOwnProfile) {
                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {MOCK_FRIENDS.map((agent) => (
                                                    <div 
                                                        key={agent.id}
                                                        onClick={() => navigate(`/perfil/${agent.id}`)}
                                                        className={`flex items-center gap-4 p-4 rounded-3xl ${cardBgColor} border ${borderColor} shadow-md backdrop-blur-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group`}
                                                    >
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-black isolate">
                                                            <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover rounded-full" />
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <h4 className={`text-sm font-black uppercase tracking-widest ${textColor} mb-1 truncate`}>{agent.name}</h4>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9]`}>{agent.role}</p>
                                                            <p className={`text-xs ${textMuted} mt-1 line-clamp-1`}>{agent.bio}</p>
                                                        </div>
                                                        <div className="p-3 rounded-full bg-white/5 text-white/40 group-hover:bg-[#0ea5e9]/20 group-hover:text-[#0ea5e9] transition-colors">
                                                            <MessageCircle size={18} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else if (agentsList.some(a => a.id === profile?.id)) {
                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {agentsList.filter(a => a.id !== profile?.id).map((agent) => (
                                                    <div 
                                                        key={agent.id}
                                                        onClick={() => navigate(`/perfil/${agent.id}`)}
                                                        className={`flex items-center gap-4 p-4 rounded-3xl ${cardBgColor} border ${borderColor} shadow-md backdrop-blur-md cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group`}
                                                    >
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-black isolate">
                                                            <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover rounded-full" />
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <h4 className={`text-sm font-black uppercase tracking-widest ${textColor} mb-1 truncate`}>{agent.name}</h4>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9]`}>{agent.role}</p>
                                                            <p className={`text-xs ${textMuted} mt-1 line-clamp-1`}>{agent.specialization}</p>
                                                        </div>
                                                        <div className="p-3 rounded-full bg-white/5 text-white/40 group-hover:bg-[#0ea5e9]/20 group-hover:text-[#0ea5e9] transition-colors">
                                                            <MessageCircle size={18} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className={`py-32 flex flex-col items-center justify-center text-center border-4 border-dashed ${borderColor} rounded-[56px] bg-theme-panel/30`}>
                                                <Grid size={32} className={`${textMuted} mb-4`} />
                                                <p className={`text-base font-black uppercase tracking-[0.2em] ${textMuted}`}>Directori de Contactes (Privat)</p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        ) : activeTab === 'botiga' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
                                <div className={`py-32 flex flex-col items-center justify-center text-center border-4 border-dashed border-white/10 rounded-[28px] bg-white/5 backdrop-blur-md`}>
                                    <h3 className="text-2xl font-black uppercase text-[var(--theme-accent-primary)] mb-4 tracking-widest">Aparador Comercial</h3>
                                    <p className={`${textMuted} font-medium max-w-sm`}>Aquest node encara no ha pujat productes al mercat local.</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>

            {isChatOpen && (
                <ChatDetail
                    isOverlay={true}
                    overlayChatId={null} 
                    overlayContact={profile} 
                    onClose={() => setIsChatOpen(false)}
                    themeColor="#FF6B00"
                />
            )}


            {/* FLOATING ACTION BUTTON (BACK TO TOP) */}
            {showTopBtn && (
                <button 
                    onClick={scrollToTop} 
                    className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-[var(--theme-accent-primary)] hover:bg-[var(--theme-accent-primary-hover)] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,107,0,0.5)] transition-all animate-in fade-in zoom-in z-overlay"
                    title="Torna a dalt ràpidament"
                >
                    <ArrowUp size={24} strokeWidth={3} />
                </button>
            )}
            <ProfileStudioModal 
                isOpen={isStudioOpen}
                onClose={() => setIsStudioOpen(false)}
                profile={profile}
                isUploading={isStudioUploading}
                uploadType={studioUploadType}
                onFileSelect={handleStudioFileSelect}
                onReposition={handleStudioReposition}
                onCaptureComplete={(media, type) => {
                    // Mutejem 'media' com si fos un e.target.files intern per reutilitzar la funció
                    handleStudioFileSelect({ target: { files: [media] } }, type);
                }}
            />
            {isOwnProfile && profile && (
                <ProfileSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    profile={profile}
                    onProfileUpdate={(updates) => setProfile(prev => ({ ...prev, ...updates }))}
                />
            )}
        </div>
        </div>
    );
};

export default ProfileView;
