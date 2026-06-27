/**
 * MinimalEngine - El "Cervell Reptilià" (ISO 1.4.0)
 * Recomanat per Kimi per assegurar la supervivència si falla l'Engine complex (YAML/IA).
 */
export class MinimalEngine {
  constructor(eventBus) {
    this.bus = eventBus;
    this.state = 'NASCENT';
    
    this.bus.subscribe('UDR_CRITICAL_SPIKE', () => {
      this.transitionTo('QUARANTENA');
    });

    this.bus.subscribe('MANUAL_OVERRIDE_RECOVER', () => {
      if (this.state === 'QUARANTENA') {
        this.transitionTo('REGENERANT');
        setTimeout(() => this.transitionTo('ESTABLE'), 2000);
      }
    });
  }

  transitionTo(newState) {
    console.warn(`[MinimalEngine] Transició: ${this.state} -> ${newState}`);
    this.state = newState;
    this.bus.emit('STATE_CHANGED', { state: this.state });
  }

  getCurrentState() {
    return this.state;
  }
}
