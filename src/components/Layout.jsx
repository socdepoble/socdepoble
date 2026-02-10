import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Header from './Header';
import CreationHub from './CreationHub';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { logger } from '../utils/logger';
import './Layout.css';
import {
    Plus,
    MessageSquare,
    Newspaper,
    Store,
    MapPin,
    Sparkles,
    Database,
    Calendar,
    Image,
    User,
    Shield
} from 'lucide-react';

import BackToTop from './BackToTop';
import GlobalModals from './GlobalModals';
import OmniscientViewer from './OmniscientViewer';
import { useUI } from '../context/UIContext';
import { iaiaAuditor } from '../services/iaiaAuditor';
import NotePad from './NotePad';
import { APP_VERSION } from '../constants';

const Layout = () => {
    const uiContext = useUI();
    const { isViewerOpen, globalDesign } = uiContext || { isViewerOpen: false, globalDesign: 'standard' };
    const navigate = useNavigate();

    useEffect(() => {
        logger.log('[Layout] Bategat de Ferro:', { isViewerOpen, globalDesign, isMobile: window.innerWidth < 1024 });
    }, [isViewerOpen, globalDesign]);

    const location = useLocation();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);

        // [MASTER IAIA AUDIT]
        const isStable = iaiaAuditor.auditPulse();
        if (isStable) {
            iaiaAuditor.auditLayout();
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const baseTitle = "Sóc de Poble";
        const pageTitle = location.pathname === '/' ? "Inici" :
            location.pathname.startsWith('/chats') ? "Xat" :
                location.pathname.split('/').filter(Boolean).pop() || "Portal";

        document.title = `${pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} | ${baseTitle} ${APP_VERSION}`;
    }, [location]);

    return (
        <div className="layout-iron flex h-screen w-screen overflow-hidden bg-black text-white font-inter">
            {/* [MASTER] SIDEBAR BLINDAT (280px) */}
            <aside className="hidden md:flex flex-col w-[280px] min-w-[280px] flex-shrink-0 bg-[#050505] border-r border-[#27272a]/50 overflow-y-auto custom-scrollbar">
                <div className="p-8">
                    <div className="header-logo mb-10 cursor-pointer" onClick={() => navigate("/")}>
                        <img
                            src="https://raw.githubusercontent.com/iaia-maria/socdepoble-assets/main/logo-soc-de-poble-white.png"
                            alt="Sóc de Poble"
                            className="h-8"
                        />
                    </div>

                    <div className="afegir-box-iron mb-6">
                        <button
                            className="w-full h-[48px] bg-[#5D5FEF] hover:bg-[#4d4fcf] text-white font-black text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                            onClick={() => window.dispatchEvent(new CustomEvent('toggle-creation-hub'))}
                        >
                            <Plus size={18} strokeWidth={3} /> AFEGIR
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <NavLink to="/chats" className={({isActive}) => `flex items-center gap-4 h-[44px] px-4 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[#FF6D23] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <MessageSquare size={18} /> Xat
                        </NavLink>
                        <NavLink to="/mur" className={({isActive}) => `flex items-center gap-4 h-[44px] px-4 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[#FF6D23] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <Newspaper size={18} /> Mur d'Històries
                        </NavLink>
                        <NavLink to="/mercat" className={({isActive}) => `flex items-center gap-4 h-[44px] px-4 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[#FF6D23] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <Store size={18} /> Mercat Rural
                        </NavLink>
                        <NavLink to="/pobles" className={({isActive}) => `flex items-center gap-4 h-[44px] px-4 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[#FF6D23] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <MapPin size={18} /> El Meu Territori
                        </NavLink>
                    </nav>

                    <div className="mt-10 uppercase text-[10px] font-black tracking-[2px] text-gray-600 mb-4 px-4">
                        Organització
                    </div>
                    <nav className="space-y-1">
                        <NavLink to="/iaia" className="flex items-center gap-4 h-[44px] px-4 text-gray-400 hover:text-white font-bold text-sm">
                            <Sparkles size={18} className="text-yellow-500" /> La IAIA (Hub)
                        </NavLink>
                        <NavLink to="/arxiu" className="flex items-center gap-4 h-[44px] px-4 text-gray-400 hover:text-white font-bold text-sm">
                            <Database size={18} /> Arxiu d'Or
                        </NavLink>
                        <NavLink to="/agenda" className="flex items-center gap-4 h-[44px] px-4 text-gray-400 hover:text-white font-bold text-sm">
                            <Calendar size={18} /> Calendari Master
                        </NavLink>
                        <NavLink to="/album" className="flex items-center gap-4 h-[44px] px-4 text-gray-400 hover:text-white font-bold text-sm">
                            <Image size={18} /> Àlbum Global
                        </NavLink>
                    </nav>
                    <div className="mt-10 pt-10 border-t border-[#27272a]/30 uppercase text-[10px] font-black tracking-[2px] text-gray-600 mb-4 px-4">
                        Col·leccions
                    </div>
                    <nav className="space-y-1 pb-10">
                        <NavLink to="/perfil" className={({isActive}) => `flex items-center gap-4 h-[44px] px-4 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[#FF6D23] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                            👤 El meu Perfil
                        </NavLink>
                        <NavLink to="/solatge" className={({isActive}) => `flex items-center gap-4 h-[44px] px-4 rounded-xl transition-all font-bold text-sm ${isActive ? 'bg-[#FF6D23] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                            🧿 Consola Solatge
                        </NavLink>
                        <div className="mt-8 pt-8 border-t border-[#27272a]/50 text-[10px] font-black text-[#222] uppercase tracking-widest text-center">
                            {APP_VERSION}
                        </div>
                    </nav>
                </div>
            </aside>

            {/* [MASTER] MAIN VIEWPORT (Fixed) */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#010101]">
                <Header />
                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <Outlet />
                    <BackToTop />
                </main>

                {isMobile && <Navigation />}
                <GlobalModals />
                <NotePad />
            </div>
            <CreationHub />
            <OmniscientViewer />
        </div>
    );
};

export default Layout;
