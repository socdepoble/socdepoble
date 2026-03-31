// ✅ src/services/healthCheckService.js - HEALTH CHECK AUTOMÀTIC
import { logger } from '../utils/logger';
import { supabase } from '../supabaseClient';

/**
 * 🏺 HEALTH CHECK SERVICE [v10.33.16]
 * Monitoritza la salut del sistema en temps real.
 */
class HealthCheckService {
  constructor() {
    this.checkInterval = 60000; // 1 minut
    this.lastCheck = null;
    this.healthStatus = {
      api: 'unknown',
      database: 'unknown',
      storage: 'unknown',
      performance: 'unknown',
      overall: 'unknown'
    };
    this.listeners = new Set();
  }

  /**
   * Inicia el monitoratge continu
   */
  startMonitoring() {
    if (this.intervalId) {
        this.stopMonitoring();
    }
    // logger.log('[HealthCheck] Starting monitoring...');
    
    // Check inicial
    this.runHealthCheck();
    
    // Check periòdic
    this.intervalId = setInterval(() => {
      this.runHealthCheck();
    }, this.checkInterval);
  }

  /**
   * Atura el monitoratge
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // logger.log('[HealthCheck] Monitoring stopped');
  }

  /**
   * Executa tots els checks de salut
   */
  async runHealthCheck() {
    const timestamp = new Date().toISOString();
    this.lastCheck = timestamp;

    const results = {
      timestamp,
      checks: {}
    };

    // [CHECK] API Connectivity
    results.checks.api = await this._checkAPI();
    
    // [CHECK] Database Connection
    results.checks.database = await this._checkDatabase();
    
    // [CHECK] Storage Availability
    results.checks.storage = await this._checkStorage();
    
    // [CHECK] Performance Metrics
    results.checks.performance = await this._checkPerformance();

    // [OVERALL] Calcular estat general
    results.overall = this._calculateOverall(results.checks);
    this.healthStatus = results;

    // [NOTIFY] Notificar listeners
    this._notifyListeners(results);

    // [LOG] Guardar si hi ha problemes
    if (results.overall !== 'healthy') {
      logger.warn('[HealthCheck] System not healthy:', results);
    }

    return results;
  }

  /**
   * Check de connectivitat API
   */
  async _checkAPI() {
    try {
      if (import.meta.env.DEV) return { status: 'healthy', message: 'Mocked in Dev' };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/health', {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { status: 'healthy', latency: response.headers.get('X-Response-Time') };
      }
      
      return { status: 'degraded', error: `HTTP ${response.status}` };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check de connexió Database
   */
  async _checkDatabase() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        // Error esperat si la taula no existeix, només verifiquem connexió
        if (error.code === '42P01') {
          return { status: 'healthy', message: 'Connection OK' };
        }
        return { status: 'degraded', error: error.message };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check d'emmagatzematge local
   */
  async _checkStorage() {
    try {
      // Test localStorage
      const testKey = '_health_check_test';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (value !== 'test') {
        return { status: 'degraded', error: 'localStorage not working properly' };
      }

      // Check quota
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usagePercent = (estimate.usage / estimate.quota) * 100;
        
        if (usagePercent > 90) {
          return { status: 'warning', usage: `${usagePercent.toFixed(2)}%` };
        }
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check de rendiment
   */
  async _checkPerformance() {
    try {
      if (!performance || !performance.getEntriesByType) {
        return { status: 'unknown', message: 'Performance API not available' };
      }

      const navigation = performance.getEntriesByType('navigation')[0];
      if (!navigation) {
        return { status: 'unknown', message: 'No navigation entry' };
      }

      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd,
        loadComplete: navigation.loadEventEnd,
        firstByte: navigation.responseStart
      };

      // Evaluar si és acceptable
      if (metrics.loadComplete > 5000) {
        return { status: 'warning', metrics, message: 'Slow load time' };
      }

      return { status: 'healthy', metrics };
    } catch (error) {
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Calcula l'estat general
   */
  _calculateOverall(checks) {
    const statuses = Object.values(checks).map(c => c.status);
    
    if (statuses.includes('unhealthy')) {
      return 'unhealthy';
    }
    
    if (statuses.includes('degraded') || statuses.includes('warning')) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Subscriu un listener
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifica tots els listeners
   */
  _notifyListeners(results) {
    this.listeners.forEach(listener => {
      try {
        listener(results);
      } catch (error) {
        logger.error('[HealthCheck] Listener error:', error);
      }
    });
  }

  /**
   * Obté l'estat actual
   */
  getStatus() {
    return this.healthStatus;
  }
}

// Singleton
export const healthCheckService = new HealthCheckService();
export default healthCheckService;
