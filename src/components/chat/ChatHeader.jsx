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
    setIsSettingsMenuOpen,
    isEmbedded
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleNotReady = () => {
        alert(t('chat.dev_feature'));
    };

    const isIAIA = otherInfo?.id?.startsWith('11111111-');

    return (
        <header 
            className={`z-30 flex h-[56px] min-h-[56px] flex-shrink-0 items-center justify-between px-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-colors md:px-6 ${isIAIA ? 'text-gray-900 dark:text-white' : 'bg-theme-base'}`}
            style={isIAIA ? { backgroundColor: 'var(--theme-iaia-brand)' } : undefined}
        >
            {/* ZONA CLICABLE GLOBAL: Tot el costat esquerre porta al perfil */}
            <div 
                className={`group flex flex-1 ${isEmbedded ? '' : 'cursor-pointer'} items-center gap-2 transition-all md:gap-3`}
                onClick={() => {
                     if (!isEmbedded) {
                         navigate(`/perfil/${otherInfo?.id}`);
                     }
                }}
            >
                {!isEmbedded && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/chats'); }} 
                        className={`btn-tactile -ml-1 flex h-12 w-12 items-center justify-center rounded-full transition-colors md:hidden ${isIAIA ? 'text-gray-900 dark:text-white' : 'text-theme-text'}`}
                    >
                        <ChevronLeft size={28} strokeWidth={2.5} />
                    </button>
                )}
                
                {isHeaderSearchOpen ? (
                    <input
                        autoFocus
                        type="text"
                        placeholder={t('chat.search_fragments', 'Cercar fragments...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mr-2 w-full rounded-[28px] bg-theme-surface px-4 py-3 font-['Noto_Sans'] text-[15px] text-theme-text placeholder:text-theme-text/40 focus:outline-none"
                    />
                ) : (
                    <>
                        <div 
                            className={`relative ${isIAIA ? 'rounded-[16px] p-0.5' : ''}`}
                            style={isIAIA ? { boxShadow: '0 0 15px var(--theme-iaia-shadow)' } : undefined}
                        >
                            <Avatar src={otherInfo?.avatar_url} name={otherInfo?.name} size={40} />
                        </div>
                        
                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-1 md:pr-2">
                            <h2 
                                className={`truncate font-['Noto_Sans'] text-[16px] md:text-[17px] font-bold transition-colors ${isIAIA ? 'text-gray-900 dark:text-white' : 'text-theme-text'}`}
                            >
                                {otherInfo?.name || t('chat.guest', 'Convidat')}
                            </h2>
                            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-theme-surface px-2 py-0.5 border border-border-master/30">
                                <span className={`h-1.5 w-1.5 rounded-full ${isIAIA ? 'bg-[#169CF9] shadow-[0_0_8px_rgba(22,156,249,0.8)]' : 'bg-theme-accent-primary'}`} />
                                <span className={`font-['Noto_Sans'] text-[10px] font-bold uppercase tracking-wider ${isIAIA ? 'text-gray-900/90 dark:text-white/90' : 'text-theme-text/70'}`}>
                                    {isIAIA ? t('chat.iaia_active', 'Activa') : t('chat.online_now', 'En Línia')}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="z-10 ml-auto flex items-center gap-1">
                <button 
                    onClick={() => setIsHeaderSearchOpen(!isHeaderSearchOpen)}
                    className={`btn-tactile hidden h-12 w-12 items-center justify-center rounded-full transition-colors md:flex ${isIAIA ? 'text-gray-900/90 hover:text-gray-900 dark:text-white/90 dark:hover:text-white' : 'text-theme-text/80'}`}
                    title={t('chat.search_conversation')}
                >
                    <Search size={22} strokeWidth={2.5} />
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                        className={`btn-tactile flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isSettingsMenuOpen && !isIAIA ? 'bg-theme-surface' : ''} ${isIAIA ? 'text-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:text-white dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-theme-text'}`}
                        title={t('chat.chat_options')}
                    >
                        <MoreVertical size={24} strokeWidth={2.5} />
                    </button>

                    {isSettingsMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
                            <div className="absolute right-2 top-14 z-50 w-64 origin-top-right animate-in fade-in zoom-in-95 rounded-[28px] bg-theme-surface/90 py-2 text-[15px] text-theme-text shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-xl duration-200">
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.add_members', 'Afegir membres')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); navigate(`/gestio/xats/${realChatId}`); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.group_info', 'Info. del grup')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.group_media', 'Multimèdia')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.search', 'Cercar')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.mute_notifications', 'Silenciar')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.temporary_messages', 'Missatges temporals')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.wallpaper', 'Fons de pantalla')}</button>
                                <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.more', 'Més')}</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
