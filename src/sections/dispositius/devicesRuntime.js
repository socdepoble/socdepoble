const DEVICE_PROFILE_KEY = 'socdepoble-device-profile-v1';
const DEVICE_CHAT_KEY_PREFIX = 'socdepoble-device-chat-v1';
const DEVICE_CONNECTIONS_KEY_PREFIX = 'socdepoble-device-connections-v1';
const DEVICE_SELECTED_PEER_KEY_PREFIX = 'socdepoble-device-selected-peer-v1';
const CHANNEL_NAME = 'socdepoble-device-bridge-v1';

export const PRESENCE_HEARTBEAT_MS = 5000;
export const PRESENCE_STALE_MS = 16000;

const isBrowser = typeof window !== 'undefined';

const readJson = (key, fallback) => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors for local live features.
  }
};

const randomToken = () => Math.random().toString(36).slice(2, 10);

const createDeviceId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `device-${Date.now()}-${randomToken()}`;
};

const buildDefaultName = () => `Portal ${randomToken().slice(0, 4).toUpperCase()}`;

export function loadDeviceProfile() {
  const fallback = {
    id: createDeviceId(),
    name: buildDefaultName(),
    kind: 'portal',
    createdAt: Date.now()
  };

  const stored = readJson(DEVICE_PROFILE_KEY, fallback);
  const profile = {
    ...fallback,
    ...stored,
    id: stored?.id || fallback.id,
    name: stored?.name || fallback.name
  };

  writeJson(DEVICE_PROFILE_KEY, profile);
  return profile;
}

export function saveDeviceProfile(profile) {
  writeJson(DEVICE_PROFILE_KEY, profile);
}

export function loadDeviceChats(deviceId) {
  return readJson(`${DEVICE_CHAT_KEY_PREFIX}::${deviceId}`, {});
}

export function saveDeviceChats(deviceId, chats) {
  writeJson(`${DEVICE_CHAT_KEY_PREFIX}::${deviceId}`, chats);
}

export function loadDeviceConnections(deviceId) {
  return readJson(`${DEVICE_CONNECTIONS_KEY_PREFIX}::${deviceId}`, {});
}

export function saveDeviceConnections(deviceId, connections) {
  writeJson(`${DEVICE_CONNECTIONS_KEY_PREFIX}::${deviceId}`, connections);
}

export function loadSelectedPeer(deviceId) {
  return readJson(`${DEVICE_SELECTED_PEER_KEY_PREFIX}::${deviceId}`, '');
}

export function saveSelectedPeer(deviceId, peerId) {
  writeJson(`${DEVICE_SELECTED_PEER_KEY_PREFIX}::${deviceId}`, peerId);
}

export function createChatMessage({ sender, text, author }) {
  return {
    id: `msg-${Date.now()}-${randomToken()}`,
    sender,
    text,
    author,
    sentAt: Date.now()
  };
}

export function createDeviceBridge(selfDevice, handlers) {
  if (!isBrowser || typeof BroadcastChannel === 'undefined') {
    return null;
  }

  const channel = new BroadcastChannel(CHANNEL_NAME);

  const post = (payload) => {
    channel.postMessage({
      ...payload,
      sentAt: Date.now()
    });
  };

  const announcePresence = () => {
    post({
      type: 'presence:announce',
      device: {
        id: selfDevice.id,
        name: selfDevice.name,
        kind: selfDevice.kind,
        lastSeen: Date.now()
      }
    });
  };

  const onMessage = (event) => {
    const payload = event.data;
    if (!payload || typeof payload !== 'object') return;

    if (payload.device?.id && payload.device.id === selfDevice.id) return;
    if (payload.fromId && payload.fromId === selfDevice.id) return;

    switch (payload.type) {
      case 'presence:request':
        announcePresence();
        break;
      case 'presence:announce':
        handlers.onPresence?.(payload.device);
        break;
      case 'connect:request':
        if (payload.toId === selfDevice.id) {
          handlers.onConnectRequest?.(payload.fromId);
        }
        break;
      case 'connect:accept':
        if (payload.toId === selfDevice.id) {
          handlers.onConnectAccept?.(payload.fromId);
        }
        break;
      case 'connect:decline':
        if (payload.toId === selfDevice.id) {
          handlers.onConnectDecline?.(payload.fromId);
        }
        break;
      case 'message:send':
        if (payload.toId === selfDevice.id) {
          handlers.onMessage?.(payload.fromId, payload.message);
        }
        break;
      case 'connect:disconnect':
        if (payload.toId === selfDevice.id) {
          handlers.onDisconnect?.(payload.fromId);
        }
        break;
      default:
        break;
    }
  };

  channel.addEventListener('message', onMessage);

  const heartbeat = window.setInterval(() => {
    announcePresence();
  }, PRESENCE_HEARTBEAT_MS);

  post({ type: 'presence:request', fromId: selfDevice.id });
  announcePresence();

  return {
    announcePresence,
    requestPresence() {
      post({ type: 'presence:request', fromId: selfDevice.id });
    },
    requestConnection(targetId) {
      post({ type: 'connect:request', fromId: selfDevice.id, toId: targetId });
    },
    acceptConnection(targetId) {
      post({ type: 'connect:accept', fromId: selfDevice.id, toId: targetId });
    },
    declineConnection(targetId) {
      post({ type: 'connect:decline', fromId: selfDevice.id, toId: targetId });
    },
    sendMessage(targetId, message) {
      post({ type: 'message:send', fromId: selfDevice.id, toId: targetId, message });
    },
    disconnectConnection(targetId) {
      post({ type: 'connect:disconnect', fromId: selfDevice.id, toId: targetId });
    },
    destroy() {
      window.clearInterval(heartbeat);
      channel.removeEventListener('message', onMessage);
      channel.close();
    }
  };
}
