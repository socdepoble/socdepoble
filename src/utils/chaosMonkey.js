import { logger } from './logger';
class ChaosMonkey {
  constructor() {
    this.enabled = localStorage.getItem('sp_chaos_mode') === 'true';
    this.dropRate = 0.30;
    this.throttleMs = 500;
    this.circuitBreakerTripped = false;

    // logger.info(`🐒 [ChaosMonkey] Inicializado. Estado: ${this.enabled ? 'ACTIVO' : 'INACTIVO'}`);
  }
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sp_chaos_mode', this.enabled.toString());
    logger.warn(`🐒 [ChaosMonkey] ${this.enabled ? 'ACTIVACIO CRITICA' : 'DESACTIVAT'}. DropRate: ${this.dropRate * 100}%, Latencia: ${this.throttleMs}ms`);
    return this.enabled;
  }

  /**
   * Intercepta flujo y aplica Chaos.
   * @returns {Promise<boolean>} Devuelve 'true' si el paquete debe ser descartado (Dropped).
   */
  async intercept() {
    if (!this.enabled) return false;
    if (this.circuitBreakerTripped) {
      logger.error('🐒 [ChaosMonkey] Circuit Breaker ABIERTO. Acceso denegado.');
      return true;
    }

    // 1. Packet Loss Simulation (30%)
    if (Math.random() < this.dropRate) {
      logger.error('🐒 [ChaosMonkey] Paquete droppeado intencionadamente (Packet Loss Simulation).');
      return true;
    }

    // 2. Latency Simulation (Throttling)
    logger.warn(`🐒 [ChaosMonkey] Reteniendo paquete por ${this.throttleMs}ms (Jitter Simulation)...`);
    return new Promise(resolve => setTimeout(() => resolve(false), this.throttleMs));
  }

  // Corta la red temporalmente (Soft disconnect)
  tripBreaker(duration = 5000) {
    if (!this.enabled) return;
    logger.error(`🚨 [ChaosMonkey] CIRCUIT BREAKER ACTIVADO! Red P2P / WebRTC caída por ${duration}ms`);
    this.circuitBreakerTripped = true;
    setTimeout(() => {
      this.circuitBreakerTripped = false;
      logger.warn('🟢 [ChaosMonkey] Circuit Breaker restablecido. Red funcional.');
    }, duration);
  }
}
export const chaosMonkey = new ChaosMonkey();