// src/hooks/useSpriteAnimator.js
import { useRef, useCallback } from "react";

/*
  useSpriteAnimator
  - targetRef: ref del node SVG o wrapper
  - sequences: objecte amb seqüències per a aquest sprite (nom -> array steps)
  - opts: { autoReset: true, debug: false }
  Retorna:
    - trigger(name) -> executa seqüència local
    - triggerGlobal(spriteRef, name) -> executa seqüència en un ref concret
    - runMacro(macroSteps) -> executa passos encadenats entre sprites
    - stopAll() -> neteja classes temporals
*/
export default function useSpriteAnimator(targetRef, sequences = {}, opts = {}) {
  const runningRef = useRef(new Set());
  const timersRef = useRef([]);
  const defaultOpts = {
    autoReset: true,
    debug: false
  };
  const {
    autoReset,
    debug
  } = {
    ...defaultOpts,
    ...opts
  };
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);
  const runStepOnNode = useCallback((node, cls, duration) => {
    if (!node) return;
    node.classList.add(cls);
    if (duration && duration > 0) {
      const key = `${node.dataset.part || node.id}::${cls}`;
      runningRef.current.add(key);
      const t = setTimeout(() => {
        node.classList.remove(cls);
        runningRef.current.delete(key);
      }, duration);
      timersRef.current.push(t);
    }
  }, []);
  const runStep = useCallback((root, step) => {
    if (!root) return;
    const {
      selector,
      className,
      duration = 800
    } = step;
    const nodes = root.querySelectorAll(selector);
    nodes.forEach(n => runStepOnNode(n, className, duration));
    if (debug) {}
  }, [runStepOnNode, debug]);
  const schedule = useCallback((root, step, baseDelay = 0) => {
    const delay = step.delay || 0;
    const t = setTimeout(() => runStep(root, step), baseDelay + delay);
    timersRef.current.push(t);
    return t;
  }, [runStep]);
  const trigger = useCallback(name => {
    if (!targetRef.current) return;
    const seq = sequences[name];
    if (!seq) return;
    const base = 0;
    seq.forEach(step => schedule(targetRef.current, step, base));
    if (autoReset) {
      const maxDelay = Math.max(...seq.map(s => (s.delay || 0) + (s.duration || 800)));
      const t = setTimeout(() => {
        seq.forEach(s => {
          const nodes = targetRef.current.querySelectorAll(s.selector);
          nodes.forEach(n => n.classList.remove(s.className));
        });
      }, maxDelay + 50);
      timersRef.current.push(t);
    }
  }, [targetRef, sequences, schedule, autoReset]);

  // trigger on arbitrary root (for multi-sprite macros)
  const triggerOnRoot = useCallback((root, name, seqObj) => {
    if (!root || !seqObj) return;
    const seq = seqObj[name];
    if (!seq) return;
    seq.forEach(step => schedule(root, step, 0));
    if (autoReset) {
      const maxDelay = Math.max(...seq.map(s => (s.delay || 0) + (s.duration || 800)));
      const t = setTimeout(() => {
        seq.forEach(s => {
          const nodes = root.querySelectorAll(s.selector);
          nodes.forEach(n => n.classList.remove(s.className));
        });
      }, maxDelay + 50);
      timersRef.current.push(t);
    }
  }, [schedule, autoReset]);

  // Macro runner: accepts array of { root: DOMNode, steps: [ {selector,className,delay,duration} ], offset }
  const runMacro = useCallback((macroSteps = []) => {
    clearTimers();
    macroSteps.forEach(block => {
      const {
        root,
        steps = [],
        offset = 0
      } = block;
      steps.forEach(step => {
        const t = setTimeout(() => {
          if (root) runStep(root, step);
        }, offset + (step.delay || 0));
        timersRef.current.push(t);
      });
      if (autoReset && root && steps.length) {
        const maxDelay = Math.max(...steps.map(s => (s.delay || 0) + (s.duration || 800)));
        const t2 = setTimeout(() => {
          steps.forEach(s => {
            const nodes = root.querySelectorAll(s.selector);
            nodes.forEach(n => n.classList.remove(s.className));
          });
        }, offset + maxDelay + 50);
        timersRef.current.push(t2);
      }
    });
  }, [clearTimers, runStep, autoReset]);
  const stopAll = useCallback(() => {
    clearTimers();
    if (targetRef.current) {
      Object.values(sequences).flat().forEach(s => {
        const nodes = targetRef.current.querySelectorAll(s.selector);
        nodes.forEach(n => n.classList.remove(s.className));
      });
    }
    runningRef.current.clear();
  }, [clearTimers, sequences, targetRef]);
  return {
    trigger,
    triggerOnRoot,
    runMacro,
    stopAll,
    clearTimers
  };
}