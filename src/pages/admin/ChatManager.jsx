import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Bell, Clock, Lock, Phone, Users, Plus, LogOut, Download, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import { useDesign } from '../../app/context/DesignContext';
import { chatService } from '../../core/services/chatService';

// Components
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled,
  isDayMode
}) => <button onClick={onClick} disabled={disabled} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[28px] transition-all disabled:opacity-50 border shadow-sm w-[110px] h-[110px]
        ${isDayMode ? 'bg-white text-gray-800 border-gray-100 hover:bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-[#1F2937] text-white border-white/5 hover:bg-[#374151]'}`}>
        {Icon && <Icon size={28} className={disabled ? 'text-gray-400 dark:text-gray-500' : 'text-[#FF6D00]'} />}
        <span className="text-xs font-black uppercase tracking-wider text-center leading-tight mt-1">{label}</span>
    </button>;
const SettingRow = ({
  icon: Icon,
  title,
  description,
  rightElement,
  onClick,
  isRed,
  isDayMode
}) => <div onClick={onClick} className={`flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-transform active:scale-[0.98] cursor-pointer rounded-[24px] mx-4 mb-3 
        ${isDayMode ? 'bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)]' : 'bg-theme-panel border border-white/5 shadow-sm'}
        ${isRed ? 'text-red-500' : isDayMode ? 'text-gray-800' : 'text-white'}`}>
        {Icon && <div className={`p-2.5 rounded-full ${isRed ? 'bg-red-500/10 text-red-500' : isDayMode ? 'bg-[#FF6D00]/10 text-[#FF6D00]' : 'bg-[#FF6D00]/20 text-[#FF6D00]'}`}>
                <Icon size={22} className="shrink-0" />
            </div>}
        <div className="flex-1">
            <h3 className="font-bold text-[15px]">{title}</h3>
            {description && <p className={`text-[12px] font-medium leading-tight block mt-0.5 ${isDayMode ? 'text-gray-500' : 'text-gray-400'}`}>{description}</p>}
        </div>
        {rightElement && <div>{rightElement}</div>}
    </div>;
const ChatManager = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    user,
    impersonatedProfile,
    activeEntityId
  } = useAuth();
  const {
    theme
  } = useDesign();
  const isDayMode = theme === 'light';

  // Check if the user is a forester/guest
  const isGuestUser = user?.isAnonymous;
  const [chatData, setChatData] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = activeEntityId || (impersonatedProfile ? impersonatedProfile.id : user?.id);
  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        // Si no hi ha ID, mock data for general testing or just fallback
        setChatData({
          name: 'Privat, coses de Javi',
          type: 'Grup',
          membersCount: 1,
          creationDate: '10/2/16',
          description: 'Creat per tu',
          avatar_url: null
        });
        setLoading(false);
        return;
      }
      try {
        // Fetch de la conversa real
        const chats = await chatService.getConversations(currentUserId);
        const currentChat = chats.find(c => c.id === id);
        if (currentChat) {
          const isP1Current = currentChat.participant_1_id === currentUserId;
          const otherInfo = currentChat.other_info || (isP1Current ? currentChat.p2_info : currentChat.p1_info);
          setChatData({
            name: otherInfo?.name || 'Foraster',
            type: 'Contacte',
            membersCount: 2,
            creationDate: new Date(currentChat.created_at).toLocaleDateString(),
            description: `Sense descripció`,
            avatar_url: otherInfo?.avatar_url
          });

          // Si volguérem carregar la galeria, aniria ací. Omplim amb mock pel disseny.
          setMediaFiles([1, 2, 3, 4, 5]);
        }
      } catch (err) {
        console.error("Error fetching chat details for manager", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, currentUserId]);
  if (loading) {
    return <div className={`flex-1 flex items-center justify-center ${isDayMode ? 'bg-[#FDF5E6] text-gray-400' : 'bg-theme-base text-gray-500'}`}>Carregant informació...</div>;
  }
  return <div className={`flex-1 flex flex-col max-h-screen overflow-hidden relative ${isDayMode ? 'bg-[#FDF5E6]' : 'bg-[#0a0a0a]'}`}>
            {/* Header */}
            <div role="region" aria-label="Capçalera de Secció" className="h-[60px] pl-2 pr-4 flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-[#FF6D00] shadow-md z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                        <ChevronLeft size={26} />
                    </button>
                    <span className="font-black text-lg text-white tracking-wide uppercase">Detalls del Xat</span>
                </div>
                <div className="flex gap-2"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                
                {isGuestUser && <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-3 flex items-center gap-3">
                        <AlertTriangle size={20} className="text-orange-500 shrink-0" />
                        <p className="text-[13px] text-orange-200/90 leading-snug">
                            <strong className="font-black text-orange-400">Mode Foraster.</strong> Estàs veient informació pública d'este xat. Per ajustar-lo necessites registre complet.
                        </p>
                    </div>}
                
                {/* Secció 1: Perfil Centralitzat AMB MARGES i RADIUS */}
                <div className={`flex flex-col items-center pt-10 pb-8 mx-4 mt-6 mb-8 rounded-[40px] shadow-sm border ${isDayMode ? 'bg-white border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)]' : 'bg-theme-panel border-white/5'}`}>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6D00]/20 to-[#FF6D00]/5 text-[#FF6D00] flex items-center justify-center border-[3px] border-[#FF6D00]/30 shadow-[0_0_40px_rgba(255,107,0,0.15)] mb-5 overflow-hidden relative group">
                        {chatData?.avatar_url ? <img src={chatData.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full scale-[1.5]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                             </div>}
                    </div>

                    <h1 className={`text-3xl font-black text-center tracking-tight mb-2 ${isDayMode ? 'text-gray-900' : 'text-white'}`}>{chatData?.name}</h1>
                    
                    <div className="flex items-center gap-1.5 justify-center bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                        <p className="text-green-600 dark:text-green-400 font-bold text-xs tracking-[0.2em] uppercase">
                            Connexió Xifrada
                        </p>
                    </div>

                    <div className="flex justify-center w-full gap-4 mt-2 px-4">
                        <ActionButton isDayMode={isDayMode} icon={Search} label="Cercar Fons" onClick={() => navigate(-1)} />
                        <ActionButton isDayMode={isDayMode} icon={Phone} label="Telefonar" disabled={true} />
                    </div>
                </div>

                {/* Seccions amb Marges (Targetes) */}
                
                {/* Secció 2: Descripció */}
                <SettingRow isDayMode={isDayMode} title="Informació del Grup" description={`Creat per tu, ${chatData?.creationDate}`} icon={null} />

                {/* Secció 3: Media */}
                <div className={`mx-4 mb-3 overflow-hidden rounded-[24px] border shadow-sm ${isDayMode ? 'bg-white border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)]' : 'bg-theme-panel border-white/5'}`}>
                    <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <h3 className={`text-[12px] font-black tracking-widest uppercase ${isDayMode ? 'text-[#FF6D00]' : 'text-[#FF6D00]'}`}>Arxius i documents</h3>
                        <div className="flex items-center gap-1 text-gray-400">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${isDayMode ? 'bg-orange-100 text-orange-600' : 'bg-white/10 text-white'}`}>{mediaFiles.length} elements</span>
                            <ChevronLeft size={16} className="rotate-180" />
                        </div>
                    </div>
                    {/* Media Grid Horizontal Scroll */}
                    <div className="px-5 pb-5 flex gap-3 overflow-x-auto custom-scrollbar">
                        <div className={`w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col
                        ${isDayMode ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#1F2937] border-white/10 text-gray-400'}`}>
                             <ImageIcon size={24} />
                             <span className="text-xs uppercase font-black tracking-wider">Imatge 1</span>
                        </div>
                         <div className={`w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col
                         ${isDayMode ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-orange-500/10 border-[#FF6D00]/30 text-[#FF6D00]'}`}>
                             <ImagePlay size={24} />
                             <span className="text-xs uppercase font-black tracking-wider">Vídeo 1</span>
                        </div>
                         <div className={`w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col
                        ${isDayMode ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#1F2937] border-white/10 text-gray-400'}`}>
                             <ImageIcon size={24} />
                             <span className="text-xs uppercase font-black tracking-wider">Imatge 2</span>
                        </div>
                         <div className={`w-[100px] h-[100px] flex-shrink-0 bg-transparent rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
                         ${isDayMode ? 'border-gray-300 text-gray-400 hover:bg-gray-50' : 'border-white/20 text-white/50 hover:bg-white/5'}`}>
                             <ChevronLeft className="rotate-180" size={24} />
                             <span className="text-xs uppercase font-bold tracking-wider">Veure tot</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                     <SettingRow isDayMode={isDayMode} icon={Download} title="Administra l'emmagatzematge" description="67,0 MB consumits locals al dispositiu." />
                </div>

                {/* Secció 4: Privacitat i Configuració */}
                <h2 className={`mx-6 mb-3 text-[11px] font-black tracking-widest uppercase ${isDayMode ? 'text-gray-400' : 'text-gray-500'}`}>Privacitat i Seguretat</h2>
                <SettingRow isDayMode={isDayMode} icon={Bell} title="Silenciar notificacions" rightElement={<div className={`w-11 h-6 rounded-full p-1 cursor-pointer flex items-center shadow-inner border ${isDayMode ? 'bg-gray-200 border-gray-300' : 'bg-[#1F2937] border-white/5'}`}>
                            <div className={`w-4 h-4 rounded-full shadow-sm ${isDayMode ? 'bg-white' : 'bg-gray-400'}`}></div>
                        </div>} />
                <SettingRow isDayMode={isDayMode} icon={Clock} title="Missatges temporals" description="Desactivat per defecte. Les espurnes romanen." />
                <SettingRow isDayMode={isDayMode} icon={Lock} title="Privacitat Segura" description="Els teus missatges i dades són privats i xifrats extrem a extrem. Estàs 100% segur al Mas." />

                 {/* Secció 5: Opcions de Xat Individual / Grup */}
                 <h2 className={`mx-6 mt-8 mb-3 text-[11px] font-black tracking-widest uppercase ${isDayMode ? 'text-gray-400' : 'text-gray-500'}`}>Membres del Xat</h2>
                 <SettingRow isDayMode={isDayMode} icon={Plus} title="Afegeix un participant" description="Crea un grup amb aquesta persona o agents IA." />
                 <SettingRow isDayMode={isDayMode} icon={Users} title="Visualitza Membres" description={`Hi ha ${chatData?.membersCount || 1} participant/s connectats.`} />

                 {/* Secció 6: Accions perilloses */}
                 <div className={`mt-8 mb-10 ${isGuestUser ? 'opacity-50 pointer-events-none' : ''}`}>
                    <SettingRow isDayMode={isDayMode} icon={AlertTriangle} title="Bloquejar participant" isRed />
                    <SettingRow isDayMode={isDayMode} icon={LogOut} title="Buidar tota la conversa" isRed />
                 </div>

            </div>

             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDayMode ? '#e5e7eb' : '#374151'}; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #FF6D00; }
            `}</style>
        </div>;
};
export default ChatManager;