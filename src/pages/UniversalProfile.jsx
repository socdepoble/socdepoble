import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useI18n } from "../context/I18nContext";
import { useUI } from "../context/UIContext";
import { 
  Share2, MapPin, CheckCircle, Link as LinkIcon, 
  Grid, Heart, Camera, Moon, Sun, Check, Sparkles, BookOpen, Settings, Zap, Archive as HistoryIcon, Globe
} from 'lucide-react';
import TownPickerModal from '../components/TownPickerModal';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './UniversalProfile.css';

/**
 * 🏺 UNIVERSAL PROFILE - LA BÍBLIA ESTRUCTURAL v10.25.0-ACCESSIBILITY-BOOST
 * Arquitectura Premium per a la identitat bategada amb control de tema i animacions Holy.
 */
const UniversalProfile = () => {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useI18n();
  const { iaiaLevel, setIaiaLevel, architectMode, setArchitectMode } = useUI();
  const [activeTab, setActiveTab] = useState('posts');
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTownPickerOpen, setIsTownPickerOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: profile?.full_name || "Javi Llinares",
    role: profile?.bio || "Arquitecte digital i amant de l'oli d'oliva. Buscant sempre la millor versió del nostre poble. #SócDePoble 🏺✨",
    location: profile?.primary_town || "LA TORRE",
    type: profile?.role?.toUpperCase() || "SUPER ADMIN",
    stats: { followers: "1.2k", following: "45", posts: "8" },
    avatarUrl: profile?.avatar_url || "/Javi_Llinares-Foto_perfil-1.jpg", 
    coverUrl: profile?.cover_url || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
  });


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
      <ProfileHeaderPremium 
        title={profileData.name}
        subtitle={profileData.type}
        town={profileData.location}
        bio={profileData.role}
        avatarUrl={profileData.avatarUrl}
        coverUrl={profileData.coverUrl}
        isEditing={isEditing}
        isConnected={isConnected}
        onConnect={() => setIsConnected(!isConnected)}
        onEditToggle={() => setIsEditing(true)}
        onEditSave={() => setIsEditing(false)}
        onEditCancel={() => setIsEditing(false)}
        onTownChange={() => setIsTownPickerOpen(true)}
        onTitleChange={(val) => setProfileData(prev => ({ ...prev, name: val }))}
        onSubtitleChange={(val) => setProfileData(prev => ({ ...prev, type: val }))}
        onBioChange={(val) => setProfileData(prev => ({ ...prev, role: val }))}
        showThemeToggle={true}
      >
        {/* Statistics integrated via children if needed, or separate below */}
      </ProfileHeaderPremium>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <TownPickerModal 
          isOpen={isTownPickerOpen} 
          onClose={() => setIsTownPickerOpen(false)} 
          onSelect={(selection) => {
            if (selection && selection.primary) {
              setProfileData(prev => ({ ...prev, location: selection.primary.name }));
            }
            setIsTownPickerOpen(false);
          }} 
        />

        {/* 6. PANELL DE CONTROL (MASTER AJUSTOS) */}
        <div className="max-w-2xl mx-auto px-4 md:px-6 mb-24">
          <div className="bg-white/5 border border-white/10 rounded-[48px] p-6 md:p-12 backdrop-blur-md">
            <h3 className="text-lg font-black uppercase tracking-[0.4em] text-gray-500 mb-12 text-center">Configuració del Mas Digital</h3>
            
            <div className="grid gap-8">
              {/* Tema */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-800 rounded-2xl text-orange-500">
                    {theme === 'dark' ? <Moon size={28} /> : <Sun size={28} />}
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase">Aparença</h4>
                    <p className="text-base text-gray-400 font-bold uppercase tracking-widest">Mode {theme === 'dark' ? 'Nit' : 'Dia'}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className="px-8 h-14 bg-white/10 rounded-full text-base font-black hover:bg-white/20 transition-all uppercase tracking-widest">Canviar</button>
              </div>

              {/* Idioma (Nou v11.0.6) */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-800 rounded-2xl text-cyan-500">
                    <Globe size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase">Idioma</h4>
                    <p className="text-base text-gray-400 font-bold uppercase tracking-widest">Llengua bategant: {language === 'VA' ? 'VALENCIÀ' : 'CASTELLÀ'}</p>
                  </div>
                </div>
                <button onClick={toggleLanguage} className="px-8 h-14 bg-white/10 rounded-full text-base font-black hover:bg-white/20 transition-all uppercase tracking-widest">{(language || 'VA').split('-')[0].toUpperCase()}</button>
              </div>

              {/* IAIA Level */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-800 rounded-2xl text-blue-500">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase">Nivell IAIA</h4>
                    <p className="text-base text-gray-400 font-bold uppercase tracking-widest">Implicació: {iaiaLevel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setIaiaLevel(lvl)}
                      className={`w-14 h-14 rounded-full text-base font-black transition-all ${iaiaLevel === lvl ? 'bg-orange-600 text-white scale-110 shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modo Arquitecto */}
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-800 rounded-2xl text-green-500">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase">Modo Arquitecte</h4>
                    <p className="text-base text-gray-400 font-bold uppercase tracking-widest">{architectMode ? 'ACTIU (Definicions)' : 'INACTIU (Producció)'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setArchitectMode(!architectMode)} 
                  className={`px-8 h-14 rounded-full text-base font-black transition-all uppercase tracking-widest ${architectMode ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400'}`}
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
              <span className="text-base text-gray-500 uppercase tracking-[0.3em] mt-3 font-black">Seguidors</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
              <span className="text-4xl font-black text-[var(--text-main)] group-hover:text-blue-500">{profileData.stats.following}</span>
              <span className="text-base text-gray-500 uppercase tracking-[0.3em] mt-3 font-black">Seguint</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
              <span className="text-4xl font-black text-[var(--text-main)] group-hover:text-red-500">{profileData.stats.posts}</span>
              <span className="text-base text-gray-500 uppercase tracking-[0.3em] mt-3 font-black">Històries</span>
            </div>
          </div>

        {/* 7. NAVEGACIÓ TABS */}
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
      <div className="w-full text-center pb-20 pt-32 text-[var(--text-muted)] text-[12px] font-black tracking-[0.8em] uppercase border-t border-black/5 mt-32 opacity-30 px-4">
        Sóc de Poble © Sobirania Digital • 2026
      </div>
    </div>
  );
};

export default UniversalProfile;
