// Worker per a processar tasques en segon pla (Kimi / Gemini v10.42)
self.onmessage = async (e) => {
  const { taskId, type, payload } = e.data;

  try {
    let result;
    switch (type) {
      case 'cart.add':
        result = await processCartAdd(payload);
        break;
      case 'cart.remove':
        result = await processCartRemove(payload);
        break;
      case 'connection.request':
        result = await processConnectionRequest(payload);
        break;
      case 'sync.events':
        result = await syncEvents(payload);
        break;
      default:
        throw new Error(`Tipus de tasca desconegut: ${type}`);
    }

    self.postMessage({
      taskId,
      status: 'success',
      result
    });
  } catch (err) {
    self.postMessage({
      taskId,
      status: 'error',
      error: err.message,
      stack: err.stack
    });
  }
};

// Funcions de processament simulades per descarregar el main thread
async function processCartAdd(item) {
  // Simular processament pesat (validació, sanitització)
  return {
    ...item,
    processedAt: Date.now(),
    id: item.id || `temp-${Date.now()}`
  };
}

async function processCartRemove(itemId) {
  return { itemId, removedAt: Date.now() };
}

async function processConnectionRequest(connection) {
  return { ...connection, processedAt: Date.now() };
}

async function syncEvents(events) {
  // En entorn real faríem un fetch a l'API
  const response = await fetch('/api/sync-events', {
    method: 'POST',
    body: JSON.stringify({ events }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Sync failed');
  return { success: true, syncedAt: Date.now() };
}
