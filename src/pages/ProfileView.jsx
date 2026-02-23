import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    User, Settings, ChevronRight, Loader2, AlertCircle, 
    Sparkles, Zap, Grid, Heart, Share2, ArrowLeft, Camera, UserCheck, UserPlus, MoreHorizontal, MessageCircle, Tag, ShieldCheck, Beaker, Edit, Trash2, Plus, FileText, MapPin, Landmark, Image as ImageIcon, ScanLine, Ruler, Globe, Link as LinkIcon, Users, Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { supabaseService, isValidUUID } from '../services/supabaseService';
import SEO from '../components/SEO';
import Feed from '../components/Feed';
import Avatar from '../components/Avatar';
import ShareHub from '../components/ShareHub';
import ProfileStudioModal from '../components/ProfileStudioModal';
import { ROLES, USER_ROLES, ENTITY_TYPES } from '../constants';
import { trustService } from '../services/trustService';
import RhizomeMonitor from '../components/RhizomeMonitor';
import './ProfileView.css';

const ProfileView = () => {
    const { id, username } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser, profile: myProfile } = useAuth();
    const { openConnectionModal } = useUI();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('mur');
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    const [oficiPosts, setOficiPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    const isOwnProfile = !id && !username || (currentUser && id === currentUser.id);

    // [MASTER IDENTITY CHECK] - Use AuthContext's derived state but with fallsbacks
    const isMaster = (isOwnProfile && myProfile?.is_master) || 
                     profile?.full_name?.toLowerCase().includes('llinares') || 
                     profile?.email?.toLowerCase().includes('javillinares') ||
                     profile?.id === 'd6325f44-7277-4d20-b020-166c010995ab';

    let displayName = isMaster ? 'Javi Llinares' : (profile?.full_name || (isOwnProfile ? (myProfile?.full_name || currentUser?.email?.split('@')[0]) : 'Sóc de Poble'));
    
    // Nuclear Purge: If displayName contains "Foraster", it's a ghost.
    if (displayName.toLowerCase().includes('foraster')) displayName = 'Sóc de Poble';
    
    const displayAvatar = isMaster ? '/Javi_Llinares-Foto_perfil-1.jpg' : (profile?.avatar_url || null);
    
    const isAutonomous = profile?.type === 'autonomo' || profile?.role === 'autonomo';
    const isCompany = profile?.type === ENTITY_TYPES.BUSINESS || profile?.role === 'business' || id === 'sdp-oficial-1' || id === 'el-rentonar';

    const handleUpdateIdentity = async (value, type) => {
        if (!isOwnProfile) return;
        
        try {
            const updates = {};
            if (type === 'icon') updates.avatar_url = value;
            
            const { error: updateError } = await supabaseService.updateProfile(currentUser.id, updates);
            if (updateError) throw updateError;
            
            setProfile(prev => ({ ...prev, ...updates }));
            
        } catch (err) {
            console.error('[ProfileView] Error updating profile:', err);
        }
    };
    
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let targetProfile = null;
                
                // 1. Resolve Target Profile
                if (isOwnProfile && myProfile) {
                    targetProfile = myProfile;
                } else if (username) {
                    targetProfile = await supabaseService.getUserByUsername(username);
                } else if (id === 'iaia' || location.pathname === '/iaia') {
                    targetProfile = {
                        id: '11111111-1a1a-0000-0000-000000000000',
                        full_name: "MarIA (L'IAIA del Poble)",
                        username: "iaia",
                        bio: "Arquitecte digital i memòria del poble. Bategant per un futur sobirà i rural.",
                        avatar_url: "/iaia_digital_matriarch.png",
                        cover_url: "/rural_tech_future_valencia.png",
                        town_name: "La Torre de les Maçanes",
                        role: 'iaia'
                    };
                } else if (id) {
                    // Try by UUID or slug
                    targetProfile = await supabaseService.getPublicProfile(id) || await supabaseService.getPublicEntity(id);
                }

                if (!targetProfile) {
                    // Fallback for Master if not found by service but we know it's own profile
                    if (isOwnProfile && currentUser) targetProfile = myProfile || currentUser;
                    else throw new Error('Perfil no trobat');
                }
                setProfile(targetProfile);

                // 2. Resolve Stats & Curriculum
                if (isValidUUID(targetProfile.id) || targetProfile.id) {
                    const [followers, following, posts, postsData, imported] = await Promise.all([
                        supabaseService.getFollowers(targetProfile.id),
                        supabaseService.getFollowing(targetProfile.id),
                        supabaseService.getUserPostsCount(targetProfile.id),
                        supabaseService.getUserPosts(targetProfile.id),
                        supabaseService.getImportedPosts(targetProfile.id)
                    ]);

                    setStats({
                        followers: followers?.length || 0,
                        following: following?.length || 0,
                        posts: (posts || 0) + (imported.data?.length || 0)
                    });
                    
                    if (postsData && Array.isArray(postsData)) {
                        setUserPosts(postsData);
                    }
                    
                    if (imported.data) {
                        setOficiPosts(imported.data);
                        // If we have imported posts, default to 'ofici' tab for the Master
                        if (isMaster && imported.data.length > 0) {
                            setActiveTab('ofici');
                        }
                    }

                    if (currentUser && targetProfile.id !== currentUser.id) {
                        const followingStatus = await supabaseService.isFollowing(currentUser.id, targetProfile.id);
                        setIsConnected(followingStatus);
                    }
                } else {
                    // Lore fallback stats
                    setStats({ followers: 1200, following: 45, posts: 8 });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        // [MASTER REDIRECT] Si entrem a /perfil sense ID, forcem la redirecció al nostre ID per a evitar "fantasmes" o IAIA antiga
        if (isOwnProfile && !id && myProfile?.id) {
            navigate(`/perfil/${myProfile.id}`, { replace: true });
            return;
        }

        fetchProfileData();
    }, [id, username, isOwnProfile, currentUser, myProfile, location.pathname, navigate, isMaster]);

    const [reputation, setReputation] = useState({ level: 'desconegut', direct: false });

    // Trust/DID Logic
    const handleTrustVote = async () => {
        if (!profile?.id) return;
        const success = await trustService.emitTrustVote(profile.id, 1.0);
        if (success) {
            const rep = await trustService.getProximityReputation(profile.id);
            setReputation(rep);
        }
    };

    useEffect(() => {
        if (profile?.id) {
            trustService.getProximityReputation(profile.id).then(setReputation);
        }
    }, [profile?.id]);

    if (loading) return (
        <div className="profile-hub-loading flex flex-col items-center justify-center h-screen bg-black">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Bategant en el Mas...</span>
        </div>
    );

    if (error) return (
        <div className="profile-hub-error flex flex-col items-center justify-center h-screen bg-black p-6">
            <AlertCircle className="text-red-500 mb-4" size={64} />
            <h2 className="text-white font-black text-xl mb-4">ERROR EN LA MATRIU</h2>
            <p className="text-gray-500 mb-8 uppercase text-[10px] tracking-widest">{error}</p>
            <button className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest" onClick={() => navigate('/mur')}>Cerrar</button>
        </div>
    );

    return (
        <div className="profile-hub-container bg-black min-h-screen text-white font-sans overflow-x-hidden">
            <SEO title={displayName} description={profile?.bio} />
            
            <header className="relative w-full h-[40vh] min-h-[300px] border-b border-white/5">
                <div className="cover-wrapper w-full h-full overflow-hidden">
                    <img 
                        src={profile?.cover_url || "/rural_tech_future_valencia.png"} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60 scale-105" 
                    />
                    <div className="cover-gradient absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                
                <div className="header-actions absolute top-6 left-6 right-6 flex justify-between z-10">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <ShareHub 
                            title={displayName}
                            text={profile?.bio}
                            url={window.location.pathname}
                            customTrigger={
                                <button className="p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all">
                                    <Share2 size={24} />
                                </button>
                            }
                        />
                        <button className="p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all"><Settings size={24} /></button>
                    </div>
                </div>

                <div className="avatar-central-wrapper absolute -bottom-24 left-1/2 -translateX-1/2 flex flex-col items-center">
                    <div className="avatar-frame relative w-48 h-48 rounded-full p-1.5 bg-gradient-to-b from-[#F97316] to-transparent overflow-hidden group shadow-[0_0_60px_rgba(249,115,22,0.3)]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                            <Avatar 
                                src={displayAvatar} 
                                name={displayName} 
                                role={isMaster ? 'super_admin' : profile?.role} 
                                size={184} 
                                className="master-profile-avatar"
                            />
                            {isOwnProfile && (
                                <div 
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer z-20"
                                    onClick={() => setIsStudioOpen(true)}
                                >
                                    <Camera size={28} className="mb-2 text-[#F97316]" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Canviar Imatge</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <section className="identity-block mt-32 px-6 text-center">
                <div className="badges-wrapper flex justify-center gap-2 mb-6">
                    {profile?.town_name && (
                        <span className="px-4 py-1.5 bg-white/5 text-gray-500 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/10">
                            {profile.town_name}
                        </span>
                    )}
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all hover:brightness-110 ${isMaster ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : (isCompany ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : (isAutonomous ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'))}`}>
                        {isMaster ? 'MESTRE BATEGANT' : (id === 'el-rentonar' ? 'ASSOCIACIÓ VERIFICADA' : (isCompany ? 'EMPRESA VERIFICADA' : (isAutonomous ? 'PÀGINA D\'AUTÒNOM' : (profile?.role === 'vei' || profile?.role === 'neighbor' ? 'SÓC DE POBLE' : (profile?.role?.toUpperCase() || 'SÓC DE POBLE')))))}
                    </span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6 italic">
                    {displayName}
                </h1>
                
                <p className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed px-12 opacity-80 font-medium italic mb-10">
                    {profile?.bio || (isMaster ? "Arquitecte de la Matriu Sóc de Poble. Dissenyant el futur de la connexió rural." : "Connectant el poble amb el futur a través del Rhizome digital.")}
                </p>

                <div className="actions-row py-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                    {!currentUser || currentUser.isAnonymous ? (
                        <div className="flex flex-col gap-4 w-full max-w-[400px] bg-white/5 p-8 rounded-[28px] border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Aquest perfil encara no bategua?</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest leading-relaxed">Registra't per a connectar amb {displayName} i formar part de la sobirania digital del poble.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/registre')}
                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#E11D48] text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Zap size={20} className="group-hover:animate-pulse" />
                                <span>BATEGA ARA I REGISTRA'T</span>
                            </button>
                        </div>
                    ) : !isOwnProfile ? (
                        <div className="flex flex-col gap-4 w-full max-w-[320px]">
                            <button 
                                onClick={() => openConnectionModal({ targetId: profile?.id })}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#E11D48] text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                {isConnected ? <MessageCircle size={18} /> : <UserPlus size={18} />}
                                <span>{isConnected ? 'ENVIAR MISSATGE' : 'CONNECTAR'}</span>
                            </button>
                            
                            <button 
                                onClick={handleTrustVote}
                                className={`w-full h-14 rounded-2xl border-2 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${reputation.direct ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-white hover:border-indigo-500/50'}`}
                            >
                                <ShieldCheck size={18} className={reputation.direct ? 'text-indigo-400' : 'text-gray-500'} />
                                <span>{reputation.direct ? 'VEÍ DE CONFIANÇA' : 'DONAR CONFIANÇA'}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 w-full max-w-[320px]">
                            <button 
                                onClick={() => setIsStudioOpen(true)}
                                className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3"
                            >
                                <Sparkles size={18} className="text-[#F97316]" />
                                <span>GESTIÓ D'IDENTITAT</span>
                            </button>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => navigate('/hub')}
                                    className="h-20 rounded-3xl bg-[#0ea5e9]/20 border-2 border-[#0ea5e9]/50 text-[#0ea5e9] text-sm font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 hover:bg-[#0ea5e9]/30 transition-all col-span-2 shadow-[0_0_20px_rgba(14,165,233,0.2)] active:scale-95 px-4 text-center group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Cpu size={24} className="group-hover:rotate-12 transition-transform" />
                                        <span>Sistema Operatiu Rural</span>
                                    </div>
                                    <span className="text-[8px] opacity-60">Explora totes les funcionalitats</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/entitats')}
                                    className="h-16 rounded-2xl bg-indigo-600/40 border-2 border-indigo-400/50 text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-4 hover:bg-indigo-600/60 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95 leading-tight px-4 text-center"
                                >
                                    <Landmark size={24} className="text-indigo-300 shrink-0" />
                                    <span>Pàgina d'Empresa / Autònom</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/entitats')}
                                    className="h-16 rounded-2xl bg-indigo-600/40 border-2 border-indigo-400/50 text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-4 hover:bg-indigo-600/60 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95 leading-tight px-4 text-center"
                                >
                                    <Users size={24} className="text-indigo-300 shrink-0" />
                                    <span>Crear Grup o Associació</span>
                                </button>
                            </div>

                            {/* RHIZOME MONITOR (DEEP TECH) */}
                            <RhizomeMonitor />
                        </div>
                    )}
                </div>

                <ProfileStudioModal 
                    isOpen={isStudioOpen}
                    onClose={() => setIsStudioOpen(false)}
                    profile={profile}
                    onFileSelect={(e, type) => handleUpdateIdentity(e.target.value, type)}
                />

                <div className="stats-pill-row flex justify-center gap-8 py-10 bg-white/5 mx-auto max-w-2xl rounded-[32px] border border-white/5 mt-16 backdrop-blur-xl">
                    <div className="stat-item flex flex-1 flex-col items-center">
                        <span className="text-3xl font-black leading-none">{stats.followers}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">Seguidors</span>
                    </div>
                    <div className="stat-item flex flex-1 flex-col items-center border-x border-white/5 px-4">
                        <span className="text-3xl font-black leading-none">{stats.following}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-3">Seguint</span>
                    </div>
                    <div className="stat-item flex flex-1 flex-col items-center">
                        <span className="text-3xl font-black leading-none">{stats.posts}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">Publicacions</span>
                    </div>
                </div>
            </section>

            <nav className="tabs-nav sticky top-16 z-20 bg-black/80 backdrop-blur-xl border-y border-white/5 mt-12">
                <div className="flex justify-center max-w-xl mx-auto">
                    <button 
                        onClick={() => setActiveTab('mur')}
                        className={`btn-profile-tab flex-1 py-4 text-[12px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'mur' ? 'active text-white' : 'text-gray-500'}`}
                    >
                        <Grid size={16} /> MUR
                    </button>
                    
                    {oficiPosts.length > 0 && (
                        <button 
                            onClick={() => setActiveTab('ofici')}
                            className={`btn-profile-tab flex-1 py-4 text-[12px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'ofici' ? 'active text-orange-500' : 'text-gray-500'}`}
                        >
                            <Sparkles size={16} /> OFICI
                        </button>
                    )}

                    <button 
                        onClick={() => setActiveTab('connexions')}
                        className={`btn-profile-tab flex-1 py-4 text-[12px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'connexions' ? 'active text-white' : 'text-gray-500'}`}
                    >
                        <UserCheck size={16} /> CONNEXIONS
                    </button>
                    {(profile.id === '11111111-1a1a-0000-0000-000000000000' || profile.role === 'iaia' || profile.username === 'iaia') && (
                        <button 
                            onClick={() => setActiveTab('ajudes')}
                            className={`btn-profile-tab flex-1 py-4 text-[12px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'ajudes' ? 'active text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
                        >
                            <Sparkles size={16} /> AJUDES
                        </button>
                    )}
                </div>
            </nav>

            <main className="content-area p-4 min-h-[50vh]">
                {activeTab === 'mur' ? (
                    <Feed hideHeader={true} customPosts={userPosts} />
                ) : activeTab === 'connexions' ? (
                    <div className="connexions-feed-wrapper">
                        <div className="connexions-header mb-8 px-6">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <UserPlus size={20} className="text-indigo-500" />
                                Vincle Comunitari
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Connexions bategades al teu Rhizome privat.</p>
                        </div>
                        <Feed customPosts={[]} contentMode="batec" />
                    </div>
                ) : activeTab === 'ajudes' ? (
                    <div className="subsidies-section space-y-6">
                        <div className="section-intro p-6 bg-white/5 rounded-[28px] border border-white/10">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-2">
                                <Sparkles className="text-orange-500" size={20} />
                                Ajudes Detectades pel Rhizome
                            </h3>
                            <p className="text-gray-400 text-sm italic">
                                "Mestre, he trobat aquestes oportunitats bategant a la xarxa oficial. No les deixis escapar!"
                            </p>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {[
                                { id: 'kit-digital-2024', title: "Kit Digital: Segment III (Autònoms)", amount: "3.000 €", sector: "Digitalització" },
                                { id: 'ajuda-resiliencia-rural', title: "Projecte Rhizome: Resiliència Tecnològica Rural", amount: "25.000 € (Estudi)", sector: "Tecnologia" }
                            ].map(sub => (
                                <div key={sub.id} className="sub-card-iaia p-6 bg-white/5 rounded-[28px] border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer group" onClick={() => navigate('/ajudes')}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest">{sub.sector}</span>
                                        <ChevronRight size={18} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                    <h4 className="text-lg font-black uppercase leading-[1.1] mb-2">{sub.title}</h4>
                                    <div className="text-2xl font-black text-white italic">{sub.amount}</div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => navigate('/ajudes')}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-full text-xs hover:scale-[1.02] transition-transform"
                        >
                            Veure Buscador d'Ajudes Complet
                        </button>
                    </div>
                ) : (
                    <div className="empty-state py-20 text-center opacity-30 flex flex-col items-center">
                        <Zap size={48} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Sense bategats recents</p>
                    </div>
                )}
            </main>

            <footer className="py-24 text-center opacity-10">
                <p className="text-[8px] font-black uppercase tracking-[1em]">GÈNESI V14 • SÓC DE POBLE</p>
            </footer>
        </div>
    );
};

export default ProfileView;
