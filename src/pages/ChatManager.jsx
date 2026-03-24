import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, MoreVertical, Search, Bell, Clock, Lock, 
    Image as ImageIcon, Phone, Video, UserPlus, ImagePlay, 
    Users, Plus, LogOut, Download, AlertTriangle, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import Avatar from '../components/Avatar';

// Components
const ActionButton = ({ icon: Icon, label, onClick, disabled }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-[#1F2937] hover:bg-[#374151] transition-all text-white disabled:opacity-50 border border-white/5 w-24 h-24"
    >
        {Icon && <Icon size={28} className={disabled ? 'text-gray-500' : 'text-[#FF6D00]'} />}
        <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight">{label}</span>
    </button>
);

const SettingRow = ({ icon: Icon, title, description, rightElement, onClick, isRed }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer ${isRed ? 'text-red-500' : 'text-white'}`}
    >
        {Icon && <Icon size={24} className="shrink-0 opacity-80" />}
        <div className="flex-1">
            <h3 className="font-bold text-[15px]">{title}</h3>
            {description && <p className="text-[13px] text-gray-400 leading-tight block mt-0.5">{description}</p>}
        </div>
        {rightElement && <div>{rightElement}</div>}
    </div>
);

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
                const chats = await supabaseService.getConversations(currentUserId);
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
        return <div className="flex-1 bg-theme-base flex items-center justify-center">Carregant informació...</div>;
    }

    return (
        <div className="flex-1 flex flex-col bg-[#0B0F19] max-h-screen overflow-hidden relative">
            {/* Header */}
            <header className="h-[60px] pl-2 pr-4 flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-[#FF6D00] shadow-md z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronLeft size={26} />
                    </button>
                    <span className="font-black text-[18px] text-white tracking-wide uppercase">Configuració del Xat</span>
                </div>
                <div className="flex gap-2"></div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                
                {isGuestUser && (
                    <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-3 flex items-center gap-3">
                        <AlertTriangle size={20} className="text-orange-500 shrink-0" />
                        <p className="text-[13px] text-orange-200/90 leading-snug">
                            <strong className="font-black text-orange-400">Mode Foraster.</strong> Estàs veient informació pública d'este xat. Per ajustar-lo necessites registre complet.
                        </p>
                    </div>
                )}
                
                {/* secció 1: Perfil Gigante i Botons principals */}
                <div className="flex flex-col items-center pt-8 pb-6 px-6 bg-[#111827] border-b border-white/5">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF6D00]/20 to-[#FF6D00]/5 text-[#FF6D00] flex items-center justify-center border-2 border-[#FF6D00]/30 shadow-[0_0_30px_rgba(255,107,0,0.15)] mb-4 overflow-hidden relative group">
                        {chatData?.avatar_url ? (
                             <img src={chatData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                             <div className="flex items-center justify-center w-full h-full scale-[1.5]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                             </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-black text-white text-center tracking-tight">{chatData?.name}</h1>
                    
                    <div className="flex items-center gap-1.5 mt-2 justify-center bg-black/40 px-3 py-1 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                        <p className="text-gray-300 font-bold text-[10px] tracking-[0.2em] uppercase">
                            ESTEM PROTEGITS
                        </p>
                    </div>

                    <div className="flex justify-center w-full max-w-xs gap-4 mt-6">
                        <ActionButton icon={Search} label="Cercar Fons" onClick={() => navigate(-1)} />
                        <ActionButton icon={Phone} label="Telefonar" disabled={true} />
                    </div>
                </div>

                {/* Secció 2: Descripció */}
                <div className="mt-2 bg-[#111827] py-1 border-y border-white/5">
                    <SettingRow 
                        title="Informació del Grup"
                        description={`Creat per tu, ${chatData?.creationDate}`}
                        icon={null}
                    />
                </div>

                {/* Secció 3: Media */}
                <div className="mt-2 bg-[#111827] border-y border-white/5">
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                        <h3 className="text-[12px] font-black text-[#FF6D00] tracking-widest uppercase">Arxius, enllaços i docs</h3>
                        <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded-lg">{mediaFiles.length} elements</span>
                            <ChevronLeft size={16} className="rotate-180" />
                        </div>
                    </div>
                    {/* Media Grid Horizontal Scroll */}
                    <div className="px-4 pb-4 flex gap-2 overflow-x-auto custom-scrollbar">
                        <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#1F2937] rounded-xl border border-white/10 flex items-center justify-center text-gray-400 gap-2 flex-col">
                             <ImageIcon size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Imatge 1</span>
                        </div>
                         <div className="w-[100px] h-[100px] flex-shrink-0 bg-orange-500/10 rounded-xl border border-[#FF6D00]/30 flex items-center justify-center text-[#FF6D00] gap-2 flex-col">
                             <ImagePlay size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Vídeo 1</span>
                        </div>
                         <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#1F2937] rounded-xl border border-white/10 flex items-center justify-center text-gray-400 gap-2 flex-col">
                             <ImageIcon size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Imatge 2</span>
                        </div>
                         <div className="w-[100px] h-[100px] flex-shrink-0 bg-transparent rounded-xl border border-white/10 border-dashed flex flex-col items-center justify-center text-white/50 gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                             <ChevronLeft className="rotate-180" size={24}/>
                             <span className="text-[10px] uppercase font-bold tracking-wider">Veure tot</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111827] mt-2 border-y border-white/5">
                     <SettingRow 
                        icon={Download}
                        title="Administra l'emmagatzematge"
                        description="67,0 MB consumits locals al dispositiu."
                    />
                </div>

                {/* Secció 4: Privacitat i Configuració */}
                <div className="mt-2 bg-[#111827] border-y border-white/5">
                    <SettingRow 
                        icon={Bell}
                        title="Silenciar notificacions"
                        rightElement={
                            <div className="w-11 h-6 bg-[#1F2937] rounded-full p-1 cursor-pointer flex items-center shadow-inner border border-white/5">
                                <div className="w-4 h-4 rounded-full bg-gray-400 shadow-sm"></div>
                            </div>
                        }
                    />
                    <SettingRow 
                        icon={Clock}
                        title="Missatges temporals"
                        description="Desactivat per defecte. Les espurnes romanen."
                    />
                    <SettingRow 
                        icon={Lock}
                        title="Privacitat Segura"
                        description="Els teus missatges i dades són privats i xifrats extrem a extrem. Estàs 100% segur al Mas."
                    />
                </div>

                 {/* Secció 5: Opcions de Xat Individual / Grup */}
                <div className="mt-2 bg-[#111827] border-y border-white/5">
                     <div className="px-4 pt-5 pb-2 text-[#FF6D00] text-[11px] font-black tracking-widest uppercase">
                         Membres del Xat
                     </div>
                     <SettingRow 
                        icon={Plus}
                        title="Afegeix un participant"
                        description="Crea un grup amb aquesta persona o agents IA."
                    />
                     <SettingRow 
                        icon={Users}
                        title="Visualitza Membres"
                        description={`Hi ha ${chatData?.membersCount || 1} participant/s connectats.`}
                    />
                </div>

                 {/* Secció 6: Accions perilloses */}
                 <div className={`mt-2 bg-[#111827] border-y border-white/5 mb-10 ${isGuestUser ? 'opacity-50 pointer-events-none' : ''}`}>
                    <SettingRow 
                        icon={AlertTriangle}
                        title="Bloquejar participant"
                        isRed
                    />
                    <SettingRow 
                        icon={LogOut}
                        title="Buidar tota la conversa"
                        isRed
                    />
                 </div>

            </div>

             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #FF6D00; }
            `}</style>
        </div>
    );
};

export default ChatManager;
