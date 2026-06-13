import "@testing-library/jest-dom/extend-expect";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// Polyfills / mocks for browser APIs used by layout hooks
global.ResizeObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Ensure env(safe-area-inset-top) fallback for tests
const style = document.createElement("style");
style.innerHTML = ":root { --sdp-safe-top: 0px; }";
document.head.appendChild(style);
