/**
 * Bootstrap del Core (ISO 1.4.0)
 * Orquestrador principal del Mas. No carrega YAML directament al navegador (per esquivar CORS).
 */
import { bus } from './teixit_conectiu/event-bus.mjs';
import { MinimalEngine } from './engine-minimal.mjs';

console.log("[Bootstrap] Iniciant seqüència d'arrancada del Mas...");

// Dades vitals (Simulacre de manifest compilat per a evitar problemes CORS descrits per Gemini)
window.MAS_MANIFEST = {
  version: "1.4.0",
  status: "GESTATION"
};

// Instanciem l'Engine de Supervivència 
const engine = new MinimalEngine(bus);

bus.emit('SYSTEM_START', { timestamp: Date.now() });

console.log(`[Bootstrap] Mas inicialitzat en estat: ${engine.getCurrentState()}`);
