import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import CreationHub from './CreationHub';
import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    const location = useLocation();
    // Ocultamos la navegación y el HUB de creación en el detalle de chat
    const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats';

    return (
        <div className="layout-container">
            {!isChatDetail && <Header />}
            <main className="content-area">
                <Outlet />
            </main>
            {!isChatDetail && <Navigation />}
            {!isChatDetail && <CreationHub />}
        </div>
    );
};

export default Layout;
