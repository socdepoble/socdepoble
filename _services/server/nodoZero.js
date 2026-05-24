const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });
const plaza = new Map(); // Mapa O(1) en RAM: peerId -> WebSocket

wss.on('connection', (ws) => {
  const peerId = Math.random().toString(36).slice(2, 10);
  plaza.set(peerId, ws);

  ws.on('message', (message) => {
    try {
      const { type, to, data } = JSON.parse(message);
      // ENRUTADOR CIEGO: El Nodo Zero pasa la oferta SDP sin parsear el contenido. No hay DB.
      if (type === 'SIGNAL' && to && plaza.has(to)) {
        plaza.get(to).send(JSON.stringify({ type: 'SIGNAL', from: peerId, data }));
      }
    } catch { return; /* Ignorar basura de escáneres web, proteger el hilo */ }
  });

  ws.on('close', () => plaza.delete(peerId));
});
console.log("🌾 [TRELLAT] El Campanar escolta al port 8080.");
