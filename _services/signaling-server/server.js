import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    const { room, payload } = data;

    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }

    rooms.get(room).add(ws);

    rooms.get(room).forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  });

  ws.on("close", () => {
    rooms.forEach((clients) => clients.delete(ws));
  });
});

console.log("🚀 Minimal Signaling Server rodando en wss://localhost:8080");
