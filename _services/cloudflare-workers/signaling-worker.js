/* global ENV, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WebSocketPair */
 
import { JWTParser } from 'jwt-verify';

// Configuración: clave secreta de Supabase (JWT) – s'ha d'obtenir de les variables d'entorn al Worker
const SUPABASE_JWT_SECRET = ENV.SUPABASE_JWT_SECRET;

async function verifySupabaseJWT(token) {
  try {
    const { payload } = await JWTParser(token, SUPABASE_JWT_SECRET);
    return payload; 
  } catch (e) {
    return null;
  }
}

async function canJoinRoom(userId, roomId) {
  // Trucada a Supabase per comprovar la pertinença a la sala saltant la RLS via service role
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_room_membership`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, room_id: roomId }),
  });
  const result = await response.json();
  return result === true;
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/ws') {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    const token = url.searchParams.get('token') || request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response('Missing token', { status: 401 });
    }

    const payload = await verifySupabaseJWT(token);
    if (!payload) {
      return new Response('Invalid token', { status: 403 });
    }

    const userId = payload.sub || payload.user_id;
    const roomId = url.searchParams.get('roomId') || 'default';
    
    // Si la verificació de sala està activa:
    // if (!(await canJoinRoom(userId, roomId))) return new Response('Forbidden', { status: 403 });

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();

    // Lògica base de retransmissió de missatges P2P
    // Ací Cloudflare Durable Objects s'encarregarien de gestionar la "Room"

    return new Response(null, { status: 101, webSocket: client });
  }

  return new Response('Not found', { status: 404 });
}
