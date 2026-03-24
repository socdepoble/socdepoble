// ✅ src/tests/setup.js - SETUP GLOBAL PER A VITEST
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/server';

// [NETEJA] Netejar DOM després de cada test
afterEach(() => {
  cleanup();
});

// [MOCK] Servidor MSW per a tests d'integració
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// [MOCK] localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

global.localStorage = localStorageMock;

// [MOCK] matchMedia (per a tests responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// [MOCK] fetch global
global.fetch = vi.fn();

// [UTIL] Helper per a esperar
global.waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// [LOG] Silenciar logs en tests (opcional)
console.log = vi.fn();
console.warn = vi.fn();
console.error = vi.fn();
