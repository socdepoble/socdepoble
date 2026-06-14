// store.esqueletFlotant.js
// Pedra Seca - Estat global immutable amb subscripció selectiva
// Sense dependències. React 18+ useSyncExternalStore.

import React from 'react';

let globalState = {};
const listeners = new Map(); // key -> Set<listener>

function getSnapshot(key) {
  return globalState[key];
}

function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(callback);
  return () => {
    listeners.get(key)?.delete(callback);
    if (listeners.get(key)?.size === 0) listeners.delete(key);
  };
}

function setState(key, valueOrUpdater) {
  const prev = globalState[key];
  const next =
    typeof valueOrUpdater === 'function'
      ? valueOrUpdater(prev)
      : valueOrUpdater;

  if (Object.is(prev, next)) return; // immutable check

  globalState = { ...globalState, [key]: next };
  const callbacks = listeners.get(key);
  if (callbacks) {
    callbacks.forEach(cb => cb());
  }
}

export function createStore(initialState = {}) {
  globalState = { ...initialState };

  function useSlice(key, selector = v => v) {
    const sliceSnapshot = React.useCallback(
      () => selector(globalState[key]),
      [key, selector]
    );
    const subscribeToKey = React.useCallback(
      cb => subscribe(key, cb),
      [key]
    );
    return React.useSyncExternalStore(
      subscribeToKey,
      sliceSnapshot,
      sliceSnapshot // SSR amb mateix snapshot
    );
  }

  function get(key) {
    return globalState[key];
  }

  return { useSlice, get, set: setState };
}
