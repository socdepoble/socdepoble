import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const handleNotReady = () => {
        alert(t('chat.dev_feature'));
    };

    const isIAIA = otherInfo?.id?.startsWith('11111111-');

    return (
        <header className="z-30 flex h-[64px] min-h-[64px] flex-shrink-0 items-center justify-between px-2 bg-[#0e0e0e] shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-colors md:px-6">
            {/* ZONA CLICABLE GLOBAL: Tot el costat esquerre porta al perfil */}
            <div 
                className="group flex flex-1 cursor-pointer items-center gap-2 transition-all md:gap-3"
                onClick={() => {
                     // Dirigim SEMPRE a l'UUID real perquè ProfileView i Supabase ho reconeguen correctament
                     navigate(`/perfil/${otherInfo?.id}`);
                }}
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/chats'); }} 
                    className="btn-tactile -ml-1 flex h-12 w-12 items-center justify-center rounded-full text-[#E5E2E1] transition-colors md:hidden"
                >
                    <ChevronLeft size={28} strokeWidth={2.5} />
                </button>
                
                {isHeaderSearchOpen ? (
                    <input
                        autoFocus
                        type="text"
                        placeholder={t('chat.search_fragments', 'Cercar fragments...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2 w-full rounded-[28px] bg-[#222222] px-4 py-3 font-['Noto_Sans'] text-[15px] text-[#E5E2E1] placeholder:text-[#E5E2E1]/40 focus:outline-none"
                    />
                ) : (
                    <>
                        <div className={`relative ${isIAIA ? 'rounded-[16px] p-0.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''}`}>
                            <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={40} />
                        </div>
                        
                        <div className="flex min-w-0 flex-1 flex-col pr-1 md:pr-2">
                            <h2 className="truncate font-['Epilogue'] text-[17px] font-bold leading-none text-[#E5E2E1] transition-colors group-hover:text-[#F97316] md:text-lg">
                                {otherInfo?.name || t('chat.guest', 'Convidat')}
                            </h2>
                            <div className="mt-1 flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${isIAIA ? 'bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-[#169CF9]'}`} />
                                <span className="font-['Noto_Sans'] text-[11px] font-black uppercase tracking-widest text-[#E5E2E1]/60">
                                    {isIAIA ? t('chat.iaia_beating', 'Bategant...') : t('chat.online_now', 'En Línia')}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="z-10 ml-auto flex items-center gap-1">
                <button 
                    onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                    className="btn-tactile hidden h-12 w-12 items-center justify-center rounded-full text-[#E5E2E1]/80 transition-colors md:flex"
                    title={t('chat.search_conversation')}
                >
                    <Search size={22} strokeWidth={2.5} />
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                        className={`btn-tactile flex h-12 w-12 items-center justify-center rounded-full text-[#E5E2E1] transition-colors ${isSettingsMenuOpen ? 'bg-[#222222]' : ''}`}
                        title={t('chat.chat_options')}
                    >
                        <MoreVertical size={24} strokeWidth={2.5} />
                    </button>

                    {isSettingsMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
                            <div className="absolute right-2 top-14 z-50 w-64 origin-top-right animate-in fade-in zoom-in-95 rounded-[28px] bg-[#222222]/90 py-2 text-[15px] text-[#E5E2E1] shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-xl duration-200">
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.add_members', 'Afegir membres')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); navigate(`/gestio/xats/${realChatId}`); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.group_info', 'Info. del grup')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.group_media', 'Multimèdia')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.search', 'Cercar')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.mute_notifications', 'Silenciar')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.temporary_messages', 'Missatges temporals')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.wallpaper', 'Fons de pantalla')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]">{t('chat.more', 'Més')}</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
