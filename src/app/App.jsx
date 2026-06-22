import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { logger } from '../utils/logger';
import { useLowEndDevice } from '../hooks/useLowEndDevice';
import useTrellatPersist from '../hooks/useTrellatPersist';

import AppLayout from './AppLayout';
import VisorNano from '../components/core/VisorNano';
import SEO from '../components/core/SEO';
import ErrorBoundary from '../components/core/ErrorBoundary';

import MurPage from '../pages/MurPage';
import MercatPage from '../pages/MercatPage';
import Pobles from '../pages/Pobles';
import Map from '../pages/community/Map';
import GlobalAssetAlbum from '../pages/features/GlobalAssetAlbum';
import Notes from '../pages/features/Notes';
import DesignSystem from '../pages/features/DesignSystem';
import AlmaPage from '../pages/features/anima-del-mas/AlmaPage';
import UniversalPage from '../pages/public/UniversalPage';
import BackgroundWorkers from '../components/core/BackgroundWorkers';

import { SKILLS_HTML } from '../data/SkillsContent';
import { CONSTITUCIO_HTML } from '../data/ConstitucioContent';
import { HUMAN_PROJECT_HTML } from '../data/HumanProjectContent';

const EnConstruccio = () => (
  <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
    <div className="text-5xl mb-4" aria-hidden="true">🚧</div>
    <h2 className="text-2xl font-bold text-[#FF7300] mb-2 uppercase tracking-wide">En construcció</h2>
    <p className="text-[17px] text-gray-600 max-w-md mx-auto">Aquesta secció de la Masia Virtual encara s'està alçant pedra a pedra. Torna prompte!</p>
  </div>
);

const App = () => {
  const isLowEnd = useLowEndDevice();
  const { requestPersist, checkBattery } = useTrellatPersist();

  useEffect(() => {
    const onErr = (ev) => logger.error('Error global interceptat:', ev.error || ev.message);
    const onRej = (ev) => logger.error('Rebuig no gestionat:', ev.reason);
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej);
    return () => {
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onRej);
    };
  }, []);

  useEffect(() => {
    if (isLowEnd) document.body.classList.add('low-end-device');
    else document.body.classList.remove('low-end-device');
  }, [isLowEnd]);

  const hidratatRef = useRef(false);

  useEffect(() => {
    if (hidratatRef.current) return;
    let hydTimer;
    const marcarHidratat = () => {
      if (document.documentElement.dataset.hydrated) return;
      hidratatRef.current = true;
      requestAnimationFrame(() => {
        document.documentElement.dataset.hydrated = '1';
        setTimeout(() => document.getElementById('sp-shell-sk')?.remove(), 1000);
        document.getElementById('fatal-fallback')?.remove();
      });
    };
    if (isLowEnd) hydTimer = setTimeout(marcarHidratat, 60);
    else marcarHidratat();
    const runPersist = () => {
      requestPersist();
      checkBattery();
    };
    const timerId = setTimeout(runPersist, isLowEnd ? 900 : 450);
    return () => { 
      if (hydTimer) clearTimeout(hydTimer);
      clearTimeout(timerId);
    };
  }, [isLowEnd]);

  return (
    <>
      <SEO />
      <VisorNano />
      <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
        <BackgroundWorkers />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/mur" replace />} />
            <Route path="mur" element={<MurPage />} />
            <Route path="mercat" element={<MercatPage />} />
            <Route path="xat" element={<MurPage />} />
            <Route path="pobles" element={<Pobles />} />
            <Route path="events" element={<MurPage />} />
            <Route path="mapa" element={<Map />} />
            <Route path="multimedia" element={<GlobalAssetAlbum />} />
            <Route path="notes" element={<Notes />} />
            <Route path="disseny" element={<DesignSystem />} />
            <Route path="ia" element={<AlmaPage />} />
            
            {/* NOUS ENDPOINTS UNIVERSALS NETS */}
            <Route path="projecte" element={<UniversalPage title="El Projecte" icon="⚙️" htmlContent={HUMAN_PROJECT_HTML} />} />
            <Route path="skills" element={<UniversalPage title="Skills" icon="📈" htmlContent={SKILLS_HTML} />} />
            <Route path="constitucio" element={<UniversalPage title="La Constitució" icon="⚖️" htmlContent={CONSTITUCIO_HTML} />} />
            <Route path="legal" element={<UniversalPage title="Legal i Privacitat" icon="⚖️" htmlContent={"<h2>Política de Privacitat</h2><p>Treballem sota codi lliure i respectem l'arquitectura local. Les teues dades viuen al teu dispositiu i als servidors P2P encriptats de Sóc de Poble.</p>"} />} />
            <Route path="roadmap" element={<UniversalPage title="Full de Ruta" icon="🛣️" htmlContent={"<h2>Pròxims Passos</h2><p>L'optimització de UniversalPage ja està integrada. Continuarem amb CRDT sync asíncrona i ampliació del Mercat P2P.</p>"} />} />

            <Route path="*" element={<Navigate to="/mur" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
