import React, { useState, useMemo } from 'react';
import { MapPin, BadgeCheck, Settings, Users, Grid, ArrowLeft, MessageCircle, Share2, Plus, Download, Contact, Info, FileText, Square, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedFeedData } from '../../hooks/useUnifiedFeedData';
import Feed from '../features/Feed';
import { useViewMode } from '../../hooks/useViewMode';
import ContentWithShortcodes from '../core/ContentWithShortcodes';
import TownProposalsTab from './TownProposalsTab';
import { ImageIcon } from 'lucide-react';
import { useModal } from '../../app/context/ModalContext';
import { useTownProposals } from '../../hooks/useTownProposals';

export default function UniversalGentDePoble({ entity, isOwner, onSettingsClick }) {
  const navigate = useNavigate();
  const { openTranslationModal } = useModal();
  // entity es el snapshot JSON derivado del documento Y.js de esta identidad
  const [activeTab, setActiveTab] = useState('feed'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [imgError, setImgError] = useState(false);
  const { viewMode, setViewMode } = useViewMode('entity_profile_view_mode', 'grid');
  
  // Safe defaults en caso de que la entidad no esté completamente hidratada
  const profile = entity?.profile || {};
  const state = entity?.state || {};
  const traits = entity?.traits || {};
  const type = entity?.type || 'persona';

  const { winners } = useTownProposals(entity?.raw_town_id || entity?.id);

  // Apply fractional winners or fallbacks
  const displayAvatar = winners.avatar?.image_url || profile.avatarUrl;
  const avatarAuthor = winners.avatar ? `Avatar per ${winners.avatar.author_name}` : 'Imatge per defecte';

  const displayCover = winners.cover?.image_url || profile.bannerUrl || profile.header_image_url || profile.cover_url;
  const coverAuthor = winners.cover ? `Portada per ${winners.cover.author_name}` : (displayCover?.includes('wikipedia') ? 'Imatge de Wikipedia' : 'Imatge per defecte');

  React.useEffect(() => {
    setImgError(false);
  }, [displayCover]);

  const displayLema = winners.lema?.contentObj?.text || "La veu de la nostra gent.";
  const lemaAuthor = winners.lema ? `Lema per ${winners.lema.author_name}` : null;

  const rawBio = winners.text?.contentObj?.text || profile.bio || "Aquesta identitat encara no ha escrit la seua biografia en la xarxa local.";
  const textAuthor = winners.text ? `Text per ${winners.text.author_name}` : (profile.bio ? 'Text extret de Wikipedia' : null);

  const bioParts = rawBio.split('[TABS_START]');
  const bioIntro = bioParts[0].trim();
  const bioDocument = bioParts.length > 1 ? '[TABS_START]\n' + bioParts.slice(1).join('[TABS_START]') : null;

  // Fetch unified posts to extract this entity's specific feed
  const { posts: allPosts } = useUnifiedFeedData({ activeTown: 'global' });
  const userPosts = useMemo(() => {
    if (!allPosts || !entity?.id) return [];
    return allPosts.filter(p => {
      const matchId = (idToMatch) => 
        String(p.author_id) === String(idToMatch) || 
        String(p.author_user_id) === String(idToMatch) || 
        String(p.author_entity_id) === String(idToMatch) ||
        (p.author?.id && String(p.author.id) === String(idToMatch));
        
      const isDirectMatch = matchId(entity.id) || (entity.raw_town_id && matchId(entity.raw_town_id));
      
      const isNameMatch = entity.profile?.displayName && p.author_name === entity.profile.displayName;
      const isAjuntamentTypeMatch = p.type === 'ajuntament' && entity.profile?.displayName && p.town_name === entity.profile.displayName.replace('Ajuntament de ', '');
      const normalizeStr = (s) => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const isTownMatch = entity.is_town && entity.town_name && p.town_name && 
        (normalizeStr(p.town_name) === normalizeStr(entity.town_name) || 
         normalizeStr(p.town_name).includes(normalizeStr(entity.town_name)) ||
         normalizeStr(entity.town_name).includes(normalizeStr(p.town_name)));
         
      const isGlobalPinned = p.is_pinned === true;
      
      return isDirectMatch || isNameMatch || isAjuntamentTypeMatch || isTownMatch || isGlobalPinned;
    });

  }, [allPosts, entity]);

  const displayPosts = useMemo(() => {
      if (!searchTerm) return userPosts;
      const lowerSearch = searchTerm.toLowerCase();
      return userPosts.filter(p => 
          p.title?.toLowerCase().includes(lowerSearch) || 
          p.content?.toLowerCase().includes(lowerSearch) ||
          p.excerpt?.toLowerCase().includes(lowerSearch)
      );
  }, [userPosts, searchTerm]);

  // Process bio for TABS_START - Removed from here as it's processed above

  return (
    <div className="atom-root bg-theme-base min-h-screen pb-20">
      
      {/* SECONDARY ACTION BAR (BLAU ESTANDARD) - FIJADA A DALT */}
      <div className="sticky top-0 z-[var(--z-sticky,200)] w-full max-w-full overflow-hidden shadow-lg bg-[#4F46E5] text-white transition-all shrink-0">
          <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto overflow-hidden">
              
              {/* Esquerra: Tornar */}
              <div className="flex items-center justify-start gap-1 shrink-0">
                  <button 
                      onClick={() = aria-label="Compartir"> navigate(-1)} 
                      className="flex items-center justify-center min-h-[44px] w-[44px] rounded-xl hover:bg-white/20 active:scale-95 transition-colors touch-manipulation shrink-0"
                      aria-label="Tornar arrere"
                  >
                      <ArrowLeft size={20} strokeWidth={2.5} />
                  </button>
              </div>
              
              {/* Dreta: Traduir, Comentar, Compartir, Connectar */}
              <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth">
                  <button 
                      className="flex items-center justify-center gap-1.5 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0"
                      aria-label="Traduir Pàgina"
                      onClick={() => openTranslationModal({ postId: entity?.id, title: entity?.profile?.displayName })}
                  >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Google Translate" className="w-[20px] h-[20px] object-contain drop-shadow-sm brightness-110" />
                      <span className="hidden xl:inline tracking-wider">Traduir</span>
                  </button>

                  <button 
                      className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" 
                      aria-label="Comentar"
                      onClick={() => {
                          const safeHandle = profile.handle?.replace('@', '') || profile.username || 'socdepoble';
                          navigate(`/chats/${safeHandle}`);
                      }}
                  >
                      <MessageCircle size={20} /><span className="hidden xl:inline tracking-wider">Comentar</span>
                  </button>

                  <button 
                      className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" 
                      aria-label="Compartir Perfil"
                      onClick={() => { if(navigator.share) navigator.share({ title: profile.displayName || 'Sóc de Poble', url: window.location.href }) }}
                  >
                      <Share2 size={20} /><span className="hidden xl:inline tracking-wider">Compartir</span>
                  </button>

                  {!isOwner && (
                      <button 
                          className="btn-action-primary"
                          onClick={() => navigate('/connectar')}
                      >
                          <Plus size={18} strokeWidth={3} />
                          <span>Connectar</span>
                      </button>
                  )}
              </div>
          </div>
      </div>

      {/* HEADER SOBERANO (Sense avatar flotant) */}
      <div role="region" aria-label="Capçalera de Secció" className="relative w-full h-48 sm:h-64 md:h-80 bg-black/10 dark:bg-white/5">
        {isOwner && (
            <div className="absolute top-4 right-4 z-[201]">
                <button 
                  onClick={onSettingsClick}
                  className="btn-tactile bg-theme-panel text-theme-text border border-border-master px-4 py-2 text-sm font-bold flex items-center rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Settings size={18} className="mr-2" />
                  Configurar Identitat
                </button>
            </div>
        )}
        {displayCover ? (
          <img 
            src={displayCover} 
            alt="Banner" 
            className="w-full h-full object-cover" 
            loading="lazy" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-theme-panel to-theme-base opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-theme-base opacity-90" />
        <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white/80 font-medium z-10">
           {coverAuthor}
        </div>
      </div>

      {/* METADATOS BÁSICOS & AVATAR INLINE */}
      <div className="mt-6 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="flex flex-row items-center gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-theme-panel bg-theme-panel shadow-sm glass-rural shrink-0 group">
                  {displayAvatar ? (
                    <div className={`w-full h-full flex items-center justify-center rounded-full overflow-hidden ${displayAvatar.toLowerCase().includes('logo') ? 'bg-white p-1.5 sm:p-2' : ''}`}>
                      <img src={displayAvatar} alt={profile.displayName || "Avatar"} className={`w-full h-full ${displayAvatar.toLowerCase().includes('logo') ? 'object-contain' : 'object-cover'}`} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/10 dark:bg-white/10 text-3xl font-black text-theme-text opacity-50 rounded-full">
                      {(profile.displayName || "NN").substring(0,2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-theme-base shadow-sm border border-black/5 dark:border-white/5 rounded px-1.5 py-0.5 text-[8px] font-bold text-[var(--text-muted)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {avatarAuthor}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl sm:text-4xl font-black text-theme-text flex items-center gap-2 tracking-tight">
                      {profile.displayName || 'Entitat Desconeguda'} 
                      {state.isVerified && <BadgeCheck className="text-theme-accent-secondary shrink-0" size={24} />}
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-theme-accent-primary font-bold text-lg mb-0">
                          {displayLema}
                        </p>
                        {lemaAuthor && <span className="bg-black/5 dark:bg-white/5 text-[10px] px-1.5 py-0.5 rounded text-[var(--text-muted)]">{lemaAuthor}</span>}
                    </div>
                </div>
            </div>
            {/* Si hi ha botons addicionals, van ací */}
        </div>
        
        {profile.location && (
          <p className="text-[var(--text-muted)] flex items-center text-sm font-semibold mb-4 mt-2">
            <MapPin size={16} className="mr-1" /> {profile.location}
          </p>
        )}
        {/* Les dades de contacte i la descàrrega de vCard s'han mogut a la pestanya 'vCard' */}

        {rawBio && (rawBio.includes("demostració tècnica") || rawBio.includes("pàgina de prova")) ? (
          <div className="my-7 bg-[#FF6D23]/10 dark:bg-[#FF6D23]/15 border border-[#FF6D23]/40 dark:border-[#FF6D23]/60 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-center sm:items-start gap-3 shadow-sm relative overflow-hidden max-w-4xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D23] opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
             <div className="shrink-0 bg-[#FF6D23] text-white p-2 rounded-lg shadow-sm z-10 animate-pulse-slow mt-1 sm:mt-0">
                 <Info size={20} strokeWidth={2.5} />
             </div>
             <div className="flex-1 z-10">
                 <div className="flex items-center gap-2">
                    <h3 className="text-[15px] sm:text-base font-black text-[#FF6D23] mb-0.5 uppercase tracking-tight text-center sm:text-left">Pàgina de Demostració / Alpha</h3>
                    {textAuthor && <span className="bg-[#FF6D23]/20 text-[#FF6D23] text-[10px] px-1.5 py-0.5 rounded font-bold">{textAuthor}</span>}
                 </div>
                 <p className="text-[13px] sm:text-sm text-theme-text font-medium leading-snug opacity-90 text-center sm:text-left mb-0 pb-0">
                   {bioIntro}
                 </p>
             </div>
          </div>
        ) : (
          <div className="text-base leading-relaxed text-theme-text max-w-2xl mb-6 mt-4 app-cms-content prose prose-lg dark:prose-invert">
            {bioIntro.split('\n\n').map((paragraph, idx) => (
                <p 
                    key={`bio-${idx}`} 
                    className="whitespace-pre-line last:mb-0"
                    dangerouslySetInnerHTML={{ 
                        __html: paragraph
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }}
                />
            ))}
          </div>
        )}

        {/* NAVEGACIÓN TÁCTIL (TABS) */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 mb-6 overflow-x-auto no-scrollbar scroll-smooth w-full mt-4">
          <div className="flex gap-1 sm:gap-2">
            <TabButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Grid size={18} />} label="Activitat" />
            {bioDocument && (
              <TabButton active={activeTab === 'document'} onClick={() => setActiveTab('document')} icon={<FileText size={18} />} label="Document" />
            )}
            <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Users size={18} />} label="Connexions" />
            <TabButton active={activeTab === 'identitat'} onClick={() => setActiveTab('identitat')} icon={<ImageIcon size={18} />} label="Identitat" />
            <TabButton active={activeTab === 'vcard'} onClick={() => setActiveTab('vcard')} icon={<Contact size={18} />} label="vCard" />
          </div>
          
          {/* VIEW MODE SWITCH */}
          <div className="flex gap-1 pr-2 pb-2 shrink-0">
              <button
                  onClick={() => setViewMode('single')}
                  className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'single' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title="Vista Completa (1 Columna)"
              >
                  <Square size={18} strokeWidth={2.5} />
              </button>
              <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title="Vista Graella (Columnes)"
              >
                  <LayoutGrid size={18} strokeWidth={2.5} />
              </button>
              <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title="Vista Llista (Compacta)"
              >
                  <List size={18} strokeWidth={2.5} />
              </button>
          </div>
        </div>

        {/* VIEWPORT CONTENIDO (Condicional según tab) */}
        <div className="stable-scroll min-h-[40vh] pb-10">
           {activeTab === 'feed' && (
             <div className="w-full">
               {displayPosts.length > 0 ? (
                 <div className="min-h-[500px]">
                   <Feed hideHeader={true} customPosts={displayPosts} externalViewMode={viewMode} />
                 </div>
               ) : (
                 <div className="text-[var(--text-muted)] text-sm text-center py-10 glass-rural rounded-2xl mx-2 mt-4">
                   {searchTerm ? "No s'han trobat publicacions amb aquesta cerca." : "Sesión P2P: Sense activitat recent a la malla local per a esta identitat."}
                 </div>
               )}
             </div>
           )}
           {activeTab === 'document' && bioDocument && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <ContentWithShortcodes content={bioDocument} hideTabs={true} />
             </div>
           )}
           {activeTab === 'info' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <ConnectionsTab />
               <TraitsViewer traits={traits} type={type} />
             </div>
           )}
           {activeTab === 'identitat' && (
             <div className="flex flex-col gap-2">
               <TownProposalsTab entity={entity} />
               <div className="mx-4 mb-6 text-center text-xs text-[var(--text-muted)] italic">
                  Text i imatges inicials de mostra extrets de Wikipedia.
               </div>
             </div>
           )}
           {activeTab === 'vcard' && <VCardTab entity={entity} profile={profile} />}
        </div>
      </div>
    </div>
  );
}

// Componente helper para tabs táctiles GEM Modern
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 font-bold text-sm tracking-wide transition-all rounded-t-2xl whitespace-nowrap flex-1 lg:flex-none
      ${active ? 'text-theme-accent-primary bg-[var(--theme-accent-primary)]/10 shadow-[inset_0_-3px_0_var(--theme-accent-primary)]' : 'text-[var(--text-muted)] hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5'}`}
  >
    {icon} <span className="hidden lg:inline-block">{label}</span>
  </button>
);

const VCardTab = ({ entity, profile }) => {
  const handleDownload = () => {
    const contact = {
      fn: profile.displayName || 'Entitat Desconeguda',
      note: profile.bio || 'Dades extretes d\'Antigravity.',
      org_company: profile.displayName || 'Entitat',
    };
    
    // Generar text vCard simple
    const vCardText = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.fn}`,
      `ORG:${contact.org_company}`,
      `NOTE:${contact.note}`
    ];
    
    if (entity?.contact_phone) {
      vCardText.push(`TEL;TYPE=CELL:${entity.contact_country_code || '+34'}${entity.contact_phone}`);
    }
    if (entity?.contact_email) {
      vCardText.push(`EMAIL;TYPE=INTERNET:${entity.contact_email}`);
    }
    
    vCardText.push('END:VCARD');
    
    const blob = new Blob([vCardText.join('\\n')], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${contact.fn.replace(/\\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-rural p-6 rounded-3xl mx-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-xl font-black text-theme-text mb-6 flex items-center gap-2 leading-none">
        <Contact size={24} className="text-theme-accent-primary" />
        Dades de Contacte i Agenda
      </h3>
      
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Nom i Organització</span>
          <span className="text-lg font-bold text-theme-text">{profile.displayName || 'Entitat Desconeguda'}</span>
        </div>

        {entity?.contact_email && (
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Correu Electrònic</span>
            <span className="text-base font-medium text-theme-text">{entity.contact_email}</span>
          </div>
        )}

        {entity?.contact_phone && (
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Telèfon Directe</span>
            <span className="text-base font-medium text-theme-text">{entity.contact_country_code || '+34'} {entity.contact_phone}</span>
          </div>
        )}

        {profile?.location && (
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Adreça o Ubicació</span>
            <span className="text-base font-medium text-theme-text">{profile.location}</span>
          </div>
        )}

        {profile?.bio && (
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Nota Administrativa</span>
            <span className="text-sm text-[var(--text-muted)] leading-relaxed">{profile.bio}</span>
          </div>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-border-master flex justify-end">
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl font-black text-base transition-all bg-theme-panel text-theme-text shadow-lg hover:scale-105 active:scale-95 border border-border-master hover:border-theme-accent-primary hover:text-theme-accent-primary"
        >
          <Download size={20} />
          <span>Descarregar vCard</span>
        </button>
      </div>
    </div>
  );
};

// Connexions render
const ConnectionsTab = () => {
  return (
    <div className="glass-rural p-6 rounded-3xl mx-2 shadow-sm border border-black/5 dark:border-white/5 mb-6">
      <div className="flex items-center gap-3 mb-6 border-b border-border-master pb-4">
        <h3 className="font-bold text-theme-text text-lg flex items-center gap-2 leading-none">
          <Users size={20} className="text-theme-accent-primary" />
          Xarxa de Connexions
        </h3>
      </div>
      
      <div className="bg-[#FF6D23]/10 border border-[#FF6D23]/20 dark:border-[#FF6D23]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF6D23] opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FF6D23] shrink-0 shadow-sm relative z-10">
          <img src="https://ui-avatars.com/api/?name=Javi+Llinares&background=FF6D23&color=fff&bold=true&size=128" alt="Javi Llinares" className="w-full h-full object-cover" />
        </div>
        <div className="text-center sm:text-left flex-1 relative z-10">
          <h4 className="font-black text-theme-text text-[17px] mb-0.5">Javi Llinares</h4>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-black uppercase tracking-wider">Connectat · Membre de la Malla</p>
        </div>
        <div className="shrink-0 mt-2 sm:mt-0 relative z-10">
          <span className="bg-[#FF6D23] text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-wider shadow-md">
            Autoritzat
          </span>
        </div>
      </div>
    </div>
  );
};

// Mapeo polimórfico de los traits
const TraitsViewer = ({ traits, type }) => {
  if (!traits || Object.keys(traits).length === 0) {
    return (
      <div className="glass-rural p-6 rounded-3xl mx-2 text-center text-sm font-bold text-[var(--text-muted)]">
        No s'han trobat trets genotípics per aquesta identitat.
      </div>
    );
  }

  const typeConfig = {
    persona: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
    empresa: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
    institucion: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
    default: { color: 'text-gray-500', bg: 'bg-gray-500/10' }
  };
  
  const theme = typeConfig[type] || typeConfig.default;

  return (
    <div className="glass-rural p-6 rounded-3xl mx-2 shadow-sm border border-black/5 dark:border-white/5">
      <div className="flex items-center gap-3 mb-6 border-b border-border-master pb-4">
        <span className={`uppercase font-black text-xs tracking-wider px-3 py-1 rounded-full ${theme.bg} ${theme.color}`}>
          Genotip: {type}
        </span>
        <h3 className="font-bold text-theme-text text-lg">Trets Estructurals</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.entries(traits).map(([key, value]) => (
          <div key={key} className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-black block mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-sm font-bold text-theme-text break-words">
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {value.length > 0 ? value.map((v, i) => (
                    <span key={i} className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md text-xs">
                      {typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}
                    </span>
                  )) : <span className="opacity-50 italic">Cap valor definit</span>}
                </div>
              ) : typeof value === 'object' && value !== null ? (
                <pre className="text-[10px] whitespace-pre-wrap font-mono mt-2 bg-black/5 dark:bg-white/5 p-2 rounded-lg overflow-x-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : value !== undefined && value !== null && value !== '' ? (
                String(value)
              ) : (
                <span className="opacity-50 italic">Pendent de definició</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
