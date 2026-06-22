// src/lib/safeEmit.js
import { emit, SDP as RAW_SDP } from './eventBus';
import { logError } from './logger';

const DEFAULT_SDP = {
  TRANSLATE: 'sdp:translate',
  COMMENT:   'sdp:comment',
  SHARE:     'sdp:share',
  ADD_CART:  'sdp:add-to-cart',
  CONNECT:   'sdp:connect'
};

function resolveEvent(eventKeyOrName) {
  const sdp = {
    ...DEFAULT_SDP,
    ...(RAW_SDP || {})
  };
  return sdp[eventKeyOrName] ?? eventKeyOrName;
}

export default function safeEmit(eventKeyOrName, payload = {}) {
  try {
    const eventName = resolveEvent(eventKeyOrName);
    if (!eventName) return;
    emit(eventName, payload);
  } catch (err) {
    logError(err, { module: 'safeEmit', eventKeyOrName, payload });
  }
}

export function emitUI(eventKey, payload = {}) {
  if (typeof window !== 'undefined' && navigator?.vibrate) {
    navigator.vibrate(10);
  }
  safeEmit(eventKey, payload);
}
