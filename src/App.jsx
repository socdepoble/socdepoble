import React from 'react';

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
        <React.Fragment>
            <AppLayout />
            <GlobalModals />
        </React.Fragment>
    );
};

export default App;
