import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import CreationHub from './CreationHub';
import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

import ScrollToTop from './ScrollToTop';
import BackToTop from './BackToTop';

const Layout = () => {
    const location = useLocation();
    // Ocultamos la navegación y el HUB de creación en el detalle de chat
    const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

    return (
        <div className="layout-container">
            <ScrollToTop />
            <Header />
            <main className="content-area">
                <Outlet />
            </main>
            <BackToTop />
            {!isChatDetail && <Navigation />}
            {!isChatDetail && <CreationHub />}
        </div>
    );
};

export default Layout;
