import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    User, Settings, ChevronRight, Loader2, AlertCircle, 
    Sparkles, Zap, Grid, Heart, Share2, ArrowLeft, Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { supabaseService, isValidUUID } from '../services/supabaseService';
import SEO from '../components/SEO';
import Feed from '../components/Feed';
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

    const isOwnProfile = !id && !username;
    
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let targetProfile = null;
                
                // 1. Resolve Target Profile
                if (isOwnProfile) {
                    targetProfile = myProfile || currentUser;
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

                if (!targetProfile) throw new Error('Perfil no trobat');
                setProfile(targetProfile);

                // 2. Resolve Stats if we have a valid UUID
                if (isValidUUID(targetProfile.id)) {
                    const [followers, following, posts] = await Promise.all([
                        supabaseService.getFollowers(targetProfile.id),
                        supabaseService.getFollowing(targetProfile.id),
                        supabaseService.getUserPostsCount(targetProfile.id)
                    ]);

                    setStats({
                        followers: followers?.length || 0,
                        following: following?.length || 0,
                        posts: posts || 0
                    });

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
        fetchProfileData();
    }, [id, username, isOwnProfile, currentUser, myProfile, location.pathname]);

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

    // Get Initials for Avatar
    const getInitials = (name) => {
        if (!name) return 'SP';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="profile-hub-container bg-black min-h-screen text-white font-sans overflow-x-hidden">
            <SEO title={profile?.full_name} description={profile?.bio} />
            
            <header className="relative w-full h-[45vh] min-h-[300px]">
                <div className="cover-wrapper w-full h-full overflow-hidden">
                    <img src={profile.cover_url || "/rural_tech_future_valencia.png"} alt="" className="w-full h-full object-cover opacity-80" />
                    <div className="cover-gradient absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="header-actions absolute top-6 left-6 right-6 flex justify-between z-10">
                    <button onClick={() => navigate(-1)} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10"><ArrowLeft size={24} /></button>
                    <div className="flex gap-3">
                        <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10"><Share2 size={24} /></button>
                        <button className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10"><Settings size={24} /></button>
                    </div>
                </div>

                <div className="avatar-central-wrapper absolute -bottom-20 left-1/2 -translate-x-1/2">
                    <div className="avatar-frame relative w-44 h-44 rounded-full p-2 bg-black overflow-hidden border-4 border-black group">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center border-4 border-[#F97316] relative">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-white italic tracking-tighter">
                                    {getInitials(profile.full_name)}
                                </span>
                            )}
                            {isOwnProfile && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <Camera size={24} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <section className="identity-block mt-32 px-6 text-center space-y-8">
                <div className="badges-wrapper flex justify-center gap-3 mb-4">
                    <span className="px-5 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{profile.town_name || 'TERRITORI'}</span>
                    <span className="px-5 py-2 bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{profile.role?.toUpperCase() || 'BATEGANT'}</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter py-4 leading-[0.9]">
                    {isOwnProfile && myProfile?.full_name ? myProfile.full_name : profile.full_name}
                </h1>
                <p className="max-w-lg mx-auto text-gray-400 text-base leading-relaxed px-12 opacity-90 font-medium italic">
                    {profile.bio || "Bategant a Sóc de Poble amb orgull i trellat."}
                </p>

                <div className="connect-action py-6 flex justify-center">
                    {!isOwnProfile ? (
                        <button 
                            onClick={() => openConnectionModal({ targetId: profile.id })}
                            className="w-full max-w-[280px] h-16 rounded-full bg-gradient-to-r from-[#F97316] to-[#E11D48] text-white font-black text-lg shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-3"
                        >
                            <Heart size={20} fill={isConnected ? "white" : "none"} />
                            <span>{isConnected ? 'CONNEXIÓ ACTIVA' : 'CONNECTAR'}</span>
                        </button>
                    ) : (
                        <button 
                            className="w-full max-w-[280px] h-16 rounded-full bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                        >
                            <span>EDITAR PERFIL</span>
                        </button>
                    )}
                </div>

                <div className="stats-pill-row flex justify-center gap-12 py-8 bg-white/5 mx-auto max-w-lg rounded-[28px] border border-white/5">
                    <div className="stat-item flex flex-col">
                        <span className="text-2xl font-black">{stats.followers}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seguidors</span>
                    </div>
                    <div className="stat-item flex flex-col border-x border-white/10 px-12">
                        <span className="text-2xl font-black">{stats.following}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seguint</span>
                    </div>
                    <div className="stat-item flex flex-col">
                        <span className="text-2xl font-black">{stats.posts}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Històries</span>
                    </div>
                </div>
            </section>

            <nav className="tabs-nav sticky top-16 z-20 bg-black/80 backdrop-blur-xl border-y border-white/5 mt-12">
                <div className="flex justify-center max-w-md mx-auto">
                    <button 
                        onClick={() => setActiveTab('mur')}
                        className={`btn-profile-tab flex-1 py-4 text-[12px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'mur' ? 'active text-white' : 'text-gray-500'}`}
                    >
                        <Grid size={16} /> MUR
                    </button>
                    <button 
                        onClick={() => setActiveTab('bategats')}
                        className={`btn-profile-tab flex-1 py-4 text-[12px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'bategats' ? 'active text-white' : 'text-gray-500'}`}
                    >
                        <Heart size={16} /> BATEGATS
                    </button>
                </div>
            </nav>

            <main className="content-area p-4 min-h-[50vh]">
                {activeTab === 'mur' ? (
                    <Feed hideHeader={true} customPosts={[]} />
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
