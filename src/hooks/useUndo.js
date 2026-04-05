import { useState } from 'react';

export function useUndo(initialState) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([]);

  const set = (newState) => {
    setHistory(h => [...h, state]);
    setState(newState);
  };

  const undo = () => {
    setHistory(h => {
      const prev = h[h.length - 1];
      if (prev !== undefined) setState(prev);
      return h.slice(0, -1);
    });
  };

  const canUndo = history.length > 0;

  return { state, set, undo, canUndo };
}
