class ThermoStore extends EventTarget {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      metrics: { nodes: 0, vram: 0, parseTime: 0, renderTime: 0, fps: 60, cls: 0, lcp: 0, longTasks: 0 },
      history: [],
      simulationRunning: false
    };
  }
  
  getState() { return this.state; }
  
  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
  }
  
  toggleConsole() { this.setState({ isOpen: !this.state.isOpen }); }
  toggleSimulation() { this.setState({ simulationRunning: !this.state.simulationRunning }); }
  updateMetrics(metrics) {
    const history = [...this.state.history.slice(-80), { ...metrics, timestamp: Date.now() }];
    this.setState({ metrics, history });
  }
}

export const useThermodynamicStore = new ThermoStore();
