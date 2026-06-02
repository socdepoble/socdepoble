import { useEffect, useCallback } from 'react';
import { iaiaService } from '../core/services/iaiaService';
import './index.css';
import { errorTrackingService } from '../core/services/errorTrackingService';
import { healthCheckService } from '../core/services/healthCheckService';
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
import { APIProvider } from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const MAPS_LIBRARIES = ['marker'];

const LayoutBoundary = () => {
    const location = useLocation();
    const isSystemRoute = 
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/solatge') ||
        location.pathname.startsWith('/ofici/menu') ||
        location.pathname.startsWith('/ofici/categories') ||
        location.pathname.startsWith('/ofici/xats') ||
        location.pathname.startsWith('/utilitats') ||
        location.pathname.startsWith('/tools/trellat') ||
        location.pathname.startsWith('/iaia-sandbox');

    if (isSystemRoute) {
        return <SystemRoutes />;
    }

    return (
        <>
            <AppLayout />
            <GlobalModals />
        </>
    );
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

    // [MONITORING AND CLEANUP] Inicialitzar error tracking y purga fantasma
    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();
        const initializeMonitoring = async () => {
            try {
                await errorTrackingService.initialize();
                if (isMounted && !abortController.signal.aborted) logger.log('[App] Error tracking initialized');
            } catch (error) {
                if (isMounted && !abortController.signal.aborted) logger.error('[App] Failed to initialize error tracking:', error);
            }
        };

        const purgeGhosts = async () => {
            try {
                const { syncService } = await import('../core/services/syncService');
                if (!isMounted || abortController.signal.aborted) return;
                const report = syncService.purgeGhostMediaCache({ dryRun: false });
                logger.debug('[App] Purga fantasma completada:', report);
            } catch (e) {
                if (isMounted && !abortController.signal.aborted) {
                    logger.error('[App] Error purging ghost media:', e);
                }
            }
        };

        initializeMonitoring();
        purgeGhosts();

        return () => { 
            isMounted = false; 
            abortController.abort();
        };
    }, []);

    // [MONITORING] Iniciar health checks
    useEffect(() => {
        healthCheckService.startMonitoring();
        
        const unsubscribe = healthCheckService.subscribe((health) => {
            if (health.overall !== 'healthy') {
                logger.warn('[App] Health check warning:', health);
                errorTrackingService.captureException(
                    new Error(`Health check: ${health.overall}`),
                    { health }
                );
            }
        });

        return () => {
            healthCheckService.stopMonitoring();
            unsubscribe();
        };
    }, []);

    // [ERROR] Global error handlers refactoritzats
    const handleError = useCallback((event) => {
        errorTrackingService.captureException(event.error || event.message, {
            type: 'global',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }, []);

    const handleUnhandledRejection = useCallback((event) => {
        errorTrackingService.captureException(event.reason, {
            type: 'unhandledrejection'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [handleError, handleUnhandledRejection]);

    useEffect(() => {
        return () => {
            iaiaService.dispose();
        };
    }, []);

    const isLowEnd = useLowEndDevice();

    useEffect(() => {
        if (isLowEnd) {
            document.body.classList.add('low-end-device');
        } else {
            document.body.classList.remove('low-end-device');
        }
    }, [isLowEnd]);

    const { requestPersist, checkBattery } = useTrellatPersist();

    // [SW] Service Worker Registration & Trellat Persist
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            if (import.meta.env.DEV) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (let registration of registrations) {
                        registration.unregister();
                    }
                });
            } else {
                navigator.serviceWorker.register('/sw.js').then(() => {
                    // logger.log('[ServiceWorker] Trellat Shield Activado');
                }).catch(e => logger.error('[ServiceWorker] Failed', e));
            }
        }
        requestPersist();
        checkBattery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const AppContent = (
        <>
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
        </>
    );

    return GOOGLE_MAPS_API_KEY ? (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="quarterly" libraries={MAPS_LIBRARIES}>
            {AppContent}
        </APIProvider>
    ) : AppContent;
};

export default App;
