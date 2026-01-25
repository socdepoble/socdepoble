import React, { useEffect } from 'react';
import Navigation from './Navigation';
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

const Layout = () => {
    const { isPlayground } = useAuth();
    const location = useLocation();
    // Ocultamos la navegación y el HUB de creación en el detalle de chat
    const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

    // [CRITICAL] Ensure version is always visible in browser tab for screenshots
    useEffect(() => {
        const baseTitle = document.title.split(' | ')[0].split('(')[0].trim();
        // Remove old versions just in case
        const cleanTitle = baseTitle.replace(/v\d+\.\d+\.\d+/, '').trim();

        // Force suffix
        document.title = `${cleanTitle} (v1.3.1) | Sóc de Poble`;
    }, [location]);

    // [Interactive Push] Deep Linking to IAIA Chat
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const iaiaContext = params.get('iaia_context');

        if (iaiaContext) {
            // Find IAIA persona and redirect
            import('../services/supabaseService').then(async ({ supabaseService }) => {
                try {
                    const personas = await supabaseService.getAllPersonas(isPlayground);
                    const iaia = personas.find(p => p.full_name?.toUpperCase().includes('IAIA') || p.role === 'ambassador');

                    if (iaia) {
                        logger.log('[Layout] Redirecting to IAIA chat with context:', iaiaContext);
                        navigate(`/chats/${iaia.id}`, {
                            state: { injectedMessage: iaiaContext },
                            replace: true
                        });
                    } else {
                        logger.warn('[Layout] IAIA persona not found for deep link');
                        navigate('/chats');
                    }
                } catch (err) {
                    logger.error('[Layout] Error deep linking to IAIA:', err);
                }
            });
        }
    }, [location.search, navigate, isPlayground]);

    return (
        <div className={`layout-container ${isPlayground ? 'has-playground-banner' : ''}`}>
            <ScrollToTop />
            <PlaygroundBanner />
            {!isChatDetail && <Header />}
            <main className="content-area">
                <Outlet />
            </main>
            <BackToTop />
            {!isChatDetail && <Navigation />}
            {!isChatDetail && <CreationHub />}
            <GlobalModals />
        </div>
    );
};

export default Layout;
