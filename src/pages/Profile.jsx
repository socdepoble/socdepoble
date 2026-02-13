import { useState } from 'react';
import { 
  MapPin, 
  Settings, 
  Grid, 
  Heart, 
  Share2, 
  Camera, 
  Link as LinkIcon, 
  CheckCircle,
  Save,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

/**
 * ⚠️ NOTA NUCLEAR PER A FLASH ⚠️
 * --------------------------------------
 * MIRA BÉ: Aquest component s'injecta DINS del contenidor principal.
 * NO toques el Layout.jsx, NO toques la Sidebar, NO toques el Header.
 * Estem treballant EXCLUSIVAMENT en el 'Content Frame' (la part de baix/dreta).
 * * * FOTO DE PERFIL (CRÍTIC):
 * La imatge 'avatarUrl' apunta a '/Javi_Llinares-Foto_perfil-1.jpg'.
 * ASSEGURA'T que aquest fitxer existeix a la carpeta /public.
 * Si no es troba, es mostrarà un fallback taronja amb inicials, MAI una foto d'stock.
 */

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useI18n();
  const [activeTab, setActiveTab] = useState('posts');
  const [isConnected, setIsConnected] = useState(false); // L'Eix del Sistema
  const [isEditing, setIsEditing] = useState(false); // Mode Edició

  // DADES MESTRE (JAVI LLINARES)
  const [profileData, setProfileData] = useState({
    name: "Javi Llinares",
    role: "Arquitecte digital i amant de l'oli d'oliva. Buskant sempre la millor versió del nostre poble. #SócDePoble 🏺✨",
    location: "LA TORRE",
    type: "SUPER ADMIN",
    stats: { followers: "1.2k", following: "45", posts: "8" },
    
    // --- LA FOTO SAGRADA ---
    avatarUrl: "/Javi_Llinares-Foto_perfil-1.jpg", 
    
    // Fons groc creatiu (Llapis/Disseny)
    coverUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  });

  // Handler per a canvis en els inputs
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
    <div className="w-full min-h-screen bg-black text-white font-sans overflow-y-auto custom-scrollbar pb-32">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap');
          .font-condensed { font-family: 'Roboto Condensed', sans-serif; }
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          
          @keyframes pulse-orange {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
          }
          .animate-pulse-orange { animation: pulse-orange 2s infinite; }
        `}
      </style>

      {/* --- HERO SECTION (GROC & LLAPIS) --- */}
      <div className="relative w-full">
        {/* Imatge de Portada */}
        <div className="w-full h-64 md:h-80 overflow-hidden relative rounded-b-[40px] shadow-2xl border-b border-gray-800 bg-yellow-500">
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <img 
            src={profileData.coverUrl} 
            alt="Portada" 
            className="w-full h-full object-cover opacity-90"
          />
          
          <div className="absolute top-6 right-6 z-20 flex gap-3">
             {/* CONFIGURACIÓ RÀPIDA (Migrada de Header) */}
             <button onClick={toggleTheme} className="p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-all border border-white/10 group">
                {theme === 'dark' ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-yellow-400" />}
             </button>
             <button onClick={toggleLanguage} className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-all border border-white/10 font-bold text-[10px] text-white">
                <div className="flex items-center gap-2">
                    <Globe size={14} />
                    {(language || 'VA').split('-')[0].toUpperCase()}
                </div>
             </button>

             <button className="p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-all border border-white/10 group">
              <Share2 size={20} className="text-white group-hover:scale-110" />
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-3 backdrop-blur-md rounded-full transition-all border border-white/10 group ${isEditing ? 'bg-[#F97316] text-white' : 'bg-black/40 text-white hover:bg-white/10'}`}
            >
              {isEditing ? <Save size={20} /> : <Settings size={20} className="group-hover:rotate-90 transition-transform" />}
            </button>
          </div>
        </div>

        {/* --- IDENTITAT & CAMPS EDITABLES --- */}
        <div className="px-6 md:px-12 -mt-24 relative z-30 flex flex-col items-center text-center">
          
          {/* AVATAR: LA FOTO DE LA PERRUCA */}
          <div className="relative group cursor-pointer">
            <div className="w-40 h-40 rounded-full p-1 bg-black shadow-2xl relative z-10 flex items-center justify-center bg-[#F97316]">
              <img 
                src={profileData.avatarUrl} 
                alt={profileData.name} 
                className="w-full h-full object-cover rounded-full border-4 border-[#1a1a1a]"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
              />
              
              {/* Fallback Visual: Inicials "JL" si la foto no carrega */}
              <div className="absolute inset-0 flex items-center justify-center -z-10 text-5xl font-bold text-white font-condensed tracking-tighter">
                  JL
              </div>

              {/* Overlay d'Edició */}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <Camera size={32} className="text-white" />
              </div>
            </div>
          </div>

          <div className="mt-4 font-condensed w-full max-w-2xl">
            {/* Badges Editables */}
            <div className="flex items-center justify-center gap-3 mb-3">
              {isEditing ? (
                <>
                  <input 
                    name="location" 
                    value={profileData.location} 
                    onChange={handleInputChange}
                    className="bg-[#5c2b2b] text-[#ffcccc] text-xs px-4 py-1.5 rounded-full font-bold border border-red-500/20 text-center w-32 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  />
                  <input 
                    name="type" 
                    value={profileData.type} 
                    onChange={handleInputChange}
                    className="bg-[#1e1b4b] text-[#818CF8] text-xs px-4 py-1.5 rounded-full font-bold border border-[#4F46E5]/30 text-center w-32 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  />
                </>
              ) : (
                <>
                  <span className="bg-[#5c2b2b] text-[#ffcccc] text-xs px-4 py-1.5 rounded-full font-bold flex items-center gap-1 border border-red-500/20 shadow-lg tracking-wider">
                    <MapPin size={12} /> {profileData.location}
                  </span>
                  <span className="bg-[#1e1b4b] text-[#818CF8] text-xs px-4 py-1.5 rounded-full font-bold border border-[#4F46E5]/30 shadow-lg tracking-wider">
                    {profileData.type}
                  </span>
                </>
              )}
            </div>
            
            {/* NOM (Editable) */}
            <div className="relative group inline-block w-full">
              {isEditing ? (
                <input 
                  name="name" 
                  value={profileData.name} 
                  onChange={handleInputChange}
                  className="bg-transparent text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl mb-2 text-center w-full focus:outline-none border-b border-white/20 pb-1"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-xl mb-2 flex items-center justify-center gap-3">
                  {profileData.name}
                </h1>
              )}
            </div>
            
            {/* BIO (Editable) */}
            <div className="relative group mt-2 w-full">
              {isEditing ? (
                <textarea 
                  name="role" 
                  value={profileData.role} 
                  onChange={handleInputChange}
                  rows="3"
                  className="bg-white/5 text-gray-300 text-lg leading-relaxed font-light mx-auto rounded-lg p-3 w-full max-w-lg focus:outline-none focus:ring-1 focus:ring-[#F97316] text-center"
                />
              ) : (
                <p className="text-gray-300 text-lg leading-relaxed font-light mx-auto max-w-lg">
                  {profileData.role}
                </p>
              )}
            </div>
          </div>

          {/* --- L'EIX DEL SISTEMA: BOTÓ CONNECTAR (MANDATORI) --- */}
          <div className="mt-8 mb-8 w-full flex justify-center">
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className={`
                group relative px-10 py-5 rounded-full font-bold text-xl tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl
                ${isConnected 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-2 border-green-400/50' 
                  : 'bg-gradient-to-r from-[#F97316] to-[#DB2777] text-white animate-pulse-orange border-2 border-orange-400/50'
                }
              `}
            >
              <LinkIcon size={28} />
              {isConnected ? 'CONNECTAT' : 'CONNECTAR'}
              
              {!isConnected && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
              )}
            </button>
          </div>

          {/* ESTADÍSTIQUES */}
          <div className="flex items-center justify-center gap-8 md:gap-16 w-full max-w-md mx-auto py-6 border-t border-b border-white/10 bg-black/40 backdrop-blur-sm rounded-[20px]">
            <div className="flex flex-col items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
              <span className="text-3xl font-bold text-white group-hover:text-[#F97316]">{profileData.stats.followers}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Seguidors</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
              <span className="text-3xl font-bold text-white group-hover:text-[#F97316]">{profileData.stats.following}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Seguint</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
              <span className="text-3xl font-bold text-white group-hover:text-[#F97316]">{profileData.stats.posts}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Històries</span>
            </div>
          </div>

        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="w-full max-w-5xl mx-auto px-4 mt-8">
        
        {/* TABS */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#111] p-1.5 rounded-full inline-flex border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 font-condensed tracking-wide ${
                activeTab === 'posts' 
                  ? 'bg-white text-black shadow-lg scale-105' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid size={18} />
              MUR
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 font-condensed tracking-wide ${
                activeTab === 'media' 
                  ? 'bg-white text-black shadow-lg scale-105' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart size={18} />
              BATEGATS
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {activeTab === 'posts' && userPosts.map((post) => (
            <div 
              key={post.id} 
              className="group relative aspect-square bg-[#111] rounded-[24px] overflow-hidden border border-white/5 cursor-pointer hover:border-[#F97316]/50 transition-all duration-300 shadow-lg"
            >
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white font-bold">
                  <Heart size={20} className="fill-white" /> 124
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'media' && (
             <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-[28px] bg-white/5">
               <Heart size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-condensed text-xl font-bold">Encara no hi ha bategats guardats.</p>
               <p className="text-sm mt-2 opacity-60">Connecta amb el poble per omplir el rebost.</p>
             </div>
          )}
        </div>

      </div>

      {/* --- FOOTER --- */}
      <div className="w-full text-center pb-8 pt-8 text-gray-700 text-xs font-condensed tracking-widest uppercase border-t border-white/5 mt-10">
        Sóc de Poble © 2026 • Sobirania Digital
      </div>

    </div>
  );
};

export default Profile;
