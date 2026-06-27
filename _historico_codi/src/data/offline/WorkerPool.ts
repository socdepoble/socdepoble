// MAGIA VITE 6: Transforma esta URL en un asset estático con hash. 
// Cumple el CSP 'self' y evade los bloqueos de ejecución dinámica.
export const getCompressionWorker = () => {
  if (typeof window === 'undefined') return null;
  return new Worker(new URL('../workers/compression.worker.ts', import.meta.url), { 
    type: 'module',
    name: 'sdp-thermo-compressor' 
  });
};
