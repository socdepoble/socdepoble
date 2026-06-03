// tools/health-sentinel.js
// Health Sentinel - Psiquiatria de Màquina amb Anàlisi Forense de Memòria
// Versió Pulida

const fs = require('fs');
const path = require('path');
const heapdump = require('heapdump');

class HealthSentinel {
  constructor() {
    this.checks = [];
    this.memorySnapshots = [];
    this.leakThresholdMB = 18; // Llindar sensible per a dispositius antics
    this.dumpCounter = 0;
    this.reportsDir = path.join(process.cwd(), 'reports/memory-forense');
    
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async checkMemory() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    
    console.log(\`[Health Sentinel] Memòria Heap Utilitzada: \${heapUsedMB.toFixed(2)} MB\`);
    
    if (heapUsedMB > this.leakThresholdMB) {
      console.warn(\`[ALERTA TÀCTICA] Fuita de memòria detectada! (\${heapUsedMB.toFixed(2)} > \${this.leakThresholdMB} MB)\`);
      this.captureHeapDump();
    }
    
    return heapUsedMB;
  }

  captureHeapDump() {
    const timestamp = Date.now();
    this.dumpCounter++;
    const filename = path.join(this.reportsDir, \`forense-\${timestamp}-\${this.dumpCounter}.heapsnapshot\`);
    
    console.log(\`[Health Sentinel] Capturant Heap Dump forense a: \${filename}\`);
    heapdump.writeSnapshot(filename, (err, fn) => {
      if (err) console.error(\`[ERROR] No s'ha pogut capturar el heap dump: \${err}\`);
      else console.log(\`[Health Sentinel] Heap Dump desat amb èxit: \${fn}\`);
    });
  }

  startMonitoring(intervalMs = 300000) { // 5 minuts per defecte
    console.log(\`[Health Sentinel] Iniciant monitorització. Interval: \${intervalMs}ms\`);
    setInterval(() => {
      this.checkMemory();
    }, intervalMs);
  }
}

// Execució standalone si és cridat directament
if (require.main === module) {
  const sentinel = new HealthSentinel();
  sentinel.startMonitoring();
}

module.exports = HealthSentinel;
