import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import CreationHub from './CreationHub';
import PlaygroundBanner from './PlaygroundBanner';
import { useAuth } from '../context/AuthContext';
import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

import ScrollToTop from './ScrollToTop';
import BackToTop from './BackToTop';
import GlobalModals from './GlobalModals';

const Layout = () => {
    const { isPlayground } = useAuth();
    const location = useLocation();
    // Ocultamos la navegación y el HUB de creación en el detalle de chat
    const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

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
