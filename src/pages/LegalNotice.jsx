import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Scale, ChevronRight, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '../context/NavigationContext';
import WelcomePresentation from '../components/WelcomePresentation';
import IaiaManifesto from '../components/IaiaManifesto';

const LegalNotice = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { toggleDrawer } = useNavigation();
    const isDayMode = theme === 'light';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans pb-[90px] md:pb-40 selection:bg-blue-600/30 dark:selection:bg-primary/30 selection:text-white lg:pl-[120px] transition-colors duration-700 relative">
            
            {/* FLOATING HEADER - CINEMATIC GLASS */}
            <header className="fixed top-0 left-0 right-0 lg:left-[120px] h-20 md:h-24 flex items-center justify-between px-4 md:px-16 z-50 backdrop-blur-2xl bg-white/60 dark:bg-black/60 border-b border-gray-200 dark:border-white/5 transition-all">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleDrawer}
                        className="lg:hidden p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/40 hover:border-blue-600/40 dark:hover:border-primary/40 transition-all active:scale-95"
                        title="Obrir Menú"
                    >
                        <Menu size={24} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-4 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-all group"
                    >
                        <div className="p-3 rounded-full border border-gray-200 dark:border-white/10 group-hover:border-blue-600/40 dark:group-hover:border-primary/40 group-hover:bg-blue-600/10 dark:group-hover:bg-primary/10 transition-all shadow-inner">
                            <ArrowLeft size={22} strokeWidth={2.5} />
                        </div>
                        <div className="hidden sm:flex flex-col items-start translate-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">TORNAR AL MAS</span>
                            <span className="text-[8px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] group-hover:text-blue-600/60 dark:group-hover:text-primary/60 transition-colors">SORTIDA SEGURA</span>
                        </div>
                    </button>
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-3 bg-blue-600 dark:bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-gray-900 dark:text-white/90">SOBIRANIA LEGAL</span>
                        <div className="w-1 h-3 bg-blue-600 dark:bg-primary rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <button 
                        onClick={toggleTheme}
                        className="p-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/10 hover:border-blue-600/40 dark:hover:border-primary/40 transition-all relative group shadow-lg"
                        title={isDayMode ? "Activar Nit Digital" : "Activar Llum de Dia"}
                    >
                        {isDayMode ? <Moon size={20} className="text-blue-600" /> : <Sun size={20} className="text-primary" />}
                    </button>
                    <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-gray-50 dark:bg-white/[0.03] rounded-full border border-gray-200 dark:border-white/10 shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 dark:text-white/60">NODE: CANÒNIC-V10</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-20 md:pt-24 flex flex-col items-center w-full min-h-screen">
                <WelcomePresentation />
                <IaiaManifesto />
            </main>

            {/* CINEMATIC FOOTER */}
            <footer className="fixed bottom-0 left-0 right-0 lg:left-[120px] h-20 flex items-center justify-between px-6 md:px-20 z-50 backdrop-blur-xl bg-white/60 dark:bg-black/60 border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-gray-600 dark:text-white/60">
                    <span>© 2026</span>
                    <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-primary" />
                    <span className="hidden md:inline">SÓC DE POBLE OFFICIAL</span>
                </div>

                <div className="flex items-center gap-6 md:gap-12">
                    <NavLink to="/legal" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-primary hover:text-gray-900 dark:hover:text-white transition-colors">Avís Legal</NavLink>
                    <NavLink to="/legal#cookies" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 dark:text-white/60 hover:text-blue-600 dark:hover:text-primary transition-colors">Cookies</NavLink>
                    <button 
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                        className="hidden md:flex items-center gap-2 group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">ADALT</span>
                        <ChevronRight className="-rotate-90 text-gray-400 dark:text-white/10 group-hover:text-blue-600 dark:group-hover:text-primary transition-colors" size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-4 opacity-40 text-gray-900 dark:text-white hidden sm:flex">
                    <Scale size={20} />
                </div>
            </footer>
        </div>
    );
};

export default LegalNotice;
