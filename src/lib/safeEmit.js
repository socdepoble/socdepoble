// src/lib/safeEmit.js
import { emit, SDP as RAW_SDP } from './eventBus';
import { logError } from './logger';

const DEFAULT_SDP = {
  TRANSLATE: 'sdp:translate',
  COMMENT: 'sdp:comment',
  SHARE: 'sdp:share',
  ADD_CART: 'sdp:add-to-cart',
  CONNECT: 'sdp:connect'
};

const SDP = { ...DEFAULT_SDP, ...(RAW_SDP || {}) };

export default function safeEmit(eventKeyOrName, payload = {}) {
  try {
    const eventName = SDP?.[eventKeyOrName] ?? eventKeyOrName;
    if (!eventName) return;
    emit(eventName, payload);
  } catch (err) {
    logError(err, { module: 'safeEmit', eventKeyOrName, payload });
  }
}
