import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import GlobalModals from './components/GlobalModals';
import './index.css';

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - LA VERITAT ÚNICA v1.21
 * Aquest fitxer conté la cimentació mestre del Mas.
 * Dissenyat per ser INDESTRUCTIBLE segons l'ordre del Mestre Javi.
 */
const App = () => {
    
    // 🛡️ SCRIPT EXORCISTA: PURGA NUCLEAR v1.21
    useEffect(() => {
        document.body.style.backgroundColor = 'var(--bg-master)';
        document.body.style.margin = '0';
        document.documentElement.style.backgroundColor = 'var(--bg-master)';

        const zombies = document.querySelectorAll('.white-box, .page-manager, .admin-panel, .legacy-nav, .aso-study-overlay, .gestio-pagines-ghost, .old-management-menu, .jo-text-zombie');
        zombies.forEach(el => el.remove());

    const allDivs = document.getElementsByTagName('div');
    for (let div of allDivs) {
      if (div.innerText && (div.innerText.includes('Gestió de Pàgines') || div.innerText.includes('Gestión de Páginas')) && !div.querySelector('aside')) {
        div.style.display = 'none';
      }
    }
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <UIProvider>
          {/* HABITACIÓ BLINDADA: NEGRE PUR Z-50 */}
          <div className="bg-black min-h-screen w-full text-white overflow-hidden relative z-50">
            <AppLayout />
            <GlobalModals />
          </div>
        </UIProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

