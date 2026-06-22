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
import ProjectePage from '../pages/ProjectePage';
import Pobles from '../pages/Pobles';
import Map from '../pages/community/Map';
import GlobalAssetAlbum from '../pages/features/GlobalAssetAlbum';
import Notes from '../pages/features/Notes';
import DesignSystem from '../pages/features/DesignSystem_original';
import SessionRulesPage from '../pages/SessionRulesPage';
import AlmaPage from '../pages/features/anima-del-mas/AlmaPage';
import RoadmapView from '../pages/public/RoadmapView';
import LegalManifest from '../pages/public/LegalManifest';
import ConstitucioPage from '../pages/public/ConstitucioPage';
import BackgroundWorkers from '../components/core/BackgroundWorkers';

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

  // Listeners globals amb referència estable i tancament correcte
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

  // Marca dispositiu baix rendiment → una sola vegada si canvia
  useEffect(() => {
    if (isLowEnd) document.body.classList.add('low-end-device');
    else document.body.classList.remove('low-end-device');
  }, [isLowEnd]);

  const hidratatRef = useRef(false);

  // ⭐ HIDRATACIÓ CONTROLADA ATRC · SENYAL ÚNICA I DEFINITIVA
  useEffect(() => {
    if (hidratatRef.current) return; // ⭐ TANCA EL BUCLE PER SEMPRE

    let hydTimer;
    const marcarHidratat = () => {
      if (document.documentElement.dataset.hydrated) return;
      hidratatRef.current = true;
      requestAnimationFrame(() => {
        document.documentElement.dataset.hydrated = '1';
        // Neteja per a casos de fallback o reduced-motion (Claude + Gemini)
        setTimeout(() => document.getElementById('sp-shell-sk')?.remove(), 1000);
        document.getElementById('fatal-fallback')?.remove();
      });
    };

    if (isLowEnd) hydTimer = setTimeout(marcarHidratat, 60);
    else marcarHidratat();

    // Endarrerim només l'execució d'accions per oxigenar l'A10
    const runPersist = () => {
      requestPersist();
      checkBattery();
    };

    // Kimi Fix: Extirpat requestIdleCallback per evitar stutters asíncrons a A10
    const timerId = setTimeout(runPersist, isLowEnd ? 900 : 450);

    return () => { 
      if (hydTimer) clearTimeout(hydTimer);
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Route path="projecte" element={<ProjectePage />} />
            
            <Route path="xat" element={<MurPage />} />
            <Route path="pobles" element={<Pobles />} />
            <Route path="events" element={<MurPage />} />
            
            <Route path="mapa" element={<Map />} />
            <Route path="multimedia" element={<GlobalAssetAlbum />} />
            <Route path="notes" element={<Notes />} />
            <Route path="constitucio" element={<ConstitucioPage />} />
            <Route path="disseny" element={<DesignSystem />} />
            <Route path="skills" element={<SessionRulesPage />} />
            <Route path="ia" element={<AlmaPage />} />
            <Route path="roadmap" element={<RoadmapView />} />
            <Route path="legal" element={<LegalManifest />} />

            <Route path="*" element={<Navigate to="/mur" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;