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
 * 🏺 UNIVERSAL PROFILE - LA BÍBLIA ESTRUCTURAL v1.25.0-MASTER-GOLDEN
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
        <div className="profile-control-panel-wrapper max-w-2xl mx-auto mb-24 px-4">
          <div className="profile-control-panel">
            <h3 className="panel-title">Configuració del Mas Digital</h3>
            
            <div className="config-grid">
              {/* Tema */}
              <div className="config-row">
                <div className="config-meta">
                  <div className="config-icon-box" style={{ color: theme === 'dark' ? 'var(--sdp-terracotta)' : '#EAB308' }}>
                    {theme === 'dark' ? <Moon size={28} /> : <Sun size={28} />}
                  </div>
                  <div className="config-text">
                    <h4>Aparença</h4>
                    <p>Mode {theme === 'dark' ? 'Nit' : 'Dia'}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className="btn-config-toggle">ALTERAR</button>
              </div>

              {/* Idioma */}
              <div className="config-row">
                <div className="config-meta">
                  <div className="config-icon-box" style={{ color: '#F8FAFC' }}>
                    <Globe size={28} />
                  </div>
                  <div className="config-text">
                    <h4>Idioma</h4>
                    <p>Llengua bategant: {language === 'VA' ? 'VALENCIÀ' : 'CASTELLÀ'}</p>
                  </div>
                </div>
                <button onClick={toggleLanguage} className="btn-config-toggle">{(language || 'VA').split('-')[0].toUpperCase()}</button>
              </div>

              {/* IAIA Level */}
              <div className="config-row">
                <div className="config-meta">
                  <div className="config-icon-box" style={{ color: '#3B82F6' }}>
                    <Sparkles size={28} />
                  </div>
                  <div className="config-text">
                    <h4>Nivell IAIA</h4>
                    <p>Implicació: {iaiaLevel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setIaiaLevel(lvl)}
                      className={`w-12 h-12 rounded-full text-base font-black transition-all ${iaiaLevel === lvl ? 'bg-[var(--sdp-terracotta)] text-black scale-110 shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modo Arquitecto */}
              <div className="config-row">
                <div className="config-meta">
                  <div className="config-icon-box" style={{ color: '#22C55E' }}>
                    <BookOpen size={28} />
                  </div>
                  <div className="config-text">
                    <h4>Modo Arquitecte</h4>
                    <p>{architectMode ? 'ACTIU (Definicions)' : 'INACTIU (Producció)'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setArchitectMode(!architectMode)} 
                  className={`btn-config-toggle ${architectMode ? 'active' : ''}`}
                >
                  {architectMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. ESTADÍSTIQUES HARMONITZADES */}
        <div className="profile-stats-row max-w-2xl mx-auto">
          <div className="stat-item group">
            <span className="stat-value group-hover:text-[var(--sdp-terracotta)]">{profileData.stats.followers}</span>
            <span className="stat-label">Seguidors</span>
          </div>
          <div className="stat-item group">
            <span className="stat-value group-hover:text-blue-500">{profileData.stats.following}</span>
            <span className="stat-label">Seguint</span>
          </div>
          <div className="stat-item group">
            <span className="stat-value group-hover:text-red-500">{profileData.stats.posts}</span>
            <span className="stat-label">Històries</span>
          </div>
        </div>

        {/* 7. NAVEGACIÓ TABS */}
        <div className="profile-tabs-selector">
          <div className="tabs-inner-pill">
            <button 
              onClick={() => setActiveTab('posts')} 
              className={`btn-profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            >
              <Grid size={18} /> MUR
            </button>
            <button 
              onClick={() => setActiveTab('media')} 
              className={`btn-profile-tab ${activeTab === 'media' ? 'active' : ''}`}
            >
              <Heart size={18} /> BATEGATS
            </button>
          </div>
        </div>

        {/* 7. CONTINGUT TABS */}
        <div className="profile-content-grid">
          {activeTab === 'posts' && userPosts.map((post) => (
            <div key={post.id} className="profile-post-card group">
              <img src={post.image} alt="Post" className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110" />
              <div className="post-overlay">
                <div className="flex items-center gap-4 text-white font-black">
                  <div className="flex items-center gap-1"><Heart size={20} className="fill-white" /> 124</div>
                  <div className="flex items-center gap-1"><Share2 size={20} /> 12</div>
                </div>
              </div>
            </div>
          ))}
          {activeTab === 'media' && (
             <div className="col-span-full py-32 text-center text-gray-600 border-4 border-dashed border-black/5 rounded-[var(--sdp-radius-genesis)] bg-black/[0.01]">
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
