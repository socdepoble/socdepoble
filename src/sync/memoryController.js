import { pruneStorage } from "./syncEngine";

export function initMemoryController() {
  setInterval(() => {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize;

      if (used > 200 * 1024 * 1024) {
        console.warn("⚠️ Memory pressure detected. Triggering garbage collection...");
        pruneStorage();
      }
    }
  }, 10000);
}
