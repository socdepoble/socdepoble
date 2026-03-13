import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    Settings, Loader2, AlertCircle, 
    Sparkles, Grid, Share2, ArrowLeft, Camera, UserCheck, MessageCircle, MapPin,
    ShieldCheck, HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDesign } from '../context/DesignContext';
import { useModal } from '../context/ModalContext';
import { supabaseService, isValidUUID } from '../services/supabaseService';
import SEO from '../components/SEO';
import Feed from '../components/Feed';
import ShareHub from '../components/ShareHub';
import ProfileStudioModal from '../components/ProfileStudioModal';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import ContextualHeader from '../components/ContextualHeader';
import './ProfileView.css';

const ProfileView = () => {
    const { theme } = useDesign();
    const isDayMode = theme === 'light';
    
    // Theme Colors
    const bgColor = isDayMode ? 'bg-white' : 'bg-black';
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const textMuted = isDayMode ? 'text-black/60' : 'text-white/60';
    const cardBg = isDayMode ? 'bg-black/[0.03]' : 'bg-white/[0.03]';
    const cardBorder = isDayMode ? 'border-black/10' : 'border-white/10';

    const { id, username } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser, profile: myProfile } = useAuth();
    const { openConnectionModal } = useModal();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('mur');
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
    const [userPosts, setUserPosts] = useState([]);
    
    // Modals
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let targetProfile = null;
                
                if (isOwnProfile && myProfile) {
                    targetProfile = myProfile;
                } else if (username) {
                    targetProfile = await supabaseService.getUserByUsername(username);
                } else if (id) {
                    targetProfile = await supabaseService.getPublicProfile(id) || await supabaseService.getPublicEntity(id);
                }

                if (!targetProfile) {
                    if (isOwnProfile && currentUser) targetProfile = myProfile || currentUser;
                    else throw new Error('Perfil no trobat');
                }

                // Final sanity check for identity
                let effectiveName = targetProfile.full_name || targetProfile.username || targetProfile.email?.split('@')[0] || 'Veí del Poble';
                let effectiveUsername = targetProfile.username || targetProfile.email?.split('@')[0] || `node_${targetProfile.id?.substring(0,6) || 'bategant'}`;
                
                if (isOwnProfile && currentUser) {
                    effectiveName = targetProfile.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || (currentUser.phone ? 'El Teu Perfil' : 'Veí del Poble');
                    const phoneSuffix = currentUser.phone ? currentUser.phone.replace('+', '').slice(-4) : '';
                    effectiveUsername = targetProfile.username || currentUser.email?.split('@')[0] || (phoneSuffix ? `vei_${phoneSuffix}` : `node_${currentUser.id?.substring(0,6)}`);
                }

                const effectiveAvatar = targetProfile.avatar_url || '/default-avatar.png';

                const finalProfile = {
                    ...targetProfile,
                    full_name: effectiveName,
                    username: effectiveUsername,
                    avatar_url: effectiveAvatar
                };

                setProfile(finalProfile);

                if (isValidUUID(finalProfile.id) || finalProfile.id) {
                    // React 18 batches these state updates automatically
                    const [followers, following, posts, postsData] = await Promise.all([
                        supabaseService.getFollowers(finalProfile.id),
                        supabaseService.getFollowing(finalProfile.id),
                        supabaseService.getUserPostsCount(finalProfile.id),
                        supabaseService.getUserPosts(finalProfile.id)
                    ]);

                    setStats({
                        followers: followers?.length || 0,
                        following: following?.length || 0,
                        posts: posts || 0
                    });
                    
                    if (postsData && Array.isArray(postsData)) {
                        setUserPosts(postsData);
                    }

                    if (currentUser && finalProfile.id !== currentUser.id) {
                        const followingStatus = await supabaseService.isFollowing(currentUser.id, finalProfile.id);
                        setIsConnected(followingStatus);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id, username, isOwnProfile, currentUser, myProfile]);

    const isSuperAdmin = currentUser?.role === 'super_admin';

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
        <div className={`min-h-[100dvh] w-full ${bgColor} flex flex-col items-center ${textColor} font-sans overflow-x-hidden overflow-y-auto transition-colors duration-500 custom-scrollbar`}>
            <SEO title={profile?.full_name} description={profile?.bio} />
            
            {/* 1. IMMERSIVE COVER IMAGE WITH FADE TO BASE */}
            <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden shrink-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 origin-bottom" 
                    style={{ 
                        backgroundImage: `url('${profile?.cover_url || "/assets/patterns/hero_pattern.png"}')`,
                        transform: 'scale(1.02)',
                        filter: isDayMode ? 'brightness(1.1) saturate(1.2)' : 'brightness(0.8) saturate(1.2)'
                    }}
                />
                {/* Stunning bottom fade matching ambient background color perfectly */}
                <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t ${isDayMode ? 'from-white' : 'from-theme-base'} to-transparent z-10`} />
                <div className={`absolute inset-0 bg-gradient-to-b ${isDayMode ? 'from-white/10 via-white/40' : 'from-black/10 via-black/40'} to-transparent z-0`} />
                
                {/* Top TopBar */}
                <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
                    <button 
                        onClick={() => navigate(-1)} 
                        className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-2xl border transition-all shadow-xl hover:scale-110 active:scale-95 ${isDayMode ? 'bg-white/80 border-black/10 text-black hover:bg-white' : 'bg-black/60 border-white/10 text-white hover:bg-black/80'}`}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <ShareHub 
                            title={profile?.full_name}
                            text={profile?.bio}
                            url={location.pathname}
                            customTrigger={
                                <button className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-2xl border transition-all shadow-xl hover:scale-110 active:scale-95 ${isDayMode ? 'bg-white/80 border-black/10 text-black hover:bg-white' : 'bg-black/60 border-white/10 text-white hover:bg-black/80'}`}>
                                    <Share2 size={20} className="-ml-0.5" />
                                </button>
                            }
                        />
                        {isOwnProfile && (
                            <button 
                                onClick={() => setIsSettingsOpen(true)}
                                className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-2xl border transition-all shadow-xl hover:scale-110 active:scale-95 ${isDayMode ? 'bg-white/80 border-black/10 text-black hover:bg-white' : 'bg-black/60 border-white/10 text-white hover:bg-black/80'}`}
                            >
                                <Settings size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. PROFILE CONTENT (Overlapping Hero) */}
            <main className="w-full max-w-4xl px-4 md:px-8 relative z-30 -mt-24 sm:-mt-32 pb-40 flex flex-col items-center">
                
                {/* Hero Group */}
                <div className="flex flex-col items-center text-center mb-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out-expo">

                    {/* Glowing Avatar Sphere */}
                    <div
                        className={`relative rounded-full p-2 mb-6 group ${isOwnProfile ? 'cursor-pointer' : ''}`}
                        onClick={() => isOwnProfile && setIsStudioOpen(true)}
                    >
                        {/* Glow Behind */}
                        <div className={`absolute inset-0 rounded-full bg-[var(--theme-accent-primary)] ${isDayMode ? 'opacity-30 blur-2xl' : 'opacity-40 blur-[40px]'} group-hover:opacity-60 transition-opacity duration-700`}></div>

                        <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-[10px] ${isDayMode ? 'border-white' : 'border-theme-base'} shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-theme-panel`}>
                            <img
                                src={profile?.avatar_url}
                                alt={profile?.full_name}
                                className="w-full h-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-110"
                            />
                            {isOwnProfile && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm">
                                    <Camera size={36} className="text-white mb-2" />
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Fotografia</span>
                                </div>
                            )}
                        </div>

                        {/* VIP Node Badge */}
                        {(profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.is_master) && (
                            <div className={`absolute bottom-6 right-6 p-4 rounded-full bg-[var(--theme-accent-primary)] text-white shadow-[0_0_20px_var(--theme-accent-primary)] border-4 ${isDayMode ? 'border-white' : 'border-[#0a0a0a]'} animate-bounce-slow`}>
                                <Sparkles size={24} className="fill-white" />
                            </div>
                        )}
                    </div>

                    {/* Typography: Massive Full Name & Subtitle */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-4 text-theme-text drop-shadow-sm">
                        {profile?.full_name}
                    </h1>
                    <p className={`text-lg sm:text-xl font-bold uppercase tracking-[0.2em] text-[var(--theme-accent-primary)] mb-6`}>
                        @{profile?.username}
                    </p>

                    {/* Bio text */}
                    <p className={`text-xl sm:text-2xl leading-relaxed max-w-2xl text-[var(--text-muted)] font-medium mb-10`}>
                        {profile?.bio || 'Bategant al Rhizome. Connectant amb el territori.'}
                    </p>

                    {/* Metadata Tags (Town & Role) */}
                    <div className="flex flex-wrap justify-center gap-3 w-full">
                        {profile?.town_name && (
                            <div className={`flex items-center gap-2 px-6 py-4 rounded-full ${cardBg} border ${cardBorder} shadow-sm backdrop-blur-md hover:scale-105 transition-transform`}>
                                <MapPin size={20} className="text-[var(--theme-accent-primary)]" />
                                <span className={`text-xs font-black uppercase tracking-widest ${textMuted}`}>{profile.town_name}</span>
                            </div>
                        )}
                        <div className={`flex items-center gap-2 px-6 py-4 rounded-full ${cardBg} border ${cardBorder} shadow-sm backdrop-blur-md hover:scale-105 transition-transform`}>
                            <UserCheck size={20} className="text-[var(--theme-accent-primary)]" />
                            <span className={`text-xs font-black uppercase tracking-widest ${textMuted}`}>
                                {profile?.role === 'vei' ? 'SÓC DE POBLE' : (profile?.role?.replace('_', ' ') || 'NODE')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. PRIMARY FOCAL ACTION: THE CONNECTION BUTTON */}
                <div className="w-full max-w-3xl flex flex-col items-center justify-center mt-4 mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 ease-out-expo">
                    {!currentUser || currentUser.isAnonymous ? (
                        <button
                            onClick={() => navigate('/registre')}
                            className={`w-full max-w-md h-20 rounded-[36px] bg-[var(--theme-accent-primary)] text-white font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(255,107,0,0.5)] hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-4`}
                        >
                            CONNECTAR AMB EL NODE
                        </button>
                    ) : !isOwnProfile ? (
                        <div className="w-full flex justify-center w-full max-w-[500px] flex-col gap-6">
                            {/* Massive Connect Button */}
                            <button
                                onClick={() => openConnectionModal({ targetId: profile?.id })}
                                className={`w-full h-24 sm:h-28 rounded-[40px] overflow-hidden relative group shadow-[0_15px_40px_rgba(255,107,0,0.4)] hover:shadow-[0_20px_60px_rgba(255,107,0,0.6)] hover:-translate-y-2 active:scale-95 transition-all duration-500 ease-out`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-[var(--theme-accent-primary)] to-orange-700 opacity-100 group-hover:scale-110 transition-transform duration-1000 ease-out"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

                                <div className="absolute inset-0 flex items-center justify-center gap-4 text-white hover:text-white mix-blend-overlay drop-shadow-xl z-10 w-full h-full">
                                    {isConnected ? <MessageCircle size={40} strokeWidth={3} className="fill-white/20" /> : <HeartHandshake size={48} strokeWidth={2.5} className="fill-white/10" />}
                                    <span className="font-black text-2xl sm:text-[28px] uppercase tracking-widest mt-1">
                                        {isConnected ? 'MISSATGE DIRECTE' : 'BATEGAR CONNEXIÓ'}
                                    </span>
                                </div>
                            </button>

                            {/* Secondary Action placed nicely below */}
                            <button
                                className={`self-center inline-flex items-center gap-2 px-10 py-5 rounded-full ${cardBg} border ${cardBorder} font-black text-xs uppercase tracking-[0.2em] ${textMuted} hover:text-[var(--text-main)] hover:bg-[var(--theme-accent-primary)]/10 hover:border-[var(--theme-accent-primary)]/30 transition-all`}
                            >
                                <ShieldCheck size={20} />
                                CEDIR CONFIANÇA TOTAL
                            </button>
                        </div>
                    ) : (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsStudioOpen(true)}
                                className={`h-20 rounded-full ${isDayMode ? 'bg-[#111] text-white' : 'bg-white text-black'} font-black text-[15px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3`}
                            >
                                <Camera size={22} />
                                EDITAR APARIÈNCIA
                            </button>
                            {isSuperAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className={`h-20 px-8 rounded-full bg-emerald-950 text-emerald-400 font-black text-[15px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all border border-emerald-500/30 flex items-center justify-between gap-3`}
                                >
                                    <span className="text-sm font-black uppercase tracking-tight">RHIZOME SYNC ADMIN</span>
                                    <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">ACTIU</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. STATS BOARD (Premium Glassmorphism) */}
                <div className="w-full max-w-3xl relative mb-12 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 ease-out-expo">
                    {/* Glowing Aura underneath the stats panel */}
                    <div className={`absolute -inset-4 rounded-[60px] bg-[var(--theme-accent-primary)] opacity-10 blur-3xl z-0 pointer-events-none`}></div>

                    <div className={`relative z-10 grid grid-cols-3 p-6 md:p-8 rounded-[48px] ${cardBg} backdrop-blur-3xl border ${cardBorder} shadow-2xl overflow-hidden`}>
                        {/* Shimmer reflection inner */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex flex-col items-center justify-center text-center py-4 relative group cursor-default">
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500 ease-out-back text-theme-text">{stats.followers}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Connectats</span>
                        </div>
                        <div className={`flex flex-col items-center justify-center text-center py-4 border-x ${cardBorder} relative group cursor-default`}>
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter text-[var(--theme-accent-primary)] group-hover:scale-110 transition-transform duration-500 ease-out-back drop-shadow-sm">{stats.posts}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Publicacions</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center py-4 relative group cursor-default">
                            <span className="text-5xl md:text-6xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500 ease-out-back text-theme-text">{stats.following}</span>
                            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.25em] ${textMuted}`}>Malla</span>
                        </div>
                    </div>
                </div>

                {/* 5. TABS & CONTENT SYSTEM */}
                <div className="w-full max-w-4xl border-t border-[var(--border-master)] pt-12">
                    {/* Premium Oversized Tab Switcher */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('mur')}
                            className={`px-8 py-3 rounded-2xl font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase ${activeTab === 'mur' ? 'bg-[var(--theme-accent-primary)] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : 'bg-[var(--surface-master)] text-[var(--text-muted)] hover:bg-[var(--border-master)] hover:text-white'}`}
                        >
                            EL MEU MUR
                        </button>
                        <button
                            onClick={() => setActiveTab('connexions')}
                            className={`px-8 py-3 rounded-2xl font-black text-sm tracking-[0.2em] transition-all duration-500 uppercase ${activeTab === 'connexions' ? 'bg-[var(--theme-accent-primary)] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] scale-105' : 'bg-[var(--surface-master)] text-[var(--text-muted)] hover:bg-[var(--border-master)] hover:text-white'}`}
                        >
                            MALLA DE XARXA
                        </button>
                    </div>

                    <div className="min-h-[40vh] w-full max-w-3xl mx-auto pb-32">
                        {activeTab === 'mur' ? (
                            <div className="w-full flex flex-col gap-6">
                                <ContextualHeader
                                    searchTerm=""
                                    onSearchChange={() => {}}
                                    viewMode="single"
                                    onViewModeChange={() => {}}
                                    placeholder="Cerca publicacions..."
                                />
                                {userPosts.length > 0 ? (
                                    <Feed hideHeader={true} customPosts={userPosts} />
                                ) : (
                                    <StatusLoader type="empty" message={isOwnProfile ? "Encara no has compartit res." : "Cap novetat."} />
                                )}
                            </div>
                        ) : activeTab === 'connexions' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
                                <div className={`p-12 rounded-[56px] ${cardBg} border ${cardBorder} shadow-lg backdrop-blur-2xl relative overflow-hidden`}>
                                    {/* Subtly animated glow */}
                                    <div className="absolute -inset-10 bg-gradient-to-r from-[var(--theme-accent-primary)]/[0.05] via-transparent to-transparent opacity-50 animate-[shimmer_3s_infinite] pointer-events-none"></div>
                                    
                                    <h3 className="relative z-10 text-3xl font-black uppercase tracking-tight mb-4 flex items-center gap-6 text-[var(--theme-accent-primary)]">
                                        <div className="p-4 rounded-full bg-[var(--theme-accent-primary)]/10 border border-[var(--theme-accent-primary)]/20 shadow-inner">
                                            <UserCheck size={32} strokeWidth={2.5} />
                                        </div>
                                        Malla de Confiança
                                    </h3>
                                    <p className={`relative z-10 text-xl ${textMuted} font-medium leading-relaxed max-w-xl pl-20`}>Llista topològica de nodes connectats a aquesta identitat sobirana mitjançant el protocol Rhizome.</p>
                                </div>
                                {/* Placeholder visual per al futur feed de malla */}
                                <div className={`py-32 flex flex-col items-center justify-center text-center border-4 border-dashed ${cardBorder} rounded-[56px] bg-theme-panel/30`}>
                                    <Grid size={56} className={`mb-8 ${textMuted} opacity-20`} strokeWidth={1.5} />
                                    <p className={`text-base font-black uppercase tracking-[0.2em] ${textMuted}`}>Navegador de Malla (Desenvolupament actiu)</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>

            {/* Modals remain the exact same functionally */}
            <ProfileStudioModal 
                isOpen={isStudioOpen}
                onClose={() => setIsStudioOpen(false)}
                profile={profile}
                onFileSelect={() => {}}
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
