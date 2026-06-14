// lib/eventBus.js
// Pedra Seca v10.41 - Bus d'Esdeveniments Lleuger (Zero Dependències)

import { saveEventToQueue, SOSPStore } from '../stores/SOSPStore';

export const SDP = Object.freeze({
  TRANSLATE: 'sdp:translate',
  COMMENT:   'sdp:comment',
  SHARE:     'sdp:share',
  ADD_CART:  'sdp:add-to-cart',
  CONNECT:   'sdp:connect',
});

const SDP_SECRET = import.meta.env.VITE_SDP_SECRET || 'pedra-seca-2026';
export const signEvent = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${SDP_SECRET}-${timestamp}-${random}`;
};

export const verifyEvent = (detail, expectedType) => {
  if (!detail?._sig) return false;
  const parts = detail._sig.split('-');
  if (parts.length < 3) return false;
  
  // parts[0] pot contenir guions si el secret els té, simplifiquem:
  const counterStr = parts.pop();
  const timestampStr = parts.pop();
  const secret = parts.join('-');
  
  if (secret !== SDP_SECRET) return false;
  
  const timestamp = parseInt(timestampStr, 10);
  const now = Date.now();
  const MAX_AGE_MS = 5 * 60 * 1000; // 5 minuts
  
  if (now - timestamp > MAX_AGE_MS) return false;
  if (expectedType && !Object.values(SDP).includes(expectedType)) return false;
  
  return true;
};

const listenersMap = new Map();

export const emit = (type, payload) => {
  if (typeof window === 'undefined') return;
  
  if (!Object.values(SDP).includes(type)) {
    console.warn(`[SDP] Tipus d'event desconegut: ${type}`);
    return;
  }

  const triggerId = document.activeElement?.id || null;
  const ts = Date.now();
  
  const eventPayload = {
    ...payload,
    triggerId,
    ts
  };
  
  if (type === SDP.SHARE) {
    eventPayload.sourceUrl = window.location.href;
  }

  // Validació origen
  eventPayload._sig = signEvent();

  if (!navigator.onLine) {
    // Toast de feedback offline immediat (Kimi)
    SOSPStore.actions.ui.toast("Sense connexió. Guardat per a enviar més tard.", "warning");
    saveEventToQueue(type, eventPayload).catch(console.error);
    return;
  }

  const event = new CustomEvent(type, { 
    detail: eventPayload,
    bubbles: false,
    composed: false
  });

  // Cua de macrotasques per no bloquejar el repintat de la UI
  const dispatcher = () => window.dispatchEvent(event);
  if (typeof queueMicrotask !== 'undefined') {
    queueMicrotask(dispatcher);
  } else {
    Promise.resolve().then(dispatcher);
  }
};

export const on = (type, handler) => {
  if (typeof window === 'undefined') return () => {};
  const wrapped = (e) => handler(e.detail);
  window.addEventListener(type, wrapped);
  
  const listenerId = Symbol();
  listenersMap.set(listenerId, { type, wrapped });
  
  return () => {
    window.removeEventListener(type, wrapped);
    listenersMap.delete(listenerId);
  };
};

export const clearAllListeners = () => {
  listenersMap.forEach(({ type, wrapped }) => {
    window.removeEventListener(type, wrapped);
  });
  listenersMap.clear();
};
