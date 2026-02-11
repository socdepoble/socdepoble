import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import GlobalModals from './components/GlobalModals';
import './index.css';

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v1.25
 * Aquest fitxer conté la cimentació mestre. 
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Zero Fantasmes.
 */
const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <UIProvider>
                    <AppLayout />
                    <GlobalModals />
                </UIProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
