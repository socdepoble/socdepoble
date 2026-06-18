// WebSocketClient amb Exponential Backoff per a iOS antic
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelays = [1000, 2000, 4000, 8000, 16000]; // 1s, 2s, 4s, 8s, 16s
    this.listeners = new Set();
    this.messageQueue = [];
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('[WS] Connexió establerta');
      this.flushQueue(); 
      this.listeners.forEach(listener => listener({ type: 'OPEN' }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(listener => listener({ type: 'MESSAGE', data }));
      } catch (err) {
        console.error('[WS] Error parsejant missatge:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Connexió tancada');
      this.listeners.forEach(listener => listener({ type: 'CLOSE' }));
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error:', err);
      this.listeners.forEach(listener => listener({ type: 'ERROR', error: err }));
    };
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Màxim intents de reconnexió assolit');
      return;
    }

    const delay = this.reconnectDelays[Math.min(this.reconnectAttempts, this.reconnectDelays.length - 1)];
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }

  send(message) {
    const messageStr = JSON.stringify(message);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(messageStr);
      return true;
    } else {
      this.messageQueue.push(messageStr);
      return false;
    }
  }

  flushQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.messageQueue = [];
  }
}

export const wsClient = new WebSocketClient(
  import.meta.env.VITE_WS_URL || 'wss://api.socdepoble.org/ws'
);
