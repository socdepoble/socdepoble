import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Settings, Loader2, AlertCircle, 
    Sparkles, Grid, Share2, ArrowLeft, Camera, UserCheck, MessageCircle, MapPin,
    ShieldCheck, HeartHandshake, ArrowUp, Maximize,
    Linkedin, Facebook, Instagram, ShieldAlert, Image as ImageIcon, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { useModal, useModalDispatch } from '../context/ModalContext';
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
import GestoriaPanel from '../components/GestoriaPanel';
import UniversalCard from '../components/UniversalCard';
import { UniversalGridWrapper, UniversalGridRow } from '../components/UniversalGrid';
import EntityProfile from '../components/profile/EntityProfile';
import './ProfileView.css';

// Helper per generar username a partir d'un nom real (ex: "Nando Llinares" → "nandollinares")
const generateUsernameFromName = (name) => {
    if (!name || typeof name !== 'string') return null;
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // elimina accents
        .replace(/[^a-z0-9]/g, '');                       // només lletres i números
};

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
    const { openViewer } = useModal();

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
            navigate(`/perfil/${myProfile?.username || myProfile.id}`, { replace: true });
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
                                town_name: localAgent.town_name,
                                subtitle: localAgent.town_name,
                                lema: localAgent.lema,
                                bio: (localAgent.short_bio || `Especialitat local: ${localAgent.specialization || localAgent.tag}\n\n*Directiva Bategant*: \n${localAgent.systemPrompt}`),
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

                let effectiveName, effectiveUsername;

                if (isOwnProfile && currentUser) {
                    // ---------- PERFIL PROPI ----------
                    const metaName = currentUser.user_metadata?.full_name || targetProfile.full_name;
                    effectiveName = metaName || currentUser.email?.split('@')[0] || (currentUser.phone ? 'El Teu Perfil' : 'Veí del Poble');

                    // Prioritat: username existent -> nom real generat -> email -> telèfon -> node_UUID
                    const generatedFromName = metaName ? generateUsernameFromName(metaName) : null;
                    effectiveUsername = targetProfile.username 
                        || generatedFromName 
                        || currentUser.email?.split('@')[0] 
                        || (currentUser.phone ? `vei_${currentUser.phone.replace('+', '').slice(-4)}` : null)
                        || `node_${currentUser.id?.substring(0,6) || 'bategant'}`;
                } else {
                    // ---------- PERFIL D'ALTRES USUARIS ----------
                    effectiveName = targetProfile.full_name || targetProfile.username || targetProfile.email?.split('@')[0] || 'Veí del Poble';

                    const generatedFromName = targetProfile.full_name ? generateUsernameFromName(targetProfile.full_name) : null;
                    effectiveUsername = targetProfile.username 
                        || generatedFromName 
                        || targetProfile.email?.split('@')[0] 
                        || `node_${targetProfile.id?.substring(0,6) || 'bategant'}`;
                }

                // ---------- EXCEPCIÓ SOBIRANA: Javi Llinares (hardcoded) ----------
                if (
                    String(effectiveName).toLowerCase().includes('javi llinares') || 
                    targetProfile?.username === 'javillinares' || 
                    targetProfile?.id === '25218ea4-5d7d-4db4-bdc5-7ae035629242'
                ) {
                    effectiveUsername = 'JaviLlinares';
                    if (targetProfile) {
                        targetProfile.avatar_url = '/assets/avatars/javi_avatar.jpg';
                        targetProfile.cover_url = '/assets/javi_cover.jpg';
                        targetProfile.header_image_url = '/assets/javi_cover.jpg';
                    }
                }

                const effectiveAvatar = targetProfile.avatar_url || '/default-avatar.png';
                let effectiveCover = targetProfile.cover_url || targetProfile.header_image_url;
                
                // Si el cover es buit o és el patró per defecte, repetim la foto d'avatar per que soles en tens una!
                if (!effectiveCover || effectiveCover.includes('hero_pattern.png') || effectiveCover === '/default-avatar.png') {
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
            <div className={`${textMuted} mb-8 uppercase text-xs tracking-widest text-center max-w-md`}><p>{error}</p></div>
            <button className={`${isDayMode ? 'bg-black text-white' : 'bg-white text-black'} px-10 py-4 rounded-[28px] font-black uppercase tracking-widest hover:scale-105 transition-transform`} onClick={() => navigate('/mur')}>
                Tornar al Mur
            </button>
        </div>
    );

    const mappedEntity = profile ? {
        profile: {
            displayName: profile.nom_comerç || profile.full_name || profile.name || username,
            avatarUrl: profile.avatar_url,
            bannerUrl: profile.cover_url || profile.header_image_url || profile.portada_url,
            bio: profile.bio || profile.descripcio || '',
            roleTitle: profile.role ? profile.role.toUpperCase() : 'VEÍ',
            badges: profile.is_verified ? ['verified'] : []
        },
        state: {
            connectionsCount: agentsList?.length || 0,
            lastActive: profile.last_seen || Date.now()
        },
        traits: {
            location: {
                address: typeof profile.address === 'string' ? profile.address : 'Sóc de Poble'
            },
            skills: profile.skills || []
        },
        type: profile.role === 'business' ? 'empresa' : profile.role === 'official' ? 'institucio' : 'persona'
    } : null;

    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-hidden bg-theme-base">
            <SEO title={profile?.full_name} description={profile?.bio} />
            
            <div className="flex-1 overflow-x-hidden overflow-y-auto w-full relative z-10 p-0 m-0 custom-scrollbar" onScroll={handleScroll}>
                {mappedEntity && (
                    <EntityProfile 
                        entity={mappedEntity} 
                        isOwner={isOwnProfile} 
                        onSettingsClick={() => setIsSettingsOpen(true)}
                    />
                )}
            </div>

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
    );
};

export default ProfileView;
