// ✅ src/tests/mocks/server.js - MOCK SERVICE WORKER
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// [TEST] Servidor mock per a tests d'integració
export const server = setupServer(...handlers);
