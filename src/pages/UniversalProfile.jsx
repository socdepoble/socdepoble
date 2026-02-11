import React, { useState } from 'react';
import { 
  Share2, Settings, Save, MapPin, CheckCircle, Link as LinkIcon, 
  Grid, Heart, Camera, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './UniversalProfile.css';

/**
 * 🏺 UNIVERSAL PROFILE - LA BÍBLIA ESTRUCTURAL v1.21
 * Arquitectura Premium per a la identitat bategada.
 */
const UniversalProfile = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: profile?.full_name || user?.email || "Veí de Poble",
    role: profile?.bio || "Sóc un bategat del territori. Buscant sempre la millor versió del nostre poble. #SócDePoble 🏺✨",
    location: profile?.primary_town || "LA TORRE",
    type: profile?.role?.toUpperCase() || "VEI",
    stats: { followers: "1.2k", following: "45", posts: "8" },
    avatarUrl: profile?.avatar_url || "", 
    coverUrl: profile?.cover_url || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const userPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 4, image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 5, image: "https://images.unsplash.com/photo-1533497125307-e836b8109d94?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 6, image: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <div className="universal-profile-body pb-32">
      {/* Hero Section */}
      <div className="profile-hero-section relative w-full">
        <div className="profile-cover-box relative w-full h-64 md:h-80 overflow-hidden rounded-b-[40px] shadow-2xl border-b border-white/10">
          <img src={profileData.coverUrl} alt="Portada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-6 right-6 z-20 flex gap-3">
             <button className="p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-all border border-white/10 group">
              <Share2 size={20} className="text-white" />
            </button>
            <button onClick={() => setIsEditing(!isEditing)} className={`p-3 backdrop-blur-md rounded-full transition-all border border-white/10 group ${isEditing ? 'bg-orange-500 text-white' : 'bg-black/40 text-white hover:bg-white/10'}`}>
              {isEditing ? <Save size={20} /> : <Settings size={20} />}
            </button>
          </div>
        </div>

        <div className="px-6 md:px-12 -mt-24 relative z-30 flex flex-col items-center text-center">
          <div className="relative group cursor-pointer inline-block">
            <div className="w-48 h-48 rounded-full p-1.5 bg-[var(--bg-app)] shadow-2xl relative z-10 flex items-center justify-center overflow-hidden">
              {profileData.avatarUrl ? (
                <img 
                  src={profileData.avatarUrl} 
                  alt={profileData.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-500 text-6xl font-black text-white uppercase">
                  {profileData.name.substring(0, 2)}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20"><Camera size={32} className="text-white" /></div>
            </div>
          </div>

          <div className="mt-4 w-full max-w-2xl px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="bg-red-950/40 text-red-200 text-[10px] px-4 py-1.5 rounded-full font-black flex items-center gap-1 border border-red-500/20 shadow-lg uppercase tracking-widest">
                <MapPin size={12} /> {profileData.location}
              </span>
              <span className="bg-indigo-950/40 text-indigo-200 text-[10px] px-4 py-1.5 rounded-full font-black border border-indigo-500/30 shadow-lg uppercase tracking-widest">
                {profileData.type}
              </span>
            </div>
            
            {isEditing ? (
              <input name="name" value={profileData.name} onChange={handleInputChange} className="bg-transparent text-white text-4xl md:text-5xl font-black tracking-tight mb-2 text-center w-full focus:outline-none border-b border-white/10 pb-1" />
            ) : (
              <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight mb-2">{profileData.name}</h1>
            )}
            
            {isEditing ? (
              <textarea name="role" value={profileData.role} onChange={handleInputChange} rows="3" className="bg-white/5 text-gray-400 text-lg leading-relaxed mx-auto rounded-2xl p-4 w-full max-w-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-center mt-4" />
            ) : (
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed font-medium mx-auto max-w-lg mt-2">{profileData.role}</p>
            )}
          </div>

          <div className="mt-10 mb-10 w-full flex justify-center">
            <button onClick={() => setIsConnected(!isConnected)} className={`group relative px-12 py-5 rounded-full font-black text-xl tracking-[0.2em] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-4 shadow-2xl ${isConnected ? 'bg-zinc-800 text-green-400 border border-green-500/30' : 'bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-[length:200%_auto] animate-gradient text-white border border-white/20'}`}>
              {isConnected ? <CheckCircle size={28} /> : <LinkIcon size={28} />} {isConnected ? 'CONNECTAT' : 'CONNECTAR'}
              {!isConnected && (<span className="absolute -top-1 -right-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span></span>)}
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-20 w-full max-w-2xl mx-auto py-8 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-[32px] px-4">
            <div className="flex flex-col items-center group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all"><span className="text-3xl font-black text-[var(--text-main)] group-hover:text-orange-500">{profileData.stats.followers}</span><span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-black">Seguidors</span></div>
            <div className="flex flex-col items-center group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all"><span className="text-3xl font-black text-[var(--text-main)] group-hover:text-orange-500">{profileData.stats.following}</span><span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-black">Seguint</span></div>
            <div className="flex flex-col items-center group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all"><span className="text-3xl font-black text-[var(--text-main)] group-hover:text-orange-500">{profileData.stats.posts}</span><span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-black">Històries</span></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 mt-12 mb-20">
        <div className="flex justify-center mb-10">
          <div className="bg-white/5 p-1.5 rounded-full inline-flex border border-white/5">
            <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-3 px-8 py-4 rounded-full text-sm font-black transition-all duration-400 tracking-widest ${activeTab === 'posts' ? 'bg-white text-black shadow-xl scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Grid size={20} /> MUR</button>
            <button onClick={() => setActiveTab('media')} className={`flex items-center gap-3 px-8 py-4 rounded-full text-sm font-black transition-all duration-400 tracking-widest ${activeTab === 'media' ? 'bg-white text-black shadow-xl scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Heart size={20} /> BATEGATS</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'posts' && userPosts.map((post) => (
            <div key={post.id} className="group relative aspect-square bg-zinc-900 rounded-[32px] overflow-hidden border border-white/5 cursor-pointer hover:border-orange-500/30 transition-all duration-500 shadow-2xl">
              <img src={post.image} alt="Post" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"><div className="flex items-center gap-1 text-white font-black"><Heart size={20} className="fill-white" /> 124</div></div>
            </div>
          ))}
          {activeTab === 'media' && (
             <div className="col-span-full py-24 text-center text-gray-600 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]"><Heart size={64} className="mx-auto mb-6 opacity-10" /><p className="text-2xl font-black text-gray-400">Encara no hi ha bategats.</p><p className="text-sm mt-3 font-medium opacity-50 uppercase tracking-widest">Connecta amb el poble per omplir el rebost.</p></div>
          )}
        </div>
      </div>
      <div className="w-full text-center pb-12 pt-12 text-gray-800 text-[10px] font-black tracking-[0.5em] uppercase border-t border-white/5 mt-20 opacity-30">Sóc de Poble © 2026 • Sobirania Digital</div>
    </div>
  );
};

export default UniversalProfile;
