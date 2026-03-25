// ✅ src/tests/services/geminiService.test.js - TESTS DEL SERVEI GEMINI
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { geminiService } from '../../services/geminiService';

// [MOCK] Fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// [MOCK] localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

// [MOCK] DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((str) => str)
  }
}));

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hauria de retornar resposta mock en mode simulació', async () => {
    mockLocalStorage.getItem.mockReturnValue('true');

    const result = await geminiService.ask('AGRONOM', 'Hola');

    expect(result.is_mock).toBe(true);
    expect(result.text).toContain('Mode Simulació');
  });

  it('hauria de cridar el proxy en mode producció', async () => {
    mockLocalStorage.getItem.mockReturnValue('false');
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Resposta de la IAIA' }]
          }
        }]
      })
    });

    const result = await geminiService.ask('AGRONOM', 'Hola');

    expect(mockFetch).toHaveBeenCalled();
    expect(result.is_mock).toBe(false);
    expect(result.text).toBe('Resposta de la IAIA');
  });

  it('hauria de manejar errors de connexió', async () => {
    mockLocalStorage.getItem.mockReturnValue('false');
    mockFetch.mockRejectedValue(new Error('Network error'));

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
