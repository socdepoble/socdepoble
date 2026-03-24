// ✅ src/tests/mocks/handlers.js - HANDLERS PER A TESTS
import { http, HttpResponse } from 'msw';

const API_BASE = 'https://api.socdepoble.org';

export const handlers = [
  // [AUTH] Login mock
  http.post(`${API_BASE}/auth/v1/token`, async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock_jwt_token_12345',
        refresh_token: 'mock_refresh_token_67890',
        expires_in: 3600
      });
    }
    
    return HttpResponse.json(
      { error: 'invalid_credentials' },
      { status: 401 }
    );
  }),

  // [AUTH] Get User mock
  http.get(`${API_BASE}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Usuari Test',
      role: 'neighbor'
    });
  }),

  // [POSTS] Get Posts mock
  http.get(`${API_BASE}/rest/v1/posts`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '10';
    
    return HttpResponse.json([
      {
        id: 'post-1',
        uuid: '11111111-1111-1111-1111-111111111111',
        content: 'Post de prova 1',
        author_name: 'Usuari Test',
        created_at: new Date().toISOString(),
        type: 'post'
      },
      {
        id: 'post-2',
        uuid: '22222222-2222-2222-2222-222222222222',
        content: 'Post de prova 2',
        author_name: 'Veïna Test',
        created_at: new Date().toISOString(),
        type: 'mercat'
      }
    ].slice(0, parseInt(limit)));
  }),

  // [IAIA] Gemini Proxy mock
  http.post(`${API_BASE}/functions/v1/gemini-proxy`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      candidates: [{
        content: {
          parts: [{
            text: `Resposta mock de la IAIA per a: ${body.personaKey || 'general'}`
          }]
        }
      }]
    });
  }),

  // [PROFILE] Get Profile mock
  http.get(`${API_BASE}/rest/v1/profiles`, ({ request }) => {
    return HttpResponse.json([{
      id: 'test-user-id',
      full_name: 'Usuari Test',
      role: 'neighbor',
      avatar_url: '/default-avatar.png',
      created_at: new Date().toISOString()
    }]);
  }),

  // [ERROR] Simular error 500
  http.get(`${API_BASE}/rest/v1/error-test`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  })
];
