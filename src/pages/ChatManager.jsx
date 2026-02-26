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
        className="flex flex-col items-center gap-2 p-3 genesis-radius bg-theme-panel hover:bg-white/5 transition-all text-theme-text disabled:opacity-50"
    >
        {Icon && <Icon size={24} className={disabled ? 'text-gray-500' : 'text-[var(--theme-accent-primary)]'} />}
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </button>
);

const SettingRow = ({ icon: Icon, title, description, rightElement, onClick, isRed }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer ${isRed ? 'text-red-500' : 'text-theme-text'}`}
    >
        {Icon && <Icon size={22} className="shrink-0 opacity-80" />}
        <div className="flex-1">
            <h3 className="font-medium text-[15px]">{title}</h3>
            {description && <p className="text-sm text-gray-500 leading-tight block mt-0.5">{description}</p>}
        </div>
        {rightElement && <div>{rightElement}</div>}
    </div>
);

const ChatManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, impersonatedProfile, activeEntityId } = useAuth();
    
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
        <div className="flex-1 flex flex-col bg-theme-base max-h-screen overflow-hidden relative">
            {/* Header */}
            <header className="h-[60px] pl-2 pr-4 flex flex-shrink-0 items-center justify-between border-b border-[var(--border-master)] bg-[var(--theme-accent-primary)] shadow-md z-10 sticky top-0">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="font-bold text-[17px] text-white">Configuració Global del Xat</span>
                </div>
                {/* Removed MoreVertical and other icons, leaving only structural alignment or specific requested icons if any later */}
                <div className="flex gap-2"></div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                
                {/* secció 1: Perfil Gigante i Botons principals */}
                <div className="flex flex-col items-center pt-8 pb-6 px-6 bg-theme-base border-b border-[var(--border-master)]">
                    <div className="w-24 h-24 rounded-full bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] flex items-center justify-center border-2 border-[var(--theme-accent-primary)]/30 shadow-[0_0_30px_rgba(255,107,0,0.15)] mb-4 overflow-hidden relative group">
                         <div className="flex items-center justify-center w-full h-full scale-125">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                         </div>
                    </div>

                    <h1 className="text-2xl font-black text-theme-text text-center">{chatData?.name}</h1>
                    <div className="flex items-center gap-1 mt-1 justify-center">
                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                        <p className="text-[var(--text-main)] opacity-70 font-black text-[10px] tracking-widest uppercase">
                            ESTEM PROTEGITS
                        </p>
                    </div>

                    <div className="flex justify-center w-full max-w-xs gap-3 mt-6">
                        <ActionButton icon={Search} label="Cerca al Xat" onClick={() => navigate(-1)} />
                    </div>
                </div>

                {/* Secció 2: Descripció */}
                <div className="mt-2 bg-theme-header py-1 border-y border-[var(--border-master)]">
                    <SettingRow 
                        title="Afegir descripció del grup"
                        description={`Creat per tu, ${chatData?.creationDate}`}
                        icon={null}
                    />
                </div>

                {/* Secció 3: Media */}
                <div className="mt-2 bg-theme-header border-y border-[var(--border-master)]">
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                        <h3 className="text-[15px] font-medium text-theme-text">Fitxers multimèdia, enllaços i documents</h3>
                        <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-sm">{mediaFiles.length}</span>
                            <ChevronLeft size={16} className="rotate-180" />
                        </div>
                    </div>
                    {/* Media Grid Horizontal Scroll */}
                    <div className="px-4 pb-4 flex gap-2 overflow-x-auto custom-scrollbar">
                        <div className="w-[100px] h-[100px] flex-shrink-0 bg-theme-panel rounded-lg border border-[var(--border-master)] flex items-center justify-center text-gray-500 gap-2 flex-col">
                             <ImageIcon size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Imatge 1</span>
                        </div>
                         <div className="w-[100px] h-[100px] flex-shrink-0 bg-theme-panel rounded-lg border border-[var(--border-master)] flex items-center justify-center text-[var(--theme-accent-primary)] gap-2 flex-col">
                             <ImagePlay size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Vídeo 1</span>
                        </div>
                         <div className="w-[100px] h-[100px] flex-shrink-0 bg-theme-panel rounded-lg border border-[var(--border-master)] flex items-center justify-center text-gray-500 gap-2 flex-col">
                             <ImageIcon size={24}/>
                             <span className="text-[10px] uppercase font-black tracking-wider">Imatge 2</span>
                        </div>
                         <div className="w-[100px] h-[100px] flex-shrink-0 bg-theme-panel rounded-lg border border-[var(--border-master)] flex flex-col items-center justify-center text-white/50 text-xs gap-1 cursor-pointer hover:bg-white/10 transition-colors">
                             <ChevronLeft className="rotate-180" size={24}/>
                             Veure tot
                        </div>
                    </div>
                </div>

                <div className="bg-theme-header">
                     <SettingRow 
                        icon={Download}
                        title="Administra l'emmagatzematge"
                        description="67,0 MB"
                    />
                </div>


                {/* Secció 4: Privacitat i Configuració */}
                <div className="mt-2 bg-theme-header border-y border-[var(--border-master)]">
                    <SettingRow 
                        icon={Bell}
                        title="Silenciar notificacions"
                        rightElement={
                            <div className="w-10 h-6 bg-theme-panel rounded-full p-1 cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                            </div>
                        }
                    />
                    <SettingRow 
                        icon={Clock}
                        title="Missatges temporals"
                        description="Desactivat per defecte"
                    />
                    <SettingRow 
                        icon={Lock}
                        title="Privacitat Segura"
                        description="Els teus missatges i dades són privats i estan de gom a gom segurs. En pots estar tranquil."
                    />
                </div>

                 {/* Secció 5: Opcions de Xat Individual / Grup */}
                <div className="mt-2 bg-theme-header border-y border-[var(--border-master)]">
                     <div className="p-4 uppercase text-[#FF6D00] text-xs font-black tracking-widest border-b border-[var(--border-master)]">
                         Membres
                     </div>
                     <SettingRow 
                        icon={Plus}
                        title="Afegeix un grup"
                        description="Crea un grup amb aquesta persona o amb agents."
                    />
                </div>

                 {/* Secció 6: Accions perilloses */}
                 <div className="mt-2 bg-theme-header border-y border-[var(--border-master)] mb-10">
                    <SettingRow 
                        icon={AlertTriangle}
                        title="Bloquejar"
                        isRed
                    />
                    <SettingRow 
                        icon={LogOut}
                        title="Buidar xat"
                        isRed
                    />
                 </div>

            </div>

             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #222; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary); }
            `}</style>
        </div>
    );
};

export default ChatManager;
