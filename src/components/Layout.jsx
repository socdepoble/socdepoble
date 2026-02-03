import React, { useEffect } from 'react';
import Navigation from './Navigation';
import NavigationRail from './NavigationRail';
import Header from './Header';
import CreationHub from './CreationHub';
import PlaygroundBanner from './PlaygroundBanner';
import { useAuth } from '../context/AuthContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';
import './Layout.css';

import ScrollToTop from './ScrollToTop';
import BackToTop from './BackToTop';
import GlobalModals from './GlobalModals';
import OmniscientViewer from './OmniscientViewer';
import { useUI } from '../context/UIContext';

const Layout = () => {
    const { isPlayground, isAdmin } = useAuth();
    const { isViewerOpen } = useUI();
    const location = useLocation();
    const navigate = useNavigate();
    const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

    const isInstitutional = location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/gestio-entitats') ||
        location.pathname === '/calendari';

    useEffect(() => {
        const baseTitle = "Sóc de Poble";
        const pageTitle = location.pathname === '/' ? "Inici" :
            location.pathname.startsWith('/chats') ? "Xat" :
                location.pathname.split('/').filter(Boolean).pop() || "Portal";

        document.title = `${pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} | ${baseTitle} v1.5.6-BATEGA`;
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
        <div className={`layout-shell ${isViewerOpen ? 'viewer-mode-active' : ''} ${isInstitutional ? 'institutional-theme' : 'rural-theme'}`}>
            {!isChatDetail && <NavigationRail />}

            <div className={`layout-main-scroll ${showBanner ? 'has-playground-banner' : ''}`}>
                <ScrollToTop />
                <Header />

                <div className="main-wrapper">
                    <main className="content-area">
                        <Outlet />
                    </main>
                    <OmniscientViewer />
                </div>

                <BackToTop />
                {!isChatDetail && <Navigation />}
                {!isChatDetail && <CreationHub />}
                <GlobalModals />
            </div>
        </div>
    );
};

export default Layout;
