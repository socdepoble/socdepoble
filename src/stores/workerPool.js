// Pool de Workers limitat per evitar ofegar l'A10 (Kimi / Gemini v10.42)
const MAX_WORKERS = (() => {
  if (typeof navigator !== 'undefined') {
    return navigator.deviceMemory <= 2 ? 1 : 2;
  }
  return 1; // Fallback
})();

const workerPool = new Set();
let taskId = 0;

export const getWorker = () => {
  if (workerPool.size >= MAX_WORKERS) {
    return workerPool.values().next().value;
  }

  const worker = new Worker(new URL('../workers/sospWorker.js', import.meta.url), { type: 'module' });
  workerPool.add(worker);

  worker.onerror = (err) => {
    console.error('[WorkerPool] Error al worker:', err);
    workerPool.delete(worker);
    worker.terminate();
  };

  return worker;
};

export const releaseWorker = (worker) => {
  workerPool.delete(worker);
  worker.terminate();
};

export const processInWorker = (type, payload) => {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    const currentTaskId = taskId++;

    const messageHandler = (e) => {
      const { taskId: responseTaskId, status, result, error, stack } = e.data;
      if (responseTaskId === currentTaskId) {
        worker.removeEventListener('message', messageHandler);
        // Si no alliberem immediatament, reutilitzem. Gemini diu de terminar-lo per purgar memòria, 
        // però releaseWorker() el mata. Comprovem si el matem o el guardem:
        // Optem per no matar-lo a cada crida per guanyar velocitat en l'A10, excepte en el destroy() del Store.
        
        if (status === 'success') {
          resolve(result);
        } else {
          const err = new Error(error);
          err.stack = stack;
          reject(err);
        }
      }
    };

    worker.addEventListener('message', messageHandler);
    worker.postMessage({ taskId: currentTaskId, type, payload });
  });
};

export const destroyWorkerPool = () => {
  workerPool.forEach(worker => worker.terminate());
  workerPool.clear();
};
