import React, { useEffect, useCallback } from 'react';
import AppLayout from './components/AppLayout';
import { iaiaService } from './services/iaiaService';
import GlobalModals from './components/GlobalModals';
import './index.css';
import { errorTrackingService } from './services/errorTrackingService';
import { healthCheckService } from './services/healthCheckService';
import { logger } from './utils/logger';

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from './components/ErrorBoundary';
import LocalFirstGate from './components/gates/LocalFirstGate';
import AuthGate from './components/gates/AuthGate';
import OfflineGate from './components/gates/OfflineGate';
import SEO from './components/SEO';
import { useLowEndDevice } from './hooks/useLowEndDevice';
import { useTabReconciliation } from './hooks/useTabReconciliation';
import { useBlindatgeOPFS } from './hooks/useBlindatgeOPFS';
import { useLocation } from 'react-router-dom';
import SystemRoutes from './components/SystemRoutes';
import AntiTsunamiSync from './components/AntiTsunamiSync';
import useTrellatPersist from './hooks/useTrellatPersist';

const LayoutBoundary = () => {
    const location = useLocation();
    const isSystemRoute = 
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/solatge') ||
        location.pathname.startsWith('/gestio-menu') ||
        location.pathname.startsWith('/gestio/categories') ||
        location.pathname.startsWith('/gestio/xats') ||
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
                const { syncService } = await import('./services/syncService');
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
            navigator.serviceWorker.register('/sw.js').then(() => {
                // logger.log('[ServiceWorker] Trellat Shield Activado');
            }).catch(e => logger.error('[ServiceWorker] Failed', e));
        }
        requestPersist();
        checkBattery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
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
            {/* [OMEGA-FIX: Fuera del ErrorBoundary con atributos y roles explícitos completos] */}
            <div
                id="aria-live-region"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />
        </>
    );
};

export default App;
