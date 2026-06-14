class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observer = null;
    this.intervalId = null;
  }

  start() {
    if (!this.isSupported()) {
      console.warn('[PerformanceMonitor] Performance API no suportada');
      return;
    }

    if (performance.memory) {
      this.intervalId = setInterval(() => {
        this.trackMemory();
      }, 5000);
    }

    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.trackLongTask(entry);
          }
        }
      });
      this.observer.observe({ entryTypes: ['longtask'] });
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  isSupported() {
    return typeof performance !== 'undefined';
  }

  trackMemory() {
    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const usagePercent = ((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2);

    if (parseFloat(usagePercent) > 80) {
      console.warn('[PerformanceMonitor] ⚠️ Ús de memòria alt:', usagePercent + '%');
    }
  }

  trackLongTask(entry) {
    const metric = {
      duration: entry.duration.toFixed(2),
      startTime: entry.startTime.toFixed(2),
      timestamp: Date.now()
    };
    console.warn('[PerformanceMonitor] ⚠️ Long Task detectat:', metric);
  }
}

export const performanceMonitor = new PerformanceMonitor();
