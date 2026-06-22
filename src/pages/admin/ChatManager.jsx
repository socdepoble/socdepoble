import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Bell, Clock, Lock, Phone, Users, Plus, LogOut, Download, AlertTriangle, ChevronLeft, ImageIcon, ImagePlay } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import { chatService } from '../../core/services/chatService';

// Components
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled
}) => <button onClick={onClick} disabled={disabled} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[28px] transition-all disabled:opacity-50 border shadow-sm w-[110px] h-[110px] bg-white text-gray-800 border-gray-100 hover:bg-gray-50 shadow-sm`}>
        {Icon && <Icon size={28} className={disabled ? 'text-gray-400' : 'text-orange-500'} />}
        <span className="text-xs font-black uppercase tracking-wider text-center leading-tight mt-1">{label}</span>
    </button>;

const SettingRow = ({
  icon: Icon,
  title,
  description,
  rightElement,
  onClick,
  isRed
}) => <div onClick={onClick} className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-transform active:scale-[0.98] cursor-pointer rounded-[24px] mx-4 mb-3 bg-white border border-gray-100 shadow-sm ${isRed ? 'text-red-500' : 'text-gray-800'}`}>
        {Icon && <div className={`p-2.5 rounded-full ${isRed ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                <Icon size={22} className="shrink-0" />
            </div>}
        <div className="flex-1">
            <h3 className="font-bold text-[15px]">{title}</h3>
            {description && <p className={`text-[12px] font-medium leading-tight block mt-0.5 text-gray-500`}>{description}</p>}
        </div>
        {rightElement && <div>{rightElement}</div>}
    </div>;

const ChatManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, impersonatedProfile, activeEntityId } = useAuth();
  
  // Check if the user is a forester/guest
  const isGuestUser = user?.isAnonymous;
  const [chatData, setChatData] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = activeEntityId || (impersonatedProfile ? impersonatedProfile.id : user?.id);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
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
    return <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">Carregant informació...</div>;
  }

  return (
    <div className="flex-1 flex flex-col max-h-screen overflow-hidden relative bg-gray-50">
        <div role="region" aria-label="Capçalera de Secció" className="h-[60px] pl-2 pr-4 flex flex-shrink-0 items-center justify-between border-b border-orange-600 bg-orange-500 shadow-sm z-10 sticky top-0">
            <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-orange-600 text-white transition-colors">
                    <ChevronLeft size={26} />
                </button>
                <span className="font-black text-lg text-white tracking-wide uppercase m-0">Detalls del Xat</span>
            </div>
            <div className="flex gap-2"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
            {isGuestUser && (
              <div className="bg-orange-50 border-b border-orange-100 px-4 py-3 flex items-center gap-3">
                  <AlertTriangle size={20} className="text-orange-500 shrink-0" />
                  <p className="text-[13px] text-orange-800 leading-snug m-0">
                      <strong className="font-black text-orange-600">Mode Foraster.</strong> Estàs veient informació pública d'este xat. Per ajustar-lo necessites registre complet.
                  </p>
              </div>
            )}
            
            <div className="flex flex-col items-center pt-10 pb-8 mx-4 mt-6 mb-8 rounded-[40px] shadow-sm border bg-white border-gray-100">
                <div className="w-32 h-32 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center border-[3px] border-orange-100 mb-5 overflow-hidden relative group">
                    {chatData?.avatar_url ? (
                      <img src={chatData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full scale-[1.5]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                       </div>
                    )}
                </div>

                <h1 className="text-3xl font-black text-center tracking-tight mb-2 text-gray-900 m-0">{chatData?.name}</h1>
                
                <div className="flex items-center gap-1.5 justify-center bg-green-50 px-3 py-1 rounded-full border border-green-100 mb-6">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
                    <p className="text-green-600 font-bold text-xs tracking-[0.2em] uppercase m-0">
                        Connexió Xifrada
                    </p>
                </div>

                <div className="flex justify-center w-full gap-4 mt-2 px-4">
                    <ActionButton icon={Search} label="Cercar Fons" onClick={() => navigate(-1)} />
                    <ActionButton icon={Phone} label="Telefonar" disabled={true} />
                </div>
            </div>

            <SettingRow title="Informació del Grup" description={`Creat per tu, ${chatData?.creationDate}`} icon={null} />

            <div className="mx-4 mb-3 overflow-hidden rounded-[24px] border shadow-sm bg-white border-gray-100">
                <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="text-[12px] font-black tracking-widest uppercase text-orange-500 m-0">Arxius i documents</h3>
                    <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 m-0">{mediaFiles.length} elements</span>
                        <ChevronLeft size={16} className="rotate-180" />
                    </div>
                </div>
                <div className="px-5 pb-5 flex gap-3 overflow-x-auto custom-scrollbar">
                    <div className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col bg-gray-50 border-gray-200 text-gray-500">
                         <ImageIcon size={24} />
                         <span className="text-xs uppercase font-black tracking-wider m-0">Imatge 1</span>
                    </div>
                     <div className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col bg-orange-50 border-orange-200 text-orange-500">
                         <ImagePlay size={24} />
                         <span className="text-xs uppercase font-black tracking-wider m-0">Vídeo 1</span>
                    </div>
                     <div className="w-[100px] h-[100px] flex-shrink-0 rounded-2xl border flex items-center justify-center gap-2 flex-col bg-gray-50 border-gray-200 text-gray-500">
                         <ImageIcon size={24} />
                         <span className="text-xs uppercase font-black tracking-wider m-0">Imatge 2</span>
                    </div>
                     <div className="w-[100px] h-[100px] flex-shrink-0 bg-transparent rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border-gray-300 text-gray-400 hover:bg-gray-50">
                         <ChevronLeft className="rotate-180" size={24} />
                         <span className="text-xs uppercase font-bold tracking-wider m-0">Veure tot</span>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                 <SettingRow icon={Download} title="Administra l'emmagatzematge" description="67,0 MB consumits locals al dispositiu." />
            </div>

            <h2 className="mx-6 mb-3 text-[11px] font-black tracking-widest uppercase text-gray-400 m-0">Privacitat i Seguretat</h2>
            <SettingRow icon={Bell} title="Silenciar notificacions" rightElement={<div className="w-11 h-6 rounded-full p-1 cursor-pointer flex items-center shadow-inner border bg-gray-200 border-gray-300">
                        <div className="w-4 h-4 rounded-full shadow-sm bg-white"></div>
                    </div>} />
            <SettingRow icon={Clock} title="Missatges temporals" description="Desactivat per defecte. Les espurnes romanen." />
            <SettingRow icon={Lock} title="Privacitat Segura" description="Els teus missatges i dades són privats i xifrats extrem a extrem. Estàs 100% segur al Mas." />

             <h2 className="mx-6 mt-8 mb-3 text-[11px] font-black tracking-widest uppercase text-gray-400 m-0">Membres del Xat</h2>
             <SettingRow icon={Plus} title="Afegeix un participant" description="Crea un grup amb aquesta persona o agents IA." />
             <SettingRow icon={Users} title="Visualitza Membres" description={`Hi ha ${chatData?.membersCount || 1} participant/s connectats.`} />

             <div className={`mt-8 mb-10 ${isGuestUser ? 'opacity-50 pointer-events-none' : ''}`}>
                <SettingRow icon={AlertTriangle} title="Bloquejar participant" isRed />
                <SettingRow icon={LogOut} title="Buidar tota la conversa" isRed />
             </div>

        </div>

         <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 99px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #FF6D00; }
        `}</style>
    </div>
  );
};
export default ChatManager;