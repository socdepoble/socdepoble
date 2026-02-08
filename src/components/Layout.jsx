import React, { useEffect } from 'react';
import Navigation from './Navigation';
import NavigationRail from './NavigationRail';
import Header from './Header';
import CreationHub from './CreationHub';
import PlaygroundBanner from './PlaygroundBanner';
import { useAuth } from '../context/AuthContext';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { logger } from '../utils/logger';
import './Layout.css';

import ScrollToTop from './ScrollToTop';
import BackToTop from './BackToTop';
import GlobalModals from './GlobalModals';
import OmniscientViewer from './OmniscientViewer';
import { useUI } from '../context/UIContext';
import { iaiaAuditor } from '../services/iaiaAuditor';
import { Newspaper, MessageCircle, Store, MapPin, User, Settings, Info, Shield, BookOpen, Search, Image as ImageIcon } from 'lucide-react';
import NotePad from './NotePad';
import { APP_VERSION } from '../constants';

const Layout = () => {
    const { isPlayground, isAdmin } = useAuth();
    const uiContext = useUI();
    const { isViewerOpen, globalDesign, setGlobalDesign } = uiContext || { isViewerOpen: false, globalDesign: 'standard' };

    useEffect(() => {
        logger.log('[Layout] Bategat de context:', { isViewerOpen, globalDesign, isMobile: window.innerWidth < 1024 });
    }, [isViewerOpen, globalDesign]);

    const location = useLocation();
    const navigate = useNavigate();
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
    const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

    const isInstitutional = location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/gestio-entitats') ||
        location.pathname === '/calendari';

    useEffect(() => {
        const baseTitle = "Sóc de Poble";
        const pageTitle = location.pathname === '/' ? "Inici" :
            location.pathname.startsWith('/chats') ? "Xat" :
                location.pathname.split('/').filter(Boolean).pop() || "Portal";

        document.title = `${pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} | ${baseTitle} ${APP_VERSION}`;
    }, [location]);

    // [Interactive Push] Deep Linking
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const iaiaContext = params.get('iaia_context');

        if (iaiaContext) {
            import('../services/supabaseService').then(async ({ supabaseService }) => {
                try {
                    const personas = await supabaseService.getAllPersonas(isPlayground);
                    const iaia = personas.find(p => p.full_name?.toUpperCase().includes('IAIA') || p.role === 'ambassador');

                    if (iaia) {
                        logger.log('[Layout] Redirecting to IAIA chat:', iaiaContext);
                        navigate(`/chats/${iaia.id}`, {
                            state: { injectedMessage: iaiaContext },
                            replace: true
                        });
                    }
                } catch (err) {
                    logger.error('[Layout] Error deep linking:', err);
                }
            });
        }
    }, [location.search, navigate, isPlayground]);

    const showBanner = false;

    return (
        <div className={`layout-shell ${isViewerOpen ? 'viewer-mode-active' : ''} ${isInstitutional ? 'institutional-theme' : 'rural-theme'} design-${globalDesign}`}>
            {!isMobile && globalDesign === 'consola' && (
                <aside className="design-consola-sidebar">
                    <div className="design-consola-header">
                        <img
                            src="/assets/master/logo_socdepoble_white_full.png"
                            alt="Sóc de Poble"
                            className="consola-logo"
                        />
                        <div className="consola-status-tag">AGENTIC MODE</div>
                    </div>

                    <nav className="design-consola-nav">
                        <div className="consola-nav-section">
                            <label>MEMÒRIA VIVA</label>
                            <NavLink to="/chats" className="design-consola-item">
                                <MessageCircle size={18} /> <span>Comunicació (Xat)</span>
                            </NavLink>
                            <NavLink to="/cerca" className="design-consola-item">
                                <Search size={18} /> <span>Recerca (Cerca)</span>
                            </NavLink>
                        </div>

                        <div className="consola-nav-section">
                            <label>TASQUES I MUR</label>
                            <NavLink to="/mur" className="design-consola-item">
                                <Newspaper size={18} /> <span>El Mur (Backlog)</span>
                            </NavLink>
                            <NavLink to="/mercat" className="design-consola-item">
                                <Store size={18} /> <span>Mercat (Recursos)</span>
                            </NavLink>
                            <NavLink to="/calendari" className="design-consola-item">
                                <BookOpen size={18} /> <span>Calendari (Passat/Futur)</span>
                            </NavLink>
                            <NavLink to="/fotos/global" className="design-consola-item">
                                <ImageIcon size={18} /> <span>Àlbum Global (Actius)</span>
                            </NavLink>
                        </div>

                        <div className="consola-nav-section">
                            <label>SOLATGE I PODER</label>
                            <NavLink to="/pobles" className="design-consola-item">
                                <MapPin size={18} /> <span>Territori (Pobles)</span>
                            </NavLink>
                            <NavLink to="/perfil" className="design-consola-item">
                                <User size={18} /> <span>Ajustos de Mas (Perfil)</span>
                            </NavLink>
                            {isAdmin && (
                                <NavLink to="/admin" className="design-consola-item admin-link">
                                    <Shield size={18} /> <span>PANEL DE COMANDAMENT</span>
                                </NavLink>
                            )}
                        </div>
                    </nav>

                    <div className="consola-sidebar-footer">
                        <div className="consola-version">HUD CORE {APP_VERSION}</div>
                        <div className="consola-ai-id">IDENTITAT: ANTIGRAVITY</div>
                    </div>
                </aside>
            )}

            {!isChatDetail && globalDesign !== 'consola' && !isMobile && <NavigationRail />}

            <div className={`layout-main-scroll ${showBanner ? 'has-playground-banner' : ''}`}>
                <ScrollToTop />
                {!isChatDetail && (isMobile || globalDesign !== 'consola') && <Header />}

                <div className={globalDesign === 'consola' ? 'design-consola-main' : 'main-wrapper'}>
                    <main className="content-area">
                        <Outlet />
                    </main>
                    <OmniscientViewer />
                </div>

                <BackToTop />
                {!isChatDetail && isMobile && <Navigation />}
                {!isChatDetail && globalDesign !== 'consola' && <CreationHub />}
                <GlobalModals />
                <NotePad />
            </div>
        </div>
    );
};

export default Layout;
