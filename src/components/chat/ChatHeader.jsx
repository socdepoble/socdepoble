import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical } from 'lucide-react';
import Avatar from '../Avatar';

const ChatHeader = ({
    otherInfo,
    realChatId,
    isHeaderSearchOpen,
    setIsHeaderSearchOpen,
    searchQuery,
    setSearchQuery,
    isSettingsMenuOpen,
    setIsSettingsMenuOpen
}) => {
    const navigate = useNavigate();

    const handleNotReady = () => {
        alert("Funció en desenvolupament (Auditoria V3)");
    };

    const isIAIA = otherInfo?.id?.startsWith('11111111-');

    return (
        <header className={`h-[56px] min-h-[56px] md:h-16 md:min-h-[64px] px-2 md:px-6 flex items-center justify-between border-b border-[var(--border-master)] flex-shrink-0 z-30 transition-colors ${isIAIA ? 'bg-[var(--theme-accent-primary)] text-white' : 'bg-theme-header text-white'}`}>
            {/* ZONA CLICABLE GLOBAL: Tot el costat esquerre porta al perfil */}
            <div 
                className="flex items-center gap-2 md:gap-3 flex-1 cursor-pointer group transition-all"
                onClick={() => {
                     // Dirigim SEMPRE a l'UUID real perquè ProfileView i Supabase ho reconeguen correctament
                     navigate(`/perfil/${otherInfo?.id}`);
                }}
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/chats'); }} 
                    className={`md:hidden w-12 h-12 flex items-center justify-center -ml-2 transition-colors ${isIAIA ? 'text-[var(--on-theme-accent-primary)] hover:text-black font-black' : 'text-gray-400 hover:text-white'}`}
                >
                    <ChevronLeft size={24} />
                </button>
                
                {isHeaderSearchOpen ? (
                    <input
                        autoFocus
                        type="text"
                        placeholder="Cerca fragments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-black/20 border border-[var(--border-master)] text-white placeholder:text-white/50 px-4 py-2 rounded-[28px] focus:outline-none mr-2"
                    />
                ) : (
                    <>
                        <div className={isIAIA ? 'bg-white rounded-full p-[1px] md:p-0.5 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : ''}>
                            <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={36} />
                        </div>
                        
                        <div className="flex flex-col min-w-0 pr-1 md:pr-2 flex-1">
                            <h2 className={`text-base md:text-lg font-bold truncate leading-none transition-colors ${isIAIA ? 'text-white' : 'text-white group-hover:text-[var(--theme-accent-primary)]'}`}>
                                {otherInfo?.name || 'Foraster'}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${isIAIA ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'bg-green-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest opacity-80 ${isIAIA ? 'text-[var(--sdp-white)]' : 'text-gray-400'}`}>
                                    {isIAIA ? 'IAIA Bategant' : 'En línia ara'}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center ml-auto z-10">
                <button 
                    onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                    className={`hidden md:block transition-all hover:bg-white/10 rounded-full p-2 md:mr-2 filter drop-shadow-md ${isIAIA ? 'text-white' : 'text-gray-300 hover:text-white'} ${isHeaderSearchOpen ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-80'}`}
                    title="Cercar en la conversa"
                >
                    <Search size={22} strokeWidth={2.5} />
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                        className={`transition-all hover:bg-white/10 rounded-full p-1.5 md:p-2 filter drop-shadow-md ${isIAIA ? 'text-white' : 'text-gray-300 hover:text-white'} ${isSettingsMenuOpen ? 'opacity-100 bg-white/10' : 'opacity-80'}`}
                        title="Opcions del Xat"
                    >
                        <MoreVertical size={22} strokeWidth={2.5} />
                    </button>

                    {isSettingsMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
                            <div className="absolute top-12 right-0 w-64 bg-[#111827] text-white border border-white/10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.2)] py-2 z-50 text-[15px] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Afegeix membres</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); navigate(`/gestio/xats/${realChatId}`); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Informació del grup</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Fitxers multimèdia del grup</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Cerca</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Silenciar notificacions</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Missatges temporals</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Fons de pantalla</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full text-left px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors">Més</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
