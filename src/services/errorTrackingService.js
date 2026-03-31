// ✅ src/services/errorTrackingService.js - ERROR TRACKING GOD MODE
import { logger } from '../utils/logger';
import { APP_VERSION } from '../constants';

/**
 * 🏺 ERROR TRACKING SERVICE [v10.33.16]
 * Captura errors en producció sense soroll en desenvolupament.
 * Integrable amb Sentry, Google Cloud Error Reporting, o custom.
 */
class ErrorTrackingService {
  constructor() {
    this.enabled = import.meta.env.PROD;
    this.dsn = import.meta.env.VITE_SENTRY_DSN || '';
    this.environment = import.meta.env.VITE_APP_ENV || 'production';
    this.release = APP_VERSION;
    this.userContext = null;
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 50;
    this._initialized = false;
  }

  /**
   * Inicialitza el servei de tracking
   */
  async initialize() {
    if (this._initialized) return;
    this._initialized = true;

    if (!this.enabled) {
      // logger.log('[ErrorTracking] Disabled in development');
      return;
    }

    try {
      // [OPTIONAL] Sentry integration
      if (this.dsn) {
        const Sentry = await import('@sentry/react');
        
        Sentry.init({
          dsn: this.dsn,
          environment: this.environment,
          release: this.release,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true
            })
          ],
          tracesSampleRate: 0.1, // 10% de traces
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          beforeSend: (event) => {
            // [PRIVACITAT] Filtrar dades sensibles
            if (event.request?.url?.includes('password')) {
              return null;
            }
            return event;
          }
        });

        logger.log('[ErrorTracking] Sentry initialized');
      }
    } catch (error) {
      logger.error('[ErrorTracking] Initialization failed:', error);
    }
  }

  /**
   * Captura un error
   * @param {Error|string} error - L'error detectat
   * @param {Object} context - Metadades addicionals
   */
  captureException(error, context = {}) {
    if (!this.enabled) {
      logger.error('[ErrorTracking]', error, context);
      return;
    }

    const errorData = {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        memory: performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        } : undefined
      },
      breadcrumbs: this.breadcrumbs.slice(-10),
      user: this.userContext
    };

    // [SEND] Enviar a Sentry si està disponible
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context,
        tags: {
          version: this.release,
          environment: this.environment
        }
      });
    }

    // [LOG] Guardar localment per a debugging
    this._saveToLocalStorage(errorData);

    // [ALERT] Notificar si és error crític
    if (this._isCriticalError(error)) {
      this._notifyCriticalError(errorData);
    }

    logger.error('[ErrorTracking] Exception captured:', errorData);
  }

  /**
   * Afegeix una breadcrumb (petita acció per a context)
   * @param {string} message - Descripció de l'acció
   * @param {string} category - Categoria (navigation, ui, network, etc.)
   * @param {string} level - Nivel (info, warning, error)
   */
  addBreadcrumb(message, category = 'default', level = 'info') {
    const breadcrumb = {
      message,
      category,
      level,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.breadcrumbs.push(breadcrumb);

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    if (window.Sentry) {
      window.Sentry.addBreadcrumb(breadcrumb);
    }
  }

  /**
   * Estableix el context d'usuari
   * @param {Object} user - Dades de l'usuari (sense informació sensible)
   */
  setUserContext(user) {
    this.userContext = user ? {
      id: user.id,
      role: user.role,
      isGuest: user.isAnonymous || false
      // NO incloure email, nom, o dades personals
    } : null;

    if (window.Sentry) {
      window.Sentry.setUser(this.userContext);
    }
  }

  /**
   * Captura el rendiment de la pàgina
   * @param {Object} metrics - Mètriques de rendiment
   */
  capturePerformance(metrics) {
    if (!this.enabled) return;

    // [SEND] Enviar a analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'web_vitals',
        event_label: JSON.stringify(metrics)
      });
    }

    logger.log('[ErrorTracking] Performance captured:', metrics);
  }

  /**
   * Verifica si l'error és crític
   * @param {Error|string} error 
   * @returns {boolean}
   */
  _isCriticalError(error) {
    const criticalPatterns = [
      'NetworkError',
      'QuotaExceededError',
      'IndexedDB',
      'Out of memory',
      'SecurityError',
      '401',
      '403'
    ];

    const errorMessage = error instanceof Error ? error.message : String(error);
    return criticalPatterns.some(pattern => errorMessage.includes(pattern));
  }

  /**
   * Notifica error crític
   * @param {Object} errorData 
   */
  _notifyCriticalError(errorData) {
    // [ALERT] Podria enviar un webhook o email en errors crítics
    logger.warn('[ErrorTracking] CRITICAL ERROR:', errorData);

    // [STORAGE] Guardar per a recuperació
    const criticalErrors = JSON.parse(
      localStorage.getItem('sp_critical_errors') || '[]'
    );
    criticalErrors.push(errorData);
    localStorage.setItem('sp_critical_errors', JSON.stringify(criticalErrors.slice(-10)));
  }

  /**
   * Guarda error a localStorage
   * @param {Object} errorData 
   */
  _saveToLocalStorage(errorData) {
    try {
      const errors = JSON.parse(
        localStorage.getItem('sp_error_logs') || '[]'
      );
      errors.push(errorData);
      localStorage.setItem('sp_error_logs', JSON.stringify(errors.slice(-50)));
    } catch (e) {
      logger.error('[ErrorTracking] Failed to save to localStorage:', e);
    }
  }

  /**
   * Obté errors emmagatzemats localment
   * @returns {Array}
   */
  getLocalErrors() {
    try {
      return JSON.parse(localStorage.getItem('sp_error_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Neteja errors emmagatzemats
   */
  clearLocalErrors() {
    localStorage.removeItem('sp_error_logs');
    localStorage.removeItem('sp_critical_errors');
  }
}

// Singleton
export const errorTrackingService = new ErrorTrackingService();
export default errorTrackingService;
