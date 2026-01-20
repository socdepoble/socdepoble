import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import CreationHub from './CreationHub';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout-container">
            <Header />
            <main className="content-area">
                <Outlet />
            </main>
            <Navigation />
            <CreationHub />
        </div>
    );
};

export default Layout;
