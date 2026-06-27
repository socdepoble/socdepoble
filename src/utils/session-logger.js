// src/utils/session-logger.js — Col·locar a utils i cridar al final de cada sessió important

const metrics = {
  timestamp: new Date().toISOString(),
  sessionId: `sess_${Date.now()}`,
  it: calculateTrellatIndex(),           // Funció que implementa la fórmula
  udr: calculateUDR([]),
  ce: calculateCognitiveEfficiency(1000, 850),
  ramUsage: performance.memory ? (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100) : null,
  fps: getAverageFPS(),                  // Mesurat amb requestAnimationFrame
  tombstoneSize: getCRDTSize(),          // Estimació de Y.js document
  frictionIndex: 0,
  masterFatigue: 1, // 1-5 (pregunta al Mestre)
};

console.log("📊 [CONSOLA TERMODINÀMICA] Informe de Sessió:", metrics);

// Dummy functions for now
function calculateTrellatIndex() { return 95; }
function calculateUDR(changedFiles) { return 2; }
function calculateCognitiveEfficiency(tokensUsed, tokensUseful) { return 85; }
function getAverageFPS() { return 55; }
function getCRDTSize() { return 8; }
