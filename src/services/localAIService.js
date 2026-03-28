import { logger } from '../utils/logger';

/**
 * LocalAIService (Pont Centaure)
 * Fase 3: Sobirania Cognitiva - Híbrid Cloud/Edge
 * 
 * Aquest servei s'encarregarà de gestionar els models LLM locals executats a l'Edge
 * via Web Workers (ex: WebLLM, Transformers.js) per dotar l'aplicació d'intel·ligència
 * sense dependre exclusivament del Cloud.
 */
class LocalAIService {
  constructor() {
    this.modelStatus = 'uninitialized'; // 'uninitialized', 'loading', 'ready', 'error'
    this.capabilities = {
      supportsWebGPU: false,
      memoryEstimate: 0
    };
  }

  /**
   * Verifica el maquinari del dispositiu per decidir quin model carregar.
   */
  async checkHardwareCapability() {
    try {
      this.capabilities.supportsWebGPU = !!navigator.gpu;
      // Estima memòria disponible si està suportat
      if (navigator.deviceMemory) {
        this.capabilities.memoryEstimate = navigator.deviceMemory;
      }
      logger.log('[Centaure] Configuració de maquinari per IA local establerta:', this.capabilities);
      return this.capabilities;
    } catch (err) {
      logger.error('[Centaure] Error comprovant el maquinari:', err);
      return this.capabilities;
    }
  }

  /**
   * Carrega el model LLM local a l'Edge (Web Worker).
   */
  async initModel(modelId = 'Llama-3.2-1B-Instruct-q4f32_1-1k') {
    if (this.modelStatus === 'ready' || this.modelStatus === 'loading') {
      return;
    }

    try {
      this.modelStatus = 'loading';
      logger.log(`[Centaure] Carregant model local: ${modelId} a l'Edge...`);
      
      // Aquí aniria la inicialització real amb WebLLM o pipeline local
      // const engine = await CreateMLCEngine(modelId, { initProgressCallback: console.log });
      
      this.modelStatus = 'ready';
      logger.log('[Centaure] Model local llest per operar!');
      return true;
    } catch (err) {
      this.modelStatus = 'error';
      logger.error('[Centaure] Error inicialitzant el pont Centaure:', err);
      return false;
    }
  }

  /**
   * Genera una resposta amb el model actiu, ja siga local o via fallback cloud.
   */
  // eslint-disable-next-line no-unused-vars
  async generateResponse(messages, options = {}) {
    if (this.modelStatus !== 'ready') {
      logger.warn('[Centaure] Model local no disponible. Cal activar protocol de fallback al núvol.');
      return "Model no inicialitzat. Activeu el descarregament a la configuració Mestre.";
    }

    try {
      logger.log('[Centaure] Generant resposta local...');
      // Simulació de latència d'inferència local
      await new Promise(resolve => setTimeout(resolve, 800));
      return "Sóc un agent executant-se a l'Edge i consumint 0 peticions al núvol, nano!";
    } catch (error) {
      logger.error('[Centaure] Error en la generació:', error);
      throw error;
    }
  }

  getStatus() {
    return this.modelStatus;
  }
}

export const localAIService = new LocalAIService();
