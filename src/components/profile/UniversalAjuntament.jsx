import React, { useState, useMemo } from 'react';
import { MapPin, BadgeCheck, Settings, Users, Grid, ArrowLeft, MessageCircle, Share2, Plus, Download, Contact, Info, FileText, Square, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedFeedData } from '../../hooks/useUnifiedFeedData';
import Feed from '../features/Feed';
import { useViewMode } from '../../hooks/useViewMode';
import ContentWithShortcodes from '../core/ContentWithShortcodes';
import { useModal } from '../../app/context/ModalContext';

export default function UniversalAjuntament({ entity, isOwner, onSettingsClick }) {
  const navigate = useNavigate();
  const { openTranslationModal } = useModal();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [imgError, setImgError] = useState(false);
  const { viewMode, setViewMode } = useViewMode('entity_profile_view_mode', 'grid');

  const profile = entity?.profile || {};
  const state = entity?.state || {};
  const traits = entity?.traits || {};
  const type = entity?.type || 'persona';

  const { posts: allPosts } = useUnifiedFeedData({ activeTown: 'global' });
  const userPosts = useMemo(() => {
    if (!allPosts || !entity?.id) return [];
    return allPosts.filter(p => {
      const matchId = idToMatch => String(p.author_id) === String(idToMatch) || String(p.author_user_id) === String(idToMatch) || String(p.author_entity_id) === String(idToMatch) || p.author?.id && String(p.author.id) === String(idToMatch);
      const isDirectMatch = matchId(entity.id) || entity.raw_town_id && matchId(entity.raw_town_id);
      const isNameMatch = entity.profile?.displayName && p.author_name === entity.profile.displayName;
      const isAjuntamentTypeMatch = p.type === 'ajuntament' && entity.profile?.displayName && p.town_name === entity.profile.displayName.replace('Ajuntament de ', '');
      const normalizeStr = s => (s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const isTownMatch = entity.is_town && entity.town_name && p.town_name && (normalizeStr(p.town_name) === normalizeStr(entity.town_name) || normalizeStr(p.town_name).includes(normalizeStr(entity.town_name)) || normalizeStr(entity.town_name).includes(normalizeStr(p.town_name)));
      const isGlobalPinned = p.is_pinned === true;
      return isDirectMatch || isNameMatch || isAjuntamentTypeMatch || isTownMatch || isGlobalPinned;
    });
  }, [allPosts, entity]);
  
  const displayPosts = useMemo(() => {
    if (!searchTerm) return userPosts;
    const lowerSearch = searchTerm.toLowerCase();
    return userPosts.filter(p => p.title?.toLowerCase().includes(lowerSearch) || p.content?.toLowerCase().includes(lowerSearch) || p.excerpt?.toLowerCase().includes(lowerSearch));
  }, [userPosts, searchTerm]);

  const rawBio = profile.bio || "Aquesta identitat encara no ha escrit la seua biografia en la xarxa local.";
  const bioParts = rawBio.split('[TABS_START]');
  const bioIntro = bioParts[0].trim();
  const bioDocument = bioParts.length > 1 ? '[TABS_START]\n' + bioParts.slice(1).join('[TABS_START]') : null;

  return (
    <div className="bg-white min-h-screen pb-20">
        <div className="sticky top-0 z-50 w-full overflow-hidden shadow-sm bg-[#4F46E5] text-white">
            <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center justify-center h-11 w-11 rounded-xl hover:bg-white/20 active:scale-95 transition-colors shrink-0" aria-label="Tornar arrere">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                
                <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth">
                    <button className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-colors font-bold uppercase text-sm shrink-0" aria-label="Traduir Pàgina" onClick={() => openTranslationModal({ postId: entity?.id, title: profile?.displayName })}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Google Translate" className="w-5 h-5 object-contain brightness-110" />
                        <span className="hidden xl:inline tracking-wider">Traduir</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 h-11 px-3 hover:bg-white/20 rounded-xl active:scale-95 font-bold uppercase text-sm shrink-0" aria-label="Comentar" onClick={() => {
                      const safeHandle = profile.handle?.replace('@', '') || profile.username || 'socdepoble';
                      navigate(`/chats/${safeHandle}`);
                    }}>
                        <MessageCircle size={20} />
                        <span className="hidden xl:inline tracking-wider">Comentar</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 h-11 px-3 hover:bg-white/20 rounded-xl active:scale-95 font-bold uppercase text-sm shrink-0" aria-label="Compartir Perfil" onClick={() => {
                      if (navigator.share) navigator.share({ title: profile.displayName || 'Sóc de Poble', url: window.location.href });
                    }}>
                        <Share2 size={20} />
                        <span className="hidden xl:inline tracking-wider">Compartir</span>
                    </button>

                    {!isOwner && <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 h-11 rounded-full font-bold shadow-sm transition-colors uppercase text-sm" onClick={() => navigate('/connectar')}>
                        <Plus size={18} strokeWidth={3} />
                        Connectar
                    </button>}
                </div>
            </div>
        </div>

        <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gray-100">
          {profile.bannerUrl && !imgError && <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />}
          <div className="absolute -bottom-4 right-6 flex justify-end items-end z-10">
            {isOwner && (
              <button onClick={onSettingsClick} className="bg-white text-gray-900 border border-gray-200 px-4 py-2 text-sm font-bold flex items-center rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                <Settings size={18} className="mr-2" /> Configurar Identitat
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div className="flex flex-row items-center gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-white shadow-sm shrink-0">
                    {profile.avatarUrl ? (
                      <div className={`w-full h-full flex items-center justify-center rounded-full overflow-hidden ${profile.role === 'ajuntament' ? 'bg-white p-2' : ''}`}>
                        <img src={profile.avatarUrl} alt={profile.displayName || "Avatar"} className={profile.role === 'ajuntament' ? 'object-contain' : 'object-cover w-full h-full'} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-3xl font-black text-gray-400 rounded-full">
                        {(profile.displayName || "NN").substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-2 tracking-tight m-0 leading-none">
                        {profile.displayName || 'Entitat Desconeguda'} 
                        {state.isVerified && <BadgeCheck className="text-blue-500 shrink-0" size={24} />}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                          <p className="text-orange-600 font-bold text-lg m-0 leading-none">
                            {profile.handle || '@identitat_p2p'}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
          
          {profile.location && (
            <p className='text-gray-500 flex items-center text-sm font-semibold mb-4 mt-2'>
              <MapPin size={16} className="mr-1" /> {profile.location}
            </p>
          )}

          {rawBio && (rawBio.includes("demostració tècnica") || rawBio.includes("pàgina de prova")) ? (
            <div className="my-7 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-start gap-3 max-w-4xl">
               <div className="shrink-0 bg-orange-500 text-white p-2 rounded-lg shadow-sm mt-1 sm:mt-0">
                   <Info size={20} strokeWidth={2.5} />
               </div>
               <div>
                   <h3 className="text-base font-black text-orange-600 mb-0.5 uppercase tracking-tight m-0">Pàgina de Demostració / Alpha</h3>
                   <p className="text-sm text-gray-800 font-medium leading-snug m-0">
                     {bioIntro}
                   </p>
               </div>
            </div>
          ) : (
            <div className="text-base leading-relaxed text-gray-900 max-w-2xl mb-6 mt-4">
              {bioIntro.split('\n\n').map((paragraph, idx) => (
                <p key={`bio-${idx}`} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-b border-gray-200 mb-6 w-full mt-4">
            <div className="flex gap-2">
              <TabButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<Grid size={18} />} label="Activitat" />
              {bioDocument && <TabButton active={activeTab === 'document'} onClick={() => setActiveTab('document')} icon={<FileText size={18} />} label="Document" />}
              <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Users size={18} />} label="Connexions" />
              <TabButton active={activeTab === 'vcard'} onClick={() => setActiveTab('vcard')} icon={<Contact size={18} />} label="vCard" />
            </div>
            
            <div className="flex gap-1 pr-2 pb-2 shrink-0">
                <button onClick={() => setViewMode('single')} className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'single' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`} title="Vista Completa (1 Columna)">
                    <Square size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`} title="Vista Graella (Columnes)">
                    <LayoutGrid size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`} title="Vista Llista (Compacta)">
                    <List size={18} strokeWidth={2.5} />
                </button>
            </div>
          </div>

          <div className="min-h-[40vh] pb-10">
             {activeTab === 'feed' && (
                displayPosts.length > 0 ? (
                  <Feed hideHeader={true} customPosts={displayPosts} externalViewMode={viewMode} />
                ) : (
                  <div className='text-gray-500 text-sm text-center py-10 bg-gray-50 rounded-2xl border border-gray-200 mt-4'>
                    {searchTerm ? "No s'han trobat publicacions amb aquesta cerca." : "Sense activitat recent a la malla local per a esta identitat."}
                  </div>
                )
             )}
             {activeTab === 'document' && bioDocument && (
                <ContentWithShortcodes content={bioDocument} hideTabs={true} />
             )}
             {activeTab === 'info' && (
                <div className="space-y-6">
                  <ConnectionsTab />
                  <TraitsViewer traits={traits} type={type} />
                </div>
             )}
             {activeTab === 'vcard' && <VCardTab entity={entity} profile={profile} />}
          </div>
        </div>
      </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} aria-label={label} title={label} className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 font-bold text-sm tracking-wide transition-all rounded-t-2xl whitespace-nowrap flex-1 lg:flex-none ${active ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
    {icon} <span className="hidden lg:inline-block">{label}</span>
  </button>
);

const VCardTab = ({ entity, profile }) => {
  const handleDownload = () => {
    const contact = {
      fn: profile.displayName || 'Entitat Desconeguda',
      note: profile.bio || 'Dades extretes d\'Antigravity.',
      org_company: profile.displayName || 'Entitat'
    };
    const vCardText = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${contact.fn}`, `ORG:${contact.org_company}`, `NOTE:${contact.note}`];
    if (entity?.contact_phone) vCardText.push(`TEL;TYPE=CELL:${entity.contact_country_code || '+34'}${entity.contact_phone}`);
    if (entity?.contact_email) vCardText.push(`EMAIL;TYPE=INTERNET:${entity.contact_email}`);
    vCardText.push('END:VCARD');
    const blob = new Blob([vCardText.join('\\n')], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contact.fn.replace(/\\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 leading-none m-0">
          <Contact size={24} className="text-orange-500" />
          Dades de Contacte i Agenda
        </h3>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <span className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Nom i Organització</span>
            <span className="text-lg font-bold text-gray-900">{profile.displayName || 'Entitat Desconeguda'}</span>
          </div>
          {entity?.contact_email && (
            <div className="flex flex-col gap-1">
              <span className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Correu Electrònic</span>
              <span className="text-base font-medium text-gray-900">{entity.contact_email}</span>
            </div>
          )}
          {entity?.contact_phone && (
            <div className="flex flex-col gap-1">
              <span className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Telèfon Directe</span>
              <span className="text-base font-medium text-gray-900">{entity.contact_country_code || '+34'} {entity.contact_phone}</span>
            </div>
          )}
          {profile?.location && (
            <div className="flex flex-col gap-1">
              <span className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Adreça o Ubicació</span>
              <span className="text-base font-medium text-gray-900">{profile.location}</span>
            </div>
          )}
          {profile?.bio && (
            <div className="flex flex-col gap-1">
              <span className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Nota Administrativa</span>
              <span className='text-sm text-gray-500 leading-relaxed'>{profile.bio}</span>
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
          <button onClick={handleDownload} className="flex items-center gap-2 px-6 h-12 rounded-xl font-black bg-white text-gray-900 border border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-colors">
            <Download size={20} /> Descarregar vCard
          </button>
        </div>
      </div>
  );
};

const ConnectionsTab = () => (
    <div className="bg-white p-6 rounded-3xl border border-gray-200">
        <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 m-0 leading-none">
            <Users size={20} className="text-orange-500" />
            Xarxa de Connexions
          </h3>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shrink-0">
            <img src="https://ui-avatars.com/api/?name=Javi+Llinares&background=FF6D23&color=fff&bold=true&size=128" alt="Javi Llinares" className="w-full h-full object-cover" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h4 className="font-black text-gray-900 text-[17px] mb-0.5 m-0">Javi Llinares</h4>
            <p className='text-xs text-gray-500 font-bold uppercase tracking-wider m-0'>Connectat · Membre de la Malla</p>
          </div>
          <span className="bg-orange-500 text-white text-xs uppercase font-black px-3 py-1.5 rounded-full tracking-wider mt-2 sm:mt-0">
            Autoritzat
          </span>
        </div>
    </div>
);

const TraitsViewer = ({ traits, type }) => {
  if (!traits || Object.keys(traits).length === 0) {
    return <div className='bg-white p-6 rounded-3xl border border-gray-200 text-center text-sm font-bold text-gray-500'>No s'han trobat trets genotípics.</div>;
  }
  
  const typeConfig = {
    persona: 'text-blue-600 bg-blue-50 border-blue-200',
    empresa: 'text-orange-600 bg-orange-50 border-orange-200',
    institucion: 'text-purple-600 bg-purple-50 border-purple-200',
    default: 'text-gray-600 bg-gray-50 border-gray-200'
  };
  const theme = typeConfig[type] || typeConfig.default;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 border-b border-gray-200 pb-4">
          <span className={`uppercase font-black text-xs tracking-wider px-3 py-1 rounded-full border ${theme}`}>
            Genotip: {type}
          </span>
          <h3 className="font-bold text-gray-900 text-lg m-0">Trets Estructurals</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(traits).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className='text-[11px] uppercase tracking-wider text-gray-500 font-black block mb-1'>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="text-sm font-bold text-gray-900 break-words">
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {value.length > 0 ? value.map((v, i) => (
                      <span key={i} className="bg-white border border-gray-200 px-2 py-1 rounded text-xs">
                        {typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}
                      </span>
                    )) : <span className="opacity-50 italic">Cap valor definit</span>}
                  </div>
                ) : typeof value === 'object' && value !== null ? (
                  <pre className="text-xs whitespace-pre-wrap font-mono mt-2 bg-white border border-gray-200 p-2 rounded-lg">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : value !== undefined && value !== null && value !== '' ? (
                  String(value)
                ) : <span className="opacity-50 italic">Pendent de definició</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};