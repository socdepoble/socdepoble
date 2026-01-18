import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout-container">
            <main className="content-area">
                <Outlet />
            </main>
            <Navigation />
        </div>
    );
};

export default Layout;
