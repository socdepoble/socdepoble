// _scripts/websocket-crdt-client.js (versió avançada)
class CRDTWebSocketClient {
  constructor(url, crdtStore) {
    this.url = url;
    this.store = crdtStore;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 8;
    this.baseDelay = 1000;
    this.pingInterval = null;
    this.pongTimeout = null;
  }

  connect() {
    if (this.ws) this.ws.close();

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('🌐 WebSocket connectat');
      this.reconnectAttempts = 0;
      this.startPingPong();
      this.ws.send(JSON.stringify({ type: 'sync-request' }));
    };

    this.ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          clearTimeout(this.pongTimeout);
        } else if (data.type === 'remote-updates') {
          await this.store.mergeRemote(data.payload);
        }
      } catch (e) {
        console.error('❌ Dades corruptes rebudes:', e);
      }
    };

    this.ws.onclose = () => {
      console.warn('⚠️ WebSocket tancat');
      this.stopPingPong();
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => console.error('❌ WebSocket error:', err);
  }

  startPingPong() {
    this.stopPingPong();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
        this.pongTimeout = setTimeout(() => {
          console.warn('⏰ Pong timeout → reconnect');
          this.ws.close();
        }, 5000);
      }
    }, 15000);
  }

  stopPingPong() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.pongTimeout) clearTimeout(this.pongTimeout);
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('🔴 Màxim intents de reconnexió assolits');
      return;
    }

    const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`🔄 Reconnectant en ${delay}ms...`);
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  async sendUpdate(key, value) {
    await this.store.set(key, value);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'local-update',
        payload: { key, value, vectorClock: this.store.vectorClock?.clock }
      }));
    }
  }

  disconnect() {
    this.stopPingPong();
    if (this.ws) this.ws.close();
  }
}

export { CRDTWebSocketClient };
