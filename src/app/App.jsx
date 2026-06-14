import { useEffect, useCallback } from 'react';
import './index.css';
import { logger } from '../utils/logger';

// [Noves Portes / Cimentació Mestre]
import { useLowEndDevice } from '../hooks/useLowEndDevice';
import { useTabReconciliation } from '../hooks/useTabReconciliation';
import { useBlindatgeOPFS } from '../hooks/useBlindatgeOPFS';
import { useVersionWatchdog } from '../hooks/useVersionWatchdog';
import { useLocation } from 'react-router-dom';
import useTrellatPersist from '../hooks/useTrellatPersist';
import SystemRoutes from '../components/core/SystemRoutes';
import AppLayout from '../components/layout/AppLayout';
import GlobalModals from '../components/modals/GlobalModals';
import SEO from '../components/core/SEO';
import AntiTsunamiSync from '../components/core/AntiTsunamiSync';
import ErrorBoundary from '../components/core/ErrorBoundary';
import OfflineGate from '../components/gates/OfflineGate';
import LocalFirstGate from '../components/gates/LocalFirstGate';
import AuthGate from '../components/gates/AuthGate';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const LayoutBoundary = () => {
  const location = useLocation();
  const isSystemRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/solatge') || location.pathname.startsWith('/ofici/menu') || location.pathname.startsWith('/ofici/categories') || location.pathname.startsWith('/ofici/xats') || location.pathname.startsWith('/utilitats') || location.pathname.startsWith('/tools/trellat') || location.pathname.startsWith('/iaia-sandbox');
  if (isSystemRoute) {
    return <SystemRoutes />;
  }
  return <>
            <AppLayout />
            <GlobalModals />
        </>;
};

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
  // [BÚNKER]: Persistència i Control de Service Worker
  useBlindatgeOPFS();

  // Sanea "Amnesia BFCache"
  useTabReconciliation();

  // Sentinel·la Perenne (Version Watchdog)
  useVersionWatchdog();

  // [ERROR] Global error handlers refactoritzats
  const handleError = useCallback(event => {
    logger.error('Error global interceptat:', event.error || event.message);
  }, []);
  const handleUnhandledRejection = useCallback(event => {
    logger.error('Rebuig no gestionat:', event.reason);
  }, []);
  useEffect(() => {
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError, handleUnhandledRejection]);
  const isLowEnd = useLowEndDevice();
  useEffect(() => {
    if (isLowEnd) {
      document.body.classList.add('low-end-device');
    } else {
      document.body.classList.remove('low-end-device');
    }
  }, [isLowEnd]);
  const {
    requestPersist,
    checkBattery
  } = useTrellatPersist();

  // [SW] Service Worker Registration & Trellat Persist
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (import.meta.env.DEV) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      } else {
        // [TÀCTICA ATRC] Retardem 3.5s el registre del SW per no ofegar el fil principal durant el First Paint en iPads antics (Recomanat pel Consell)
        setTimeout(() => {
          navigator.serviceWorker.register('/sw.js').then(() => {
            // logger.log('[ServiceWorker] Trellat Shield Activado');
          }).catch(e => logger.error('[ServiceWorker] Failed', e));
        }, 3500);
      }
    }
    requestPersist();
    checkBattery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const AppContent = <>
            <SEO />
            <AntiTsunamiSync />
            <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
                <OfflineGate>
                    <LocalFirstGate>
                        <AuthGate>
                            <LayoutBoundary />
                        </AuthGate>
                    </LocalFirstGate>
                </OfflineGate>
            </ErrorBoundary>
        </>;
  return AppContent;
};
export default App;