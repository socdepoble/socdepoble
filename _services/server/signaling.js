import { WebSocketServer } from 'ws';
import http from 'http';
import { randomUUID } from 'crypto';

const server = http.createServer();
const wss = new WebSocketServer({ server });

const peers = new Map(); // id -> ws

wss.on('connection', (ws) => {
  const id = randomUUID();
  peers.set(id, ws);

  ws.send(JSON.stringify({ type: 'WELCOME', id }));

  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch { return; }

    const { to, type } = data;

    // relay directo
    if (to && peers.has(to)) {
      peers.get(to).send(JSON.stringify({
        ...data,
        from: id
      }));
    }

    // broadcast discovery
    if (type === 'DISCOVER') {
      const list = [...peers.keys()].filter(p => p !== id);

      ws.send(JSON.stringify({
        type: 'PEER_LIST',
        peers: list.slice(0, 10)
      }));
    }
  });

  ws.on('close', () => {
    peers.delete(id);
  });
});

server.listen(3000, () => {
  console.log('Sóc de Poble Minimalist Signaling Server running on port :3000');
});
