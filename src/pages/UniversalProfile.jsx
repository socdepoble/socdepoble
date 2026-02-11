import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useUI } from "../context/UIContext";
import { 
  Share2, MapPin, CheckCircle, Link as LinkIcon, 
  Grid, Heart, Camera, Moon, Sun, Check, Sparkles, BookOpen
} from 'lucide-react';
import './UniversalProfile.css';

/**
 * 🏺 UNIVERSAL PROFILE - LA BÍBLIA ESTRUCTURAL v1.23
 * Arquitectura Premium per a la identitat bategada amb control de tema i animacions Holy.
 */
const UniversalProfile = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { iaiaLevel, setIaiaLevel, architectMode, setArchitectMode } = useUI();
  const [activeTab, setActiveTab] = useState('posts');
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: profile?.full_name || user?.email || "Master Arquitecte",
    role: profile?.bio || "Dissenyant el futur bategat del territori amb sobirania digital i essència d'Oli d'Oliva. #SócDePoble 🏺✨",
    location: profile?.primary_town || "LA TORRE",
    type: profile?.role?.toUpperCase() || "PROTECTOR DEL MAS",
    stats: { followers: "2.4k", following: "1.1k", posts: "148" },
    avatarUrl: profile?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop", 
    coverUrl: profile?.cover_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const userPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=500&auto=format&fit=crop" },
    { id: 2, image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500&auto=format&fit=crop" },
    { id: 3, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop" },
    { id: 4, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=500&auto=format&fit=crop" },
    { id: 5, image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24ef88?q=80&w=500&auto=format&fit=crop" },
    { id: 6, image: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=500&auto=format&fit=crop" }
  ];

  return (
    <div className="min-h-full bg-[var(--bg-app)] pb-32 overflow-x-hidden">
      {/* 1. HERO SECTION / COVER */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img src={profileData.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-app)] to-transparent" />
        
        {/* TEMA TOGGLE (PORTADA) */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button title="Compartir" className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110 shadow-2xl">
             <Share2 size={20} />
          </button>
          <button 
            onClick={toggleTheme} 
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110 shadow-2xl"
            title="Canviar Tema"
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* EDIT BUTTON */}
        <div className="absolute bottom-6 right-6 z-20">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all text-xs font-black tracking-widest uppercase"
          >
            {isEditing ? <Check size={16} /> : <Camera size={16} />} {isEditing ? 'DESAR' : 'EDITAR'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col items-center">
          {/* 2. AVATAR */}
          <div className="relative group">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[56px] border-8 border-[var(--bg-app)] overflow-hidden bg-zinc-900 shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 rounded-full border-4 border-[var(--bg-app)] shadow-lg" />
          </div>

          {/* 3. INFO BÀSICA */}
          <div className="mt-8 text-center w-full max-w-2xl px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="bg-orange-600/10 text-orange-600 text-[10px] px-4 py-1.5 rounded-full font-black flex items-center gap-1 border border-orange-600/20 uppercase tracking-widest shadow-sm">
                <MapPin size={12} /> {profileData.location}
              </span>
              <span className="bg-blue-600/10 text-blue-600 text-[10px] px-4 py-1.5 rounded-full font-black border border-blue-600/20 uppercase tracking-widest shadow-sm">
                {profileData.type}
              </span>
            </div>
            
            {isEditing ? (
              <input name="name" value={profileData.name} onChange={handleInputChange} className="bg-transparent text-[var(--text-main)] text-4xl md:text-6xl font-black tracking-tighter mb-4 text-center w-full focus:outline-none border-b border-black/10 pb-1" />
            ) : (
              <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] tracking-tighter mb-4 flex items-center justify-center gap-3">
                {profileData.name} <Sparkles size={24} className="text-orange-500" />
              </h1>
            )}

            {isEditing ? (
              <textarea name="role" value={profileData.role} onChange={handleInputChange} rows="3" className="bg-black/5 text-[var(--text-secondary)] text-lg leading-relaxed mx-auto rounded-2xl p-4 w-full max-w-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-center mt-4" />
            ) : (
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed font-semibold max-w-lg mx-auto opacity-80">{profileData.role}</p>
            )}
          </div>

          {/* 4. ACCIÓ PRINCIPAL (BATEGANT) */}
          <div className="mt-12 mb-16 w-full flex justify-center">
            <button 
              onClick={() => setIsConnected(!isConnected)} 
              className={`group relative px-16 py-6 rounded-full font-black text-xl tracking-[0.2em] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-4 shadow-2xl ${
                isConnected 
                ? 'bg-[var(--bg-app)] text-green-500 border-2 border-green-500/30' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white animate-breathing'
              }`}
            >
              {isConnected ? <CheckCircle size={28} /> : <LinkIcon size={28} />} 
              {isConnected ? 'CONNECTAT' : 'CONNECTAR'}
              {!isConnected && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-white/20"></span>
                </span>
              )}
            </button>
          </div>

        {/* 6. PANELL DE CONTROL (MASTER AJUSTOS) */}
        <div className="max-w-2xl mx-auto px-6 mb-24">
          <div className="bg-white/5 border border-white/10 rounded-[48px] p-10 backdrop-blur-md">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-10 text-center">Configuració del Mas Digital</h3>
            
            <div className="grid gap-8">
              {/* Tema */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-2xl text-orange-500">
                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase">Aparença</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mode {theme === 'dark' ? 'Nit' : 'Dia'}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className="px-6 py-2 bg-white/10 rounded-full text-[10px] font-black hover:bg-white/20 transition-all uppercase tracking-widest">Canviar</button>
              </div>

              {/* IAIA Level */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-2xl text-blue-500">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase">Nivell IAIA</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Implicació: {iaiaLevel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setIaiaLevel(lvl)}
                      className={`w-10 h-10 rounded-full text-xs font-black transition-all ${iaiaLevel === lvl ? 'bg-orange-600 text-white scale-110 shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modo Arquitecto */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-2xl text-green-500">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase">Modo Arquitecte</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{architectMode ? 'ACTIU (Definicions)' : 'INACTIU (Producció)'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setArchitectMode(!architectMode)} 
                  className={`px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest ${architectMode ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400'}`}
                >
                  {architectMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

          {/* 5. ESTADÍSTIQUES HARMONITZADES */}
          <div className="flex items-center justify-center gap-8 md:gap-24 w-full max-w-2xl mx-auto py-10 border-y border-black/5 mb-16 px-4">
            <div className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
              <span className="text-4xl font-black text-[var(--text-main)] group-hover:text-orange-500">{profileData.stats.followers}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-3 font-black">Seguidors</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
              <span className="text-4xl font-black text-[var(--text-main)] group-hover:text-blue-500">{profileData.stats.following}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-3 font-black">Seguint</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
              <span className="text-4xl font-black text-[var(--text-main)] group-hover:text-red-500">{profileData.stats.posts}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-3 font-black">Històries</span>
            </div>
          </div>
        </div>

        {/* 6. NAVEGACIÓ TABS */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/5 p-2 rounded-full inline-flex border border-black/5 backdrop-blur-sm shadow-inner">
            <button 
              onClick={() => setActiveTab('posts')} 
              className={`flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black transition-all duration-400 tracking-[0.2em] uppercase ${
                activeTab === 'posts' 
                ? 'bg-[var(--text-main)] text-[var(--bg-app)] shadow-2xl scale-105' 
                : 'text-gray-500 hover:text-[var(--text-main)] hover:bg-white/10'
              }`}
            >
              <Grid size={18} /> MUR
            </button>
            <button 
              onClick={() => setActiveTab('media')} 
              className={`flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black transition-all duration-400 tracking-[0.2em] uppercase ${
                activeTab === 'media' 
                ? 'bg-[var(--text-main)] text-[var(--bg-app)] shadow-2xl scale-105' 
                : 'text-gray-500 hover:text-[var(--text-main)] hover:bg-white/10'
              }`}
            >
              <Heart size={18} /> BATEGATS
            </button>
          </div>
        </div>

        {/* 7. CONTINGUT TABS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {activeTab === 'posts' && userPosts.map((post) => (
            <div key={post.id} className="group relative aspect-square bg-zinc-900 rounded-[48px] overflow-hidden border border-black/5 cursor-pointer hover:scale-[1.02] transition-all duration-500 shadow-xl">
              <img src={post.image} alt="Post" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <div className="flex items-center gap-4 text-white font-black">
                  <div className="flex items-center gap-1"><Heart size={20} className="fill-white" /> 124</div>
                  <div className="flex items-center gap-1"><Share2 size={20} /> 12</div>
                </div>
              </div>
            </div>
          ))}
          {activeTab === 'media' && (
             <div className="col-span-full py-32 text-center text-gray-600 border-4 border-dashed border-black/5 rounded-[64px] bg-black/[0.01]">
               <Heart size={64} className="mx-auto mb-8 opacity-10" />
               <p className="text-3xl font-black text-gray-400 tracking-tight">Encara no hi ha bategats.</p>
               <p className="text-xs mt-4 font-black opacity-40 uppercase tracking-[0.5em]">Connecta amb el territori per omplir el rebost.</p>
             </div>
          )}
        </div>
      </div>

      {/* 8. FOOTER SOBIRANIA */}
      <div className="w-full text-center pb-20 pt-32 text-[var(--text-muted)] text-[9px] font-black tracking-[0.8em] uppercase border-t border-black/5 mt-32 opacity-30">
        Sóc de Poble © Sobirania Digital • 2026
      </div>
    </div>
  );
};

export default UniversalProfile;
