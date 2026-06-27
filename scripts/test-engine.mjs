// scripts/test-engine.mjs
// Test de Sanity obligatori exigit per Qwen abans de desplegar.

import { MinimalEngine } from '../core/engine-minimal.mjs';
import { EventBus } from '../core/teixit_conectiu/event-bus.mjs';

console.log("🧪 Iniciant Sanity Test de l'Engine (ISO 1.4.0)...");

try {
  const bus = new EventBus();
  const engine = new MinimalEngine(bus);

  if (engine.getCurrentState() !== 'NASCENT') {
    throw new Error(`Estat inicial incorrecte: ${engine.getCurrentState()}`);
  }
  console.log("✅ Test 1: Estat inicial NASCENT correcte.");

  // Simulem un pic crític de UDR
  bus.emit('UDR_CRITICAL_SPIKE', { value: 18 });
  
  if (engine.getCurrentState() !== 'QUARANTENA') {
    throw new Error("L'Engine no ha transicionat a QUARANTENA després d'un pic d'UDR.");
  }
  console.log("✅ Test 2: Transició a QUARANTENA d'emergència correcta.");

  // Simulem un override manual
  bus.emit('MANUAL_OVERRIDE_RECOVER', {});
  
  if (engine.getCurrentState() !== 'REGENERANT') {
    throw new Error("L'Engine no ha transicionat a REGENERANT amb el manual override.");
  }
  console.log("✅ Test 3: Override cap a REGENERANT correcte.");
  
  console.log("🎉 Tots els sanity tests de la Pedra Seca han passat en verd!");
  process.exit(0);
} catch (error) {
  console.error("❌ SANITY TEST FALLAT:");
  console.error(error.message);
  process.exit(1);
}
