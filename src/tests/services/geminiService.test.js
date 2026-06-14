// ✅ src/tests/services/geminiService.test.js - TESTS DEL SERVEI GEMINI
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { geminiService } from '../../core/services/geminiService';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
let mockFetchCalled = false;

// [MOCK] localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
});
vi.stubEnv('VITE_SUPABASE_URL', 'http://localhost:54321');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'dummy-key');
vi.mock('../../utils/logger', () => ({
  logger: {
    debug: vi.fn((...args) => {}),
    error: vi.fn((...args) => {}),
    warn: vi.fn()
  }
}));

// [MOCK] DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(str => str)
  }
}));

// [MOCK] Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: null
        }
      })
    }
  }
}));
describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchCalled = false;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    server.resetHandlers();
  });
  it('hauria de retornar resposta mock en mode simulació', async () => {
    mockLocalStorage.getItem.mockReturnValue('true');
    const result = await geminiService.ask('AGRONOM', 'genesis directiva');
    expect(result.is_mock).toBe(true);
    expect(result.text).toContain('GÈNESI');
  });
  it('hauria de cridar el proxy en mode producció', async () => {
    mockLocalStorage.getItem.mockReturnValue('false');
    server.use(http.post('*/functions/v1/gemini-proxy', () => {
      mockFetchCalled = true;
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const payload = JSON.stringify({
            candidates: [{
              content: {
                parts: [{
                  text: 'Resposta de la IAIA'
                }]
              }
            }]
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\ndata: [DONE]\n\n`));
          controller.close();
        }
      });
      return new HttpResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream'
        }
      });
    }));
    const result = await geminiService.ask('AGRONOM', 'Hola');
    expect(mockFetchCalled).toBe(true);
    expect(result.is_mock).toBeUndefined();
    expect(result.text).toBe('Resposta de la IAIA');
  });
  it('hauria de manejar errors de connexió', async () => {
    mockLocalStorage.getItem.mockReturnValue('false');
    server.use(http.post('*/functions/v1/gemini-proxy', () => {
      return HttpResponse.error();
    }));
    const result = await geminiService.ask('AGRONOM', 'Hola');
    expect(result.error).toBe(true);
    expect(result.message).toContain('migdiada');
  });
  it('hauria de trobar persona per slug', () => {
    const persona = geminiService.getPersonaBySlug('vicentferris');
    expect(persona).toBeDefined();
    expect(persona.personaKey).toBe('AGRONOM');
  });
  it('hauria de retornar null per slug invàlid', () => {
    const persona = geminiService.getPersonaBySlug(null);
    expect(persona).toBeNull();
  });
});